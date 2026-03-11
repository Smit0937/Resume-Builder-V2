import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const TABS = ["Dashboard", "Users", "Resumes"];

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();


  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  // ─── FETCH ───
  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      if (err.response?.status === 403) { navigate("/dashboard"); return; }
      console.error("Stats fetch error:", err); showToast("❌ Failed to load stats");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error("Users fetch error:", err); showToast("❌ Failed to load users"); }
  };

  const fetchResumes = async () => {
    try {
      const res = await api.get("/admin/resumes");
      setResumes(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error("Resumes fetch error:", err); showToast("❌ Failed to load resumes"); }
  };

  useEffect(() => {
    if (!user || user.role !== "admin") { navigate("/dashboard"); return; }
    setLoading(true);
    Promise.all([fetchStats(), fetchUsers(), fetchResumes()]).finally(() => setLoading(false));
  }, []);

  // ─── ACTIONS ───
  const deleteUser = async (userId) => {
    try {
      const res = await api.delete(`/admin/users/${userId}`);
      showToast("✅ " + res.data.message);
      setUsers(prev => prev.filter(u => u.id !== userId));
      setResumes(prev => prev.filter(r => r.user_id !== userId));
      setConfirmDelete(null);
      setSelectedUser(null);
      fetchStats();
    } catch (err) { showToast("❌ " + (err.response?.data?.error || "Failed to delete user")); }
  };

  const changeRole = async (userId, newRole) => {
    try {
      const res = await api.put(`/admin/users/${userId}/role`, { role: newRole });
      showToast("✅ " + res.data.message);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      fetchStats();
    } catch (err) { showToast("❌ " + (err.response?.data?.error || "Failed to change role")); }
  };

  const deleteResume = async (resumeId) => {
    try {
      await api.delete(`/admin/resumes/${resumeId}`);
      showToast("✅ Resume deleted");
      setResumes(prev => prev.filter(r => r.id !== resumeId));
      setConfirmDelete(null);
      fetchStats();
    } catch { showToast("❌ Failed to delete resume"); }
  };

  // ─── HELPERS ───
  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredResumes = resumes.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.user_name.toLowerCase().includes(search.toLowerCase()) ||
    r.user_email.toLowerCase().includes(search.toLowerCase())
  );

  // ─── STYLES ───
  const s = {
    page: { minHeight: "100vh", background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f5f3ff 100%)", fontFamily: "'Inter', system-ui, sans-serif" },
    header: { background: "linear-gradient(135deg, #0f172a, #1e293b)", color: "#fff", padding: "0 32px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 },
    headerTitle: { fontSize: 18, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 },
    headerRight: { display: "flex", alignItems: "center", gap: 16, fontSize: 13 },
    body: { maxWidth: 1200, margin: "0 auto", padding: "24px 20px" },
    tabs: { display: "flex", gap: 4, background: "#e2e8f0", borderRadius: 10, padding: 4, marginBottom: 24, width: "fit-content" },
    tab: (active) => ({ padding: "8px 20px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: active ? "#fff" : "transparent", color: active ? "#4f46e5" : "#64748b", boxShadow: active ? "0 1px 4px rgba(99,102,241,0.12)" : "none", transition: "all 0.2s ease" }),
    statGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 32 },
    statCard: (color) => ({ background: "#fff", borderRadius: 14, padding: "24px 28px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", borderLeft: `4px solid ${color}` }),
    statNum: { fontSize: 32, fontWeight: 800, color: "#0f172a", margin: 0 },
    statLabel: { fontSize: 13, color: "#64748b", marginTop: 4 },
    card: { background: "#fff", borderRadius: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", overflow: "hidden", border: "1px solid #e2e8f0" },
    cardHeader: { padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" },
    cardTitle: { fontSize: 15, fontWeight: 700, color: "#0f172a" },
    searchInput: { border: "2px solid #e2e8f0", borderRadius: 10, padding: "8px 14px", fontSize: 13, outline: "none", width: 260, background: "#f8fafc", transition: "all 0.2s ease" },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #f1f5f9", background: "#fafbfc" },
    td: { padding: "12px 16px", fontSize: 13, color: "#334155", borderBottom: "1px solid #f8fafc" },
    badge: (role) => ({ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: role === "admin" ? "#eef2ff" : "#ecfdf5", color: role === "admin" ? "#6366f1" : "#059669" }),
    btnDanger: { background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s ease" },
    btnRole: { background: "#eef2ff", color: "#6366f1", border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s ease" },
    btnBack: { background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontSize: 13, fontWeight: 600 },
    empty: { padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 14 },
    toast: (ok) => ({ position: "fixed", top: 70, right: 24, zIndex: 999, background: ok ? "linear-gradient(135deg, #059669, #10b981)" : "linear-gradient(135deg, #dc2626, #ef4444)", color: "#fff", padding: "12px 24px", borderRadius: 12, fontSize: 14, fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.15)", backdropFilter: "blur(8px)" }),
    overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
    modal: { background: "#fff", borderRadius: 20, padding: 32, width: 420, boxShadow: "0 24px 60px rgba(0,0,0,0.2)" },
  };

  if (loading) {
    return (
      <div style={{ ...s.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "4px solid #2563eb", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "#64748b", fontSize: 14 }}>Loading admin panel...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      {/* ─── HEADER ─── */}
      <header style={s.header}>
        <div style={s.headerTitle}>🛡️ Admin Panel</div>
        <div style={s.headerRight}>
          <span style={{ opacity: 0.7 }}>{user?.email}</span>
          <button onClick={() => navigate("/dashboard")} style={{ background: "#1e293b", color: "#94a3b8", border: "1px solid #334155", borderRadius: 6, padding: "5px 14px", fontSize: 12, cursor: "pointer" }}>
            ← Dashboard
          </button>
          <button onClick={() => { logout(); navigate("/login"); }} style={{ background: "#dc2626", color: "#fff", border: "none", borderRadius: 6, padding: "5px 14px", fontSize: 12, cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </header>

      {/* ─── TOAST ─── */}
      {toast && <div style={s.toast(toast.startsWith("✅"))}>{toast}</div>}

      {/* ─── CONFIRM DELETE MODAL ─── */}
      {confirmDelete && (
        <div style={s.overlay} onClick={() => setConfirmDelete(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 800, color: "#dc2626" }}>⚠️ Confirm Delete</h3>
            <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.6, margin: "0 0 24px" }}>
              {confirmDelete.type === "user"
                ? `This will permanently delete user "${confirmDelete.name}" and ALL their resumes, experiences, education, skills, projects, and certifications.`
                : `This will permanently delete resume "${confirmDelete.name}" and all its data.`}
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setConfirmDelete(null)} style={{ background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 8, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={() => confirmDelete.type === "user" ? deleteUser(confirmDelete.id) : deleteResume(confirmDelete.id)}
                style={{ background: "#dc2626", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── BODY ─── */}
      <div style={s.body}>
        <div style={s.tabs}>
          {TABS.map((tab, i) => (
            <button key={tab} onClick={() => { setActiveTab(i); setSearch(""); setSelectedUser(null); }} style={s.tab(activeTab === i)}>{tab}</button>
          ))}
        </div>

        {/* ════════ DASHBOARD TAB ════════ */}
        {activeTab === 0 && stats && (
          <div>
            {/* Stat Cards */}
            <div style={s.statGrid}>
              <div style={s.statCard("#6366f1")}>
                <p style={s.statNum}>{stats.total_users}</p>
                <p style={s.statLabel}>Total Users</p>
              </div>
              <div style={s.statCard("#10b981")}>
                <p style={s.statNum}>{stats.total_resumes}</p>
                <p style={s.statLabel}>Total Resumes</p>
              </div>
              <div style={s.statCard("#8b5cf6")}>
                <p style={s.statNum}>{stats.total_admins}</p>
                <p style={s.statLabel}>Admin Users</p>
              </div>
            </div>

            {/* Recent Users & Resumes side by side */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={s.card}>
                <div style={s.cardHeader}><span style={s.cardTitle}>Recent Users</span></div>
                <table style={s.table}>
                  <thead><tr><th style={s.th}>Name</th><th style={s.th}>Email</th><th style={s.th}>Joined</th></tr></thead>
                  <tbody>
                    {stats.recent_users.map(u => (
                      <tr key={u.id}>
                        <td style={s.td}><span style={{ fontWeight: 600 }}>{u.name}</span></td>
                        <td style={s.td}>{u.email}</td>
                        <td style={s.td}>{formatDate(u.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={s.card}>
                <div style={s.cardHeader}><span style={s.cardTitle}>Recent Resumes</span></div>
                <table style={s.table}>
                  <thead><tr><th style={s.th}>Title</th><th style={s.th}>Template</th><th style={s.th}>Created</th></tr></thead>
                  <tbody>
                    {stats.recent_resumes.map(r => (
                      <tr key={r.id}>
                        <td style={s.td}><span style={{ fontWeight: 600 }}>{r.title}</span></td>
                        <td style={s.td}>{r.template_name}</td>
                        <td style={s.td}>{formatDate(r.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ════════ USERS TAB ════════ */}
        {activeTab === 1 && !selectedUser && (
          <div style={s.card}>
            <div style={s.cardHeader}>
              <span style={s.cardTitle}>All Users ({filteredUsers.length})</span>
              <input style={s.searchInput} placeholder="🔍 Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {filteredUsers.length === 0 ? (
              <div style={s.empty}>No users found</div>
            ) : (
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>ID</th>
                    <th style={s.th}>Name</th>
                    <th style={s.th}>Email</th>
                    <th style={s.th}>Role</th>
                    <th style={s.th}>Resumes</th>
                    <th style={s.th}>Joined</th>
                    <th style={s.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id} style={{ cursor: "pointer" }} onClick={() => setSelectedUser(u)}>
                      <td style={s.td}>{u.id}</td>
                      <td style={s.td}><span style={{ fontWeight: 600 }}>{u.name}</span></td>
                      <td style={s.td}>{u.email}</td>
                      <td style={s.td}><span style={s.badge(u.role)}>{u.role}</span></td>
                      <td style={s.td}>{u.resume_count}</td>
                      <td style={s.td}>{formatDate(u.created_at)}</td>
                      <td style={s.td} onClick={e => e.stopPropagation()}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button style={s.btnRole}
                            onClick={() => changeRole(u.id, u.role === "admin" ? "user" : "admin")}>
                            {u.role === "admin" ? "→ User" : "→ Admin"}
                          </button>
                          <button style={s.btnDanger}
                            onClick={() => setConfirmDelete({ type: "user", id: u.id, name: u.name })}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ════════ USER DETAIL VIEW ════════ */}
        {activeTab === 1 && selectedUser && (
          <div>
            <button style={s.btnBack} onClick={() => setSelectedUser(null)}>← Back to Users</button>
            <div style={{ ...s.card, marginTop: 12 }}>
              <div style={{ padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div>
                    <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{selectedUser.name}</h2>
                    <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>{selectedUser.email}</p>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={s.badge(selectedUser.role)}>{selectedUser.role}</span>
                    <button style={s.btnRole}
                      onClick={() => { changeRole(selectedUser.id, selectedUser.role === "admin" ? "user" : "admin"); setSelectedUser(prev => ({ ...prev, role: prev.role === "admin" ? "user" : "admin" })); }}>
                      {selectedUser.role === "admin" ? "Demote to User" : "Promote to Admin"}
                    </button>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
                  <div style={{ background: "#f8fafc", borderRadius: 10, padding: 16 }}>
                    <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>User ID</p>
                    <p style={{ margin: "4px 0 0", fontWeight: 700, fontSize: 16 }}>{selectedUser.id}</p>
                  </div>
                  <div style={{ background: "#f8fafc", borderRadius: 10, padding: 16 }}>
                    <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>Total Resumes</p>
                    <p style={{ margin: "4px 0 0", fontWeight: 700, fontSize: 16 }}>{selectedUser.resume_count}</p>
                  </div>
                  <div style={{ background: "#f8fafc", borderRadius: 10, padding: 16 }}>
                    <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>Joined</p>
                    <p style={{ margin: "4px 0 0", fontWeight: 700, fontSize: 16 }}>{formatDate(selectedUser.created_at)}</p>
                  </div>
                </div>

                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Resumes by this user</h3>
                {resumes.filter(r => r.user_id === selectedUser.id).length === 0 ? (
                  <div style={s.empty}>No resumes</div>
                ) : (
                  <table style={s.table}>
                    <thead><tr><th style={s.th}>ID</th><th style={s.th}>Title</th><th style={s.th}>Template</th><th style={s.th}>Created</th><th style={s.th}>Actions</th></tr></thead>
                    <tbody>
                      {resumes.filter(r => r.user_id === selectedUser.id).map(r => (
                        <tr key={r.id}>
                          <td style={s.td}>{r.id}</td>
                          <td style={s.td}><span style={{ fontWeight: 600 }}>{r.title}</span></td>
                          <td style={s.td}>{r.template_name}</td>
                          <td style={s.td}>{formatDate(r.created_at)}</td>
                          <td style={s.td}>
                            <button style={s.btnDanger} onClick={() => setConfirmDelete({ type: "resume", id: r.id, name: r.title })}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════════ RESUMES TAB ════════ */}
        {activeTab === 2 && (
          <div style={s.card}>
            <div style={s.cardHeader}>
              <span style={s.cardTitle}>All Resumes ({filteredResumes.length})</span>
              <input style={s.searchInput} placeholder="🔍 Search by title, user name or email..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {filteredResumes.length === 0 ? (
              <div style={s.empty}>No resumes found</div>
            ) : (
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>ID</th>
                    <th style={s.th}>Title</th>
                    <th style={s.th}>Owner</th>
                    <th style={s.th}>Template</th>
                    <th style={s.th}>Style</th>
                    <th style={s.th}>Created</th>
                    <th style={s.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResumes.map(r => (
                    <tr key={r.id}>
                      <td style={s.td}>{r.id}</td>
                      <td style={s.td}><span style={{ fontWeight: 600 }}>{r.title}</span></td>
                      <td style={s.td}>
                        <div>{r.user_name}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>{r.user_email}</div>
                      </td>
                      <td style={s.td}>{r.template_name}</td>
                      <td style={s.td}>{r.template_style || "—"}</td>
                      <td style={s.td}>{formatDate(r.created_at)}</td>
                      <td style={s.td}>
                        <button style={s.btnDanger} onClick={() => setConfirmDelete({ type: "resume", id: r.id, name: r.title })}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
