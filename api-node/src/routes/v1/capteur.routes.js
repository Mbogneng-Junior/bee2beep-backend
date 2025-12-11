const express = require('express');
const router = express.Router();
const capteurController = require('../../controllers/capteurController');
const auth = require('../../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Capteurs
 *   description: Gestion du matériel IoT
 */

/**
 * @swagger
 * /capteurs:
 *   post:
 *     summary: Enregistrer un nouveau capteur (Stock)
 *     tags: [Capteurs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numero_serie
 *             properties:
 *               numero_serie:
 *                 type: string
 *               type_reseau:
 *                 type: string
 *                 enum: [SIGFOX, LORA]
 *               adresse_mac:
 *                 type: string
 *     responses:
 *       201:
 *         description: Capteur créé
 */
router.post('/', auth, capteurController.createCapteur);

/**
 * @swagger
 * /capteurs:
 *   get:
 *     summary: Lister tous les capteurs
 *     tags: [Capteurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des capteurs
 */
router.get('/', auth, capteurController.getAllCapteurs);

/**
 * @swagger
 * /capteurs/associate:
 *   post:
 *     summary: Associer un capteur à une ruche
 *     tags: [Capteurs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rucheId
 *               - capteurId
 *             properties:
 *               rucheId:
 *                 type: integer
 *               capteurId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Association réussie
 */
router.post('/associate', auth, capteurController.associateCapteurToRuche);

module.exports = router;
