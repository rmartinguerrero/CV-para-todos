<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/🇪🇸-ES-ff4b4b?style=for-the-badge&labelColor=1a1a2e" alt="Español"></a>
  <a href="README.EN.md"><img src="https://img.shields.io/badge/🇬🇧-EN-4b8bff?style=for-the-badge&labelColor=1a1a2e" alt="English"></a>
  <a href="README.IT.md"><img src="https://img.shields.io/badge/🇮🇹-IT-2ecc71?style=for-the-badge&labelColor=1a1a2e" alt="Italiano"></a>
</p>

# 📄 CV Para Todos

A multilingual, ultra-fast, private web resume designed to be **easy to use and manage**.

CV para Todos was created as a free and transparent alternative to platforms that restrict features behind a paywall, monetize personal data, or make it difficult to export your resume. The goal is that anyone can create, manage, and publish their CV simply, without hidden costs, and always keeping full control over their information.

The philosophy of this project is **simplicity and autonomy (No-Code / Low-Code)**: anyone should be able to have their professional portfolio online and manage it visually and comfortably, without backend complexity, heavy databases, and with complete respect for privacy.

---

🌐 **[View Live Demo](https://rmartinguerrero.github.io/personal-resume/)**

---

## ✨ Key Features

* 🌍 **Dynamic and Native Multilingual:** Smart language management (Spanish, English, Italian...) cleanly structured in the `src/pages/[lang]/` folder. Switch languages while keeping your position and speed.
* ✍️ **Centralized and Clean Data:** All your experience, education, and project information is stored in structured text files under `src/data/`, following clean and readable standards.
* 🛠️ **Visual Admin Panel:** Forget about touching code to update your CV! Includes a friendly and intuitive admin form to modify your data visually in seconds.
* 🔒 **Absolute Privacy (FOSS):** Zero cookies, zero telemetry, no external trackers. Your site is yours, the code is open source, and your data stays with you.
* ⚡ **Blazing Performance:** Built on Astro and Tailwind CSS to ensure the site loads instantly on any device, with impeccable SEO.

---

## ⚙️ Project Structure

To keep things organized and simple, the project is divided as follows:

* `src/pages/[lang]/` ➔ The dynamic pages of the site for each language, automatically.
* `src/data/` ➔ The text files where your resume data lives (`resume.es.json`, `resume.it.json`, etc.).
* `src/netlify/functions/` ➔ The simple logic responsible for processing the visual admin form and saving changes.

```
└── 📁CV-para-todos
    └── 📁.astro
        └── 📁collections
        ├── content-assets.mjs \\ Static asset management logic for content.
        ├── content-modules.mjs \\ Dynamic content loading and processing modules.
        ├── content.d.ts \\ Type definitions to ensure collection integrity.
        ├── data-store.json \\ Temporary local app state storage during development.
        ├── settings.json \\ Internal project settings for the local environment.
        ├── types.d.ts \\ Additional global type definitions for the project.
    └── 📁.github
        └── 📁workflows
            ├── deploy.yml \\ CI/CD pipeline to automate Netlify deployment after each push.
    └── 📁.vscode
        ├── extensions.json \\ Extension recommendations to standardize the team environment.
        ├── settings.json \\ Editor-specific settings (formatting, linting, integrations).
        ├── tasks.json \\ Command automation (build, dev, lint) integrated into VS Code.
    └── 📁netlify
        └── 📁functions
            └── 📁auth
                ├── callback.ts \\ Handler for completing the OAuth authentication flow.
                ├── login.ts \\ Entry point to start the login process.
            ├── auth-callback.ts \\ Centralized OAuth callback management.
            ├── auth-login.ts \\ Centralized login logic management.
            ├── deploy.ts \\ API to trigger the deployment process via the GitHub API.
            ├── load-resume.ts \\ Endpoint to retrieve the JSON Resume file from the repository.
            ├── save.js \\ API to persist user edits in the repository.
    └── 📁public
        ├── favicon.png \\ Website icon.
    └── 📁src
        └── 📁components
            ├── ArtisticLayout.astro \\ Block component for the artistic layout (used for section injection).
            ├── Education.astro \\ Modular education section component.
            ├── Experience.astro \\ Modular work experience section component.
            ├── Footer.astro \\ Reusable global footer.
            ├── Header.astro \\ Main navigation header.
            ├── Projects.astro \\ Modular projects section component.
            ├── SetupWizard.astro \\ Initial form logic for new users.
            ├── Skills.astro \\ Modular skills section component.
            ├── TechLayout.astro \\ Block component for the technical layout (detail sections).
        └── 📁data
            ├── resume.en.json \\ Initial template structure in English.
            ├── resume.es.json \\ Initial template structure in Spanish.
            ├── resume.it.json \\ Initial template structure in Italian.
        └── 📁deploy-templates
            ├── renderer.ts \\ Rendering engine to transform data into the final format before deployment.
        └── 📁i18n
            ├── ui.ts \\ Text dictionaries for the multilingual interface.
        └── 📁layouts
            ├── ArtisticLayout.astro \\ Wrapper layout for the artistic CV style.
            ├── MinimalistLayout.astro \\ Wrapper layout for the minimalist CV style.
            ├── TechyLayout.astro \\ Wrapper layout for the technical CV style.
        └── 📁lib
            ├── cv-renderer.ts \\ Core rendering library for the JSON Resume standard.
        └── 📁pages
            └── 📁[lang]
                ├── cookie-policy.astro \\ Dynamic cookie policy page.
                ├── edit.astro \\ Main No-Code editor interface (protected route).
                ├── index.astro \\ Public CV page rendered for recruiters.
                ├── privacy-policy.astro \\ Dynamic privacy policy page.
            ├── index.astro \\ Landing page with language detection.
        └── 📁styles
            ├── cv-themes.ts \\ Design token definitions and visual themes.
        └── 📁utils
            ├── github-oauth.ts \\ Shared utilities for user session management.
    ├── .env.example \\ Template for required environment variables (API keys, tokens).
    ├── .gitignore \\ Files and directories excluded from version control.
    ├── architecture.json \\ Master document with architecture definitions and ADRs.
    ├── astro.config.mjs \\ Main Astro framework configuration (integrations, adapters).
    ├── netlify.toml \\ Network configuration, redirects, and Netlify deployment settings.
    ├── package.json \\ Dependency manifest and execution scripts.
    ├── pnpm-lock.yaml \\ Version lock to ensure reproducibility.
    ├── pnpm-workspace.yaml \\ Monorepo configuration for pnpm.
    ├── QUICK_START.sh \\ Automated script for quick project setup.
    ├── README.md \\ General and contribution documentation.
    ├── SETUP_OAUTH.md \\ Step-by-step guide to configure the GitHub OAuth App.
    ├── tailwind.config.mjs \\ Global Tailwind CSS configuration.
    ├── tsconfig.json \\ TypeScript configuration for the project.
```
---

## 🚀 Tech Stack

* **Framework:** [Astro 5](https://astro.build/) (SSG for optimal performance).
* **Styles:** [Tailwind CSS](https://tailwindcss.com/) (Flexible and maintainable design system).
* **Persistence Backend:** Netlify Functions (Node.js) + GitHub REST API (`@octokit/rest`).
* **Authentication:** Centralized OAuth flow via GitHub App.
* **Standard:** Based on [JSON Resume](https://jsonresume.org/).

---

## 🏗️ Flow Architecture (UX/UI)

1. **Phase 1 (Landing & Onboarding):** Automatic browser language detection. CTA for "Create from scratch" (`SetupWizard`) or "Edit" (via OAuth).
2. **Phase 2 (No-Code Form):** Isolated route `/[lang]/edit`. Modular form. Dynamic template selector and download actions (JSON/PDF) or cloud publishing.
3. **Phase 3 (Public CV):** Route `/[lang]/index`. Loads the JSON and renders the selected template in `meta.template`.

---

## 🤖 AI-Assisted Development

This project has been developed with the help of Artificial Intelligence tools as support during design, programming, documentation, and review tasks.

AI has been used to:

- 💡 Propose technical solutions and implementation alternatives.
- 🏗️ Assist in the design of the project architecture.
- 🔍 Detect bugs, perform audits, and suggest improvements.
- 🌍 Facilitate internationalization and documentation generation.
- 🧪 Review code and validate design decisions.

All final decisions, architecture, code supervision, and project direction belong to **Raúl Martín Guerrero**.

The goal is to demonstrate that AI can be an excellent support tool for developing quality free software, always keeping human judgment as the final responsible party.

---
## 🧠 The `architecture.json` File

The repository includes a file called `architecture.json`, which acts as the central technical documentation for the project.

This file contains structured information about:

- 📐 General architecture.
- 🏛️ Design decisions (ADR).
- 🔄 Operational flows.
- 📂 Project structure.
- 🛠️ Technologies used.
- 📋 Development conventions.
- 🐞 Known issues and applied solutions.
- 🚀 Project evolution.

The `architecture.json` file is designed so that both people and AI assistants can quickly understand the project's architecture and collaborate more efficiently, maintaining consistency in technical decisions.

It is recommended to keep this file updated when introducing significant changes to the architecture or workflow of the project.

---

## 📋 How It Works & Usage Instructions

### 1. Initialization and SetupWizard
On first access, the `SetupWizard` allows you to:
* **Create from scratch:** Fill in fields visually.
* **Import data:** You can load a standard `resume.json` file. The system imports the content, validates it, and stores it locally so you can edit and preview it before publishing.

### 2. Data Management (Universal File)
The system uses `src/data/resume.[lang].json` files.
* The `meta.template` property in the JSON lets you change the CV's visual appearance instantly.
* The `SetupWizard` helps correctly map the keys of the imported file to the project standard.

### 3. Publishing
When you press the "Publish" button in the editor, a *Netlify Function* performs a secure `push` to your GitHub repository, updating the source JSON file and triggering a new site build.

---
## 📋 Requirements

Before starting, make sure you have installed:

* **Node.js 20** or higher.
* **pnpm 10** or higher.
* **Netlify CLI** (to run Netlify Functions during development).
* A **GitHub account** (only needed if you want to publish your CV directly from the editor via OAuth).

You can verify everything is installed by running:

```bash
node -v
pnpm -v
netlify --version
```

## 💻 Local Development

Getting the site up and running on your machine is very straightforward.

### 1. Install dependencies

Install the required packages using **pnpm**:

```bash
pnpm install
```

### 2. Configure environment variables

The project includes a **`.env.example`** file with all the variables needed to run the application.

Simply copy it and rename it to **`.env.local`**:

```bash
cp .env.example .env.local
```

or on Windows:

```powershell
copy .env.example .env.local
```

Then open the `.env.local` file and fill in the corresponding values:

* `GITHUB_CLIENT_ID`
* `GITHUB_CLIENT_SECRET`
* `GITHUB_REDIRECT_URI`
* Any other variables required by your environment.

To properly configure OAuth authentication you can follow the guide included in:

```
SETUP_OAUTH.md
```

### 3. Run the project

Once the environment is configured:

```bash
pnpm install
npx netlify dev
```

Netlify CLI will automatically load the variables defined in `.env.local`.

---

## 🔐 Environment Variables

The repository **does include** a file:

```
.env.example
```

This file serves only as a template and can be uploaded to the repository without any issues, as it **contains no real credentials**.

You must never upload your personal keys.

Actual configuration files such as:

```
.env
.env.local
.env.production.local
```

must always remain private.

---

## 🚫 Files that should NOT be uploaded to the repository

The project already includes a `.gitignore` prepared to prevent uploading temporary files, builds, and credentials.

These include:

### Dependencies

```
node_modules/
.pnpm-store/
```

### Files generated by Astro

```
dist/
.astro/
```

### Netlify local files

```
.netlify/
```

### Environment variables

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

### Temporary files

```
deno.lock
```

### Operating system files

```
.DS_Store
Thumbs.db
```

> **Important:** The only configuration-related file that should be kept in the repository is **`.env.example`**, as it acts as a template so any user can configure the project without exposing sensitive information.


## 📜 License

This project is distributed under the **GNU General Public License v3.0 (GPL-3.0)**.

Its purpose is to ensure that **CV para Todos** always remains free software, allowing anyone to use, study, modify, and share it.

If you redistribute this project or a modified version, you must do so respecting the terms of the GPL v3 license and keep the source code available in accordance with said license.

Copyright © 2026 Raúl Martín Guerrero

You can view the full license text in the `LICENSE` file included in this repository.

## 🧠 Author

Project developed by **Raúl Martín Guerrero**.

If you find this project useful, consider giving it a ⭐ on the GitHub repository. It helps more people discover a free, transparent, and privacy-respecting alternative for creating and publishing their resume.
