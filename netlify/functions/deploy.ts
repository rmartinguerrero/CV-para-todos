// netlify/functions/deploy.ts
/**
 * /api/deploy
 *
 * Endpoint principal para:
 * 1. Crear o actualizar un repositorio Astro mínimo en la cuenta del usuario.
 * 2. Escribir solo archivos mínimos para generar una web funcional en GitHub Pages.
 * 3. Incluir únicamente los JSON de idiomas completados y la foto subida.
 */

/// <reference lib="es2022" />
import { Octokit } from "@octokit/rest";
import * as path from "path";

// Evitar errores de tipado en el entorno TS del editor (process/Buffer son globals en Node)
declare const process: any;
declare const Buffer: any;

interface DeployRequest {
  langs?: string[];
  resumeData?: any;
  resumeDataByLang?: Record<string, any>;
  template?: string;
}

interface GithubRepo {
  owner: string;
  repo: string;
}

const PUBLISHED_REPO_NAME = process.env.PUBLISHED_REPO_NAME || 'cv-para-todos';
const DEFAULT_TEMPLATE = 'minimalist';
const SUPPORTED_LANGS = ['es', 'it', 'en'];

function parseDataUrl(dataUrl: string) {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/.exec(dataUrl);
  if (!match) return null;
  const mime = match[1];
  const base64 = match[2];
  const ext = mime === 'image/jpeg' ? 'jpg' : mime.split('/')[1] || 'jpg';
  return { ext, buffer: Buffer.from(base64, 'base64') };
}

function buildPackageJson() {
  return JSON.stringify({
    name: 'cv-para-todos',
    private: false,
    type: 'module',
    scripts: {
      dev: 'astro dev',
      build: 'astro build',
      preview: 'astro preview'
    },
    dependencies: {
      astro: '^4.9.0'
    }
  }, null, 2);
}

function buildAstroConfig() {
  return `import { defineConfig } from 'astro/config';\n\nexport default defineConfig();\n`;
}

function buildIndexAstro() {
  return '---\n'
    + 'import SelectedLayout from \'../layouts/SelectedLayout.astro\';\n\n'
    + 'const modules = import.meta.glob(\'../data/resume.*.json\', { eager: true, as: \'json\' });\n'
    + 'const resumes = Object.fromEntries(\n'
    + '  Object.entries(modules).map(([filePath, data]) => {\n'
    + '    const match = filePath.match(/resume\\.([a-z]{2})\\.json$/);\n'
    + '    const lang = match ? match[1] : \'es\';\n'
    + '    return [lang, data];\n'
    + '  })\n'
    + ');\n\n'
    + 'const availableLangs = Object.keys(resumes).sort();\n'
    + 'const url = new URL(Astro.request.url);\n'
    + 'const currentLang = availableLangs.includes(url.searchParams.get(\'lang\'))\n'
    + '  ? url.searchParams.get(\'lang\')\n'
    + '  : availableLangs[0] || \'es\';\n'
    + 'const resume = resumes[currentLang] || resumes[availableLangs[0]] || {};\n'
    + '---\n'
    + '<!DOCTYPE html>\n'
    + '<html lang={currentLang}>\n'
    + '  <head>\n'
    + '    <meta charset=\"UTF-8\" />\n'
    + '    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n'
    + '    <title>{resume?.basics?.name ? `\${resume.basics.name} — \${resume.basics.label || \'CV\'}` : \'CV\'}</title>\n'
    + '    <meta name=\"description\" content={resume?.basics?.summary || \'Curriculum Vitae\'} />\n'
    + '  </head>\n'
    + '  <body>\n'
    + '    <SelectedLayout resume={resume} availableLangs={availableLangs} currentLang={currentLang} />\n'
    + '  </body>\n'
    + '</html>\n';
}

