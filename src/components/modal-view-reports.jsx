import { useState } from "react";
import {
  FaTimes,
  FaRegSadTear,
  FaEye,
  FaBan,
  FaCheckCircle,
  FaTools,
  FaClipboardCheck,
  FaTrash,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import "../styles/modal-view-reports.css";
import { useTheme } from "./ThemeContext";

const ViewReportsModal = ({ isOpen, onClose, reports, onCancelReport, onOpenImage }) => {
  const { theme } = useTheme();
  const [selectedReport, setSelectedReport] = useState(null);
  const [cancellationStatus, setCancellationStatus] = useState(null); // 'cancelling', 'success'

  if (!isOpen) return null;

  const handleCancelClick = () => {
    if (selectedReport && window.confirm("Are you sure you want to cancel/delete this report? This action cannot be undone.")) {
      setCancellationStatus('cancelling');

      // Simulate a 2-second cancellation process
      setTimeout(() => {
        onCancelReport(selectedReport.id);
        setCancellationStatus('success');

        // Show success message for 1.5 seconds, then close the details view
        setTimeout(() => {
          setSelectedReport(null);
          setCancellationStatus(null);
        }, 1500);
      }, 2000);
    }
  };


  // 🔹 STATUS BADGE COMPONENT
  const StatusBadge = ({ status }) => {
    const statusInfo = {
      submitted: { label: "🟡 Pending Review", className: "status-submitted" },
      reviewed: { label: "🟠 Under Review", className: "status-reviewed" },
      approved: { label: "🟢 Approved – For Action", className: "status-approved" },
      declined: { label: "🔴 Declined – Invalid Report", className: "status-declined" },
      "in-progress": { label: "🔵 In Progress", className: "status-in-progress" },
      done: { label: "✅ Resolved / Done", className: "status-done" },
    };

    const { label, className } =
      statusInfo[status] || { label: status, className: "status-default" };

    return <span className={`status-badge ${className}`}>{label}</span>;
  };

  // 🔹 STEP PATHS
  const baseSteps = [
    { key: "submitted", label: "Report Submitted", icon: <FaClipboardCheck /> },
    { key: "reviewed", label: "Reviewed", icon: <FaEye /> },
  ];

  const successPath = [
    ...baseSteps,
    { key: "approved", label: "Approved – For Action", icon: <FaCheckCircle /> },
    { key: "in-progress", label: "In Progress", icon: <FaTools /> },
    { key: "done", label: "Resolved / Done", icon: <FaCheckCircle /> },
  ];

  const declinedPath = [
    ...baseSteps,
    { key: "declined", label: "Declined – Invalid Report", icon: <FaBan /> },
  ];

  // 🔹 Step status helper
  const getStepStatus = (currentStatus, stepKey, path) => {
    const order = path.map((s) => s.key);
    const currentIndex = order.indexOf(currentStatus);
    const stepIndex = order.indexOf(stepKey);
    return currentIndex >= stepIndex;
  };

  // Sort reports from newest to oldest before rendering
  const sortedReports = [...reports].sort((a, b) => b.date - a.date);

  return (
    <div className="view-reports-modal-overlay" onClick={onClose}>
      <div
        className="view-reports-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Keep header exactly as you have it */}
        <div className="modal-header">
          <h2>My Submitted Reports</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes size={20} />
          </button>
        </div>

        <div className="reports-body">
          {sortedReports.length === 0 ? (
            <div className="no-reports-placeholder">
              <FaRegSadTear size={50} />
              <h3>No Reports Filed Yet</h3>
              <p>When you file a report, it will appear here for tracking.</p>
            </div>
          ) : (
            sortedReports.map((report) => (
              <div
                key={report.id}
                className="report-card clickable"
                onClick={() => setSelectedReport(report)}
              >
                <div className="report-card-header">
                  <h3>{report.type}</h3>
                  <FaEye className="view-icon" />
                </div>
                <p className="report-card-description">
                  {report.description.slice(0, 100)}...
                </p>
                <div className="report-card-footer">
                  <StatusBadge status={report.status} />
                  <small className="report-date">
                    {new Date(report.date).toLocaleString([], {
                      dateStyle: "short", timeStyle: "short"
                    })}
                  </small>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 🔹 REPORT DETAILS SUBMODAL */}
      {selectedReport && (
        <div
          className="report-details-overlay"
          onClick={(e) => {
            e.stopPropagation(); // Prevent click from reaching the main modal overlay
            setSelectedReport(null);
          }}
        >
          <div
            className="report-details-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="details-header">
              <h3>{selectedReport.type}</h3>
              <button
                className="close-btn"
                onClick={() => setSelectedReport(null)}
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Cancellation Status Overlay */}
            {cancellationStatus && (
              <div className="submission-overlay">
                {cancellationStatus === 'cancelling' && (
                  <>
                    <div className="spinner"></div>
                    <p>Processing Cancellation...</p>
                  </>
                )}
                {cancellationStatus === 'success' && (
                  <>
                    <FaCheckCircle className="success-icon" size={60} />
                    <p>Report Successfully Removed!</p>
                  </>
                )}
              </div>
            )}

            <div className="details-body">
              <p>
                <strong>Description:</strong> {selectedReport.description}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedReport.date).toLocaleString([], {
                  dateStyle: "medium", timeStyle: "short"
                })}
              </p>

              {/* 🔹 Render location if available */}
              {selectedReport.location && (
                <div className="report-location-view">
                  <strong>Location:</strong> {selectedReport.location.address && <span className="location-address-text">{selectedReport.location.address}</span>}
                  <a
                    className="view-on-map-btn"
                    href={`https://www.google.com/maps/search/?api=1&query=${selectedReport.location.lat},${selectedReport.location.lng}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <FaMapMarkerAlt /> View on Map
                  </a>
                </div>
              )}

              {/* 🔹 Render attached media */}
              {selectedReport.media && selectedReport.media.length > 0 && (
                <div className="report-media-gallery">
                  <strong>Evidence:</strong>
                  <div className="media-items">
                    {selectedReport.media.map((mediaUrl, index) => (
                      <img
                        key={index}
                        src={mediaUrl}
                        alt={`Evidence ${index + 1}`}
                        onClick={() => onOpenImage(selectedReport.media, index)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 🔹 PROGRESS TRACKER */}
              {selectedReport.status && (
                <div className="progress-tracker">
                  {(selectedReport.status === "declined"
                    ? declinedPath
                    : successPath
                  ).map((step, i) => {
                    const path = selectedReport.status === "declined" ? declinedPath : successPath;
                    const isActive = getStepStatus(selectedReport.status, step.key, path);
                    const isCurrent = selectedReport.status === step.key;

                    return (
                      <div
                        key={i}
                        className={`progress-step ${isActive ? "active" : ""} ${isCurrent ? "current" : ""} ${step.key === "declined" ? "declined" : ""}`}
                      >
<div className={`icon-wrapper ${isCurrent ? "current" : ""}`}>
                          <div className="icon">{step.icon}</div>
                          <p className={isCurrent ? "current-status-text" : ""}>{step.label}</p>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="details-footer">
              {!['done', 'declined'].includes(selectedReport.status) && (
                <button className="cancel-report-btn" onClick={handleCancelClick}>
                  <FaBan /> Cancel Report
                </button>
              )}
              {['done', 'declined'].includes(selectedReport.status) && (
                <button className="delete-report-btn" onClick={handleCancelClick}>
                  <FaTrash /> Delete Report
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewReportsModal;
