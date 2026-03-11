// ============ IMPORTS ============
// useState — React hook to create state variables inside components
import { useState } from "react";
// useNavigate — hook to redirect user to other pages programmatically
// Link — component that renders an <a> tag for client-side navigation
import { useNavigate, Link } from "react-router-dom";
// loginUser — API call function that sends email/password to backend
import { loginUser } from "../services/authService";
// useAuth — custom hook that gives access to auth context (login/logout)
import { useAuth } from "../context/AuthContext";
// toast — library to show success/error popup notifications
import toast from "react-hot-toast";

// ============ LOGIN COMPONENT ============
export default function Login() {
  // navigate — function to redirect user (e.g., navigate("/dashboard"))
  const navigate = useNavigate();
  // login — function from AuthContext to save user data after login
  const { login } = useAuth();

  // form — object holding email and password values from the inputs
  const [form, setForm] = useState({ email: "", password: "" });
  // loading — true while API call is in progress (disables submit button)
  const [loading, setLoading] = useState(false);
  // showPassword — toggles password field between hidden (dots) and visible (text)
  const [showPassword, setShowPassword] = useState(false);

  // handleChange — updates form state whenever user types in an input
  // e.target.name = "email" or "password", e.target.value = what they typed
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // handleSubmit — runs when user clicks "Sign In" button
  const handleSubmit = async (e) => {
    // prevent page refresh (default form behavior)
    e.preventDefault();
    // show loading state on button
    setLoading(true);

    try {
      // send email/password to backend API — cookie is set automatically
      const data = await loginUser(form);
      // attach email to response data for AuthContext
      data.email = form.email;
      // save user data in AuthContext (makes app know user is logged in)
      login(data);

      // show green success toast notification
      toast.success("Login successful!");
      // redirect to dashboard, replace: true prevents going back to login
      navigate("/dashboard", { replace: true });
    } catch (err) {
      // show red error toast if login fails
      toast.error("Invalid email or password");
    } finally {
      // always turn off loading state whether success or error
      setLoading(false);
    }
  };

  // ============ JSX (what gets rendered on screen) ============
  return (
    <div className="login-page">

      {/* ============ CSS STYLES ============ */}
      <style>{`
        /* fade-in animation — slides content up while fading in */
        @keyframes login-fade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* full page background container */
        .login-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #faf5ff 100%);
          padding: 16px;
          font-family: 'Inter', system-ui, sans-serif;
        }

        /* logo row — icon + "ResumeAI" text */
        .login-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 32px;
          animation: login-fade 0.5s ease;
        }

        /* purple square behind the document icon */
        .login-logo-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px -2px rgba(99,102,241,0.4);
        }

        /* "ResumeAI" brand text */
        .login-logo-text {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        /* purple highlight on "AI" */
        .login-logo-highlight {
          color: #6366f1;
        }

        /* white card that holds the form */
        .login-card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 20px 60px -12px rgba(99,102,241,0.12), 0 0 0 1px rgba(226,232,240,0.6);
          width: 100%;
          max-width: 420px;
          padding: 36px;
          animation: login-fade 0.6s ease 0.1s both;
        }

        /* "Welcome back" heading */
        .login-title {
          font-size: 24px;
          font-weight: 800;
          text-align: center;
          color: #0f172a;
          margin: 0 0 4px;
          letter-spacing: -0.02em;
        }

        /* subtitle under heading */
        .login-subtitle {
          font-size: 14px;
          text-align: center;
          color: #64748b;
          margin: 0 0 28px;
        }

        /* form layout — vertical stack with 20px gap */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* label text above each input */
        .login-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 6px;
        }

        /* password label row — space between label and any extras */
        .login-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        /* text input fields (email and password) */
        .login-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          outline: none;
          transition: all 0.2s ease;
          background: #f8fafc;
          box-sizing: border-box;
        }

        /* input focus state — purple border + glow */
        .login-input:focus {
          border-color: #6366f1;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }

        /* password input needs right padding so text doesn't go under the eye icon */
        .login-input-password {
          padding-right: 42px;
        }

        /* wrapper for password input + eye button (relative positioning) */
        .login-password-wrapper {
          position: relative;
        }

        /* eye toggle button — sits inside the password input on the right */
        .login-eye-btn {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          color: #94a3b8;
        }

        /* "Forgot Password?" link */
        .login-forgot {
          font-size: 13px;
          color: #6366f1;
          text-decoration: none;
          font-weight: 500;
          display: inline-block;
          margin-top: 6px;
        }
        .login-forgot:hover {
          text-decoration: underline;
        }

        /* submit button — purple gradient */
        .login-btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
        }
        .login-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px -6px rgba(99,102,241,0.4);
        }
        .login-btn:disabled {
          opacity: 0.6;
          transform: none;
          box-shadow: none;
          cursor: not-allowed;
        }

        /* bottom text — "Don't have an account?" */
        .login-footer {
          font-size: 14px;
          margin-top: 24px;
          text-align: center;
          color: #64748b;
        }

        /* "Sign up" clickable text */
        .login-signup {
          color: #6366f1;
          cursor: pointer;
          font-weight: 600;
        }
        .login-signup:hover {
          text-decoration: underline;
        }
      `}</style>

      {/* ============ LOGO SECTION ============ */}
      {/* displays the app icon and brand name at the top */}
      <div className="login-logo">
        {/* purple square with document icon inside */}
        <div className="login-logo-icon">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path d="M7 8h10M7 12h6M7 16h8M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        {/* brand name — "Resume" in black, "AI" in purple */}
        <span className="login-logo-text">Resume<span className="login-logo-highlight">AI</span></span>
      </div>

      {/* ============ LOGIN CARD ============ */}
      {/* white card container holding the form */}
      <div className="login-card">
        {/* heading */}
        <h2 className="login-title">Welcome back</h2>
        {/* subtitle */}
        <p className="login-subtitle">Sign in to manage your resumes</p>

        {/* ============ LOGIN FORM ============ */}
        {/* onSubmit calls handleSubmit when user presses Enter or clicks button */}
        <form onSubmit={handleSubmit} className="login-form">

          {/* ---- EMAIL FIELD ---- */}
          <div>
            {/* label above the email input */}
            <label className="login-label">Email</label>
            {/* email input — value is controlled by form.email state */}
            {/* onChange fires handleChange which updates the state */}
            {/* data-testid is used by tests to find this element */}
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="login-input"
              required
              data-testid="email-input"
            />
          </div>

          {/* ---- PASSWORD FIELD ---- */}
          <div>
            {/* label row for password */}
            <div className="login-label-row">
              <label className="login-label" style={{ marginBottom: 0 }}>Password</label>
            </div>
            {/* wrapper div — position:relative so the eye button can sit inside */}
            <div className="login-password-wrapper">
              {/* password input — type switches between "password" and "text" */}
              {/* when showPassword is true → type="text" (visible) */}
              {/* when showPassword is false → type="password" (hidden dots) */}
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="login-input login-input-password"
                required
                data-testid="password-input"
              />
              {/* eye toggle button — clicking flips showPassword true/false */}
              {/* type="button" prevents it from submitting the form */}
              <button
                type="button"
                className="login-eye-btn"
                data-testid="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {/* show eye-off icon when password is visible (click to hide) */}
                {showPassword ? (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ) : (
                  /* show eye-open icon when password is hidden (click to show) */
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                )}
              </button>
            </div>
            {/* forgot password link — navigates to /forgot-password page */}
            <Link to="/forgot-password" className="login-forgot" data-testid="forgot-password-link">
              Forgot Password?
            </Link>
          </div>

          {/* ---- SUBMIT BUTTON ---- */}
          {/* disabled while loading to prevent double-click */}
          {/* shows "Signing in..." text during API call */}
          <button type="submit" disabled={loading} className="login-btn" data-testid="submit-button">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* ============ FOOTER ============ */}
        {/* link to registration page for new users */}
        <p className="login-footer">
          Don{"'"}t have an account?{" "}
          {/* clicking "Sign up" navigates to /register */}
          <span className="login-signup" data-testid="signup-text" onClick={() => navigate("/register")}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
