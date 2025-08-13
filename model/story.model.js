import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    epic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Epic",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Story", storySchema);
