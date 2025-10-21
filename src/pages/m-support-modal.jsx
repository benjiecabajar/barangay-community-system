import React from 'react';
import { FaTimes, FaHeadset, FaEnvelope, FaPhone } from 'react-icons/fa';
import '../styles/m-support-modal.css';

const SupportModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="support-modal-overlay" onClick={onClose}>
            <div className="support-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Support & Contact</h2>
                    <button className="close-btn" onClick={onClose}>
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="support-body">
                    <div className="support-icon-container">
                        <FaHeadset size={50} />
                    </div>
                    <h3>Need Assistance?</h3>
                    <p>
                        If you're experiencing technical issues or have questions about the system,
                        please reach out to our support team.
                    </p>

                    <div className="contact-details">
                        <div className="contact-item">
                            <FaEnvelope />
                            <span>support@easebarangay.com</span>
                        </div>
                        <div className="contact-item">
                            <FaPhone />
                            <span>+63 912 345 6789</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportModal;