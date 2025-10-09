import React from "react";
import { FaTimes } from "react-icons/fa";
import "../styles/moderator-home.css";

const ProfileModal = ({ isOpen, onClose, onLogout }) => {
  if (!isOpen) return null;

  // Placeholder data for the moderator's profile
  const moderatorProfile = {
    name: "{user's name}",
    username: "mod_01",
    email: "moderator@example.com",
    barangay: "Poblacion 1",
    joinDate: "2023-01-15",
    avatar: "https://via.placeholder.com/100/2563eb/ffffff?text=M",
  };

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Profile</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes size={20} />
          </button>
        </div>
        <div className="profile-details">
          <img src={moderatorProfile.avatar} alt="Moderator Avatar" className="profile-avatar-large" />
          <h3>{moderatorProfile.name}</h3>
          <p>@{moderatorProfile.username}</p>
          <div className="profile-info-grid">
            <div><strong>Email:</strong> {moderatorProfile.email}</div>
            <div><strong>Barangay:</strong> {moderatorProfile.barangay}</div>
            <div><strong>Joined:</strong> {moderatorProfile.joinDate}</div>
          </div>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;