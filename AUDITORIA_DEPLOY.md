# Auditoría de Flujo de Publicación — CV para Todos

## 1. Flujo Completo Detectado

```
[Frontend (edit.astro)]              [Netlify Functions]               [GitHub API]
         │                                      │                              │
         ├─ click "Publicar"                    │                              │
         │   (verifica cookie github_user)       │                              │
         │                                      │                              │
         ├─ POST /.netlify/functions/deploy ───►│                              │
         │  body: {                              │                              │
         │    langs,                             │                              │
         │    resumeDataByLang,                  │                              │
         │    template                           │                              │
         │  }                                    │                              │
         │  credentials: 'include'               │                              │
         │                                      │                              │
         │                                      ├─ GET /repos/{user}/cv-para-todos
         │                                      │  200 → repo existe           │
         │                                      │  404 → POST repo (auto_init) │
         │                                      │                              │
         │                                      ├─ Recorrer /contents recursivo│
         │                                      │  (listar todos los archivos) │
         │                                      │                              │
         │                                      ├─ DELETE archivos obsoletos   │
         │                                      │  (los que no están en        │
         │                                      │   allowedFiles)              │
         │                                      │                              │
         │                                      ├─ PUT style.css              │
         │                                      ├─ PUT index.html             │
         │                                      ├─ PUT .nojekyll              │
         │                                      ├─ PUT profile.jpg            │
         │                                      ├─ PUT resume.{lang}.json     │
         │                                      ├─ PUT {lang}/index.html      │
         │                                      │                              │
         │                                      ├─ UPDATE /pages (source=main)│
         │                                      │  o CREATE /pages              │
         │                                      ├─ POST /pages/build (request)│
         │                                      │                              │
         │                                      ├─ POLL /pages/build (c/3s)   │
         │                                      │  ──► hasta 60 segundos ──►   │
         │                                      │                              │
         │◄─────────────────────────────────────┤                              │
         │  { success, webUrl }                  │                              │
```

## 2. Problemas Encontrados

### 🔴 PROBLEMA 1 — Rutas absolutas incorrectas en HTML generado

**Archivo:** `netlify/functions/deploy.ts`

| Línea | Código | Problema |
|-------|--------|----------|
| 151 | `window.location.replace('/'+p+'/')` | La redirección apunta a `https://dominio/es/` en vez de `https://dominio/repo/es/` |
| 159 | `<a href="/${l}/"` | Igual: enlaces de idioma apuntan a la raíz del dominio |
| 226 | `<link rel="stylesheet" href="/style.css" />` | CSS se carga desde `https://dominio/style.css` en vez de `https://dominio/repo/style.css` |
| 238 | `src="/profile.jpg"` | Foto se carga desde la raíz del dominio |

**Causa raíz:** Todas las rutas en el HTML generado usan barras iniciales absolutas (`/archivo`). Cuando el sitio se publica como project page (`https://user.github.io/cv-para-todos/`), estas rutas resuelven a `https://user.github.io/archivo` en vez de `https://user.github.io/cv-para-todos/archivo`.

**Síntoma:** 404 en todos los assets y en la redirección entre idiomas.

---

### 🔴 PROBLEMA 2 — Timeout de Netlify Function por polling excesivo

**Archivo:** `netlify/functions/deploy.ts:531-545`

```typescript
const maxWait = Date.now() + 60000;
while (Date.now() < maxWait) {
  const buildStatus = await octokit.repos.getLatestPagesBuild({...});
  if (buildStatus.data.status === 'built') break;
  await new Promise(r => setTimeout(r, 3000));
}
```

**Causa raíz:** El bucle de espera puede durar hasta 60 segundos. Netlify Functions en plan gratuito tienen timeout máximo de **10 segundos** (pro: 26s). Además, antes del bucle ya hay ~15 llamadas API secuenciales que consumen 7-15 segundos.

**Impacto:**
1. La función muere silenciosamente a los 10s de ejecución.
2. Las escrituras en GitHub que ya se completaron persisten (archivos en el repo).
3. Pages NO se configura (el código de Pages está DESPUÉS de las escrituras pero DENTRO del mismo bloque try, y el timeout mata todo).
4. El frontend (edit.astro:937-943) entra en el `catch` del fetch y muestra *"Error de conexión"*.
5. El usuario ve el repo con archivos pero su web no se publica.

**Archivo:** `src/pages/[lang]/edit.astro:937-943`

```javascript
const response = await fetch('/.netlify/functions/deploy', {...});
const data = await response.json();
// ...
} catch (err) {
  alert(lang === 'es' ? 'Error de conexión.' : ...);
}
```

