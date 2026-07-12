import { randomUUID } from 'node:crypto';
import { corsHeaders } from "./_shared/cors.js";

const generateState = () => randomUUID();

const buildCookie = (name: string, value: string, secure: boolean) => {
  const options = [
    `Max-Age=${name === 'github_oauth_state' ? 600 : 31536000}`,
    'Path=/',
    'SameSite=Lax',
    'HttpOnly'
  ];

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
    const redirectUri = !useLocalRedirect && process.env.GITHUB_REDIRECT_URI
      ? process.env.GITHUB_REDIRECT_URI
      : `${getRequestOrigin(event)}/.netlify/functions/auth-callback`;

    const state = generateState();
    const stateCookie = buildCookie('github_oauth_state', state, !useLocalRedirect);

    const scope = ['repo', 'user:email'];
    const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
    githubAuthUrl.searchParams.set('client_id', clientId);
    githubAuthUrl.searchParams.set('redirect_uri', redirectUri);
    githubAuthUrl.searchParams.set('scope', scope.join(' '));
    githubAuthUrl.searchParams.set('state', state);

    return {
      statusCode: 302,
      headers: {
        ...headers,
        Location: githubAuthUrl.toString(),
        'Set-Cookie': stateCookie
      },
      body: ''
    };
  } catch (error) {
    console.error('Error en auth-login:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Error al iniciar el flujo de autenticación con GitHub.' })
    };
  }
};
