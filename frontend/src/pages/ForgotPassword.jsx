import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false); // show success state after submit

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email: email.trim().toLowerCase() });
      setSent(true);
      toast.success("Reset link sent! Check your inbox.");
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.error;

      if (status === 503) {
        toast.error("Mail service unavailable. Please try again later.");
      } else if (status === 400) {
        toast.error(msg || "Please enter a valid email.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #faf5ff 100%)", padding: 16, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @keyframes fp-fade { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fp-spin { to { transform: rotate(360deg); } }
        @keyframes fp-check { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.2); } 100% { transform: scale(1); opacity: 1; } }
        .fp-input { width: 100%; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 14px; outline: none; transition: all 0.2s ease; background: #f8fafc; box-sizing: border-box; font-family: inherit; }
        .fp-input:focus { border-color: #6366f1; background: #fff; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        .fp-input:disabled { opacity: 0.6; cursor: not-allowed; }
        .fp-btn { width: 100%; padding: 12px; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.3s ease; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; display: flex; align-items: center; justify-content: center; gap: 8px; font-family: inherit; }
        .fp-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px -6px rgba(99,102,241,0.4); }
        .fp-btn:disabled { opacity: 0.6; transform: none; box-shadow: none; cursor: not-allowed; }
      `}</style>

      <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 20px 60px -12px rgba(99,102,241,0.12), 0 0 0 1px rgba(226,232,240,0.6)", width: "100%", maxWidth: 420, padding: 36, animation: "fp-fade 0.6s ease" }}>

        {sent ? (
          /* ── Success state ── */
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #dcfce7, #bbf7d0)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", animation: "fp-check 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 10px", letterSpacing: "-0.02em" }}>Check your inbox</h2>
            <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 6px" }}>
              We sent a reset link to
            </p>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#6366f1", margin: "0 0 28px", wordBreak: "break-all" }}>
              {email}
            </p>
            <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 24px" }}>
              The link expires in 15 minutes. Check your spam folder if you don't see it.
            </p>
            <button
              onClick={() => { setSent(false); setEmail(""); }}
              style={{ background: "none", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 600, color: "#64748b", cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.color = "#6366f1"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#64748b"; }}
            >
              Try a different email
            </button>
          </div>
        ) : (
          /* ── Form state ── */
          <>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg, #eef2ff, #f5f3ff)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: "0 0 8px", letterSpacing: "-0.02em" }}>Forgot Password</h2>
              <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>Enter your email and we'll send a reset link</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <input
                type="email"
                placeholder="Enter your email"
                className="fp-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                autoFocus
                data-testid="email-input"
              />
              <button type="submit" disabled={loading || !email.trim()} className="fp-btn" data-testid="submit-button">
                {loading ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: "fp-spin 0.7s linear infinite" }}>
                      <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2.5" strokeDasharray="28 56" strokeLinecap="round"/>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            <p style={{ fontSize: 14, marginTop: 20, textAlign: "center", color: "#64748b" }}>
              Remember your password?{" "}
              <Link to="/login" style={{ color: "#6366f1", textDecoration: "none", fontWeight: 600 }} data-testid="login-link">
                Login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}