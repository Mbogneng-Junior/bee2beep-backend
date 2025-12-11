const db = require('../config/db');

class Ruche {
  static async create({ rucher_id, nom, url_photo, statut, date_installation, capteur_id }) {
    const query = `
      INSERT INTO ruche (rucher_id, nom, url_photo, statut, date_installation, capteur_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [rucher_id, nom, url_photo, statut || 'ACTIVE', date_installation || new Date(), capteur_id || null];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  static async findAllByRucherId(rucherId) {
    const query = `SELECT * FROM ruche WHERE rucher_id = $1 ORDER BY id ASC`;
    const { rows } = await db.query(query, [rucherId]);
    return rows;
  }

  static async findById(id) {
    const query = `SELECT * FROM ruche WHERE id = $1`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  static async update(id, { nom, url_photo, statut, capteur_id }) {
    const query = `
      UPDATE ruche 
      SET nom = COALESCE($2, nom), 
          url_photo = COALESCE($3, url_photo),
          statut = COALESCE($4, statut),
          capteur_id = COALESCE($5, capteur_id)
      WHERE id = $1
      RETURNING *;
    `;
    const values = [id, nom, url_photo, statut, capteur_id];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  static async delete(id) {
    const query = `DELETE FROM ruche WHERE id = $1 RETURNING id`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
}

module.exports = Ruche;
