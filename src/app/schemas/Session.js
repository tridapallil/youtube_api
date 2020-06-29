import mongoose from 'mongoose';

const Session = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Session', Session);
