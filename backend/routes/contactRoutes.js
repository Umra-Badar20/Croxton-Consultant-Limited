import express from 'express';
import { createContact, getContacts } from '../controllers/contactController.js';
import { protect } from '../controllers/authController.js';

const router = express.Router();

router.route('/')
  .post(createContact)
  .get(protect, getContacts); // Now protected

export default router;