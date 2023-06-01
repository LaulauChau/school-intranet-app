import express from 'express';

import {
  createSubject,
  deleteSubject,
  getSubjects,
  updateSubject,
} from '@/controllers/subject';
import { handleValidationResult } from '@/middlewares';
import {
  createSubjectValidator,
  deleteSubjectValidator,
  getSubjectsValidator,
  updateSubjectValidator,
} from '@/middlewares/subject';

const router: express.Router = express.Router();

router.post('/', createSubjectValidator, handleValidationResult, createSubject);
router.get('/', getSubjectsValidator, handleValidationResult, getSubjects);
router.put(
  '/:subjectId',
  updateSubjectValidator,
  handleValidationResult,
  updateSubject
);
router.delete(
  '/:subjectId',
  deleteSubjectValidator,
  handleValidationResult,
  deleteSubject
);

export default router;
