<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/🇪🇸-ES-ff4b4b?style=for-the-badge&labelColor=1a1a2e" alt="Español"></a>
  <a href="README.EN.md"><img src="https://img.shields.io/badge/🇬🇧-EN-4b8bff?style=for-the-badge&labelColor=1a1a2e" alt="English"></a>
  <a href="README.IT.md"><img src="https://img.shields.io/badge/🇮🇹-IT-2ecc71?style=for-the-badge&labelColor=1a1a2e" alt="Italiano"></a>
</p>

# 📄 CV Para Todos

Un currículum web multiidioma, ultra rápido, privado y diseñado para ser **fácil de usar y gestionar**. 

CV para Todos nace como una alternativa libre y transparente frente a plataformas que limitan funciones tras un pago, monetizan los datos personales o dificultan la exportación del currículum. El objetivo es que cualquier persona pueda crear, gestionar y publicar su CV de forma sencilla, sin costes ocultos y manteniendo siempre el control sobre su información.

La filosofía de este proyecto es la **simplicidad y la autonomía (No-Code / Low-Code)**: cualquier persona debe poder tener su portafolio profesional online y gestionarlo de forma visual y cómoda, sin complicaciones técnicas de backend, sin bases de datos pesadas y con total respeto a la privacidad.

---

🌐 **[Ver Demo en Vivo](https://rmartinguerrero.github.io/personal-resume/)**

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
3. **Fase 3 (CV Público):** Ruta `/[lang]/index`. Carga el JSON y renderiza la plantilla seleccionada en `meta.template`.

---

## 🤖 Desarrollo Asistido por IA

Este proyecto ha sido desarrollado con la ayuda de herramientas de Inteligencia Artificial como apoyo durante el diseño, la programación, la documentación y las tareas de revisión.

La IA ha sido utilizada para:

- 💡 Proponer soluciones técnicas y alternativas de implementación.
- 🏗️ Ayudar en el diseño de la arquitectura del proyecto.
- 🔍 Detectar errores, realizar auditorías y sugerir mejoras.
- 🌍 Facilitar la internacionalización y la generación de documentación.
- 🧪 Revisar código y validar decisiones de diseño.

Todas las decisiones finales, la arquitectura, la supervisión del código y la dirección del proyecto corresponden a **Raúl Martín Guerrero**.

El objetivo es demostrar que la IA puede ser una excelente herramienta de apoyo para desarrollar software libre de calidad, manteniendo siempre el criterio humano como responsable final.

---
## 🧠 Archivo `architecture.json`

El repositorio incluye un archivo denominado `architecture.json`, que actúa como la documentación técnica central del proyecto.

Este archivo reúne información estructurada sobre:

- 📐 Arquitectura general.
- 🏛️ Decisiones de diseño (ADR).
- 🔄 Flujos de funcionamiento.
- 📂 Estructura del proyecto.
- 🛠️ Tecnologías utilizadas.
- 📋 Convenciones de desarrollo.
- 🐞 Problemas detectados y soluciones aplicadas.
- 🚀 Evolución del proyecto.

El archivo architecture.json está pensado para que tanto personas como asistentes de IA puedan comprender rápidamente la arquitectura del proyecto y colaborar de forma más eficiente, manteniendo la coherencia de las decisiones técnicas adoptadas.

Se recomienda mantener este archivo actualizado cuando se introduzcan cambios importantes en la arquitectura o en el flujo de trabajo del proyecto.

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
## 📋 Requisitos

Antes de comenzar, asegúrate de tener instalado:

* **Node.js 20** o superior.
* **pnpm 10** o superior.
* **Netlify CLI** (para ejecutar las funciones de Netlify en desarrollo).
* Una **cuenta de GitHub** (solo necesaria si deseas publicar tu CV directamente desde el editor mediante OAuth).

Puedes comprobar que todo está instalado ejecutando:

```bash
node -v
pnpm -v
netlify --version
```

## 💻 Desarrollo Local

Poner la web en marcha en tu ordenador es muy sencillo.

### 1. Instalar las dependencias

Instala los paquetes necesarios utilizando **pnpm**:

```bash
pnpm install
```

### 2. Configurar las variables de entorno

El proyecto incluye un archivo **`.env.example`** con todas las variables necesarias para ejecutar la aplicación.

Solo debes copiarlo y renombrarlo como **`.env.local`**:

```bash
cp .env.example .env.local
```

o en Windows:

```powershell
copy .env.example .env.local
```

Después, abre el archivo `.env.local` y completa los valores correspondientes:

* `GITHUB_CLIENT_ID`
* `GITHUB_CLIENT_SECRET`
* `GITHUB_REDIRECT_URI`
* Cualquier otra variable necesaria para tu entorno.

Para configurar correctamente la autenticación OAuth puedes seguir la guía incluida en:

```
SETUP_OAUTH.md
```

### 3. Ejecutar el proyecto

Una vez configurado el entorno:

```bash
pnpm install
npx netlify dev
```

Netlify CLI cargará automáticamente las variables definidas en `.env.local`.

---

## 🔐 Variables de entorno

El repositorio **sí incluye** un archivo:

```
.env.example
```

Este archivo sirve únicamente como plantilla y puede subirse al repositorio sin ningún problema, ya que **no contiene credenciales reales**.

Nunca debes subir tus claves personales.

Los archivos reales de configuración como:

```
.env
.env.local
.env.production.local
```

deben permanecer siempre privados.

---

## 🚫 Archivos que NO deben subirse al repositorio

El proyecto ya incluye un `.gitignore` preparado para evitar subir archivos temporales, compilaciones y credenciales.

Entre ellos:

### Dependencias

```
node_modules/
.pnpm-store/
```

### Archivos generados por Astro

```
dist/
.astro/
```

### Archivos locales de Netlify

```
.netlify/
```

### Variables de entorno

```
.env
.env.local
.env.*.local
```

### Logs

```
*.log
npm-debug.log*
pnpm-debug.log*
```

### Archivos temporales

```
deno.lock
```

### Archivos del sistema operativo

```
.DS_Store
Thumbs.db
```

> **Importante:** El único archivo relacionado con la configuración que debe mantenerse en el repositorio es **`.env.example`**, ya que actúa como plantilla para que cualquier usuario pueda configurar el proyecto sin exponer información sensible.


## 📜 Licencia

Este proyecto está distribuido bajo la **GNU General Public License v3.0 (GPL-3.0)**.

Su objetivo es garantizar que **CV para Todos** permanezca siempre como software libre, permitiendo a cualquier persona utilizarlo, estudiarlo, modificarlo y compartirlo.

Si redistribuyes este proyecto o una versión modificada, deberás hacerlo respetando los términos de la licencia GPL v3 y mantener el código fuente disponible conforme a dicha licencia.

Copyright © 2026 Raúl Martín Guerrero

Puedes consultar el texto completo de la licencia en el archivo `LICENSE` incluido en este repositorio.

## 🧠 Autor

Proyecto desarrollado por **Raúl Martín Guerrero**.

Si este proyecto te resulta útil, considera darle una ⭐ al repositorio de GitHub. Ayuda a que más personas descubran una alternativa libre, transparente y respetuosa con la privacidad para crear y publicar su currículum.