import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    courseTitle: {
      type: String,
      required: true,
    },
    courseImage: {
      type: String,
    },
    tech: {
      type: String,
    },
    level: {
      type: String,
    },
    price: {
      type: String,   // original price e.g. "₹999"
    },
    paidAmount: {
      type: Number,   // numeric paid amount e.g. 499
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["card", "upi", "netbanking"],
      default: "card",
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ["active", "completed", "paused"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default enrollmentSchema;