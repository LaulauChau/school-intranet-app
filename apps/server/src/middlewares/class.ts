import { body, param, query } from 'express-validator';

export const classCreateValidator = [
  body('name')
    .exists({ checkFalsy: true })
    .withMessage('Name is required')
    .isString()
    .withMessage('Name is required'),
  body('teachers')
    .optional()
    .isArray()
    .withMessage('Teachers must be an array'),
  body('students')
    .optional()
    .isArray()
    .withMessage('Students must be an array'),
];

export const classGetValidator = [
  query('classId')
    .optional()
    .isMongoId()
    .withMessage('Class id must be a valid mongo id'),
];

export const classUpdateValidator = [
  param('classId')
    .exists({ checkFalsy: true })
    .withMessage('Class id is required')
    .isMongoId()
    .withMessage('Class ID is required'),
  body('name').optional().isString().withMessage('Name must be a string'),
  body('teachers')
    .optional()
    .isArray()
    .withMessage('Teachers must be an array'),
  body('students')
    .optional()
    .isArray()
    .withMessage('Students must be an array'),
];

export const classDeleteValidator = [
  param('classId')
    .exists({ checkFalsy: true })
    .withMessage('Class id is required')
    .isMongoId()
    .withMessage('Class ID is required'),
];
