import express from 'express';

import {
  createTeacher,
  deleteTeacher,
  getTeachers,
  updateTeacher,
} from '@/controllers/teacher';
import { handleValidationResult } from '@/middlewares';
import {
  createTeacherValidator,
  deleteTeacherValidator,
  getTeachersValidator,
  updateTeacherValidator,
} from '@/middlewares/teacher';

const router: express.Router = express.Router();

router.post('/', createTeacherValidator, handleValidationResult, createTeacher);
router.get('/', getTeachersValidator, handleValidationResult, getTeachers);
router.put(
  '/:teacherId',
  updateTeacherValidator,
  handleValidationResult,
  updateTeacher
);
router.delete(
  '/:teacherId',
  deleteTeacherValidator,
  handleValidationResult,
  deleteTeacher
);

export default router;
