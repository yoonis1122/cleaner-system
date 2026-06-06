const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');

const routerObj = express.Router();

routerObj.post('/register', registerUser);
routerObj.post('/login', loginUser);

module.exports = routerObj;
