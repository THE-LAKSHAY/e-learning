// booking.model.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    car: {
      title: { type: String, required: true },
      image: { type: String }, // URL of the car image
      price: { type: String }, // e.g., "₹10,00,000"
      offer: { type: String }, // discounted price or special offer
      fuel: { type: String },
      mileage: { type: String },
      transmission: { type: String }
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true }
    },
    bookingPeriod: {
      type: String,
      enum: ["7", "14", "30"], // corresponds to days
      required: true
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

export default bookingSchema;
