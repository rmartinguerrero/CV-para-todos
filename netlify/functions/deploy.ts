// netlify/functions/deploy.ts
/**
 * /api/deploy
 * 
 * Endpoint principal para:
 * 1. Hacer fork automático del repositorio base al usuario
 * 2. Guardar/actualizar archivos resume.[lang].json
 * 3. Activar GitHub Pages
 * 
 * Método: POST
 * Body: {
 *   langs: ['es', 'it', 'en'],  // Idiomas a publicar
 *   resumeData: { ... },         // JSON Resume estructura
 *   sourceRepo: 'owner/repo'     // Repositorio base a hacer fork (ej: usuario/cv-para-todos)
 * }
 */

import { Octokit } from "@octokit/rest";

interface DeployRequest {
  langs: string[];
  resumeData: any;
  sourceRepo?: string;
}

interface GithubRepo {
  owner: string;
  repo: string;
}

const BASE_REPO = process.env.BASE_REPO || 'rmartinguerrero/CV-para-todos'; // Repositorio base configurable

export const handler = async (event: any) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Solo se permite POST" })
    };
  }

  try {
    // Extraer token del usuario de las cookies
    const cookies = event.headers.cookie ? event.headers.cookie.split(';').reduce((acc: any, cookie: string) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {}) : {};

    const userToken = cookies.github_token;
    const username = cookies.github_user;

    if (!userToken || !username) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: "No autenticado. Debe conectar GitHub primero." })
      };
    }

    // Parsear el cuerpo de la solicitud
    const body: DeployRequest = JSON.parse(event.body || '{}');
    const sourceRepoValue = (body.sourceRepo || BASE_REPO || '').trim();
    const { langs = ['es'], resumeData } = body;

    if (!sourceRepoValue || !sourceRepoValue.includes('/')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Repositorio base inválido. Ajusta BASE_REPO o sourceRepo a 'owner/repo'." })
      };
    }

    // Validaciones básicas
    if (!Array.isArray(langs) || langs.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Debe especificar al menos un idioma." })
      };
    }

    if (!resumeData || typeof resumeData !== 'object') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Datos de CV inválidos." })
      };
    }

    // Validar que el resume tenga la estructura básica
    if (!resumeData.basics || !resumeData.basics.name) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "El CV debe tener al menos basics.name." })
      };
    }

    // Instanciar Octokit con el token del usuario
    const octokit = new Octokit({ auth: userToken });

    // Paso 1: Obtener el repositorio base a hacer fork
    const [baseOwner, baseRepoName] = sourceRepoValue.split('/');
    let userRepoName = baseRepoName; // Nombre del fork en el usuario

    let forkRepo: GithubRepo | null = null;

    // Paso 2: Verificar si ya existe un fork en la cuenta del usuario
    try {
      const existingRepo = await octokit.repos.get({
        owner: username,
        repo: userRepoName
      });

      if (existingRepo.data) {
        forkRepo = { owner: username, repo: userRepoName };
      }
    } catch (e) {
      // Si no existe, crearemos un fork
      if ((e as any).status !== 404) {
        throw e;
      }
    }

    // Paso 3: Si no existe fork, crearlo
    if (!forkRepo) {
      console.log(`Creando fork de ${sourceRepoValue} para usuario ${username}...`);
      
      try {
        const forkResponse = await octokit.repos.createFork({
          owner: baseOwner,
          repo: baseRepoName
        });

        // Esperar a que GitHub procese el fork
        await new Promise(resolve => setTimeout(resolve, 2000));

        forkRepo = {
          owner: username,
          repo: forkResponse.data.name
        };
      } catch (forkError: any) {
        console.error("Error al crear fork:", forkError);

        if (forkError.status === 404) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({
              error: `No se encontró el repositorio base ${sourceRepoValue}. Verifica BASE_REPO o sourceRepo.`
            })
          };
        }

        // Si el fork ya existe pero no lo pudimos detectar, intentar usar el que existe
        if (forkError.message?.includes('already exists')) {
          forkRepo = { owner: username, repo: userRepoName };
        } else {
          throw forkError;
        }
      }
    }

    if (!forkRepo) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "No se pudo crear o acceder al fork del repositorio." })
      };
    }

    console.log(`Usando repositorio: ${forkRepo.owner}/${forkRepo.repo}`);

    // Paso 4: Actualizar archivos resume para cada idioma
    const updatePromises = langs.map(async (lang: string) => {
      const path = `src/data/resume.${lang}.json`;
      const fileContent = JSON.stringify(resumeData, null, 2);
      const base64Content = Buffer.from(fileContent).toString('base64');

      try {
        // Intentar obtener el SHA del archivo actual
        let sha: string | undefined;
        try {
          const existing = await octokit.repos.getContent({
            owner: forkRepo!.owner,
            repo: forkRepo!.repo,
            path
          });
          if (!Array.isArray(existing.data) && 'sha' in existing.data) {
            sha = existing.data.sha;
          }
        } catch (e) {
          // Archivo no existe aún, es ok
        }

        // Crear o actualizar archivo
        await octokit.repos.createOrUpdateFileContents({
          owner: forkRepo!.owner,
          repo: forkRepo!.repo,
          path,
          message: `CV para Todos: Actualizado resume.${lang}.json [Auto-sync desde editor]`,
          content: base64Content,
          sha
        });

        return { lang, success: true };
      } catch (err: any) {
        console.error(`Error actualizando resume.${lang}.json:`, err);
        return { lang, success: false, error: err.message };
      }
    });

    const updateResults = await Promise.all(updatePromises);

    // Verificar que al menos uno fue exitoso
    const hasSuccess = updateResults.some(r => r.success);
    if (!hasSuccess) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "No se pudieron guardar los datos del CV.", details: updateResults })
      };
    }

    // Paso 5: Activar GitHub Pages (rama main o gh-pages)
    try {
      // Configurar GitHub Pages para servir desde dist/ (o la rama que genere Astro)
      await octokit.repos.createPagesDeployment({
        owner: forkRepo.owner,
        repo: forkRepo.repo,
        pages_build_id: undefined,
        artifact_id: undefined,
        oidc_token: undefined,
      } as any);
    } catch (pagesErr: any) {
      // Es posible que GitHub Pages ya esté configurado, no es crítico
      console.warn("No se pudo configurar Pages (podría estar ya configurado):", pagesErr.message);
    }

    // Intentar configurar usando la alternativa de settings
    try {
      await octokit.repos.update({
        owner: forkRepo.owner,
        repo: forkRepo.repo,
        has_pages: true
      } as any);
    } catch (settingsErr: any) {
      console.warn("No se pudieron actualizar settings de Pages:", settingsErr.message);
    }

    const pagePath = forkRepo.repo === `${forkRepo.owner}.github.io` ? '' : `${forkRepo.repo}/`;

    // Retornar éxito
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `¡Éxito! Tu CV ha sido guardado en https://github.com/${forkRepo.owner}/${forkRepo.repo}`,
        repository: `${forkRepo.owner}/${forkRepo.repo}`,
        webUrl: `https://${forkRepo.owner}.github.io/${pagePath}`,
        updateResults
      })
    };

  } catch (error: any) {
    console.error("Error crítico en /api/deploy:", error);

    if (error.status === 401 || error.status === 403) {
      return {
        statusCode: error.status,
        headers,
        body: JSON.stringify({ error: "Tu sesión de GitHub ha expirado o no tienes permisos. Por favor, reautentica." })
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || "Error al procesar el despliegue." })
    };
  }
};
