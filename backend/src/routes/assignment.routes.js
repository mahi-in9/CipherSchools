const express = require("express");
const {
  getAssignments,
  getAssignmentById,
} = require("../controllers/assignment.controller");

const router = express.Router();

router.get("/", getAssignments);
router.get("/:id", getAssignmentById);

module.exports = router;
