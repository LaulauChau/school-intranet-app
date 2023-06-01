import express from 'express';

import {
  createGrade,
  deleteGrade,
  getGrades,
  updateGrade,
} from '@/controllers/grade';
import { handleValidationResult } from '@/middlewares';
import {
  createGradeValidator,
  deleteGradeValidator,
  getGradesValidator,
  updateGradeValidator,
} from '@/middlewares/grade';

const router: express.Router = express.Router();

router.post('/', createGradeValidator, handleValidationResult, createGrade);
router.get('/', getGradesValidator, handleValidationResult, getGrades);
router.put(
  '/:gradeId',
  updateGradeValidator,
  handleValidationResult,
  updateGrade
);
router.delete(
  '/:gradeId',
  deleteGradeValidator,
  handleValidationResult,
  deleteGrade
);

export default router;
