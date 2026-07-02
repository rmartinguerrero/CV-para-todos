// src/styles/cv-themes.ts
// Single source of truth for all CV themes CSS.
// Imported by: netlify/functions/deploy.ts (server-side), src/pages/[lang]/edit.astro (preview)
// Phase 1: unified CSS with BOTH .theme-x (deploy) AND [data-template="x"] (preview) selectors.
// Phase 2: [data-template] selectors will be removed when preview switches to .theme-x classes.

export const CV_THEMES_CSS = `/* ==========================================================================
   CV para Todos — Unified Stylesheet
   Source: src/styles/cv-themes.ts
   ========================================================================== */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');

/* ===== BASE / RESET ===== */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-text-size-adjust:100%}
body{font-family:'Inter',system-ui,sans-serif;line-height:1.6;min-height:100vh;-webkit-font-smoothing:antialiased}
img{display:block;max-width:100%;height:auto}
a{color:inherit;text-decoration:none}
a:hover{opacity:.85}
h1,h2,h3,strong{font-family:'Inter',system-ui,sans-serif}
ul{list-style:none}

/* ===== TEMA MINIMALIST ===== */
.theme-minimalist{background:#f8fafc;color:#111827}
.theme-minimalist .page{max-width:900px;margin:0 auto;padding:3rem 1.5rem}
.theme-minimalist .panel{background:#fff;border:1px solid #e5e7eb;border-radius:1.25rem;box-shadow:0 24px 80px rgba(15,23,42,.06)}
.theme-minimalist .section-title{color:#111827;font-size:1rem;letter-spacing:.12em;text-transform:uppercase;margin-bottom:1rem}
.theme-minimalist .profile-image{width:128px;height:128px;object-fit:cover;border-radius:1rem;border:1px solid #e5e7eb}
.theme-minimalist .panel-label{color:#6b7280;font-size:1.125rem;font-weight:500;margin-top:.25rem}
.theme-minimalist .lang-link-active,
.theme-minimalist .lang-btn-active{background:#2563eb!important;color:#fff!important}
.theme-minimalist .lang-link-inactive,
.theme-minimalist .lang-btn-inactive{background:rgba(0,0,0,.06)!important;color:inherit!important}

[data-template="minimalist"] #preview-header {
  display: flex !important;
  align-items: start !important;
  justify-content: flex-start !important;
  gap: 1.5rem !important;
}
[data-template="minimalist"] #preview-header img {
  order: -1 !important;
  width: 96px !important;
  height: 96px !important;
  object-fit: cover !important;
  border-radius: 0.75rem !important;
  border: 1px solid #e5e7eb !important;
}

/* ===== TEMA TECHY ===== */
.theme-techy{background:#0f172a;color:#e2e8f0}
.theme-techy .page{max-width:1000px;margin:0 auto;padding:3rem 1.5rem}
.theme-techy .panel{background:rgba(15,23,42,0.96);border:1px solid rgba(148,163,184,.18);border-radius:1.5rem;box-shadow:0 30px 80px rgba(15,23,42,.3)}
.theme-techy .section-title{color:#cbd5e1;font-size:1rem;letter-spacing:.12em;text-transform:uppercase;margin-bottom:1rem}
.theme-techy .profile-image{width:128px;height:128px;object-fit:cover;border:2px solid #6366f1!important;border-radius:8px!important}
.theme-techy .panel-label{color:#94a3b8;font-size:1.125rem;font-weight:500;margin-top:.25rem}
.theme-techy .lang-link-active,
.theme-techy .lang-btn-active{background:#38bdf8!important;color:#0f172a!important}
.theme-techy .lang-link-inactive,
.theme-techy .lang-btn-inactive{background:rgba(255,255,255,.1)!important;color:inherit!important}

[data-template="techy"] {
  background-color: #f1f5f9 !important;
  background-image: radial-gradient(#cbd5e1 1px, transparent 1px) !important;
  background-size: 16px 16px !important;
  color: #0f172a !important;
}
[data-template="techy"] #preview-header {
  display: flex !important;
  align-items: start !important;
  justify-content: flex-start !important;
  gap: 1.5rem !important;
}
[data-template="techy"] #preview-header img {
  order: -1 !important;
  border-radius: 8px !important;
  border: 2px solid #6366f1 !important;
}
[data-template="techy"] #view-name {
  font-family: 'JetBrains Mono', monospace !important;
  color: #1e1b4b !important;
  font-weight: 700 !important;
}
[data-template="techy"] h3::before {
  content: "</> " !important;
  color: #6366f1 !important;
  font-family: 'JetBrains Mono', monospace !important;
}
[data-template="techy"] h3 {
  font-family: 'JetBrains Mono', monospace !important;
  color: #4338ca !important;
  border-bottom: 1px dashed #cbd5e1 !important;
}
[data-template="techy"] .badge-item-live {
  background-color: #e0e7ff !important;
  color: #4338ca !important;
  border: 1px solid #c7d2fe !important;
  font-family: 'JetBrains Mono', monospace !important;
  border-radius: 4px !important;
  font-size: 0.7rem !important;
}

/* ===== TEMA ARTISTIC ===== */
.theme-artistic{background:#fdf2e9;color:#17212b}
.theme-artistic .page{max-width:900px;margin:0 auto;padding:3rem 1.5rem}
.theme-artistic .panel{background:#fff;border:1px solid #f1e4d3;border-radius:1.75rem;box-shadow:0 25px 90px rgba(15,23,42,.08)}
.theme-artistic .section-title{color:#7c2d12;font-size:1rem;letter-spacing:.12em;text-transform:uppercase;margin-bottom:1rem;font-family:'Playfair Display',Georgia,serif!important}
.theme-artistic .profile-image{width:128px;height:128px;object-fit:cover;border:2px solid #8c7864!important;border-radius:60% 40% 60% 40% / 40% 60% 40% 60%!important;padding:3px;background:#fff}
.theme-artistic .panel-label{color:#8c7864;font-size:1.125rem;font-weight:500;margin-top:.25rem;font-family:'Playfair Display',Georgia,serif!important;font-style:italic}
.theme-artistic .lang-link-active,
.theme-artistic .lang-btn-active{background:#d97706!important;color:#fff!important}
.theme-artistic .lang-link-inactive,
.theme-artistic .lang-btn-inactive{background:rgba(0,0,0,.06)!important;color:inherit!important}

[data-template="artistic"] {
  background-color: #faf6f0 !important;
  color: #443e38 !important;
}
[data-template="artistic"] #preview-header {
  display: flex !important;
  align-items: start !important;
  justify-content: flex-start !important;
  gap: 1.75rem !important;
}
[data-template="artistic"] #preview-header img {
  order: -1 !important;
  border-radius: 60% 40% 60% 40% / 40% 60% 40% 60% !important;
  border: 2px solid #8c7864 !important;
  padding: 3px !important;
  background-color: #ffffff;
}
[data-template="artistic"] #view-name {
  font-family: 'Playfair Display', Georgia, serif !important;
  color: #2e2924 !important;
  font-size: 2.1rem !important;
  font-style: italic !important;
}
[data-template="artistic"] h3 {
  font-family: 'Playfair Display', Georgia, serif !important;
  color: #8c7864 !important;
  font-size: 1rem !important;
  letter-spacing: 0.025em !important;
  border-bottom: 1px solid #e3dac9 !important;
}
[data-template="artistic"] .badge-item-live {
  background-color: #f1eae1 !important;
  color: #6e5d4f !important;
  border: 1px solid #e3dac9 !important;
  border-radius: 9999px !important;
  font-style: italic !important;
  font-size: 0.75rem !important;
}

/* ===== LAYOUT COMPARTIDO ===== */
.panel-header{display:flex;flex-wrap:wrap;gap:1.5rem;align-items:flex-start;justify-content:space-between}.profile-image{order:-1}
.panel-header-content{flex:1;min-width:220px}
.panel-name{font-size:clamp(2rem,3vw,3rem);margin:.75rem 0 .5rem;line-height:1.05;overflow-wrap:anywhere}
.panel-label{margin:.25rem 0 .75rem;overflow-wrap:anywhere}
.panel-summary{max-width:40rem;line-height:1.8;margin-bottom:1rem;overflow-wrap:anywhere}
.panel-contact{display:flex;flex-wrap:wrap;gap:1rem;font-size:.875rem;margin-top:1rem}
.panel-contact a{color:inherit;text-decoration:none;overflow-wrap:anywhere}
.panel-contact a:hover{opacity:.8}
.panel-main{display:grid;gap:2rem;min-width:0}
.card{min-width:0;padding:1.25rem;border:1px solid rgba(148,163,184,.16);border-radius:1rem}
.card-header{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;min-width:0}
.card-title{font-weight:700;overflow-wrap:anywhere}
.card-body{margin-top:.75rem;line-height:1.8;white-space:pre-line;font-size:.9rem;overflow-wrap:anywhere}
.card-date{opacity:.75;font-size:.85rem}
.cards-grid{display:grid;gap:1.25rem}
.skills-wrap{display:flex;flex-wrap:wrap;gap:.6rem}
.tag{display:inline-flex;padding:.35rem .85rem;border-radius:9999px;font-size:.8rem;font-weight:600;background:rgba(148,163,184,.12);overflow-wrap:anywhere;max-width:100%}
.extra-grid{display:grid;gap:1.5rem}
.cert-item,.lang-item{min-width:0;padding:.95rem;border:1px solid rgba(148,163,184,.16);border-radius:1rem}
.cert-name{font-weight:700;overflow-wrap:anywhere}
.cert-meta{opacity:.75;font-size:.875rem}
.lang-item{display:flex;justify-content:space-between;gap:1rem}
.lang-fluency{font-weight:700}
.card-subtitle{margin-top:.5rem;opacity:.85;font-size:.95rem;overflow-wrap:anywhere}
.panel-header-image{flex-shrink:0}

/* ===== PREVIEW-SPECIFIC (será eliminado en Phase 2) ===== */
#preview-section { font-family: 'Inter', system-ui, sans-serif; color: #111827; }
.badge-item-live { background-color: #f3f4f6; color: #374151; font-size: 0.75rem; padding: 0.25rem 0.625rem; border-radius: 9999px; display: inline-block; font-weight: 500; }
#tab-nav { -ms-overflow-style: none; scrollbar-width: none; }
#tab-nav::-webkit-scrollbar { display: none; height: 0; }
.tab-btn { border-bottom-width: 2px; }
.tab-btn.border-blue-600 { border-bottom-color: #2563eb; }

/* ===== NAVBAR SUPERIOR ===== */
.top-nav{display:flex;justify-content:space-between;align-items:center;padding:1rem 1.5rem;background:inherit;border-bottom:1px solid rgba(148,163,184,.15)}
.top-nav-langs{display:flex;flex-wrap:wrap;gap:.5rem}
.lang-link{padding:.4rem .85rem;border-radius:9999px;text-decoration:none;font-weight:700;font-size:.8rem;transition:opacity .15s}
.lang-link:hover{opacity:.7}
.top-nav-print{padding:.4rem .85rem;border-radius:9999px;font-size:.8rem;font-weight:600;cursor:pointer;background:rgba(148,163,184,.1);border:1px solid rgba(148,163,184,.2);color:inherit;transition:background .15s}
.top-nav-print:hover{background:rgba(148,163,184,.2)}

/* ===== RESPONSIVE ===== */
@media(max-width:640px){
  .page{padding:1.5rem 1rem!important}
  .panel-header{flex-direction:column;align-items:stretch}
  .panel-name{font-size:1.75rem!important}
  .panel-contact{flex-direction:column;gap:.5rem}
  .card-header{flex-direction:column;gap:.25rem}
  .profile-image{width:96px!important;height:96px!important}
  .top-nav{flex-direction:column;gap:.5rem;padding:.75rem 1rem}
}

/* ===== PRINT ===== */
@media print{
  .top-nav{display:none!important}
  body{background:#fff!important;color:#000!important}
  .page{padding:0!important;margin:0!important}
  .panel{box-shadow:none!important;border:none!important;border-radius:0!important}
  #preview-section{min-height:auto!important;box-shadow:none!important;border:0!important}
  html,body{height:auto!important}
  .print\\:block{display:block!important}
  .panel-header{gap:0.75rem!important}
  .profile-image{width:72px!important;height:72px!important}
  .panel-name{font-size:1.5rem!important;margin:0.15rem 0 0.25rem!important;line-height:1.1!important}
  .panel-label{font-size:0.9rem!important;margin:0!important}
  .panel-summary{font-size:0.8rem!important;margin-bottom:0.5rem!important;line-height:1.5!important}
  .panel-contact{gap:0.5rem!important;margin-top:0.4rem!important;font-size:0.75rem!important}
  .section-title{font-size:0.75rem!important;margin-bottom:0.4rem!important}
  .panel-main{gap:0.75rem!important}
  .cards-grid{gap:0.5rem!important}
  .card{padding:0.5rem!important}
  .card-header{gap:0.25rem!important}
  .card-body{margin-top:0.35rem!important;font-size:0.8rem!important;line-height:1.5!important}
  .card-date{font-size:0.75rem!important}
  .card-subtitle{margin-top:0.25rem!important;font-size:0.8rem!important}
  .skills-wrap{gap:0.35rem!important}
  .tag{font-size:0.7rem!important;padding:0.2rem 0.5rem!important}
  .extra-grid{gap:0.75rem!important}
  .cert-item{padding:0.4rem!important;margin-bottom:0.35rem!important}
  .cert-name{font-size:0.85rem!important}
  .cert-meta{font-size:0.75rem!important}
  .lang-item{padding:0.35rem!important;margin-bottom:0.25rem!important}
  .lang-fluency{font-size:0.8rem!important}
  @page{size:A4;margin:8mm}
}`;
