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
    creatorEmail: { type: String, default: "", index: true },
    memberEmails: { type: [String], default: [], index: true },
    invitedEmails: { type: [String], default: [], index: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IGroup>("Group", groupSchema);
