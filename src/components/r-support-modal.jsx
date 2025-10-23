import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaHeadset, FaChevronDown, FaChevronUp, FaExclamationTriangle } from 'react-icons/fa';
import '../styles/r-support-modal.css';

const AccordionItem = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="accordion-item">
            <button className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
                <span>{title}</span>
                {isOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {isOpen && <div className="accordion-content">{children}</div>}
        </div>
    );
};

const SupportModal = ({ isOpen, onClose, onReportUser, initialReportedUser }) => {
    if (!isOpen) return null;

    const [reportedUserName, setReportedUserName] = useState('');
    const [reportReason, setReportReason] = useState('');
    const reportSectionRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setReportedUserName(initialReportedUser || '');
            setReportReason(''); // Always clear reason

            if (initialReportedUser && reportSectionRef.current) {
                // Use a timeout to ensure the modal is fully rendered before scrolling
                setTimeout(() => {
                    reportSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        }
    }, [isOpen, initialReportedUser]);


    const faqs = [
        {
            q: "How do I file a report?",
            a: "Click the 'File a Report' button on the sidebar. Fill out the form with the necessary details, attach any evidence (photos or videos), and submit. You can track its status in the 'View and Track Reports' section."
        },
        {
            q: "How can I track my submitted reports?",
            a: "Click the 'View and Track Reports' button. You will see a list of all your reports and their current status (e.g., Pending, Reviewed, In Progress, Resolved)."
        },
        {
            q: "How do I request a certificate?",
            a: "Use the 'Request Certification' button on the sidebar. Select the type of certificate you need, state your purpose, and provide any required information or ID photos."
        },
        {
            q: "Where can I find my approved certificates?",
            a: "Once a certificate request is approved by a moderator, it will appear in your 'Inbox'. You can open your inbox from the sidebar to view and print your certificates."
        },
        {
            q: "How do I find out about upcoming events?",
            a: "Upcoming events are listed on the right-hand panel of your home page. You can also click on dates in the calendar that have a dot to see events scheduled for that day."
        }
    ];

    const handleReportSubmit = (e) => {
        e.preventDefault();
        if (reportedUserName.trim() && reportReason.trim()) {
            onReportUser(reportedUserName, reportReason);
            setReportedUserName('');
            setReportReason('');
        }
    };

    return (
        <div className="support-modal-overlay" onClick={onClose}>
            <div className="support-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Support & Help Center</h2>
                    <button className="close-btn" onClick={onClose}><FaTimes size={20} /></button>
                </div>

                <div className="support-body">
                    <div className="support-icon-container">
                        <FaHeadset size={40} />
                    </div>
                    <h3>Frequently Asked Questions</h3>
                    <div className="faq-container">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} title={faq.q}>
                                <p>{faq.a}</p>
                            </AccordionItem>
                        ))}
                    </div>

                    <div className="report-user-section" ref={reportSectionRef}>
                        <h4><FaExclamationTriangle /> Report a Resident</h4>
                        <p>If you are experiencing issues with another resident, you can submit a report here. A moderator will review it.</p>
                        <form onSubmit={handleReportSubmit}>
                            <div className="form-group">
                                <label htmlFor="resident-name-resident-report">Resident's Full Name</label>
                                <input
                                    id="resident-name-resident-report"
                                    type="text"
                                    value={reportedUserName}
                                    onChange={(e) => setReportedUserName(e.target.value)}
                                    placeholder="Enter the full name of the resident"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="report-reason-resident-report">Reason for Reporting</label>
                                <textarea
                                    id="report-reason-resident-report"
                                    value={reportReason}
                                    onChange={(e) => setReportReason(e.target.value)}
                                    placeholder="Describe the issue or violation..."
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="report-submit-btn" disabled={!reportedUserName.trim() || !reportReason.trim()}>Submit Report to Moderator</button>
                        </form>
                    </div>

                    <div className="contact-support-section">
                        <h4>Need More Help?</h4>
                        <p>If you're experiencing a technical issue or have a question not answered above, please contact the system administrator.</p>
                        <a href="mailto:admin@easebarangay.com?subject=Resident Support Request" className="contact-btn">
                            Email Administrator
                        </a>
                    </div>

                    <div className="system-info-footer">
                        <span>App Version: 1.0.0</span>
                        <span>Role: Resident</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportModal;