import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Class is required'],
  },
  grades: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Grade',
    default: [],
  },
});

export default mongoose.model('Student', schema);
