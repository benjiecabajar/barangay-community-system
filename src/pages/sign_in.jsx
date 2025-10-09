import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";
import "../styles/sign_in.css";
import "@fontsource/poppins";

export default function SignIn() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "", 
    gender: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    barangay: "",
  });

  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState("");
  // NEW STATE: Tracks if the user has manually changed the username
  const [isUsernameCustom, setIsUsernameCustom] = useState(false); 

  const barangays = [
    "Balacanas",
    "Dayawan",
    "Imelda",
    "Katipunan",
    "Kimaya",
    "Looc",
    "Poblacion 1",
    "Poblacion 2",
    "Poblacion 3",
    "San Martin",
    "Tambobong",
  ];

  // Function to validate the email format 
  const validateEmail = (email) => 
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const suggestUsername = (first, last) => {
    // Basic suggestion: lowercase first initial + full last name
    // Remove spaces and convert to lowercase for username format
    const cleanedFirst = first.trim().toLowerCase();
    const cleanedLast = last.trim().toLowerCase().replace(/\s/g, '');

    if (cleanedFirst && cleanedLast) {
      return `${cleanedFirst.charAt(0)}${cleanedLast}`; // e.g., jsmith
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear errors and notifications
    setErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
    setNotification("");
    
    let newForm = { ...form, [name]: value };

    // 1. Handle Username Suggestion Logic
    if (name === "firstName" || name === "lastName") {
        // Only suggest if the user hasn't entered a custom username
        if (!isUsernameCustom) {
            const suggested = suggestUsername(
                name === 'firstName' ? value : form.firstName,
                name === 'lastName' ? value : form.lastName
            );
            newForm.username = suggested;
        }
    } else if (name === "username") {
        // If the user types anything into the username field, mark it as custom
        if (value) {
            setIsUsernameCustom(true);
        } else {
            // If they delete it, reset the custom flag and suggest a name
            setIsUsernameCustom(false);
            const suggested = suggestUsername(form.firstName, form.lastName);
            newForm.username = suggested;
        }
    }

    setForm(newForm);

    // 2. Handle Live Email validation
    if (name === "email") {
      if (value && !validateEmail(value)) {
        setErrors((prevErrors) => ({ ...prevErrors, email: "invalid" }));
        setNotification("Please enter a valid email address (e.g., example@domain.com).");
      } else {
        setErrors((prevErrors) => {
          const { email, ...rest } = prevErrors;
          return rest;
        });
      }
    }
  };

  /**
   * PASSWORD VALIDATION:
   * Requires a minimum of 6 characters.
   */
  const validatePassword = (password) => 
    /^.{6,}$/.test(password); 

  const handleSubmit = () => {
    let newErrors = {};
    let currentNotification = "";

    // 1. Check empty fields
    Object.keys(form).forEach((key) => {
      if (!form[key]) newErrors[key] = true; 
    });
    
    // 2. Email validation
    if (form.email && !validateEmail(form.email)) {
        newErrors.email = "invalid";
        currentNotification = "Please enter a valid email address (e.g., example@domain.com).";
    }

    // 3. Date of Birth (DOB) Validation: Check if DOB is in the future
    if (form.dob) {
      const selectedDate = new Date(form.dob);
      const today = new Date();
      today.setHours(0, 0, 0, 0); 

      if (selectedDate > today) {
        newErrors.dob = "future";
        currentNotification = "Date of Birth cannot be in the future.";
      }
    }

    // 4. Password validation
    if (form.password && !validatePassword(form.password)) {
      newErrors.password = true;
      currentNotification =
        "Password must be at least 6 characters long.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = true;
      currentNotification = "Passwords do not match.";
    }

    // 5. Set general notification for empty fields only if no other specific error message has been set
    if (Object.keys(newErrors).some(key => newErrors[key] === true) && !currentNotification) {
      currentNotification = "Please fill in all required fields!";
    }

    setNotification(currentNotification);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Form submitted:", form);
    navigate("/resident");
  };

  return (
    <div className="sign-page">
      <div className="sign-box">
        <h1>Sign in</h1>
        <h2>___</h2>
        <h3>Fill up information</h3>

        <div className="info-inputs">
          <div className="name-column">
            <input
              name="firstName"
              placeholder="First name"
              value={form.firstName}
              onChange={handleChange}
              className={errors.firstName ? "error-input" : ""}
            />
            <input
              name="lastName"
              placeholder="Last name"
              value={form.lastName}
              onChange={handleChange}
              className={errors.lastName ? "error-input" : ""}
            />
          </div>

          <div className="extra-info">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className={errors.dob ? "error-input" : ""} 
            />

            <label>Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className={errors.gender ? "error-input" : ""}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className={errors.email ? "error-input" : ""}
          />
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className={errors.username ? "error-input" : ""}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className={errors.password ? "error-input" : ""}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? "error-input" : ""}
          />

          <select
            name="barangay"
            value={form.barangay}
            onChange={handleChange}
            className={errors.barangay ? "error-input" : ""}
          >
            <option value="">Select Barangay</option>
            {barangays.map((brgy, index) => (
              <option key={index} value={brgy}>
                {brgy}
              </option>
            ))}
          </select>
        </div>

        {notification && <p className="notification">{notification}</p>}

        <button className="signin-btn" onClick={handleSubmit}>
          Sign in
        </button>

        <p className="signup-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}