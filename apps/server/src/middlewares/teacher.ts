import { body, param, query } from 'express-validator';

export const createTeacherValidator = [
  body('name')
    .exists({ checkFalsy: true })
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string'),
  body('classes').optional().isArray().withMessage('Classes must be an array'),
  body('subjects')
    .optional()
    .isArray()
    .withMessage('Subjects must be an array'),
];

export const getTeachersValidator = [
  query('teacherId')
    .optional()
    .isMongoId()
    .withMessage('Teacher id must be a valid mongo id'),
];

export const updateTeacherValidator = [
  param('teacherId')
    .exists({ checkFalsy: true })
    .withMessage('Teacher id is required')
    .isMongoId()
    .withMessage('Teacher id must be a valid mongo id'),
  body('name').optional().isString().withMessage('Name must be a string'),
  body('classes').optional().isArray().withMessage('Classes must be an array'),
  body('subjects')
    .optional()
    .isArray()
    .withMessage('Subjects must be an array'),
];

export const deleteTeacherValidator = [
  param('teacherId')
    .exists({ checkFalsy: true })
    .withMessage('Teacher id is required')
    .isMongoId()
    .withMessage('Teacher id must be a valid mongo id'),
];
