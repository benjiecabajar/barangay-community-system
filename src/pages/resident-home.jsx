// pages/Home.jsx

import React, { useState, useEffect } from "react";
import Calendar from "react-calendar"; 
import { useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import "../styles/resident.css";
import {
  FaUser,
  FaCog,
  FaFileAlt,
  FaHeadset,  
  FaClipboardList,
  FaInfoCircle,
  FaBell,
  FaTimes,  
  FaChevronLeft,
  FaChevronRight,
  FaEllipsisH,
} from "react-icons/fa";
import { MdOutlineAssignment } from "react-icons/md";
import Header from "../components/header.jsx";
import ProfileModal from "../components/modal-profile.jsx";
import SettingModal from "../components/modal-settings.jsx"; 
import ReportModal from "../components/modal-r-report.jsx";
import { ThemeProvider } from "../components/ThemeContext.jsx";
import ViewReportsModal from "../components/modal-view-reports.jsx";
import NotificationModal from "../components/modal-notification.jsx"; // Import the new modal
import RequestCertificationModal from "../components/modal-request-cert.jsx";
import { logAuditAction } from "../utils/auditLogger.js";

// =========================================================
// Comment Section Component (Copied from moderator-home.jsx)
// =========================================================
const CommentSection = ({ postId, comments, handleAddComment }) => {
  const [newComment, setNewComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      handleAddComment(postId, newComment);
      setNewComment("");
    }
  };

  const commentsToDisplay = showAllComments ? comments : comments.slice(-3);
  const hasMoreComments = comments.length > 3;

  return (
    <div className="comment-section">
      <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563', marginTop: '15px' }}>
        Comments ({comments.length})
      </h5>

      {hasMoreComments && !showAllComments && (
        <button onClick={() => setShowAllComments(true)} className="view-more-comments-btn show" style={{ color: '#2563eb' }}>
          View more {comments.length - 3} comments...
        </button>
      )}

      <div className="comments-list">
        {commentsToDisplay.map((comment, index) => (
          <div key={index} className="comment" style={{ display: 'flex', gap: '10px', marginBottom: '10px', padding: '8px 0' }}>
            <img src={comment.authorAvatar} alt="avatar" style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <span style={{ fontWeight: '600', fontSize: '13px', color: '#111827' }}>{comment.author}</span>
              <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '8px' }}>{comment.date}</span>
              <p style={{ margin: '0', fontSize: '14px', lineHeight: '1.4', color: '#374151' }}>{comment.text}</p>
            </div>
          </div>
        ))}
      </div>

      {hasMoreComments && showAllComments && (
        <button onClick={() => setShowAllComments(false)} className="view-more-comments-btn hide" style={{ color: '#6b7280' }}>
          Hide comments
        </button>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
        <input type="text" placeholder="Write a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} style={{ flexGrow: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }} />
        <button type="submit" disabled={!newComment.trim()} style={{ padding: '8px 15px', borderRadius: '8px', border: 'none', background: newComment.trim() ? '#2563eb' : '#9ca3af', color: 'white', fontWeight: '600', cursor: newComment.trim() ? 'pointer' : 'not-allowed' }}>
          Post
        </button>
      </form>
    </div>
  );
};

