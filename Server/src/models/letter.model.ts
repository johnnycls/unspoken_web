import mongoose, { Schema, Document } from "mongoose";

export interface ILetter extends Document {
  fromEmail: string;
  fromGroupId: string;
  toEmail: string;
  alias: string;
  content: string;
  timestamp: Date;
}

const letterSchema: Schema = new Schema(
  {
    fromEmail: { type: String, required: true, index: true },
    fromGroupId: { type: String, required: true, index: true },
    toEmail: { type: String, required: true, index: true },
    alias: { type: String, default: "" },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for optimizing letter queries
// For GET query: finding letters by fromEmail/toEmail with timestamp filter
letterSchema.index({ fromEmail: 1, timestamp: -1 });
letterSchema.index({ toEmail: 1, timestamp: -1 });

export default mongoose.model<ILetter>("Letter", letterSchema);
