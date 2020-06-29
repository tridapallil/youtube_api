import mongoose from 'mongoose';

const Watched = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    search: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    thumb: {
      type: String,
      required: true,
    },
    videoId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Watched', Watched);
