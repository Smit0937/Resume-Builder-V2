import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const TABS = ["Personal", "Experience", "Education", "Skills", "Projects", "Certifications"];

// ── LIVE RESUME PREVIEW ──
function ResumePreview({ resume, experiences, educations, skills, projects, certs }) {
  const { full_name, professional_title, email, phone, location, linkedin, summary } = resume;

  return (
    <div style={{ fontFamily: "Georgia, serif", fontSize: 11, color: "#111", lineHeight: 1.6, padding: "32px 36px", background: "#fff", minHeight: "100%", width: "100%" }}>

      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 2px", fontFamily: "sans-serif" }}>
          {full_name || <span style={{ color: "#ccc" }}>Your Name</span>}
        </h1>
        {professional_title && <div style={{ fontSize: 12, color: "#555", marginBottom: 6 }}>{professional_title}</div>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 10, color: "#555" }}>
          {email && <span>✉ {email}</span>}
          {phone && <span>📱 {phone}</span>}
          {location && <span>📍 {location}</span>}
          {linkedin && <span>🔗 {linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <Section title="Profile">
          <p style={{ margin: 0, fontSize: 10.5, color: "#444", lineHeight: 1.7 }}>{summary}</p>
        </Section>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <Section title="Work Experience">
          {experiences.map((exp, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: 11 }}>{exp.role}</span>
                <span style={{ fontSize: 10, color: "#777" }}>{exp.start_date} – {exp.end_date || "Present"}</span>
              </div>
              <div style={{ fontSize: 10, color: "#555", fontStyle: "italic" }}>{exp.company}</div>
              {exp.description && <div style={{ fontSize: 10, color: "#666", marginTop: 3 }}>• {exp.description}</div>}
            </div>
          ))}
        </Section>
      )}

      {/* Education */}
      {educations.length > 0 && (
        <Section title="Education">
          {educations.map((edu, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: 11 }}>{edu.degree}</span>
                <span style={{ fontSize: 10, color: "#777" }}>{edu.start_year} – {edu.end_year}</span>
              </div>
              <div style={{ fontSize: 10, color: "#555" }}>{edu.institution} {edu.gpa && `· GPA: ${edu.gpa}`}</div>
            </div>
          ))}
        </Section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <Section title="Skills">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {skills.map((s, i) => (
              <span key={i} style={{ background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 4, padding: "2px 8px", fontSize: 10, color: "#374151" }}>
                {s.name} {s.level && `· ${s.level}`}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: 11 }}>{p.title}</span>
                {p.link && <a href={p.link} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: "#2563eb" }}>Link</a>}
              </div>
              {p.tech_stack && <div style={{ fontSize: 10, color: "#555", fontStyle: "italic" }}>{p.tech_stack}</div>}
              {p.description && <div style={{ fontSize: 10, color: "#666", marginTop: 2 }}>• {p.description}</div>}
            </div>
          ))}
        </Section>
      )}

      {/* Certifications */}
      {certs.length > 0 && (
        <Section title="Certifications">
          {certs.map((c, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 11 }}>{c.name}</span>
              <span style={{ fontSize: 10, color: "#666" }}> · {c.issuer} {c.issue_date && `· ${c.issue_date}`}</span>
            </div>
          ))}
        </Section>
      )}

      {/* Empty state */}
      {!full_name && !summary && experiences.length === 0 && educations.length === 0 && (
        <div style={{ textAlign: "center", color: "#ccc", marginTop: 60, fontSize: 13 }}>
          Start filling in your details to see the preview here →
        </div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1.5px solid #111", paddingBottom: 3, marginBottom: 8, color: "#111" }}>{title}</div>
      {children}
    </div>
  );
}

