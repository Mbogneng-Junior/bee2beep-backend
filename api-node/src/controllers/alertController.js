const ConfigAlerte = require('../models/ConfigAlerte');
const Ruche = require('../models/Ruche');
const Rucher = require('../models/Rucher');

exports.createConfig = async (req, res) => {
  try {
    const { ruche_id, type_donnee, condition, valeur_reference, notif_whatsapp } = req.body;

    // Vérif droits
    const ruche = await Ruche.findById(ruche_id);
    if (!ruche) return res.status(404).json({ message: "Ruche introuvable" });
    
    const rucher = await Rucher.findById(ruche.rucher_id);
    if (rucher.proprietaire_id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: "Non autorisé" });
    }

    const config = await ConfigAlerte.create({
      ruche_id, type_donnee, condition, valeur_reference, notif_whatsapp
    });

    res.status(201).json(config);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur création config alerte" });
  }
};

exports.getConfigsByRuche = async (req, res) => {
  try {
    const { rucheId } = req.params;
    // TODO: Ajouter vérif droits ici aussi
    const configs = await ConfigAlerte.findByRucheId(rucheId);
    res.json(configs);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
