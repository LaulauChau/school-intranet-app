import { body, param, query } from 'express-validator';

export const studentCreateValidator = [
  body('name').exists().isString().notEmpty().withMessage('Name is required'),
  body('classId')
    .exists()
    .isString()
    .notEmpty()
    .withMessage('Class is required'),
];

export const studentGetValidator = [query('studentId').optional().isString()];

export const studentUpdateValidator = [
  param('studentId')
    .exists()
    .isString()
    .notEmpty()
    .withMessage('Student ID is required'),
  body('name').optional().isString(),
  body('classId').optional().isString(),
  body('grade').optional().isObject(),
];

export const studentDeleteValidator = [
  param('studentId')
    .exists()
    .isString()
    .notEmpty()
    .withMessage('Student ID is required'),
];
