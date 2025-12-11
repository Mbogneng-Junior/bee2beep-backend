const Capteur = require('../models/Capteur');
const Ruche = require('../models/Ruche');
const Rucher = require('../models/Rucher');

exports.createCapteur = async (req, res) => {
  try {
    const { numero_serie, type_reseau, adresse_mac } = req.body;

    // Vérification simple : seul un ADMIN devrait pouvoir créer des capteurs dans le stock
    // Mais pour l'instant on laisse ouvert ou on restreint selon votre besoin
    // if (req.user.role !== 'ADMIN') return res.status(403).json({ message: "Non autorisé" });

    const newCapteur = await Capteur.create({ numero_serie, type_reseau, adresse_mac });
    res.status(201).json(newCapteur);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création du capteur." });
  }
};

exports.getAllCapteurs = async (req, res) => {
  try {
    const capteurs = await Capteur.findAll();
    res.json(capteurs);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.associateCapteurToRuche = async (req, res) => {
  try {
    const { rucheId, capteurId } = req.body;

    // 1. Vérifier que la ruche appartient à l'utilisateur
    const ruche = await Ruche.findById(rucheId);
    if (!ruche) return res.status(404).json({ message: "Ruche introuvable." });

    const rucher = await Rucher.findById(ruche.rucher_id);
    if (rucher.proprietaire_id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: "Non autorisé." });
    }

    // 2. Vérifier que le capteur existe
    const capteur = await Capteur.findById(capteurId);
    if (!capteur) return res.status(404).json({ message: "Capteur introuvable." });

    // 3. Associer (Mise à jour de la ruche)
    const updatedRuche = await Ruche.update(rucheId, { capteur_id: capteurId });
    
    res.json({ message: "Capteur associé avec succès", ruche: updatedRuche });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'association." });
  }
};
