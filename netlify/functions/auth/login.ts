// netlify/functions/auth/login.ts
/**
 * /api/auth/login
 * 
 * Redirige al usuario a la página de autorización de GitHub.
 * El usuario verá el flujo de consentimiento de GitHub y será redirigido de vuelta a callback.
 */

interface LoginRequest {
  redirectUri?: string;
}

export const handler = async (event: any) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    // Validar variables de entorno necesarias
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    const redirectUri = process.env.GITHUB_REDIRECT_URI || `${process.env.DEPLOY_URL || 'http://localhost:3000'}/api/auth/callback`;

    if (!clientId || !clientSecret) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Configuración de GitHub OAuth no completada en el servidor." })
      };
    }

    // Generar state aleatorio para CSRF protection
    const state = Buffer.from(Math.random().toString()).toString('base64').slice(0, 32);

    // Guardar state en cookies (será validado en callback)
    const stateCookie = `github_oauth_state=${state}; Max-Age=600; Path=/; HttpOnly; Secure; SameSite=Lax`;

    // Construir URL de autorización de GitHub
    const scope = ['repo', 'user:email']; // Permisos necesarios
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope.join(' '))}&state=${state}`;

    return {
      statusCode: 302,
      headers: {
        ...headers,
        "Location": githubAuthUrl,
        "Set-Cookie": stateCookie
      },
      body: ""
    };

  } catch (error) {
    console.error("Error en /api/auth/login:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Error al iniciar el flujo de autenticación." })
    };
  }
};
