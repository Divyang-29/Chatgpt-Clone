import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ThreadSchema = new Schema({
  threadId: {
    type: String,
    require: true,
    unique: true,
  },
  title: {
    type: String,
    default: "New Chat",
  },
  message: [MessageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Thread",ThreadSchema);

