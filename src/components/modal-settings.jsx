import React from 'react';
import '../styles/modal-settings.css';

const ModalSettings = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Settings</h2>
        <div className="settings-section">
          <h3>Account</h3>
          <div className="setting-item">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" defaultValue="current_username" />
          </div>
          <div className="setting-item">
            <label htmlFor="password">Password</label>
            <button>Change Password</button>
          </div>
        </div>
        <div className="settings-section">
          <h3>Notifications</h3>
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked />
              Email Notifications
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" />
              Push Notifications
            </label>
          </div>
        </div>
        <div className="settings-section">
          <h3>Theme</h3>
          <div className="setting-item">
            <label htmlFor="theme-select">Theme</label>
            <select id="theme-select">
              <option>Light</option>
              <option>Dark</option>
            </select>
          </div>
        </div>
        <div className="modal-actions">
          <button className="save-button">Save Changes</button>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ModalSettings;
