import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  teachers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Teacher',
    default: [],
  },
  students: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Student',
    default: [],
  },
});

export default mongoose.model('Class', schema);
