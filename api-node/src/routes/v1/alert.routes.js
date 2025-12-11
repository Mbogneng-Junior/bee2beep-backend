const express = require('express');
const router = express.Router();
const alertController = require('../../controllers/alertController');
const auth = require('../../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Alertes
 *   description: Configuration des seuils d'alerte
 */

/**
 * @swagger
 * /alertes/config:
 *   post:
 *     summary: Créer une règle d'alerte pour une ruche
 *     tags: [Alertes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ruche_id
 *               - type_donnee
 *               - condition
 *               - valeur_reference
 *             properties:
 *               ruche_id:
 *                 type: integer
 *               type_donnee:
 *                 type: string
 *                 enum: [POIDS, TEMP, HUMIDITE]
 *               condition:
 *                 type: string
 *                 enum: [SEUIL_HAUT, SEUIL_BAS]
 *               valeur_reference:
 *                 type: number
 *               notif_whatsapp:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Règle créée
 */
router.post('/config', auth, alertController.createConfig);

router.get('/config/ruche/:rucheId', auth, alertController.getConfigsByRuche);

module.exports = router;
