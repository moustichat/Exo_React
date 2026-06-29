#!/bin/bash
# =============================================================
# Script de déploiement — Frontend React
# Usage : bash /var/www/frontend/scripts/deploy.sh
# =============================================================
set -e

echo ""
echo "========================================"
echo "  Déploiement Frontend — $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================"

# --- Récupération du code ---
echo "[1/3] Git pull..."
cd /var/www/frontend
git pull origin main

# --- Dépendances ---
echo "[2/3] Installation des dépendances..."
npm install

# --- Build ---
echo "[3/3] Build de production..."
npm run build

# --- Vérification ---
if [ -f "dist/index.html" ]; then
    echo ""
    echo "✓ Build disponible dans dist/"
else
    echo ""
    echo "✗ dist/index.html introuvable — le build a échoué"
    exit 1
fi

echo ""
echo "========================================"
echo "  Déploiement Frontend terminé avec succès"
echo "========================================"
