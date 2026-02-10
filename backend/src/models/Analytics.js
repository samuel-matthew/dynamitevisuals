import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    path: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    uniqueVisitors: {
      type: Number,
      default: 0,
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true,
    },
  },
  { timestamps: true }
);

// Compound index to ensure unique entries per path per date
analyticsSchema.index({ path: 1, date: 1 }, { unique: true });

const Analytics = mongoose.model("Analytics", analyticsSchema);

export default Analytics;
