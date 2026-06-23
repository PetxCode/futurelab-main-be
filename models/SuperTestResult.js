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
      required: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    responses: [
      {
        questionIndex: Number,
        submittedHtml: { type: String, default: "" },
        submittedCss: { type: String, default: "" },
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
