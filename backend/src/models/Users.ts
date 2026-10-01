import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  profileImage?: string;
  lastSeen?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    lastSeen: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;