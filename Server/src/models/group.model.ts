import mongoose, { Schema, Document } from "mongoose";

export interface IGroup extends Document {
  name: string;
  description: string;
  creatorEmail: string;
  memberEmails: string[];
  invitedEmails: string[];
}

const groupSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    creatorEmail: { type: String, default: "" },
    memberEmails: { type: [String], default: [] },
    invitedEmails: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

// Indexes optimized for query patterns
groupSchema.index({ creatorEmail: 1 }); // For counting user's groups
groupSchema.index({ memberEmails: 1 }); // For finding groups by member
groupSchema.index({ invitedEmails: 1 }); // For finding groups by invitation

export default mongoose.model<IGroup>("Group", groupSchema);
