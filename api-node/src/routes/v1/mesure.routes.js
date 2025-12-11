const express = require('express');
const router = express.Router();
const mesureController = require('../../controllers/mesureController');
const auth = require('../../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Mesures
 *   description: Réception des données IoT
 */

/**
 * @swagger
 * /mesures:
 *   post:
 *     summary: Enregistrer une nouvelle mesure (Simule le capteur)
 *     tags: [Mesures]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - capteur_id
 *             properties:
 *               capteur_id:
 *                 type: integer
 *               poids_kg:
 *                 type: number
 *               temperature_ext:
 *                 type: number
 *               humidite_ext:
 *                 type: number
 *     responses:
 *       201:
 *         description: Mesure enregistrée
 */
router.post('/', auth, mesureController.addMesure);

router.get('/capteur/:capteurId', auth, mesureController.getHistory);

module.exports = router;
