import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Events.css";
import logo from "../logo.png";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/");
      return;
    }
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/allEvents");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [navigate]);

  if (loading) return <p>Loading events...</p>;

  const filteredEvents = events.filter((e) =>
    (e.volunteerName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="events-container">
      <header className="events-header">
        <img src={logo} alt="Logo" style={{ width: "120px" }} />
        <nav>
          <ul>
            <li><Link to="/events">Home</Link></li>
            <li><Link to="/my-enrollments">My Enrollments</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li>
              <Link to="#" onClick={() => { localStorage.clear(); window.location.href = "/login"; }}>
                Logout
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <h2>Find Volunteer Opportunities</h2>
        <p>Find the perfect volunteer opportunity and start making a difference today</p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search Events"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="search-icon" />
        </div>

        <div className="events-grid">
          {filteredEvents.map((event) => (
            <div className="event-card" key={event._id}>
              <img
                src={event.image ? event.image : "/default-event.jpg"}
                alt={event.volunteerName}
              />
              <h3>{event.volunteerName}</h3>
              <p>{event.description}</p>
              <button onClick={() => navigate(`/events/${event._id}`)}>
                View Details
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default EventsPage;
