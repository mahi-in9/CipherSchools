const Assignment = require("../models/assignment.model");
const generateHint = require("../services/geminiService");

exports.getHint = async (req, res) => {
  try {
    const { assignmentId, userQuery, errorMessage } = req.body;

    if (!assignmentId || !userQuery) {
      return res.status(400).json({
        error: "Assignment ID and user query are required",
      });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        error: "Assignment not found",
      });
    }

    const hint = await generateHint({
      question: assignment.question,
      tables: assignment.tables,
      userQuery,
      errorMessage,
    });

    return res.json({ hint });
  } catch (err) {
    console.error("Hint Error:", err);
    return res.status(500).json({
      error: "Hint generation failed",
    });
  }
};
