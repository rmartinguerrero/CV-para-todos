// src/i18n/ui.ts
export const languages = {
  es: 'Español',
  it: 'Italiano',
  en: 'English'
} as const;

export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'es';

const esDict = {
  'wizard.welcome': '¡Bienvenido a tu Currículum Sostenible y Libre!',
  'wizard.subtitle': 'Crea un CV profesional en 3 minutos. Sin anuncios, sin datos compartidos.',
  'wizard.create': 'Crear mi CV desde cero',
  'wizard.login': 'Importar desde GitHub / Editar',
  'edit.title': 'Editor de Currículum No-Code',
  'edit.downloadJson': 'Descargar JSON Plano',
  'edit.downloadPdf': 'Descargar en PDF',
  'edit.publish': 'Publicar Web',
  'form.name': 'Nombre Completo',
  'form.label': 'Profesión / Puesto',
  'nav.contact': 'Datos Básicos',
  // Traducciones de la categoría de plantillas dinámicas
  'templates.title': 'Plantilla Visual',
  'templates.subtitle': 'Selecciona el diseño del Currículum',
  'templates.minimallayout.name': 'Minimal (Plantilla Minimalista)',
  'templates.techlayout.name': 'Tech (Plantilla Tecnológica)',
  'templates.artisticlayout.name': 'Artistic (Plantilla Creativa)'
};

export type UIKeys = keyof typeof esDict;

export const ui: Record<Lang, Record<UIKeys, string>> = {
  es: esDict,
  it: {
    'wizard.welcome': 'Benvenuto nel tuo Curriculum Sostenibile e Libero!',
    'wizard.subtitle': 'Crea un CV professionale in 3 minuti. Senza pubblicità, senza dati condivisi.',
    'wizard.create': 'Crea il mio CV da zero',
    'wizard.login': 'Importa da GitHub / Modifica',
    'edit.title': 'Editore del Curriculum No-Code',
    'edit.downloadJson': 'Scarica JSON',
    'edit.downloadPdf': 'Scarica in PDF',
    'edit.publish': 'Pubblica il Web',
    'form.name': 'Nome Completo',
    'form.label': 'Professione / Ruolo',
    'nav.contact': 'Dati di Contatto',
    // Modello Visivo (Italiano)
    'templates.title': 'Modello Visivo',
    'templates.subtitle': 'Seleziona il design del Curriculum',
    'templates.minimallayout.name': 'Minimal (Modello Minimalista)',
    'templates.techlayout.name': 'Tech (Modello Tecnologico)',
    'templates.artisticlayout.name': 'Artistic (Modello Creativo)'
  },
  en: {
    'wizard.welcome': 'Welcome to your Sustainable & Free Resume!',
    'wizard.subtitle': 'Create a professional CV in 3 minutes. No ads, no data tracking.',
    'wizard.create': 'Create my CV from scratch',
    'wizard.login': 'Import from GitHub / Edit',
    'edit.title': 'No-Code Resume Editor',
    'edit.downloadJson': 'Download Clean JSON',
    'edit.downloadPdf': 'Download PDF',
    'edit.publish': 'Publish Live Site',
    'form.name': 'Full Name',
    'form.label': 'Profession / Title',
    'nav.contact': 'Basic Information',
    // Visual Template (English)
    'templates.title': 'Visual Template',
    'templates.subtitle': 'Select the Resume Design',
    'templates.minimallayout.name': 'Minimal (Minimalist Template)',
    'templates.techlayout.name': 'Tech (Tech Template)',
    'templates.artisticlayout.name': 'Artistic (Creative Template)'
  }
};

export function useTranslations(lang: Lang) {
  return function t(key: UIKeys): string {
    return ui[lang]?.[key] ?? ui[defaultLang][key] ?? key;
  };
}

export function getAvailableLangs(resumes: Record<Lang, any>): Lang[] {
  return Object.keys(resumes).filter((lang) => !!resumes[lang as Lang]?.basics?.name) as Lang[];
}