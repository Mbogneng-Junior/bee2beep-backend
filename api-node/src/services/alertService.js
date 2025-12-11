const ConfigAlerte = require('../models/ConfigAlerte');
const HistoriqueAlerte = require('../models/HistoriqueAlerte');
const pythonBridgeService = require('./pythonBridgeService');
const db = require('../config/db');

class AlertService {
  /**
   * Vérifie les règles d'alerte pour une nouvelle mesure
   * @param {Object} mesure - La mesure qui vient d'être enregistrée
   * @param {number} rucheId - L'ID de la ruche associée au capteur
   */
  async checkAndNotify(mesure, rucheId) {
    console.log(`[AlertService] Checking alerts for Ruche ${rucheId}...`);
    try {
      // 1. Récupérer les configs d'alerte pour cette ruche
      const configs = await ConfigAlerte.findByRucheId(rucheId);
      if (!configs || configs.length === 0) {
        console.log(`[AlertService] No alert configs found for Ruche ${rucheId}.`);
        return;
      }

      // 2. Récupérer les infos de l'utilisateur pour avoir son numéro
      // On fait une jointure rapide pour avoir le tel du propriétaire
      const userQuery = `
        SELECT u.telephone, u.email, r.nom as nom_ruche 
        FROM ruche r
        JOIN rucher ru ON r.rucher_id = ru.id
        JOIN utilisateur u ON ru.proprietaire_id = u.id
        WHERE r.id = $1
      `;
      const { rows } = await db.query(userQuery, [rucheId]);
      const userInfo = rows[0];

      if (!userInfo) {
        console.log(`[AlertService] User info not found for Ruche ${rucheId}.`);
        return;
      }

      console.log(`[AlertService] User found: ${userInfo.email}, Phone: ${userInfo.telephone}`);

      // 3. Vérifier chaque règle
      for (const config of configs) {
        let shouldAlert = false;
        let currentValue = null;

        // Sélection de la valeur à tester
        switch (config.type_donnee) {
          case 'POIDS':
            currentValue = mesure.poids_kg;
            break;
          case 'TEMP':
            currentValue = mesure.temperature_ext;
            break;
          case 'HUMIDITE':
            currentValue = mesure.humidite_ext;
            break;
        }

        if (currentValue === null || currentValue === undefined) continue;

        // Conversion explicite pour éviter les problèmes de type
        const valRef = parseFloat(config.valeur_reference);
        const valCur = parseFloat(currentValue);

        console.log(`[AlertService] Checking Rule ${config.id}: ${config.type_donnee} (${valCur}) ${config.condition} ${valRef}`);

        // Vérification de la condition
        if (config.condition === 'SEUIL_HAUT' && valCur > valRef) {
          shouldAlert = true;
        } else if (config.condition === 'SEUIL_BAS' && valCur < valRef) {
          shouldAlert = true;
        }
        
        if (shouldAlert) {
          console.log(`[AlertService] ALERT TRIGGERED for Rule ${config.id}`);
          const message = `⚠️ Alerte Bee2Beep - Ruche "${userInfo.nom_ruche}"\n${config.type_donnee} (${valCur}) a dépassé le seuil (${config.condition} ${valRef}).`;

          // Envoi WhatsApp
          if (config.notif_whatsapp && userInfo.telephone) {
            // Validation basique du numéro de téléphone (doit contenir des chiffres)
            const phoneRegex = /^[+]?[0-9\s]+$/;
            if (!phoneRegex.test(userInfo.telephone)) {
              console.warn(`[AlertService] Numéro de téléphone invalide pour l'utilisateur ${userInfo.email}: "${userInfo.telephone}". Pas d'envoi WhatsApp.`);
              await this.logHistory(config.id, `Echec: Numéro invalide (${userInfo.telephone})`, 'WHATSAPP', 'ECHEC');
              continue;
            }

            try {
              console.log(`[AlertService] Sending WhatsApp to ${userInfo.telephone}...`);
              await pythonBridgeService.sendWhatsapp(userInfo.telephone, message);
              console.log(`[AlertService] WhatsApp sent successfully.`);
              await this.logHistory(config.id, message, 'WHATSAPP', 'ENVOYE');
            } catch (err) {
              console.error("[AlertService] Echec envoi WhatsApp alerte:", err.message);
              await this.logHistory(config.id, message, 'WHATSAPP', 'ECHEC');
            }
          } else {
             console.log(`[AlertService] WhatsApp skipped (Enabled: ${config.notif_whatsapp}, Phone: ${userInfo.telephone})`);
          }

          // TODO: Envoi Email / SMS si activé
        }
      }
    } catch (error) {
      console.error("Erreur AlertService:", error);
    }
  }

  async logHistory(configId, message, canal, statut) {
    await HistoriqueAlerte.create({
      config_alerte_id: configId,
      message_contenu: message,
      canal_utilise: canal,
      statut: statut
    });
  }
}

module.exports = new AlertService();
