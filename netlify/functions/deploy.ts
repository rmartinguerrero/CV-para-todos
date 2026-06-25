// netlify/functions/deploy.ts
/**
 * /api/deploy
 *
 * Crea/actualiza un repositorio en la cuenta del usuario con:
 *   - index.html         (redirección por idioma)
 *   - {lang}/index.html  (CV renderizado por idioma)
 *   - style.css          (todos los temas + responsive + print)
 *   - resume.{lang}.json (datos del CV en formato JSON Resume)
 *   - profile.jpg        (foto de perfil)
 *
 * Sin Astro, sin GitHub Actions, sin build — directamente servible por GitHub Pages.
 */

/// <reference lib="es2022" />
import { Octokit } from "@octokit/rest";
<<<<<<< HEAD
import { SECTION_TITLES, escapeHtml, renderCvContent } from "../../src/lib/cv-renderer.js";
import { CV_THEMES_CSS } from "../../src/styles/cv-themes.js";
=======
>>>>>>> parent of 7b9182a (modify: cv-liveVSdeploy-true)

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

const PUBLISHED_REPO_NAME = process.env.PUBLISHED_REPO_NAME || 'personal-resume';
const DEFAULT_TEMPLATE = 'minimalist';
const SUPPORTED_LANGS = ['es', 'it', 'en'];

// CSS importado desde src/styles/cv-themes.ts (single source of truth)

// =========================================================================
// Traducciones de secciones para el deploy (espejo de i18n/ui.ts)
// =========================================================================
const SECTION_TITLES: Record<string, Record<string, string>> = {
  es: {
    experience: 'Experiencia',
    education: 'Formación',
    skills: 'Habilidades',
    projects: 'Proyectos',
    certificates: 'Certificados',
    languages: 'Idiomas',
    profile: 'Perfil',
    present: 'Presente',
    print: 'Imprimir PDF',
  },
  it: {
    experience: 'Esperienza',
    education: 'Formazione',
    skills: 'Competenze',
    projects: 'Progetti',
    certificates: 'Certificati',
    languages: 'Lingue',
    profile: 'Profilo',
    present: 'Presente',
    print: 'Stampa PDF',
  },
  en: {
    experience: 'Experience',
    education: 'Education',
    skills: 'Skills',
    projects: 'Projects',
    certificates: 'Certificates',
    languages: 'Languages',
    profile: 'Profile',
    present: 'Present',
    print: 'Print PDF',
  },
};

