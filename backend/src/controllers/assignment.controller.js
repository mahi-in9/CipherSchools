const Assignment = require("../models/assignment.model");

exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ isActive: true }).select(
      "_id title difficulty description",
    );
    res.json(assignments);2
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch assignment" });
  }
};

exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch assignment" });
  }
};
