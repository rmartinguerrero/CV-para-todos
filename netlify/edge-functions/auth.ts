// netlify/edge-functions/auth.ts

// 1. Añadimos este comentario especial arriba del todo. 
// Le dice a VS Code: "Tranquilo, este archivo usa el entorno de Deno, no te asustes por las URLs"
// @ts-types="https://edge.netlify.com"

import type { Context } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  
  if (!code) return context.next();

  try {
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // 2. CORREGIDO: Usamos Deno.env de forma estándar. 
        // Netlify CLI lo mapeará perfectamente con tu archivo .env local
        client_id: Deno.env.get("GITHUB_CLIENT_ID"),
        client_secret: Deno.env.get("GITHUB_CLIENT_SECRET"),
        code: code,
      }),
    });

    const body = await response.json();
    const token = body.access_token;

    if (!token) return new Response("Error al obtener el token", { status: 400 });

    const redirectResponse = Response.redirect(`${url.origin}/admin/index.html`, 302);
    
    redirectResponse.headers.append(
      "Set-Cookie",
      `gh_secure_token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000`
    );

    return redirectResponse;

  } catch (error) {
    return new Response("Error crítico", { status: 500 });
  }
};

export const config = {
  path: "/api/auth/callback"
};