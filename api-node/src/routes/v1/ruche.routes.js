const express = require('express');
const router = express.Router();
const rucheController = require('../../controllers/rucheController');
const auth = require('../../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Ruches
 *   description: Gestion des ruches (unités biologiques)
 */

/**
 * @swagger
 * /ruches/rucher/{rucherId}:
 *   get:
 *     summary: Récupérer toutes les ruches d'un rucher spécifique
 *     tags: [Ruches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rucherId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des ruches
 */
router.get('/rucher/:rucherId', auth, rucheController.getRuchesByRucher);

/**
 * @swagger
 * /ruches/{id}:
 *   get:
 *     summary: Récupérer une ruche par son ID
 *     tags: [Ruches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de la ruche
 */
router.get('/:id', auth, rucheController.getRucheById);

/**
 * @swagger
 * /ruches:
 *   post:
 *     summary: Créer une nouvelle ruche dans un rucher
 *     tags: [Ruches]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rucher_id
 *               - nom
 *             properties:
 *               rucher_id:
 *                 type: integer
 *               nom:
 *                 type: string
 *               url_photo:
 *                 type: string
 *               statut:
 *                 type: string
 *                 enum: [ACTIVE, HIVERNAGE, INACTIVE]
 *               date_installation:
 *                 type: string
 *                 format: date-time
 *               capteur_id:
 *                 type: integer
 *                 description: ID du capteur à associer (optionnel)
 *     responses:
 *       201:
 *         description: Ruche créée
 */
router.post('/', auth, rucheController.createRuche);

/**
 * @swagger
 * /ruches/{id}:
 *   put:
 *     summary: Mettre à jour une ruche
 *     tags: [Ruches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               statut:
 *                 type: string
 *               capteur_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Ruche mise à jour
 */
router.put('/:id', auth, rucheController.updateRuche);

/**
 * @swagger
 * /ruches/{id}:
 *   delete:
 *     summary: Supprimer une ruche
 *     tags: [Ruches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ruche supprimée
 */
router.delete('/:id', auth, rucheController.deleteRuche);

module.exports = router;
