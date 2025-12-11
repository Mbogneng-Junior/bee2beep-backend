const Ruche = require('../models/Ruche');
const Rucher = require('../models/Rucher');

exports.createRuche = async (req, res) => {
  try {
    const { rucher_id, nom, url_photo, statut, date_installation, capteur_id } = req.body;

    // Vérifier que le rucher appartient bien à l'utilisateur
    const rucher = await Rucher.findById(rucher_id);
    if (!rucher) return res.status(404).json({ message: "Rucher introuvable." });
    if (rucher.proprietaire_id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: "Non autorisé." });
    }

    const newRuche = await Ruche.create({ rucher_id, nom, url_photo, statut, date_installation, capteur_id });
    res.status(201).json(newRuche);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création de la ruche." });
  }
};

exports.getRuchesByRucher = async (req, res) => {
  try {
    const { rucherId } = req.params;
    
    // Vérif accès
    const rucher = await Rucher.findById(rucherId);
    if (!rucher) return res.status(404).json({ message: "Rucher introuvable." });
    if (rucher.proprietaire_id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: "Non autorisé." });
    }

    const ruches = await Ruche.findAllByRucherId(rucherId);
    res.json(ruches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.getRucheById = async (req, res) => {
  try {
    const ruche = await Ruche.findById(req.params.id);
    if (!ruche) return res.status(404).json({ message: "Ruche non trouvée." });

    // Pour vérifier l'accès, on doit remonter au rucher
    const rucher = await Rucher.findById(ruche.rucher_id);
    if (rucher.proprietaire_id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: "Non autorisé." });
    }

    res.json(ruche);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.updateRuche = async (req, res) => {
  try {
    const ruche = await Ruche.findById(req.params.id);
    if (!ruche) return res.status(404).json({ message: "Ruche non trouvée." });

    const rucher = await Rucher.findById(ruche.rucher_id);
    if (rucher.proprietaire_id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: "Non autorisé." });
    }

    const updatedRuche = await Ruche.update(req.params.id, req.body);
    res.json(updatedRuche);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour." });
  }
};

exports.deleteRuche = async (req, res) => {
  try {
    const ruche = await Ruche.findById(req.params.id);
    if (!ruche) return res.status(404).json({ message: "Ruche non trouvée." });

    const rucher = await Rucher.findById(ruche.rucher_id);
    if (rucher.proprietaire_id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: "Non autorisé." });
    }

    await Ruche.delete(req.params.id);
    res.json({ message: "Ruche supprimée." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la suppression." });
  }
};
