const Mesure = require('../models/Mesure');
const Ruche = require('../models/Ruche');
const db = require('../config/db');
const alertService = require('../services/alertService');

exports.addMesure = async (req, res) => {
  try {
    const { capteur_id, poids_kg, temperature_ext, humidite_ext, gain_poids_24h } = req.body;

    // 1. Vérifier que le capteur existe et est lié à une ruche
    // On a besoin de l'ID de la ruche pour les alertes
    const query = `SELECT id as ruche_id FROM ruche WHERE capteur_id = $1`;
    const { rows } = await db.query(query, [capteur_id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "Capteur non associé à une ruche active." });
    }
    const rucheId = rows[0].ruche_id;

    // 2. Enregistrer la mesure
    const newMesure = await Mesure.create({
      capteur_id,
      poids_kg,
      temperature_ext,
      humidite_ext,
      gain_poids_24h
    });

    // 3. Déclencher la vérification des alertes (Asynchrone, on ne bloque pas la réponse)
    alertService.checkAndNotify(newMesure, rucheId);

    res.status(201).json(newMesure);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'enregistrement de la mesure." });
  }
};

exports.getHistory = async (req, res) => {
    try {
        const { capteurId } = req.params;
        const mesures = await Mesure.getHistoryByCapteurId(capteurId);
        res.json(mesures);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};
