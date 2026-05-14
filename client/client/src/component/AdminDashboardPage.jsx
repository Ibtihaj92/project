import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./adminDashboard.css";

// Reusable Card component
function Card({ iconClass, title, value, onClick }) {
  return (
    <div className="card" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      <div className="card-icon">
        <i className={iconClass}></i>
      </div>
      <div className="card-info">
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
    </div>
  );
}

function LatestVolunteer({ volunteerLabel }) {
  return (
    <div className="latest-volunteer">
      <div className="card-icon">
        <i className="fa-solid fa-clock"></i>
      </div>
      <div className="card-info">
        <h3>Latest Volunteer Added</h3>
        <p style={{ whiteSpace: "pre-line" }}>{volunteerLabel}</p>
      </div>
    </div>
  );
}

// Sidebar component
function Sidebar({ active, setActive }) {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Add New Volunteer", icon: "fa-solid fa-plus", path: "/add-volunteer" },
    { name: "Volunteers List", icon: "fa-solid fa-list", path: "/volunteers-list" },
    { name: "Profile", icon: "fa-solid fa-user", path: "/profile" },
    { name: "Log Out", icon: "fa-solid fa-right-from-bracket", path: "/logout" },
  ];

  return (
    <div className="sidebar">
      {/* Keep profile-icon */}
      <div
        className="profile-icon"
        style={{ cursor: "pointer" }}
      >
        <i className="fa-solid fa-user fa-2x"></i>
      </div>

      <ul className="menu">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={active === item.name ? "active" : ""}
            onClick={() => {
              setActive(item.name);

              if (item.name === "Log Out") {
                localStorage.removeItem("user");
                localStorage.removeItem("userId");
                localStorage.removeItem("role");
                window.location.href = "/login";
              } else {
                navigate(item.path);
              }
            }}
          >
            <i className={item.icon} style={{ marginRight: "10px" }}></i>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}


// Main Dashboard component
function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState("Add New Volunteer");
  const [currentVolunteers, setCurrentVolunteers] = useState(0);
  const [totalVolunteers, setTotalVolunteers] = useState(0);
  const [latestVolunteer, setLatestVolunteer] = useState("");
  const navigate = useNavigate();

  useEffect(() => {

    const userId = localStorage.getItem("userId");
  if (!userId) {
    navigate("/"); 
    return; 
  }

    const fetchVolunteers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/allEvents");
        const events = res.data;

        const today = new Date().toISOString().split("T")[0];
        const current = events.filter(e => e.date >= today).length;

        const latest = events.length > 0 ? events[0].volunteerName : "";

        setCurrentVolunteers(current);
        setTotalVolunteers(events.length);
        setLatestVolunteer(latest);
      } catch (err) {
        console.error("Error fetching volunteers:", err);
      }
    };

    fetchVolunteers();
  }, [navigate]);

  return (
  <div className="admin-dashboard">
    <Sidebar active={activeMenu} setActive={setActiveMenu} />

    <div className="dashboard">
      <h1>Admin Dashboard</h1>

      <div className="stats">
        <Card
          iconClass="fa-solid fa-book"
          title="Current Volunteers"
          value={currentVolunteers}
        />

        <Card
          iconClass="fa-solid fa-graduation-cap"
          title="Total Volunteers"
          value={totalVolunteers}
          onClick={() => navigate("/volunteers-list")}
        />
      </div>

      <LatestVolunteer volunteerLabel={latestVolunteer || "No volunteers yet"} />
    </div>
  </div>
);

}

export default AdminDashboard;
