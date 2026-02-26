const { pool } = require("../config/postgres");
const Assignment = require("../models/assignment.model");
const Attempt = require("../models/attempt.model");

exports.executeQuery = async (req, res) => {
  try {
    const { assignmentId, query } = req.body;

    // Basic validation
    if (!assignmentId) {
      return res.status(400).json({ error: "Assignment ID is required" });
    }

    if (!query || !query.trim()) {
      return res.status(400).json({ error: "Query is required" });
    }

    const trimmed = query.trim();

    // Security restrictions
    if (trimmed.includes(";")) {
      return res.status(400).json({
        error: "Multiple statements are not allowed",
      });
    }

    if (!trimmed.toLowerCase().startsWith("select")) {
      return res.status(400).json({
        error: "Only SELECT queries are allowed",
      });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    const schemaName = assignment.postgresSchemaName;

    if (!/^[a-zA-Z0-9_]+$/.test(schemaName)) {
      return res.status(400).json({ error: "Invalid schema name" });
    }

    const client = await pool.connect();
    const startTime = Date.now();

    try {
      await client.query("BEGIN");

      await client.query(`SET LOCAL search_path TO "${schemaName}"`);

      const result = await client.query(trimmed);

      await client.query("ROLLBACK");

      const executionTime = Date.now() - startTime;

      await Attempt.create({
        assignmentId,
        query: trimmed,
        resultPreview: result.rows.slice(0, 10),
        executionTimeMs: executionTime,
        isSuccessful: true,
      });

      return res.json({
        rows: result.rows,
        rowCount: result.rowCount,
        executionTime,
      });
    } catch (dbError) {
      await client.query("ROLLBACK");

      await Attempt.create({
        assignmentId,
        query: trimmed,
        errorMessage: dbError.message,
        isSuccessful: false,
      });

      return res.status(400).json({
        error: dbError.message,
      });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("ExecuteQuery Error:", err);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
