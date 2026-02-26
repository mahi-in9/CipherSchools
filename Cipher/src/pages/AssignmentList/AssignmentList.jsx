import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AssignmentList.scss";
import { useNavigate } from "react-router-dom";
import { getAssignments } from "../../api/assignmentApi";

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await getAssignments();
      setAssignments(res.data);
    } catch (error) {
      console.log("Failed to fetch assignments", error);
    }
  };

  return (
    <div className="assignment-list container">
      <h1 className="assignment-list__header">Available Assignments</h1>

      <div className="assignment-list__grid">
        {assignments.map((item) => (
          <div
            key={item._id}
            className={`assignment-card assignment-card--${item.difficulty.toLowerCase()}`}
          >
            <div className="assignment-card__badge">{item.difficulty}</div>
            <h3 className="assignment-card__title">{item.title}</h3>
            <p className="assignment-card__desc">{item.description}</p>
            <Link to={`/attempt/${item._id}`} className="assignment-card__btn">
              Start Challenge
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentList;
