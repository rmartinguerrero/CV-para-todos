// src/deploy-templates/renderer.ts
// Genera HTML estático para cada página del CV publicado

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en', { year: 'numeric', month: 'short' });
  } catch {
    return dateString;
  }
}

function normalizeMonth(v: string): string {
  return v ? v.slice(0, 7) : '';
}

function renderDateRange(start: string, end: string | null, presentLabel: string): string {
  const from = normalizeMonth(start);
  const to = end ? normalizeMonth(end) : presentLabel;
  if (from && to) return `${formatDate(from)} — ${to}`;
  return to || from || '';
}

function renderSectionTitle(title: string): string {
  return `<h2 class="section-title">${escapeHtml(title)}</h2>`;
}

function renderExperience(resume: any, t: (key: string) => string): string {
  if (!resume.work?.length) return '';
  const items = resume.work
    .filter((w: any) => w.name)
    .map((w: any) => {
      const dateStr = renderDateRange(w.startDate, w.endDate, t('present'));
      return `<article class="card">
        <div class="card-header">
          <strong class="card-title">${escapeHtml(w.position || w.name)}</strong>
          <span class="card-date">${escapeHtml(dateStr)}</span>
        </div>
        <div class="card-subtitle">${escapeHtml(w.name)}</div>
        ${w.summary ? `<p class="card-body">${escapeHtml(w.summary)}</p>` : ''}
      </article>`;
    })
    .join('\n');
  return `<section>${renderSectionTitle(t('experience'))}<div class="cards-grid">${items}</div></section>`;
}

function renderEducation(resume: any, t: (key: string) => string): string {
  if (!resume.education?.length) return '';
  const items = resume.education
    .filter((e: any) => e.institution)
    .map((e: any) => {
      const dateStr = renderDateRange(e.startDate, e.endDate, t('present'));
      return `<article class="card">
        <div class="card-header">
          <strong class="card-title">${escapeHtml(e.area || '')}</strong>
          <span class="card-date">${escapeHtml(dateStr)}</span>
        </div>
        <p style="margin-top:.75rem;opacity:.85;">${escapeHtml(e.institution)}</p>
      </article>`;
    })
    .join('\n');
  return `<section>${renderSectionTitle(t('education'))}<div class="cards-grid">${items}</div></section>`;
}

function renderSkills(resume: any): string {
  if (!resume.skills?.length) return '';
  const tags = resume.skills
    .filter((s: any) => s.name)
    .map((s: any) => `<span class="tag">${escapeHtml(s.name)}</span>`)
    .join('\n');
  return `<section>${renderSectionTitle('Skills')}<div class="skills-wrap">${tags}</div></section>`;
}

function renderProjects(resume: any, t: (key: string) => string): string {
  if (!resume.projects?.length) return '';
  const items = resume.projects
    .filter((p: any) => p.name)
    .map((p: any) => {
      return `<article class="card">
        <div class="card-header">
          <strong class="card-title">${escapeHtml(p.name)}</strong>
          ${p.startDate ? `<span class="card-date">${escapeHtml(formatDate(p.startDate))}</span>` : ''}
        </div>
        ${p.description ? `<p class="card-body">${escapeHtml(p.description)}</p>` : ''}
      </article>`;
    })
    .join('\n');
  return `<section>${renderSectionTitle(t('projects'))}<div class="cards-grid">${items}</div></section>`;
}

function renderExtra(resume: any, t: (key: string) => string): string {
  const hasCerts = resume.certificates?.length;
  const hasLangs = resume.languages?.length;
  if (!hasCerts && !hasLangs) return '';

  let html = '<section class="extra-grid">';

  if (hasCerts) {
    html += `<div><h2 class="section-title">${escapeHtml(t('certificates'))}</h2>
      <ul class="cert-list">`;
    resume.certificates.forEach((c: any) => {
      const meta = [c.issuer, c.date].filter(Boolean).join(' • ');
      html += `<li class="cert-item">
        <div class="cert-name">${escapeHtml(c.name || '')}</div>
        ${meta ? `<div class="cert-meta">${escapeHtml(meta)}</div>` : ''}
      </li>`;
    });
    html += '</ul></div>';
  }

  if (hasLangs) {
    html += `<div><h2 class="section-title">${escapeHtml(t('languages'))}</h2>
      <ul class="lang-list">`;
    resume.languages.forEach((l: any) => {
      html += `<li class="lang-item">
        <span class="lang-name">${escapeHtml(l.language || '')}</span>
        <strong class="lang-fluency">${escapeHtml(l.fluency || '')}</strong>
      </li>`;
    });
    html += '</ul></div>';
  }

  html += '</section>';
  return html;
}

