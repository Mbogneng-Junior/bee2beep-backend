const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./src/config/swagger');
require('dotenv').config();

// Import des routes
const authRoutes = require('./src/routes/v1/auth.routes');
const rucherRoutes = require('./src/routes/v1/rucher.routes');
const rucheRoutes = require('./src/routes/v1/ruche.routes');
const notificationRoutes = require('./src/routes/v1/notification.routes');
const mesureRoutes = require('./src/routes/v1/mesure.routes');
const alertRoutes = require('./src/routes/v1/alert.routes');
const capteurRoutes = require('./src/routes/v1/capteur.routes');
const userRoutes = require('./src/routes/v1/user.routes');

const app = express();

// Middlewares
// Helmet sécurise les en-têtes HTTP, mais peut bloquer Swagger UI s'il est trop strict (CSP)
// On désactive la CSP pour l'instant pour permettre à Swagger de charger ses scripts/styles
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(cors());
app.use(express.json());

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes API
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/ruchers', rucherRoutes);
app.use('/api/v1/ruches', rucheRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/mesures', mesureRoutes);
app.use('/api/v1/alertes', alertRoutes);
app.use('/api/v1/capteurs', capteurRoutes);
app.use('/api/v1/users', userRoutes);

// Test Route
app.get('/', (req, res) => {
  res.json({ message: 'Bee2Beep API is running 🐝' });
});

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
