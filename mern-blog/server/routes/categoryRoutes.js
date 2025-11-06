import express from 'express';
import { body } from 'express-validator';
import {
  getCategories,
  createCategory
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Validation rules
const categoryValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be between 2 and 50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters')
];

// Public routes
router.get('/', getCategories);

// Protected admin routes
router.post('/', protect, admin, categoryValidation, createCategory);

export default router;