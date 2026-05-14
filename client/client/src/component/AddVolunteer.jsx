import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdCloudUpload } from "react-icons/md";
import "./AddVolunteer.css";

const CLOUDINARY_CLOUD_NAME = "dvvjof5hc";
const CLOUDINARY_UPLOAD_PRESET = "event_preset";

function AddVolunteer() {
  const navigate = useNavigate();
  const [volunteerName, setVolunteerName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [volunteerType, setVolunteerType] = useState("Social");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [location, setLocation] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );
    return res.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const res = await axios.post("http://localhost:5000/addEvent", {
        volunteerName,
        date,
        time,
        volunteerType,
        description,
        location,
        image: imageUrl,
      });

      if (res.data.success) {
        alert("Volunteer added successfully!");
        navigate("/volunteers-list");
      }
    } catch (err) {
      console.error("Error adding volunteer:", err);
      alert("Failed to add volunteer. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="add-volunteer-container">
      <div className="add-volunteer-card">
        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
          <button type="button" className="back-btn" onClick={() => navigate("/admin")}>
            ← Back
          </button>
        </div>
        <h2>Add New Volunteer</h2>
        <hr />

        <form onSubmit={handleSubmit}>
          <div className="image-upload">
            <label htmlFor="file-input">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="preview-image" />
              ) : (
                <div className="upload-placeholder">
                  <MdCloudUpload size={48} color="#a0b8c8" />
                </div>
              )}
            </label>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>

          <label className="field-label">Volunteer Name</label>
          <input
            type="text"
            placeholder="Volunteer Name"
            value={volunteerName}
            onChange={(e) => setVolunteerName(e.target.value)}
            required
          />

          <div className="row">
            <div className="col">
              <label className="field-label">Date</label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="col">
              <label className="field-label">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
            <div className="col">
              <label className="field-label">Volunteer Type</label>
              <select value={volunteerType} onChange={(e) => setVolunteerType(e.target.value)}>
                <option value="Social">Social</option>
                <option value="Environmental">Environmental</option>
                <option value="Educational">Educational</option>
                <option value="Health">Health</option>
              </select>
            </div>
          </div>

          <label className="field-label">Location</label>
          <div className="location-input-wrapper">
            <FaMapMarkerAlt className="location-icon" />
            <input
              type="text"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="location-input"
            />
            <button
              type="button"
              className="gps-btn"
              title="Use my current location"
              onClick={() => {
                if (!navigator.geolocation) {
                  alert("Geolocation is not supported by your browser.");
                  return;
                }
                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    const coords = `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`;
                    setLocation(coords);
                  },
                  () => alert("Unable to retrieve your location. Please allow location access.")
                );
              }}
            >
              📡
            </button>
          </div>

          <label className="field-label">Description</label>
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddVolunteer;