function buildSelectedLayoutAstro(templateId: string) {
  const themeStyles = {
    minimalist: `body { background: #f8fafc; color: #111827; font-family: Inter, system-ui, sans-serif; }
      .page { max-width: 900px; margin: 0 auto; padding: 3rem 1.5rem; }
      .panel { background: white; border: 1px solid #e5e7eb; border-radius: 1.25rem; box-shadow: 0 24px 80px rgba(15,23,42,.06); }
      .accent { color: #2563eb; }
      .tag { display: inline-flex; gap: .5rem; padding: .5rem 1rem; background: #eff6ff; border-radius: 9999px; font-size: .8rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
      .section-title { color: #111827; font-size: 1rem; letter-spacing: .12em; text-transform: uppercase; margin-bottom: 1rem; }
      .profile-image { width: 128px; height: 128px; object-fit: cover; border-radius: 1rem; border: 1px solid #e5e7eb; }`,
    techy: `body { background: #0f172a; color: #e2e8f0; font-family: Inter, system-ui, sans-serif; }
      .page { max-width: 1000px; margin: 0 auto; padding: 3rem 1.5rem; }
      .panel { background: rgba(15,23,42,0.96); border: 1px solid rgba(148,163,184,0.18); border-radius: 1.5rem; box-shadow: 0 30px 80px rgba(15,23,42,.3); }
      .accent { color: #38bdf8; }
      .tag { display: inline-flex; gap: .5rem; padding: .5rem 1rem; background: rgba(56,189,248,.12); border-radius: 9999px; font-size: .75rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #c7d2fe; }
      .section-title { color: #cbd5e1; font-size: 1rem; letter-spacing: .12em; text-transform: uppercase; margin-bottom: 1rem; }
      .profile-image { width: 128px; height: 128px; object-fit: cover; border-radius: 1rem; border: 1px solid rgba(148,163,184,.2); }`,
    artistic: `body { background: #fdf2e9; color: #17212b; font-family: Inter, system-ui, sans-serif; }
      .page { max-width: 900px; margin: 0 auto; padding: 3rem 1.5rem; }
      .panel { background: #ffffff; border: 1px solid #f1e4d3; border-radius: 1.75rem; box-shadow: 0 25px 90px rgba(15,23,42,.08); }
      .accent { color: #d97706; }
      .tag { display: inline-flex; gap: .5rem; padding: .5rem 1rem; background: #fff7ed; border-radius: 9999px; font-size: .8rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #92400e; }
      .section-title { color: #7c2d12; font-size: 1rem; letter-spacing: .12em; text-transform: uppercase; margin-bottom: 1rem; }
      .profile-image { width: 128px; height: 128px; object-fit: cover; border-radius: 1.5rem; border: 1px solid #fde2b6; }`
  };

  const styles = themeStyles[templateId] || themeStyles.minimalist;

  return `---
const { resume, availableLangs, currentLang } = Astro.props;
const profileImage = resume?.basics?.image || '/profile.jpg';
const hasImage = !!resume?.basics?.image;
function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short' }).format(date);
  } catch {
    return dateString;
  }
}
---
<!DOCTYPE html>
<html lang={currentLang}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{resume?.basics?.name ? \`\${resume.basics.name} — \${resume.basics?.label || 'CV'}\` : 'Curriculum Vitae'}</title>
  </head>
  <body>
    <div class="page">
      <div class="panel">
        <header style="display:flex;flex-wrap:wrap;gap:1.5rem;align-items:flex-start;justify-content:space-between;">
          <div style="flex:1;min-width:220px;">
            <p class="tag">{resume?.basics?.label || 'Curriculum Vitae'}</p>
            <h1 style="font-size:clamp(2rem,3vw,3rem);margin:.75rem 0 .5rem;line-height:1.05;">{resume?.basics?.name || 'Your Name'}</h1>
            <p style="max-width:40rem;line-height:1.8;color:inherit;opacity:.9;">{resume?.basics?.summary || 'This CV was generated automatically.'}</p>
            <div style="display:grid;gap:.75rem;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));margin-top:1.5rem;">
              {resume?.basics?.email ? <div><strong>Email</strong><br />{resume.basics.email}</div> : null}
              {resume?.basics?.phone ? <div><strong>Phone</strong><br />{resume.basics.phone}</div> : null}
              {resume?.basics?.web ? <div><strong>Website</strong><br /><a href={resume.basics.web} target="_blank" rel="noreferrer noopener">{resume.basics.web}</a></div> : null}
            </div>
          </div>
          {hasImage ? <img class="profile-image" src={profileImage} alt="Profile photo" loading="lazy" /> : null}
        </header>

        <nav style="display:flex;flex-wrap:wrap;gap:.75rem;margin:2rem 0 1rem;">
          {availableLangs.map((lang) => (
            <a href={\`/?lang=\${lang}\`} style={\`padding:.65rem 1rem;border-radius:9999px;text-decoration:none;font-weight:700;color:\${lang === currentLang ? '#ffffff' : 'inherit'};background:\${lang === currentLang ? '#2563eb' : 'rgba(0,0,0,.06)'};\`}>
              {lang.toUpperCase()}
            </a>
          ))}
        </nav>

        <main style="display:grid;gap:2rem;">
          {resume?.work?.length ? (
            <section>
              <h2 class="section-title">Work Experience</h2>
              <div style="display:grid;gap:1.25rem;">
                {resume.work.map((item) => (
                  <article style="padding:1.25rem;border:1px solid rgba(148,163,184,.16);border-radius:1rem;">
                    <div style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;">
                      <strong>{item.position || item.name}</strong>
                      <span style="color:inherit;opacity:.75;">{formatDate(item.startDate)} – {item.endDate ? formatDate(item.endDate) : 'Present'}</span>
                    </div>
                    <div style="margin-top:.5rem;color:inherit;opacity:.85;">{item.name || ''}</div>
                    <p style="margin-top:.75rem;line-height:1.8;white-space:pre-line;">{item.summary || ''}</p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {resume?.education?.length ? (
            <section>
              <h2 class="section-title">Education</h2>
              <div style="display:grid;gap:1.25rem;">
                {resume.education.map((item) => (
                  <article style="padding:1.25rem;border:1px solid rgba(148,163,184,.16);border-radius:1rem;">
                    <div style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;">
                      <strong>{item.area || ''}</strong>
                      <span style="opacity:.75;">{formatDate(item.startDate)} – {item.endDate ? formatDate(item.endDate) : 'Present'}</span>
                    </div>
                    <p style="margin-top:.75rem;color:inherit;opacity:.85;">{item.institution || ''}</p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {resume?.skills?.length ? (
            <section>
              <h2 class="section-title">Skills</h2>
              <div style="display:flex;flex-wrap:wrap;gap:.6rem;">
                {resume.skills.map((skill) => skill?.name ? <span class="tag">{skill.name}</span> : null)}
              </div>
            </section>
          ) : null}

          {resume?.projects?.length ? (
            <section>
              <h2 class="section-title">Projects</h2>
              <div style="display:grid;gap:1.25rem;">
                {resume.projects.map((project) => (
                  <article style="padding:1.25rem;border:1px solid rgba(148,163,184,.16);border-radius:1rem;">
                    <div style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;">
                      <strong>{project.name || ''}</strong>
                      <span style="opacity:.75;">{project.startDate ? formatDate(project.startDate) : ''}</span>
                    </div>
                    <p style="margin-top:.75rem;line-height:1.8;">{project.summary || ''}</p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {resume?.certificates?.length || resume?.languages?.length ? (
            <section style="display:grid;gap:1.5rem;">
              {resume?.certificates?.length ? (
                <div>
                  <h2 class="section-title">Certificates</h2>
                  <ul style="display:grid;gap:.8rem;list-style:none;padding:0;margin:0;">
                    {resume.certificates.map((item) => (
                      <li style="padding:.95rem;border:1px solid rgba(148,163,184,.16);border-radius:1rem;">
                        <div style="font-weight:700;">{item.name || ''}</div>
                        <div style="opacity:.75;">{item.issuer || ''} • {item.date || ''}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {resume?.languages?.length ? (
                <div>
                  <h2 class="section-title">Languages</h2>
                  <ul style="display:grid;gap:.6rem;list-style:none;padding:0;margin:0;">
                    {resume.languages.map((item) => (
                      <li style="display:flex;justify-content:space-between;gap:1rem;padding:.95rem;border:1px solid rgba(148,163,184,.16);border-radius:1rem;">
                        <span>{item.language || ''}</span>
                        <strong style="opacity:.85;">{item.fluency || ''}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          ) : null}
        </main>
      </div>
    </div>
  </body>
</html>

<style is:global>
  ${styles}
  a { color: inherit; text-decoration: none; }
  a:hover { opacity: .85; }
  h1, h2, strong { font-family: Inter, system-ui, sans-serif; }
  img { display: block; }
</style>
`;
}

