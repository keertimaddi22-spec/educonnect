import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "../../Components/Popup/Popup";
import "../Auth/Auth.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

function Login() {
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [popup, setPopup] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPopup(data.message || "Login failed ❌");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", data.user.email);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("name", data.user.name);

      setFadeOut(true);

      setTimeout(() => navigate("/dashboard"), 500);
    } catch (err) {
      setPopup("Server error ❌");
      setLoading(false);
    }
  };

  return (
    <div className={`login-wrapper ${fadeOut ? "fade-out" : ""}`}>
      {!showForm && <h1 className="app-name">EduConnect</h1>}

      {showForm && (
        <div className="login-box">
          <div className="login-image">
            <div className="avatar">
              <FontAwesomeIcon icon={faUser} />
            </div>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <h2>Login</h2>

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

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="auth-switch">
              <span>Don't have an account?</span>

              <span
                className="auth-link"
                onClick={() => {
                  document.body.classList.add("page-out");

                  setTimeout(() => {
                    navigate("/register");
                    document.body.classList.remove("page-out");
                  }, 250);
                }}
              >
                Register
              </span>
            </div>
          </form>
        </div>
      )}

      {popup && <Popup message={popup} onClose={() => setPopup("")} />}
    </div>
  );
}

export default Login;
