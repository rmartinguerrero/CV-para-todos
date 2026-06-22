# Plan de Corrección — Publicación CV para Todos

Correcciones ordenadas por prioridad. Cada corrección indica sus dependencias.

---

## Prioridad 1 — Rutas relativas en HTML generado

**Corrige:** Problema 1 (🔴 CRÍTICO — rutas absolutas)

**Dependencias:** Ninguna

**Archivo:** `netlify/functions/deploy.ts`

**Cambios:**

1.1. En `renderRootIndex()` (línea ~145-153): cambiar path en `window.location.replace` de absoluto a relativo:

```
window.location.replace('/' + p + '/')
  → window.location.replace('./' + p + '/')
```

1.2. En `renderCvPage()` (línea ~155): añadir un prefijo de ruta base. La función recibe `langs` pero no sabe si la publicación es project page o user site. Solución: pasar el `pagePath` como parámetro:

```
function renderCvPage(resume, lang, template, langs, basePath = '')
```

Donde `basePath` es `'/cv-para-todos'` o `''`. Todas las rutas en el HTML generado se construyen como:

```
href="${basePath}/${l}/"
href="${basePath}/style.css"
src="${basePath}/profile.jpg"
```

1.3. Cambiar enlaces de navegación de idiomas (`deploy.ts:159`):

```
<a href="/${l}/"
  → <a href="${basePath}/${l}/"
```

1.4. Cambiar CSS link (`deploy.ts:226`):

```
<link rel="stylesheet" href="/style.css" />
  → <link rel="stylesheet" href="${basePath}/style.css" />
```

1.5. Cambiar imagen de perfil (`deploy.ts:238`):

```
src="/profile.jpg"
  → src="${basePath}/profile.jpg"
```

1.6. Pasar `basePath` desde el handler principal:

```typescript
const pagePath = PUBLISHED_REPO_NAME === `${username}.github.io` ? '' : `${PUBLISHED_REPO_NAME}/`;
const basePath = pagePath ? `/${PUBLISHED_REPO_NAME}` : '';
```

---

## Prioridad 2 — Eliminar polling de 60s y timeout de función

**Corrige:** Problema 2 (🔴 CRÍTICO — timeout), Problema 4 (🟡 ALTO — Pages lento)

**Dependencias:** Ninguna

**Archivo:** `netlify/functions/deploy.ts`

**Cambios:**

2.1. Eliminar bucle de espera de Pages build (líneas 531-545):

```
// Se elimina TODO el bloque:
//   const maxWait = Date.now() + 60000;
//   while (Date.now() < maxWait) { ... }
```

2.2. Eliminar `requestPagesBuild` (líneas 520-529). Pages se auto-construye al configurar el source.

2.3. Configurar Pages (try update / try create) y devolver éxito inmediatamente.

2.4. Opcional: añadir timeout de función en `netlify.toml`:

```toml
[functions]
  timeout = 30
```

Esto evita timeouts prematuros en operaciones API lentas (no para polling, solo como red de seguridad).

**Resultado:** La función deploy ejecuta ~10-15 llamadas API (~7-15s) y devuelve la URL. El usuario ve éxito. Si Pages tarda en estar disponible, es un problema separado manejado desde el frontend.

---

## Prioridad 3 — Invertir orden: escribir antes de limpiar

**Corrige:** Problema 3 (🟡 ALTO — limpieza prematura)

**Dependencias:** Prioridad 1 (las escrituras nuevas deben usar las rutas corregidas)

**Archivo:** `netlify/functions/deploy.ts`

**Cambios:**

3.1. Mover el bloque de limpieza (listRepoFiles + deleteFileIfNeeded) DESPUÉS del bloque de escritura de archivos.

Orden nuevo:

```
1. Escribir style.css
2. Escribir index.html
3. Escribir .nojekyll
4. Escribir profile.jpg
5. Escribir resume.{lang}.json
6. Escribir {lang}/index.html
7. [AHORA] listRepoFiles + delete obsoletos
8. Configurar Pages
```