// ── MAIN BUILDER ──
export default function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const [activeTab, setActiveTab] = useState(0);
  const [saving, setSaving] = useState(false);
  const [showExtra, setShowExtra] = useState(false);

  const [resume, setResume] = useState({
    title: "", summary: "", full_name: "", professional_title: "",
    email: "", phone: "", location: "", linkedin: "", website: "",
    nationality: "", date_of_birth: "",
  });

  const [experiences, setExperiences] = useState([]);
  const [expForm, setExpForm] = useState({ company: "", role: "", start_date: "", end_date: "", description: "" });

  const [educations, setEducations] = useState([]);
  const [eduForm, setEduForm] = useState({ degree: "", institution: "", start_year: "", end_year: "", gpa: "" });

  const [skills, setSkills] = useState([]);
  const [skillForm, setSkillForm] = useState({ name: "", level: "Intermediate" });

  const [projects, setProjects] = useState([]);
  const [projForm, setProjForm] = useState({ title: "", description: "", tech_stack: "", link: "" });

  const [certs, setCerts] = useState([]);
  const [certForm, setCertForm] = useState({ name: "", issuer: "", issue_date: "", expiry_date: "" });

  useEffect(() => { fetchAll(); }, [id]);

  const fetchAll = async () => {
    try {
      const res = await fetch(`/api/resume/${id}`, { headers });
      const data = await res.json();
      setResume({
        title: data.title || "", summary: data.summary || "",
        full_name: data.full_name || "", professional_title: data.professional_title || "",
        email: data.email || "", phone: data.phone || "",
        location: data.location || "", linkedin: data.linkedin || "",
        website: data.website || "", nationality: data.nationality || "",
        date_of_birth: data.date_of_birth || "",
      });

      const [e, ed, sk, pr, ce] = await Promise.all([
        fetch(`/api/experience/${id}`, { headers }).then(r => r.json()).catch(() => []),
        fetch(`/api/education/${id}`, { headers }).then(r => r.json()).catch(() => []),
        fetch(`/api/skills/${id}`, { headers }).then(r => r.json()).catch(() => []),
        fetch(`/api/projects/${id}`, { headers }).then(r => r.json()).catch(() => []),
        fetch(`/api/certifications/${id}`, { headers }).then(r => r.json()).catch(() => []),
      ]);
      setExperiences(Array.isArray(e) ? e : []);
      setEducations(Array.isArray(ed) ? ed : []);
      setSkills(Array.isArray(sk) ? sk : []);
      setProjects(Array.isArray(pr) ? pr : []);
      setCerts(Array.isArray(ce) ? ce : []);
    } catch (err) { console.error(err); }
  };

  const saveResume = async () => {
    setSaving(true);
    try {
      await fetch(`/api/resume/${id}`, { method: "PUT", headers, body: JSON.stringify(resume) });
    } catch { alert("Failed to save"); }
    finally { setSaving(false); }
  };

  const addItem = async (url, body, resetFn, type) => {
  try {
    const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
    const data = await res.json();
    resetFn();
    if (type === "experience") setExperiences(prev => [...prev, { ...body, id: data.id }]);
    if (type === "education") setEducations(prev => [...prev, { ...body, id: data.id }]);
    if (type === "skills") setSkills(prev => [...prev, { ...body, id: data.id }]);
    if (type === "projects") setProjects(prev => [...prev, { ...body, id: data.id }]);
    if (type === "certs") setCerts(prev => [...prev, { ...body, id: data.id }]);
  } catch { alert("Failed to add"); }
};

  const deleteItem = async (url, type, index) => {
    try {
      await fetch(url, { method: "DELETE", headers });
      if (type === "experience") setExperiences(prev => prev.filter((_, i) => i !== index));
      if (type === "education") setEducations(prev => prev.filter((_, i) => i !== index));
      if (type === "skills") setSkills(prev => prev.filter((_, i) => i !== index));
      if (type === "projects") setProjects(prev => prev.filter((_, i) => i !== index));
      if (type === "certs") setCerts(prev => prev.filter((_, i) => i !== index));
    } catch { alert("Failed to delete"); }
  };

  const inp = { width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 13px", fontSize: 13, outline: "none", background: "#f9fafb", boxSizing: "border-box" };
  const lbl = { display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 };
  const fld = { marginBottom: 14 };
  const btn = { background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" };
  const card = { background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, padding: 14, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "flex-start" };
  const delBtn = { background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 12 };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", fontFamily: "sans-serif" }}>

      {/* Header */}
      <header style={{ backgroundColor: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 20px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => navigate("/dashboard")} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 13 }}>← Dashboard</button>
          <input value={resume.title} onChange={e => setResume({ ...resume, title: e.target.value })}
            placeholder="Resume Title"
            style={{ border: "none", outline: "none", fontSize: 14, fontWeight: 700, color: "#111827", background: "transparent", width: 200 }} />
        </div>
        <button onClick={saveResume} disabled={saving}
          style={{ ...btn, padding: "7px 18px" }}>
          {saving ? "Saving..." : "💾 Save"}
        </button>
      </header>

      {/* Split Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", height: "calc(100vh - 52px)" }}>

        {/* LEFT — Form */}
        <div style={{ overflowY: "auto", padding: "20px 16px", borderRight: "1px solid #e5e7eb" }}>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 3, backgroundColor: "#e5e7eb", borderRadius: 10, padding: 3, marginBottom: 18 }}>
            {TABS.map((tab, i) => (
              <button key={tab} onClick={() => setActiveTab(i)}
                style={{ flex: 1, padding: "7px 2px", borderRadius: 7, border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer",
                  backgroundColor: activeTab === i ? "#fff" : "transparent",
                  color: activeTab === i ? "#2563eb" : "#6b7280",
                  boxShadow: activeTab === i ? "0 1px 3px rgba(0,0,0,0.08)" : "none" }}>
                {tab}
              </button>
            ))}
          </div>

          <div style={{ backgroundColor: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>

            {/* PERSONAL */}
            {activeTab === 0 && (
              <div>
                <h2 style={{ fontWeight: 800, fontSize: 17, marginBottom: 4 }}>Edit Personal Details</h2>
                <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 18 }}>Appears at the top of your resume.</p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[["Full Name", "full_name", "e.g. Anna Field"],
                    ["Professional Title", "professional_title", "Target position or current role"],
                    ["Email", "email", "Enter email"],
                    ["Phone", "phone", "Enter Phone"]].map(([label, key, ph]) => (
                    <div key={key} style={fld}>
                      <label style={lbl}>{label}</label>
                      <input style={inp} placeholder={ph} value={resume[key]} onChange={e => setResume({ ...resume, [key]: e.target.value })} />
                    </div>
                  ))}
                  <div style={{ ...fld, gridColumn: "1/-1" }}>
                    <label style={lbl}>Location</label>
                    <input style={inp} placeholder="City, Country" value={resume.location} onChange={e => setResume({ ...resume, location: e.target.value })} />
                  </div>
                </div>

                {/* Add Details */}
                <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 14, marginBottom: 14 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Add details</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {["LinkedIn", "Website", "Nationality", "Date of Birth"].map(label => (
                      <button key={label} onClick={() => setShowExtra(true)}
                        style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", border: "1px solid #e5e7eb", borderRadius: 20, background: "#fff", fontSize: 12, cursor: "pointer", color: "#374151" }}>
                        + {label}
                      </button>
                    ))}
                  </div>
                  {showExtra && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
                      {[["LinkedIn", "linkedin", "linkedin.com/in/yourname"],
                        ["Website", "website", "yourwebsite.com"],
                        ["Nationality", "nationality", "e.g. Indian"],
                        ["Date of Birth", "date_of_birth", "DD/MM/YYYY"]].map(([label, key, ph]) => (
                        <div key={key} style={fld}>
                          <label style={lbl}>{label}</label>
                          <input style={inp} placeholder={ph} value={resume[key]} onChange={e => setResume({ ...resume, [key]: e.target.value })} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={fld}>
                  <label style={lbl}>Professional Summary</label>
                  <textarea style={{ ...inp, resize: "none" }} rows={4} placeholder="Write a brief professional summary..." value={resume.summary} onChange={e => setResume({ ...resume, summary: e.target.value })} />
                </div>

                <button onClick={saveResume} disabled={saving}
                  style={{ ...btn, width: "100%", padding: "12px", fontSize: 14, borderRadius: 10, background: "linear-gradient(135deg, #ec4899, #f97316)" }}>
                  {saving ? "Saving..." : "✓  Done"}
                </button>
              </div>
            )}

            {/* EXPERIENCE */}
            {activeTab === 1 && (
              <div>
                <h2 style={{ fontWeight: 800, fontSize: 17, marginBottom: 14 }}>Work Experience</h2>
                {Array.isArray(experiences) && experiences.map((exp, i) => (
                  <div key={i} style={card}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 13, margin: 0 }}>{exp.role} at {exp.company}</p>
                      <p style={{ fontSize: 11, color: "#6b7280", margin: "2px 0" }}>{exp.start_date} – {exp.end_date || "Present"}</p>
                      {exp.description && <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>{exp.description}</p>}
                    </div>
                    <button style={delBtn} onClick={() => deleteItem(`/api/experience/${exp.id}`, "experience", i)}>Delete</button>
                  </div>
                ))}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  {[["Company", "company", "e.g. Google"], ["Role", "role", "e.g. Software Engineer"],
                    ["Start Date", "start_date", "Jan 2022"], ["End Date", "end_date", "Present"]].map(([label, key, ph]) => (
                    <div key={key}><label style={lbl}>{label}</label>
                      <input style={inp} placeholder={ph} value={expForm[key]} onChange={e => setExpForm({ ...expForm, [key]: e.target.value })} /></div>
                  ))}
                </div>
                <div style={fld}>
                  <label style={lbl}>Description</label>
                  <textarea style={{ ...inp, resize: "none" }} rows={3} placeholder="Describe responsibilities..." value={expForm.description}
                    onChange={e => setExpForm({ ...expForm, description: e.target.value })} />
                </div>
                <button style={btn} onClick={() => addItem(`/api/experience/`, { ...expForm, resume_id: parseInt(id) },
                  () => setExpForm({ company: "", role: "", start_date: "", end_date: "", description: "" }), "experience")}>
                  + Add Experience
                </button>
              </div>
            )}

            {/* EDUCATION */}
            {activeTab === 2 && (
              <div>
                <h2 style={{ fontWeight: 800, fontSize: 17, marginBottom: 14 }}>Education</h2>
                {Array.isArray(educations) && educations.map((edu, i) => (
                  <div key={i} style={card}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 13, margin: 0 }}>{edu.degree} — {edu.institution}</p>
                      <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>{edu.start_year} – {edu.end_year} {edu.gpa && `· GPA: ${edu.gpa}`}</p>
                    </div>
                    <button style={delBtn} onClick={() => deleteItem(`/api/education/${edu.id}`, "education", i)}>Delete</button>
                  </div>
                ))}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  {[["Degree", "degree", "e.g. B.Tech"], ["Institution", "institution", "e.g. IIT Bombay"],
                    ["Start Year", "start_year", "2018"], ["End Year", "end_year", "2022"], ["GPA", "gpa", "3.8"]].map(([label, key, ph]) => (
                    <div key={key}><label style={lbl}>{label}</label>
                      <input style={inp} placeholder={ph} value={eduForm[key]} onChange={e => setEduForm({ ...eduForm, [key]: e.target.value })} /></div>
                  ))}
                </div>
                <button style={btn} onClick={() => addItem(`/api/education/`, { ...eduForm, resume_id: parseInt(id) },
                  () => setEduForm({ degree: "", institution: "", start_year: "", end_year: "", gpa: "" }), "education")}>
                  + Add Education
                </button>
              </div>
            )}

            {/* SKILLS */}
            {activeTab === 3 && (
              <div>
                <h2 style={{ fontWeight: 800, fontSize: 17, marginBottom: 14 }}>Skills</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 16 }}>
                  {Array.isArray(skills) && skills.map((s, i) => (
                    <span key={i} style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: 20, padding: "4px 10px", fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
                      {s.name} · {s.level}
                      <button onClick={() => deleteItem(`/api/skills/${s.id}`, "skills", i)} style={{ ...delBtn, fontSize: 11, padding: 0 }}>✕</button>
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                  <div style={{ flex: 1 }}><label style={lbl}>Skill</label>
                    <input style={inp} placeholder="e.g. React" value={skillForm.name} onChange={e => setSkillForm({ ...skillForm, name: e.target.value })} /></div>
                  <div style={{ width: 130 }}><label style={lbl}>Level</label>
                    <select style={inp} value={skillForm.level} onChange={e => setSkillForm({ ...skillForm, level: e.target.value })}>
                      {["Beginner", "Intermediate", "Advanced", "Expert"].map(l => <option key={l}>{l}</option>)}
                    </select></div>
                  <button style={btn} onClick={() => addItem(`/api/skills/`, { ...skillForm, resume_id: parseInt(id) },
                    () => setSkillForm({ name: "", level: "Intermediate" }), "skills")}>+ Add</button>
                </div>
              </div>
            )}

            {/* PROJECTS */}
            {activeTab === 4 && (
              <div>
                <h2 style={{ fontWeight: 800, fontSize: 17, marginBottom: 14 }}>Projects</h2>
                {Array.isArray(projects) && projects.map((p, i) => (
                  <div key={i} style={card}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 13, margin: 0 }}>{p.title}</p>
                      <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>{p.tech_stack}</p>
                    </div>
                    <button style={delBtn} onClick={() => deleteItem(`/api/projects/${p.id}`, "projects", i)}>Delete</button>
                  </div>
                ))}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  {[["Title", "title", "e.g. AI Resume Builder"], ["Tech Stack", "tech_stack", "React, Flask"],
                    ["Link", "link", "https://github.com/..."]].map(([label, key, ph]) => (
                    <div key={key}><label style={lbl}>{label}</label>
                      <input style={inp} placeholder={ph} value={projForm[key]} onChange={e => setProjForm({ ...projForm, [key]: e.target.value })} /></div>
                  ))}
                </div>
                <div style={fld}><label style={lbl}>Description</label>
                  <textarea style={{ ...inp, resize: "none" }} rows={3} placeholder="Describe the project..." value={projForm.description}
                    onChange={e => setProjForm({ ...projForm, description: e.target.value })} /></div>
                <button style={btn} onClick={() => addItem(`/api/projects/`, { ...projForm, resume_id: parseInt(id) },
                  () => setProjForm({ title: "", description: "", tech_stack: "", link: "" }), "projects")}>+ Add Project</button>
              </div>
            )}

            {/* CERTIFICATIONS */}
            {activeTab === 5 && (
              <div>
                <h2 style={{ fontWeight: 800, fontSize: 17, marginBottom: 14 }}>Certifications</h2>
                {Array.isArray(certs) && certs.map((c, i) => (
                  <div key={i} style={card}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 13, margin: 0 }}>{c.name}</p>
                      <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>{c.issuer} · {c.issue_date}</p>
                    </div>
                    <button style={delBtn} onClick={() => deleteItem(`/api/certifications/${c.id}`, "certs", i)}>Delete</button>
                  </div>
                ))}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  {[["Name", "name", "AWS Solutions Architect"], ["Issuer", "issuer", "Amazon"],
                    ["Issue Date", "issue_date", "Jan 2023"], ["Expiry Date", "expiry_date", "Jan 2026"]].map(([label, key, ph]) => (
                    <div key={key}><label style={lbl}>{label}</label>
                      <input style={inp} placeholder={ph} value={certForm[key]} onChange={e => setCertForm({ ...certForm, [key]: e.target.value })} /></div>
                  ))}
                </div>
                <button style={btn} onClick={() => addItem(`/api/certifications/`, { ...certForm, resume_id: parseInt(id) },
                  () => setCertForm({ name: "", issuer: "", issue_date: "", expiry_date: "" }), "certs")}>+ Add Certification</button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Live Preview */}
        <div style={{ overflowY: "auto", background: "#e5e7eb", padding: 20 }}>
          <div style={{ background: "#fff", minHeight: "100%", boxShadow: "0 4px 24px rgba(0,0,0,0.1)", borderRadius: 4 }}>
            <ResumePreview
              resume={resume}
              experiences={experiences}
              educations={educations}
              skills={skills}
              projects={projects}
              certs={certs}
            />
          </div>
        </div>
      </div>
    </div>
  );
}