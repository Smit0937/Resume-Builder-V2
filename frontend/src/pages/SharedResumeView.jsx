import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../services/api";

export default function SharedResumeView() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setError("Missing share token."); setLoading(false); return; }
    axios.get(`${API_URL}/api/share/${id}/public?token=${token}`)
      .then(res => { setData(res.data.resume); setLoading(false); })
      .catch(err => {
        setError(err.response?.data?.error || "Invalid or expired link.");
        setLoading(false);
      });
  }, [id, token]);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9", fontFamily: "Inter, sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #e0e7ff", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ color: "#64748b", fontSize: 14 }}>Loading resume...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9", fontFamily: "Inter, sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "40px 48px", textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.08)", maxWidth: 400 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Link Unavailable</h2>
        <p style={{ color: "#64748b", fontSize: 14 }}>{error}</p>
      </div>
    </div>
  );

  if (!data) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "Inter, sans-serif", padding: "32px 16px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        {/* Header bar */}
        <div style={{ background: "#fff", borderRadius: 12, padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M7 8h10M7 12h6M7 16h8M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>
              {data.full_name ? `${data.full_name}'s Resume` : "Shared Resume"}
            </span>
          </div>
          <span style={{ fontSize: 12, color: "#94a3b8", background: "#f1f5f9", padding: "4px 10px", borderRadius: 20 }}>
            Shared via ResumeAI
          </span>
        </div>

        {/* Resume content */}
        <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", overflow: "hidden", padding: "32px 40px", fontFamily: "Georgia, serif", fontSize: 13, color: "#111", lineHeight: 1.6 }}>
          <div style={{ textAlign: "center", borderBottom: "2px solid #111", paddingBottom: 14, marginBottom: 20 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 4px" }}>{data.full_name}</h1>
            {data.professional_title && <div style={{ fontSize: 14, color: "#555", fontStyle: "italic", marginBottom: 8 }}>{data.professional_title}</div>}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, fontSize: 12, color: "#555" }}>
              {data.email && <span>✉ {data.email}</span>}
              {data.phone && <span>📱 {data.phone}</span>}
              {data.location && <span>📍 {data.location}</span>}
              {data.linkedin && <span>🔗 {data.linkedin}</span>}
            </div>
          </div>

          {data.summary && (
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1.5px solid #111", paddingBottom: 4, marginBottom: 10 }}>Summary</h2>
              <p style={{ margin: 0, color: "#444", lineHeight: 1.7 }}>{data.summary}</p>
            </div>
          )}

          {data.experiences?.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1.5px solid #111", paddingBottom: 4, marginBottom: 10 }}>Experience</h2>
              {data.experiences.map((exp, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong>{exp.role}</strong>
                    <span style={{ fontSize: 11, color: "#777" }}>{exp.start_date} – {exp.end_date || "Present"}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#555", fontStyle: "italic" }}>{exp.company}</div>
                  {exp.description && <div style={{ fontSize: 12, color: "#444", marginTop: 4 }}>• {exp.description}</div>}
                </div>
              ))}
            </div>
          )}

          {data.educations?.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1.5px solid #111", paddingBottom: 4, marginBottom: 10 }}>Education</h2>
              {data.educations.map((edu, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong>{edu.degree}</strong>
                    <span style={{ fontSize: 11, color: "#777" }}>{edu.start_year} – {edu.end_year}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#555" }}>{edu.institution}{edu.score ? ` · ${edu.score}` : ""}</div>
                </div>
              ))}
            </div>
          )}

          {data.skills?.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1.5px solid #111", paddingBottom: 4, marginBottom: 10 }}>Skills</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {data.skills.map((s, i) => (
                  <span key={i} style={{ background: "#f3f4f6", border: "1px solid #ddd", borderRadius: 4, padding: "3px 10px", fontSize: 11 }}>
                    {s.name}{s.level ? ` · ${s.level}` : ""}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.projects?.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1.5px solid #111", paddingBottom: 4, marginBottom: 10 }}>Projects</h2>
              {data.projects.map((p, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong>{p.title}</strong>
                    {p.link && <a href={p.link} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "#2563eb" }}>View Link</a>}
                  </div>
                  {p.tech_stack && <div style={{ fontSize: 11, color: "#555", fontStyle: "italic" }}>{p.tech_stack}</div>}
                  {p.description && <div style={{ fontSize: 12, color: "#444", marginTop: 3 }}>• {p.description}</div>}
                </div>
              ))}
            </div>
          )}

          {data.certifications?.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <h2 style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1.5px solid #111", paddingBottom: 4, marginBottom: 10 }}>Certifications</h2>
              {data.certifications.map((c, i) => (
                <div key={i} style={{ marginBottom: 6 }}>
                  <strong style={{ fontSize: 12 }}>{c.name}</strong>
                  {c.issuer && <span style={{ fontSize: 11, color: "#666" }}> · {c.issuer}</span>}
                  {c.issue_date && <span style={{ fontSize: 11, color: "#888" }}> · {c.issue_date}</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", marginTop: 20 }}>
          Created with ResumeAI · This link was shared with you
        </p>
      </div>
    </div>
  );
}