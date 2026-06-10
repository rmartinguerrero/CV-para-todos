# CV Para Todos

> Currículum web multiidioma, estático, gratuito y sin conocimientos técnicos.

## Stack

- [Astro 5](https://astro.build) — generación estática
- [Tailwind CSS 3](https://tailwindcss.com) — estilos
- [JSON Resume](https://jsonresume.org) — esquema de datos estándar
- GitHub Pages — hosting gratuito
- GitHub Actions — despliegue automático

## Idiomas soportados

| Archivo                  | Idioma   |
|--------------------------|----------|
| `src/data/resume.es.json`| Español  |
| `src/data/resume.it.json`| Italiano |
| `src/data/resume.en.json`| English  |

Las pestañas vacías **no se publican** en internet.

## Estructura del proyecto

```
cv-para-todos/
├── .github/workflows/deploy.yml   ← Robot de despliegue
├── .vscode/
│   ├── tasks.json                 ← Abre el panel al pulsar "."
│   └── extensions.json
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Experience.astro
│   │   ├── Education.astro
│   │   ├── Skills.astro
│   │   ├── Projects.astro
│   │   └── SetupWizard.astro      ← Guía para nuevos usuarios
│   ├── layouts/
│   │   └── MinimalistLayout.astro
│   ├── pages/
│   │   ├── [lang]/index.astro     ← Genera /es, /it, /en
│   │   └── index.astro            ← Redirige según idioma del navegador
│   ├── data/
│   │   ├── resume.es.json
│   │   ├── resume.it.json
│   │   └── resume.en.json
│   └── i18n/
│       └── ui.ts                  ← Cadenas de interfaz
├── package.json
├── astro.config.mjs
└── tailwind.config.mjs
```

## Desarrollo local

```bash
npm install
npm run dev
```

## Despliegue

El despliegue es automático al hacer `push` a `main` via GitHub Actions.
Asegúrate de tener GitHub Pages activado en: **Settings → Pages → Source: GitHub Actions**
