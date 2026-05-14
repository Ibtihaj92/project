import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./VolunteerList.css";
import logo from "../logo.png";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/events/${id}`)
      .then((res) => setEvent(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!event) return <p>Loading event details...</p>;

  const userId = localStorage.getItem("userId");
  const isEventExpired = () => {
    const eventDateTime = new Date(`${event.date}T${event.time}`);
    const now = new Date();
    return eventDateTime < now;
  };

  const handleEnroll = async () => {
    if (!userId) {
      alert("Please login first!");
      return;
    }

    if (isEventExpired()) {
      alert("❌ This event has already ended. Enrollment is closed.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/enrollments", {
        userId,
        eventId: event._id,
        title: event.volunteerName,
        date: event.date,
      });

      alert("Enrolled successfully!");
      navigate("/my-enrollments");
    } catch (err) {
      console.error("Enrollment error:", err);
      alert("Enrollment failed!");
    }
  };

  const openGoogleMaps = (location) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="volunteer-container">
      <div className="header">
        <div className="logo">
          <img src={logo} alt="Logo" />
          <p>Volunteer{"\n"}Opportunities{"\n"}System</p>
        </div>
        <h1 style={{ textAlign: "center", marginTop: "10px" }}>Event Details</h1>
      </div>

      <div className="volunteer-card" style={{ margin: "0 auto", maxWidth: "500px" }}>
        <div className="volunteer-info" style={{ flexDirection: "column", alignItems: "center" }}>
          <img src={event.image || "/default-event.jpg"} alt={event.volunteerName} />
          <span>{event.volunteerName}</span>
        </div>

        <div className="volunteer-buttons" style={{ justifyContent: "center", marginTop: "15px" }}>
          <button
            className="edit-btn"
            onClick={handleEnroll}
            disabled={isEventExpired()}
            style={{
              opacity: isEventExpired() ? 0.5 : 1,
              cursor: isEventExpired() ? "not-allowed" : "pointer",
            }}
          >
            {isEventExpired() ? "Enrollment Closed" : "Enroll Now"}
          </button>

          <button className="view-btn" onClick={() => navigate("/events")} style={{ marginLeft: "10px" }}>
            ← Back
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
          maxWidth: "500px",
          marginLeft: "auto",
          marginRight: "auto",
          textAlign: "left",
        }}
      >
        <h3>Description:</h3>
        <p>{event.description}</p>
        <p>⏱ {event.date} – {event.time}</p>
        <p>{event.volunteerType === "Online" ? "🌐 Online" : "📍 " + event.location}</p>
      </div>

      {event.volunteerType === "In-Person" && (
        <div style={{ textAlign: "center", marginTop: "25px" }}>
          <button className="view-btn" onClick={() => openGoogleMaps(event.location)}>
            View Location
          </button>
        </div>
      )}
    </div>
  );
}
