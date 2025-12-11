const db = require('../config/db');

class ConfigAlerte {
  static async create({ ruche_id, type_donnee, condition, valeur_reference, notif_sms, notif_email, notif_whatsapp }) {
    const query = `
      INSERT INTO config_alerte (ruche_id, type_donnee, condition, valeur_reference, notif_sms, notif_email, notif_whatsapp)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [ruche_id, type_donnee, condition, valeur_reference, notif_sms || false, notif_email || false, notif_whatsapp || false];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  static async findByRucheId(rucheId) {
    const query = `SELECT * FROM config_alerte WHERE ruche_id = $1`;
    const { rows } = await db.query(query, [rucheId]);
    return rows;
  }

  static async delete(id) {
    const query = `DELETE FROM config_alerte WHERE id = $1 RETURNING id`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
}

module.exports = ConfigAlerte;
