import React from "react";
// 1. IMPORT the image file
// Adjust the path to where your logo.png is actually located
import logoImage from "../assets/logo.png"; 
import "../styles/header.css";

// All the unnecessary and problematic icon imports have been removed.

const Header = ({ username = "{Moderator}", logoText = "EaseBarangay" }) => {
    // 2. Use the imported variable directly instead of the placeholder URL
    const logoImageUrl = logoImage; 

    return (
        // Top bar
        <header className="top-bar">
            <div className="logo">
                {/* Image added next to the logoText */}
                <img
                    // 3. Set the src to the variable holding the imported image
                    src={logoImageUrl}
                    alt="EaseBarangay Logo" 
                    className="logo-icon" // You can use this class for styling
                />
                {logoText}
            </div>
            <h2 className="updates-title"></h2>
            <div className="user-info">
                <span className="username">{username}</span>
                <img
                    src="https://via.placeholder.com/40"
                    alt="Moderator avatar"
                    className="avatar"
                />
            </div>
        </header>
    );
};

export default Header;