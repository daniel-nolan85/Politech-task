import express from 'express';
import {
  createImage,
  createCaption,
  createKeywords,
} from '../controllers/creation.js';

const router = express.Router();

// Middleware for authentication check
const { authCheck } = require('../middleware/auth');

// Routes to handle creation requests
router.post('/create-image', authCheck, createImage);
router.post('/create-caption', authCheck, createCaption);
router.post('/create-keywords', authCheck, createKeywords);

export default router;
