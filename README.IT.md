[ES](README.md) | [EN](README.EN.md) | [IT](README.IT.md)

# 📄 CV Para Todos

Un curriculum web multilingua, ultraveloce, privato e progettato per essere **facile da usare e gestire**.

CV para Todos nasce come alternativa libera e trasparente alle piattaforme che limitano le funzioni dietro un pagamento, monetizzano i dati personali o rendono difficile l'esportazione del curriculum. L'obiettivo è che chiunque possa creare, gestire e pubblicare il proprio CV in modo semplice, senza costi nascosti e mantenendo sempre il controllo sulle proprie informazioni.

La filosofia di questo progetto è la **semplicità e l'autonomia (No-Code / Low-Code)**: chiunque deve poter avere il proprio portfolio professionale online e gestirlo in modo visivo e comodo, senza complicazioni tecniche di backend, senza database pesanti e nel pieno rispetto della privacy.

---

🌐 **[Visualizza Demo Live](https://rmartinguerrero.github.io/personal-resume/)**

---

## ✨ Caratteristiche Principali

* 🌍 **Multilingua Dinamico e Nativo:** Gestione intelligente delle lingue (Spagnolo, Inglese, Italiano...) strutturata in modo pulito nella cartella `src/pages/[lang]/`. Cambia lingua mantenendo posizione e velocità.
* ✍️ **Dati Centralizzati e Puliti:** Tutte le informazioni sulla tua esperienza, studi e progetti sono salvate in file di testo strutturati in `src/data/`, seguendo standard puliti e leggibili.
* 🛠️ **Pannello di Amministrazione Visivo:** Dimenticati di toccare codice per aggiornare il tuo CV! Include un modulo di amministrazione molto amichevole e intuitivo per modificare i tuoi dati visivamente in pochi secondi.
* 🔒 **Privacy Assoluta (FOSS):** Zero cookie, zero telemetria e nessun tracciatore esterno. Il tuo sito è tuo, il codice è aperto e i tuoi dati rimangono con te.
* ⚡ **Prestazioni Strepitose:** Costruito su Astro e Tailwind CSS per garantire che il sito si carichi istantaneamente su qualsiasi dispositivo, con una SEO impeccabile.

---

## ⚙️ Struttura del Progetto

Per mantenere le cose organizzate e semplici, il progetto è così suddiviso:

* `src/pages/[lang]/` ➔ Le pagine dinamiche del sito per ogni lingua, in modo automatico.
* `src/data/` ➔ I file di testo in cui risiedono le informazioni del tuo curriculum (`resume.es.json`, `resume.it.json`, ecc.).
* `src/netlify/functions/` ➔ La logica semplice incaricata di elaborare il modulo visivo di amministrazione e salvare le modifiche.

```
└── 📁CV-para-todos
    └── 📁.astro
        └── 📁collections
        ├── content-assets.mjs \\ Logica di gestione degli asset statici per il contenuto.
        ├── content-modules.mjs \\ Moduli di caricamento ed elaborazione del contenuto dinamico.
        ├── content.d.ts \\ Definizioni di tipo per garantire l'integrità delle collezioni.
        ├── data-store.json \\ Archiviazione locale temporanea dello stato dell'applicazione durante lo sviluppo.
        ├── settings.json \\ Impostazioni interne del progetto per l'ambiente locale.
        ├── types.d.ts \\ Definizioni di tipo globali aggiuntive per il progetto.
    └── 📁.github
        └── 📁workflows
            ├── deploy.yml \\ Pipeline CI/CD per automatizzare il deployment su Netlify dopo ogni push.
    └── 📁.vscode
        ├── extensions.json \\ Raccomandazioni di estensioni per standardizzare l'ambiente del team.
        ├── settings.json \\ Configurazione specifica dell'editor (formattazione, linting, integrazioni).
        ├── tasks.json \\ Automazione dei comandi (build, dev, lint) integrati in VS Code.
    └── 📁netlify
        └── 📁functions
            └── 📁auth
                ├── callback.ts \\ Handler specifico per il completamento del flusso di autenticazione OAuth.
                ├── login.ts \\ Punto di ingresso per avviare il processo di login.
            ├── auth-callback.ts \\ Gestione centralizzata del callback OAuth.
            ├── auth-login.ts \\ Gestione centralizzata della logica di accesso.
            ├── deploy.ts \\ API per attivare il processo di deployment tramite GitHub API.
            ├── load-resume.ts \\ Endpoint per recuperare il file JSON Resume dal repository.
            ├── save.js \\ API per persistere le modifiche dell'utente nel repository.
    └── 📁public
        ├── favicon.png \\ Icona del sito web.
    └── 📁src
        └── 📁components
            ├── ArtisticLayout.astro \\ Blocco componente per il layout artistico (usato per l'iniezione di sezioni).
            ├── Education.astro \\ Componente modulare della sezione formazione.
            ├── Experience.astro \\ Componente modulare della sezione esperienza lavorativa.
            ├── Footer.astro \\ Piè di pagina globale riutilizzabile.
            ├── Header.astro \\ Intestazione di navigazione principale.
            ├── Projects.astro \\ Componente modulare della sezione progetti.
            ├── SetupWizard.astro \\ Logica del modulo iniziale per i nuovi utenti.
            ├── Skills.astro \\ Componente modulare della sezione competenze.
            ├── TechLayout.astro \\ Blocco componente per il layout tecnico (sezioni di dettaglio).
        └── 📁data
            ├── resume.en.json \\ Struttura del modello iniziale in inglese.
            ├── resume.es.json \\ Struttura del modello iniziale in spagnolo.
            ├── resume.it.json \\ Struttura del modello iniziale in italiano.
        └── 📁deploy-templates
            ├── renderer.ts \\ Motore di rendering per trasformare i dati nel formato finale prima del deployment.
        └── 📁i18n
            ├── ui.ts \\ Dizionari di testi per l'interfaccia multilingua.
        └── 📁layouts
            ├── ArtisticLayout.astro \\ Layout contenitore per lo stile di CV artistico.
            ├── MinimalistLayout.astro \\ Layout contenitore per lo stile di CV minimalista.
            ├── TechyLayout.astro \\ Layout contenitore per lo stile di CV tecnico.
        └── 📁lib
            ├── cv-renderer.ts \\ Libreria principale di rendering per lo standard JSON Resume.
        └── 📁pages
            └── 📁[lang]
                ├── cookie-policy.astro \\ Pagina dinamica della politica sui cookie.
                ├── edit.astro \\ Interfaccia principale dell'editor No-Code (percorso protetto).
                ├── index.astro \\ Pagina del CV pubblico renderizzato per i reclutatori.
                ├── privacy-policy.astro \\ Pagina dinamica dell'informativa sulla privacy.
            ├── index.astro \\ Pagina di destinazione (Landing) con rilevamento della lingua.
        └── 📁styles
            ├── cv-themes.ts \\ Definizioni dei token di design e temi visivi.
        └── 📁utils
            ├── github-oauth.ts \\ Utility condivise per la gestione delle sessioni utente.
    ├── .env.example \\ Template delle variabili d'ambiente necessarie (chiavi API, token).
    ├── .gitignore \\ File e directory esclusi dal controllo versione.
    ├── architecture.json \\ Documento maestro delle definizioni di architettura e ADR.
    ├── astro.config.mjs \\ Configurazione principale del framework Astro (integrazioni, adattatori).
    ├── netlify.toml \\ Configurazione di rete, redirect e deployment su Netlify.
    ├── package.json \\ Manifest delle dipendenze e script di esecuzione.
    ├── pnpm-lock.yaml \\ Blocco delle versioni per garantire la riproducibilità.
    ├── pnpm-workspace.yaml \\ Configurazione monorepo per pnpm.
    ├── QUICK_START.sh \\ Script automatizzato per l'installazione rapida del progetto.
    ├── README.md \\ Documentazione generale e di contribuzione.
    ├── SETUP_OAUTH.md \\ Guida passo passo per configurare l'App GitHub di autenticazione.
    ├── tailwind.config.mjs \\ Configurazione globale di Tailwind CSS.
    ├── tsconfig.json \\ Configurazione TypeScript per il progetto.
```
---

## 🚀 Stack Tecnologico

* **Framework:** [Astro 5](https://astro.build/) (SSG per prestazioni ottimali).
* **Stili:** [Tailwind CSS](https://tailwindcss.com/) (Sistema di design flessibile e manutenibile).
* **Backend di Persistenza:** Netlify Functions (Node.js) + GitHub REST API (`@octokit/rest`).
* **Autenticazione:** Flusso OAuth gestito centralmente tramite GitHub App.
* **Standard:** Basato su [JSON Resume](https://jsonresume.org/).

---

## 🏗️ Architettura del Flusso (UX/UI)

1. **Fase 1 (Landing & Onboarding):** Rilevamento automatico della lingua del browser. CTA per "Creare da zero" (`SetupWizard`) o "Modificare" (tramite OAuth).
2. **Fase 2 (Modulo No-Code):** Percorso isolato `/[lang]/edit`. Modulo modulare. Selettore dinamico di template e azioni di download (JSON/PDF) o pubblicazione nel cloud.
3. **Fase 3 (CV Pubblico):** Percorso `/[lang]/index`. Carica il JSON e renderizza il template selezionato in `meta.template`.

---

## 🤖 Sviluppo Assistito da IA

Questo progetto è stato sviluppato con l'aiuto di strumenti di Intelligenza Artificiale come supporto durante la progettazione, la programmazione, la documentazione e le attività di revisione.

L'IA è stata utilizzata per:

- 💡 Proporre soluzioni tecniche e alternative di implementazione.
- 🏗️ Assistere nella progettazione dell'architettura del progetto.
- 🔍 Rilevare errori, eseguire audit e suggerire miglioramenti.
- 🌍 Facilitare l'internazionalizzazione e la generazione di documentazione.
- 🧪 Revisionare il codice e validare le decisioni di design.

Tutte le decisioni finali, l'architettura, la supervisione del codice e la direzione del progetto appartengono a **Raúl Martín Guerrero**.

L'obiettivo è dimostrare che l'IA può essere un eccellente strumento di supporto per sviluppare software libero di qualità, mantenendo sempre il giudizio umano come responsabile finale.

---
## 🧠 File `architecture.json`

Il repository include un file chiamato `architecture.json`, che funge da documentazione tecnica centrale del progetto.

Questo file raccoglie informazioni strutturate su:

- 📐 Architettura generale.
- 🏛️ Decisioni di design (ADR).
- 🔄 Flussi di funzionamento.
- 📂 Struttura del progetto.
- 🛠️ Tecnologie utilizzate.
- 📋 Convenzioni di sviluppo.
- 🐞 Problemi rilevati e soluzioni applicate.
- 🚀 Evoluzione del progetto.

Il file `architecture.json` è pensato affinché sia le persone che gli assistenti IA possano comprendere rapidamente l'architettura del progetto e collaborare in modo più efficiente, mantenendo la coerenza delle decisioni tecniche adottate.

Si raccomanda di mantenere questo file aggiornato quando vengono introdotti cambiamenti importanti nell'architettura o nel flusso di lavoro del progetto.

---

## 📋 Funzionamento e Istruzioni per l'Uso

### 1. Inizializzazione e SetupWizard
Al primo accesso, il `SetupWizard` consente di:
* **Creare da zero:** Compilare i campi visivamente.
* **Importare dati:** Puoi caricare un file `resume.json` standard. Il sistema importa il contenuto, lo valida e lo memorizza localmente in modo da poterlo modificare e visualizzare in anteprima prima di pubblicarlo.

### 2. Gestione dei Dati (File Universale)
Il sistema utilizza file `src/data/resume.[lang].json`.
* La proprietà `meta.template` nel JSON consente di cambiare l'aspetto visivo del CV all'istante.
* Il `SetupWizard` aiuta a mappare correttamente le chiavi del file importato con lo standard del progetto.

### 3. Pubblicazione
Quando premi il pulsante "Pubblica" nell'editor, una *Netlify Function* esegue un `push` sicuro sul tuo repository GitHub, aggiornando il file JSON sorgente e attivando una nuova compilazione (build) del sito.

---
## 📋 Requisiti

Prima di iniziare, assicurati di avere installato:

* **Node.js 20** o superiore.
* **pnpm 10** o superiore.
* **Netlify CLI** (per eseguire le Netlify Functions in sviluppo).
* Un **account GitHub** (necessario solo se desideri pubblicare il tuo CV direttamente dall'editor tramite OAuth).

Puoi verificare che tutto sia installato eseguendo:

```bash
node -v
pnpm -v
netlify --version
```

## 💻 Sviluppo Locale

Mettere in funzione il sito sul tuo computer è molto semplice.

### 1. Installare le dipendenze

Installa i pacchetti necessari utilizzando **pnpm**:

```bash
pnpm install
```

### 2. Configurare le variabili d'ambiente

Il progetto include un file **`.env.example`** con tutte le variabili necessarie per eseguire l'applicazione.

Devi solo copiarlo e rinominarlo come **`.env.local`**:

```bash
cp .env.example .env.local
```

o su Windows:

```powershell
copy .env.example .env.local
```

Successivamente, apri il file `.env.local` e completa i valori corrispondenti:

* `GITHUB_CLIENT_ID`
* `GITHUB_CLIENT_SECRET`
* `GITHUB_REDIRECT_URI`
* Qualsiasi altra variabile necessaria per il tuo ambiente.

Per configurare correttamente l'autenticazione OAuth puoi seguire la guida inclusa in:

```
SETUP_OAUTH.md
```

### 3. Eseguire il progetto

Una volta configurato l'ambiente:

```bash
pnpm install
npx netlify dev
```

Netlify CLI caricherà automaticamente le variabili definite in `.env.local`.

---

## 🔐 Variabili d'Ambiente

Il repository **include** un file:

```
.env.example
```

Questo file serve esclusivamente come template e può essere caricato sul repository senza problemi, poiché **non contiene credenziali reali**.

Non devi mai caricare le tue chiavi personali.

I file di configurazione reali come:

```
.env
.env.local
.env.production.local
```

devono rimanere sempre privati.

---

## 🚫 File che NON devono essere caricati sul repository

Il progetto include già un `.gitignore` preparato per evitare di caricare file temporanei, compilazioni e credenziali.

Tra questi:

### Dipendenze

```
node_modules/
.pnpm-store/
```

### File generati da Astro

```
dist/
.astro/
```

### File locali di Netlify

```
.netlify/
```

### Variabili d'ambiente

```
.env
.env.local
.env.*.local
```

### Log

```
*.log
npm-debug.log*
pnpm-debug.log*
```

### File temporanei

```
deno.lock
```

### File del sistema operativo

```
.DS_Store
Thumbs.db
```

> **Importante:** L'unico file relativo alla configurazione che deve essere mantenuto nel repository è **`.env.example`**, poiché funge da template per consentire a qualsiasi utente di configurare il progetto senza esporre informazioni sensibili.


## 📜 Licenza

Questo progetto è distribuito sotto la **GNU General Public License v3.0 (GPL-3.0)**.

Il suo scopo è garantire che **CV para Todos** rimanga sempre software libero, permettendo a chiunque di utilizzarlo, studiarlo, modificarlo e condividerlo.

Se ridistribuisci questo progetto o una versione modificata, dovrai farlo rispettando i termini della licenza GPL v3 e mantenere il codice sorgente disponibile in conformità con tale licenza.

Copyright © 2026 Raúl Martín Guerrero

Puoi consultare il testo completo della licenza nel file `LICENSE` incluso in questo repository.

## 🧠 Autore

Progetto sviluppato da **Raúl Martín Guerrero**.

Se trovi utile questo progetto, considera di lasciare una ⭐ sul repository GitHub. Aiuta a far sì che più persone scoprano un'alternativa libera, trasparente e rispettosa della privacy per creare e pubblicare il proprio curriculum.
