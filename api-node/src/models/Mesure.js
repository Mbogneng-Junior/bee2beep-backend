const db = require('../config/db');

class Mesure {
  static async create({ capteur_id, poids_kg, temperature_ext, humidite_ext, gain_poids_24h }) {
    const query = `
      INSERT INTO mesure (capteur_id, poids_kg, temperature_ext, humidite_ext, gain_poids_24h)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [capteur_id, poids_kg, temperature_ext, humidite_ext, gain_poids_24h || 0];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  static async findLatestByCapteurId(capteurId) {
    const query = `SELECT * FROM mesure WHERE capteur_id = $1 ORDER BY date_releve DESC LIMIT 1`;
    const { rows } = await db.query(query, [capteurId]);
    return rows[0];
  }
  
  static async getHistoryByCapteurId(capteurId, limit = 100) {
      const query = `SELECT * FROM mesure WHERE capteur_id = $1 ORDER BY date_releve DESC LIMIT $2`;
      const { rows } = await db.query(query, [capteurId, limit]);
      return rows;
  }
}

module.exports = Mesure;
