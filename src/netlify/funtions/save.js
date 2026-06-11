// netlify/functions/save.js
const { Octokit } = require("@octokit/rest");

exports.handler = async (event) => {
  // Solo permitimos peticiones POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { lang, resumeData } = JSON.parse(event.body);
    
    // Validaciones de seguridad básicas
    if (!lang || !resumeData || !['es', 'it', 'en'].includes(lang)) {
      return { statusCode: 400, body: JSON.stringify({ error: "Datos incorrectos" }) };
    }

    // Usamos las variables de entorno de tu Netlify/GitHub
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const owner = process.env.GITHUB_OWNER; // Tu usuario de GitHub
    const repo = process.env.GITHUB_REPO;   // El nombre de tu repositorio
    const path = `src/data/resume.${lang}.json`;

    // 1. Obtener el SHA del archivo actual si ya existe (necesario para actualizar en GitHub)
    let sha;
    try {
      const { data } = await octokit.repos.getContent({ owner, repo, path });
      sha = data.sha;
    } catch (e) {
      // Si el archivo no existe, no pasa nada, se creará uno nuevo (no tiene SHA)
    }

    // 2. Subir el archivo formateado directo al repositorio
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `Formulario: Actualizado CV en idioma [${lang.toUpperCase()}]`,
      content: Buffer.from(JSON.stringify(resumeData, null, 2)).toString("base64"),
      sha
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: `¡Éxito! resume.${lang}.json actualizado en GitHub.` })
    };

  } catch (error) {
    console.error("Error en Netlify Function:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message })
    };
  }
};