// src/api/routes/authRoutes.js
import { Router } from 'express';
import {
  registrarUsuario,
  loginUsuario,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';

const router = Router();

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);
router.post('/forgot', forgotPassword);
router.post('/reset', resetPassword);

export default router;
