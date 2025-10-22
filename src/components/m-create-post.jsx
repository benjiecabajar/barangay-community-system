import React from "react";
import { FaTimes } from "react-icons/fa";
import "../styles/moderator-home.css";
import "../styles/m-create-post.css";

const PostModal = ({
  isOpen,
  onClose,
  title,
  setTitle,
  description,
  setDescription,
  images,
  setImages,
  handlePost,
  handleImageChange,
  renderPreviewImages,
  editingPost, // Add editingPost to props
}) => {
  if (!isOpen) return null;

  // This function resets the form fields and closes the modal.
  const handleClose = () => {
    setTitle("");
    setDescription("");
    setImages([]);
    onClose();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handlePost(); // This now handles both create and update
    // onClose is called inside handlePost after logic is complete
  };

  return (
    <div className="post-modal-overlay" onClick={handleClose}>
      <div
        className="post-modal-content post-form"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{editingPost ? "Edit Announcement" : "Create new Announcement"}</h2>
          <button className="close-btn" onClick={handleClose}>
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            placeholder="Add a title (Optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required={false}
          />
          <textarea
            placeholder="Write something for the residents..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>

          <label htmlFor="file-upload" className="file-upload-label">
            <FaTimes style={{ visibility: "hidden" }} />
            <span style={{ flexGrow: 1, textAlign: "center" }}>Upload Image(s)</span>
            <input id="file-upload" type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display: "none" }} />
            <FaTimes style={{ transform: "rotate(45deg)" }} />
          </label>

          {images.length > 0 && renderPreviewImages(images)}

          <button type="submit" disabled={!description.trim()}>
            {editingPost ? "Save Changes" : "Post Announcement"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostModal;