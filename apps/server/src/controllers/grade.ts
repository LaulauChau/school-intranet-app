import type { Request, Response } from 'express';
import mongoose from 'mongoose';

import { GradeModel, StudentModel, SubjectModel } from '@/models/index';

export const createGrade = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { subjectId, studentId, value } = req.body;

    const studentExist = await StudentModel.findOne({ _id: studentId }, null, {
      session,
    });

    if (!studentExist) {
      return res.status(400).json({
        message: 'Student not found',
      });
    }

    const subjectExist = await SubjectModel.findOne({ _id: subjectId }, null, {
      session,
    });

    if (!subjectExist) {
      return res.status(400).json({
        message: 'Subject not found',
      });
    }

    if (value < 0 || value > 20) {
      return res.status(400).json({
        message: 'Value must be between 0 and 20 inclusive',
      });
    }

    const gradeData = new GradeModel({
      subject: subjectId,
      student: studentId,
      value,
    });

    await gradeData.save({ session });

    await session.commitTransaction();

    return res.status(201).json({
      message: 'Grade created',
      data: gradeData,
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

export const getGrades = async (req: Request, res: Response) => {
  try {
    const { gradeId } = req.query;

    let data;

    if (gradeId) {
      data = await GradeModel.findOne({ _id: gradeId }, null, {
        populate: [
          {
            path: 'subject',
            model: 'Subject',
          },
          {
            path: 'student',
            model: 'Student',
          },
        ],
      });
    } else {
      data = await GradeModel.find({}, null, {
        populate: [
          {
            path: 'subject',
            model: 'Subject',
          },
          {
            path: 'student',
            model: 'Student',
          },
        ],
      });
    }

    return res.status(200).json({
      message: 'Grades fetched',
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const updateGrade = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { gradeId } = req.params;
    const { value } = req.body;

    if (value < 0 || value > 20) {
      return res.status(400).json({
        message: 'Value must be between 0 and 20 inclusive',
      });
    }

    const gradeUpdated = await GradeModel.findOneAndUpdate(
      { _id: gradeId },
      {
        value,
      },
      { session }
    );

    await session.commitTransaction();

    return res.status(200).json({
      message: 'Grade updated',
      data: gradeUpdated,
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

export const deleteGrade = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { gradeId } = req.params;

    const gradeExist = await GradeModel.findOne({ _id: gradeId }, null, {
      session,
    });

    if (!gradeExist) {
      return res.status(400).json({
        message: 'Grade not found',
      });
    }

    await StudentModel.findByIdAndUpdate(
      gradeExist.student,
      {
        $pull: {
          grades: gradeExist._id,
        },
      },
      { session }
    );

    await gradeExist.deleteOne({ session });

    await session.commitTransaction();

    return res.status(200).json({
      message: 'Grade deleted',
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
