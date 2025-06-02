import express from 'express';
import { signup, login, logout } from '../controllers/userController.ts';
import authMiddleware from '../middlewares/authMiddleware.ts';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.post('/logout', authMiddleware, logout);

export default router; 