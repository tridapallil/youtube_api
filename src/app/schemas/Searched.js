import mongoose from 'mongoose';

const Searched = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    search: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Searched', Searched);