function buildGhPagesWorkflow() {
  return `name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install

      - name: Build Astro site
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          publish_branch: gh-pages
          commit_message: 'Deploy static site from GitHub Actions'
          clean: true
`;
}

async function createOrUpdateFile(octokit: Octokit, owner: string, repo: string, filePath: string, content: string | Buffer, message: string) {
  const base64 = typeof content === 'string' ? Buffer.from(content).toString('base64') : content.toString('base64');
  let sha: string | undefined;
  try {
    const response = await octokit.repos.getContent({ owner, repo, path: filePath });
    if (!Array.isArray(response.data) && 'sha' in response.data) {
      sha = response.data.sha;
    }
  } catch (error: any) {
    if (error.status !== 404) {
      throw error;
    }
  }

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: filePath,
    message,
    content: base64,
    sha
  } as any);
}

async function listRepoFiles(octokit: Octokit, owner: string, repo: string, dir = ''): Promise<string[]> {
  const result: string[] = [];
  try {
    const response = await octokit.repos.getContent({ owner, repo, path: dir || '.' });
    if (Array.isArray(response.data)) {
      for (const item of response.data) {
        if (item.type === 'file') {
          result.push(item.path);
        } else if (item.type === 'dir') {
          const nested = await listRepoFiles(octokit, owner, repo, item.path);
          result.push(...nested);
        }
      }
    } else if (response.data.type === 'file') {
      result.push(response.data.path);
    }
  } catch (error: any) {
    if (error.status !== 404) {
      throw error;
    }
  }
  return result;
}

