import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
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
    firstName: '',
    middleName: '',
    lastName: '',
    address: '',
    dob: '',
    civilStatus: '',
  });
  const [residencyForm, setResidencyForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    address: '',
    lengthOfResidency: '',
  });

  if (!isOpen) return null;

  const handleClearanceFormChange = (e) => {
    setClearanceForm({ ...clearanceForm, [e.target.name]: e.target.value });
  };

  const handleResidencyFormChange = (e) => {
    setResidencyForm({ ...residencyForm, [e.target.name]: e.target.value });
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
    if (certType === 'Certificate of Residency') {
      submissionData.residencyDetails = residencyForm;
    }

    onSubmit(submissionData);
    setPurpose('');
    setClearanceForm({
      firstName: '',
      middleName: '',
      lastName: '',
      address: '',
      dob: '',
      civilStatus: '',
    });
    setResidencyForm({
      firstName: '',
      middleName: '',
      lastName: '',
      address: '',
      lengthOfResidency: '',
    });
    onClose();
  };

  const handleClose = () => {
    setPurpose('');
    setClearanceForm({ firstName: '', middleName: '', lastName: '', address: '', dob: '', civilStatus: '' });
    setResidencyForm({ firstName: '', middleName: '', lastName: '', address: '', lengthOfResidency: '' });
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
              <div className="input-group name-inputs">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={clearanceForm.firstName}
                  onChange={handleClearanceFormChange}
                  required
                />
                <input
                  type="text"
                  name="middleName"
                  placeholder="Middle (Optional)"
                  value={clearanceForm.middleName}
                  onChange={handleClearanceFormChange}
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={clearanceForm.lastName}
                  onChange={handleClearanceFormChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  name="address"
                  placeholder="Complete Address"
                  value={clearanceForm.address}
                  onChange={handleClearanceFormChange}
                  required
                />
              </div>
              <div className="input-group name-inputs">
                <input
                  type="date"
                  name="dob"
                  placeholder="Date of Birth"
                  value={clearanceForm.dob}
                  onChange={handleClearanceFormChange}
                  required
                />
                <select
                  name="civilStatus"
                  value={clearanceForm.civilStatus}
                  onChange={handleClearanceFormChange}
                  required
                >
                  <option value="" disabled>Select Civil Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated">Separated</option>
                </select>
              </div>
            </div>
          )}

          {/* Conditional Form for Certificate of Residency */}
          {certType === 'Certificate of Residency' && (
            <div className="clearance-requirements">
              <h4 className="requirements-header">Residency Certificate Requirements</h4>
              <div className="input-group name-inputs">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={residencyForm.firstName}
                  onChange={handleResidencyFormChange}
                  required
                />
                <input
                  type="text"
                  name="middleName"
                  placeholder="Middle (Optional)"
                  value={residencyForm.middleName}
                  onChange={handleResidencyFormChange}
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={residencyForm.lastName}
                  onChange={handleResidencyFormChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  name="address"
                  placeholder="Complete Address"
                  value={residencyForm.address}
                  onChange={handleResidencyFormChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  name="lengthOfResidency"
                  placeholder="Length of Residency (e.g., 5 years)"
                  value={residencyForm.lengthOfResidency}
                  onChange={handleResidencyFormChange}
                  required
                />
              </div>
            </div>
          )}

          {/* Show Purpose and Submit only when a cert type is selected */}
          {certType !== CERTIFICATE_TYPES[0] && (
            <>
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
              <button type="submit" className="submit-cert-btn" disabled={!purpose.trim()}>
                Submit Request
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default RequestCertificationModal;