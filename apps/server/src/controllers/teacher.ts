import type { Request, Response } from 'express';
import mongoose from 'mongoose';

import { ClassModel, SubjectModel, TeacherModel } from '@/models';

export const createTeacher = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, classes, subjects } = req.body;

    const teacherExist = await TeacherModel.findOne({ name }, null, {
      session,
    });

    if (teacherExist) {
      return res.status(400).json({
        message: 'Teacher already exist',
      });
    }

    if (classes.length > 0) {
      const classesExist = await ClassModel.find(
        { _id: { $in: classes } },
        null,
        { session }
      );

      if (classesExist.length !== classes.length) {
        return res.status(400).json({
          message: 'Class not found',
        });
      }
    }

    if (subjects.length > 0) {
      const subjectsExist = await SubjectModel.find(
        { _id: { $in: subjects } },
        null,
        { session }
      );

      if (subjectsExist.length !== subjects.length) {
        return res.status(400).json({
          message: 'Subject not found',
        });
      }
    }

    const teacherData = new TeacherModel({
      name,
      classes,
      subjects,
    });

    await teacherData.save({ session });

    await session.commitTransaction();

    return res.status(201).json({
      message: 'Teacher created',
      data: teacherData,
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

export const getTeachers = async (req: Request, res: Response) => {
  try {
    const { teacherId } = req.query;

    let data;

    if (teacherId) {
      data = await TeacherModel.findOne({ _id: teacherId })
        .populate('classes')
        .populate('subjects');
    } else {
      data = await TeacherModel.find().populate('classes').populate('subjects');
    }

    return res.status(200).json({
      message: 'Teachers fetched',
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const updateTeacher = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { teacherId } = req.params;
    const { name, classes, subjects } = req.body;

    const teacherExist = await TeacherModel.findById(teacherId, null, {
      session,
    });

    if (!teacherExist) {
      return res.status(400).json({
        message: 'Teacher not found',
      });
    }

    if (classes.length > 0) {
      await Promise.all(
        classes.map(async (classId: mongoose.Types.ObjectId) => {
          const classExist = await ClassModel.findById(classId, null, {
            session,
          });

          if (!classExist) {
            throw new Error('Class not found');
          }

          await classExist.updateOne(
            { $push: { teachers: teacherId } },
            { session }
          );
          return teacherExist.updateOne(
            { $push: { classes: classId } },
            { session }
          );
        })
      );
    }

    if (subjects.length > 0) {
      await Promise.all(
        subjects.map(async (subjectId: mongoose.Types.ObjectId) => {
          const subjectExist = await SubjectModel.findById(subjectId, null, {
            session,
          });

          if (!subjectExist) {
            throw new Error('Subject not found');
          }

          await subjectExist.updateOne(
            { $push: { teachers: teacherId } },
            { session }
          );
          return teacherExist.updateOne(
            { $push: { subjects: subjectId } },
            { session }
          );
        })
      );
    }

    if (name) {
      teacherExist.name = name;
    }

    await teacherExist.save({ session });

    await session.commitTransaction();

    return res.status(200).json({
      message: 'Teacher updated',
      data: teacherExist,
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

export const deleteTeacher = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { teacherId } = req.params;

    const teacherExist = await TeacherModel.findById(teacherId, null, {
      session,
    });

    if (!teacherExist) {
      return res.status(400).json({
        message: 'Teacher not found',
      });
    }

    await Promise.all(
      teacherExist.classes.map(async (classId: mongoose.Types.ObjectId) => {
        const classExist = await ClassModel.findById(classId, null, {
          session,
        });

        if (!classExist) {
          throw new Error('Class not found');
        }

        return classExist.updateOne(
          { $pull: { teachers: teacherId } },
          { session }
        );
      })
    );

    await Promise.all(
      teacherExist.subjects.map(async (subjectId: mongoose.Types.ObjectId) => {
        const subjectExist = await SubjectModel.findById(subjectId, null, {
          session,
        });

        if (!subjectExist) {
          throw new Error('Subject not found');
        }

        return subjectExist.updateOne(
          { $pull: { teachers: teacherId } },
          { session }
        );
      })
    );

    await teacherExist.deleteOne({ session });

    await session.commitTransaction();

    return res.status(200).json({
      message: 'Teacher deleted',
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
