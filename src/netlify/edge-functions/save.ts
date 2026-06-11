import type { Context } from "https://edge.netlify.com";

export default async function handler(request: Request, context: Context) {
  // 1. Solo permitimos peticiones POST (cuando el formulario envía datos)
  if (request.method !== "POST") {
    return new Response("Método no permitido", { status: 405 });
  }

  try {
    // 2. Extraer el token de GitHub de las cookies HttpOnly que guardamos en la autenticación
    const cookies = request.headers.get("cookie") || "";
    const tokenMatch = cookies.match(/gh_token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (!token) {
      return new Response(JSON.stringify({ error: "No autenticado o sesión expirada" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 3. Obtener el JSON del CV y el idioma que nos envía el frontend
    const { lang, resumeData } = await request.json();
    if (!lang || !resumeData) {
      return new Response(JSON.stringify({ error: "Faltan datos requeridos (lang o resumeData)" }), { status: 400 });
    }

    // Nota: Aquí necesitaremos saber el repositorio del usuario. 
    // Podemos obtenerlo dinámicamente consultando el perfil del usuario con el token.
    const userResponse = await fetch("https://api.github.com/user", {
      headers: { Authorization: `token ${token}` }
    });
    const userData = await userResponse.json();
    const username = userData.login;
    
    // Por convención del proyecto, asumimos que el repositorio se llama "cv-para-todos" o el nombre de tu plantilla.
    // Para las pruebas, puedes harcodeas tu repo o recuperarlo si creas una convención. Asumamos "cv-para-todos"
    const repo = "cv-para-todos"; 
    const path = `src/data/resume.${lang}.json`;

    // 4. GitHub requiere el "sha" del archivo existente para poder actualizarlo (hacer un commit)
    let sha = "";
    const fileUrl = `https://api.github.com/repos/${username}/${repo}/contents/${path}`;
    
    const fileCheck = await fetch(fileUrl, {
      headers: { Authorization: `token ${token}` }
    });

    if (fileCheck.status === 200) {
      const fileData = await fileCheck.json();
      sha = fileData.sha;
    }

    // 5. Convertir nuestro JSON nuevo a Base64 (como lo pide la API de GitHub)
    const contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(resumeData, null, 2))));

    // 6. Hacer el Commit en GitHub de forma automática
    const commitResponse = await fetch(fileUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `⚡ cv-update: Actualizado perfil (${lang.toUpperCase()}) desde el panel web`,
        content: contentBase64,
        sha: sha || undefined // Si el archivo no existía, no mandamos sha y GitHub lo crea
      })
    });

    if (!commitResponse.ok) {
      const errorText = await commitResponse.text();
      throw new Error(`Error de GitHub: ${errorText}`);
    }

    return new Response(JSON.stringify({ success: true, message: "¡CV guardado y sincronizado con GitHub!" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export const config = { path: "/api/save" };