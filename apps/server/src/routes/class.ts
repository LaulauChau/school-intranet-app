import express from 'express';

import {
  createClass,
  deleteClass,
  getClasses,
  updateClass,
} from '@/controllers/class';
import { handleValidationResult } from '@/middlewares';
import {
  classCreateValidator,
  classDeleteValidator,
  classGetValidator,
  classUpdateValidator,
} from '@/middlewares/class';

const router: express.Router = express.Router();

router.post('/', classCreateValidator, handleValidationResult, createClass);
router.get('/', classGetValidator, handleValidationResult, getClasses);
router.put(
  '/:classId',
  classUpdateValidator,
  handleValidationResult,
  updateClass
);
router.delete(
  '/:classId',
  classDeleteValidator,
  handleValidationResult,
  deleteClass
);

export default router;
