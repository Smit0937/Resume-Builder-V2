import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Reset link sent to your email");
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #faf5ff 100%)", padding: 16, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @keyframes fp-fade { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fp-input { width: 100%; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 14px; outline: none; transition: all 0.2s ease; background: #f8fafc; box-sizing: border-box; }
        .fp-input:focus { border-color: #6366f1; background: #fff; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        .fp-btn { width: 100%; padding: 12px; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.3s ease; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; }
        .fp-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px -6px rgba(99,102,241,0.4); }
        .fp-btn:disabled { opacity: 0.6; transform: none; box-shadow: none; cursor: not-allowed; }
      `}</style>
      <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 20px 60px -12px rgba(99,102,241,0.12), 0 0 0 1px rgba(226,232,240,0.6)", width: "100%", maxWidth: 420, padding: 36, animation: "fp-fade 0.6s ease" }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, textAlign: "center", color: "#0f172a", margin: "0 0 24px", letterSpacing: "-0.02em" }}>Forgot Password</h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input type="email" placeholder="Enter your email" className="fp-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button type="submit" disabled={loading} className="fp-btn">{loading ? "Sending..." : "Send Reset Link"}</button>
        </form>

        <p style={{ fontSize: 14, marginTop: 20, textAlign: "center", color: "#64748b" }}>
          Remember your password?{" "}
          <Link to="/login" style={{ color: "#6366f1", textDecoration: "none", fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  );
}