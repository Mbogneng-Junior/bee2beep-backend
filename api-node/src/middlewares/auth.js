const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // 1. Récupérer le token du header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Accès refusé. Token manquant." });
  }

  try {
    // 2. Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Ajouter l'utilisateur à la requête
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token invalide ou expiré." });
  }
};
