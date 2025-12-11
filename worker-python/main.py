from flask import Flask, request, jsonify
from app.services.whatsapp import GreenApiService
import os

app = Flask(__name__)
whatsapp_service = GreenApiService()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "service": "worker-python"}), 200

@app.route('/whatsapp-status', methods=['GET'])
def whatsapp_status():
    result = whatsapp_service.get_status()
    return jsonify(result), 200

@app.route('/send-whatsapp', methods=['POST'])
def send_whatsapp():
    data = request.json
    phone_number = data.get('phone_number')
    message = data.get('message')

    if not phone_number or not message:
        return jsonify({"error": "phone_number et message sont requis"}), 400

    result = whatsapp_service.send_message(phone_number, message)

    if result and "error" not in result:
        return jsonify({"status": "success", "data": result}), 200
    else:
        error_message = result.get("error") if result else "Erreur inconnue"
        return jsonify({"status": "error", "message": error_message}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
