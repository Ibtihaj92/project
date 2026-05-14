import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ViewParticipants.css";

export default function ViewParticipants() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const volunteer = location.state?.volunteer;

  const [participants, setParticipants] = useState([]);
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:5000/api/enrollments/event/${id}`)
      .then(res => {
        setParticipants(res.data);
        const initial = {};
        res.data.forEach(p => { initial[p._id] = p.attended || false; });
        setAttendance(initial);
      })
      .catch(err => console.error(err));
  }, [id]);

  const toggleAttendance = (pid) => {
    setAttendance(prev => ({ ...prev, [pid]: !prev[pid] }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/enrollments/attendance/${id}`, { attendance });
      alert("Attendance saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save attendance.");
    }
  };

  const totalAttended = Object.values(attendance).filter(Boolean).length;

  return (
    <div className="participants-wrapper">
      <div className="participants-card">
        <h2>View Participants for {volunteer?.volunteerName || "Event"}</h2>
        <hr />
        <p className="total-label">Total Participants: {participants.length}</p>

        <table className="participants-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Participants Name</th>
              <th>Attendance</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p, idx) => (
              <tr key={p._id}>
                <td>{idx + 1}</td>
                <td>{p.userName || p.userId}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={attendance[p._id] || false}
                    onChange={() => toggleAttendance(p._id)}
                  />
                </td>
              </tr>
            ))}
            {participants.length > 0 && (
              <tr className="total-row">
                <td colSpan={2}></td>
                <td>Total Attended: {totalAttended}</td>
              </tr>
            )}
          </tbody>
        </table>

        {participants.length === 0 && (
          <p style={{ textAlign: "center", color: "#666", marginTop: 20 }}>
            No participants enrolled yet.
          </p>
        )}

        <div className="participants-actions">
          <button className="btn-back" onClick={() => navigate("/volunteers-list")}>← Back</button>
          {participants.length > 0 && (
            <button className="btn-save" onClick={handleSave}>Save</button>
          )}
        </div>
      </div>
    </div>
  );
}
