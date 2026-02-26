const { pool } = require("../config/postgres");
const Assignment = require("../models/assignment.model");
const Attempt = require("../models/attempt.model");

exports.executeQuery = async (req, res) => {
  const { assignmentId, query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query required" });
  }

  if (query.includes(";")) {
    return res.status(400).json({ error: "Multiple statements not allowed" });
  }

  const trimmed = query.trim().toLowerCase();

  if (!trimmed.startsWith("select")) {
    return res.status(400).json({ error: "Only SELECT queries allowed" });
  }

  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    const schemaName = assignment.postgresSchemaName;

    if (!/^[a-zA-Z0-9_]+$/.test(schemaName)) {
      return res.status(400).json({ error: "Invalid schema name" });
    }

    const client = await pool.connect();
    const start = Date.now();

    try {
      await client.query("BEGIN");

      await client.query(`SET LOCAL search_path TO "${schemaName}"`);

      const result = await client.query(query);

      await client.query("ROLLBACK");

      const executionTime = Date.now() - start;

      await Attempt.create({
        assignmentId,
        query,
        resultPreview: result.rows.slice(0, 10),
        isSuccessful: true,
        executionTimeMs: executionTime,
      });

      res.json({
        rows: result.rows,
        rowCount: result.rowCount,
        executionTime,
      });
    } catch (error) {
      await client.query("ROLLBACK");

      await Attempt.create({
        assignmentId,
        query,
        errorMessage: error.message,
        isSuccessful: false,
      });

      res.status(400).json({ error: error.message });
    } finally {
      client.release();
    }
  } catch (error) {
    res.status(500).json({ error: "Execution failed" });
  }
};
