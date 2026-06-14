// netlify/functions/save.js
const { Octokit } = require("@octokit/rest");

exports.handler = async (event) => {
  // Configuración de cabeceras CORS básicas de seguridad
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // En producción idealmente cámbialo por tu dominio principal
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  // Manejo del preflight de CORS (necesario si se invoca desde edit.astro en producción)
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    // 1. Extraemos los parámetros dinámicos del usuario autenticado vía OAuth
    const { lang, resumeData, owner, repo, token } = JSON.parse(event.body);
    
    // 2. Validaciones estrictas de presencia y formato
    if (!lang || !resumeData || !owner || !repo || !token) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Faltan parámetros obligatorios de sesión o datos." }) };
    }

    if (!['es', 'it', 'en'].includes(lang)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Idioma no soportado por el sistema." }) };
    }

    // 3. Sanitización contra Path Traversal / Expresiones Regulares para validar inputs de GitHub
    // El nombre de usuario y repositorio de Github solo permiten alfanuméricos, guiones y puntos.
    const githubNameRegex = /^[a-zA-Z0-9-._]+$/;
    if (!githubNameRegex.test(owner) || !githubNameRegex.test(repo)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Formato de propietario o repositorio inválido." }) };
    }

    // 4. Validación estructural mínima de seguridad del JSON Resume
    // Evitamos que guarden un JSON vacío o una estructura rota que tumbe el build en pnpm
    if (typeof resumeData !== 'object' || !resumeData.basics) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "El formato de los datos no cumple con el estándar JSON Resume." }) };
    }

    // Construimos la ruta estricta. Al estar hardcodeada la carpeta y la extensión, es imposible un Path Traversal
    const path = `src/data/resume.${lang}.json`;

    // 5. Instanciamos Octokit con el token dinámico de GitHub del usuario en sesión
    const octokit = new Octokit({ auth: token });

    // 6. Obtener el SHA del archivo actual si ya existe en el repositorio del usuario
    let sha;
    try {
      const { data } = await octokit.repos.getContent({ owner, repo, path });
      // Si data es un array (caso raro de un directorio), no procesamos el SHA
      if (!Array.isArray(data)) {
        sha = data.sha;
      }
    } catch (e) {
      // Código de error 404 significa que el archivo es nuevo (primera edición), ignoramos el error de manera segura
      if (e.status !== 404) {
        console.error("Error consultando contenido en GitHub:", e);
        throw e;
      }
    }

    // 7. Subir el archivo formateado directo al repositorio del usuario de forma aislada
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `Formulario No-Code: Actualizado CV en idioma [${lang.toUpperCase()}]`,
      // Formateamos con un espaciado limpio de 2 espacios e inyectamos en Base64 de forma segura
      content: Buffer.from(JSON.stringify(resumeData, null, 2)).toString("base64"),
      sha
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        message: `¡Éxito! Tu archivo resume.${lang}.json ha sido actualizado y guardado de manera soberana en tu repositorio.` 
      })
    };

  } catch (error) {
    console.error("Error crítico en la Netlify Function de guardado:", error);
    
    // Tratamiento de errores específicos de tokens de GitHub expirados o revocados
    if (error.status === 401 || error.status === 403) {
      return {
        statusCode: error.status,
        headers,
        body: JSON.stringify({ error: "Tu sesión de GitHub ha expirado o no tienes permisos en este repositorio. Por favor, reautentícate." })
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Error interno del servidor al procesar la actualización con GitHub." })
    };
  }
};