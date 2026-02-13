import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    trainId: {
      type: String,
      required: true
    },
    seats: {
      type: [String],
      required: true
    },
    status: {
      type: String,
      enum: ["CONFIRMED", "CANCELLED"],
      default: "CONFIRMED"
    }
  },
  { timestamps: true }
);

bookingSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Booking", bookingSchema);
