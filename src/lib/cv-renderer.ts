export const SECTION_TITLES: Record<string, Record<string, string>> = {
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

export function escapeHtml(s: string): string {
  if (!s) return '';
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function formatDate(d: string): string {
  if (!d) return '';
  try {
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? d : dt.toLocaleDateString('en', { year: 'numeric', month: 'short' });
  } catch {
    return d;
  }
}

export function dateRange(start: string, end: string | null, present: string): string {
  const f = start ? formatDate(start.slice(0, 7)) : '';
  const t = end ? formatDate(end.slice(0, 7)) : present;
  return f && t ? `${f} — ${t}` : t || f || '';
}

export function renderCvContent(resume: any, lang: string, basePath = ''): string {
  const dict = SECTION_TITLES[lang] || SECTION_TITLES.en;
  const b = resume?.basics || {};
  const hasImg = !!b.image;
  const contactUrl = b.url || '';
  const contacts: string[] = [];

  if (b.email) contacts.push(`<li><a href="mailto:${escapeHtml(b.email)}">${escapeHtml(b.email)}</a></li>`);
  if (b.phone) contacts.push(`<li><a href="tel:${escapeHtml(b.phone)}">${escapeHtml(b.phone)}</a></li>`);
  if (contactUrl) contacts.push(`<li><a href="${escapeHtml(contactUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(contactUrl)}</a></li>`);

  let workHtml = '';
  if (resume.work?.length) {
    const items = resume.work.filter((w: any) => w.name).map((w: any) =>
      `<article class="card"><div class="card-header"><strong class="card-title">${escapeHtml(w.position || w.name)}</strong><span class="card-date">${dateRange(w.startDate, w.endDate, dict.present)}</span></div><div style="margin-top:.75rem;opacity:.85">${escapeHtml(w.name)}</div>${w.summary ? `<p class="card-body">${escapeHtml(w.summary)}</p>` : ''}</article>`
    ).join('\n');
    workHtml = `<section><h2 class="section-title">${escapeHtml(dict.experience)}</h2><div class="cards-grid">${items}</div></section>`;
  }

  let eduHtml = '';
  if (resume.education?.length) {
    const items = resume.education.filter((e: any) => e.institution).map((e: any) =>
      `<article class="card"><div class="card-header"><strong class="card-title">${escapeHtml(e.area || '')}</strong><span class="card-date">${dateRange(e.startDate, e.endDate, dict.present)}</span></div><p style="margin-top:.75rem">${escapeHtml(e.institution)}</p></article>`
    ).join('\n');
    eduHtml = `<section><h2 class="section-title">${escapeHtml(dict.education)}</h2><div class="cards-grid">${items}</div></section>`;
  }

  let skillsHtml = '';
  if (resume.skills?.length) {
    const tags = resume.skills.filter((s: any) => s.name).map((s: any) => `<span class="tag">${escapeHtml(s.name)}</span>`).join('\n');
    skillsHtml = `<section><h2 class="section-title">${escapeHtml(dict.skills)}</h2><div class="skills-wrap">${tags}</div></section>`;
  }

  let projHtml = '';
  if (resume.projects?.length) {
    const items = resume.projects.filter((p: any) => p.name).map((p: any) =>
      `<article class="card"><div class="card-header"><strong class="card-title">${escapeHtml(p.name)}</strong>${p.startDate ? `<span class="card-date">${formatDate(p.startDate)}</span>` : ''}</div>${p.description ? `<p class="card-body">${escapeHtml(p.description)}</p>` : ''}</article>`
    ).join('\n');
    projHtml = `<section><h2 class="section-title">${escapeHtml(dict.projects)}</h2><div class="cards-grid">${items}</div></section>`;
  }

  let extraHtml = '';
  const hasCerts = resume.certificates?.length;
  const hasLangs = resume.languages?.length;
  if (hasCerts || hasLangs) {
    extraHtml = '<section class="extra-grid">';
    if (hasCerts) {
      extraHtml += `<div><h2 class="section-title">${escapeHtml(dict.certificates)}</h2>`;
      resume.certificates.forEach((c: any) => {
        const meta = [c.issuer, c.date].filter(Boolean).join(' • ');
        extraHtml += `<div class="cert-item" style="margin-bottom:.8rem"><div class="cert-name">${escapeHtml(c.name || '')}</div>${meta ? `<div class="cert-meta">${escapeHtml(meta)}</div>` : ''}</div>`;
      });
      extraHtml += '</div>';
    }
    if (hasLangs) {
      extraHtml += `<div><h2 class="section-title">${escapeHtml(dict.languages)}</h2>`;
      resume.languages.forEach((l: any) => {
        extraHtml += `<div class="lang-item" style="margin-bottom:.6rem"><span>${escapeHtml(l.language || '')}</span><strong class="lang-fluency">${escapeHtml(l.fluency || '')}</strong></div>`;
      });
      extraHtml += '</div>';
    }
    extraHtml += '</section>';
  }

  return `<header class="panel-header">
        <div class="panel-header-content">
          <h1 class="panel-name">${escapeHtml(b.name || 'Your Name')}</h1>
          ${b.label ? `<p class="panel-label">${escapeHtml(b.label)}</p>` : ''}
          ${b.summary ? `<p class="panel-summary">${escapeHtml(b.summary)}</p>` : ''}
          ${contacts.length ? `<ul class="panel-contact">${contacts.join('\n        ')}</ul>` : ''}
        </div>
        ${hasImg ? `<img class="profile-image" src="${basePath}${escapeHtml(b.image)}" alt="Profile photo" loading="lazy" />` : ''}
      </header>
      <div class="panel-main">
        ${workHtml}
        ${eduHtml}
        ${skillsHtml}
        ${projHtml}
        ${extraHtml}
      </div>`;
}
