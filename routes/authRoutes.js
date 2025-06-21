import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.post('/register', authController.upload, authController.register);
router.get('/verify-email', authController.verifyEmail);

export default router; 