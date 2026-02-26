import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AssignmentList from "./pages/AssignmentList/AssignmentList";
import Workspace from "./pages/Workspace/Workspace";
import "./styles/main.scss";

function App() {
  return (
    <>
      <div className="app">
        <nav
          className="navbar"
          style={{ padding: "1rem", background: "#1e293b", color: "white" }}
        >
          <Link
            to="/"
            style={{
              color: "white",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            CipherSQLStudio
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<AssignmentList />} />
          <Route path="/attempt/:id" element={<Workspace />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
