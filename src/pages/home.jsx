// pages/Home.jsx

import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/home.css";
import {
  FaUser,
  FaCog,
  FaFileAlt,
  FaHeadset,
  FaInfoCircle,
  FaBell,
} from "react-icons/fa";
import { MdOutlineAssignment } from "react-icons/md";
import Header from "../components/header.jsx";

function Home() {
  const [date, setDate] = useState(new Date());
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});

  // ✅ Load posts from localStorage (from Moderator side)
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("announcements")) || [];
    setPosts(saved);
  }, []);

  // ✅ Handle comments
  const handleAddComment = (idx) => {
    if (!commentText[idx]) return;

    const updatedPosts = [...posts];
    if (!updatedPosts[idx].comments) updatedPosts[idx].comments = [];
    updatedPosts[idx].comments.push(commentText[idx]);

    setPosts(updatedPosts);
    localStorage.setItem("announcements", JSON.stringify(updatedPosts));
    setCommentText({ ...commentText, [idx]: "" });
  };

  return (
    <div className="home-page">
      {/* ✅ Using your Header.jsx */}
      <Header/>

      <div className="content">
        {/* Left Sidebar */}
        <aside className="left-panel">
          <div className="side-buttons">
            <button className="sidebar-btn orange">
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
            posts.map((post, idx) => (
              <div key={idx} className="update-card">
                <h3 className="update-title">{post.title || "Untitled Post"}</h3>
                <p className="update-date">{post.date}</p>
                <p className="update-description">{post.text}</p>

                {post.image && (
                  <img
                    src={post.image}
                    alt="Announcement"
                    className="update-image"
                  />
                )}

                {/* Comments */}
                <div className="comment-section">
                  <h4>Comments</h4>
                  {post.comments && post.comments.length > 0 ? (
                    post.comments.map((c, i) => (
                      <p key={i} className="comment">
                        {c}
                      </p>
                    ))
                  ) : (
                    <p>No comments yet.</p>
                  )}
                  <div className="comment-input">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentText[idx] || ""}
                      onChange={(e) =>
                        setCommentText({ ...commentText, [idx]: e.target.value })
                      }
                    />
                    <button onClick={() => handleAddComment(idx)}>Post</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-announcement">
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
