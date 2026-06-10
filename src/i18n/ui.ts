// src/i18n/ui.ts
// Cadenas de interfaz para los 3 idiomas soportados

export const languages = {
  es: 'Español',
  it: 'Italiano',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'es';

export const ui = {
  es: {
    'nav.experience':  'Experiencia',
    'nav.education':   'Formación',
    'nav.skills':      'Habilidades',
    'nav.projects':    'Proyectos',
    'nav.contact':     'Contacto',
    'nav.print':       'Imprimir',
    'nav.language':    'Idioma',
    'section.experience':  'Experiencia profesional',
    'section.education':   'Formación académica',
    'section.skills':      'Habilidades',
    'section.projects':    'Proyectos',
    'section.languages':   'Idiomas',
    'label.present':       'Actualidad',
    'label.viewProject':   'Ver proyecto',
    'label.viewCompany':   'Ver empresa',
    'setup.title':         'Configuración inicial',
    'setup.step1':         'Activa GitHub Pages en Ajustes → Pages → Source: GitHub Actions',
    'setup.step2':         'Regresa a tu repositorio y pulsa el punto (.) para editar tu CV',
    'setup.cta':           'Ir a Ajustes de GitHub',
    'meta.description':    'Currículum de',
  },
  it: {
    'nav.experience':  'Esperienza',
    'nav.education':   'Formazione',
    'nav.skills':      'Competenze',
    'nav.projects':    'Progetti',
    'nav.contact':     'Contatti',
    'nav.print':       'Stampa',
    'nav.language':    'Lingua',
    'section.experience':  'Esperienza professionale',
    'section.education':   'Formazione accademica',
    'section.skills':      'Competenze',
    'section.projects':    'Progetti',
    'section.languages':   'Lingue',
    'label.present':       'Presente',
    'label.viewProject':   'Vedi progetto',
    'label.viewCompany':   'Vedi azienda',
    'setup.title':         'Configurazione iniziale',
    'setup.step1':         'Attiva GitHub Pages in Impostazioni → Pages → Source: GitHub Actions',
    'setup.step2':         'Torna al tuo repository e premi il punto (.) per modificare il tuo CV',
    'setup.cta':           'Vai alle Impostazioni di GitHub',
    'meta.description':    'Curriculum di',
  },
  en: {
    'nav.experience':  'Experience',
    'nav.education':   'Education',
    'nav.skills':      'Skills',
    'nav.projects':    'Projects',
    'nav.contact':     'Contact',
    'nav.print':       'Print',
    'nav.language':    'Language',
    'section.experience':  'Work experience',
    'section.education':   'Education',
    'section.skills':      'Skills',
    'section.projects':    'Projects',
    'section.languages':   'Languages',
    'label.present':       'Present',
    'label.viewProject':   'View project',
    'label.viewCompany':   'View company',
    'setup.title':         'Initial setup',
    'setup.step1':         'Enable GitHub Pages in Settings → Pages → Source: GitHub Actions',
    'setup.step2':         'Return to your repository and press the dot (.) to edit your CV',
    'setup.cta':           'Go to GitHub Settings',
    'meta.description':    'Resume of',
  },
} as const;

export function useTranslations(lang: Lang) {
  return function t(key: keyof typeof ui[typeof defaultLang]): string {
    return ui[lang][key] ?? ui[defaultLang][key] ?? key;
  };
}

// Devuelve el idioma a partir de la URL (p.ej. /it/... → 'it')
export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as Lang;
  return defaultLang;
}

// Lista de idiomas con datos del JSON (para no publicar pestañas vacías)
export function getAvailableLangs(resumes: Record<string, any>): Lang[] {
  return (Object.keys(languages) as Lang[]).filter(
    (lang) => resumes[lang]?.basics?.name?.trim()
  );
}
