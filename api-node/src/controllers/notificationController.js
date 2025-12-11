const pythonBridgeService = require('../services/pythonBridgeService');

exports.sendWhatsapp = async (req, res) => {
  try {
    const { phone_number, message } = req.body;

    if (!phone_number || !message) {
      return res.status(400).json({ message: "phone_number et message sont requis." });
    }

    // Appel au service Python
    const result = await pythonBridgeService.sendWhatsapp(phone_number, message);

    res.status(200).json({
      message: "Demande d'envoi traitée avec succès",
      workerResponse: result
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Erreur lors de l'envoi du message." });
  }
};

exports.getWhatsappStatus = async (req, res) => {
  try {
    const status = await pythonBridgeService.getWhatsappStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du statut." });
  }
};
