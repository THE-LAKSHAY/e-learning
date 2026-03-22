import mongoose from "mongoose";

const testDriveSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  postcode: { type: String, required: true },
  model: { type: String, required: true },
  transmission: { type: String, enum: ["Automatic", "Manual"], required: true },
  date: { type: String, required: true }, // can also use Date type if you want
  hour: { type: String, required: true },
  minutes: { type: String, required: true },
  ampm: { type: String, required: true },
  comments: { type: String }
}, { timestamps: true });

export default testDriveSchema;