// =========================================================================
// Helpers
// =========================================================================
function h(s: string): string {
  if (!s) return '';
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function fmtDate(d: string): string {
  if (!d) return '';
  try {
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? d : dt.toLocaleDateString('en',{year:'numeric',month:'short'});
  } catch { return d; }
}

function dateRange(start: string, end: string | null, present: string): string {
  const f = start ? fmtDate(start.slice(0,7)) : '';
  const t = end ? fmtDate(end.slice(0,7)) : present;
  return f && t ? `${f} — ${t}` : t || f || '';
}

// =========================================================================
// Generadores de HTML
// =========================================================================
function renderRootIndex(langs: string[], basePath: string): string {
  const json = JSON.stringify(langs);
  const fallback = langs[0] || 'en';
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>CV</title>
<script>(function(){var a=${json};var p=(navigator.languages||[navigator.language]).map(function(l){return l.split('-')[0]}).find(function(l){return a.indexOf(l)!==-1})||'${fallback}';window.location.replace('${basePath}/'+p+'/')})()</script>
</head><body><p>Redirecting to <a href="${basePath}/${fallback}/">${basePath}/${fallback}/</a></p></body></html>`;
}

function renderCvPage(resume: any, lang: string, template: string, langs: string[], basePath: string): string {
  const dict = SECTION_TITLES[lang] || SECTION_TITLES.en;
  const b = resume?.basics || {};
  const title = b.name ? `${h(b.name)} — ${h(b.label || 'CV')}` : 'Curriculum Vitae';
  const hasImg = !!b.image;

  // Navbar superior: selector de idiomas + botón imprimir
  const langLinks = langs.map(l =>
    `<a href="${basePath}/${l}/" class="${l===lang?'lang-link lang-link-active':'lang-link lang-link-inactive'}">${l.toUpperCase()}</a>`
  ).join('\n');
  const topNav = `<nav class="top-nav"><div class="top-nav-langs">${langLinks}</div><button class="top-nav-print" onclick="window.print()">${h(dict.print)}</button></nav>`;

  // Contacto: <ul> con <li>, sin emojis (coincide con Header.astro)
  const contactUrl = b.url || '';
  const contacts: string[] = [];
  if (b.email) contacts.push(`<li><a href="mailto:${h(b.email)}">${h(b.email)}</a></li>`);
  if (b.phone) contacts.push(`<li><a href="tel:${h(b.phone)}">${h(b.phone)}</a></li>`);
  if (contactUrl) contacts.push(`<li><a href="${h(contactUrl)}" target="_blank" rel="noopener noreferrer">${h(contactUrl)}</a></li>`);

  let workHtml = '';
  if (resume.work?.length) {
    const items = resume.work.filter((w:any)=>w.name).map((w:any) =>
      `<article class="card"><div class="card-header"><strong class="card-title">${h(w.position||w.name)}</strong><span class="card-date">${dateRange(w.startDate,w.endDate,dict.present)}</span></div><div style="margin-top:.75rem;opacity:.85">${h(w.name)}</div>${w.summary?`<p class="card-body">${h(w.summary)}</p>`:''}</article>`
    ).join('\n');
    workHtml = `<section><h2 class="section-title">${h(dict.experience)}</h2><div class="cards-grid">${items}</div></section>`;
  }

  let eduHtml = '';
  if (resume.education?.length) {
    const items = resume.education.filter((e:any)=>e.institution).map((e:any) =>
      `<article class="card"><div class="card-header"><strong class="card-title">${h(e.area||'')}</strong><span class="card-date">${dateRange(e.startDate,e.endDate,dict.present)}</span></div><p style="margin-top:.75rem">${h(e.institution)}</p></article>`
    ).join('\n');
    eduHtml = `<section><h2 class="section-title">${h(dict.education)}</h2><div class="cards-grid">${items}</div></section>`;
  }

  let skillsHtml = '';
  if (resume.skills?.length) {
    const tags = resume.skills.filter((s:any)=>s.name).map((s:any)=>`<span class="tag">${h(s.name)}</span>`).join('\n');
    skillsHtml = `<section><h2 class="section-title">${h(dict.skills)}</h2><div class="skills-wrap">${tags}</div></section>`;
  }

  let projHtml = '';
  if (resume.projects?.length) {
    const items = resume.projects.filter((p:any)=>p.name).map((p:any) =>
      `<article class="card"><div class="card-header"><strong class="card-title">${h(p.name)}</strong>${p.startDate?`<span class="card-date">${fmtDate(p.startDate)}</span>`:''}</div>${p.description?`<p class="card-body">${h(p.description)}</p>`:''}</article>`
    ).join('\n');
    projHtml = `<section><h2 class="section-title">${h(dict.projects)}</h2><div class="cards-grid">${items}</div></section>`;
  }

  let extraHtml = '';
  const hasCerts = resume.certificates?.length;
  const hasLangs = resume.languages?.length;
  if (hasCerts || hasLangs) {
    extraHtml = '<section class="extra-grid">';
    if (hasCerts) {
      extraHtml += `<div><h2 class="section-title">${h(dict.certificates)}</h2>`;
      resume.certificates.forEach((c:any) => {
        const meta = [c.issuer,c.date].filter(Boolean).join(' • ');
        extraHtml += `<div class="cert-item" style="margin-bottom:.8rem"><div class="cert-name">${h(c.name||'')}</div>${meta?`<div class="cert-meta">${h(meta)}</div>`:''}</div>`;
      });
      extraHtml += '</div>';
    }
    if (hasLangs) {
      extraHtml += `<div><h2 class="section-title">${h(dict.languages)}</h2>`;
      resume.languages.forEach((l:any) => {
        extraHtml += `<div class="lang-item" style="margin-bottom:.6rem"><span>${h(l.language||'')}</span><strong class="lang-fluency">${h(l.fluency||'')}</strong></div>`;
      });
      extraHtml += '</div>';
    }
    extraHtml += '</section>';
  }

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>${h(title)}</title>
  <meta name="description" content="${h(b.summary||'Curriculum Vitae')}" />
  <link rel="stylesheet" href="${basePath}/style.css" />
</head>
<body class="theme-${template}">
  ${topNav}
  <div class="page">
    <div class="panel" style="padding:2.5rem">
      <header class="panel-header">
        <div class="panel-header-content">
          <h1 class="panel-name">${h(b.name||'Your Name')}</h1>
          ${b.label ? `<p class="panel-label">${h(b.label)}</p>` : ''}
          ${b.summary?`<p class="panel-summary">${h(b.summary)}</p>`:''}
          ${contacts.length?`<ul class="panel-contact">${contacts.join('\n        ')}</ul>`:''}
        </div>
        ${hasImg?`<img class="profile-image" src="${basePath}${h(b.image)}" alt="Profile photo" loading="lazy" />`:''}
      </header>
      <div class="panel-main">
        ${workHtml}
        ${eduHtml}
        ${skillsHtml}
        ${projHtml}
        ${extraHtml}
      </div>
    </div>
  </div>
</body>
</html>`;
}

function renderJsonStringify(resume: any): string {
  const clone: any = {};
  for (const k of Object.keys(resume)) {
    if (k === '$schema') continue;
    clone[k] = resume[k];
  }
  return JSON.stringify(clone, null, 2);
}

// =========================================================================
// GitHub helpers
// =========================================================================
function parseDataUrl(dataUrl: string) {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/.exec(dataUrl);
  if (!match) return null;
  const mime = match[1];
  const base64 = match[2];
  const ext = mime === 'image/jpeg' ? 'jpg' : mime.split('/')[1] || 'jpg';
  return { ext, buffer: Buffer.from(base64, 'base64') };
}

async function createOrUpdateFile(octokit: Octokit, owner: string, repo: string, filePath: string, content: string | typeof Buffer, message: string) {
  const base64 = typeof content === 'string' ? Buffer.from(content).toString('base64') : content.toString('base64');
  let sha: string | undefined;
  try {
    const response = await octokit.repos.getContent({ owner, repo, path: filePath });
    if (!Array.isArray(response.data) && 'sha' in response.data) {
      sha = response.data.sha;
    }
  } catch (error: any) {
    if (error.status !== 404) throw error;
  }
  try {
    await octokit.repos.createOrUpdateFileContents({
      owner, repo, path: filePath, message, content: base64, sha
    } as any);
  } catch (err: any) {
    err.message = `Error escribiendo ${filePath}: ${err.message}`;
    throw err;
  }
}

async function listRepoFiles(octokit: Octokit, owner: string, repo: string, dir = ''): Promise<string[]> {
  const result: string[] = [];
  try {
    const response = await octokit.repos.getContent({ owner, repo, path: dir || undefined } as any);
    if (Array.isArray(response.data)) {
      for (const item of response.data) {
        if (item.type === 'file') result.push(item.path);
        else if (item.type === 'dir') {
          const nested = await listRepoFiles(octokit, owner, repo, item.path);
          result.push(...nested);
        }
      }
    } else if (response.data.type === 'file') {
      result.push(response.data.path);
    }
  } catch (error: any) {
    if (error.status !== 404) throw error;
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

// =========================================================================
// Handler principal
// =========================================================================
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
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Solo se permite POST" }) };
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
      return { statusCode: 401, headers, body: JSON.stringify({ error: "No autenticado. Debe conectar GitHub primero." }) };
    }

    const body: DeployRequest = JSON.parse(event.body || '{}');
    const rawResumeByLang = body.resumeDataByLang || {};
    const template = (body.template || DEFAULT_TEMPLATE).toLowerCase();
    const langs = Array.isArray(body.langs) && body.langs.length > 0 ? body.langs : Object.keys(rawResumeByLang);

    const resumeByLang: Record<string, any> = { ...rawResumeByLang };
    if (body.resumeData && typeof body.resumeData === 'object') {
      if (!body.langs || body.langs.length === 0) langs.push('es');
      langs.forEach((lang) => {
        if (!resumeByLang[lang]) resumeByLang[lang] = body.resumeData;
      });
    }

    // Filtrar solo idiomas completados y válidos
    const filteredLangs = langs
      .filter(l => SUPPORTED_LANGS.includes(l))
      .filter((l, i, self) => self.indexOf(l) === i)
      .filter(l => resumeByLang[l]?.basics?.name?.trim());

    if (filteredLangs.length === 0) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'No hay datos válidos de CV para publicar.' }) };
    }

    const octokit = new Octokit({ auth: userToken });
    let targetRepo: GithubRepo;

    try {
      await octokit.repos.get({ owner: username, repo: PUBLISHED_REPO_NAME });
      targetRepo = { owner: username, repo: PUBLISHED_REPO_NAME };
    } catch (repoError: any) {
      if (repoError.status === 404) {
        const created = await octokit.repos.createForAuthenticatedUser({
          name: PUBLISHED_REPO_NAME,
          description: 'CV para Todos - sitio estático publicado en GitHub Pages',
          private: false,
          auto_init: true,
        } as any);
        targetRepo = { owner: username, repo: created.data.name };
        await new Promise((r) => setTimeout(r, 3000));
      } else {
        throw repoError;
      }
    }

    // Extraer foto de perfil (primera que encontremos)
    let profileFileName: string | null = null;
    let profileFileBuffer: typeof Buffer | null = null;
    for (const lang of filteredLangs) {
      const resume = resumeByLang[lang];
      const imageValue = resume?.basics?.image;
      if (!profileFileBuffer && typeof imageValue === 'string' && imageValue.startsWith('data:')) {
        const parsed = parseDataUrl(imageValue);
        if (parsed) {
          profileFileName = `profile.${parsed.ext}`;
          profileFileBuffer = parsed.buffer;
        }
      }
    }

    // Reescribir basics.image al path relativo
    if (profileFileName) {
      filteredLangs.forEach((lang) => {
        if (resumeByLang[lang]?.basics) {
          resumeByLang[lang].basics.image = `/${profileFileName}`;
        }
      });
    }

    // Normalizar website: aceptar basics.web o basics.url
    for (const lang of filteredLangs) {
      const basics = resumeByLang[lang]?.basics;
      if (basics) {
        basics.url = basics.url || basics.web || '';
      }
    }

    const isUserSite = PUBLISHED_REPO_NAME === `${username}.github.io`;
    const basePath = isUserSite ? '' : `/${PUBLISHED_REPO_NAME}`;

    // =====================================================================
    // Definir los archivos permitidos (todo lo demás se limpia)
    // =====================================================================
    const allowedFiles = new Set<string>([
      'index.html',
      'style.css',
      '.nojekyll',
    ]);
    filteredLangs.forEach(lang => {
      allowedFiles.add(`${lang}/index.html`);
      allowedFiles.add(`resume.${lang}.json`);
    });
    if (profileFileName) {
      allowedFiles.add(profileFileName);
    }

    // =====================================================================
    // Escribir archivos estáticos
    // =====================================================================
    console.log('Writing style.css');
    await createOrUpdateFile(octokit, username, PUBLISHED_REPO_NAME, 'style.css', CV_THEMES_CSS, 'Publish CV: stylesheet');

    console.log('Writing index.html (language redirect)');
    await createOrUpdateFile(octokit, username, PUBLISHED_REPO_NAME, 'index.html', renderRootIndex(filteredLangs, basePath), 'Publish CV: root redirect');

    // .nojekyll desactiva Jekyll y asegura que GitHub Pages sirva los archivos tal cual
    console.log('Writing .nojekyll');
    await createOrUpdateFile(octokit, username, PUBLISHED_REPO_NAME, '.nojekyll', '', 'Publish CV: disable Jekyll');

    if (profileFileBuffer && profileFileName) {
      console.log(`Writing ${profileFileName}`);
      await createOrUpdateFile(octokit, username, PUBLISHED_REPO_NAME, profileFileName, profileFileBuffer, 'Publish CV: profile image');
    }

    const results: any[] = [];
    for (const lang of filteredLangs) {
      const resumeData = resumeByLang[lang];

      // Escribir resume.json
      await createOrUpdateFile(octokit, username, PUBLISHED_REPO_NAME, `resume.${lang}.json`, renderJsonStringify(resumeData), `Publish CV: resume.${lang}.json`);

      // Escribir página HTML del idioma
      await createOrUpdateFile(octokit, username, PUBLISHED_REPO_NAME, `${lang}/index.html`, renderCvPage(resumeData, lang, template, filteredLangs, basePath), `Publish CV: ${lang}/index.html`);

      results.push({ lang, success: true });
    }

    // Limpiar archivos obsoletos del repo (después de escribir, para no dejar el repo inconsistente)
    const allFiles = await listRepoFiles(octokit, username, PUBLISHED_REPO_NAME);
    for (const file of allFiles) {
      if (!allowedFiles.has(file)) {
        await deleteFileIfNeeded(octokit, username, PUBLISHED_REPO_NAME, file);
      }
    }

    // =====================================================================
    // Configurar GitHub Pages
    // =====================================================================
    // Primero intentamos actualizar la configuración de Pages (si ya existe)
    let pagesConfigured = false;
    try {
      await octokit.repos.updateInformationAboutPagesSite({
        owner: username,
        repo: PUBLISHED_REPO_NAME,
        source: { branch: 'main', path: '/' }
      } as any);
      pagesConfigured = true;
      console.log('GitHub Pages source updated to main branch');
    } catch (updateError: any) {
      if (updateError.status !== 404) {
        console.warn('Error updating Pages config:', updateError.message || updateError);
      }
    }

    // Si no existía, la creamos desde cero
    if (!pagesConfigured) {
      try {
        await octokit.repos.createPagesSite({
          owner: username,
          repo: PUBLISHED_REPO_NAME,
          source: { branch: 'main', path: '/' }
        } as any);
        console.log('GitHub Pages created successfully');
      } catch (createError: any) {
        console.warn('No se pudo habilitar GitHub Pages automáticamente:', createError.message || createError);
      }
    }

    const pagePath = isUserSite ? '' : `${PUBLISHED_REPO_NAME}/`;
    const repoUrl = `https://github.com/${username}/${PUBLISHED_REPO_NAME}`;
    const webUrl = `https://${username}.github.io/${pagePath}`;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `¡Éxito! Tu CV ha sido publicado en ${repoUrl}`,
        repository: `${username}/${PUBLISHED_REPO_NAME}`,
        webUrl,
        results
      })
    };
  } catch (error: any) {
    console.error('Error crítico en /api/deploy:', error);
    if (error.status === 401 || error.status === 403) {
      return { statusCode: error.status, headers, body: JSON.stringify({ error: 'Tu sesión de GitHub ha expirado o no tienes permisos. Por favor, reautentica.' }) };
    }
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message || 'Error al procesar el despliegue.' }) };
  }
};
