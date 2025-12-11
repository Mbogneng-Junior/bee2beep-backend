const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Inscription
exports.register = async (req, res) => {
  try {
    const { email, password, prenom, nom, telephone, role } = req.body;

    // 1. Validation basique
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis." });
    }

    // 2. Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    // 3. Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Créer l'utilisateur
    const newUser = await User.create({
      email,
      mot_de_passe_hash: hashedPassword,
      prenom,
      nom,
      telephone,
      role // Attention: s'assurer que le rôle est valide ou géré par défaut dans le modèle
    });

    // 5. Générer le token JWT
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      token,
      user: newUser
    });

  } catch (error) {
    console.error("Erreur Register:", error);
    res.status(500).json({ message: "Erreur serveur lors de l'inscription." });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Vérifier l'email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect." });
    }

    // 2. Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.mot_de_passe_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect." });
    }

    // 3. Générer le token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Ne pas renvoyer le hash du mot de passe
    delete user.mot_de_passe_hash;

    res.status(200).json({
      message: "Connexion réussie",
      token,
      user
    });

  } catch (error) {
    console.error("Erreur Login:", error);
    res.status(500).json({ message: "Erreur serveur lors de la connexion." });
  }
};
