// src/i18n/ui.ts
export const languages = {
  es: 'Español',
  it: 'Italiano',
  en: 'English'
} as const;

export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'es';

const esDict = {
  'brand.name': 'CV para Todos',
  'wizard.welcome': '¡Bienvenido a tu Currículum Sostenible y Libre!',
  'wizard.subtitle': 'Crea un CV profesional en 3 minutos. Sin anuncios, sin datos compartidos.',
  'wizard.create': 'Crear mi CV desde cero',
  'wizard.login': 'Importar desde GitHub / Editar',
  'wizard.import': 'Importar mi resume.json',
  'wizard.importPlaceholder': 'Seleccionar archivo JSON...',
  'edit.title': 'Editor de Currículum No-Code',
  'edit.downloadJson': 'Descargar JSON Plano',
  'edit.downloadPdf': 'Descargar en PDF',
  'edit.publish': 'Publicar Web',
  'edit.currently': 'Actualmente',
  'form.name': 'Nombre Completo',
  'form.label': 'Profesión / Puesto',
  'form.website': 'Sitio Web',
  'nav.contact': 'Datos Básicos',
  // Traducciones de la categoría de plantillas dinámicas
  'templates.title': 'Plantilla Visual',
  'templates.subtitle': 'Selecciona el diseño del Currículum',
  'templates.minimalist': 'Minimal (Plantilla Minimalista)',
  'templates.techy': 'Tech (Plantilla Tecnológica)',
  'templates.artistic': 'Artistic (Plantilla Creativa)'
};

export type UIKeys = keyof typeof esDict;

export const ui: Record<Lang, Record<UIKeys, string>> = {
  es: esDict,
  it: {
    'brand.name': 'CV per Tutti',
    'wizard.welcome': 'Benvenuto nel tuo Curriculum Sostenibile e Libero!',
    'wizard.subtitle': 'Crea un CV professionale in 3 minuti. Senza pubblicità, senza dati condivisi.',
    'wizard.create': 'Crea il mio CV da zero',
    'wizard.login': 'Importa da GitHub / Modifica',
    'wizard.import': 'Importa il mio resume.json',
    'wizard.importPlaceholder': 'Seleziona file JSON...',
    'edit.title': 'Editore del Curriculum No-Code',
    'edit.downloadJson': 'Scarica JSON',
    'edit.downloadPdf': 'Scarica in PDF',
    'edit.publish': 'Pubblica il Web',
    'edit.currently': 'Attualmente',
    'form.name': 'Nome Completo',
    'form.label': 'Professione / Ruolo',
    'form.website': 'Sito Web',
    'nav.contact': 'Dati di Contatto',
    // Modello Visivo (Italiano)
    'templates.title': 'Modello Visivo',
    'templates.subtitle': 'Seleziona il design del Curriculum',
    'templates.minimalist': 'Minimal (Modello Minimalista)',
    'templates.techy': 'Tech (Modello Tecnologico)',
    'templates.artistic': 'Artistic (Modello Creativo)'
  },
  en: {
    'brand.name': 'CV for Everyone',
    'wizard.welcome': 'Welcome to your Sustainable & Free Resume!',
    'wizard.subtitle': 'Create a professional CV in 3 minutes. No ads, no data tracking.',
    'wizard.create': 'Create my CV from scratch',
    'wizard.login': 'Import from GitHub / Edit',
    'wizard.import': 'Import my resume.json',
    'wizard.importPlaceholder': 'Select JSON file...',
    'edit.title': 'No-Code Resume Editor',
    'edit.downloadJson': 'Download Clean JSON',
    'edit.downloadPdf': 'Download PDF',
    'edit.publish': 'Publish Live Site',
    'edit.currently': 'Currently',
    'form.name': 'Full Name',
    'form.label': 'Profession / Title',
    'form.website': 'Website',
    'nav.contact': 'Basic Information',
    // Visual Template (English)
    'templates.title': 'Visual Template',
    'templates.subtitle': 'Select the Resume Design',
    'templates.minimalist': 'Minimal (Minimalist Template)',
    'templates.techy': 'Tech (Tech Template)',
    'templates.artistic': 'Artistic (Creative Template)'
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