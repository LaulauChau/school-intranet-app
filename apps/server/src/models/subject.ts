import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: [true, 'Teacher is required'],
  },
});

export default mongoose.model('Subject', schema);
