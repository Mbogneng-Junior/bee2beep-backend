const db = require('../config/db');

class User {
  /**
   * Crée un nouvel utilisateur
   * @param {Object} user - L'objet utilisateur
   * @returns {Object} - L'utilisateur créé
   */
  static async create({ email, mot_de_passe_hash, prenom, nom, telephone, role }) {
    const query = `
      INSERT INTO utilisateur (email, mot_de_passe_hash, prenom, nom, telephone, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, prenom, nom, telephone, role, date_creation;
    `;
    const values = [email, mot_de_passe_hash, prenom, nom, telephone, role || 'INVITE'];
    
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  /**
   * Trouve un utilisateur par son email
   * @param {string} email 
   * @returns {Object} - L'utilisateur trouvé ou undefined
   */
  static async findByEmail(email) {
    const query = `SELECT * FROM utilisateur WHERE email = $1`;
    const { rows } = await db.query(query, [email]);
    return rows[0];
  }

  /**
   * Trouve un utilisateur par son ID
   * @param {number} id 
   * @returns {Object} - L'utilisateur trouvé ou undefined
   */
  static async findById(id) {
    const query = `SELECT id, email, prenom, nom, telephone, role, date_creation FROM utilisateur WHERE id = $1`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  /**
   * Met à jour les informations d'un utilisateur
   * @param {number} id 
   * @param {Object} updates 
   */
  static async update(id, { prenom, nom, telephone, mot_de_passe_hash }) {
    const query = `
      UPDATE utilisateur
      SET prenom = COALESCE($2, prenom),
          nom = COALESCE($3, nom),
          telephone = COALESCE($4, telephone),
          mot_de_passe_hash = COALESCE($5, mot_de_passe_hash)
      WHERE id = $1
      RETURNING id, email, prenom, nom, telephone, role, date_creation;
    `;
    const values = [id, prenom, nom, telephone, mot_de_passe_hash];
    const { rows } = await db.query(query, values);
    return rows[0];
  }
}

module.exports = User;
