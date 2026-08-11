// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ mensaje: 'Acceso denegado. No se proporcionó un token.' });
  }

 
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensaje: 'Formato de token inválido.' });
  }

  try {
    const cifrado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = { id: cifrado.id || cifrado.usuarioId }; 
    next();
  } catch (error) {
    return res.status(403).json({ mensaje: 'Token inválido o expirado.' });
  }
}

module.exports = verificarToken;