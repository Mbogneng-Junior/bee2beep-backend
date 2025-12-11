const db = require('../config/db');

class Rucher {
  static async create({ proprietaire_id, nom, description, latitude, longitude, adresse }) {
    const query = `
      INSERT INTO rucher (proprietaire_id, nom, description, latitude, longitude, adresse)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [proprietaire_id, nom, description, latitude, longitude, adresse];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  static async findAllByUserId(userId) {
    const query = `SELECT * FROM rucher WHERE proprietaire_id = $1 ORDER BY id DESC`;
    const { rows } = await db.query(query, [userId]);
    return rows;
  }

  static async findById(id) {
    const query = `SELECT * FROM rucher WHERE id = $1`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  static async update(id, { nom, description, latitude, longitude, adresse }) {
    const query = `
      UPDATE rucher 
      SET nom = COALESCE($2, nom), 
          description = COALESCE($3, description),
          latitude = COALESCE($4, latitude),
          longitude = COALESCE($5, longitude),
          adresse = COALESCE($6, adresse)
      WHERE id = $1
      RETURNING *;
    `;
    const values = [id, nom, description, latitude, longitude, adresse];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  static async delete(id) {
    const query = `DELETE FROM rucher WHERE id = $1 RETURNING id`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
}

module.exports = Rucher;
