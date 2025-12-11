const db = require('../config/db');

class HistoriqueAlerte {
  static async create({ config_alerte_id, message_contenu, canal_utilise, statut }) {
    const query = `
      INSERT INTO historique_alerte (config_alerte_id, message_contenu, canal_utilise, statut)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [config_alerte_id, message_contenu, canal_utilise, statut];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  static async findByRucheId(rucheId) {
    // Jointure pour récupérer l'historique lié aux configs d'une ruche spécifique
    const query = `
      SELECT h.*, c.type_donnee, c.condition 
      FROM historique_alerte h
      JOIN config_alerte c ON h.config_alerte_id = c.id
      WHERE c.ruche_id = $1
      ORDER BY h.date_envoi DESC
    `;
    const { rows } = await db.query(query, [rucheId]);
    return rows;
  }
}

module.exports = HistoriqueAlerte;