function Home() {
  const [date, setDate] = useState(new Date());
  const [posts, setPosts] = useState([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isViewReportsModalOpen, setIsViewReportsModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'submitting', 'success', 'error'
  const [notifications, setNotifications] = useState(() => JSON.parse(localStorage.getItem('notifications')) || []);
  const [userReports, setUserReports] = useState(() => JSON.parse(localStorage.getItem('userReports')) || []);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalImages, setModalImages] = useState([]);

  const navigate = useNavigate();
  
  // Load data and listen for changes from other tabs
  useEffect(() => {
    const loadData = () => {
      setPosts(JSON.parse(localStorage.getItem("announcements")) || []);
      setUserReports(JSON.parse(localStorage.getItem("userReports")) || []);
      setNotifications(JSON.parse(localStorage.getItem("notifications")) || []);
    };
    loadData();

    const handleStorageChange = (e) => {
      if (['announcements', 'userReports', 'notifications'].includes(e.key)) {
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save data to localStorage when it changes in this component
  useEffect(() => {
    localStorage.setItem("userReports", JSON.stringify(userReports));
  }, [userReports]);
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  // --- Comment Handler ---
  const handleAddComment = (postId, commentText) => {
    const newComment = {
      author: "Resident User", // Placeholder for logged-in user
      authorAvatar: "https://via.placeholder.com/30/7c3aed/ffffff?text=R",
      date: new Date().toLocaleString(),
      text: commentText,
    };

    const updatedPosts = posts.map(post =>
      post.id === postId
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    );

    setPosts(updatedPosts);
    localStorage.setItem("announcements", JSON.stringify(updatedPosts)); // Also update localStorage
  };

  const handleReportSubmit = async (reportData) => {
    // In a real app, you'd send this to a server.
    try {
        setSubmissionStatus('submitting');
        console.log("New Report Submitted:", reportData.type, reportData.description);

        // Wait for 2 seconds to show the loading spinner
        setTimeout(async () => {
            // Convert images to data URLs for storage and display
            const mediaUrls = await Promise.all(
                reportData.media.map(file => {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    });
                })
            );

            const newReport = {
                id: Date.now(),
                date: Date.now(),
                status: "submitted",
                type: reportData.type,
                description: reportData.description,
                media: mediaUrls,
                location: reportData.location,
            };
            setUserReports(prev => [...prev, newReport]);
            logAuditAction('Submitted Report', { reportId: newReport.id, type: newReport.type }, 'resident');

            // Create a notification for the moderator
            const modNotif = {
                id: Date.now() + 1,
                type: 'new_report',
                message: `A new "${newReport.type}" report has been submitted.`,
                reportId: newReport.id,
                isRead: false,
                date: Date.now()
            };
            const currentModNotifs = JSON.parse(localStorage.getItem('moderatorNotifications')) || [];
            localStorage.setItem('moderatorNotifications', JSON.stringify([modNotif, ...currentModNotifs]));

            setSubmissionStatus('success');

            setTimeout(() => {
                setIsReportModalOpen(false);
                setSubmissionStatus(null);
            }, 1500);
        }, 2000); // 2-second delay for the spinner
    } catch (error) {
      console.error("Report submission failed:", error);
      setSubmissionStatus('error');
    }
  };

  const handleCancelReport = (reportId) => {
    // The confirmation is now handled inside the modal.
    logAuditAction('Cancelled Report', { reportId }, 'resident');
    setUserReports(prevReports => prevReports.filter(report => report.id !== reportId));
  };

  const handleCertRequestSubmit = (requestData) => {
    const newRequest = {
      id: Date.now(),
      date: Date.now(),
      status: "Pending",
      type: requestData.type,
      purpose: requestData.purpose,
      requester: "Benjie Cabajar", // Placeholder for logged-in user
    };

    const currentRequests = JSON.parse(localStorage.getItem('certificationRequests')) || [];
    localStorage.setItem('certificationRequests', JSON.stringify([newRequest, ...currentRequests]));

    // Also create a notification for the moderator
    const modNotif = { id: Date.now() + 2, type: 'new_cert_request', message: `A new "${newRequest.type}" has been requested.`, requestId: newRequest.id, isRead: false, date: Date.now() };
    const currentModNotifs = JSON.parse(localStorage.getItem('moderatorNotifications')) || [];
    localStorage.setItem('moderatorNotifications', JSON.stringify([modNotif, ...currentModNotifs]));
    alert('Your request has been submitted!');
  };

  const handleOpenViewReports = () => {
    setIsViewReportsModalOpen(true);
    // Mark all report-related notifications as read when opening the modal
    const updatedNotifications = notifications.map(n => 
      n.type === 'report_update' ? { ...n, isRead: true } : n
    );
    setNotifications(updatedNotifications);
  };

  const handleOpenNotifications = () => {
    setIsNotificationModalOpen(true);
    // Mark all notifications as read when the modal is opened
    const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updatedNotifications);
    // The useEffect hook will save this change to localStorage
  };

  const handleClearNotifications = () => {
    if (window.confirm("Are you sure you want to clear all notifications?")) {
        setNotifications([]);
        localStorage.setItem('notifications', JSON.stringify([]));
    }
  };

  const handleDeleteNotification = (notificationId) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    }
  };

  const handleLogout = () => {
    console.log("Logging out...");
    navigate("/login");
  };

  // --- Image Preview Modal Logic (Moved from ViewReportsModal) ---
  const openImageModal = (allImages, index) => {
    setModalImages(allImages);
    setCurrentImageIndex(index);
    setIsImageModalOpen(true);
  };



  const closeImageModal = () => setIsImageModalOpen(false);

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % modalImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + modalImages.length) % modalImages.length);

  // --- Image Rendering Logic ---
  const renderPostImages = (postImages, onClickFunction) => {
    const totalImages = postImages.length;
    const visibleImages = totalImages > 3 ? postImages.slice(0, 3) : postImages;

    return (
      <div className={`update-images update-images-${Math.min(totalImages, 4)}`}>
        {visibleImages.map((img, index) => (
          <img
            src={img}
            alt={`post ${index}`}
            key={index}
            onClick={() => onClickFunction(postImages, index)}
          />
        ))}
        {totalImages >= 4 && (
          <div className="image-count-overlay" onClick={() => onClickFunction(postImages, 3)}>
            <span>+{totalImages - 3}</span>
          </div>
        )}
      </div>
    );
  };

  // --- Image Preview Modal Component ---
  const ImagePreviewModal = () => {
    if (!isImageModalOpen || modalImages.length === 0) return null;

    return (
      <div className="preview-modal-overlay" onClick={closeImageModal}>
        <div className="preview-modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={closeImageModal}><FaTimes /></button>
          <img src={modalImages[currentImageIndex]} alt={`Preview ${currentImageIndex + 1}`} className="modal-image" />
          {modalImages.length > 1 && (
            <>
              <button className="nav-btn prev-btn" onClick={prevImage}><FaChevronLeft size={30} /></button>
              <button className="nav-btn next-btn" onClick={nextImage}><FaChevronRight size={30} /></button>
            </>
          )}
          <div className="image-counter">
            {currentImageIndex + 1} of {modalImages.length}
          </div>
        </div>
      </div>
    );
  };

  // This is the same component from modal-view-reports, now rendered here
  const ReportImagePreviewModal = ({ isOpen, onClose, images, startIndex }) => {
    const [currentIndex, setCurrentIndex] = useState(startIndex);
    if (!isOpen) return null;

    const next = (e) => { e.stopPropagation(); setCurrentIndex(p => (p + 1) % images.length); };
    const prev = (e) => { e.stopPropagation(); setCurrentIndex(p => (p - 1 + images.length) % images.length); };

    return (
      <div className="preview-modal-overlay" onClick={onClose}>
        <button className="preview-close-btn" onClick={onClose}><FaTimes /></button>
        <img src={images[currentIndex]} alt={`Preview ${currentIndex + 1}`} className="modal-image" />
        {images.length > 1 && (
          <>
            <button className="nav-btn prev-btn" onClick={prev}><FaChevronLeft size={30} /></button>
            <button className="nav-btn next-btn" onClick={next}><FaChevronRight size={30} /></button>
          </>
        )}
      </div>
    );
  };

  return (
    <ThemeProvider>
      <div className="home-page">
      <ImagePreviewModal />
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onLogout={handleLogout}
      />

      <SettingModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        role="resident"
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setSubmissionStatus(null); // Reset status on close
        }}
        onSubmit={handleReportSubmit}
        submissionStatus={submissionStatus}
      />

      <ViewReportsModal
        isOpen={isViewReportsModalOpen}
        onClose={() => setIsViewReportsModalOpen(false)}
        reports={userReports}
        onCancelReport={handleCancelReport}
        onOpenImage={openImageModal}
      />

      <ReportImagePreviewModal
        isOpen={isImageModalOpen}
        onClose={closeImageModal}
        images={modalImages}
        startIndex={currentImageIndex}
      />

      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        notifications={notifications}
        onClear={handleClearNotifications}
        onDelete={handleDeleteNotification}
      />

      <RequestCertificationModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        onSubmit={handleCertRequestSubmit}
      />

      {/* ✅ Using your Header.jsx */}
      <Header/>

      <div className="content">
        {/* Left Sidebar */}
        <aside className="left-panel">
          <div className="side-buttons">
            <button className="sidebar-btn orange" onClick={() => setIsProfileModalOpen(true)}>
              <FaUser size={30} />
              <span>Profile</span>
            </button>

            <button className="sidebar-btn blue notification-bell-btn" onClick={handleOpenNotifications}>
              <FaBell size={30} />
              <span>Notifications</span>
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span className="notification-badge">{notifications.filter(n => !n.isRead).length}</span>
              )}
            </button>

            <button className="sidebar-btn teal" onClick={() => setIsCertModalOpen(true)}>
              <MdOutlineAssignment size={30} />
              <span>Request Certification</span>
            </button>

            <button className="sidebar-btn red" onClick={() => setIsReportModalOpen(true)}>
              <FaFileAlt size={30} />
              <span>File a Report</span>
            </button>

            <button className="sidebar-btn purple"
              onClick={handleOpenViewReports}>
              <FaClipboardList size={30} />
              <span>View and Track Reports</span>
              {notifications.filter(n => n.type === 'report_update' && !n.isRead).length > 0 && (
                <span className="notification-badge">{notifications.filter(n => n.type === 'report_update' && !n.isRead).length}</span>
              )}
            </button>


            <button className="sidebar-btn gray"
              onClick={() => setIsSettingsModalOpen(true)}>
              <FaCog size={30} />
              <span>Settings</span>
            </button>

            <button className="sidebar-btn soft-teal">
              <FaInfoCircle size={30} />
              <span>About Us</span>
            </button>
          </div>
        </aside>

        {/* Main Feed */}
        <main className="main-content">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div className="update-card" key={post.id}>
                <div className="post-header">
                  <img src={post.authorAvatar} alt="author avatar" className="author-avatar" />
                  <div className="post-info">
                    <span className="author-name">{post.author}</span>
                    <span className="post-time">{post.date}</span>
                  </div>
                  <button className="options-btn" title="Post Options">
                    <FaEllipsisH size={18} />
                  </button>
                </div>

                {post.title && <p className="update-title">{post.title}</p>}
                <p className="update-description">{post.description}</p>

                {post.images && post.images.length > 0 && renderPostImages(post.images, openImageModal)}

                <div style={{ borderTop: '1px solid #e5e7eb', margin: '15px 0 0 0' }}></div>

                <CommentSection postId={post.id} comments={post.comments || []} handleAddComment={handleAddComment} />
              </div>
            ))
          ) : (
            <div className="no-announcements">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                alt="No announcements"
                className="no-announcement-icon"
              />
              <h3>No Announcements Yet</h3>
              <p>Stay tuned! Updates from your barangay will appear here.</p>
            </div>
          )}
        </main>

        {/* Right Panel */}
        <aside className="right-panel">
          <div className="calendar-box">
            <h4>CALENDAR</h4>
            <Calendar value={date} onChange={setDate} />
          </div>

          <div className="events-box">
            <h4>UPCOMING EVENTS</h4>
            <div className="event-placeholder"></div>
            <div className="event-placeholder"></div>
          </div>
        </aside>
      </div>
    </div>
    </ThemeProvider>
  );
}

export default Home;
