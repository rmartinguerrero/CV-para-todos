# CV para Todos — Audit Report

**Date:** 2026-07-26  
**Scope:** Safe improvements to SEO, UI/UX, Accessibility, i18n, Performance, Security  
**Constraint:** No breaking changes to OAuth, deployment, Netlify Functions, GitHub API, CV Live, templates, PDF, or backend architecture. No file deletions.

---

## PHASE 1: SEO — COMPLETED (10/10)

| # | Item | File(s) | Status |
|---|------|---------|--------|
| 1 | `robots.txt` with crawl rules | `public/robots.txt` | **Created** |
| 2 | Dynamic `sitemap.xml` with hreflang | `src/pages/sitemap.xml.ts` | **Created** |
| 3 | `<link rel="canonical">` on all pages | All 3 layouts | **Added** |
| 4 | `hreflang` tags (es/it/en + x-default) | All 3 layouts | **Added** |
| 5 | `robots` meta support | All 3 layouts | **Added** (used for noindex on /edit) |
| 6 | `ogType` prop on layouts | All 3 layouts | **Added** (profile for CV, website for others) |
| 7 | `jsonLd` prop on layouts | All 3 layouts | **Added** |
| 8 | Person JSON-LD on CV pages | `src/pages/[lang]/index.astro` | **Added** |
| 9 | FAQPage + SoftwareApplication JSON-LD | `src/components/SetupWizard.astro` | **Added** |
| 10 | Localized meta descriptions | `src/pages/[lang]/index.astro`, `edit.astro` | **Fixed** |

---

## PHASE 2: UI/UX — COMPLETED

| # | Item | File(s) | Status |
|---|------|---------|--------|
| 1 | Tab nav → form gap increased (`pt-3`) | `edit.astro` | **Done** |
| 2 | Section gaps increased (`mt-6` → `mt-8`) | `edit.astro` (6 sections) | **Done** |
| 3 | Main grid gap increased (`lg:gap-8` → `lg:gap-10`) | `edit.astro` | **Done** |
| 4 | Form field spacing increased (`space-y-4` → `space-y-5`) | `edit.astro` | **Done** |
| 5 | SetupWizard section spacing increased | `SetupWizard.astro` | **Done** |

---

## PHASE 3: A11y — COMPLETED

| # | Item | File(s) | Status |
|---|------|---------|--------|
| 1 | `id`/`for` on form labels (name, label, email, phone, website, summary) | `edit.astro` | **Added** |
| 2 | ARIA tab pattern (`role="tab"`, `aria-selected`, `aria-controls`) | `edit.astro` | **Added** |
| 3 | `role="tabpanel"` + `aria-labelledby` on tab panels | `edit.astro` (6 panels) | **Added** |
| 4 | Tab JS updates `aria-selected` on switch | `edit.astro` | **Added** |
| 5 | Color contrast: `text-gray-400` → `text-gray-500` on section headings | All CV components + `edit.astro` | **Fixed** (12+ instances) |
| 6 | Color contrast: date/secondary text | `Experience.astro`, `Education.astro`, `Projects.astro`, `Header.astro` | **Fixed** |
| 7 | Skip-to-content link | `edit.astro` | **Added** |
| 8 | `prefers-reduced-motion` CSS | `edit.astro` | **Added** |
| 9 | `aria-live="polite"` on preview section | `edit.astro` | **Added** |
| 10 | Cookie consent: `role="dialog"`, `aria-label` | `edit.astro`, `SetupWizard.astro` | **Added** |
| 11 | Flag buttons: `aria-label` for screen readers | `edit.astro` (desktop + mobile) | **Added** |
| 12 | Skills remove button: `aria-label` + touch target | `edit.astro` | **Added** |
| 13 | Focus ring CSS for form controls | `edit.astro` | **Added** |

---

## PHASE 4: i18n — COMPLETED

