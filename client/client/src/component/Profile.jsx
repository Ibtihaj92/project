import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaUserCircle } from "react-icons/fa";
import { MdCloudUpload } from "react-icons/md";
import "./Profile.css";

// Cloudinary config
const CLOUDINARY_CLOUD_NAME = "dvvjof5hc";
const CLOUDINARY_UPLOAD_PRESET = "event_preset";

function Profile() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (!userId) { navigate("/"); return; }
    axios.get(`http://localhost:5000/users/${userId}`)
      .then(res => {
        setUser(res.data);
        setForm({
          userName: res.data.userName || "",
          userPhone: res.data.userPhone || "",
          userAddress: res.data.userAddress || "",
        });
        setImagePreview(res.data.profileImage || null);
      })
      .catch(err => console.error(err));
  }, [userId, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
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

  const handleSave = async () => {
    setUploading(true);
    try {
      let profileImage = user.profileImage || "";
      if (imageFile) {
        profileImage = await uploadToCloudinary(imageFile);
      }
      const res = await axios.put(`http://localhost:5000/users/${userId}`, {
        ...form,
        profileImage,
      });
      setUser(res.data.user);
      setImagePreview(res.data.user.profileImage);
      setEditing(false);
      setImageFile(null);
      localStorage.setItem("userName", res.data.user.userName || "");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  if (!user) return <p style={{ textAlign: "center", marginTop: 40 }}>Loading...</p>;

  const governorates = [
    "Muscat","Dhofar","Al Batinah North","Al Batinah South",
    "Al Dakhiliyah","Al Dhahirah","Al Sharqiyah North",
    "Al Sharqiyah South","Al Wusta","Musandam","Al Buraimi",
  ];

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <div style={{ textAlign: "left", marginBottom: 8 }}>
          <button className="btn-back-nav" onClick={() => {
            const role = localStorage.getItem("role");
            navigate(role === "admin" ? "/admin" : "/events");
          }}>← Back</button>
        </div>
        {/* Avatar */}
        <div className="avatar-section">
          {editing ? (
            <label htmlFor="avatar-input" className="avatar-upload-label">
              {imagePreview
                ? <img src={imagePreview} alt="avatar" className="avatar-img" />
                : <FaUserCircle size={80} color="#e8a87c" />
              }
              <div className="avatar-overlay"><MdCloudUpload size={22} /></div>
              <input id="avatar-input" type="file" accept="image/*"
                onChange={handleImageChange} style={{ display: "none" }} />
            </label>
          ) : (
            imagePreview
              ? <img src={imagePreview} alt="avatar" className="avatar-img" />
              : <FaUserCircle size={80} color="#e8a87c" />
          )}
        </div>

        <h2 className="profile-name">{user.userName || "User"}</h2>

        {/* Info rows */}
        <div className="profile-info">
          <div className="info-row">
            <span className="info-label"><FaEnvelope /> Email</span>
            <span className="info-value">{user.userEmail}</span>
          </div>

          <div className="info-row">
            <span className="info-label"><FaPhone /> Phone number</span>
            {editing
              ? <input className="edit-input" value={form.userPhone}
                  onChange={e => setForm({ ...form, userPhone: e.target.value })} />
              : <span className="info-value">{user.userPhone}</span>
            }
          </div>

          <div className="info-row">
            <span className="info-label"><FaMapMarkerAlt /> Address</span>
            {editing
              ? (
                <select className="edit-input" value={form.userAddress}
                  onChange={e => setForm({ ...form, userAddress: e.target.value })}>
                  {governorates.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              )
              : <span className="info-value">{user.userAddress}</span>
            }
          </div>

          <div className="info-row">
            <span className="info-label"><FaLock /> Password</span>
            <span className="info-value">••••••</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="profile-actions">
          <button className="btn-back-nav" onClick={() => {
            const role = localStorage.getItem("role");
            navigate(role === "admin" ? "/admin" : "/events");
          }}>← Home</button>
          {editing ? (
            <>
              <button className="btn-edit" onClick={handleSave} disabled={uploading}>
                {uploading ? "Saving..." : "Save"}
              </button>
              <button className="btn-logout" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button className="btn-edit" onClick={() => setEditing(true)}>
                Edit Profile
              </button>
              <button className="btn-logout" onClick={handleLogout}>
                LogOut
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
