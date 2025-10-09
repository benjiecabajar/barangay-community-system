// pages/Home.jsx

import React, { useState, useEffect } from "react";
import Calendar from "react-calendar"; 
import { useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import "../styles/home.css";
import {
  FaUser,
  FaCog,
  FaFileAlt,
  FaHeadset,
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

  // State for Image Preview Modal
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalImages, setModalImages] = useState([]);

  const navigate = useNavigate();

  // ✅ Load posts from localStorage (from Moderator side)
  useEffect(() => {
    const loadPosts = () => {
      const saved = JSON.parse(localStorage.getItem("announcements")) || [];
      setPosts(saved);
    };

    loadPosts(); // Initial load

    // Listen for changes in localStorage from other tabs
    const handleStorageChange = (e) => {
      if (e.key === "announcements") {
        loadPosts();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []); // Empty dependency array ensures this runs only once on mount

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

  const handleLogout = () => {
    console.log("Logging out...");
    navigate("/login");
  };

  // --- Image Preview Modal Logic ---
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

  return (
    <div className="home-page">
      <ImagePreviewModal />
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onLogout={handleLogout}
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

            <button className="sidebar-btn blue">
              <FaBell size={30} />
              <span>Notifications</span>
            </button>

            <button className="sidebar-btn teal">
              <MdOutlineAssignment size={30} />
              <span>Request Certification</span>
            </button>

            <button className="sidebar-btn red">
              <FaFileAlt size={30} />
              <span>File a Report</span>
            </button>

            <button className="sidebar-btn green">
              <FaHeadset size={30} />
              <span>Contact Us</span>
            </button>

            <button className="sidebar-btn gray">
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
  );
}

export default Home;
