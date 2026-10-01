import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  conversation: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  message: string;
  messageType: "text" | "image";
  status: "sent" | "delivered" | "read";
}

const messageSchema = new Schema<IMessage>(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    messageType: {
      type: String,
      enum: ["text", "image"],
      default: "text",
    },

    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model<IMessage>(
  "Message",
  messageSchema
);

export default Message;