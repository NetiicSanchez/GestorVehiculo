const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(cors({
    origin: function (origin, callback) {
        // Permitir localhost con cualquier puerto y requests sin origin (como Postman)
        if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
const authRoutes = require('./routes/auth');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para debug CORS
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

//check 
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Backend funcionando correctamente',
    timestamp: new Date().toISOString(),
    origin: req.headers.origin
  });
});

//routes
app.use('/api/vehiculos', require('./routes/vehiculos'));
app.use('/api/catalogos', require('./routes/catalogos'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/combustible', require('./routes/combustible'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/auth', authRoutes);

// Ruta temporal para consultar vistas
app.post('/api/test-vista', async (req, res) => {
  try {
    const db = require('./config/database');
    const { query } = req.body;
    console.log('🔍 Ejecutando query:', query);
    const result = await db.query(query);
    res.json({
      success: true,
      data: result.rows,
      rowCount: result.rowCount
    });
  } catch (error) {
    console.error('❌ Error en query:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Server Error:', error);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: error.message,
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});