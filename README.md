# 🐝 Bee2Beep Backend

Le backend de la solution **Bee2Beep**, une plateforme SaaS de gestion de ruches connectées.
Ce projet utilise une architecture hybride micro-services orchestrée par Docker.

## 🏗 Architecture

Le backend est composé de trois services principaux :

1.  **API Node.js (Express)** : Cerveau principal. Gère l'authentification, la logique métier (Ruchers, Ruches, Capteurs), l'ingestion des données IoT et le moteur d'alertes.
2.  **Worker Python (Flask)** : Micro-service dédié aux tâches spécifiques, notamment l'interface avec **Green API** pour l'envoi de notifications WhatsApp.
3.  **PostgreSQL** : Base de données relationnelle (stockage des utilisateurs, configurations, mesures IoT).

## 🚀 Fonctionnalités

*   **Authentification** : Inscription/Connexion sécurisée via JWT (Bcrypt).
*   **Gestion de Parc** : CRUD complet pour les Ruchers, Ruches et Capteurs.
*   **IoT** : Réception et stockage des mesures (Poids, Température, Humidité).
*   **Moteur d'Alertes** :
    *   Configuration de seuils (Haut/Bas) par ruche.
    *   Analyse en temps réel des mesures entrantes.
    *   Déclenchement de notifications.
*   **Notifications** : Envoi d'alertes via WhatsApp (intégré via le worker Python).
*   **Documentation** : Swagger UI intégré (`/api-docs`).

## 🛠 Prérequis

*   Docker & Docker Compose
*   Node.js 18+ (pour le développement local hors Docker)
*   Un compte Green API (pour WhatsApp)

## ⚙️ Installation & Démarrage (Local)

1.  **Cloner le projet**
    ```bash
    git clone https://github.com/Mbogneng-Junior/bee2beep-backend.git
    cd bee2beep-backend
    ```

2.  **Configuration**
    Créez un fichier `.env` à la racine (voir `.env.example`) ou dans chaque dossier (`api-node/.env`, `worker-python/.env`).
    
    *Exemple de variables requises :*
    ```env
    DB_USER=postgres
    DB_PASSWORD=postgres
    DB_NAME=bee2beep
    JWT_SECRET=votre_secret
    GREEN_API_INSTANCE_ID=...
    GREEN_API_TOKEN=...
    ```

3.  **Lancer avec Docker Compose**
    ```bash
    docker compose up --build
    ```
    *   L'API est accessible sur : `http://localhost:3000`
    *   La documentation Swagger : `http://localhost:3000/api-docs`

## 🌍 Déploiement (Production)

Le projet inclut un script de déploiement automatisé pour serveur VPS (ex: DigitalOcean).

1.  **Sur le serveur** :
    *   Créer le dossier `/var/www/bee2beep-backend`.
    *   Créer le fichier `.env` de production avec les identifiants de la BDD managée et les clés API.

2.  **Depuis la machine locale** :
    ```bash
    ./deploy.sh
    ```
    Ce script va :
    *   Se connecter en SSH.
    *   Puller la dernière version du code (branche `main`).
    *   Envoyer la configuration Docker de production (`docker-compose.prod.yml`).
    *   Reconstruire et redémarrer les conteneurs.

## 📚 API Endpoints Principaux

*   `POST /auth/login` : Connexion
*   `GET /ruchers` : Liste des ruchers
*   `POST /ruches` : Création d'une ruche (avec association capteur)
*   `POST /mesures` : Envoi d'une donnée IoT (simulée)
*   `POST /alertes/config` : Création d'une règle d'alerte

## 👤 Auteur

Mbogneng Junior
