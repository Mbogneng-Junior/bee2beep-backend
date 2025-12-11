const axios = require('axios');

class PythonBridgeService {
  constructor() {
    this.workerUrl = process.env.WORKER_URL || 'http://worker-python:5000';
  }

  /**
   * Envoie un message WhatsApp via le worker Python
   * @param {string} phoneNumber - Numéro de téléphone
   * @param {string} message - Message à envoyer
   * @returns {Promise<Object>} - Réponse du worker
   */
  async sendWhatsapp(phoneNumber, message) {
    try {
      const response = await axios.post(`${this.workerUrl}/send-whatsapp`, {
        phone_number: phoneNumber,
        message: message
      });
      return response.data;
    } catch (error) {
      console.error('Erreur PythonBridgeService:', error.message);
      if (error.response) {
        throw new Error(`Erreur Worker: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      }
      throw new Error('Impossible de contacter le service Python');
    }
  }

  async getWhatsappStatus() {
    try {
      const response = await axios.get(`${this.workerUrl}/whatsapp-status`);
      return response.data;
    } catch (error) {
      throw new Error('Impossible de récupérer le statut WhatsApp');
    }
  }
}

module.exports = new PythonBridgeService();
