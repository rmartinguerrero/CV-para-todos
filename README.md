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
* `src/data/` ➔ Los archivos de texto donde reside la información de tu currículum.
* `src/netlify/functions/` ➔ La lógica simple encargada de procesar el formulario visual de administración y guardar los cambios.

---

## 💻 Desarrollo Local

Poner la web en marcha en tu ordenador es sumamente sencillo. Solo abre tu terminal y sigue estos dos pasos:

### 1. Instalar las dependencias
Instala los paquetes necesarios de forma ultra rápida usando `pnpm`:
```bash
pnpm install