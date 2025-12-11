const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/notificationController');
const auth = require('../../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Gestion des notifications et alertes (via Worker Python)
 */

/**
 * @swagger
 * /notifications/whatsapp/status:
 *   get:
 *     summary: Vérifier l'état de l'instance Green API
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statut de l'instance (authorized, notAuthorized, etc.)
 */
router.get('/whatsapp/status', auth, notificationController.getWhatsappStatus);

/**
 * @swagger
 * /notifications/whatsapp:
 *   post:
 *     summary: Envoyer un message WhatsApp (Test)
 *     description: Envoie une requête au worker Python pour expédier un message WhatsApp via Green API.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone_number
 *               - message
 *             properties:
 *               phone_number:
 *                 type: string
 *                 description: Numéro au format international (ex 33612345678)
 *                 example: "33612345678"
 *               message:
 *                 type: string
 *                 description: Contenu du message
 *                 example: "Alerte : La ruche 1 a été déplacée !"
 *     responses:
 *       200:
 *         description: Message envoyé au worker
 *       400:
 *         description: Données manquantes
 *       500:
 *         description: Erreur de communication avec le worker
 */
router.post('/whatsapp', auth, notificationController.sendWhatsapp);

module.exports = router;
