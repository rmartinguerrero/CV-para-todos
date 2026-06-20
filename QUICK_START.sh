#!/bin/bash
# 🚀 INICIO RÁPIDO - Configurar OAuth en 5 minutos

set -e

echo "=========================================="
echo "🚀 CV para Todos - Configuración OAuth"
echo "=========================================="
echo ""

# Paso 1: Copiar .env.example
echo "📋 Paso 1: Creando .env.local..."
if [ -f ".env.local" ]; then
    echo "   ⚠️  .env.local ya existe, saltando..."
else
    cp .env.example .env.local
    echo "   ✅ .env.local creado"
fi

echo ""
echo "=========================================="
echo "🔐 CONFIGURAR GITHUB OAUTH"
echo "=========================================="
echo ""
echo "Para continuar, necesitas:"
echo ""
echo "1️⃣  Cliente ID y Secret de GitHub"
echo "   → https://github.com/settings/developers"
echo "   → OAuth Apps → New OAuth App"
echo ""
echo "   Rellena con:"
echo "   • Application name: CV para Todos"
echo "   • Homepage URL: http://localhost:3000"
echo "   • Authorization callback URL:"
echo "     http://localhost:3000/.netlify/functions/auth/callback"
echo ""
echo "2️⃣  Copia el Client ID y Client Secret"
echo ""
echo "3️⃣  Edita .env.local y rellenar:"
echo ""

# Detectar editor disponible
if command -v nano &> /dev/null; then
    EDITOR="nano"
elif command -v vim &> /dev/null; then
    EDITOR="vim"
else
    EDITOR="cat"
fi

echo "   nano .env.local"
echo ""
echo "   O con tu editor favorito:"
echo ""
echo "   GITHUB_CLIENT_ID=<tu_client_id>"
echo "   GITHUB_CLIENT_SECRET=<tu_client_secret>"
echo "   GITHUB_REDIRECT_URI=http://localhost:3000/.netlify/functions/auth/callback"
echo ""
echo "=========================================="
echo "✅ VERIFICAR DEPENDENCIAS"
echo "=========================================="
echo ""

# Verificar Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "   ✅ Node.js: $NODE_VERSION"
else
    echo "   ❌ Node.js no está instalado"
    echo "   → https://nodejs.org/"
    exit 1
fi

# Verificar pnpm
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm -v)
    echo "   ✅ pnpm: $PNPM_VERSION"
else
    echo "   ⚠️  pnpm no está instalado, instalando globalmente..."
    npm install -g pnpm
fi

# Verificar Netlify CLI
if command -v netlify &> /dev/null; then
    echo "   ✅ Netlify CLI instalado"
else
    echo "   ⚠️  Netlify CLI no está instalado"
    echo "   Recomendado: npm install -g netlify-cli"
fi

echo ""
echo "=========================================="
echo "📦 INSTALAR DEPENDENCIAS"
echo "=========================================="
echo ""

if [ ! -d "node_modules" ]; then
    echo "   📥 Descargando dependencias..."
    pnpm install
    echo "   ✅ Dependencias instaladas"
else
    echo "   ✅ node_modules ya existe"
fi

echo ""
echo "=========================================="
echo "🎯 DESARROLLO LOCAL"
echo "=========================================="
echo ""
echo "Opción 1: Con Netlify CLI (Recomendado)"
echo "   netlify dev"
echo "   → Visitará: http://localhost:8888"
echo ""
echo "Opción 2: Con Astro solo"
echo "   pnpm dev"
echo "   → Visitará: http://localhost:3000"
echo "   ⚠️ OAuth NO funcionará sin Netlify functions"
echo ""

echo "=========================================="
echo "🧪 TESTING EN PRODUCCIÓN"
echo "=========================================="
echo ""
echo "Para probar OAuth con localhost, usa ngrok:"
echo ""
echo "   # Terminal 1: Servidor"
echo "   netlify dev"
echo ""
echo "   # Terminal 2: ngrok"
echo "   ngrok http 8888"
echo ""
echo "   # Actualizar en GitHub OAuth App:"
echo "   Authorization callback URL: https://abc123.ngrok.io/.netlify/functions/auth/callback"
echo ""
echo "   # Actualizar .env.local:"
echo "   GITHUB_REDIRECT_URI=https://abc123.ngrok.io/.netlify/functions/auth/callback"
echo "   DEPLOY_URL=https://abc123.ngrok.io"
echo ""

echo "=========================================="
echo "📚 DOCUMENTACIÓN"
echo "=========================================="
echo ""
echo "Para más información, lee:"
echo "   • SETUP_OAUTH.md - Guía completa"
echo "   • CHANGELOG_REFACTOR.md - Cambios realizados"
echo "   • .env.example - Descripciones de variables"
echo ""

echo "=========================================="
echo "✅ ¡Listo!"
echo "=========================================="
echo ""
echo "Próximos pasos:"
echo "1. Edita .env.local con tus credenciales"
echo "2. Ejecuta: netlify dev"
echo "3. Abre http://localhost:8888"
echo "4. Haz clic en 'Conectar GitHub' en el editor"
echo ""
echo "¿Preguntas? Lee SETUP_OAUTH.md 📖"
echo ""