function stringifyResume(resume: any): string {
  const clone: any = {};
  for (const key of Object.keys(resume)) {
    if (key === '$schema') continue;
    clone[key] = resume[key];
  }
  return JSON.stringify(clone, null, 2);
}

export function renderCvPage(
  resume: any,
  lang: string,
  template: string,
  availableLangs: string[],
  t: Record<string, string>
): string {
  const { basics } = resume;
  const title = basics?.name ? `${basics.name} — ${basics.label || 'CV'}` : 'Curriculum Vitae';
  const description = basics?.summary || 'Curriculum Vitae';
  const hasImage = !!basics?.image;

  const langNav = availableLangs
    .map((l: string) => {
      const isActive = l === lang;
      return `<a href="/${l}/" class="${isActive ? 'lang-btn-active' : 'lang-btn-inactive'}">${l.toUpperCase()}</a>`;
    })
    .join('\n');

  const contactHtml = [];
  if (basics?.email) contactHtml.push(`<div><strong>Email</strong><br />${escapeHtml(basics.email)}</div>`);
  if (basics?.phone) contactHtml.push(`<div><strong>Phone</strong><br />${escapeHtml(basics.phone)}</div>`);
  if (basics?.url) contactHtml.push(`<div><strong>Website</strong><br /><a href="${escapeHtml(basics.url)}" target="_blank" rel="noreferrer noopener">${escapeHtml(basics.url)}</a></div>`);

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="stylesheet" href="/style.css" />
</head>
<body class="theme-${escapeHtml(template)}">
  <div class="page">
    <div class="panel" style="padding:2.5rem;">
      <header class="panel-header">
        <div class="panel-header-content">
          <p class="tag">${escapeHtml(basics?.label || 'Curriculum Vitae')}</p>
          <h1 class="panel-name">${escapeHtml(basics?.name || 'Your Name')}</h1>
          ${basics?.summary ? `<p class="panel-summary">${escapeHtml(basics.summary)}</p>` : ''}
          ${contactHtml.length ? `<div class="panel-contact">${contactHtml.join('\n')}</div>` : ''}
        </div>
        ${hasImage ? `<div class="panel-header-image"><img class="profile-image" src="/profile.jpg" alt="Profile photo" loading="lazy" /></div>` : ''}
      </header>

      <nav class="panel-nav">${langNav}</nav>

      <div class="panel-main">
        ${renderExperience(resume, (k: string) => t[k] || k)}
        ${renderEducation(resume, (k: string) => t[k] || k)}
        ${renderSkills(resume)}
        ${renderProjects(resume, (k: string) => t[k] || k)}
        ${renderExtra(resume, (k: string) => t[k] || k)}
      </div>
    </div>
  </div>
  <script src="/cookie-consent.js" defer></script>
</body>
</html>`;
}

export function renderRootIndex(availableLangs: string[]): string {
  const langsJson = JSON.stringify(availableLangs);
  const fallback = availableLangs[0] || 'en';
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CV</title>
  <script>
    (function() {
      var available = ${langsJson};
      var preferred = (navigator.languages || [navigator.language])
        .map(function(l) { return l.split('-')[0]; })
        .find(function(l) { return available.indexOf(l) !== -1; }) || '${fallback}';
      window.location.replace('/' + preferred + '/');
    })();
  </script>
</head>
<body>
  <p>Redirecting to <a href="/${fallback}/">/${fallback}/</a></p>
</body>
</html>`;
}

export function renderJsonStringify(resume: any): string {
  return stringifyResume(resume);
}

