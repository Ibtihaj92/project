import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./VolunteerList.css";
import logo from "../logo.png";

export default function VolunteerList() {
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/allEvents")
      .then(res => setVolunteers(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="volunteer-container">
      <div className="header">
        <div className="logo">
          <img src={logo} alt="Logo" />
          <p>Volunteer{"\n"}Opportunities</p>
        </div>
        <h1>Volunteer List</h1>
        <button className="back-btn-header" onClick={() => navigate("/admin")}>← Back</button>
      </div>
      <div className="volunteer-list">
        {volunteers.map(volunteer => (
          <div key={volunteer._id} className="volunteer-card">
            <div className="volunteer-info">
              <img
                src={volunteer.image || "/default-event.jpg"}
                alt={volunteer.volunteerName}
              />
              <span>{volunteer.volunteerName}</span>
            </div>
            <div className="volunteer-buttons">
              <button
                className="view-btn"
                onClick={() => navigate(`/view-participants/${volunteer._id}`, { state: { volunteer } })}
              >
                View
              </button>
              <button
                className="edit-btn"
                onClick={() =>
                  navigate(`/update-volunteer/${volunteer._id}`, { state: { volunteer } })
                }
              >
                Edit
              </button>
              <button
                className="delete-btn"
                onClick={() =>
                  axios.delete(`http://localhost:5000/deleteEvent/${volunteer._id}`)
                    .then(() => setVolunteers(prev => prev.filter(v => v._id !== volunteer._id)))
                }
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
