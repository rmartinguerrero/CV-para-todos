import { Octokit } from '@octokit/rest';
import { corsHeaders } from "./_shared/cors.js";

const parseCookies = (cookieHeader: string | undefined) => {
  if (!cookieHeader) return {};
  return cookieHeader.split(';').reduce((acc: any, cookie: string) => {
    const [key, ...valueParts] = cookie.trim().split('=');
    acc[key] = valueParts.join('=');
    return acc;
  }, {});
};

const buildCookie = (name: string, value: string, secure: boolean) => {
  const options = [
    `Max-Age=31536000`,
    'Path=/',
    'SameSite=Lax'
  ];

  if (name === 'github_token') {
    options.push('HttpOnly');
  }

  if (secure) {
    options.push('Secure');
  }

  return `${name}=${value}; ${options.join('; ')}`;
};

const getRequestOrigin = (event: any) => {
  const proto = event.headers['x-forwarded-proto'] || event.headers['X-Forwarded-Proto'] || 'http';
  const host = event.headers.host || 'localhost:8888';
  return `${proto}://${host}`;
};

const isLocalDev = (event: any) => {
  const host = event.headers.host || '';
  return process.env.NETLIFY_DEV === 'true' || host.includes('localhost') || host.includes('127.0.0.1');
};

export const handler = async (event: any) => {
  const headers = corsHeaders('GET, OPTIONS');

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { code, state } = event.queryStringParameters || {};

    if (!code || !state) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Faltan parámetros 'code' o 'state'." })
      };
    }

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'GitHub OAuth no está configurado correctamente en el servidor.' })
      };
    }

    const useLocalRedirect = isLocalDev(event);
    const expectedRedirectUri = !useLocalRedirect && process.env.GITHUB_REDIRECT_URI
      ? process.env.GITHUB_REDIRECT_URI
      : `${getRequestOrigin(event)}/.netlify/functions/auth-callback`;

    const cookies = parseCookies(event.headers.cookie);
    const savedState = cookies.github_oauth_state;

    if (!savedState || savedState !== state) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'Validación de CSRF falló. Estado inválido.' })
      };
    }

    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: expectedRedirectUri,
        state
      })
    });

    if (!tokenResponse.ok) {
      throw new Error(`GitHub token exchange failed: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No se pudo obtener el token de acceso de GitHub.' })
      };
    }

    const octokit = new Octokit({ auth: tokenData.access_token });
    const userResponse = await octokit.users.getAuthenticated();

    if (!userResponse.data) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'No se pudo autenticar con el token de GitHub.' })
      };
    }

    const secureCookie = !useLocalRedirect;
    const tokenCookie = buildCookie('github_token', tokenData.access_token, secureCookie);
    const userCookie = buildCookie('github_user', userResponse.data.login, secureCookie);

    const redirectUrl = process.env.DEFAULT_LANG ? `/${process.env.DEFAULT_LANG}/edit` : '/';

    return {
      statusCode: 302,
      headers: {
        ...headers,
        'Location': redirectUrl
      },
      multiValueHeaders: {
        'Set-Cookie': [tokenCookie, userCookie]
      },
      body: ''
    };
  } catch (error) {
    console.error('Error en auth-callback:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Error al completar la autenticación con GitHub.' })
    };
  }
};
