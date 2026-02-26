import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import "./Workspace.scss";
import { executeQuery } from "../../api/queryApi";
import { getHint } from "../../api/hintApi";
import { getAssignmentById } from "../../api/assignmentApi";

const Workspace = () => {
  const { id } = useParams();

  const [assignment, setAssignment] = useState(null);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch assignment details
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await getAssignmentById(id);
        setAssignment(res.data);
      } catch (err) {
        console.error("Failed to fetch assignment:", err);
      }
    };

    if (id) fetchAssignment();
  }, [id]);

  // Execute SQL Query
  const handleExecute = async () => {
    try {
      setLoading(true);
      setError(null);
      setHint("");
      setResult(null);

      const res = await executeQuery({
        assignmentId: id,
        query,
      });

      setResult(res.data.rows);
    } catch (err) {
      setError(err.response?.data?.error || "Execution failed");
    } finally {
      setLoading(false);
    }
  };

  // Get AI Hint
  const handleHint = async () => {
    try {
      const res = await getHint({
        assignmentId: id,
        userQuery: query,
        errorMessage: error,
      });

      setHint(res.data.hint);
    } catch (err) {
      setHint("Unable to generate hint");
    }
  };

  if (!assignment) return <div>Loading...</div>;

  return (
    <div className="workspace">
      {/* Sidebar */}
      <div className="workspace__sidebar">
        <div className="workspace__panel">
          <h3>{assignment.title}</h3>
          <p>{assignment.question}</p>
        </div>

        <div className="workspace__panel">
          {assignment.tables?.map((table, index) => (
            <div key={index}>
              <h4>{table.tableName}</h4>
              <ul>
                {table.columns.map((col, i) => (
                  <li key={i}>
                    {col.name} ({col.type})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Main Panel */}
      <div className="workspace__main">
        <Editor
          height="40vh"
          defaultLanguage="sql"
          value={query}
          onChange={(val) => setQuery(val || "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
          }}
        />

        <div className="workspace__controls">
          <button onClick={handleExecute} disabled={loading}>
            {loading ? "Running..." : "Execute Query"}
          </button>

          <button onClick={handleHint}>Get AI Hint</button>
        </div>

        {error && <div className="workspace__error">{error}</div>}
        {hint && <div className="workspace__hint">{hint}</div>}

        {result && result.length > 0 && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {Object.keys(result[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((val, j) => (
                      <td key={j}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workspace;
