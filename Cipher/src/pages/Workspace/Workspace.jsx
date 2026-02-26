import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import "./Workspace.scss";

const Workspace = () => {
  const [query, setQuery] = useState("SELECT * FROM users;");
  const [result, setResult] = useState(null);
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(false);

  // Simulate executing query against Backend
  const handleRunQuery = async () => {
    setLoading(true);
    // In production: const res = await fetch('/api/execute', { method: 'POST', body: JSON.stringify({ query }) });
    setTimeout(() => {
      setResult([
        { id: 1, name: "Alice", role: "Admin" },
        { id: 2, name: "Bob", role: "User" },
      ]);
      setLoading(false);
    }, 800);
  };

  // Simulate LLM Hint
  const getHint = async () => {
    setHint("Thinking...");
    // In production: call LLM API here
    setTimeout(() => {
      setHint("💡 Try filtering by the 'role' column using a WHERE clause.");
    }, 1000);
  };

  return (
    <div className="workspace">
      {/* Left Panel: Question & Schema */}
      <div className="workspace__sidebar">
        <div className="workspace__panel">
          <h3>Question 1: Find Admins</h3>
          <p>Select all users who have the role of 'Admin'.</p>
        </div>

        <div className="workspace__panel">
          <h3>Schema: Users</h3>
          <ul className="schema-list">
            <li>id (INT)</li>
            <li>name (VARCHAR)</li>
            <li>role (VARCHAR)</li>
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
          ) : (
            <p className="empty-state">Run a query to see results</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Workspace;
