// netlify/functions/load-resume.ts
/**
 * /api/load-resume
 * 
 * GET endpoint para cargar los datos guardados del usuario
 * Si el usuario está autenticado, intenta cargar su resume.[lang].json
 * desde su fork del repositorio.
 * 
 * Query params:
 *   lang: 'es' | 'it' | 'en'
 */

import { Octokit } from "@octokit/rest";

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

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Solo se permite GET" })
    };
  }

  try {
    // Extraer parámetros
    const { lang = 'es' } = event.queryStringParameters || {};

    if (!['es', 'it', 'en'].includes(lang)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Idioma no soportado. Use: es, it, en" })
      };
    }

    // Extraer token del usuario de las cookies
    const cookies = event.headers.cookie ? event.headers.cookie.split(';').reduce((acc: any, cookie: string) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {}) : {};

    const userToken = cookies.github_token;
    const username = cookies.github_user;

    // Si no está autenticado, retornar vacío (usará datos del localStorage del cliente)
    if (!userToken || !username) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          authenticated: false,
          data: null,
          message: "Usuario no autenticado. Se usarán datos del almacenamiento local."
        })
      };
    }

    // Instanciar Octokit con el token del usuario
    const octokit = new Octokit({ auth: userToken });
    const repoName = process.env.PUBLISHED_REPO_NAME || 'personal-resume';
    const path = `resume.${lang}.json`;

    try {
      // Intentar obtener el archivo del repositorio del usuario
      const response = await octokit.repos.getContent({
        owner: username,
        repo: repoName,
        path
      });

      if (Array.isArray(response.data)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Ruta no es un archivo." })
        };
      }

      // Decodificar contenido base64
      const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
      const resumeData = JSON.parse(content);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          authenticated: true,
          data: resumeData,
          lastUpdated: response.data.updated_at,
          source: `${username}/${repoName}`
        })
      };

    } catch (fileError: any) {
      // Si el archivo no existe, es normal (primera vez)
      if (fileError.status === 404) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            authenticated: true,
            data: null,
            message: "No hay datos guardados aún. Usa localStorage o comienza a editar."
          })
        };
      }

      throw fileError;
    }

  } catch (error: any) {
    console.error("Error en /api/load-resume:", error);

    if (error.status === 401 || error.status === 403) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: "Sesión de GitHub expirada. Por favor, reautentica." })
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || "Error al cargar el CV." })
    };
  }
};
