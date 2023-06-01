import { body, param, query } from 'express-validator';

export const createGradeValidator = [
  body('subjectId')
    .exists({ checkFalsy: true })
    .withMessage('Subject id is required')
    .isMongoId()
    .withMessage('Subject id must be a valid mongo id'),
  body('studentId')
    .exists({ checkFalsy: true })
    .withMessage('Student id is required')
    .isMongoId()
    .withMessage('Student id must be a valid mongo id'),
  body('value')
    .exists({ checkFalsy: true })
    .withMessage('Value is required')
    .isNumeric()
    .withMessage('Value must be a number'),
];

export const getGradesValidator = [
  query('gradeId')
    .optional()
    .isMongoId()
    .withMessage('Grade id must be a valid mongo id'),
];

export const updateGradeValidator = [
  param('gradeId')
    .exists({ checkFalsy: true })
    .withMessage('Grade id is required')
    .isMongoId()
    .withMessage('Grade id must be a valid mongo id'),
  body('value')
    .exists({ checkFalsy: true })
    .withMessage('Value is required')
    .isNumeric()
    .withMessage('Value must be a number'),
];

export const deleteGradeValidator = [
  param('gradeId')
    .exists({ checkFalsy: true })
    .withMessage('Grade id is required')
    .isMongoId()
    .withMessage('Grade id must be a valid mongo id'),
];
