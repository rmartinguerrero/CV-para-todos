# 📄 CV Para Todos

Un currículum web multiidioma, ultra rápido, privado y diseñado para ser **fácil de usar y gestionar**. 

La filosofía de este proyecto es la **simplicidad y la autonomía (No-Code / Low-Code)**: cualquier persona debe poder tener su portafolio profesional online y gestionarlo de forma visual y cómoda, sin complicaciones técnicas de backend, sin bases de datos pesadas y con total respeto a la privacidad.

---

## ✨ Características Principales

* 🌍 **Multiidioma Dinámico y Nativo:** Gestión inteligente de idiomas (Español, Inglés, Italiano...) estructurada de forma limpia en la carpeta `src/pages/[lang]/`. Cambia de idioma manteniendo la posición y la velocidad.
* ✍️ **Datos Centralizados y Limpios:** Toda la información de tu experiencia, estudios y proyectos se guarda en archivos de texto estructurados en `src/data/`, siguiendo estándares limpios y legibles.
* 🛠️ **Panel de Administración Visual:** ¡Olvídate de tocar código para actualizar tu CV! Incluye un formulario de administración muy amigable e intuitivo para modificar tus datos de forma visual en segundos.
* 🔒 **Privacidad Absoluta (FOSS):** Cero cookies, cero telemetría y sin rastreadores externos. Tu web es tuya, el código es abierto y tus datos se quedan contigo.
* ⚡ **Rendimiento de Infarto:** Construido sobre Astro y Tailwind CSS para garantizar que la web cargue instantáneamente en cualquier dispositivo, con un SEO impecable.

---

## ⚙️ Estructura del Proyecto

Para mantener las cosas organizadas y sencillas, el proyecto se divide así:

* `src/pages/[lang]/` ➔ Las páginas dinámicas de la web para cada idioma de forma automática.
* `src/data/` ➔ Los archivos de texto donde reside la información de tu currículum (`resume.es.json`, `resume.it.json`, etc.).
* `src/netlify/functions/` ➔ La lógica simple encargada de procesar el formulario visual de administración y guardar los cambios.

```
└── 📁CV-para-todos
    └── 📁.astro
        └── 📁collections
        ├── content-assets.mjs \\ Lógica de gestión de activos estáticos para el contenido.
        ├── content-modules.mjs \\ Módulos de carga y procesamiento de contenido dinámico.
        ├── content.d.ts \\ Definiciones de tipos para asegurar la integridad de las colecciones.
        ├── data-store.json \\ Almacenamiento local temporal del estado de la aplicación durante el desarrollo.
        ├── settings.json \\ Configuraciones internas del proyecto para el entorno local.
        ├── types.d.ts \\ Definiciones de tipos globales adicionales para el proyecto.
    └── 📁.github
        └── 📁workflows
            ├── deploy.yml \\ Pipeline de CI/CD para automatizar el despliegue en Netlify tras cada push.
    └── 📁.vscode
        ├── extensions.json \\ Recomendaciones de extensiones para estandarizar el entorno del equipo.
        ├── settings.json \\ Configuración específica del editor (formato, linting, integraciones).
        ├── tasks.json \\ Automatización de comandos (build, dev, lint) integrados en VS Code.
    └── 📁netlify
        └── 📁functions
            └── 📁auth
                ├── callback.ts \\ Handler específico para la finalización del flujo de autenticación OAuth.
                ├── login.ts \\ Punto de entrada para iniciar el proceso de login.
            ├── auth-callback.ts \\ Gestión centralizada del callback OAuth.
            ├── auth-login.ts \\ Gestión centralizada de la lógica de inicio de sesión.
            ├── deploy.ts \\ API para disparar el proceso de despliegue mediante la GitHub API.
            ├── load-resume.ts \\ Endpoint para recuperar el archivo JSON Resume desde el repositorio.
            ├── save.js \\ API para persistir las ediciones del usuario en el repositorio.
    └── 📁public
        ├── favicon.png \\ Icono del sitio web.
    └── 📁src
        └── 📁components
            ├── ArtisticLayout.astro \\ Bloque componente para el diseño artístico (usado para inyección de secciones).
            ├── Education.astro \\ Componente modular de la sección de educación.
            ├── Experience.astro \\ Componente modular de la sección de experiencia laboral.
            ├── Footer.astro \\ Pie de página global reutilizable.
            ├── Header.astro \\ Cabecera de navegación principal.
            ├── Projects.astro \\ Componente modular de la sección de proyectos.
            ├── SetupWizard.astro \\ Lógica del formulario inicial para nuevos usuarios.
            ├── Skills.astro \\ Componente modular de la sección de habilidades.
            ├── TechLayout.astro \\ Bloque componente para el diseño técnico (secciones de detalle).
        └── 📁data
            ├── resume.en.json \\ Estructura de plantilla inicial en inglés.
            ├── resume.es.json \\ Estructura de plantilla inicial en español.
            ├── resume.it.json \\ Estructura de plantilla inicial en italiano.
        └── 📁deploy-templates
            ├── renderer.ts \\ Motor de renderizado para transformar datos en el formato final antes del despliegue.
        └── 📁i18n
            ├── ui.ts \\ Diccionarios de textos para la interfaz multiidioma.
        └── 📁layouts
            ├── ArtisticLayout.astro \\ Layout envolvente para el estilo de CV artístico.
            ├── MinimalistLayout.astro \\ Layout envolvente para el estilo de CV minimalista.
            ├── TechyLayout.astro \\ Layout envolvente para el estilo de CV técnico.
        └── 📁lib
            ├── cv-renderer.ts \\ Biblioteca principal de renderizado del estándar JSON Resume.
        └── 📁pages
            └── 📁[lang]
                ├── cookie-policy.astro \\ Página dinámica de política de cookies.
                ├── edit.astro \\ Interfaz principal del editor No-Code (ruta protegida).
                ├── index.astro \\ Página del CV público renderizado para reclutadores.
                ├── privacy-policy.astro \\ Página dinámica de política de privacidad.
            ├── index.astro \\ Página de inicio (Landing) con detección de idioma.
        └── 📁styles
            ├── cv-themes.ts \\ Definiciones de tokens de diseño y temas visuales.
        └── 📁utils
            ├── github-oauth.ts \\ Utilidades compartidas para la gestión de sesiones de usuario.
    ├── .env.example \\ Plantilla de variables de entorno necesarias (API keys, tokens).
    ├── .gitignore \\ Archivos y directorios excluidos del control de versiones.
    ├── architecture.json \\ Documento maestro de definiciones de arquitectura y ADRs.
    ├── astro.config.mjs \\ Configuración principal del framework Astro (integraciones, adaptadores).
    ├── netlify.toml \\ Configuración de red, redirects y despliegue en Netlify.
    ├── package.json \\ Manifest de dependencias y scripts de ejecución.
    ├── pnpm-lock.yaml \\ Bloqueo de versiones para garantizar la reproducibilidad.
    ├── pnpm-workspace.yaml \\ Configuración de monorepo para pnpm.
    ├── QUICK_START.sh \\ Script automatizado para instalación rápida del proyecto.
    ├── README.md \\ Documentación general y de contribución.
    ├── SETUP_OAUTH.md \\ Guía paso a paso para configurar la GitHub App de autenticación.
    ├── tailwind.config.mjs \\ Configuración global de Tailwind CSS.
    ├── tsconfig.json \\ Configuración de TypeScript para el proyecto.
```
---