export const SUPPORTED_LANGS = ['es', 'it', 'en'];

export const STYLE_CSS = `/* ==========================================================================
   CV para Todos — Standalone Stylesheet
   ========================================================================== */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-text-size-adjust:100%;-moz-text-size-adjust:100%}
body{font-family:'Inter',system-ui,sans-serif;line-height:1.6;min-height:100vh;-webkit-font-smoothing:antialiased}
img{display:block;max-width:100%;height:auto}
a{color:inherit;text-decoration:none}
a:hover{opacity:.85}
h1,h2,h3,strong{font-family:'Inter',system-ui,sans-serif}
ul,ol{list-style:none}

.theme-minimalist{background:#f8fafc;color:#111827}
.theme-minimalist .page{max-width:900px;margin:0 auto;padding:3rem 1.5rem}
.theme-minimalist .panel{background:#fff;border:1px solid #e5e7eb;border-radius:1.25rem;box-shadow:0 24px 80px rgba(15,23,42,.06)}
.theme-minimalist .accent{color:#2563eb}
.theme-minimalist .tag{display:inline-flex;gap:.5rem;padding:.5rem 1rem;background:#eff6ff;border-radius:9999px;font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.theme-minimalist .section-title{color:#111827;font-size:1rem;letter-spacing:.12em;text-transform:uppercase;margin-bottom:1rem}
.theme-minimalist .profile-image{width:128px;height:128px;object-fit:cover;border-radius:1rem;border:1px solid #e5e7eb}
.theme-minimalist .lang-btn-active{background:#2563eb!important;color:#fff!important}
.theme-minimalist .lang-btn-inactive{background:rgba(0,0,0,.06)!important;color:inherit!important}

.theme-techy{background:#0f172a;color:#e2e8f0}
.theme-techy .page{max-width:1000px;margin:0 auto;padding:3rem 1.5rem}
.theme-techy .panel{background:rgba(15,23,42,0.96);border:1px solid rgba(148,163,184,.18);border-radius:1.5rem;box-shadow:0 30px 80px rgba(15,23,42,.3)}
.theme-techy .accent{color:#38bdf8}
.theme-techy .tag{display:inline-flex;gap:.5rem;padding:.5rem 1rem;background:rgba(56,189,248,.12);border-radius:9999px;font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#c7d2fe}
.theme-techy .section-title{color:#cbd5e1;font-size:1rem;letter-spacing:.12em;text-transform:uppercase;margin-bottom:1rem}
.theme-techy .profile-image{width:128px;height:128px;object-fit:cover;border-radius:1rem;border:1px solid rgba(148,163,184,.2)}
.theme-techy .lang-btn-active{background:#38bdf8!important;color:#0f172a!important}
.theme-techy .lang-btn-inactive{background:rgba(255,255,255,.1)!important;color:inherit!important}

.theme-artistic{background:#fdf2e9;color:#17212b}
.theme-artistic .page{max-width:900px;margin:0 auto;padding:3rem 1.5rem}
.theme-artistic .panel{background:#fff;border:1px solid #f1e4d3;border-radius:1.75rem;box-shadow:0 25px 90px rgba(15,23,42,.08)}
.theme-artistic .accent{color:#d97706}
.theme-artistic .tag{display:inline-flex;gap:.5rem;padding:.5rem 1rem;background:#fff7ed;border-radius:9999px;font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#92400e}
.theme-artistic .section-title{color:#7c2d12;font-size:1rem;letter-spacing:.12em;text-transform:uppercase;margin-bottom:1rem}
.theme-artistic .profile-image{width:128px;height:128px;object-fit:cover;border-radius:1.5rem;border:1px solid #fde2b6}
.theme-artistic .lang-btn-active{background:#d97706!important;color:#fff!important}
.theme-artistic .lang-btn-inactive{background:rgba(0,0,0,.06)!important;color:inherit!important}

.panel-inner{padding:0}
.panel-section{margin-top:2rem}
.panel-header{display:flex;flex-wrap:wrap;gap:1.5rem;align-items:flex-start;justify-content:space-between}
.panel-header-content{flex:1;min-width:220px}
.panel-name{font-size:clamp(2rem,3vw,3rem);margin:.75rem 0 .5rem;line-height:1.05}
.panel-summary{max-width:40rem;line-height:1.8;opacity:.9}
.panel-contact{display:grid;gap:.75rem;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));margin-top:1.5rem}
.panel-contact strong{display:block;font-size:.875rem}
.panel-contact div{font-size:.875rem}
.panel-nav{display:flex;flex-wrap:wrap;gap:.75rem;margin:2rem 0 1rem}
.panel-nav a{padding:.65rem 1rem;border-radius:9999px;text-decoration:none;font-weight:700;font-size:.875rem}
.panel-main{display:grid;gap:2rem}
.card{padding:1.25rem;border:1px solid rgba(148,163,184,.16);border-radius:1rem}
.card-header{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap}
.card-title{font-weight:700}
.card-subtitle{margin-top:.5rem;opacity:.85;font-size:.95rem}
.card-body{margin-top:.75rem;line-height:1.8;white-space:pre-line;font-size:.9rem}
.card-date{opacity:.75;font-size:.85rem}
.cards-grid{display:grid;gap:1.25rem}
.skills-wrap{display:flex;flex-wrap:wrap;gap:.6rem}
.extra-grid{display:grid;gap:1.5rem}
.cert-list{display:grid;gap:.8rem;list-style:none;padding:0;margin:0}
.cert-item{padding:.95rem;border:1px solid rgba(148,163,184,.16);border-radius:1rem}
.cert-name{font-weight:700}
.cert-meta{opacity:.75;font-size:.875rem}
.lang-list{display:grid;gap:.6rem;list-style:none;padding:0;margin:0}
.lang-item{display:flex;justify-content:space-between;gap:1rem;padding:.95rem;border:1px solid rgba(148,163,184,.16);border-radius:1rem}
.lang-name{font-size:.95rem}
.lang-fluency{opacity:.85;font-weight:700;font-size:.9rem}
.panel-header-image{flex-shrink:0}

@media(max-width:640px){
  .page{padding:1.5rem 1rem!important}
  .panel{border-radius:1rem!important}
  .panel-header{flex-direction:column-reverse;align-items:stretch}
  .panel-header-image{align-self:center}
  .panel-name{font-size:1.75rem!important}
  .panel-contact{grid-template-columns:1fr!important}
  .panel-nav{justify-content:center}
  .panel-main{gap:1.5rem}
  .card{padding:1rem}
  .card-header{flex-direction:column;gap:.25rem}
  .lang-item{flex-direction:column;gap:.25rem}
  .profile-image{width:96px!important;height:96px!important}
}

@media(min-width:641px)and (max-width:768px){
  .page{padding:2rem 1.25rem!important}
}

@media print{
  body{background:#fff!important;color:#000!important}
  .page{max-width:none!important;padding:0!important;margin:0!important}
  .panel{box-shadow:none!important;border:none!important;border-radius:0!important;background:#fff!important}
  .panel-nav{display:none!important}
  .card{border:1px solid #ddd!important;break-inside:avoid}
  .cert-item,.lang-item{border:1px solid #ddd!important}
  .profile-image{border:1px solid #ccc!important}
  .tag{border:1px solid #ccc!important}
  @page{size:A4;margin:10mm}
  html,body{height:auto!important}
  a{text-decoration:underline}
}`;

export const I18N_LABELS: Record<string, Record<string, string>> = {
  es: {
    present: 'Presente',
    experience: 'Experiencia',
    education: 'Formación',
    skills: 'Habilidades',
    projects: 'Proyectos',
    certificates: 'Certificados',
    languages: 'Idiomas',
  },
  it: {
    present: 'Presente',
    experience: 'Esperienza',
    education: 'Formazione',
    skills: 'Competenze',
    projects: 'Progetti',
    certificates: 'Certificati',
    languages: 'Lingue',
  },
  en: {
    present: 'Present',
    experience: 'Experience',
    education: 'Education',
    skills: 'Skills',
    projects: 'Projects',
    certificates: 'Certificates',
    languages: 'Languages',
  },
};
