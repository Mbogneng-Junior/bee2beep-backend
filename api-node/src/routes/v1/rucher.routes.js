const express = require('express');
const router = express.Router();
const rucherController = require('../../controllers/rucherController');
const auth = require('../../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Ruchers
 *   description: Gestion des ruchers (lieux géographiques)
 */

/**
 * @swagger
 * /ruchers:
 *   get:
 *     summary: Récupérer tous les ruchers de l'utilisateur connecté
 *     tags: [Ruchers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des ruchers
 */
router.get('/', auth, rucherController.getMyRuchers);

/**
 * @swagger
 * /ruchers/{id}:
 *   get:
 *     summary: Récupérer un rucher par son ID
 *     tags: [Ruchers]
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
 *         description: Détails du rucher
 *       404:
 *         description: Rucher non trouvé
 */
router.get('/:id', auth, rucherController.getRucherById);

/**
 * @swagger
 * /ruchers:
 *   post:
 *     summary: Créer un nouveau rucher
 *     tags: [Ruchers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *             properties:
 *               nom:
 *                 type: string
 *               description:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               adresse:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rucher créé
 */
router.post('/', auth, rucherController.createRucher);

/**
 * @swagger
 * /ruchers/{id}:
 *   put:
 *     summary: Mettre à jour un rucher
 *     tags: [Ruchers]
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
 *               description:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               adresse:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rucher mis à jour
 */
router.put('/:id', auth, rucherController.updateRucher);

/**
 * @swagger
 * /ruchers/{id}:
 *   delete:
 *     summary: Supprimer un rucher
 *     tags: [Ruchers]
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
 *         description: Rucher supprimé
 */
router.delete('/:id', auth, rucherController.deleteRucher);

module.exports = router;
