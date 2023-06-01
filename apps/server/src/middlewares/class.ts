import { body, param, query } from 'express-validator';

export const classCreateValidator = [
  body('name').exists().isString().notEmpty().withMessage('Name is required'),
  body('teachers').optional().isArray(),
  body('students').optional().isArray(),
];

export const classGetValidator = [query('classId').optional().isString()];

export const classUpdateValidator = [
  param('classId')
    .exists()
    .isString()
    .notEmpty()
    .withMessage('Class ID is required'),
  body('name').optional().isString(),
  body('teachers').optional().isArray(),
  body('students').optional().isArray(),
];

export const classDeleteValidator = [
  param('classId')
    .exists()
    .isString()
    .notEmpty()
    .withMessage('Class ID is required'),
];
