import express from 'express';

import {
  createStudent,
  deleteStudent,
  getStudents,
  updateStudent,
} from '@/controllers/student';
import { handleValidationResult } from '@/middlewares';
import {
  studentCreateValidator,
  studentDeleteValidator,
  studentGetValidator,
  studentUpdateValidator,
} from '@/middlewares/student';

const router: express.Router = express.Router();

router.post('/', studentCreateValidator, handleValidationResult, createStudent);
router.get('/', studentGetValidator, handleValidationResult, getStudents);
router.put(
  '/:studentId',
  studentUpdateValidator,
  handleValidationResult,
  updateStudent
);
router.delete(
  '/:studentId',
  studentDeleteValidator,
  handleValidationResult,
  deleteStudent
);

export default router;
