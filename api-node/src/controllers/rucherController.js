const Rucher = require('../models/Rucher');

exports.createRucher = async (req, res) => {
  try {
    const { nom, description, latitude, longitude, adresse } = req.body;
    const proprietaire_id = req.user.id; // Récupéré via le middleware auth

    if (!nom) {
      return res.status(400).json({ message: "Le nom du rucher est obligatoire." });
    }

    const newRucher = await Rucher.create({ proprietaire_id, nom, description, latitude, longitude, adresse });
    res.status(201).json(newRucher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création du rucher." });
  }
};

exports.getMyRuchers = async (req, res) => {
  try {
    const ruchers = await Rucher.findAllByUserId(req.user.id);
    res.json(ruchers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des ruchers." });
  }
};

exports.getRucherById = async (req, res) => {
  try {
    const rucher = await Rucher.findById(req.params.id);
    if (!rucher) {
      return res.status(404).json({ message: "Rucher non trouvé." });
    }
    // Vérification simple d'appartenance (optionnel mais recommandé)
    if (rucher.proprietaire_id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: "Accès non autorisé à ce rucher." });
    }
    res.json(rucher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.updateRucher = async (req, res) => {
  try {
    const rucher = await Rucher.findById(req.params.id);
    if (!rucher) return res.status(404).json({ message: "Rucher non trouvé." });
    
    if (rucher.proprietaire_id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: "Non autorisé." });
    }

    const updatedRucher = await Rucher.update(req.params.id, req.body);
    res.json(updatedRucher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour." });
  }
};

exports.deleteRucher = async (req, res) => {
  try {
    const rucher = await Rucher.findById(req.params.id);
    if (!rucher) return res.status(404).json({ message: "Rucher non trouvé." });

    if (rucher.proprietaire_id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: "Non autorisé." });
    }

    await Rucher.delete(req.params.id);
    res.json({ message: "Rucher supprimé avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la suppression." });
  }
};
