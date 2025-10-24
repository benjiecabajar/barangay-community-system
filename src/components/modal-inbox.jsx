import React, { useState } from 'react';
import { FaTimes, FaRegSadTear, FaChevronLeft, FaPrint, FaTrash } from 'react-icons/fa';
import '../styles/modal-inbox.css';

const InboxModal = ({ isOpen, onClose, messages, onMarkAsRead, onDelete, onClearAll }) => {
    const [selectedMessage, setSelectedMessage] = useState(null);

    if (!isOpen) return null;

    const handleSelectMessage = (message) => {
        setSelectedMessage(message);
        if (!message.isRead) {
            onMarkAsRead(message.id);
        }
    };

    const handleBackToList = () => {
        setSelectedMessage(null);
        // No need to call onDelete here, as it's for individual message deletion
    };

    const handlePrint = () => {
        const printableContent = document.getElementById('printable-certificate');
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Print Certificate</title>');
        printWindow.document.write('<link rel="stylesheet" href="/src/styles/modal-inbox.css" type="text/css" />'); // Link to existing styles
        printWindow.document.write('</head><body>');
        printWindow.document.write(printableContent.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        setTimeout(() => { // Wait for styles to load
            printWindow.print();
        }, 500);
    };

    const sortedMessages = [...messages].sort((a, b) => b.dateApproved - a.dateApproved);

    return (
        <div className="inbox-modal-overlay" onClick={onClose}>
            <div className="inbox-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{selectedMessage ? "Certificate Details" : "Resident Inbox"}</h2>
                    <button className="close-btn" onClick={onClose}><FaTimes size={20} /></button>
                </div>

                <div className="inbox-body">
                    {!selectedMessage ? (
                        // List View
                        sortedMessages.length === 0 ? (
                            <div className="no-items-placeholder">
                                <FaRegSadTear size={50} />
                                <h3>Your Inbox is Empty</h3>
                                <p>Approved certificates will appear here.</p>
                            </div>
                        ) : (
                            <div className="message-list">
                                {sortedMessages.map(msg => (
                                    <div key={msg.id} className={`message-item ${!msg.isRead ? 'unread' : ''}`} onClick={() => handleSelectMessage(msg)}>
                                        <div className="message-icon"></div>
                                        <div className="message-summary">
                                            <span className="message-title">Certificate of {msg.certificateType}</span>
                                            <span className="message-subtitle">Your request has been approved.</span>
                                        </div>
                                        <span className="message-date">{new Date(msg.dateApproved).toLocaleDateString()}</span>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        // Detail View
                        <div className="details-body">
                            <button className="back-to-list-btn" onClick={handleBackToList}>
                                <FaChevronLeft /> Back to Inbox
                            </button>

                            <div id="printable-certificate" className="certificate-paper">
                                <div className="cert-header">
                                    <h3>Republic of the Philippines</h3>
                                    <h4>Barangay Poblacion</h4>
                                    <h5>Villanueva, Misamis Oriental</h5>
                                    <h1>Certificate of {selectedMessage.certificateType}</h1>
                                </div>
                                <div className="cert-body">
                                    <p>This is to certify that <strong>{selectedMessage.requester}</strong>, a resident of this barangay, has been issued this certificate for the purpose of <strong>"{selectedMessage.purpose}"</strong>.</p>
                                    <p>This certification is issued upon the request of the above-named person as a requirement for whatever legal purpose it may serve.</p>
                                    <p>Issued this {new Date(selectedMessage.dateApproved).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at the Barangay Hall, Poblacion, Villanueva, Misamis Oriental.</p>
                                </div>
                                <div className="cert-footer">
                                    <div className="signature-line">
                                        <strong>Barangay Captain</strong>
                                        <span>(Signature over printed name)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="details-footer">
                                <button className="delete-message-btn" onClick={() => { onDelete(selectedMessage.id); handleBackToList(); }}>
                                    <FaTrash /> Delete Message
                                </button>
                                <button className="print-btn" onClick={handlePrint}>
                                    <FaPrint /> Print Certificate
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InboxModal;