const mongoose = require("mongoose");

const superTestResultSchema = new mongoose.Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SuperTest",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: false,
    },
    fullName: {
      type: String,
      default: "",
    },
    className: {
      type: String,
      default: "",
    },
    schoolName: {
      type: String,
      default: "",
    },
    responses: [
      {
        questionIndex: Number,
        questionType: { type: String, enum: ["ui", "cbt"], default: "ui" },
        // UI fields
        submittedHtml: { type: String, default: "" },
        submittedCss: { type: String, default: "" },
        // CBT fields
        selectedOption: { type: String, default: "" }, // "A", "B", "C", "D"
        score: { type: Number, default: 0 }
      }
    ],
    totalScore: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SuperTestResult", superTestResultSchema);
