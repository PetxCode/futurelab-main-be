const express = require("express");
const router = express.Router();
const SuperTest = require("../models/SuperTest");
const SuperTestResult = require("../models/SuperTestResult");

// Create a new Super Test (Admin only usually, simplified for now)
router.post("/", async (req, res) => {
  try {
    const { title, description, schoolId, questions, durationMinutes } = req.body;
    const test = new SuperTest({
      title,
      description,
      schoolId,
      questions,
      durationMinutes,
    });
    await test.save();
    res.status(201).json({ success: true, data: test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Fetch all tests for a specific school
router.get("/school/:schoolId", async (req, res) => {
  try {
    const tests = await SuperTest.find({ schoolId: req.params.schoolId, isActive: true });
    res.status(200).json({ success: true, data: tests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Check if student has already completed the test
router.get("/check/:testId/:studentId", async (req, res) => {
  try {
    const { testId, studentId } = req.params;
    const existingResult = await SuperTestResult.findOne({ testId, studentId });
    if (existingResult) {
      return res.status(200).json({ success: true, completed: true, data: existingResult });
    }
    res.status(200).json({ success: true, completed: false });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Check if student details already exists for a test
router.post("/check-details", async (req, res) => {
  try {
    const { testId, fullName, className, schoolName } = req.body;

    if (!fullName || !className || !schoolName) {
      return res.status(400).json({ success: false, message: "All student details (Full Name, Class, School Name) are required." });
    }

    const existingResult = await SuperTestResult.findOne({
      testId,
      fullName: { $regex: new RegExp("^" + fullName.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "$", "i") },
      className: { $regex: new RegExp("^" + className.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "$", "i") },
      schoolName: { $regex: new RegExp("^" + schoolName.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "$", "i") }
    });

    if (existingResult) {
      return res.status(200).json({ success: true, exists: true });
    }

    res.status(200).json({ success: true, exists: false });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Submit a test result (Student)
router.post("/submit", async (req, res) => {
  try {
    const { testId, studentId, schoolId, responses, fullName, className, schoolName } = req.body;

    if (!fullName || !className || !schoolName) {
      return res.status(400).json({ success: false, message: "All student details (Full Name, Class, School Name) are required." });
    }

    // Verify test isn't already taken with these details (case-insensitive)
    const existingResult = await SuperTestResult.findOne({
      testId,
      fullName: { $regex: new RegExp("^" + fullName.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "$", "i") },
      className: { $regex: new RegExp("^" + className.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "$", "i") },
      schoolName: { $regex: new RegExp("^" + schoolName.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "$", "i") }
    });

    if (existingResult) {
      return res.status(400).json({ success: false, message: "A student with these details has already completed this test." });
    }

    // Calculate total score
    let totalScore = 0;
    if (responses && responses.length > 0) {
      const sum = responses.reduce((acc, curr) => acc + (curr.score || 0), 0);
      totalScore = Math.round(sum / responses.length);
    }

    const result = new SuperTestResult({
      testId,
      studentId: studentId || undefined,
      schoolId: schoolId || undefined,
      fullName: fullName.trim(),
      className: className.trim(),
      schoolName: schoolName.trim(),
      responses,
      totalScore,
    });
    await result.save();
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Fetch all test results for a specific school (Admin)
router.get("/results/:schoolId", async (req, res) => {
  try {
    const results = await SuperTestResult.find({ schoolId: req.params.schoolId })
      .populate("testId", "title")
      .populate("studentId", "fullName email")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a test result (Admin clear)
router.delete("/results/:resultId", async (req, res) => {
  try {
    await SuperTestResult.findByIdAndDelete(req.params.resultId);
    res.status(200).json({ success: true, message: "Result cleared successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a test (Admin)
router.delete("/:testId", async (req, res) => {
  try {
    await SuperTest.findByIdAndDelete(req.params.testId);
    await SuperTestResult.deleteMany({ testId: req.params.testId });
    res.status(200).json({ success: true, message: "Test deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update an existing Super Test (Admin)
router.put("/:testId", async (req, res) => {
  try {
    const { title, description, questions, durationMinutes } = req.body;
    const test = await SuperTest.findByIdAndUpdate(
      req.params.testId,
      {
        title,
        description,
        questions,
        durationMinutes,
      },
      { new: true }
    );
    if (!test) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }
    res.status(200).json({ success: true, data: test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
