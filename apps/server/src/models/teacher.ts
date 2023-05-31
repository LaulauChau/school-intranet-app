import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  classes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Class',
    default: [],
  },
  subjects: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Subject',
    default: [],
  },
});

export default mongoose.model('Teacher', schema);
