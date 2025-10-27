import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  name: string;
  lang: string;
}

const userSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, default: "" },
    lang: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", userSchema);
