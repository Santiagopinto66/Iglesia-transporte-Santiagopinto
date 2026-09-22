const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Carga las variables del archivo .env

const conectarDB = require('./config/db'); // Importamos la función de conexión

const app = express();

// Conectar a la Base de Datos MongoDB Atlas
conectarDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Enrutadores
const conductorRoutes = require('./routes/conductor.routes');
const peticionRoutes = require('./routes/peticion.routes');
const recorridoRoutes = require('./routes/recorrido.routes');
app.use('/api/conductores', conductorRoutes);
app.use('/api/peticiones', peticionRoutes);
app.use('/api/recorridos', recorridoRoutes);

// Cuando el profe suba su código de usuarios, agregamos acá:
// const usuarioRoutes = require('./routes/usuario.routes');
// app.use('/api/usuarios', usuarioRoutes);

// Endpoint de verificación
app.get('/api/health', (req, res) => {
  res.json({ estado: 'OK', proyecto: 'Transporte Iglesia', timestamp: new Date() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[SERVER] Escuchando en el puerto http://localhost:${PORT}`);
});
