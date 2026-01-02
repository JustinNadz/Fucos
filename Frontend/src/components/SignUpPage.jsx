import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiBarChart2,
  FiClock,
  FiTrendingUp,
  FiMail,
  FiLock,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiUser,
} from "react-icons/fi";
import { AuthContext } from "../contexts/AuthContext";

export default function SignUpPage() {
  const { signIn } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function submit(e) {
    e.preventDefault();
    if (!emailRegex.test(email.trim())) {
      setNotification("Please enter a valid email address.");
      return;
    }

    // Simulate registration
    setNotification("You are registered! Please sign in.");
    setTimeout(() => {
      navigate("/sign-in");
    }, 3000);
  }

  return (
    <div className="auth-page-dark">
      {/* Left: Dark Hero Section */}
      <div className="auth-hero-dark">
        <div className="hero-logo-dark">FOCUS.</div>
        <h1 className="hero-title">
          One task at a time.
          <br />
          <span className="hero-accent">Build your streak.</span>
        </h1>
        <p className="hero-desc">
          A minimal productivity timer designed for deep work sessions. Perfect
          for students and knowledge workers.
        </p>

        <div className="hero-features-dark">
          <div className="feature-dark">
            <div className="feature-icon track">
              <FiBarChart2 />
            </div>
            <div className="feature-text">
              <div className="feature-title">Track your progress</div>
              <div className="feature-sub">
                Build daily streaks and monitor your focus time
              </div>
            </div>
          </div>
          <div className="feature-dark">
            <div className="feature-icon pomodoro">
              <FiClock />
            </div>
            <div className="feature-text">
              <div className="feature-title">Pomodoro technique</div>
              <div className="feature-sub">
                Proven time management method for better focus
              </div>
            </div>
          </div>
          <div className="feature-dark">
            <div className="feature-icon analytics">
              <FiTrendingUp />
            </div>
            <div className="feature-text">
              <div className="feature-title">Analytics & insights</div>
              <div className="feature-sub">
                Visualize your productivity patterns
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Auth Card */}
      <div className="auth-card-wrap-dark">
        <form className="auth-card-dark" onSubmit={submit}>
          <h2>Create account</h2>
          <p className="auth-subtitle">Start your focus journey today</p>

          {notification && (
            <div className="notification text-green-500 mb-4">
              {notification}
            </div>
          )}

          <label className="auth-label">Full Name</label>
          <div className="input-with-icon">
            <FiUser className="input-icon" />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="auth-input"
              required
            />
          </div>

          <label className="auth-label">Email address</label>
          <div className="input-with-icon">
            <FiMail className="input-icon" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="auth-input"
              required
            />
          </div>

          <label className="auth-label">Password</label>
          <div className="input-with-icon">
            <FiLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="auth-input"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          <button className="auth-submit" type="submit">
            Create Account <FiArrowRight />
          </button>

          <div className="auth-divider">Or</div>

          <button
            type="button"
            className="auth-guest"
            onClick={() => {
              signIn({ name: "Guest", email: "" });
              navigate(from, { replace: true });
            }}
          >
            Continue as Guest
          </button>

          <p className="auth-footer">
            Already have an account?{" "}
            <button
              type="button"
              className="auth-link-btn"
              onClick={() => navigate("/sign-in")}
            >
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
