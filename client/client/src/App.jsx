import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./component/AdminDashboardPage";
import VolunteerList from "./component/VolunteerList";
import AddVolunteer from "./component/AddVolunteer";
import UpdateVolunteer from "./component/UpdateVolunteer";
import Login from "./component/Login";
import Register from "./component/Register";
import Home from "./component/Home";
import EventsPage from "./component/Events";
import EventDetails from "./component/EventDetails";
import MyEnrollments from "./component/MyEnrollments";
import Profile from "./component/Profile";
import ViewParticipants from "./component/ViewParticipants";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/volunteers-list" element={<VolunteerList />} />
        <Route path="/add-volunteer" element={<AddVolunteer />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/update-volunteer/:id" element={<UpdateVolunteer />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/view-participants/:id" element={<ViewParticipants />} />
      </Routes>
    </Router>
  );
}

export default App;
