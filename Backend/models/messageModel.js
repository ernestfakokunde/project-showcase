import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent same user messages or self-messages
messageSchema.pre("validate", function (next) {
  if (this.from.toString() === this.to.toString()) {
    next(new Error("Cannot send message to yourself"));
  } else {
    next();
  }
});

export default mongoose.model("Message", messageSchema);
