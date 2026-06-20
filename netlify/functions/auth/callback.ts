// netlify/functions/auth/callback.ts
/**
 * /api/auth/callback
 * 
 * Recibe el código temporal de GitHub y lo intercambia por un token de acceso.
 * El token se guarda de forma segura en una cookie HttpOnly.
 */

import { Octokit } from "@octokit/rest";

interface GithubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

export const handler = async (event: any) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    // Extraer parámetros de query
    const { code, state } = event.queryStringParameters || {};

    if (!code || !state) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Faltan parámetros 'code' o 'state'." })
      };
    }

    // Validar variables de entorno
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    const redirectUri = process.env.GITHUB_REDIRECT_URI || `${process.env.DEPLOY_URL || 'http://localhost:3000'}/api/auth/callback`;

    if (!clientId || !clientSecret) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Configuración de GitHub OAuth no completada." })
      };
    }

    // Validar CSRF state (debe coincidir con el enviado en login)
    const cookies = event.headers.cookie ? event.headers.cookie.split(';').reduce((acc: any, cookie: string) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {}) : {};

    const savedState = cookies.github_oauth_state;
    if (!savedState || savedState !== state) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: "Validación de CSRF falló. Estado inválido." })
      };
    }

    // Intercambiar código por token (requiere POST a GitHub)
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        state
      })
    });

    if (!tokenResponse.ok) {
      throw new Error(`GitHub token exchange failed: ${tokenResponse.statusText}`);
    }

    const tokenData: GithubTokenResponse = await tokenResponse.json();

    if (!tokenData.access_token) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "No se pudo obtener el token de acceso de GitHub." })
      };
    }

    // Validar token haciendo una llamada a la API de GitHub
    const octokit = new Octokit({ auth: tokenData.access_token });
    const userResponse = await octokit.users.getAuthenticated();

    if (!userResponse.data) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: "No se pudo autenticar con el token de GitHub." })
      };
    }

    // Crear cookie segura con el token
    const tokenCookie = `github_token=${tokenData.access_token}; Max-Age=31536000; Path=/; HttpOnly; Secure; SameSite=Lax`;
    const userCookie = `github_user=${userResponse.data.login}; Max-Age=31536000; Path=/; Secure; SameSite=Lax`;

    // Redirigir a la página de edición
    const redirectUrl = `/${process.env.DEFAULT_LANG || 'es'}/edit`;

    return {
      statusCode: 302,
      headers: {
        ...headers,
        "Location": redirectUrl
      },
      multiValueHeaders: {
        "Set-Cookie": [tokenCookie, userCookie]
      },
      body: ""
    };

  } catch (error) {
    console.error("Error en /api/auth/callback:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Error al completar la autenticación con GitHub." })
    };
  }
};
