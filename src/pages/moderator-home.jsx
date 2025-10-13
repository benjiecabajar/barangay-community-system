import React, { useState, useEffect } from "react";
import Calendar from "react-calendar"; 
import { useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import "../styles/moderator-home.css";
// Import only icons needed in ModeratorHome (sidebar, posts, modals, etc.)
import { FaUser, FaBullhorn, FaFileAlt, FaHeadset, FaInfoCircle, FaCog, FaTimes, FaChevronLeft, FaChevronRight, FaEllipsisH, FaBell } from "react-icons/fa";
import { MdOutlineAssignment } from "react-icons/md"; 
import "../styles/m-create-post.css";
import ReviewReportModal from "../components/m-review-report.jsx"; // Import the new modal
import PostModal from "../components/m-create-post.jsx";
import NotificationModal from "../components/modal-notification.jsx";
// Import the new Header component
import Header from "../components/header.jsx"; 
import ProfileModal from "../components/modal-profile.jsx";
import SettingModal from "../components/modal-settings.jsx";
import { ThemeProvider } from "../components/ThemeContext";

// =========================================================
// Comment Section Component
// Hides comments beyond the last 3 automatically on load
// =========================================================
const CommentSection = ({ postId, comments, handleAddComment }) => {
    const [newComment, setNewComment] = useState("");
    const [showAllComments, setShowAllComments] = useState(false); 

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            handleAddComment(postId, newComment);
            setNewComment("");
            // Do NOT auto-expand on new comment; keep default collapsed
        }
    };

    // Decide which comments to display
    const commentsToDisplay = showAllComments 
        ? comments 
        : comments.slice(-3);

    const hasMoreComments = comments.length > 3;

    return (
        <div className="comment-section">
            <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563', marginTop: '15px' }}>
                Comments ({comments.length})
            </h5>

            {/* Show "View more" if more than 3 comments and not expanded */}
            {hasMoreComments && !showAllComments && (
                <button 
                    onClick={() => setShowAllComments(true)}
                    className="view-more-comments-btn show"
                    style={{ color: '#2563eb' }}
                >
                    View more {comments.length - 3} comments...
                </button>
            )}

            {/* Comments */}
            <div className="comments-list">
                {commentsToDisplay.map((comment, index) => (
                    <div 
                        key={index} 
                        className="comment" 
                        style={{ 
                            display: 'flex', 
                            gap: '10px', 
                            marginBottom: '10px',
                            padding: '8px 0'
                        }}
                    >
                        <img 
                            src={comment.authorAvatar} 
                            alt="avatar" 
                            style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} 
                        />
                        <div>
                            <span style={{ fontWeight: '600', fontSize: '13px', color: '#111827' }}>
                                {comment.author} 
                            </span>
                            <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '8px' }}>
                                {comment.date}
                            </span>
                            <p style={{ margin: '0', fontSize: '14px', lineHeight: '1.4', color: '#374151' }}>
                                {comment.text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Hide button when expanded */}
            {hasMoreComments && showAllComments && (
                <button 
                    onClick={() => setShowAllComments(false)}
                    className="view-more-comments-btn hide"
                    style={{ color: '#6b7280' }}
                >
                    Hide comments
                </button>
            )}

            {/* Add comment form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <input
                    type="text"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    style={{
                        flexGrow: 1,
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                    }}
                />
                <button 
                    type="submit" 
                    disabled={!newComment.trim()}
                    style={{
                        padding: '8px 15px',
                        borderRadius: '8px',
                        border: 'none',
                        background: newComment.trim() ? '#2563eb' : '#9ca3af',
                        color: 'white',
                        fontWeight: '600',
                        cursor: newComment.trim() ? 'pointer' : 'not-allowed',
                    }}
                >
                    Post
                </button>
            </form>
        </div>
    );
};

// =========================================================
// Main Content Feed Component
// =========================================================
const MainContentFeed = ({ posts, handleDeletePost, renderPostImages, openImageModal, handleAddComment }) => {
    return (
        <main className="main-content">
            {/* Posts Feed - Social Media Style */}
            {posts.map((post) => (
                <div className="update-card" key={post.id}>
                    <div className="post-header">
                        <img src={post.authorAvatar} alt="n/a" className="author-avatar" />
                        <div className="post-info">
                            <span className="author-name">{post.author}</span>
                            <span className="post-time">{post.date}</span>
                        </div>
                        <button className="options-btn" title="Post Options">
                            <FaEllipsisH size={18} />
                        </button>
                        <button 
                            className="delete-post-btn" 
                            onClick={() => handleDeletePost(post.id)}
                            title="Delete Post"
                        >
                            <FaTimes size={18} />
                        </button>
                    </div>
                    
                    {post.title && <p className="update-title">{post.title}</p>}
                    <p className="update-description">{post.description}</p>

                    {post.images && post.images.length > 0 && renderPostImages(post.images, openImageModal)}

                    {/* Comment Section Divider */}
                    <div style={{ borderTop: '1px solid #e5e7eb', margin: '15px 0 0 0' }}></div>
                    
                    {/* Comment Section */}
                    <CommentSection
                        postId={post.id}
                        comments={post.comments}
                        handleAddComment={handleAddComment}
                    />
                </div>
            ))}
            
            {posts.length === 0 && (
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
    );
};


// =========================================================
// Main ModeratorHome Component
// =========================================================
function ModeratorHome() { 
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const [date, setDate] = useState(new Date());

    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
    const [moderatorNotifications, setModeratorNotifications] = useState(() => JSON.parse(localStorage.getItem('moderatorNotifications')) || []);
    const [isReviewReportModalOpen, setIsReviewReportModalOpen] = useState(false);
    const [allReports, setAllReports] = useState(() => JSON.parse(localStorage.getItem('userReports')) || []);

    // State for Image Preview Modal (for existing posts)
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [modalImages, setModalImages] = useState([]);

    // Load data and listen for changes
    useEffect(() => {
        const loadData = () => {
            setPosts(JSON.parse(localStorage.getItem("announcements")) || []);
            setAllReports(JSON.parse(localStorage.getItem("userReports")) || []);
            setModeratorNotifications(JSON.parse(localStorage.getItem("moderatorNotifications")) || []);
        };
        loadData();

        const handleStorageChange = (e) => {
            if (['announcements', 'userReports', 'moderatorNotifications'].includes(e.key)) {
                loadData();
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handlePost = () => {
        if (title.trim() || description.trim()) {
            const newPost = {
                id: Date.now(),
                title,
                description,
                images,
                author: "Community Moderator", 
                authorAvatar: "https://via.placeholder.com/48/2563eb/ffffff?text=M",
                date: new Date().toLocaleString(),
                comments: [], // Initialize comments array
            };
            setPosts([newPost, ...posts]);

            // Create a notification for the new announcement
            const notif = {
                id: Date.now(),
                type: 'new_announcement',
                message: `A new announcement has been posted: "${title || description.slice(0, 30) + '...'}"`,
                postId: newPost.id,
                isRead: false,
                date: Date.now()
            };
            const currentNotifs = JSON.parse(localStorage.getItem('notifications')) || [];
            localStorage.setItem('notifications', JSON.stringify([notif, ...currentNotifs]));

            // Reset form fields after successful post
            setTitle("");
            setDescription("");
            setImages([]);
        }
    };
    
    // Save posts to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("announcements", JSON.stringify(posts));
    }, [posts]);

    // --- Post Handlers ---
    const handleImageChange = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files).map((file) =>
                URL.createObjectURL(file)
            );
            setImages(filesArray);
        }
    };

    const handleDeletePost = (postId) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            setPosts(posts.filter(post => post.id !== postId));
        }
    };

    const handleDeleteReport = (reportId) => {
        if (window.confirm("Are you sure you want to permanently delete this report?")) {
            const updatedReports = allReports.filter(report => report.id !== reportId);
            setAllReports(updatedReports);
        }
    };

    const handleUpdateReportStatus = (reportId, newStatus) => {
        let reportToUpdate;
        const updatedReports = allReports.map(report => {
            if (report.id === reportId) {
                reportToUpdate = { ...report, status: newStatus };
                return reportToUpdate;
            }
            return report;
        });
        setAllReports(updatedReports);
        localStorage.setItem("userReports", JSON.stringify(updatedReports));

        // Create a notification for the report update
        const notif = {
            id: Date.now(),
            type: 'report_update',
            message: `Your report "${reportToUpdate.type}" has been updated to "${newStatus}".`,
            reportId: reportId,
            isRead: false,
            date: Date.now()
        };
        const currentNotifs = JSON.parse(localStorage.getItem('notifications')) || [];
        localStorage.setItem('notifications', JSON.stringify([notif, ...currentNotifs]));
    };

    const handleOpenNotifications = () => {
        setIsNotificationModalOpen(true);
        // Mark all notifications as read when the modal is opened
        const updatedNotifications = moderatorNotifications.map(n => ({ ...n, isRead: true }));
        setModeratorNotifications(updatedNotifications);
        localStorage.setItem('moderatorNotifications', JSON.stringify(updatedNotifications));
    };

    const handleClearNotifications = () => {
        if (window.confirm("Are you sure you want to clear all notifications?")) {
            setModeratorNotifications([]);
            localStorage.setItem('moderatorNotifications', JSON.stringify([]));
        }
    };


    const handleLogout = () => {
        // For now, just navigate to login. In a real app, you'd clear tokens/session state.
        console.log("Logging out...");
        navigate("/login");
    };

    // --- Comment Handler ---
    const handleAddComment = (postId, commentText) => {
        const newComment = {
            author: "User/Resident Placeholder", 
            authorAvatar: "https://via.placeholder.com/30/cccccc/ffffff?text=U",
            date: new Date().toLocaleString(),
            text: commentText,
        };

        setPosts(prevPosts => 
            prevPosts.map(post => 
                post.id === postId 
                    ? { ...post, comments: [...post.comments, newComment] }
                    : post
            )
        );
    };

    // --- Image Preview Modal Logic (for existing posts) ---
    const openImageModal = (allImages, index) => {
        setModalImages(allImages);
        setCurrentImageIndex(index);
        setIsImageModalOpen(true);
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false);
    };

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => 
            (prevIndex + 1) % modalImages.length
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex - 1 + modalImages.length) % modalImages.length
        );
    };
    
    // --- Image Rendering Logic (for posts in feed) ---
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
                    <div 
                        className="image-count-overlay"
                        onClick={() => onClickFunction(postImages, 3)}
                    >
                        <span>+{totalImages - 3}</span>
                    </div>
                )}
            </div>
        );
    };

    // --- Image Rendering Logic (for post modal preview) ---
    const renderPreviewImages = (previewImages) => {
        const totalImages = previewImages.length;
        return (
            <div className={`preview-images preview-images-${Math.min(totalImages, 4)}`}>
                {previewImages.slice(0, 4).map((img, index) => (
                    <img src={img} alt={`preview ${index}`} key={index} />
                ))}
                {previewImages.length > 4 && (
                    <div className="preview-count-overlay">
                        <span>+{previewImages.length - 4}</span>
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
                    <button className="preview-close-btn" onClick={closeImageModal}><FaTimes /></button>
                    
                    <img 
                        src={modalImages[currentImageIndex]} 
                        alt={`Preview ${currentImageIndex + 1}`} 
                        className="modal-image"
                    />

                    {modalImages.length > 1 && (
                        <>
                            <button className="nav-btn prev-btn" onClick={prevImage}>
                                <FaChevronLeft size={30} />
                            </button>
                            <button className="nav-btn next-btn" onClick={nextImage}>
                                <FaChevronRight size={30} />
                            </button>
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
      <ThemeProvider>
        <div className="moderator-page">
            <ImagePreviewModal />
            <ProfileModal 
              isOpen={isProfileModalOpen}
              onClose={() => setIsProfileModalOpen(false)}
              onLogout={handleLogout}
            />

            <PostModal 
                isOpen={isPostModalOpen}
                onClose={() => setIsPostModalOpen(false)}
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                images={images}
                setImages={setImages}
                handlePost={handlePost}
                handleImageChange={handleImageChange}
                renderPreviewImages={renderPreviewImages}
            />

            <SettingModal
             isOpen={isSettingsModalOpen}
             onClose={() => setIsSettingsModalOpen(false)}
            />

            <ReviewReportModal
                isOpen={isReviewReportModalOpen}
                onClose={() => setIsReviewReportModalOpen(false)}
                reports={allReports}
                onUpdateReportStatus={handleUpdateReportStatus}
                onDeleteReport={handleDeleteReport}
            />

            <NotificationModal
                isOpen={isNotificationModalOpen}
                onClose={() => setIsNotificationModalOpen(false)}
                notifications={moderatorNotifications}
                onClear={handleClearNotifications}
            />


            {/* Use the new Header Component */}
            <Header /> 

            <div className="content">
                {/* Left Sidebar */}
                <aside className="m-left-panel">
                    <div className="m-side-buttons">
                        <button
                            className="m-sidebar-btn orange"
                            onClick={() => setIsProfileModalOpen(true)}
                        >
                            <FaUser size={30} />
                            <span>Profile</span>
                        </button>

                        <button className="m-sidebar-btn blue notification-bell-btn" onClick={handleOpenNotifications}>
                            <FaBell size={30} />
                            <span>Notifications</span>
                            {moderatorNotifications.filter(n => !n.isRead).length > 0 && (
                                <span className="notification-badge">{moderatorNotifications.filter(n => !n.isRead).length}</span>
                            )}
                        </button>

                        <button 
                            className="m-sidebar-btn blue" 
                            onClick={() => setIsPostModalOpen(true)}
                        >
                            <FaBullhorn size={30} />
                            <span>Create Announcement</span>
                        </button>
                        
                        <button className="m-sidebar-btn teal">
                            <MdOutlineAssignment size={30} />
                            <span>Certification Requests</span>
                        </button>

                        <button 
                            className="m-sidebar-btn red"
                            onClick={() => setIsReviewReportModalOpen(true)}
                        >
                            <FaFileAlt size={30} />
                            <span>Resident Reports</span>
                        </button>
                        
                        <button className="m-sidebar-btn green">
                            <FaHeadset size={30} />
                            <span>Support</span>
                        </button>

                        <button className="m-sidebar-btn gray"
                            onClick={() => setIsSettingsModalOpen(true)}
                        >
                            <FaCog size={30} />
                            <span>Settings</span>
                        </button>

                        <button className="m-sidebar-btn soft-teal">
                            <FaInfoCircle size={30} />
                            <span>About Us</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content Feed Component */}
                <MainContentFeed
                    posts={posts}
                    handleDeletePost={handleDeletePost}
                    renderPostImages={renderPostImages}
                    openImageModal={openImageModal}
                    handleAddComment={handleAddComment}
                />

                {/* Right Sidebar */}
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

export default ModeratorHome;