3.2. Para repos nuevos con `auto_init: true`, el `README.md` se eliminará en el paso 7 (post-escritura). Si la función muere entre el paso 6 y 7, el README.md sigue existiendo → GitHub no queda vacío.

**Resultado:** El repo nunca queda vacío aunque la función falle a medio camino.

---

## Prioridad 4 — Feedback asíncrono desde el frontend

**Corrige:** Problema 4 (🟡 ALTO — Pages lento), Problema 7 (🟢 BAJO — sin feedback)

**Dependencias:** Prioridad 2 (sin ella el frontend nunca recibe respuesta exitosa)

**Archivo:** `src/pages/[lang]/edit.astro`

**Cambios:**

4.1. Después de recibir `{ success, webUrl }`, mostrar:

```
"¡Publicado! Tu CV se está desplegando en:
 {data.webUrl}
Estará disponible en 1-5 minutos."
```

4.2. Opcional: añadir botón "Comprobar disponibilidad" que haga un fetch a `{webUrl}` y muestre "Listo" o "Todavía no".

4.3. Cambiar el catch para distinguir entre error de red vs error del servidor:

```javascript
catch (err) {
  if (err instanceof TypeError && err.message === 'Failed to fetch') {
    // Timeout o red caída — posible deploy lento
    alert('El deploy está en proceso. Revisa tu repositorio en GitHub.');
  } else {
    alert(data.error || 'Error al publicar.');
  }
}
```

**Resultado:** El usuario entiende que el proceso continúa aunque GitHub Pages no esté disponible instantáneamente.

---

## Prioridad 5 — Ampliar scopes OAuth

**Corrige:** Problema 5 (🟡 MEDIO — token sin permiso Pages)

**Dependencias:** Ninguna

**Archivo:** `netlify/functions/auth-login.ts`

**Cambios:**

5.1. Añadir scope `workflow` si no está presente:

```typescript
const scope = ['repo', 'user:email', 'workflow'];
```

5.2. Verificar que en GitHub OAuth App configuration esté marcado el checkbox para `workflow` scope.

**Resultado:** El token OAuth tiene permisos completos para configurar Pages y manejar workflows si es necesario.

---

## Prioridad 6 — Extraer prefijo de ruta como parámetro

**Corrige:** Problema 6 (🟢 BAJO — PUBLISHED_REPO_NAME fijo)

**Dependencias:** Prioridad 1 (introduce `basePath`)

**Archivo:** `netlify/functions/deploy.ts`

**Cambios:**

6.1. Mover la lógica de `basePath` al handler principal y pasarla a `renderRootIndex` y `renderCvPage` como parámetro.

6.2. Evaluar correctamente si es user site vs project page:

```typescript
const isUserSite = PUBLISHED_REPO_NAME === `${username}.github.io`;
const basePath = isUserSite ? '' : `/${PUBLISHED_REPO_NAME}`;
const pagePath = isUserSite ? '' : `${PUBLISHED_REPO_NAME}/`;
```

---

## Dependencias entre correcciones

```
P1 (rutas) ──────┬────── P3 (orden)
                 │
                 └────── P6 (basePath param)

P2 (timeout) ────┬────── P4 (feedback frontend)
                 │
                 (independiente)

P5 (scopes) ───── (independiente)

P3 (orden) ────── (independiente)
```

**Orden de implementación recomendado:**

1. **P2** — eliminar polling (máximo impacto, sin dependencias)
2. **P1** — rutas relativas (dependencia de P3 y P6)
3. **P3** — invertir orden escritura/limpieza (depende de P1)
4. **P6** — extraer basePath (depende de P1)
5. **P5** — scopes OAuth (sin dependencias)
6. **P4** — feedback frontend (depende de P2)

---

## Resumen de archivos a modificar

| Archivo | Prioridades involucradas |
|---------|-------------------------|
| `netlify/functions/deploy.ts` | P1, P2, P3, P6 |
| `netlify/functions/auth-login.ts` | P5 |
| `src/pages/[lang]/edit.astro` | P4 |
| `netlify.toml` | P2 (opcional) |
