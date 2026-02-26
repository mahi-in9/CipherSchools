import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Essential for dynamic IDs
import Editor from "@monaco-editor/react";
import "./Workspace.scss";

const Workspace = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [query, setQuery] = useState("SELECT * FROM users;");
  const [result, setResult] = useState(null);
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const mockAssignments = [
      {
        id: 1,
        title: "Basic Select",
        question: "Select all users who have the role of 'Admin'.",
        schema: ["id (INT)", "name (VARCHAR)", "role (VARCHAR)"],
        tableName: "Users",
      },
      {
        id: 2,
        title: "Aggregations",
        question: "Calculate the total amount of sales from the orders table.",
        schema: ["id (INT)", "amount (DECIMAL)", "region (TEXT)"],
        tableName: "Orders",
      },
      {
        id: 3,
        title: "Complex Joins",
        question: "Retrieve customer names along with their order IDs.",
        schema: ["user_id (INT)", "order_id (INT)", "product_name (TEXT)"],
        tableName: "Join_Data",
      },
    ];

    const found = mockAssignments.find((a) => a.id === parseInt(id));
    setAssignment(found);
  }, [id]);

  const handleRunQuery = async () => {
    setLoading(true);
    // Simulation logic
    setTimeout(() => {
      setResult([
        { id: 1, name: "Alice", role: "Admin" },
        { id: 2, name: "Bob", role: "User" },
      ]);
      setLoading(false);
    }, 800);
  };

  const getHint = async () => {
    setHint("Thinking...");
    setTimeout(() => {
      setHint("💡 Try filtering by the 'role' column using a WHERE clause.");
    }, 1000);
  };

  if (!assignment) return <div className="loading">Loading Challenge...</div>;

  return (
    <div className="workspace">
      {/* Left Panel: DYNAMIC Question & Schema */}
      <div className="workspace__sidebar">
        <div className="workspace__panel">
          <h3>{assignment.title}</h3>
          <p>{assignment.question}</p>
        </div>

        <div className="workspace__panel">
          <h3>Schema: {assignment.tableName}</h3>
          <ul className="schema-list">
            {assignment.schema.map((column, index) => (
              <li key={index}>{column}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Panel: Editor & Output */}
      <div className="workspace__main">
        <div className="workspace__editor-container">
          <Editor
            height="40vh"
            defaultLanguage="sql"
            value={query}
            onChange={(val) => setQuery(val)}
            theme="vs-dark"
            options={{ minimap: { enabled: false }, fontSize: 14 }}
          />
        </div>

        <div className="workspace__controls">
          <button
            className="btn btn--primary"
            onClick={handleRunQuery}
            disabled={loading}
          >
            {loading ? "Running..." : "Execute Query"}
          </button>
          <button className="btn btn--secondary" onClick={getHint}>
            Get AI Hint
          </button>
        </div>

        {hint && <div className="workspace__hint">{hint}</div>}

        <div className="workspace__results">
          {result ? (
            <div className="table-wrapper">
              <table className="results-table">
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
          ) : (
            <p className="empty-state">Run a query to see results</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Workspace;
