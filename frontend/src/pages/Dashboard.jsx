import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { resumeService } from "../services/resumeService";
import api from "../services/api";

export default function Dashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ SHOW LOADING WHILE CHECKING AUTH
  if (authLoading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f5f3ff 100%)"
      }}>
        <div style={{ 
          width: 48, 
          height: 48, 
          border: "4px solid #e0e7ff", 
          borderTopColor: "#6366f1", 
          borderRadius: "50%", 
          animation: "spin 0.8s linear infinite" 
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ✅ REDIRECT TO LOGIN IF NOT AUTHENTICATED
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [authLoading, user, navigate]);

  const fetchResumes = async () => {
    try {
      const res = await api.get("/resume/all");
      setResumes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchResumes();
    }
  }, [user]);

  const createResume = () => {
    navigate("/resume/new");
  };

  const duplicateResume = async (e, resume) => {
    e.stopPropagation();
    try {
      setLoading(true);
      await resumeService.create({
        title: `${resume.title} (Copy)`,
        summary: resume.summary,
        full_name: resume.full_name,
        email: resume.email,
        phone: resume.phone,
        linkedin: resume.linkedin,
      });
      fetchResumes();
    } catch (err) {
      alert("Failed to duplicate");
      setLoading(false);
    }
  };

  const deleteResume = async (e, id) => {
    e.stopPropagation();
    try {
      await resumeService.delete(id);
      setResumes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // ✅ Don't render anything if no user (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f5f3ff 100%)", fontFamily: "'Inter', system-ui, sans-serif" }}>

      <style>{`
        @keyframes dash-fade-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes dash-spin { to { transform: rotate(360deg); } }
        @keyframes dash-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        .dash-card { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
        .dash-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -12px rgba(99,102,241,0.15); border-color: #a5b4fc !important; }
        .dash-card:hover .dash-icon { background: linear-gradient(135deg,#6366f1,#8b5cf6) !important; }
        .dash-card:hover .dash-icon svg path { stroke: white !important; }
        .dash-btn-new { transition: all 0.3s ease; }
        .dash-btn-new:hover { transform: translateY(-1px); box-shadow: 0 8px 24px -6px rgba(99,102,241,0.4); }
      `}</style>

      {/* Header */}
      <header style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: "1px solid rgba(226,232,240,0.6)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px -2px rgba(99,102,241,0.4)" }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M7 8h10M7 12h6M7 16h8M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>Resume<span style={{ color: "#6366f1" }}>AI</span></span>
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* User pill */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "#f1f5f9", borderRadius: 20, border: "1px solid #e2e8f0" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700 }}>
                {(user?.email || "U")[0].toUpperCase()}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>{user?.email ? user.email.split("@")[0] : "User"}</span>
            </div>

            {user?.role === "admin" && (
              <button onClick={() => navigate("/admin")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 8, background: "linear-gradient(135deg, #7c3aed, #6366f1)", color: "#fff", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                🛡️ Admin
              </button>
            )}

            <button onClick={handleLogout} style={{ padding: "8px 16px", borderRadius: 8, background: "transparent", border: "1px solid #e2e8f0", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s ease" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.borderColor = "#fecaca"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "#e2e8f0"; }}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>

        {/* Title row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, animation: "dash-fade-in 0.5s ease" }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>My Resumes</h1>
            <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>Create and manage your AI-powered resumes</p>
          </div>
          <button className="dash-btn-new" onClick={createResume} style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
            New Resume
          </button>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
            <div style={{ width: 36, height: 36, border: "3px solid #e0e7ff", borderTopColor: "#6366f1", borderRadius: "50%", animation: "dash-spin 0.7s linear infinite" }} />
          </div>
        ) : resumes.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", animation: "dash-fade-in 0.5s ease" }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg, #eef2ff, #f5f3ff)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zM12 8v8M8 12h8" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: "0 0 8px" }}>No resumes yet</h3>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24, textAlign: "center", maxWidth: 360 }}>Build your first AI-powered professional resume in minutes!</p>
            <button className="dash-btn-new" onClick={createResume} style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
              Create Your First Resume
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}>
            {resumes.map((resume, i) => (
              <div key={resume.id} className="dash-card" onClick={() => navigate(`/resume/${resume.id}/edit`)}
                style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", padding: 20, cursor: "pointer", animation: `dash-fade-in 0.4s ease ${i * 0.05}s both` }}>
                <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", marginBottom: 14 }}>
                  <div className="dash-icon" style={{ width: 44, height: 44, borderRadius: 12, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s ease" }}>
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M7 8h10M7 12h6M7 16h8M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button onClick={(e) => duplicateResume(e, resume)} title="Duplicate"
                      style={{ padding: 8, borderRadius: 8, background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#6366f1"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}>
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    </button>
                    <button onClick={(e) => deleteResume(e, resume.id)} title="Delete"
                      style={{ padding: 8, borderRadius: 8, background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#ef4444"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}>
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    </button>
                  </div>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: "0 0 6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{resume.title || "Untitled Resume"}</h3>
                <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
                  Updated: {new Date(resume.updated_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}