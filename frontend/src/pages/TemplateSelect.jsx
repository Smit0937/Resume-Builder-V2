import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TEMPLATES = [
  { id: "corporate", name: "Corporate", tag: "Simple", style: "minimal" },
  { id: "modern", name: "Modern", tag: "Modern", style: "sidebar" },
  { id: "classic", name: "Classic", tag: "Simple", style: "classic" },
  { id: "creative", name: "Creative", tag: "Creative", style: "creative" },
  { id: "harvard", name: "Harvard", tag: "Simple", style: "harvard" },
  { id: "atlantic", name: "Atlantic Blue", tag: "Modern", style: "atlantic" },
  { id: "simplyblue", name: "Simply Blue", tag: "Modern", style: "simplyblue" },
  { id: "annafield", name: "Anna Field", tag: "Simple", style: "annafield" },
  { id: "meghana", name: "Precision Line", tag: "Creative", style: "meghana" },
  { id: "obsidian", name: "Obsidian", tag: "Creative", style: "obsidian" },
  { id: "mercury", name: "Mercury", tag: "Simple", style: "mercury" },
  { id: "finance", name: "Finance", tag: "Modern", style: "finance" },
];

const FILTERS = ["All Templates", "Simple", "Modern", "Creative"];

function MiniResume({ template }) {
  const { style } = template;

  // ── MINIMAL / CORPORATE / HARVARD ──
  if (["minimal", "harvard", "mercury"].includes(style)) {
    return (
      <div style={{ width: 165, background: "#fff", borderRadius: 4, boxShadow: "0 2px 16px rgba(0,0,0,0.13)", overflow: "hidden", fontFamily: "Georgia, serif" }}>
        <div style={{ padding: "12px 12px 6px", textAlign: "center", borderBottom: "1px solid #ddd" }}>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.04em", color: "#111" }}>LEE WANG</div>
          <div style={{ fontSize: 6, color: "#555", marginTop: 2 }}>lee@wang.com  •  555-555-5555</div>
        </div>
        <div style={{ padding: "7px 10px" }}>
          {[["Education", [["Harvard University", "May 2018"], ["University of Malaya", "Jun 2009"]]],
            ["Technical Skills", null],
            ["Professional Experience", [["Rande Corporate", "Sep 2013–present"], ["Olson Financial", "Feb 2011–Sep 2013"]]]
          ].map(([section, items], si) => (
            <div key={si} style={{ marginBottom: 5 }}>
              <div style={{ fontSize: 6.5, fontWeight: 700, borderBottom: "1px solid #bbb", paddingBottom: 1, marginBottom: 3, color: "#111", textTransform: "uppercase", letterSpacing: "0.06em" }}>{section}</div>
              {items ? items.map(([title, date], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                  <div style={{ fontSize: 5.5, fontWeight: 700, color: "#222" }}>{title}</div>
                  <div style={{ fontSize: 5, color: "#888" }}>{date}</div>
                </div>
              )) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {["Machine Learning", "Java/C#", "Python", "SQL"].map((s, i) => (
                    <span key={i} style={{ fontSize: 4.5, color: "#444", background: "#f3f4f6", padding: "1px 3px", borderRadius: 2 }}>• {s}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── SIDEBAR / ATLANTIC ──
  if (["sidebar", "atlantic"].includes(style)) {
    const sideColor = style === "atlantic" ? "#1e3a5f" : "#1f2937";
    return (
      <div style={{ width: 165, background: "#fff", borderRadius: 4, boxShadow: "0 2px 16px rgba(0,0,0,0.13)", overflow: "hidden", display: "flex", fontFamily: "sans-serif" }}>
        <div style={{ width: 55, background: sideColor, padding: "10px 6px", color: "#fff" }}>
          <div style={{ fontSize: 5.5, fontWeight: 700, textAlign: "center", marginBottom: 6 }}>BRIAN T. WAYNE</div>
          <div style={{ fontSize: 4.5, opacity: 0.8, marginBottom: 8 }}>Business Dev Consultant</div>
          <div style={{ fontSize: 5, fontWeight: 700, textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.3)", paddingBottom: 2, marginBottom: 4 }}>Contact</div>
          {["brian@wayne.com", "+1-541-754", "wayne.com"].map((t, i) => (
            <div key={i} style={{ fontSize: 4, opacity: 0.8, marginBottom: 2 }}>• {t}</div>
          ))}
          <div style={{ fontSize: 5, fontWeight: 700, textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.3)", paddingBottom: 2, marginBottom: 4, marginTop: 6 }}>Skills</div>
          {["Strategic thinking", "Problem-solving", "Leadership"].map((s, i) => (
            <div key={i} style={{ fontSize: 4, opacity: 0.8, marginBottom: 2 }}>• {s}</div>
          ))}
        </div>
        <div style={{ flex: 1, padding: "8px 7px" }}>
          {[["Profile", true], ["Experience", false], ["Education", false]].map(([sec, isProfile], si) => (
            <div key={si} style={{ marginBottom: 5 }}>
              <div style={{ fontSize: 6, fontWeight: 800, textTransform: "uppercase", color: sideColor, borderBottom: `1px solid ${sideColor}`, paddingBottom: 1, marginBottom: 3 }}>{sec}</div>
              {isProfile ? <div style={{ fontSize: 4.5, color: "#555", lineHeight: 1.6 }}>Passionate business consultant with extensive experience in strategy.</div> : (
                <>
                  <div style={{ fontSize: 5, fontWeight: 700, color: "#222" }}>Appleseed Inc. <span style={{ fontWeight: 400, color: "#888", fontSize: 4.5 }}>2022–present</span></div>
                  <div style={{ fontSize: 4, color: "#999" }}>• Led 30% revenue growth through strategic planning.</div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── CLASSIC ──
  if (style === "classic") {
    return (
      <div style={{ width: 165, background: "#fff", borderRadius: 4, boxShadow: "0 2px 16px rgba(0,0,0,0.13)", overflow: "hidden", fontFamily: "sans-serif" }}>
        <div style={{ background: "#f8f9fa", padding: "8px 10px", borderBottom: "2px solid #e5e7eb" }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: "#111" }}>Andrew O'Sullivan</div>
          <div style={{ fontSize: 6, color: "#555", marginTop: 1 }}>Product Manager</div>
          <div style={{ fontSize: 5, color: "#888", marginTop: 2 }}>andrew@sulli.com • Berlin</div>
        </div>
        <div style={{ padding: "7px 10px" }}>
          {["Profile", "Professional Experience", "Education", "Skills"].map((sec, si) => (
            <div key={si} style={{ marginBottom: 5 }}>
              <div style={{ fontSize: 6.5, fontWeight: 800, color: "#111", textTransform: "uppercase", borderBottom: "1.5px solid #111", paddingBottom: 1, marginBottom: 3 }}>{sec}</div>
              {si === 0 && <div style={{ fontSize: 4.5, color: "#555", lineHeight: 1.6 }}>Experienced Product Manager with proven track record in product development.</div>}
              {si === 1 && <><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 5, fontWeight: 700 }}>Product Manager</span><span style={{ fontSize: 4.5, color: "#888" }}>08/2018–07/2023</span></div><div style={{ fontSize: 4, color: "#999" }}>• Led cross-functional team of 10 in new product launch.</div></>}
              {si === 2 && <div style={{ fontSize: 5, color: "#333" }}>MBA • University Munich 2015</div>}
              {si === 3 && <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>{["Product dev", "Strategy", "Agile"].map((s, i) => <span key={i} style={{ fontSize: 4.5, color: "#444" }}>• {s}</span>)}</div>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── CREATIVE / OBSIDIAN ──
  if (["creative", "obsidian"].includes(style)) {
    const accent = style === "obsidian" ? "#1f2937" : "#7c3aed";
    return (
      <div style={{ width: 165, background: "#fff", borderRadius: 4, boxShadow: "0 2px 16px rgba(0,0,0,0.13)", overflow: "hidden", fontFamily: "sans-serif" }}>
        <div style={{ background: accent, padding: "10px 12px" }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: "#fff" }}>Mateo Vargas</div>
          <div style={{ fontSize: 6, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>Senior Software Engineer</div>
          <div style={{ fontSize: 5, color: "rgba(255,255,255,0.6)", marginTop: 3 }}>mateo@dev.com  •  402-555-0182</div>
        </div>
        <div style={{ padding: "8px 10px" }}>
          {["Profile", "Experience", "Education", "Skills"].map((sec, si) => (
            <div key={si} style={{ marginBottom: 5 }}>
              <div style={{ fontSize: 6, fontWeight: 800, color: accent, textTransform: "uppercase", borderBottom: `1px solid ${accent}`, paddingBottom: 1, marginBottom: 3 }}>{sec}</div>
              {si === 0 && <div style={{ fontSize: 4.5, color: "#555", lineHeight: 1.6 }}>Senior engineer with 8 years building scalable cloud applications.</div>}
              {si === 1 && <><div style={{ fontSize: 5, fontWeight: 700 }}>Senior SWE, BuildRight <span style={{ fontWeight: 400, color: "#888", fontSize: 4 }}>02/2022–Present</span></div><div style={{ fontSize: 4, color: "#999" }}>• Migrated app to AWS Lambda ensuring 99.99% uptime.</div></>}
              {si === 2 && <div style={{ fontSize: 5, color: "#333" }}>MS Software Engineering • Univ. of Nebraska</div>}
              {si === 3 && <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>{["TypeScript", "React", "Node.js", "AWS"].map((s, i) => <span key={i} style={{ fontSize: 4, background: `${accent}15`, color: accent, padding: "1px 4px", borderRadius: 3 }}>{s}</span>)}</div>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── SIMPLY BLUE (image 2) ──
  if (style === "simplyblue") {
    const blue = "#3b5bdb";
    return (
      <div style={{ width: 165, background: "#fff", borderRadius: 4, boxShadow: "0 2px 16px rgba(0,0,0,0.13)", overflow: "hidden", fontFamily: "sans-serif" }}>
        <div style={{ padding: "10px 10px 6px" }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: "#111" }}>Anna Field</div>
          <div style={{ fontSize: 6, color: "#555", marginTop: 1 }}>Junior Project Manager</div>
          <div style={{ fontSize: 5, color: "#888", marginTop: 3 }}>123 Main St, Paris • anna@field.com • +11 23434546</div>
        </div>
        <div style={{ padding: "0 10px 8px" }}>
          {["Profile", "Work Experience", "Education", "Skills", "Languages"].map((sec, si) => (
            <div key={si} style={{ marginBottom: 5 }}>
              <div style={{ fontSize: 6.5, fontWeight: 700, background: `${blue}15`, color: blue, padding: "2px 5px", borderRadius: 2, marginBottom: 3, textAlign: "center" }}>{sec}</div>
              {si === 0 && <div style={{ fontSize: 4.5, color: "#555", lineHeight: 1.6 }}>Passionate Project Manager with track record of delivering successful projects on time and within budget.</div>}
              {si === 1 && <>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 5, fontWeight: 700 }}>Junior Project Manager</span><span style={{ fontSize: 4, color: "#888" }}>08/2021–present</span></div>
                <div style={{ fontSize: 4.5, color: "#666", fontStyle: "italic" }}>ABC Corporation • Paris</div>
                <div style={{ fontSize: 4, color: "#999", marginTop: 1 }}>• Successfully managed multiple projects simultaneously.</div>
              </>}
              {si === 2 && <><div style={{ fontSize: 5, fontWeight: 700 }}>BSc Business Administration</div><div style={{ fontSize: 4.5, color: "#666" }}>Paris University  09/2018–2022</div></>}
              {si === 3 && <div style={{ fontSize: 4.5, color: "#555" }}>• Exceptional leadership skills • Communication • Project management</div>}
              {si === 4 && <div style={{ display: "flex", gap: 8 }}>{["French — Native", "English — Fluent"].map((l, i) => <span key={i} style={{ fontSize: 4.5, color: "#444" }}>{l}</span>)}</div>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── ANNA FIELD CLEAN (image 3) ──
  if (style === "annafield") {
    return (
      <div style={{ width: 165, background: "#fff", borderRadius: 4, boxShadow: "0 2px 16px rgba(0,0,0,0.13)", overflow: "hidden", fontFamily: "serif" }}>
        <div style={{ padding: "10px 10px 6px", borderBottom: "1px solid #e5e7eb" }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: "#111" }}>Anna Field</div>
          <div style={{ fontSize: 6.5, color: "#555", marginTop: 1 }}>Junior Project Manager</div>
          <div style={{ fontSize: 4.5, color: "#777", marginTop: 3, display: "flex", gap: 6 }}>
            <span>📍 Paris</span><span>✉ anna@field.com</span><span>📱 +11 23434546</span>
          </div>
        </div>
        <div style={{ padding: "7px 10px" }}>
          {["Profile", "Work Experience", "Education", "Skills", "Languages"].map((sec, si) => (
            <div key={si} style={{ marginBottom: 5 }}>
              <div style={{ fontSize: 6.5, fontWeight: 700, background: "#f3f4f6", padding: "1px 5px", color: "#374151", marginBottom: 3, textAlign: "center", letterSpacing: "0.05em" }}>{sec}</div>
              {si === 0 && <div style={{ fontSize: 4.5, color: "#555", lineHeight: 1.6 }}>Passionate Project Manager committed to delivering outstanding results while maintaining a collaborative work atmosphere.</div>}
              {si === 1 && <>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 5, fontWeight: 700 }}>Junior Project Manager, ABC Corp</span><span style={{ fontSize: 4, color: "#888" }}>2021–present</span></div>
                <div style={{ fontSize: 4.5, color: "#666", fontStyle: "italic" }}>Paris, France</div>
                <div style={{ fontSize: 4, color: "#999", marginTop: 1 }}>• Managed projects coordinating cross-functional teams.</div>
                <div style={{ marginTop: 3, display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 5, fontWeight: 700 }}>Assistant PM, XYZ Solutions</span><span style={{ fontSize: 4, color: "#888" }}>2019–2021</span></div>
              </>}
              {si === 2 && <><div style={{ fontSize: 5, fontWeight: 700 }}>BSc Business Administration</div><div style={{ fontSize: 4.5, color: "#666" }}>Paris University  2018–2022</div></>}
              {si === 3 && <div style={{ fontSize: 4.5, color: "#555", lineHeight: 1.7 }}>• Leadership skills • Communication • Project execution • Strategic planning</div>}
              {si === 4 && <div style={{ display: "flex", gap: 8 }}>{["• French", "• English", "• Spanish"].map((l, i) => <span key={i} style={{ fontSize: 4.5, color: "#444" }}>{l}</span>)}</div>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── MEGHANA / PRECISION LINE (image 1) ──
  if (style === "meghana") {
    return (
      <div style={{ width: 165, background: "#fff", borderRadius: 4, boxShadow: "0 2px 16px rgba(0,0,0,0.13)", overflow: "hidden", fontFamily: "sans-serif" }}>
        <div style={{ padding: "10px 10px 8px", borderBottom: "2px solid #111" }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: "#111" }}>Meghana Hegde</div>
          <div style={{ fontSize: 6, color: "#555", fontStyle: "italic", marginTop: 2 }}>Data Scientist & AI Specialist</div>
          <div style={{ fontSize: 4.5, color: "#777", marginTop: 3 }}>meghana@email.com  •  +1 312-555-0139  •  Urbana, Illinois</div>
        </div>
        <div style={{ padding: "7px 10px" }}>
          {["Professional Summary", "Work Experience", "Education", "Skills", "Academic Projects", "Certifications"].map((sec, si) => (
            <div key={si} style={{ marginBottom: 4 }}>
              <div style={{ fontSize: 6, fontWeight: 800, color: "#111", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #111", paddingBottom: 1, marginBottom: 2 }}>{sec}</div>
              {si === 0 && <div style={{ fontSize: 4, color: "#555", lineHeight: 1.6 }}>Data Scientist with 3+ years experience in ML models, real-time analytics, and generative AI solutions using AWS, GCP, Spark, and Kafka.</div>}
              {si === 1 && <>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 4.5, fontWeight: 700 }}>Nexus AI, ML Engineer Intern</span><span style={{ fontSize: 4, color: "#888" }}>06/2025–Present</span></div>
                <div style={{ fontSize: 4, color: "#999" }}>• Built scalability testing agent using REST APIs and LLM-driven test cases.</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}><span style={{ fontSize: 4.5, fontWeight: 700 }}>Univ. of Illinois, Research Asst.</span><span style={{ fontSize: 4, color: "#888" }}>01/2025–05/2025</span></div>
                <div style={{ fontSize: 4, color: "#999" }}>• Developed Python pipeline to ingest 12,000+ time-series readings.</div>
              </>}
              {si === 2 && <><div style={{ fontSize: 4.5, fontWeight: 700 }}>MS Data Science • Univ. of Illinois</div><div style={{ fontSize: 4, color: "#777" }}>08/2023–05/2025 • Urbana, United States</div></>}
              {si === 3 && <div style={{ fontSize: 4, color: "#444", lineHeight: 1.7 }}>ML: RNN, CNN, XGBoost, LightGBM, Clustering, PCA<br/>Programming: Python, SQL, R, Java, Scala, Bash, HTML<br/>Cloud: AWS (ECS, S3), SageMaker, GCP, Azure (ML Studio)</div>}
              {si === 4 && <><div style={{ fontSize: 4.5, fontWeight: 700, color: "#222" }}>End-to-End Fine-Tuning of Mistral-7B</div><div style={{ fontSize: 4, color: "#999" }}>• Automated ML pipeline achieving ROUGE-L score of 0.79.</div></>}
              {si === 5 && <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>{["Azure AI Engineer", "Deep Learning Spec.", "Snowflake SnowPro", "Confluent Certified"].map((c, i) => <span key={i} style={{ fontSize: 4, background: "#f3f4f6", padding: "1px 3px", borderRadius: 2, color: "#444" }}>{c}</span>)}</div>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── FINANCE ──
  if (style === "finance") {
    return (
      <div style={{ width: 165, background: "#fff", borderRadius: 4, boxShadow: "0 2px 16px rgba(0,0,0,0.13)", overflow: "hidden", fontFamily: "sans-serif" }}>
        <div style={{ padding: "10px 10px 6px", borderBottom: "2px solid #374151" }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: "#111", textAlign: "center" }}>Jacob McLaren</div>
          <div style={{ fontSize: 5, color: "#777", textAlign: "center", marginTop: 3 }}>54 Dunster St, Cambridge • mclaren@gmail.com • 555-555-5555</div>
        </div>
        <div style={{ padding: "7px 10px" }}>
          {["Summary", "Education", "Work Experience", "Technical Expertise"].map((sec, si) => (
            <div key={si} style={{ marginBottom: 5 }}>
              <div style={{ fontSize: 6.5, fontWeight: 800, color: "#111", textTransform: "uppercase", borderBottom: "1.5px solid #111", paddingBottom: 1, marginBottom: 3 }}>{sec}</div>
              {si === 0 && <div style={{ fontSize: 4.5, color: "#555", lineHeight: 1.6 }}>Organized and dedicated professional with experience in enterprise information systems and financial analysis.</div>}
              {si === 1 && <>
                <div style={{ fontWeight: 700, fontSize: 5 }}>Harvard University, Extension School</div>
                <div style={{ fontSize: 4.5, color: "#666", fontStyle: "italic" }}>Master of Liberal Arts, Info Mgmt Systems</div>
                <div style={{ fontSize: 4, color: "#888", marginTop: 1 }}>• Dean's List Achievement Award recipient</div>
              </>}
              {si === 2 && <>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 5, fontWeight: 700 }}>STATE STREET CORP.</span><span style={{ fontSize: 4, color: "#888" }}>Sep 2011–Jul 2013</span></div>
                <div style={{ fontSize: 4.5, color: "#666", fontStyle: "italic" }}>Principal Simulated Technology</div>
                <div style={{ fontSize: 4, color: "#999" }}>• Led 8 cross-functional teams supporting quality reporting.</div>
              </>}
              {si === 3 && <div style={{ fontSize: 4.5, color: "#444" }}>MS Excel, PowerPoint, SQL, Project Management, Quantitative Analysis</div>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

export default function TemplateSelect() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [activeFilter, setActiveFilter] = useState("All Templates");

  const filteredTemplates = TEMPLATES.filter(t =>
    activeFilter === "All Templates" ? true : t.tag === activeFilter
  );

  const createWithTemplate = async (templateId) => {
    try {
      const res = await fetch("/api/resume/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: "Untitled Resume", template_name: templateId }),
      });
      const data = await res.json();
      navigate(`/resume/${data.resume_id}/edit`);
    } catch (err) {
      alert("Failed to create resume");
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
      <header style={{ backgroundColor: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #3b82f6, #14b8a6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M7 8h10M7 12h6M7 16h8M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#111827" }}>ResumeAI</span>
        </div>
        <button onClick={() => navigate("/dashboard")}
          style={{ background: "none", border: "1px solid #e5e7eb", borderRadius: 8, padding: "7px 16px", fontSize: 13, cursor: "pointer", color: "#374151" }}>
          ← Back to Dashboard
        </button>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: "#111827", margin: "0 0 10px" }}>Start building your resume</h1>
          <p style={{ color: "#6b7280", fontSize: 16 }}>Choose a design you like. You can customize it later.</p>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 40 }}>
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)}
              style={{ padding: "10px 24px", borderRadius: 30, border: "1px solid #e5e7eb", cursor: "pointer", fontWeight: 600, fontSize: 14, transition: "all 0.2s",
                backgroundColor: activeFilter === f ? "#111827" : "#fff",
                color: activeFilter === f ? "#fff" : "#374151" }}>
              {f}
            </button>
          ))}
        </div>

        {/* 4 per row grid — scrollable with rows */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {filteredTemplates.map((t) => (
            <div key={t.id}
              onClick={() => createWithTemplate(t.id)}
              style={{ cursor: "pointer", borderRadius: 14, overflow: "hidden", border: "2px solid #e5e7eb", transition: "all 0.2s", background: "#fff" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>

              <div style={{ height: 300, background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                <MiniResume template={t} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(37,99,235,0.08)"; e.currentTarget.querySelector("div").style.opacity = 1; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.querySelector("div").style.opacity = 0; }}>
                  <div style={{ background: "#2563eb", color: "#fff", padding: "10px 20px", borderRadius: 8, fontWeight: 600, fontSize: 14, opacity: 0, transition: "opacity 0.2s" }}>
                    Use This Template
                  </div>
                </div>
              </div>

              <div style={{ padding: "14px 16px", borderTop: "1px solid #f3f4f6" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: "#111827", textTransform: "uppercase", letterSpacing: "0.04em" }}>{t.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", background: "#f3f4f6", borderRadius: 20, padding: "2px 10px" }}>{t.tag}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}