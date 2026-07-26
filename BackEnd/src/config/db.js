// src/config/db.js
/*
const mongoose = require('mongoose');
 
 
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://admin:password_123@localhost:27017/Simulacion2?authSource=admin', { //Aqui hay que cambiar la ruta
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
 
module.exports = connectDB;
*/

// src/config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/BiteUp');

        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;