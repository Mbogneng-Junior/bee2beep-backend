const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const auth = require('../../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Utilisateurs
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Récupérer son propre profil
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur
 */
router.get('/me', auth, userController.getProfile);

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Mettre à jour son profil (infos ou mot de passe)
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prenom:
 *                 type: string
 *               nom:
 *                 type: string
 *               telephone:
 *                 type: string
 *               password:
 *                 type: string
 *                 description: Nouveau mot de passe (optionnel)
 *     responses:
 *       200:
 *         description: Profil mis à jour
 */
router.put('/me', auth, userController.updateProfile);

module.exports = router;
