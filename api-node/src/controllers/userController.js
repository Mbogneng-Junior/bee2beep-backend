const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { prenom, nom, telephone, password } = req.body;
    const updates = { prenom, nom, telephone };

    if (password) {
      updates.mot_de_passe_hash = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.update(req.user.id, updates);
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du profil" });
  }
};