async function deleteFileIfNeeded(octokit: Octokit, owner: string, repo: string, filePath: string) {
  try {
    const existing = await octokit.repos.getContent({ owner, repo, path: filePath });
    if (!Array.isArray(existing.data) && 'sha' in existing.data) {
      await octokit.repos.deleteFile({ owner, repo, path: filePath, message: `Removing obsolete file ${filePath}`, sha: existing.data.sha });
    }
  } catch (error: any) {
    if (error.status !== 404) {
      console.warn(`No se pudo eliminar ${filePath}:`, error.message || error);
    }
  }
}

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

    const body: DeployRequest = JSON.parse(event.body || '{}');
    const rawResumeByLang = body.resumeDataByLang || {};
    const template = (body.template || DEFAULT_TEMPLATE).toLowerCase();
    const langs = Array.isArray(body.langs) && body.langs.length > 0 ? body.langs : Object.keys(rawResumeByLang);

    const resumeByLang: Record<string, any> = { ...rawResumeByLang };
    if (body.resumeData && typeof body.resumeData === 'object') {
      if (!body.langs || body.langs.length === 0) {
        langs.push('es');
      }
      langs.forEach((lang) => {
        if (!resumeByLang[lang]) {
          resumeByLang[lang] = body.resumeData;
        }
      });
    }

    const filteredLangs = (langs || [])
      .filter(lang => SUPPORTED_LANGS.includes(lang))
      .filter((lang, index, self) => self.indexOf(lang) === index)
      .filter(lang => resumeByLang[lang] && resumeByLang[lang].basics && resumeByLang[lang].basics.name?.trim());

    if (filteredLangs.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No hay datos válidos de CV para publicar.' })
      };
    }

    // Usar un único repositorio llamado cv-para-todos en la cuenta del usuario
    const repoName = PUBLISHED_REPO_NAME;
    const octokit = new Octokit({ auth: userToken });
    let targetRepo: GithubRepo;

    try {
      await octokit.repos.get({ owner: username, repo: repoName });
      targetRepo = { owner: username, repo: repoName };
    } catch (repoError: any) {
      if (repoError.status === 404) {
        const created = await octokit.repos.createForAuthenticatedUser({
          name: repoName,
          description: 'CV para Todos - repositorio minimal desplegado en GitHub Pages',
          private: false,
          auto_init: false
        } as any);
        targetRepo = { owner: username, repo: created.data.name };
      } else {
        throw repoError;
      }
    }

    const imagePath = '/profile';
    let profileFileName: string | null = null;
    let profileFileBuffer: Buffer | null = null;

    for (const lang of filteredLangs) {
      const resume = resumeByLang[lang];
      const imageValue = resume?.basics?.image;
      if (!profileFileBuffer && typeof imageValue === 'string' && imageValue.startsWith('data:')) {
        const parsed = parseDataUrl(imageValue);
        if (parsed) {
          profileFileName = `${imagePath}.${parsed.ext}`;
          profileFileBuffer = parsed.buffer;
        }
      }
    }

    if (profileFileName) {
      filteredLangs.forEach((lang) => {
        if (resumeByLang[lang]?.basics) {
          resumeByLang[lang].basics.image = `/${path.basename(profileFileName)}`;
        }
      });
    }

    const allowedFiles = new Set<string>([
      'package.json',
      'astro.config.mjs',
      '.github/workflows/deploy.yml',
      'src/pages/index.astro',
      'src/layouts/SelectedLayout.astro'
    ]);
    filteredLangs.forEach(lang => allowedFiles.add(`src/data/resume.${lang}.json`));
    if (profileFileName) {
      allowedFiles.add(`public/${path.basename(profileFileName)}`);
    }

    const allFiles = await listRepoFiles(octokit, username, repoName);
    for (const file of allFiles) {
      if (!allowedFiles.has(file)) {
        await deleteFileIfNeeded(octokit, username, repoName, file);
      }
    }

    await createOrUpdateFile(octokit, username, repoName, 'package.json', buildPackageJson(), 'Publish CV: package.json');
    await createOrUpdateFile(octokit, username, repoName, 'astro.config.mjs', buildAstroConfig(), 'Publish CV: astro.config.mjs');
    await createOrUpdateFile(octokit, username, repoName, '.github/workflows/deploy.yml', buildGhPagesWorkflow(), 'Publish CV: GitHub Pages workflow');
    await createOrUpdateFile(octokit, username, repoName, 'src/pages/index.astro', buildIndexAstro(), 'Publish CV: index.astro');
    await createOrUpdateFile(octokit, username, repoName, 'src/layouts/SelectedLayout.astro', buildSelectedLayoutAstro(template), 'Publish CV: SelectedLayout');

    if (profileFileBuffer && profileFileName) {
      await createOrUpdateFile(octokit, username, repoName, `public/${path.basename(profileFileName)}`, profileFileBuffer, 'Publish CV: profile image');
    }

    const results = [];
    for (const lang of filteredLangs) {
      const resumeData = resumeByLang[lang];
      const content = JSON.stringify(resumeData, null, 2);
      await createOrUpdateFile(octokit, username, repoName, `src/data/resume.${lang}.json`, content, `Publish CV: resume.${lang}.json`);
      results.push({ lang, success: true });
    }

    const repoUrl = `https://github.com/${username}/${repoName}`;
    const pagePath = repoName === `${username}.github.io` ? '' : `${repoName}/`;
    const webUrl = `https://${username}.github.io/${pagePath}`;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `¡Éxito! Tu CV ha sido publicado en ${repoUrl}`,
        repository: `${username}/${repoName}`,
        webUrl,
        results
      })
    };
  } catch (error: any) {
    console.error('Error crítico en /api/deploy:', error);
    if (error.status === 401 || error.status === 403) {
      return {
        statusCode: error.status,
        headers,
        body: JSON.stringify({ error: 'Tu sesión de GitHub ha expirado o no tienes permisos. Por favor, reautentica.' })
      };
    }
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Error al procesar el despliegue.' })
    };
  }
};
