import React, { useState } from 'react';
import { FaTimes, FaPaperPlane, FaUser, FaHome, FaCalendarAlt, FaHeart } from 'react-icons/fa';
import '../styles/modal-request-cert.css';

const CERTIFICATE_TYPES = [
  'Select Certificate Type',
  'Barangay Clearance',
  'Certificate of Residency',
  'Certificate of Indigency',
  'Certificate of Good Moral Character',
];

const RequestCertificationModal = ({ isOpen, onClose, onSubmit }) => {
  const [certType, setCertType] = useState(CERTIFICATE_TYPES[0]);
  const [purpose, setPurpose] = useState('');
  const [clearanceForm, setClearanceForm] = useState({
    fullName: '',
    address: '',
    dob: '',
    civilStatus: '',
  });

  if (!isOpen) return null;

  const handleClearanceFormChange = (e) => {
    setClearanceForm({ ...clearanceForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (certType === CERTIFICATE_TYPES[0]) {
      alert('Please select a certificate type.');
      return;
    }
    if (!purpose.trim()) {
      alert('Please state the purpose of your request.');
      return;
    }

    let submissionData = {
      type: certType,
      purpose: purpose,
    };

    if (certType === 'Barangay Clearance') {
      submissionData.clearanceDetails = clearanceForm;
    }

    onSubmit(submissionData);
    setPurpose('');
    setClearanceForm({ fullName: '', address: '', dob: '', civilStatus: '' });
    onClose();
  };

  const handleClose = () => {
    setPurpose('');
    setClearanceForm({ fullName: '', address: '', dob: '', civilStatus: '' });
    onClose();
  };

  return (
    <div className="cert-modal-overlay" onClick={handleClose}>
      <div className="cert-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Request a Certificate</h2>
          <button className="close-btn" onClick={handleClose}>
            <FaTimes size={20} />
          </button>
        </div>

        <form className="cert-form" onSubmit={handleSubmit}>
          <div className="setting-item-column">
            <label htmlFor="cert-type">Certificate Type:</label>
            <select
              id="cert-type"
              value={certType}
              onChange={(e) => setCertType(e.target.value)}
              required
            >
              {CERTIFICATE_TYPES.map((type, index) => (
                <option key={type} value={type} disabled={index === 0}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Conditional Form for Barangay Clearance */}
          {certType === 'Barangay Clearance' && (
            <div className="clearance-requirements">
              <h4 className="requirements-header">Barangay Clearance Requirements</h4>
              <div className="input-group">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={clearanceForm.fullName}
                  onChange={handleClearanceFormChange}
                  required
                />
              </div>
              <div className="input-group">
                <FaHome className="input-icon" />
                <input
                  type="text"
                  name="address"
                  placeholder="Complete Address"
                  value={clearanceForm.address}
                  onChange={handleClearanceFormChange}
                  required
                />
              </div>
              <div className="input-group">
                <FaCalendarAlt className="input-icon" />
                <input
                  type="date"
                  name="dob"
                  placeholder="Date of Birth"
                  value={clearanceForm.dob}
                  onChange={handleClearanceFormChange}
                  required
                />
              </div>
              <div className="input-group">
                <FaHeart className="input-icon" />
                <input
                  type="text"
                  name="civilStatus"
                  placeholder="Civil Status"
                  value={clearanceForm.civilStatus}
                  onChange={handleClearanceFormChange}
                  required
                />
              </div>
            </div>
          )}

          <div className="setting-item-column">
            <label htmlFor="purpose">Purpose:</label>
            <textarea
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g., For employment, for school application, etc."
              required
            />
          </div>

          <button type="submit" className="submit-cert-btn" disabled={!purpose.trim() || certType === CERTIFICATE_TYPES[0]}>
            <FaPaperPlane size={16} /> Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestCertificationModal;