const mongoose = require('mongoose');

// Función que conecta la aplicación con la base de datos de MongoDB Atlas
const conectarDB = async () => {
  try {
    const conexion = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[DB] MongoDB conectado: ${conexion.connection.host}`);
  } catch (error) {
    console.error(`[DB] Error al conectar con MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = conectarDB;
