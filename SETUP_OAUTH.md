# 🚀 Guía de Configuración - Arquitectura OAuth y Despliegue

Esta guía cubre la nueva arquitectura descentralizada del generador de CVs con autenticación OAuth y fork automático en GitHub.

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Configuración de GitHub OAuth App](#configuración-de-github-oauth-app)
3. [Variables de Entorno](#variables-de-entorno)
4. [Arquitectura de Autenticación](#arquitectura-de-autenticación)
5. [Flujos de Usuario](#flujos-de-usuario)
6. [Despliegue en GitHub Pages](#despliegue-en-github-pages)
7. [Seguridad y Privacidad](#seguridad-y-privacidad)

## 🎯 Descripción General

La nueva arquitectura implementa:

- **Autenticación OAuth 2.0**: Los usuarios se conectan de forma segura con su cuenta GitHub
- **Fork Automático**: Cuando un usuario publica por primera vez, se crea automáticamente un fork en su cuenta
- **Despliegue en GitHub Pages**: El CV se publica en `username.github.io/cv-para-todos`
- **Privacidad Absoluta**: El editor (`/edit`) solo existe en el repositorio fuente, NO en la web estática
- **Sincronización Continua**: Los usuarios pueden seguir editando desde nuestra plataforma

## 🔐 Configuración de GitHub OAuth App

### Paso 1: Crear OAuth App en GitHub

1. Ve a https://github.com/settings/developers
2. Haz clic en "OAuth Apps" → "New OAuth App"
3. Rellena el formulario:

   | Campo | Valor |
   |-------|-------|
   | Application name | `CV para Todos` (o tu nombre) |
   | Homepage URL | `https://tu-dominio.com` |
   | Authorization callback URL | `https://tu-dominio.com/.netlify/functions/auth-callback` |
   | Application description | (Opcional) |

4. GitHub generará:
   - **Client ID**: Público, se puede compartir
   - **Client Secret**: SECRETO, nunca lo compartas públicamente

### Paso 2: Copiar las Credenciales

```bash
# Copiar el archivo de ejemplo
cp .env.example .env.local

# Editar con tus valores
nano .env.local
```

Edita los campos:

```env
GITHUB_CLIENT_ID=your_client_id_from_github
GITHUB_CLIENT_SECRET=your_client_secret_from_github
GITHUB_REDIRECT_URI=https://tu-dominio.com/.netlify/functions/auth-callback
```

### Paso 3: Configurar en Netlify

1. Ve a tu sitio en Netlify → **Settings** → **Build & Deploy** → **Environment**
2. Haz clic en **Edit variables**
3. Añade las mismas tres variables de arriba
4. Guarda

> ⚠️ **Importante**: 
> - `.env.local` está en `.gitignore` y no será tracked por Git
> - En Netlify, las variables se configuran en el dashboard, no en el código

## 🌍 Variables de Entorno

### Variables Requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `GITHUB_CLIENT_ID` | Client ID de GitHub OAuth App | `abc123def456` |
| `GITHUB_CLIENT_SECRET` | Client Secret de GitHub OAuth App | `ghs_xxxx...` |
| `GITHUB_REDIRECT_URI` | URL de callback OAuth | `https://example.com/.netlify/functions/auth-callback` |

### Variables Opcionales

| Variable | Descripción | Por defecto |
|----------|-------------|------------|
| `DEPLOY_URL` | URL del sitio (se rellena en Netlify automáticamente) | `http://localhost:3000` |
| `DEFAULT_LANG` | Idioma por defecto | `es` |
| `BASE_REPO` | Repositorio base para fork (ajusta al repo del proyecto si no estás usando `raul/cv-para-todos`) | `raul/cv-para-todos` |

## 🔄 Arquitectura de Autenticación

```
┌─────────────────────────────────────────────────────────────┐
│ Cliente (Navegador)                                         │
├─────────────────────────────────────────────────────────────┤
│  1. Usuario hace clic en "Conectar GitHub"                 │
│  2. Se redirige a /.netlify/functions/auth-login          │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ /.netlify/functions/auth-login.ts                         │
├─────────────────────────────────────────────────────────────┤
│  - Genera random "state" (CSRF protection)                 │
│  - Guarda state en cookie HttpOnly                         │
│  - Redirige a: https://github.com/login/oauth/authorize    │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ GitHub.com (Autorización)                                   │
├─────────────────────────────────────────────────────────────┤
│  - Usuario ve permisos solicitados                         │
│  - Haz clic en "Authorize cv-para-todos"                   │
│  - GitHub redirige a callback con "code"                   │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ /.netlify/functions/auth-callback.ts                      │
├─────────────────────────────────────────────────────────────┤
│  - Valida "state" (CSRF check)                            │
│  - Intercambia "code" por "access_token" (llamada POST)    │
│  - Valida token con API de GitHub                          │
│  - Guarda token en cookie HttpOnly                         │
│  - Guarda username en cookie visible                       │
│  - Redirige a /es/edit                                     │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ /[lang]/edit.astro                                         │
├─────────────────────────────────────────────────────────────┤
│  - Lee cookies (github_token, github_user)                 │
│  - Si está autenticado: carga resume desde GitHub          │
│  - Muestra UI con estado de autenticación                  │
└─────────────────────────────────────────────────────────────┘
```

## 👥 Flujos de Usuario

### Flujo 1: Crear CV nuevo (Sin GitHub)

```
Usuario → Llena formulario → Guarda en localStorage → Descarga JSON
```

### Flujo 2: Importar CV existente (Sin GitHub)

```
Usuario → Sube resume.es.json → Se carga en editor → Puede editar
```

### Flujo 3: Publicar CV en web propia (Con GitHub)

```
Usuario → Llena formulario → Hace clic "Publicar"
    ↓
¿Autenticado?
    ├─ NO: Redirige a login GitHub
    │       ↓
    │   Usuario se autentica
    │       ↓
    │   Regresa a editor
    │
    └─ SÍ: Endpoints /api/deploy
        ├─ Crear fork (si no existe)
        ├─ Guardar resume.es.json
        ├─ Activar GitHub Pages
        ↓
Retorna URL: https://username.github.io/cv-para-todos
```

### Flujo 4: Edición Continua

```
Usuario vuelve después de días → Se autentica → Carga resume remoto desde su fork
    ↓
Editando en editor → Botón "Publicar" → Sincroniza con fork
```

## 🚀 Despliegue en GitHub Pages

### Configuración Automática

El endpoint `/api/deploy` automáticamente:

1. ✅ Crea fork en `username/cv-para-todos`
2. ✅ Actualiza archivos `src/data/resume.[lang].json`
3. ✅ Intenta activar GitHub Pages

### Si GitHub Pages NO se activa automáticamente

En el fork del usuario:

1. Ve a **Settings** → **Pages**
2. Selecciona "Deploy from a branch"
3. Rama: `main`
4. Carpeta: `/` (raíz)
5. Guarda

Tu CV estará en: `https://username.github.io/cv-para-todos/`

## 🔐 Seguridad y Privacidad

### Cookie de Token

```javascript
// Tipo: HttpOnly
// Secure: true (solo HTTPS)
// SameSite: Lax
// Max-Age: 1 año
github_token=<access_token_secreto>
```

✅ **Ventajas:**
- No accesible desde JavaScript (protección XSS)
- Solo se envía en HTTPS
- Se recibe automáticamente en fetch con `credentials: 'include'`

### Eliminación de Archivos de Edición

El workflow `.github/workflows/deploy.yml`:

```yaml
- name: Remove edit and wizard components (Privacy)
  run: |
    rm -f src/pages/[lang]/edit.astro
    rm -f src/components/SetupWizard.astro
```

**Resultado:**
- ❌ Reclutadores NO pueden acceder a `/edit`
- ❌ NO pueden ver el formulario
- ✅ La web estática solo contiene CVs publicados
- ✅ El CV es completamente privado

### Permisos Mínimos de OAuth

Solicitamos permisos:
- `repo`: Para crear fork, guardar archivos
- `user:email`: Para mostrar email del usuario

No solicitamos:
- ❌ Código fuente privado
- ❌ Acceso a issues/PRs
- ❌ Permisos de administración

## 📝 TypeScript - Tipos Principales

### `src/utils/github-oauth.ts`

```typescript
export interface DeployResponse {
  success: boolean;
  message: string;
  repository: string;
  webUrl: string;
  updateResults: any[];
}

export interface LoadResumeResponse {
  authenticated: boolean;
  data: any;
  source?: string;
}
```

## 🛠️ Desarrollo Local

### Con Netlify CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Autenticarse
netlify login

# Ejecutar en desarrollo
netlify dev

# Visitará: http://localhost:8888
```

### Variables en Desarrollo

Crear `.env.local`:

```env
GITHUB_CLIENT_ID=test_client_id
GITHUB_CLIENT_SECRET=test_client_secret
GITHUB_REDIRECT_URI=http://localhost:8888/.netlify/functions/auth-callback
DEPLOY_URL=http://localhost:8888
```

### Probar OAuth Localmente

Para evitar problemas con localhost, usar ngrok:

```bash
# Terminal 1: Netlify dev
netlify dev

# Terminal 2: ngrok
ngrok http 8888

# Obtendrás URL como: https://abc123.ngrok.io

# Actualizar GitHub OAuth App:
# Authorization callback URL: https://abc123.ngrok.io/.netlify/functions/auth-callback

# Actualizar .env.local:
GITHUB_REDIRECT_URI=https://abc123.ngrok.io/.netlify/functions/auth-callback
DEPLOY_URL=https://abc123.ngrok.io
```

## ❓ Preguntas Frecuentes

### P: ¿Dónde se guardan los datos del usuario?

R: En el repositorio PRIVADO del usuario en GitHub (`username/cv-para-todos`). Nadie más puede acceder a menos que el usuario lo comparta.

### P: ¿Qué sucede si revoco permisos en GitHub?

R: La cookie de token se invalida. El usuario debe reconectarse.

### P: ¿Puedo usar otro proveedor OAuth (Google, etc.)?

R: Actualmente solo GitHub. Puedes expandir el código en `netlify/functions/auth/` para agregar más proveedores.

### P: ¿Cómo hago despliegue manual sin GitHub Actions?

R: El usuario puede usar `git push` en su fork, y GitHub Pages se construirá automáticamente (si tiene Astro configurado en el workflow).

### P: ¿Los reclutadores pueden ver el editor?

R: NO. El workflow elimina `edit.astro` antes de compilar, devolviendo 404 a cualquiera que intente acceder a `/edit`.

## 📞 Soporte

Para problemas con:
- **OAuth**: Revisa la consola del navegador (DevTools) para mensajes de error
- **Despliegue**: Ve a tu fork → Actions → mira los logs del workflow
- **Seguridad**: Revisa la [documentación de GitHub](https://docs.github.com/es/developers/apps/building-oauth-apps)

---

**Versión:** 1.0  
**Última actualización:** Junio 2026
