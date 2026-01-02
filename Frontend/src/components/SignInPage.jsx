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

export default function SignInPage() {
  const { signIn, signUp, guestLogin } = useContext(AuthContext);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  async function submit(e) {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        if (!name.trim()) {
          setError("Name is required");
          setLoading(false);
          return;
        }
        await signUp({ name: name.trim(), email: email.trim(), password });
      } else {
        await signIn({ email: email.trim(), password });
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleGuestLogin() {
    await guestLogin();
    navigate(from, { replace: true });
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
          <h2>{isSignUp ? "Create account" : "Welcome back"}</h2>
          <p className="auth-subtitle">
            {isSignUp
              ? "Start your focus journey today"
              : "Continue your focus journey"}
          </p>

          <div className="auth-tabs-dark">
            <button
              type="button"
              className={`tab-dark ${!isSignUp ? "active" : ""}`}
              onClick={() => setIsSignUp(false)}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`tab-dark ${isSignUp ? "active" : ""}`}
              onClick={() => setIsSignUp(true)}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div style={{ color: "#ef4444", marginBottom: "1rem", fontSize: "0.875rem" }}>
              {error}
            </div>
          )}

          {isSignUp && (
            <>
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
            </>
          )}

          <label className="auth-label">Email address</label>
          <div className="input-with-icon">
            <FiMail className="input-icon" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="auth-input"
              type="email"
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

          <div className="auth-options">
            <label className="checkbox-label">
              <input type="checkbox" className="checkbox" />
              Remember me
            </label>
            <a href="#" className="forgot-link">
              Forgot password?
            </a>
          </div>

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign in"}{" "}
            {!loading && <FiArrowRight />}
          </button>

          <div className="auth-divider">Or</div>

          <button
            type="button"
            className="auth-guest"
            onClick={handleGuestLogin}
          >
            Continue as Guest
          </button>

          <p className="auth-footer">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              className="auth-link-btn"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
