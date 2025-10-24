import mongoose, { Schema, Document } from "mongoose";

export interface ICrush extends Document {
  fromEmail: string;
  toEmail: string;
  month: string;
  message: string;
}

const crushSchema: Schema = new Schema(
  {
    fromEmail: { type: String, required: true, index: true },
    toEmail: { type: String, required: true, index: true },
    month: { type: String, required: true },
    message: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

// Compound index for finding/updating specific crush records
crushSchema.index({ fromEmail: 1, toEmail: 1, month: 1 });

export default mongoose.model<ICrush>("Crush", crushSchema);
