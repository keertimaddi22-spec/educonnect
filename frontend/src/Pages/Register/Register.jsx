import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "../../Components/Popup/Popup";
import "../Auth/Auth.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGraduate,
  faChalkboardTeacher,
} from "@fortawesome/free-solid-svg-icons";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const [popup, setPopup] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !role) {
      setPopup("Please fill all fields ❌");
      return;
    }

    try {
      const res = await fetch(
        "https://educonnect-q5og.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, role }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setPopup(data.message);
        return;
      }

      setPopup("Registered successfully ✅");

      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setPopup("Server error ❌");
    }
  };

  return (
    <div className="signup-wrapper">
      <h1 className="app-name">EduConnect</h1>

      <div className="signup-box">
        <div className="signup-image">
          <div className="avatar">
            {role === "teacher" ? (
              <FontAwesomeIcon icon={faChalkboardTeacher} />
            ) : (
              <FontAwesomeIcon icon={faUserGraduate} />
            )}
          </div>
        </div>

        <form className="signup-form" onSubmit={handleRegister}>
          <h2>Register</h2>

          <input
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="role-buttons">
            <button
              type="button"
              className={role === "student" ? "active-role" : ""}
              onClick={() => setRole("student")}
            >
              Student
            </button>

            <button
              type="button"
              className={role === "teacher" ? "active-role" : ""}
              onClick={() => setRole("teacher")}
            >
              Teacher
            </button>
          </div>

          <button type="submit">Register</button>

          <div className="auth-switch">
            <span>Already have an account?</span>

            <span
              className="auth-link"
              onClick={() => {
                document.body.classList.add("page-out");

                setTimeout(() => {
                  navigate("/");
                  document.body.classList.remove("page-out");
                }, 250);
              }}
            >
              Login
            </span>
          </div>
        </form>
      </div>

      {popup && <Popup message={popup} onClose={() => setPopup("")} />}
    </div>
  );
}

export default Register;
