-- Enum types
CREATE TYPE role_enum AS ENUM ('ADMIN', 'INVITE');
CREATE TYPE statut_ruche_enum AS ENUM ('ACTIVE', 'HIVERNAGE', 'INACTIVE');
CREATE TYPE type_reseau_enum AS ENUM ('SIGFOX', 'LORA');
CREATE TYPE type_donnee_enum AS ENUM ('POIDS', 'TEMP', 'HUMIDITE');
CREATE TYPE condition_enum AS ENUM ('SEUIL_HAUT', 'SEUIL_BAS', 'VARIATION');
CREATE TYPE statut_envoi_enum AS ENUM ('ENVOYE', 'ECHEC');

-- Tables
CREATE TABLE IF NOT EXISTS utilisateur (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe_hash VARCHAR(255) NOT NULL,
    prenom VARCHAR(100),
    nom VARCHAR(100),
    telephone VARCHAR(20),
    role role_enum DEFAULT 'INVITE',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS abonnement (
    id SERIAL PRIMARY KEY,
    utilisateur_id INTEGER REFERENCES utilisateur(id),
    type_abonnement VARCHAR(50),
    date_debut TIMESTAMP,
    date_fin TIMESTAMP,
    est_actif BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS rucher (
    id SERIAL PRIMARY KEY,
    proprietaire_id INTEGER REFERENCES utilisateur(id),
    nom VARCHAR(100),
    description TEXT,
    latitude FLOAT,
    longitude FLOAT,
    adresse VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS capteur_balance (
    id SERIAL PRIMARY KEY,
    numero_serie VARCHAR(100) UNIQUE NOT NULL,
    type_reseau type_reseau_enum,
    niveau_batterie INTEGER,
    qualite_signal INTEGER,
    adresse_mac VARCHAR(50),
    derniere_synchro TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ruche (
    id SERIAL PRIMARY KEY,
    rucher_id INTEGER REFERENCES rucher(id),
    capteur_id INTEGER REFERENCES capteur_balance(id),
    nom VARCHAR(100),
    url_photo VARCHAR(255),
    statut statut_ruche_enum DEFAULT 'ACTIVE',
    date_installation TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mesure (
    id BIGSERIAL PRIMARY KEY,
    capteur_id INTEGER REFERENCES capteur_balance(id),
    date_releve TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    poids_kg FLOAT,
    temperature_ext FLOAT,
    humidite_ext FLOAT,
    gain_poids_24h FLOAT
);

CREATE TABLE IF NOT EXISTS config_alerte (
    id SERIAL PRIMARY KEY,
    ruche_id INTEGER REFERENCES ruche(id),
    type_donnee type_donnee_enum,
    condition condition_enum,
    valeur_reference FLOAT,
    notif_sms BOOLEAN DEFAULT FALSE,
    notif_email BOOLEAN DEFAULT FALSE,
    notif_whatsapp BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS historique_alerte (
    id SERIAL PRIMARY KEY,
    config_alerte_id INTEGER REFERENCES config_alerte(id),
    date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message_contenu TEXT,
    canal_utilise VARCHAR(50),
    statut statut_envoi_enum
);
