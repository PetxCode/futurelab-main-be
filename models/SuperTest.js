const mongoose = require("mongoose");

const superTestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    questions: [
      {
        targetHtml: { type: String, default: "" },
        targetCss: { type: String, default: "" },
        targetImageUrl: { type: String }
      }
    ],
    durationMinutes: {
      type: Number,
      default: 30,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SuperTest", superTestSchema);
