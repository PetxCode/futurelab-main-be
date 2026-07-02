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
        type: { type: String, enum: ["ui", "cbt"], default: "ui" },
        // UI (UI Detective) fields
        targetHtml: { type: String, default: "" },
        targetCss: { type: String, default: "" },
        targetImageUrl: { type: String },
        // CBT (Multiple Choice) fields
        questionText: { type: String, default: "" },
        options: [
          {
            label: { type: String }, // A, B, C, D
            text: { type: String, default: "" },
          }
        ],
        correctOption: { type: String, default: "" }, // "A", "B", "C", "D"
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
