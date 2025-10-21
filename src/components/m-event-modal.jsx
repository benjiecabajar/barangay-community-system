import React from "react";
import { FaTimes, FaTrash } from "react-icons/fa";

const EventModal = ({
  isOpen,
  onClose,
  selectedDate,
  event,
  setEventTitle,
  setEventDescription,
  onSave,
  onDelete,
}) => {
  if (!isOpen) return null;

  const isEditing = event && event.id;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (event.title.trim()) {
      onSave();
    }
  };

  return (
    <div className="event-modal-overlay" onClick={onClose}>
      <div
        className="event-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{isEditing ? "Edit Event" : "Add Event"}</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="event-form">
          <div className="event-date-display">
            {selectedDate.toDateString()}
          </div>

          <div className="form-group">
            <label htmlFor="event-title">Event Title</label>
            <input
              id="event-title"
              type="text"
              placeholder="e.g., Barangay Assembly"
              value={event.title}
              onChange={(e) => setEventTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="event-description">Description (Optional)</label>
            <textarea
              id="event-description"
              placeholder="Add more details about the event..."
              value={event.description}
              onChange={(e) => setEventDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="modal-footer">
            {isEditing && (
              <button
                type="button"
                className="delete-event-btn"
                onClick={() => onDelete(event.id)}
              >
                <FaTrash /> Delete
              </button>
            )}
            <button
              type="submit"
              className="save-event-btn"
              disabled={!event.title.trim()}
            >
              {isEditing ? "Save Changes" : "Save Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;