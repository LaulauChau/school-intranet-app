import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'Subject is required'],
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student is required'],
  },
  value: {
    type: Number,
    min: [0, 'Value must be greater than 0'],
    max: [20, 'Value must be less than 20'],
    default: 0,
  },
});

export default mongoose.model('Grade', schema);
