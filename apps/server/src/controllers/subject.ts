import type { Request, Response } from 'express';
import mongoose from 'mongoose';

import { SubjectModel, TeacherModel } from '@/models/index';

export const createSubject = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, teacher } = req.body;

    const subjectExist = await SubjectModel.findOne({ name }, null, {
      session,
    });

    if (subjectExist) {
      return res.status(400).json({
        message: 'Subject already exist',
      });
    }

    const teacherExist = await TeacherModel.findOne({ _id: teacher }, null, {
      session,
    });

    if (!teacherExist) {
      return res.status(400).json({
        message: 'Teacher not found',
      });
    }

    const subjectData = new SubjectModel({
      name,
      teacher,
    });

    await subjectData.save({ session });

    await session.commitTransaction();

    return res.status(201).json({
      message: 'Subject created',
      data: subjectData,
    });
  } catch (error) {
    await session.abortTransaction();

    return res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : error,
    });
  } finally {
    session.endSession();
  }
};

export const getSubjects = async (req: Request, res: Response) => {
  try {
    const { subjectId } = req.query;

    let data;

    if (subjectId) {
      data = await SubjectModel.findOne({ _id: subjectId }).populate('teacher');
    } else {
      data = await SubjectModel.find().populate('teacher');
    }

    return res.status(200).json({
      message: 'Subjects fetched',
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const updateSubject = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { subjectId } = req.params;
    const { name, teacher } = req.body;

    const subjectExist = await SubjectModel.findById(subjectId, null, {
      session,
    });

    if (!subjectExist) {
      return res.status(400).json({
        message: 'Subject not found',
      });
    }

    const teacherExist = await TeacherModel.findOne({ _id: teacher }, null, {
      session,
    });

    if (!teacherExist) {
      return res.status(400).json({
        message: 'Teacher not found',
      });
    }

    await subjectExist.updateOne(
      {
        name,
        teacher,
      },
      { session }
    );

    await session.commitTransaction();

    return res.status(200).json({
      message: 'Subject updated',
    });
  } catch (error) {
    await session.abortTransaction();

    return res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : error,
    });
  } finally {
    session.endSession();
  }
};

export const deleteSubject = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { subjectId } = req.params;

    const subjectExist = await SubjectModel.findById(subjectId, null, {
      session,
    });

    if (!subjectExist) {
      return res.status(400).json({
        message: 'Subject not found',
      });
    }

    await subjectExist.deleteOne({ session });

    await session.commitTransaction();

    return res.status(200).json({
      message: 'Subject deleted',
    });
  } catch (error) {
    await session.abortTransaction();

    return res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : error,
    });
  } finally {
    session.endSession();
  }
};
