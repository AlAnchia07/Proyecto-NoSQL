const express = require('express')
const router = express.Router()
const { registrarCliente, login } = require('../controllers/authController')

router.post('/register', registrarCliente)
router.post('/login', login)

module.exports = router