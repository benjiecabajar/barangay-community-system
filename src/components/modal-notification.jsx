import React from "react";
import { FaTimes, FaBell, FaRegSadTear, FaClipboardCheck, FaBullhorn, FaFileAlt } from "react-icons/fa";
import "../styles/modal-notification.css";

const NotificationModal = ({ isOpen, onClose, notifications, onClear, onDelete }) => {
  if (!isOpen) return null;

  const getNotificationIcon = (type) => {
    switch (type) {
        case 'new_report': // Moderator
            return <FaFileAlt className="icon new-report" />; // Orange
        case 'report_update':
            return <FaClipboardCheck className="icon report" />;
        case 'new_announcement':
            return <FaBullhorn className="icon announcement" />;
        default:
            return <FaBell className="icon default" />;
    }
  };

  // Sort notifications from newest to oldest
  const sortedNotifications = [...notifications].sort((a, b) => b.date - a.date);

  return (
    <div className="notification-modal-overlay" onClick={onClose}>
      <div className="notification-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Notifications</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes size={20} />
          </button>
        </div>

        <div className="notification-body">
          {sortedNotifications.length === 0 ? (
            <div className="no-notifications-placeholder">
              <FaRegSadTear size={50} />
              <h3>No New Notifications</h3>
              <p>Updates about your reports and new announcements will appear here.</p>
            </div>
          ) : (
            <div className="notification-list">
              {sortedNotifications.map((notif) => (
                <div key={notif.id} className={`notification-item ${notif.isRead ? 'read' : 'unread'}`}>
                  <div className="notification-icon">
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div className="notification-details">
                    <p className="message">{notif.message}</p>
                    <small className="date">
                      {new Date(notif.date).toLocaleString([], {
                        dateStyle: "short", timeStyle: "short" 
                      })}
                    </small>
                  </div>
                  <button className="notification-delete-btn" onClick={() => onDelete(notif.id)} title="Delete notification">
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="modal-footer">
            <button className="clear-all-btn" onClick={onClear}>
              Clear All Notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationModal;