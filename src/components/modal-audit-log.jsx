import React, { useState, useEffect } from 'react';
import { FaTimes, FaSearch, FaUserShield, FaInfoCircle } from 'react-icons/fa';
import '../styles/modal-audit-log.css';

const AuditLogModal = ({ isOpen, onClose, role }) => {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      const logKey = `${role}_auditLogs`;
      const storedLogs = JSON.parse(localStorage.getItem(logKey)) || [];
      setLogs(storedLogs);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredLogs = logs.filter(log =>
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="audit-log-modal-overlay" onClick={onClose}>
      <div className="audit-log-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><FaUserShield /> Audit Activity Log</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes size={20} />
          </button>
        </div>

        <div className="audit-log-toolbar">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search logs by action, user, or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="audit-log-body">
          {filteredLogs.length > 0 ? (
            filteredLogs.map(log => (
              <div key={log.id} className="log-item">
                <div className="log-header">
                  <span className="log-action">{log.action}</span>
                  <span className="log-user">by {log.user}</span>
                </div>
                <div className="log-details">
                  <span className="log-timestamp">{new Date(log.timestamp).toLocaleString()}</span>
                  {Object.keys(log.details).length > 0 && <pre className="log-details-json">{JSON.stringify(log.details, null, 2)}</pre>}
                </div>
              </div>
            ))
          ) : (
            <div className="no-logs-placeholder"><FaInfoCircle /> No logs found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLogModal;