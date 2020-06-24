import mongoose from 'mongoose';

const WeekSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    sunday: {
      type: Number,
      required: true,
    },
    monday: {
      type: Number,
      required: true,
    },
    tuesday: {
      type: Number,
      required: true,
    },
    wednesday: {
      type: Number,
      required: true,
    },
    thursday: {
      type: Number,
      required: true,
    },
    friday: {
      type: Number,
      required: true,
    },
    saturday: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Week', WeekSchema);
