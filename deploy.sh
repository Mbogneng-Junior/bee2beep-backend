#!/bin/bash

# Configuration
DROPLET_IP="167.71.176.127"
USER="root"
REMOTE_DIR="/var/www/bee2beep-backend"
REPO_URL="https://github.com/Mbogneng-Junior/bee2beep-backend.git"
BRANCH="main"

echo "🚀 Déploiement vers $DROPLET_IP via Git..."

# 1. Connexion SSH pour cloner/puller le code
ssh $USER@$DROPLET_IP << EOF
    # Création du dossier si inexistant
    mkdir -p $REMOTE_DIR
    cd $REMOTE_DIR
    
    # Vérification si le dépôt existe déjà
    if [ -d ".git" ]; then
        echo "📂 Le dépôt existe déjà. Mise à jour..."
        # On force le reset pour écraser les modifications locales (comme docker-compose.prod.yml qui bloque)
        git fetch origin
        git reset --hard origin/$BRANCH
    else
        echo "wm Initialisation du dépôt..."
        # Le dossier existe déjà (car on a créé .env), donc git clone échoue.
        # On initialise git manuellement.
        git init
        git remote add origin $REPO_URL
        git fetch origin
        git reset --hard origin/$BRANCH
    fi
EOF

# 2. Copie du fichier docker-compose.prod.yml (au cas où il n'est pas commité)
echo "📄 Envoi de la configuration de production..."
scp docker-compose.prod.yml $USER@$DROPLET_IP:$REMOTE_DIR/

# 3. Instructions pour le fichier .env
echo "⚠️  N'oubliez pas de créer/mettre à jour le fichier .env sur le serveur !"
echo "    ssh $USER@$DROPLET_IP"
echo "    nano $REMOTE_DIR/.env"

# 4. Lancement de Docker Compose sur le serveur
echo "🔄 Redémarrage des conteneurs..."
ssh $USER@$DROPLET_IP "cd $REMOTE_DIR && docker compose -f docker-compose.prod.yml down && docker compose -f docker-compose.prod.yml up -d --build"

echo "✅ Déploiement terminé !"
