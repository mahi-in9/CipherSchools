import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AssignmentList.scss";

const AssignmentList = () => {
  // Mock Data simulating API response
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: "Basic Select",
      difficulty: "Easy",
      desc: "Retrieve all columns from the users table.",
    },
    {
      id: 2,
      title: " aggregations",
      difficulty: "Medium",
      desc: "Calculate total sales per region.",
    },
    {
      id: 3,
      title: "Complex Joins",
      difficulty: "Hard",
      desc: "Join three tables to find customer details.",
    },
  ]);

  return (
    <div className="assignment-list container">
      <h1 className="assignment-list__header">Available Assignments</h1>

      <div className="assignment-list__grid">
        {assignments.map((item) => (
          <div
            key={item.id}
            className={`assignment-card assignment-card--${item.difficulty.toLowerCase()}`}
          >
            <div className="assignment-card__badge">{item.difficulty}</div>
            <h3 className="assignment-card__title">{item.title}</h3>
            <p className="assignment-card__desc">{item.desc}</p>
            <Link to={`/attempt/${item.id}`} className="assignment-card__btn">
              Start Challenge
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentList;
