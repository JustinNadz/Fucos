import React, { useContext, useState, useRef } from "react";
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
  const [notification, setNotification] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const toastTimeout = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function handleTabChange(signUp) {
    setIsSignUp(signUp);
    setNotification(null);
    setShowToast(false);
    if (!signUp) setName("");
  }

  async function submit(e) {
    e.preventDefault();
    if (!emailRegex.test(email.trim())) {
      setNotification("Please enter a valid email address.");
      setShowToast(true);
      clearTimeout(toastTimeout.current);
      toastTimeout.current = setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (isSignUp) {
      try {
        setNotification(null);
        await signUp({ name: name.trim(), email: email.trim(), password });
        setNotification("Account created! You are signed in.");
        setShowToast(true);
        clearTimeout(toastTimeout.current);
        toastTimeout.current = setTimeout(() => setShowToast(false), 3000);
        // After successful signup, user is authenticated via context - navigate
        navigate(from, { replace: true });
      } catch (err) {
        setNotification(err.message || "Registration failed");
        setShowToast(true);
        clearTimeout(toastTimeout.current);
        toastTimeout.current = setTimeout(() => setShowToast(false), 3000);
      }
      return;
    }

    try {
      await signIn({ email: email.trim(), password });
      setNotification("Signed in successfully!");
      setShowToast(true);
      clearTimeout(toastTimeout.current);
      toastTimeout.current = setTimeout(() => setShowToast(false), 3000);
      navigate(from, { replace: true });
    } catch (err) {
      setNotification(err.message || "Sign in failed");
      setShowToast(true);
      clearTimeout(toastTimeout.current);
      toastTimeout.current = setTimeout(() => setShowToast(false), 3000);
    }
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
        {/* Toast Notification */}
        {showToast && (
          <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg font-medium flex items-center gap-2">
              <FiCheck className="mr-2" />
              {notification}
            </div>
          </div>
        )}
        <form className="auth-card-dark" onSubmit={submit}>
          <h2>{isSignUp ? "Create account" : "Welcome back"}</h2>
          <p className="auth-subtitle">
            {isSignUp
              ? "Start your focus journey today"
              : "Continue your focus journey"}
          </p>

          {isSignUp && (
            <div>
              <label className="auth-label">Full Name</label>
              <div className="input-with-icon">
                <FiUser className="input-icon" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="auth-input"
                  required={isSignUp}
                />
              </div>
            </div>
          )}

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

          <div style={{ visibility: !isSignUp ? "visible" : "hidden" }}>
            <div className="auth-options">
              <label className="checkbox-label">
                <input type="checkbox" className="checkbox" />
                Remember me
              </label>
              <a href="#" className="forgot-link">
                Forgot password?
              </a>
            </div>
          </div>

          <button className="auth-submit" type="submit">
            {isSignUp ? "Create Account" : "Sign in"} <FiArrowRight />
          </button>

          <div className="auth-divider">Or</div>

          <button
            type="button"
            className="auth-guest"
            onClick={() => {
              guestLogin();
              navigate(from, { replace: true });
            }}
          >
            Continue as Guest
          </button>

          <p className="auth-footer">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              className="auth-link-btn"
              onClick={() => handleTabChange(!isSignUp)}
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
