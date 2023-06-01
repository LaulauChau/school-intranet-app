import { body, param, query } from 'express-validator';

export const studentCreateValidator = [
  body('name')
    .exists({ checkFalsy: true })
    .withMessage('Name is required')
    .isString()
    .withMessage('Name is required'),
  body('classId')
    .exists()
    .isMongoId()
    .notEmpty()
    .withMessage('Class is required'),
];

export const studentGetValidator = [
  query('studentId')
    .optional()
    .isMongoId()
    .withMessage('Student id must be a valid mongo id'),
];

export const studentUpdateValidator = [
  param('studentId')
    .exists({ checkFalsy: true })
    .withMessage('Student ID is required')
    .isMongoId()
    .withMessage('Student ID is required'),
  body('name').optional().isString().withMessage('Name must be a string'),
  body('classId').optional().isMongoId().withMessage('Class is required'),
  body('grade').optional().isObject().withMessage('Grade must be an object'),
];

export const studentDeleteValidator = [
  param('studentId')
    .exists({ checkFalsy: true })
    .withMessage('Student ID is required')
    .isMongoId()
    .withMessage('Student ID is required'),
];