| # | Item | File(s) | Status |
|---|------|---------|--------|
| 1 | Added 15+ missing translation keys (all 3 languages) | `src/i18n/ui.ts` | **Done** |
| 2 | Cookie consent English branch in `edit.astro` | `edit.astro` | **Fixed** |
| 3 | Cookie consent English branch in `SetupWizard.astro` | `SetupWizard.astro` | **Fixed** |
| 4 | Localized meta description for CV pages | `src/pages/[lang]/index.astro` | **Done** |
| 5 | Localized `OAuth / autenticación` heading | `privacy-policy.astro` | **Fixed** |
| 6 | Localized `alt="Foto"` | `edit.astro` | **Fixed** |
| 7 | Localized `placeholder="Ej: JavaScript..."` | `edit.astro` | **Fixed** |
| 8 | Localized aria-labels (tabs, navigation, sections) | `edit.astro`, `Projects.astro` | **Fixed** |
| 9 | Tab buttons use `t()` instead of inline ternaries | `edit.astro` | **Fixed** |
| 10 | Section headings use `t()` | `edit.astro` | **Fixed** |
| 11 | Form labels use `t()` | `edit.astro` | **Fixed** |
| 12 | "Add Experience/Education" buttons use `t()` | `edit.astro` | **Fixed** |

### New Translation Keys Added
- `form.phone`, `form.email`, `form.photo`, `form.chooseFile`, `form.remove`, `form.noFile`, `form.summary`, `form.skillsPlaceholder`, `form.skillsHint`
- `nav.language`, `nav.print`, `nav.previousSection`, `nav.nextSection`, `nav.tabs`
- `section.profile`, `section.experience`, `section.addExperience`, `section.education`, `section.addEducation`, `section.educationExtra`, `section.certificates`, `section.certificatesTitle`, `section.addCertificate`, `section.languages`, `section.addLanguage`, `section.skills`, `section.projects`, `section.technologies`
- `label.viewCompany`, `label.present`

---

## PHASE 5: Performance — COMPLETED

| # | Item | File(s) | Status |
|---|------|---------|--------|
| 1 | Added `_gaLoaded` guard to SetupWizard GA script | `SetupWizard.astro` | **Done** |
| 2 | `brand` color palette in tailwind.config.mjs | `tailwind.config.mjs` | **NOT dead** — used in `Projects.astro` |

---

## PHASE 6: Security — COMPLETED

### Changes Made
| # | Item | File(s) | Status |
|---|------|---------|--------|
| 1 | Security headers (HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, X-XSS-Protection) | `netlify.toml` | **Added** |
| 2 | Sanitized error messages in deploy.ts (removed internal details) | `netlify/functions/deploy.ts` | **Fixed** (6 error messages) |
| 3 | Sanitized error messages in load-resume.ts | `netlify/functions/load-resume.ts` | **Fixed** (1 error message) |

### Known Issues — Intentionally NOT Fixed (Per Constraints)

| Issue | Risk | Rationale |
|-------|------|-----------|
| Logout can't clear HttpOnly cookies | **HIGH** | Requires creating a new Netlify Function endpoint (`/api/auth/logout`) — touches backend architecture |
| CORS `'*'` fallback in `cors.ts` | **MEDIUM** | Requires env var enforcement — touches Netlify Functions |
| `github_user` cookie not HttpOnly | **MEDIUM** | Requires backend changes to set HttpOnly cookie |
| No request body size limits in deploy.ts | **LOW** | Requires middleware changes — touches backend architecture |

---

## PHASE 7: Dead Code — Candidates for Removal (DO NOT DELETE)

These files are **unused** but must NOT be deleted per constraints. They should be evaluated separately:

| File | Lines | Evidence of Non-Usage |
|------|-------|----------------------|
| `src/deploy-templates/renderer.ts` | ~380 | Not imported anywhere in the codebase |
| `src/components/TechLayout.astro` | ~49 | Not imported; `TechyLayout.astro` is the active component |
| `src/components/ArtisticLayout.astro` | ~50 | Not imported; `ArtisticLayout.astro` is the active component |
| `netlify/functions/auth/login.ts` | ~65 | Superseded by `netlify/functions/auth-login.ts` |
| `netlify/functions/auth/callback.ts` | ~135 | Superseded by `netlify/functions/auth-callback.ts` |

---

## Summary

| Phase | Items | Completed |
|-------|-------|-----------|
| SEO | 10 | 10 |
| UI/UX | 5 | 5 |
| A11y | 13 | 13 |
| i18n | 12 | 12 |
| Performance | 2 | 2 (1 was false positive) |
| Security | 3 + 4 documented | 3 fixed, 4 documented |
| Dead Code | 5 candidates | 0 deleted (constraint), documented |
| **Total** | **50** | **All safe items implemented** |
