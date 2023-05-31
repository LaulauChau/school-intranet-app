import type { Request, Response } from 'express';
import mongoose from 'mongoose';

import { ClassModel, GradeModel, StudentModel } from '@/models/index';

export const createStudent = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, classId } = req.body;

    const classExist = await ClassModel.findById(classId, null, {
      session,
    });

    if (!classExist) {
      return res.status(400).json({
        message: 'Class not found',
      });
    }

    const student = new StudentModel({
      name,
      class: classId,
    });

    await student.save({ session });
    await classExist.updateOne(
      {
        $push: {
          students: student._id,
        },
      },
      { session }
    );

    await session.commitTransaction();

    res.status(201).json({
      message: 'Student created',
      data: student,
    });
  } catch (error) {
    await session.abortTransaction();

    res.status(500).json({
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : error,
    });
  } finally {
    session.endSession();
  }
};

export const getStudents = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.query;

    let data;

    if (studentId) {
      data = await StudentModel.findById(studentId)
        .populate('class')
        .populate('grades')
        .exec();
    } else {
      data = await StudentModel.find()
        .populate('class')
        .populate('grades')
        .exec();
    }

    res.status(200).json({
      message: studentId ? 'Student found' : 'Students found',
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { studentId } = req.params;
    const { name, classId, grade } = req.body;

    const student = await StudentModel.findById(studentId, null, {
      session,
    });

    if (!student) {
      return res.status(400).json({
        message: 'Student not found',
      });
    }

    if (name) {
      student.name = name;
    }

    if (classId) {
      const oldClass = await ClassModel.findById(student.class, null, {
        session,
      });
      const newClass = await ClassModel.findById(classId, null, {
        session,
      });

      if (!oldClass || !newClass) {
        return res.status(400).json({
          message: 'Class not found',
        });
      }

      const oldPromise = oldClass.updateOne(
        {
          $pull: {
            students: studentId,
          },
        },
        { session }
      );

      const newPromise = newClass.updateOne(
        {
          $push: {
            students: studentId,
          },
        },
        { session }
      );

      await Promise.all([oldPromise, newPromise]);
    }

    if (grade) {
      const gradeExist = await GradeModel.findById(grade.id, null, {
        session,
      });

      if (!gradeExist) {
        return res.status(400).json({
          message: 'Grade not found',
        });
      }

      if (grade.action === 'add') {
        await student.updateOne(
          {
            $push: {
              grades: grade.id,
            },
          },
          { session }
        );
      } else if (grade.action === 'remove') {
        await student.updateOne(
          {
            $pull: {
              grades: grade.id,
            },
          },
          { session }
        );
      }
    }

    await student.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      message: 'Student updated',
      data: student,
    });
  } catch (error) {
    await session.abortTransaction();

    res.status(500).json({
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : error,
    });
  } finally {
    session.endSession();
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { studentId } = req.params;

    const studentExist = await StudentModel.findById(studentId, null, {
      session,
    });

    if (!studentExist) {
      return res.status(400).json({
        message: 'Student not found',
      });
    }

    const studentClass = await ClassModel.findById(studentExist.class, null, {
      session,
    });

    if (!studentClass) {
      return res.status(400).json({
        message: 'Class not found',
      });
    }

    await studentClass.updateOne(
      {
        $pull: {
          students: studentId,
        },
      },
      { session }
    );

    const studentGrades = await GradeModel.find(
      {
        _id: {
          $in: studentExist.grades,
        },
      },
      null,
      {
        session,
      }
    );

    studentGrades.forEach(async (grade) => {
      await grade.deleteOne({ session });
    });

    await studentExist.deleteOne({ session });

    await session.commitTransaction();

    res.status(200).json({
      message: 'Student deleted',
    });
  } catch (error) {
    await session.abortTransaction();

    res.status(500).json({
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : error,
    });
  } finally {
    session.endSession();
  }
};
