import { body, param, query } from 'express-validator';

export const createSubjectValidator = [
  body('name')
    .exists({ checkFalsy: true })
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string'),
  body('teacher')
    .exists({ checkFalsy: true })
    .withMessage('Teacher id is required')
    .isArray()
    .withMessage('Teacher id must be an array'),
];

export const getSubjectsValidator = [
  query('subjectId')
    .optional()
    .isMongoId()
    .withMessage('Subject id must be a valid mongo id'),
];

export const updateSubjectValidator = [
  param('subjectId')
    .exists({ checkFalsy: true })
    .withMessage('Subject id is required')
    .isMongoId()
    .withMessage('Subject id must be a valid mongo id'),
  body('name').optional().isString().withMessage('Name must be a string'),
  body('teacher')
    .optional()
    .isMongoId()
    .withMessage('Teacher id must be a valid mongo id'),
];

export const deleteSubjectValidator = [
  param('subjectId')
    .exists({ checkFalsy: true })
    .withMessage('Subject id is required')
    .isMongoId()
    .withMessage('Subject id must be a valid mongo id'),
];
