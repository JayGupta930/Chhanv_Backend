import mongoose from "mongoose";

const schemeSchema = new mongoose.Schema({
  name: String,
  location: String,
  date: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
}, { timestamps: true });

export const Scheme = mongoose.model("Scheme", schemeSchema);