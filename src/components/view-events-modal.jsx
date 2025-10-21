import React from "react";
import { FaTimes } from "react-icons/fa";
import "../styles/view-events-modal.css";

const ViewEventsModal = ({ isOpen, onClose, events, date }) => {
  if (!isOpen) return null;

  return (
    <div className="view-events-modal-overlay" onClick={onClose}>
      <div
        className="view-events-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>
            Events for{" "}
            {date.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes size={20} />
          </button>
        </div>

        <div className="events-modal-list">
          {events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className="event-modal-item">
                <h4 className="event-modal-title">{event.title}</h4>
                {event.description && (
                  <p className="event-modal-desc">{event.description}</p>
                )}
              </div>
            ))
          ) : (
            <p className="no-events-message">
              There are no events scheduled for this day.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewEventsModal;