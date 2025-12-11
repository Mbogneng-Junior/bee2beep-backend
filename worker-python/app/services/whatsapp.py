import requests
import os
import json

class GreenApiService:
    def __init__(self):
        self.instance_id = os.getenv('GREEN_API_INSTANCE_ID')
        self.api_token = os.getenv('GREEN_API_TOKEN')
        self.api_host = os.getenv('GREEN_API_HOST', 'https://api.green-api.com')
        self.base_url = f"{self.api_host}/waInstance{self.instance_id}"

    def get_status(self):
        """
        Vérifie l'état de l'instance Green API (autorisée, hors ligne, etc.)
        """
        if not self.instance_id or not self.api_token:
            return {"error": "Identifiants manquants"}

        url = f"{self.base_url}/getStateInstance/{self.api_token}"
        
        try:
            response = requests.get(url)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"error": str(e)}

    def send_message(self, phone_number, message):
        """
        Envoie un message WhatsApp via Green API.
        :param phone_number: Numéro de téléphone au format international (ex: 33612345678)
        :param message: Le contenu du message
        :return: La réponse de l'API ou None en cas d'erreur
        """
        if not self.instance_id or not self.api_token:
            return {"error": "Identifiants Green API manquants (GREEN_API_INSTANCE_ID ou GREEN_API_TOKEN)"}

        # Formatage du chatId (ex: 33612345678@c.us)
        # On enlève le + si présent
        clean_number = phone_number.replace('+', '').replace(' ', '')
        chat_id = f"{clean_number}@c.us"

        url = f"{self.base_url}/SendMessage/{self.api_token}"

        payload = {
            "chatId": chat_id,
            "message": message
        }

        headers = {
            'Content-Type': 'application/json'
        }

        try:
            response = requests.post(url, headers=headers, data=json.dumps(payload))
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            error_msg = f"Erreur HTTP: {str(e)}"
            if e.response is not None:
                try:
                    error_msg += f" - Detail: {e.response.text}"
                except:
                    pass
            return {"error": error_msg}
