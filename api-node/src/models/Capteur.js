const db = require('../config/db');

class Capteur {
  static async create({ numero_serie, type_reseau, adresse_mac }) {
    const query = `
      INSERT INTO capteur_balance (numero_serie, type_reseau, adresse_mac, niveau_batterie, qualite_signal, derniere_synchro)
      VALUES ($1, $2, $3, 100, 100, NOW())
      RETURNING *;
    `;
    const values = [numero_serie, type_reseau, adresse_mac];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  static async findAll() {
    const query = `SELECT * FROM capteur_balance ORDER BY id DESC`;
    const { rows } = await db.query(query);
    return rows;
  }

  static async findById(id) {
    const query = `SELECT * FROM capteur_balance WHERE id = $1`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  static async update(id, { numero_serie, type_reseau, adresse_mac }) {
    const query = `
      UPDATE capteur_balance 
      SET numero_serie = COALESCE($2, numero_serie), 
          type_reseau = COALESCE($3, type_reseau),
          adresse_mac = COALESCE($4, adresse_mac)
      WHERE id = $1
      RETURNING *;
    `;
    const values = [id, numero_serie, type_reseau, adresse_mac];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  static async delete(id) {
    const query = `DELETE FROM capteur_balance WHERE id = $1 RETURNING id`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
}

module.exports = Capteur;
