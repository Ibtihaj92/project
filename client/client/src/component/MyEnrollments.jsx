import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyEnrollments.css";
import { Link, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaHeart, FaCalendarAlt } from "react-icons/fa";
import logo from "../logo.png";

function MyEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [events, setEvents] = useState({});
  const navigate = useNavigate();

  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    if (!currentUserId) {
      navigate("/");
      return;
    }

    // Fetch both enrollments and all events in parallel
    Promise.all([
      axios.get(`http://localhost:5000/api/enrollments/my-enrollments/${currentUserId}`),
      axios.get("http://localhost:5000/allEvents"),
    ])
      .then(([enrollRes, eventRes]) => {
        setEnrollments(enrollRes.data);
        // Map by both _id and volunteerName for flexible lookup
        const map = {};
        eventRes.data.forEach((e) => {
          map[e._id] = e;
          map[e.volunteerName] = e; // fallback by name
        });
        setEvents(map);
      })
      .catch((err) => console.error(err));
  }, [currentUserId, navigate]);

  const getStatus = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Parse date string directly to avoid timezone shift
    const [year, month, day] = date.toString().split("T")[0].split("-");
    const eventDate = new Date(year, month - 1, day);

    if (eventDate.getTime() === today.getTime()) return "ongoing";
    if (eventDate < today) return "completed";
    return "upcoming";
  };

  const getStatusIcon = (status) => {
    if (status === "completed") return <FaCheckCircle style={{ marginRight: 5 }} />;
    if (status === "ongoing") return <FaHeart style={{ marginRight: 5 }} />;
    return <FaCalendarAlt style={{ marginRight: 5 }} />;
  };

  return (
    <div className="enrollments-wrapper">
      <div className="enrollments-container">
        <div className="enrollments-header">
          <img src={logo} alt="Logo" className="enroll-logo" />
          <h1>My Enrollments</h1>
          <button className="back-btn-enroll" onClick={() => navigate("/events")}>← Back</button>
        </div>
        <hr />

        <ul className="nav-menu">
          <li><Link to="/events">Home</Link></li>
          <li><Link to="/my-enrollments">My Enrollments</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li>
            <Link to="#" onClick={() => { localStorage.clear(); window.location.href = "/login"; }}>
              Logout
            </Link>
          </li>
        </ul>

        <div className="volunteer-list">
          {enrollments.length === 0 && (
            <p style={{ textAlign: "center" }}>No enrollments found.</p>
          )}

          {enrollments.map((item) => {
            // Use live event data (by eventId first, then by title)
            const liveEvent = events[item.eventId] || events[item.title] || {};
            const liveDate = liveEvent.date || item.date;
            const liveTime = liveEvent.time || item.time;
            const imgSrc = liveEvent.image || null;
            const status = getStatus(liveDate);

            return (
              <div key={item._id} className="enroll-card">
                <div className="enroll-left">
                  {imgSrc ? (
                    <img src={imgSrc} alt={item.title} className="enroll-img" />
                  ) : (
                    <div className="enroll-img-placeholder" />
                  )}
                  <div>
                    <p className="enroll-title">{liveEvent.volunteerName || item.title}</p>
                    <p className="enroll-date">
                      {(() => {
                        const [year, month, day] = liveDate.toString().split("T")[0].split("-");
                        return new Date(year, month - 1, day).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        });
                      })()}
                      {liveTime ? ` - ${liveTime}` : ""}
                    </p>
                  </div>
                </div>
                <span className={`status ${status}`}>
                  {getStatusIcon(status)}
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MyEnrollments;