## 🚀 Stack Tecnológico

* **Framework:** [Astro 5](https://astro.build/) (SSG para rendimiento óptimo).
* **Estilos:** [Tailwind CSS](https://tailwindcss.com/) (Sistema de diseño flexible y mantenible).
* **Backend de Persistencia:** Netlify Functions (Node.js) + GitHub REST API (`@octokit/rest`).
* **Autenticación:** Flujo OAuth administrado centralmente mediante GitHub App.
* **Estándar:** Basado en [JSON Resume](https://jsonresume.org/).

---

## 🏗️ Arquitectura del Flujo (UX/UI)

1. **Fase 1 (Landing & Onboarding):** Detección automática de idioma del navegador. CTA para "Crear desde cero" (`SetupWizard`) o "Editar" (vía OAuth).
2. **Fase 2 (Formulario No-Code):** Ruta aislada `/[lang]/edit`. Formulario modular. Selector dinámico de plantillas y acciones de descarga (JSON/PDF) o publicación en la nube.
3. **Fase 3 (CV Público):** Ruta `/[lang]/index`. Carga el JSON y renderiza la plantilla seleccionada en `meta.template`. Sin botones de admin, ni scripts, protegiendo la privacidad visual.

---

## 📋 Funcionamiento e Instrucciones de Uso

### 1. Inicialización y SetupWizard
Al acceder por primera vez, el `SetupWizard` permite:
* **Crear desde cero:** Llenar campos visualmente.
* **Importar datos:** Puedes cargar un archivo `resume.json` estándar. El sistema importa el contenido, lo valida y lo almacena localmente para que puedas editarlo y previsualizarlo antes de publicar.

### 2. Gestión de Datos (Archivo Universal)
El sistema utiliza archivos `src/data/resume.[lang].json`. 
* La propiedad `meta.template` en el JSON permite cambiar la apariencia visual del CV de forma instantánea.
* El `SetupWizard` ayuda a mapear correctamente las claves del archivo importado con el estándar del proyecto.

### 3. Publicación
Al presionar el botón de "Publicar" en el editor, una *Netlify Function* realiza un `push` seguro a tu repositorio de GitHub, actualizando el archivo JSON fuente y disparando una nueva compilación (build) del sitio.

---

## 💻 Desarrollo Local

Poner la web en marcha en tu ordenador es sumamente sencillo. Solo abre tu terminal y sigue estos dos pasos:

### 1. Instalar las dependencias
Instala los paquetes necesarios de forma ultra rápida usando `pnpm`:
```bash
pnpm install