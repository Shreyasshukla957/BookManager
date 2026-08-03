const express = require('express');
const authRouter = express.Router();
const { register, login, logout, getMe } = require('../controllers/authController');
const { userMiddleware } = require('../middleware/authMiddleware');

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', userMiddleware, logout);
authRouter.get('/me', userMiddleware, getMe);
authRouter.get('/check', userMiddleware, getMe);

module.exports = authRouter;
