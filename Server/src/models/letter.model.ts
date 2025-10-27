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
    fromEmail: { type: String, required: true },
    fromGroupId: { type: String, required: true },
    toEmail: { type: String, required: true },
    alias: { type: String, default: "" },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Compound indexes optimized for query patterns
letterSchema.index({ fromEmail: 1, timestamp: -1 }); // For sender queries with time sort/filter
letterSchema.index({ toEmail: 1, timestamp: -1 }); // For recipient queries with time filter

export default mongoose.model<ILetter>("Letter", letterSchema);
