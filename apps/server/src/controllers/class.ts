import type { Request, Response } from 'express';
import mongoose from 'mongoose';

import { ClassModel, StudentModel, TeacherModel } from '@/models/index';

export const createClass = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, teachers, students } = req.body;

    const classExist = await ClassModel.findOne({ name }, null, {
      session,
    });

    if (classExist) {
      return res.status(400).json({
        message: 'Class already exist',
      });
    }

    const classData = new ClassModel({
      name,
    });

    if (teachers) {
      const teachersExist = await TeacherModel.find(
        { _id: { $in: teachers } },
        null,
        {
          session,
        }
      );

      if (teachersExist.length !== teachers.length) {
        return res.status(400).json({
          message: 'Teacher not found',
        });
      }

      classData.teachers = teachers;
    }

    if (students) {
      const studentsExist = await StudentModel.find(
        { _id: { $in: students } },
        null,
        {
          session,
        }
      );

      if (studentsExist.length !== students.length) {
        return res.status(400).json({
          message: 'Student not found',
        });
      }

      classData.students = students;
    }

    await classData.save({ session });

    await session.commitTransaction();

    res.status(201).json({
      message: 'Class created',
      data: classData,
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

export const getClasses = async (req: Request, res: Response) => {
  try {
    const { classId } = req.query;

    let data;

    if (classId) {
      data = await ClassModel.findById(classId);
    } else {
      data = await ClassModel.find();
    }

    res.status(200).json({
      message: 'Classes fetched',
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const updateClass = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { classId } = req.params;
    const { name, teachers, students } = req.body;

    const classExist = await ClassModel.findById(classId, null, {
      session,
    });

    if (!classExist) {
      return res.status(400).json({
        message: 'Class not found',
      });
    }

    if (name) {
      classExist.name = name;
    }

    if (teachers) {
      await Promise.all(
        teachers.map(async (t: mongoose.Types.ObjectId) => {
          const teacherExist = await TeacherModel.findById(t, null, {
            session,
          });

          if (!teacherExist) {
            throw new Error('Teacher not found');
          }

          return classExist.updateOne(
            {
              $push: {
                teachers: t,
              },
            },
            { session }
          );
        })
      );
    }

    if (students) {
      await Promise.all(
        students.map(async (s: mongoose.Types.ObjectId) => {
          const studentExist = await StudentModel.findById(s, null, {
            session,
          });

          if (!studentExist) {
            throw new Error('Student not found');
          }

          return classExist.updateOne(
            {
              $push: {
                students: s,
              },
            },
            { session }
          );
        })
      );
    }

    await classExist.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      message: 'Class updated',
      data: classExist,
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

export const deleteClass = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { classId } = req.params;

    const classExist = await ClassModel.findById(classId, null, {
      session,
    });

    if (!classExist) {
      return res.status(400).json({
        message: 'Class not found',
      });
    }

    const students = await StudentModel.find(
      { _id: { $in: classExist.students } },
      null,
      {
        session,
      }
    );
    const teachers = await TeacherModel.find(
      { _id: { $in: classExist.teachers } },
      null,
      {
        session,
      }
    );

    students.forEach(async (s: mongoose.Document) => {
      await s.updateOne(
        {
          $set: {
            class: null,
          },
        },
        { session }
      );
    });

    teachers.forEach(async (t: mongoose.Document) => {
      await t.updateOne(
        {
          $pull: {
            classes: classId,
          },
        },
        { session }
      );
    });

    await session.commitTransaction();

    res.status(200).json({
      message: 'Class deleted',
      data: classExist,
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