**Síntoma:** *"Error de conexión"* en el frontend aunque el repo se haya creado.

---

### 🟡 PROBLEMA 3 — Orden incorrecto: limpieza antes de escritura

**Archivo:** `netlify/functions/deploy.ts:446-451`

```typescript
const allFiles = await listRepoFiles(octokit, ...);
for (const file of allFiles) {
  if (!allowedFiles.has(file)) {
    await deleteFileIfNeeded(octokit, ..., file);
  }
}
// DESPUÉS se escriben los archivos nuevos
```

**Causa raíz:** La limpieza de archivos obsoletos ocurre ANTES de escribir los nuevos. Si el timeout mata la función entre la limpieza y la escritura, el repo queda vacío.

**Caso concreto:** Repo nuevo con `auto_init: true` → trae `README.md` → se elimina → timeout → repo vacío sin archivos y sin Pages configurado.

---

### 🟡 PROBLEMA 4 — Primer deploy de GitHub Pages tarda 1-5 minutos

**Causa raíz:** Incluso con Pages correctamente configurado y build disparado, el primer despliegue tarda entre 1 y 5 minutos. Hasta entonces la URL devuelve 404.

**Archivo:** `netlify/functions/deploy.ts:547-549`

```typescript
const webUrl = `https://${username}.github.io/${pagePath}`;
// Se devuelve inmediatamente, sin verificar disponibilidad real
```

**Síntoma:** El usuario recibe la URL, la abre inmediatamente y ve 404.

---

### 🟡 PROBLEMA 5 — Token OAuth sin permiso explícito para Pages API

**Archivo:** `netlify/functions/auth-login.ts:61`

```typescript
const scope = ['repo', 'user:email'];
```

**Causa raíz:** El scope `repo` debería ser suficiente para `createPagesSite` y `updateInformationAboutPagesSite`, pero algunos tokens OAuth generados por GitHub requieren autorización explícita adicional. Si la API devuelve 403, el error se traga silenciosamente.

**Archivo:** `netlify/functions/deploy.ts:500-503, 515-517`

```typescript
catch (updateError: any) {
  if (updateError.status !== 404) {
    console.warn('Error updating Pages config:', ...);
  }
}
// solo warn, no se propaga el error
```

**Síntoma:** Pages nunca se configura, el sitio nunca se publica, pero no hay error visible.

---

### 🟢 PROBLEMA 6 — Variable PUBLISHED_REPO_NAME fija

**Archivo:** `netlify/functions/deploy.ts:33`

```typescript
const PUBLISHED_REPO_NAME = process.env.PUBLISHED_REPO_NAME || 'cv-para-todos';
```

**Archivo:** `netlify/functions/deploy.ts:548`

```typescript
const pagePath = PUBLISHED_REPO_NAME === `${username}.github.io` ? '' : `${PUBLISHED_REPO_NAME}/`;
```

**Causa raíz:** El chequeo para user site (`username.github.io`) nunca se cumple porque `PUBLISHED_REPO_NAME` es siempre `'cv-para-todos'` a menos que se configure específicamente. La URL siempre es de project page.

**Impacto:** Bajo — la URL funciona igual, solo es más larga.

---

### 🟢 PROBLEMA 7 — Sin feedback contextual en frontend

**Archivo:** `src/pages/[lang]/edit.astro:936-946`

```javascript
} catch (err) {
  console.error('Error:', err);
  alert('Error de conexión.');
}
```

**Causa raíz:** Solo hay dos estados: éxito con URL, o error genérico. No hay estados intermedios ("configurando Pages", "esperando build", etc.).

---

## 3. Resumen de Severidad

| # | Problema | Archivo | Líneas | Severidad |
|---|----------|---------|--------|:--------:|
| 1 | Rutas absolutas en HTML | `deploy.ts` | 151, 159, 226, 238 | 🔴 CRÍTICO |
| 2 | Timeout Netlify (polling 60s) | `deploy.ts` | 531-545 | 🔴 CRÍTICO |
| 3 | Limpieza antes de escritura | `deploy.ts` | 446-451 | 🟡 ALTO |
| 4 | Primer deploy Pages lento | `deploy.ts` | 547-549 | 🟡 ALTO |
| 5 | Token OAuth sin permiso Pages | `auth-login.ts` | 61 | 🟡 MEDIO |
| 6 | PUBLISHED_REPO_NAME fijo | `deploy.ts` | 33, 548 | 🟢 BAJO |
| 7 | Sin feedback contextual | `edit.astro` | 936-946 | 🟢 BAJO |
