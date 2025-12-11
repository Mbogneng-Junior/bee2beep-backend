const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bee2Beep API',
      version: '1.0.0',
      description: 'API de gestion de ruches connectées Bee2Beep',
      contact: {
        name: 'Support Bee2Beep',
        email: 'support@bee2beep.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Serveur de développement',
      },
      {
        url: 'http://167.71.176.127:3000/api/v1',
        description: 'Serveur de Production',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/v1/*.js'], // Fichiers contenant les annotations
};

const specs = swaggerJsdoc(options);

module.exports = specs;
