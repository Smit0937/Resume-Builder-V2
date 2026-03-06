import { useEffect, useState, useRef } from "react"; // ✅ Perfect!
import { useParams, useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";

const TABS = ["Personal", "Experience", "Education", "Skills", "Projects", "Certifications"];

// ── 12 UNIQUE ATS-FRIENDLY TEMPLATE RENDERERS ──

function TemplateCorporate({ resume, experiences, educations, skills, projects, certs }) {
  const { full_name, professional_title, email, phone, location, linkedin, summary } = resume;
  return (
    <div style={{ fontFamily: "Georgia, serif", fontSize: 11, color: "#111", lineHeight: 1.6, padding: "32px 36px", background: "#fff", minHeight: "100%" }}>
      <div style={{ textAlign: "center", borderBottom: "2px solid #111", paddingBottom: 12, marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 4px", letterSpacing: "0.05em", textTransform: "uppercase" }}>{full_name || <span style={{ color: "#ccc" }}>Your Name</span>}</h1>
        {professional_title && <div style={{ fontSize: 12, color: "#555", marginBottom: 6, fontStyle: "italic" }}>{professional_title}</div>}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, fontSize: 10, color: "#555" }}>
          {email && <span>✉ {email}</span>}{phone && <span>📱 {phone}</span>}{location && <span>📍 {location}</span>}{linkedin && <span>🔗 {linkedin}</span>}
        </div>
      </div>
      {summary && <Section title="Professional Summary"><p style={{ margin: 0, fontSize: 10.5, color: "#444", lineHeight: 1.7 }}>{summary}</p></Section>}
      {experiences.length > 0 && <Section title="Work Experience">{experiences.map((exp, i) => <ExpItem key={i} exp={exp} />)}</Section>}
      {educations.length > 0 && <Section title="Education">{educations.map((edu, i) => <EduItem key={i} edu={edu} />)}</Section>}
      {skills.length > 0 && <Section title="Skills"><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{skills.map((s, i) => <span key={i} style={{ background: "#f3f4f6", border: "1px solid #ddd", borderRadius: 3, padding: "2px 8px", fontSize: 10 }}>{s.name}{s.level ? ` · ${s.level}` : ""}</span>)}</div></Section>}
      {projects.length > 0 && <Section title="Projects">{projects.map((p, i) => <ProjItem key={i} p={p} />)}</Section>}
      {certs.length > 0 && <Section title="Certifications">{certs.map((c, i) => <CertItem key={i} c={c} />)}</Section>}
      <EmptyState resume={resume} experiences={experiences} educations={educations} />
    </div>
  );
}

function TemplateModern({ resume, experiences, educations, skills, projects, certs }) {
  const { full_name, professional_title, email, phone, location, linkedin, summary } = resume;
  const accent = "#0f172a";
  
  return (
    // GOLDILOCKS SQUEEZE: Tightened padding, lowered line-height to 1.45
    <div style={{ fontFamily: "'Helvetica Neue', sans-serif", fontSize: 10.5, color: "#111", lineHeight: 1.45, background: "#fff", minHeight: "100%", display: "flex", boxSizing: "border-box" }}>
      
      {/* LEFT SIDEBAR */}
      <div style={{ width: 180, background: accent, padding: "24px 16px", color: "#fff", flexShrink: 0 }}>
        <div style={{ marginBottom: 18, pageBreakInside: "avoid", breakInside: "avoid" }}>
          <h1 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 4px", color: "#fff", lineHeight: 1.2 }}>
            {full_name || <span style={{ opacity: 0.4 }}>Your Name</span>}
          </h1>
          {professional_title && (
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", fontStyle: "italic" }}>
              {professional_title}
            </div>
          )}
        </div>

        <div style={{ pageBreakInside: "avoid", breakInside: "avoid", marginBottom: 16 }}>
          <SideSection title="Contact" color="#fff">
            {email && <div style={{ fontSize: 8.5, opacity: 0.8, marginBottom: 3 }}>✉ {email}</div>}
            {phone && <div style={{ fontSize: 8.5, opacity: 0.8, marginBottom: 3 }}>📱 {phone}</div>}
            {location && <div style={{ fontSize: 8.5, opacity: 0.8, marginBottom: 3 }}>📍 {location}</div>}
            {linkedin && <div style={{ fontSize: 8.5, opacity: 0.8, marginBottom: 3 }}>🔗 {linkedin}</div>}
          </SideSection>
        </div>

        {skills.length > 0 && (
          <div style={{ pageBreakInside: "avoid", breakInside: "avoid", marginBottom: 16 }}>
            <SideSection title="Skills" color="#fff">
              {skills.map((s, i) => (
                <div key={i} style={{ fontSize: 8.5, opacity: 0.85, marginBottom: 3 }}>
                  • {s.name}{s.level ? ` (${s.level})` : ""}
                </div>
              ))}
            </SideSection>
          </div>
        )}

        {certs.length > 0 && (
          <div style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
            <SideSection title="Certifications" color="#fff">
              {certs.map((c, i) => (
                <div key={i} style={{ fontSize: 8.5, opacity: 0.85, marginBottom: 3 }}>
                  • {c.name}
                </div>
              ))}
            </SideSection>
          </div>
        )}
      </div>

      {/* RIGHT CONTENT AREA */}
      <div style={{ flex: 1, padding: "24px 20px" }}>
        {summary && (
          <div style={{ pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
            <ModSection title="Profile" accent={accent}>
              <p style={{ margin: 0, fontSize: 10, color: "#444", lineHeight: 1.5 }}>{summary}</p>
            </ModSection>
          </div>
        )}

        {experiences.length > 0 && (
          <ModSection title="Experience" accent={accent}>
            {experiences.map((exp, i) => <ExpItem key={i} exp={exp} />)}
          </ModSection>
        )}

        {educations.length > 0 && (
          <ModSection title="Education" accent={accent}>
            {educations.map((edu, i) => <EduItem key={i} edu={edu} />)}
          </ModSection>
        )}

        {projects.length > 0 && (
          <ModSection title="Projects" accent={accent}>
            {projects.map((p, i) => <ProjItem key={i} p={p} />)}
          </ModSection>
        )}

        <EmptyState resume={resume} experiences={experiences} educations={educations} />
      </div>
    </div>
  );
}

function TemplateClassic({ resume, experiences, educations, skills, projects, certs }) {
  const { full_name, professional_title, email, phone, location, linkedin, summary } = resume;

  // Goldilocks section header - balanced margins
  const ClassicSection = ({ title }) => (
    <div style={{ marginBottom: 8, marginTop: 14 }}>
      <h2 style={{ 
        fontSize: 13.5, 
        fontWeight: 900, 
        color: "#111", 
        margin: 0, 
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        borderBottom: "1.5px solid #111",
        paddingBottom: 3
      }}>
        {title}
      </h2>
    </div>
  );

  return (
    // MIDDLE GROUND: 11 base font, 1.45 line height, balanced 24px 40px padding
    <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 11, color: "#222", lineHeight: 1.45, padding: "24px 40px", background: "#fff", minHeight: "100%", boxSizing: "border-box" }}>
      
      {/* HEADER SECTION */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 4px", color: "#111", letterSpacing: "0.02em" }}>
          {full_name || <span style={{ opacity: 0.5 }}>Andrew O'Sullivan</span>}
        </h1>
        {professional_title && <div style={{ fontSize: 15, color: "#444", fontStyle: "italic", marginBottom: 10 }}>{professional_title}</div>}
        
        {/* Contact Info Row */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 18px", fontSize: 11, color: "#111", fontWeight: 600 }}>
          {location && <span style={{ display: "flex", alignItems: "center", gap: 4 }}>📍 {location}</span>}
          {email && <span style={{ display: "flex", alignItems: "center", gap: 4 }}>✉ {email}</span>}
          {phone && <span style={{ display: "flex", alignItems: "center", gap: 4 }}>📞 {phone}</span>}
          {linkedin && <span style={{ display: "flex", alignItems: "center", gap: 4 }}>in {linkedin}</span>}
        </div>
      </div>

      {/* SUMMARY */}
      {summary && (
        <div style={{ pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
          <ClassicSection title="Profile" />
          <p style={{ margin: 0, color: "#222", lineHeight: 1.5, textAlign: "justify" }}>{summary}</p>
        </div>
      )}

      {/* EXPERIENCE */}
      {experiences.length > 0 && (
        <div>
          <ClassicSection title="Professional Experience" />
          {experiences.map((exp, i) => (
            <div key={i} style={{ marginBottom: 12, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontSize: 12.5, color: "#111", fontWeight: 900 }}>
                  {exp.role}
                </div>
                <div style={{ fontSize: 11, color: "#555" }}>
                  {exp.start_date} – {exp.end_date || "Present"}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
                <div style={{ fontSize: 11.5, color: "#444", fontStyle: "italic" }}>
                  {exp.company}
                </div>
                {exp.location && <div style={{ fontSize: 11, color: "#555" }}>{exp.location}</div>}
              </div>
              {exp.description && (
                <div style={{ color: "#222", lineHeight: 1.45, marginTop: 3, paddingLeft: 8 }}>
                  • {exp.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* EDUCATION */}
      {educations.length > 0 && (
        <div>
          <ClassicSection title="Education" />
          {educations.map((edu, i) => (
            <div key={i} style={{ marginBottom: 10, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontSize: 12.5, color: "#111", fontWeight: 900 }}>
                  {edu.degree}
                </div>
                <div style={{ fontSize: 11, color: "#555" }}>
                  {edu.start_year} – {edu.end_year}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontSize: 11.5, color: "#444", fontStyle: "italic" }}>
                  {edu.institution}
                </div>
                {edu.location && <div style={{ fontSize: 11, color: "#555" }}>{edu.location}</div>}
              </div>
              {edu.score && <div style={{ fontSize: 10.5, color: "#555", marginTop: 2, fontWeight: 600 }}>{edu.score}</div>}
            </div>
          ))}
        </div>
      )}

      {/* SKILLS */}
      {skills.length > 0 && (
        <div style={{ pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
          <ClassicSection title="Skills" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 20px", paddingLeft: 8 }}>
            {skills.map((s, i) => (
              <div key={i} style={{ display: "flex", fontSize: 11, color: "#222" }}>
                <span style={{ marginRight: 6, fontWeight: 900 }}>•</span>
                <span>
                  <span style={{ fontWeight: 600 }}>{s.name}</span>
                  {s.level && <span style={{ color: "#555" }}> - {s.level}</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <div>
          <ClassicSection title="Projects" />
          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: 10, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 900, fontSize: 12, color: "#111" }}>{p.title}</span>
                {p.link && <a href={p.link} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "#111" }}>View Link</a>}
              </div>
              {p.tech_stack && <div style={{ fontSize: 11, color: "#444", fontStyle: "italic", marginBottom: 2 }}>{p.tech_stack}</div>}
              {p.description && <div style={{ fontSize: 11, color: "#222", lineHeight: 1.45, paddingLeft: 8 }}>• {p.description}</div>}
            </div>
          ))}
        </div>
      )}

      {/* CERTIFICATIONS / AWARDS */}
      {certs.length > 0 && (
        <div>
          <ClassicSection title="Awards & Certifications" />
          {certs.map((c, i) => (
            <div key={i} style={{ marginBottom: 8, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
              <div style={{ fontWeight: 900, fontSize: 11.5, color: "#111" }}>{c.name}</div>
              <div style={{ color: "#444", fontSize: 11, fontStyle: "italic" }}>
                {c.issuer} {c.issue_date && `— ${c.issue_date}`}
              </div>
            </div>
          ))}
        </div>
      )}

      <EmptyState resume={resume} experiences={experiences} educations={educations} />
    </div>
  );
}

function TemplateBanking({ resume, experiences, educations, skills, projects, certs }) {
  const { full_name, professional_title, email, phone, location, linkedin, summary } = resume;
  const grayBg = "#e5e7eb";

  // Goldilocks Section Header (Tightened margins)
  const BankSection = ({ title }) => (
    <div style={{ background: grayBg, padding: "4px 0", marginBottom: 10, marginTop: 14, pageBreakInside: "avoid", breakInside: "avoid" }}>
      <h2 style={{ fontSize: 12.5, fontWeight: 800, color: "#111", margin: 0, textAlign: "center", letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {title}
      </h2>
    </div>
  );

  return (
    // MAX COMPRESSION / GOLDILOCKS: 10.5 base font, 1.4 line-height, balanced 20px 36px padding
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: 10.5, color: "#222", lineHeight: 1.4, padding: "20px 36px", background: "#fff", minHeight: "100%", boxSizing: "border-box" }}>

      {/* HEADER SECTION - Left Aligned */}
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 4px", color: "#000", letterSpacing: "-0.01em" }}>
          {full_name || <span style={{ opacity: 0.5 }}>Andrew Kim</span>}
        </h1>
        {professional_title && <div style={{ fontSize: 13.5, color: "#333", marginBottom: 8 }}>{professional_title}</div>}

        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", fontSize: 10.5, color: "#333", fontWeight: 600 }}>
          {[email, phone, location, linkedin].filter(Boolean).map((item, idx, arr) => (
            <span key={idx}>
              {item} {idx < arr.length - 1 && <span style={{ margin: "0 6px" }}>•</span>}
            </span>
          ))}
        </div>
      </div>

      {/* SUMMARY */}
      {summary && (
        <div style={{ pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
          <BankSection title="Profile" />
          <p style={{ margin: 0, color: "#222", lineHeight: 1.45, textAlign: "justify" }}>{summary}</p>
        </div>
      )}

      {/* EXPERIENCE - 2 Column Split */}
      {experiences.length > 0 && (
        <div>
          <BankSection title="Work Experience" />
          {experiences.map((exp, i) => (
            // PDF FIX: Protective wrapper around the flex layout
            <div key={i} style={{ marginBottom: 12, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
              <div style={{ display: "flex", gap: 20 }}>
                {/* Left Column: Dates & Location */}
                <div style={{ width: "20%", flexShrink: 0, fontSize: 10.5, color: "#444" }}>
                  <div style={{ fontWeight: 600 }}>{exp.start_date} – {exp.end_date || "Present"}</div>
                  {exp.location && <div style={{ marginTop: 2 }}>{exp.location}</div>}
                </div>
                {/* Right Column: Details */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: "#000" }}>{exp.role}</div>
                  <div style={{ fontSize: 10.5, fontStyle: "italic", color: "#333", marginBottom: 3 }}>{exp.company}</div>
                  {exp.description && <div style={{ color: "#222", lineHeight: 1.4 }}>• {exp.description}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDUCATION - 2 Column Split */}
      {educations.length > 0 && (
        <div>
          <BankSection title="Education" />
          {educations.map((edu, i) => (
            // PDF FIX: Protective wrapper around the flex layout
            <div key={i} style={{ marginBottom: 10, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
              <div style={{ display: "flex", gap: 20 }}>
                {/* Left Column: Dates & Location */}
                <div style={{ width: "20%", flexShrink: 0, fontSize: 10.5, color: "#444" }}>
                  <div style={{ fontWeight: 600 }}>{edu.start_year} – {edu.end_year}</div>
                  {edu.location && <div style={{ marginTop: 2 }}>{edu.location}</div>}
                </div>
                {/* Right Column: Details */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: "#000" }}>{edu.degree}</div>
                  <div style={{ fontSize: 10.5, fontStyle: "italic", color: "#333" }}>{edu.institution}</div>
                  {edu.score && <div style={{ fontSize: 10.5, color: "#555", marginTop: 2, fontWeight: 600 }}>{edu.score}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SKILLS - 2x2 Grid */}
      {skills.length > 0 && (
        <div style={{ pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
          <BankSection title="Skills" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px" }}>
            {skills.map((s, i) => (
              <div key={i}>
                <div style={{ fontWeight: 800, fontSize: 10.5, color: "#000" }}>{s.name}</div>
                {s.level && <div style={{ fontSize: 10, fontStyle: "italic", color: "#444", marginTop: 1 }}>{s.level}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CERTIFICATES / PROJECTS - 2x2 Grid */}
      {(certs.length > 0 || projects.length > 0) && (
        <div>
          <BankSection title={certs.length > 0 ? "Certificates & Projects" : "Projects"} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px" }}>
            
            {certs.map((c, i) => (
              <div key={`c${i}`} style={{ pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
                <div style={{ fontWeight: 800, fontSize: 11, color: "#000" }}>{c.name}</div>
                <div style={{ fontSize: 10, fontStyle: "italic", color: "#444", marginTop: 2 }}>
                   {c.issuer} {c.issue_date && `| ${c.issue_date}`}
                </div>
              </div>
            ))}

            {projects.map((p, i) => (
              <div key={`p${i}`} style={{ pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
                {/* PROJECT LINK ADDED HERE */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontWeight: 800, fontSize: 11, color: "#000" }}>{p.title}</div>
                  {p.link && <a href={p.link} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: "#000", fontWeight: 700 }}>View Link</a>}
                </div>
                {p.tech_stack && <div style={{ fontSize: 10, fontStyle: "italic", color: "#444", marginTop: 2 }}>{p.tech_stack}</div>}
                {p.description && <div style={{ fontSize: 10.5, color: "#222", marginTop: 3, lineHeight: 1.4 }}>• {p.description}</div>}
              </div>
            ))}

          </div>
        </div>
      )}

      <EmptyState resume={resume} experiences={experiences} educations={educations} />
    </div>
  );
}

function TemplateQuietBlue({ resume, experiences, educations, skills, projects, certs }) {
  const { full_name, professional_title, email, phone, location, linkedin, summary } = resume;
  const borderBlue = "#bce3ff"; // Light sky blue for borders
  const iconBlue = "#8ab4f8"; // Blue for the small icons

  // Double-bordered centered section header (Tightened margins)
  const QuietSection = ({ title }) => (
    <div style={{ 
      textAlign: "center", 
      borderTop: `2px solid ${borderBlue}`, 
      borderBottom: `2px solid ${borderBlue}`, 
      padding: "4px 0", 
      margin: "12px 0 10px 0",
      pageBreakInside: "avoid", 
      breakInside: "avoid"
    }}>
      <span style={{ fontSize: "12.5px", fontWeight: "bold", color: "#000", letterSpacing: "0.05em", textTransform: "uppercase" }}>{title}</span>
    </div>
  );

  return (
    // MAX COMPRESSION / GOLDILOCKS: 10.5 font, 1.4 line-height, balanced 20px 36px padding
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: 10.5, color: "#222", lineHeight: 1.4, padding: "20px 36px", background: "#fff", minHeight: "100%", boxSizing: "border-box" }}>
      
      {/* EXACT LEFT-ALIGNED HEADER */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 28, fontWeight: "bold", color: "#000", margin: 0 }}>
            {full_name || "Rohan Sharma"}
          </h1>
          {professional_title && (
            <span style={{ fontSize: 15, color: "#555", fontStyle: "italic" }}>
              {professional_title}
            </span>
          )}
        </div>
        
        {/* Contact Info */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 16px", fontSize: 10.5, color: "#555", marginTop: 6 }}>
          {email && <span style={{ display: "flex", alignItems: "center" }}><span style={{color: iconBlue, marginRight: 4, fontSize: 13}}>✉</span>{email}</span>}
          {phone && <span style={{ display: "flex", alignItems: "center" }}><span style={{color: iconBlue, marginRight: 4, fontSize: 13}}>📞</span>{phone}</span>}
          {location && <span style={{ display: "flex", alignItems: "center" }}><span style={{color: iconBlue, marginRight: 4, fontSize: 13}}>📍</span>{location}</span>}
          {linkedin && <span style={{ display: "flex", alignItems: "center" }}><span style={{color: iconBlue, marginRight: 4, fontSize: 13}}>in</span>{linkedin}</span>}
        </div>
      </div>

      {/* SUMMARY */}
      {summary && (
        <div style={{ pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
          <QuietSection title="Summary" />
          <p style={{ margin: 0, color: "#222", lineHeight: 1.45, textAlign: "justify" }}>{summary}</p>
        </div>
      )}

      {/* EXPERIENCE */}
      {experiences.length > 0 && (
        <div>
          <QuietSection title="Professional Experience" />
          {experiences.map((exp, i) => (
            <div key={i} style={{ marginBottom: 12, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontSize: 12, color: "#000", fontWeight: "bold" }}>{exp.role}</div>
                <div style={{ fontSize: 10.5, color: "#555" }}>
                  {exp.start_date} – {exp.end_date || "Present"} {exp.location && `| ${exp.location}`}
                </div>
              </div>
              <div style={{ fontSize: 11, color: "#333", fontStyle: "italic", marginBottom: 3 }}>{exp.company}</div>
              
              {/* Preserves line breaks for Role: and bullet points */}
              {exp.description && (
                <div style={{ color: "#222", lineHeight: 1.4, whiteSpace: "pre-wrap" }}>
                  {exp.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* EDUCATION */}
      {educations.length > 0 && (
        <div>
          <QuietSection title="Education" />
          {educations.map((edu, i) => (
            <div key={i} style={{ marginBottom: 10, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontSize: 12, color: "#000", fontWeight: "bold" }}>{edu.degree}</div>
                <div style={{ fontSize: 10.5, color: "#555" }}>{edu.end_year || edu.start_year}</div>
              </div>
              <div style={{ fontSize: 11, color: "#333", fontStyle: "italic" }}>{edu.institution}</div>
              {edu.score && <div style={{ fontSize: 10, color: "#555", marginTop: 2, fontWeight: 600 }}>{edu.score}</div>}
            </div>
          ))}
        </div>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <div>
          <QuietSection title="Projects" />
          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: 10, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontSize: 12, color: "#000", fontWeight: "bold" }}>{p.title}</div>
                {p.link && <a href={p.link} target="_blank" rel="noreferrer" style={{ fontSize: 10.5, color: iconBlue, textDecoration: "none", fontWeight: 700 }}>View Link</a>}
              </div>
              {p.tech_stack && <div style={{ fontSize: 11, color: "#333", fontStyle: "italic", marginBottom: 2 }}>{p.tech_stack}</div>}
              {p.description && <div style={{ color: "#222", lineHeight: 1.4, whiteSpace: "pre-wrap" }}>{p.description}</div>}
            </div>
          ))}
        </div>
      )}

      {/* SKILLS */}
      {skills.length > 0 && (
        <div style={{ pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
          <QuietSection title="Skills" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px" }}>
            {skills.map((s, i) => (
              <div key={i} style={{ fontSize: 10.5, color: "#222" }}>
                <span style={{ fontWeight: "bold" }}>{s.name}</span>
                {s.level && <span style={{ color: "#555" }}> — {s.level}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CERTIFICATIONS */}
      {certs.length > 0 && (
        <div>
          <QuietSection title="Certifications" />
          {certs.map((c, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, pageBreakInside: "avoid", breakInside: "avoid", width: "100%" }}>
              <div style={{ fontWeight: "bold", fontSize: 11, color: "#000" }}>{c.name}</div>
              <div style={{ color: "#444", fontSize: 10.5 }}>
                {c.issuer && `${c.issuer} `}
                {c.issue_date && `| ${c.issue_date}`}
              </div>
            </div>
          ))}
        </div>
      )}

      <EmptyState resume={resume} experiences={experiences} educations={educations} />
    </div>
  );
}

function TemplateHunterGreen({ resume, experiences, educations, skills, projects, certs }) {
  const { full_name, professional_title, email, phone, location, linkedin, summary } = resume;
  const hunter = "#385243"; // Deep olive / hunter green

  // Goldilocks Section Header (Tightened margins)
  const HunterSection = ({ title, isDark }) => (
    <div style={{ marginBottom: 12, pageBreakInside: "avoid", breakInside: "avoid" }}>
      <h2 style={{ 
        fontSize: 13, 
        fontWeight: 800, 
        color: isDark ? "#fff" : "#111", 
        margin: 0, 
        letterSpacing: "0.02em",
        borderBottom: `2px solid ${isDark ? "rgba(255,255,255,0.4)" : "#333"}`,
        paddingBottom: 3,
        marginBottom: 10
      }}>
        {title}
      </h2>
    </div>
  );

  return (
    // MAX COMPRESSION / GOLDILOCKS: 10.5 font, 1.4 line-height, balanced padding
    <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 10.5, lineHeight: 1.4, background: "#fff", minHeight: "100%", display: "flex", boxSizing: "border-box" }}>
      
      {/* LEFT COLUMN - HUNTER GREEN (Tightened padding to 24px 24px) */}
      <div style={{ width: "35%", background: hunter, padding: "24px 24px", color: "#fff", flexShrink: 0 }}>
        
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 6px", color: "#fff", lineHeight: 1.1 }}>
            {full_name || "Brian T. Wayne"}
          </h1>
          {professional_title && <div style={{ fontSize: 13.5, fontStyle: "italic", color: "#e2e8f0", marginBottom: 16 }}>{professional_title}</div>}
          
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 10.5, color: "#cbd5e1" }}>
            {email && <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span>✉</span> {email}</div>}
            {phone && <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span>📞</span> {phone}</div>}
            {location && <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}><span>📍</span> <span>{location}</span></div>}
            {linkedin && <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span>🔗</span> {linkedin}</div>}
          </div>
        </div>

        {summary && (
          <div style={{ marginBottom: 24, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
            <HunterSection title="Profile" isDark={true} />
            <p style={{ margin: 0, color: "#cbd5e1", lineHeight: 1.45, textAlign: "justify" }}>{summary}</p>
          </div>
        )}

        {educations.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <HunterSection title="Education" isDark={true} />
            {educations.map((edu, i) => (
              <div key={i} style={{ marginBottom: 12, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
                <div style={{ fontWeight: 800, fontSize: 11, color: "#fff", marginBottom: 2 }}>{edu.degree}</div>
                <div style={{ color: "#e2e8f0", fontStyle: "italic", marginBottom: 2, fontSize: 10.5 }}>{edu.institution}</div>
                <div style={{ color: "#cbd5e1", fontSize: 10 }}>{edu.start_year} – {edu.end_year}</div>
                {edu.score && <div style={{ fontSize: 10, color: "#cbd5e1", marginTop: 2, fontWeight: 600 }}>{edu.score}</div>}
              </div>
            ))}
          </div>
        )}

      </div>

      {/* RIGHT COLUMN - WHITE (Tightened padding to 24px 28px) */}
      <div style={{ flex: 1, padding: "24px 28px" }}>
        
        {experiences.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <HunterSection title="Professional Experience" isDark={false} />
            {experiences.map((exp, i) => (
              <div key={i} style={{ marginBottom: 14, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
                <div style={{ fontWeight: 800, fontSize: 12, color: "#111" }}>{exp.role}</div>
                <div style={{ color: "#555", fontSize: 10.5, fontStyle: "italic", marginBottom: 3 }}>
                  {exp.company} | {exp.start_date} – {exp.end_date || "Present"}
                </div>
                {exp.description && <div style={{ color: "#333", lineHeight: 1.4, marginTop: 4 }}>• {exp.description}</div>}
              </div>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <HunterSection title="Projects" isDark={false} />
            {projects.map((p, i) => (
              <div key={i} style={{ marginBottom: 12, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: 800, fontSize: 11.5, color: "#111" }}>{p.title}</span>
                  {p.link && <a href={p.link} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: hunter, fontWeight: 700, textDecoration: "none" }}>View Link</a>}
                </div>
                {p.tech_stack && <div style={{ color: "#555", fontSize: 10, fontStyle: "italic", marginBottom: 2 }}>{p.tech_stack}</div>}
                {p.description && <div style={{ color: "#333", lineHeight: 1.4, marginTop: 3 }}>• {p.description}</div>}
              </div>
            ))}
          </div>
        )}

        {skills.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <HunterSection title="Skills" isDark={false} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", color: "#333", fontSize: 10.5, pageBreakInside: "avoid", breakInside: "avoid" }}>
              {skills.map((s, i) => (
                <div key={i}>
                  • <span style={{ fontWeight: 600 }}>{s.name}</span> {s.level ? `(${s.level})` : ""}
                </div>
              ))}
            </div>
          </div>
        )}

        {certs.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <HunterSection title="Awards & Certifications" isDark={false} />
            {certs.map((c, i) => (
              <div key={i} style={{ marginBottom: 8, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
                <div style={{ fontWeight: 800, fontSize: 11, color: "#111", marginBottom: 1 }}>{c.name}</div>
                <div style={{ color: "#555", fontSize: 10, fontStyle: "italic" }}>
                  {c.issuer} {c.issue_date && `| ${c.issue_date}`}
                </div>
              </div>
            ))}
          </div>
        )}

        <EmptyState resume={resume} experiences={experiences} educations={educations} />
      </div>

    </div>
  );
}

function TemplateSilver({ resume, experiences, educations, skills, projects, certs }) {
  const { full_name, professional_title, email, phone, location, linkedin, summary } = resume;
  const grayBg = "#f3f4f6";

  // Goldilocks Section Header (Tightened margins)
  const SilverSection = ({ title }) => (
    <div style={{ 
      background: grayBg, 
      padding: "4px 0", 
      marginBottom: 10, 
      marginTop: 14, 
      pageBreakInside: "avoid", 
      breakInside: "avoid" 
    }}>
      <h2 style={{ fontSize: 12.5, fontWeight: 800, color: "#111", margin: 0, textAlign: "center", letterSpacing: "0.02em", textTransform: "uppercase" }}>
        {title}
      </h2>
    </div>
  );

  return (
    // MAX COMPRESSION / GOLDILOCKS: 10.5 base font, 1.4 line-height, balanced 20px 36px padding
    <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 10.5, color: "#222", lineHeight: 1.4, padding: "20px 36px", background: "#fff", minHeight: "100%", boxSizing: "border-box" }}>
      
      {/* HEADER SECTION */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 4px", color: "#111", letterSpacing: "0.02em" }}>
          {full_name || <span style={{ opacity: 0.5 }}>David Chen</span>}
        </h1>
        {professional_title && <div style={{ fontSize: 14, color: "#333", marginBottom: 10 }}>{professional_title}</div>}
        
        {/* Contact Info - Split left and right */}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#111", fontWeight: 600 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {location && <span style={{ display: "flex", alignItems: "center", gap: 6 }}>📍 {location}</span>}
            {phone && <span style={{ display: "flex", alignItems: "center", gap: 6 }}>📞 {phone}</span>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3, textAlign: "right", alignItems: "flex-end" }}>
            {email && <span style={{ display: "flex", alignItems: "center", gap: 6 }}>✉ {email}</span>}
            {linkedin && <span style={{ display: "flex", alignItems: "center", gap: 6 }}>🔗 {linkedin}</span>}
          </div>
        </div>
      </div>

      {/* SUMMARY */}
      {summary && (
        <div style={{ pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
          <SilverSection title="Profile" />
          <p style={{ margin: 0, color: "#333", lineHeight: 1.45, textAlign: "justify" }}>{summary}</p>
        </div>
      )}

      {/* EXPERIENCE */}
      {experiences.length > 0 && (
        <div>
          <SilverSection title="Work Experience" />
          {experiences.map((exp, i) => (
            <div key={i} style={{ marginBottom: 12, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontSize: 11.5, color: "#111" }}>
                  <span style={{ fontWeight: 800 }}>{exp.role}</span>
                  {exp.company && <span>, {exp.company}</span>}
                </div>
                <div style={{ fontSize: 10, color: "#333", textAlign: "right", lineHeight: 1.3 }}>
                  <div style={{ fontWeight: 600 }}>{exp.start_date} – {exp.end_date || "Present"}</div>
                  {exp.location && <div>{exp.location}</div>}
                </div>
              </div>
              {exp.description && <div style={{ marginTop: 3, color: "#333", lineHeight: 1.4 }}>• {exp.description}</div>}
            </div>
          ))}
        </div>
      )}

      {/* EDUCATION */}
      {educations.length > 0 && (
        <div>
          <SilverSection title="Education" />
          {educations.map((edu, i) => (
            <div key={i} style={{ marginBottom: 10, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontSize: 11.5, color: "#111" }}>
                  <span style={{ fontWeight: 800 }}>{edu.degree}</span>
                  {edu.institution && <span>, {edu.institution}</span>}
                </div>
                <div style={{ fontSize: 10, color: "#333", textAlign: "right", lineHeight: 1.3 }}>
                  <div style={{ fontWeight: 600 }}>{edu.start_year} – {edu.end_year}</div>
                  {edu.location && <div>{edu.location}</div>}
                </div>
              </div>
              {edu.score && <div style={{ fontSize: 10, color: "#555", marginTop: 2, fontWeight: 600 }}>{edu.score}</div>}
            </div>
          ))}
        </div>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <div>
          <SilverSection title="Projects" />
          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: 10, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontSize: 11.5, color: "#111" }}>
                  <span style={{ fontWeight: 800 }}>{p.title}</span>
                  {p.tech_stack && <span style={{ fontStyle: "italic", color: "#555" }}> | {p.tech_stack}</span>}
                </div>
                {p.link && <a href={p.link} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: "#111", fontWeight: 700 }}>View Link</a>}
              </div>
              {p.description && <div style={{ marginTop: 3, color: "#333", lineHeight: 1.4 }}>• {p.description}</div>}
            </div>
          ))}
        </div>
      )}

      {/* SKILLS - 2 Column Layout */}
      {skills.length > 0 && (
        <div style={{ pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
          <SilverSection title="Skills" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px" }}>
            {skills.map((s, i) => (
              <div key={i} style={{ display: "flex", fontSize: 10.5, color: "#222" }}>
                <span style={{ marginRight: 6 }}>•</span>
                <span>
                  <span style={{ fontWeight: 600 }}>{s.name}</span>
                  {s.level && <span style={{ color: "#555" }}> - {s.level}</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CERTIFICATIONS */}
      {certs.length > 0 && (
        <div>
          <SilverSection title="Certifications" />
          {certs.map((c, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, pageBreakInside: "avoid", breakInside: "avoid", width: "100%" }}>
              <div style={{ fontWeight: 800, fontSize: 11, color: "#111" }}>{c.name}</div>
              <div style={{ color: "#444", fontSize: 10.5 }}>
                {c.issuer && `${c.issuer} `}
                {c.issue_date && `| ${c.issue_date}`}
              </div>
            </div>
          ))}
        </div>
      )}

      <EmptyState resume={resume} experiences={experiences} educations={educations} />
    </div>
  );
}

function TemplateSlateDawn({ resume, experiences, educations, skills, projects, certs }) {
  const { full_name, professional_title, email, phone, location, linkedin, summary } = resume;
  const navy = "#1e3a8a";
  const slateBg = "#eef2f6"; // Light slate blue matching the header

  // Goldilocks Section Header (Tightened margins)
  const SlateSection = ({ title }) => (
    <div style={{ marginBottom: 12 }}>
      <h2 style={{ 
        fontSize: 12.5, 
        fontWeight: 800, 
        color: navy, 
        textTransform: "uppercase",
        borderBottom: `2px solid ${navy}`, 
        paddingBottom: 3, 
        marginBottom: 8,
        letterSpacing: "0.05em"
      }}>
        {title}
      </h2>
    </div>
  );

  return (
    // MAX COMPRESSION / GOLDILOCKS: 10.5 base font, 1.4 line-height
    <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 10.5, color: "#222", lineHeight: 1.4, background: "#fff", minHeight: "100%", boxSizing: "border-box" }}>
      
      {/* HEADER SECTION (Light Slate Blue) - Tightened padding */}
      <div style={{ background: slateBg, padding: "24px 36px 18px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 6px", color: navy, letterSpacing: "0.02em" }}>
          {full_name || <span style={{ opacity: 0.6 }}>Alessandro Ricci</span>} 
          {professional_title && <span style={{ fontSize: 16, fontWeight: 400, color: navy, marginLeft: 8 }}>{professional_title}</span>}
        </h1>
        
        {/* Contact Info Row separated by | */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", fontSize: 10.5, color: "#444" }}>
          {[email, phone, location, linkedin].filter(Boolean).map((item, index, arr) => (
            <span key={index}>
              {item} {index < arr.length - 1 && <span style={{ margin: "0 4px", color: "#999" }}>|</span>}
            </span>
          ))}
        </div>
      </div>

      {/* TWO COLUMN BODY SECTION - Tightened padding */}
      <div style={{ padding: "20px 36px", display: "flex", gap: 32 }}>
        
        {/* LEFT COLUMN */}
        <div style={{ flex: 1 }}>
          
          {/* Summary / Profile */}
          {summary && (
            <div style={{ marginBottom: 20, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
              <SlateSection title="Profile" />
              <p style={{ margin: 0, color: "#333", lineHeight: 1.45, textAlign: "justify" }}>{summary}</p>
            </div>
          )}

          {/* Education */}
          {educations.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <SlateSection title="Education" />
              {educations.map((edu, i) => (
                <div key={i} style={{ marginBottom: 10, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
                  <div style={{ fontWeight: 800, fontSize: 11.5, color: "#111" }}>{edu.degree}</div>
                  <div style={{ color: "#333", fontSize: 10.5 }}>{edu.institution}</div>
                  {edu.score && <div style={{ fontSize: 10, color: "#555", marginTop: 2, fontWeight: 600 }}>{edu.score}</div>}
                </div>
              ))}
            </div>
          )}

          {/* Projects (Maps to "Academic Research" visually in the template) */}
          {projects.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <SlateSection title="Academic Research" />
              {projects.map((p, i) => (
                <div key={i} style={{ marginBottom: 12, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div style={{ fontWeight: 800, fontSize: 11.5, color: "#111" }}>{p.title}</div>
                    {p.link && <a href={p.link} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: navy, fontWeight: 700, textDecoration: "none" }}>Link</a>}
                  </div>
                  <div style={{ fontSize: 10, color: "#555", marginBottom: 2, fontStyle: "italic" }}>{p.tech_stack}</div>
                  {p.description && <div style={{ color: "#444", lineHeight: 1.4, marginTop: 2 }}>• {p.description}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ flex: 1 }}>
          
          {/* Professional Experience */}
          {experiences.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <SlateSection title="Professional Experience" />
              {experiences.map((exp, i) => (
                <div key={i} style={{ marginBottom: 12, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
                  <div style={{ fontWeight: 800, fontSize: 11.5, color: "#111" }}>{exp.role}</div>
                  <div style={{ color: "#444", fontSize: 10.5 }}>{exp.company}</div>
                  <div style={{ fontSize: 10, color: "#666", marginBottom: 3, fontStyle: "italic" }}>{exp.start_date} – {exp.end_date || "Present"}</div>
                  {exp.description && <div style={{ color: "#444", lineHeight: 1.4, marginTop: 2 }}>• {exp.description}</div>}
                </div>
              ))}
            </div>
          )}

          {/* Certifications (Maps to "Licensure & Certification") */}
          {certs.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <SlateSection title="Licensure & Certification" />
              {certs.map((c, i) => (
                <div key={i} style={{ marginBottom: 8, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
                  <span style={{ fontWeight: 800, fontSize: 11, color: "#111" }}>{c.name}</span>
                  <div style={{ color: "#555", fontSize: 10, fontStyle: "italic" }}>{c.issuer || "Passed"} | {c.issue_date}</div>
                </div>
              ))}
            </div>
          )}

          {/* Skills (Maps to "Languages" visually in the template) */}
          {skills.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <SlateSection title="Skills & Languages" />
              <div style={{ display: "flex", flexDirection: "column", gap: 6, pageBreakInside: "avoid", breakInside: "avoid" }}>
                {skills.map((s, i) => (
                  <div key={i} style={{ fontSize: 10.5, color: "#222" }}>
                    <span style={{ fontWeight: 800 }}>{s.name}</span>
                    {s.level && <span style={{ color: "#555" }}>: {s.level}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
      
      <EmptyState resume={resume} experiences={experiences} educations={educations} />
    </div>
  );
}

function TemplateRosewood({ resume, experiences, educations, skills, projects, certs }) {
  const { full_name, professional_title, email, phone, location, linkedin, summary } = resume;
  const pink = "#d4669e";

  // Special section header for Rosewood with emojis
  const RoseSection = ({ title, icon, children }) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 800, background: "#f3f4f6", padding: "6px 12px", textAlign: "center", marginBottom: 12, letterSpacing: "0.05em", color: "#111", borderRadius: 4 }}>
        {icon} {title}
      </div>
      {children}
    </div>
  );

  return (
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#222", lineHeight: 1.6, padding: "36px 40px", background: "#fff", minHeight: "100%", border: `12px solid ${pink}`, boxSizing: "border-box" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 6px", color: "#111", letterSpacing: "0.02em" }}>{full_name || <span style={{ color: "#ccc" }}>Your Name</span>}</h1>
        {professional_title && <div style={{ fontSize: 14, color: "#555", fontStyle: "italic", marginBottom: 10 }}>{professional_title}</div>}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, fontSize: 11, color: "#666" }}>
          {email && <span>{email}</span>}{phone && <span>{phone}</span>}{location && <span>{location}</span>}{linkedin && <span>{linkedin}</span>}
        </div>
      </div>

      {summary && <RoseSection title="PROFILE" icon="🎓"><p style={{ margin: 0, fontSize: 11, lineHeight: 1.7 }}>{summary}</p></RoseSection>}
      {experiences.length > 0 && <RoseSection title="EXPERIENCE" icon="💼">{experiences.map((exp, i) => <ExpItem key={i} exp={exp} />)}</RoseSection>}
      {educations.length > 0 && <RoseSection title="EDUCATION" icon="📚">{educations.map((edu, i) => <EduItem key={i} edu={edu} />)}</RoseSection>}
      {skills.length > 0 && <RoseSection title="SKILLS" icon="⚡"><div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>{skills.map((s, i) => <span key={i} style={{ background: "#fff", border: `1px solid ${pink}50`, color: "#111", borderRadius: 20, padding: "3px 12px", fontSize: 10.5 }}>{s.name}{s.level ? ` (${s.level})` : ""}</span>)}</div></RoseSection>}
      {projects.length > 0 && <RoseSection title="PROJECTS" icon="🚀">{projects.map((p, i) => <ProjItem key={i} p={p} />)}</RoseSection>}
      {certs.length > 0 && <RoseSection title="CERTIFICATIONS" icon="🏆">{certs.map((c, i) => <CertItem key={i} c={c} />)}</RoseSection>}
      <EmptyState resume={resume} experiences={experiences} educations={educations} />
    </div>
  );
}

function TemplateHarvard({ resume, experiences, educations, skills, projects, certs }) {
  const { full_name, professional_title, email, phone, location, linkedin, summary } = resume;

  // Custom Harvard-style section header (bold, standard case, full black underline)
  const HarvardSection = ({ title }) => (
    <div style={{ marginBottom: 10, marginTop: 16 }}>
      <h2 style={{ 
        fontSize: 14, 
        fontWeight: "bold", 
        color: "#000", 
        margin: 0, 
        borderBottom: "1.5px solid #000",
        paddingBottom: 2
      }}>
        {title}
      </h2>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: 11.5, color: "#000", lineHeight: 1.5, padding: "40px 48px", background: "#fff", minHeight: "100%", boxSizing: "border-box" }}>
      
      {/* HEADER SECTION - Centered */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 28, fontWeight: "bold", margin: "0 0 4px", color: "#000" }}>
          {full_name || <span style={{ opacity: 0.5 }}>Lee Wang</span>}
        </h1>
        {professional_title && <div style={{ fontSize: 14, color: "#333", marginBottom: 6 }}>{professional_title}</div>}
        
        {/* Contact Info */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px", fontSize: 11 }}>
          {email && <span>✉ {email}</span>}
          {phone && <span>📞 {phone}</span>}
          {location && <span>📍 {location}</span>}
          {linkedin && <span>🔗 {linkedin}</span>}
        </div>
      </div>

      {/* SUMMARY */}
      {summary && (
        <div>
          <HarvardSection title="Professional Summary" />
          <p style={{ margin: 0, color: "#000", lineHeight: 1.5, textAlign: "justify" }}>{summary}</p>
        </div>
      )}

      {/* EDUCATION */}
      {educations.length > 0 && (
        <div>
          <HarvardSection title="Education" />
          {educations.map((edu, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontSize: 12, fontWeight: "bold" }}>{edu.institution}</div>
                <div style={{ fontSize: 11 }}>{edu.start_year} – {edu.end_year}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontSize: 11.5, fontStyle: "italic" }}>{edu.degree}</div>
                {edu.location && <div style={{ fontSize: 11 }}>{edu.location}</div>}
              </div>
              {edu.score && <div style={{ fontSize: 10.5, color: "#555", marginTop: 2, fontWeight: 600 }}>{edu.score}</div>}
            </div>
          ))}
        </div>
      )}

      {/* TECHNICAL SKILLS - 4 Column Grid */}
      {skills.length > 0 && (
        <div>
          <HarvardSection title="Technical Skills" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px 12px", marginTop: 6 }}>
            {skills.map((s, i) => (
              <div key={i} style={{ fontSize: 11, color: "#000" }}>
                • {s.name} {s.level ? `(${s.level})` : ""}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROFESSIONAL EXPERIENCE */}
      {experiences.length > 0 && (
        <div>
          <HarvardSection title="Professional Experience" />
          {experiences.map((exp, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontSize: 12, fontWeight: "bold" }}>{exp.company}</div>
                <div style={{ fontSize: 11 }}>{exp.start_date} – {exp.end_date || "present"}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                <div style={{ fontSize: 11.5, fontStyle: "italic" }}>{exp.role}</div>
                {exp.location && <div style={{ fontSize: 11 }}>{exp.location}</div>}
              </div>
              {exp.description && (
                <div style={{ color: "#000", lineHeight: 1.5, paddingLeft: 12, textIndent: -12 }}>
                  • {exp.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <div>
          <HarvardSection title="Academic & Personal Projects" />
          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontSize: 12, fontWeight: "bold" }}>{p.title}</div>
                {p.link && <a href={p.link} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "#000" }}>View Project</a>}
              </div>
              {p.tech_stack && <div style={{ fontSize: 11, fontStyle: "italic", marginBottom: 2 }}>{p.tech_stack}</div>}
              {p.description && (
                <div style={{ color: "#000", lineHeight: 1.5, paddingLeft: 12, textIndent: -12 }}>
                  • {p.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CERTIFICATIONS */}
      {certs.length > 0 && (
        <div>
          <HarvardSection title="Certifications" />
          {certs.map((c, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ fontWeight: "bold", fontSize: 11.5 }}>{c.name}</div>
              <div style={{ fontSize: 11 }}>
                {c.issuer} {c.issue_date && `| ${c.issue_date}`}
              </div>
            </div>
          ))}
        </div>
      )}

      <EmptyState resume={resume} experiences={experiences} educations={educations} />
    </div>
  );
}

function TemplateCreative({ resume, experiences, educations, skills, projects, certs }) {
  const { full_name, professional_title, email, phone, location, linkedin, summary } = resume;
  const purple = "#8b5cf6"; // Vivid purple

  // Custom section header with tightened margins
  const CreativeSection = ({ title, children }) => (
    <div style={{ marginBottom: 12 }}>
      <h2 style={{ 
        fontSize: 13, 
        fontWeight: 800, 
        color: purple, 
        textTransform: "uppercase",
        borderBottom: `2px solid ${purple}`, 
        paddingBottom: 3, 
        marginBottom: 8,
        letterSpacing: "0.05em"
      }}>
        {title}
      </h2>
      {children}
    </div>
  );

  return (
    // THE GOLDILOCKS: 10.5 font, 1.4 line-height, balanced 20px 36px outer padding.
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: 10.5, color: "#222", lineHeight: 1.4, background: "#fff", minHeight: "100%", boxSizing: "border-box" }}>
      
      {/* HEADER SECTION - Tightened padding */}
      <div style={{ background: purple, padding: "24px 36px", color: "#fff" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 4px", letterSpacing: "0.02em" }}>
          {full_name || <span style={{ opacity: 0.6 }}>Mateo Vargas</span>}
        </h1>
        {professional_title && <div style={{ fontSize: 15, opacity: 0.9, marginBottom: 10 }}>{professional_title}</div>}
        
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 16px", fontSize: 10.5, color: "#f1f5f9" }}>
          {email && <span>✉ {email}</span>}
          {phone && <span>📞 {phone}</span>}
          {location && <span>📍 {location}</span>}
          {linkedin && <span>🔗 {linkedin}</span>}
        </div>
      </div>

      {/* BODY SECTION - Tightened padding */}
      <div style={{ padding: "18px 36px" }}>
        
        {/* Summary */}
        {summary && (
          <div style={{ pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
            <CreativeSection title="Profile">
              <p style={{ margin: 0, color: "#333", lineHeight: 1.45, textAlign: "justify" }}>{summary}</p>
            </CreativeSection>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div>
            <CreativeSection title="Experience">
              {experiences.map((exp, i) => (
                <div key={i} style={{ marginBottom: 10, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div style={{ fontSize: 11.5, fontWeight: 800, color: "#111" }}>{exp.role}</div>
                    <div style={{ fontSize: 10, color: "#555" }}>{exp.start_date} – {exp.end_date || "Present"}</div>
                  </div>
                  <div style={{ fontSize: 10.5, color: "#444", fontStyle: "italic", marginBottom: 2 }}>{exp.company}</div>
                  {exp.description && <div style={{ color: "#333", lineHeight: 1.4 }}>• {exp.description}</div>}
                </div>
              ))}
            </CreativeSection>
          </div>
        )}

        {/* Education */}
        {educations.length > 0 && (
          <div>
            <CreativeSection title="Education">
              {educations.map((edu, i) => (
                <div key={i} style={{ marginBottom: 8, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#111" }}>{edu.degree}</div>
                    <div style={{ fontSize: 10, color: "#555" }}>{edu.start_year} – {edu.end_year}</div>
                  </div>
                  <div style={{ fontSize: 10.5, color: "#444" }}>{edu.institution} {edu.score && `| Score: ${edu.score}`}</div>
                </div>
              ))}
            </CreativeSection>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <CreativeSection title="Projects">
              {projects.map((p, i) => (
                <div key={i} style={{ marginBottom: 10, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div style={{ fontSize: 11.5, fontWeight: 800, color: "#111" }}>{p.title}</div>
                    {p.link && <a href={p.link} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: purple, fontWeight: 700, textDecoration: "none" }}>View Link</a>}
                  </div>
                  {p.tech_stack && <div style={{ fontSize: 10.5, color: "#555", fontStyle: "italic", marginBottom: 2 }}>{p.tech_stack}</div>}
                  {p.description && <div style={{ color: "#333", lineHeight: 1.4 }}>• {p.description}</div>}
                </div>
              ))}
            </CreativeSection>
          </div>
        )}

        {/* Skills - VERTICAL CENTERING FIX */}
        {skills.length > 0 && (
          <div style={{ pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
            <CreativeSection title="Skills">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {skills.map((s, i) => (
                  <div key={i} style={{ 
                    background: "#f3f4f6", 
                    color: "#333", 
                    border: "1px solid #e5e7eb", 
                    padding: "0 10px", 
                    height: "22px",           /* Strict height */
                    lineHeight: "22px",       /* Centering trick */
                    borderRadius: 4, 
                    fontSize: 10, 
                    fontWeight: 600,
                    display: "inline-block"   /* Prevents flex bugs */
                  }}>
                    {s.name} {s.level ? `(${s.level})` : ""}
                  </div>
                ))}
              </div>
            </CreativeSection>
          </div>
        )}

        {/* Certifications */}
        {certs.length > 0 && (
          <div>
            <CreativeSection title="Certifications">
              {certs.map((c, i) => (
                 <div key={i} style={{ marginBottom: 6, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
                   <span style={{ fontWeight: 800, fontSize: 11, color: "#111" }}>{c.name}</span>
                   <span style={{ color: "#555", fontSize: 10.5 }}>
                     {c.issuer && ` · ${c.issuer}`} {c.issue_date && ` · ${c.issue_date}`}
                   </span>
                 </div>
              ))}
            </CreativeSection>
          </div>
        )}

        <EmptyState resume={resume} experiences={experiences} educations={educations} />
      </div>
    </div>
  );
}

function TemplateBlackPattern({ resume, experiences, educations, skills, projects, certs }) {
  const { full_name, professional_title, email, phone, location, linkedin, summary } = resume;
  
  // PDF-SAFE STRIPES
  const darkPattern = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%231e293b' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`;

  // Goldilocks section header
  const PatternSection = ({ title, children }) => (
    <div style={{ marginBottom: 10 }}>
      <h2 style={{ 
        display: "inline-block", 
        fontSize: 13, 
        fontWeight: 900, 
        color: "#111", 
        borderBottom: "2px solid #111", 
        paddingBottom: 2, 
        marginBottom: 6,
        letterSpacing: "0.02em"
      }}>
        {title}
      </h2>
      {children}
    </div>
  );

  return (
    // THE TRUE GOLDILOCKS: 10.5 font, 1.4 line-height, balanced outer padding.
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: 10.5, color: "#222", lineHeight: 1.4, background: "#fff", minHeight: "100%", boxSizing: "border-box", overflow: "hidden" }}>
      
      {/* Header */}
      <div style={{ 
        backgroundColor: "#0f172a",       
        backgroundImage: darkPattern,     
        padding: "20px 36px", 
        boxSizing: "border-box", 
        color: "#fff",
        WebkitPrintColorAdjust: "exact",  
        printColorAdjust: "exact"
      }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 4px", position: "relative", letterSpacing: "0.02em" }}>
          {full_name || <span style={{ opacity: 0.5 }}>Catherine Bale</span>}
        </h1>
        {professional_title && <div style={{ fontSize: 13.5, fontStyle: "italic", color: "#cbd5e1", marginBottom: 10 }}>{professional_title}</div>}
        
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", fontSize: 10.5, color: "#94a3b8", fontWeight: 600 }}>
          {location && <span style={{ display: "flex", alignItems: "center", gap: 4 }}>📍 {location}</span>}
          {phone && <span style={{ display: "flex", alignItems: "center", gap: 4 }}>📞 {phone}</span>}
          {email && <span style={{ display: "flex", alignItems: "center", gap: 4 }}>✉ {email}</span>}
          {linkedin && <span style={{ display: "flex", alignItems: "center", gap: 4 }}>🔗 {linkedin}</span>}
        </div>
      </div>

      {/* Body Content */}
      <div style={{ padding: "16px 36px" }}>
        
        {/* Summary */}
        {summary && (
          <PatternSection title="Profile">
            <div style={{ pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
              <p style={{ margin: 0, color: "#333", lineHeight: 1.4, textAlign: "justify" }}>{summary}</p>
            </div>
          </PatternSection>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <PatternSection title="Professional Experience">
            {experiences.map((exp, i) => (
              <div key={i} style={{ marginBottom: 10, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontSize: 11.5, color: "#111" }}>
                    <span style={{ fontWeight: 800 }}>{exp.company}</span>
                    {exp.role && <span style={{ fontStyle: "italic" }}>, {exp.role}</span>}
                  </div>
                  <div style={{ fontSize: 10.5, color: "#555" }}>
                    {exp.start_date} – {exp.end_date || "Present"} 
                  </div>
                </div>
                {exp.description && <div style={{ marginTop: 2, color: "#333", lineHeight: 1.4 }}>{exp.description}</div>}
              </div>
            ))}
          </PatternSection>
        )}

        {/* Education */}
        {educations.length > 0 && (
          <PatternSection title="Education">
            {educations.map((edu, i) => (
              <div key={i} style={{ marginBottom: 8, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontSize: 11.5, color: "#111" }}>
                    <span style={{ fontWeight: 800 }}>{edu.degree}</span>
                    {edu.institution && <span style={{ fontStyle: "italic" }}>, {edu.institution}</span>}
                  </div>
                  <div style={{ fontSize: 10.5, color: "#555" }}>
                    {edu.start_year} – {edu.end_year}
                  </div>
                </div>
                {edu.score && <div style={{ fontSize: 10, color: "#555", marginTop: 2, fontWeight: 600 }}>{edu.score}</div>}
              </div>
            ))}
          </PatternSection>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <PatternSection title="Projects">
            {projects.map((p, i) => (
              <div key={i} style={{ marginBottom: 8, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontSize: 11.5, color: "#111" }}>
                    <span style={{ fontWeight: 800 }}>{p.title}</span>
                    {p.tech_stack && <span style={{ fontStyle: "italic", color: "#555" }}> | {p.tech_stack}</span>}
                  </div>
                  {p.link && <a href={p.link} target="_blank" rel="noreferrer" style={{ fontSize: 10.5, color: "#111" }}>View Project</a>}
                </div>
                {p.description && <div style={{ marginTop: 2, color: "#333", lineHeight: 1.4 }}>{p.description}</div>}
              </div>
            ))}
          </PatternSection>
        )}

        {/* Certifications - THE BULLETPROOF ALIGNMENT FIX */}
        {certs.length > 0 && (
          <PatternSection title="Certificates">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, pageBreakInside: "avoid", breakInside: "avoid", width: "100%" }}>
              {certs.map((c, i) => (
                <div key={i} style={{ 
                  background: "#111", 
                  color: "#fff", 
                  padding: "0 10px",          /* Removed vertical padding completely */
                  height: "22px",             /* Explicit height */
                  lineHeight: "22px",         /* Line-height matching height perfectly centers text */
                  borderRadius: 4, 
                  fontSize: 10, 
                  fontWeight: 700,
                  display: "inline-block"
                }}>
                  {c.name} {c.issue_date && `(${c.issue_date})`}
                </div>
              ))}
            </div>
          </PatternSection>
        )}

        {/* Skills - 2 Column Layout with Progress bars */}
        {skills.length > 0 && (
          <PatternSection title="Skills">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 20px", pageBreakInside: "avoid", breakInside: "avoid", width: "100%" }}>
              {skills.map((s, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                    <span style={{ fontWeight: 800, fontSize: 10.5, color: "#111" }}>{s.name}</span>
                    <div style={{ width: "40%", height: 3, background: "#e2e8f0", borderRadius: 2 }}>
                      <div style={{ width: s.level === "Expert" ? "100%" : s.level === "Advanced" ? "80%" : s.level === "Intermediate" ? "60%" : "40%", height: "100%", background: "#111", borderRadius: 2 }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PatternSection>
        )}

        <EmptyState resume={resume} experiences={experiences} educations={educations} />
      </div>
    </div>
  );
}

function TemplateAtlantic({ resume, experiences, educations, skills, projects, certs }) {
  const { full_name, professional_title, email, phone, location, linkedin, summary } = resume;
  const navy = "#313c4e";
  const coral = "#eb636b";

  // Goldilocks Section Header (Tightened margins)
  const AtlanticSection = ({ title, icon, isDark }) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <span style={{ fontSize: 13 }}>{icon}</span>
        <h2 style={{ fontSize: 12.5, fontWeight: 800, color: isDark ? "#fff" : navy, margin: 0, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          {title}
        </h2>
      </div>
      {/* Coral Dotted Underline representing the zig-zag */}
      <div style={{ borderBottom: `2px dotted ${coral}`, width: "100%", marginBottom: 8 }}></div>
    </div>
  );

  return (
    // MAX COMPRESSION / GOLDILOCKS: 10.5 font, 1.4 line-height
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: 10.5, lineHeight: 1.4, background: "#fff", minHeight: "100%", display: "flex", boxSizing: "border-box" }}>
      
      {/* LEFT COLUMN - NAVY (Tightened padding to 20px 24px) */}
      <div style={{ width: "35%", background: navy, padding: "20px 24px", color: "#fff", flexShrink: 0 }}>
        
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 4px", color: "#fff", lineHeight: 1.1 }}>
            {full_name || "Brian T. Wayne"}
          </h1>
          {professional_title && <div style={{ fontSize: 13.5, color: "#ccc", marginBottom: 14 }}>{professional_title}</div>}
          
          <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 10.5, color: "#ddd" }}>
            {email && <div style={{ display: "flex", alignItems: "center" }}><span style={{color: coral, marginRight: 6}}>✉</span>{email}</div>}
            {phone && <div style={{ display: "flex", alignItems: "center" }}><span style={{color: coral, marginRight: 6}}>📞</span>{phone}</div>}
            {location && <div style={{ display: "flex", alignItems: "center" }}><span style={{color: coral, marginRight: 6}}>📍</span>{location}</div>}
            {linkedin && <div style={{ display: "flex", alignItems: "center" }}><span style={{color: coral, marginRight: 6}}>🔗</span>{linkedin}</div>}
          </div>
        </div>

        {summary && (
          <div style={{ marginBottom: 20, pageBreakInside: "avoid", breakInside: "avoid" }}>
            <AtlanticSection title="Profile" icon="👤" isDark={true} />
            <p style={{ margin: 0, color: "#ccc", lineHeight: 1.45, textAlign: "justify" }}>{summary}</p>
          </div>
        )}

        {educations.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <AtlanticSection title="Education" icon="🎓" isDark={true} />
            {educations.map((edu, i) => (
              <div key={i} style={{ marginBottom: 10, pageBreakInside: "avoid", breakInside: "avoid" }}>
                <div style={{ fontWeight: 800, fontSize: 11, color: "#fff" }}>{edu.degree}</div>
                <div style={{ color: "#ccc", fontSize: 10.5 }}>{edu.institution}</div>
                {edu.score && <div style={{ fontSize: 10, color: "#aaa", marginTop: 2 }}>{edu.score}</div>}
              </div>
            ))}
          </div>
        )}

        {certs.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <AtlanticSection title="Certifications" icon="🏆" isDark={true} />
            {certs.map((c, i) => (
              <div key={i} style={{ marginBottom: 8, pageBreakInside: "avoid", breakInside: "avoid" }}>
                <div style={{ fontWeight: 800, fontSize: 11, color: "#fff" }}>{c.name}</div>
                <div style={{ color: "#ccc", fontSize: 10 }}>{c.issuer} {c.issue_date && `| ${c.issue_date}`}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT COLUMN - WHITE (Tightened padding to 20px 28px) */}
      <div style={{ flex: 1, padding: "20px 28px" }}>
        
        {experiences.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <AtlanticSection title="Professional Experience" icon="💼" isDark={false} />
            {experiences.map((exp, i) => (
              <div key={i} style={{ marginBottom: 12, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontWeight: 800, fontSize: 12, color: navy }}>{exp.company}</div>
                  <div style={{ fontSize: 10, color: "#888" }}>{exp.start_date} – {exp.end_date || "Present"}</div>
                </div>
                <div style={{ color: "#555", fontSize: 11, marginBottom: 2, fontStyle: "italic" }}>
                  {exp.role}
                </div>
                {exp.description && <div style={{ color: "#333", lineHeight: 1.4, marginTop: 3 }}>• {exp.description}</div>}
              </div>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <AtlanticSection title="Projects" icon="🚀" isDark={false} />
            {projects.map((p, i) => (
              <div key={i} style={{ marginBottom: 12, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
                {/* FLEX BOX ADDED HERE to push Link to the right side! */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontWeight: 800, fontSize: 12, color: navy }}>{p.title}</div>
                  {p.link && <a href={p.link} target="_blank" rel="noreferrer" style={{ fontSize: 10.5, color: coral, fontWeight: 700, textDecoration: "none" }}>View Link</a>}
                </div>
                <div style={{ color: "#555", fontSize: 10.5, fontStyle: "italic", marginBottom: 2 }}>{p.tech_stack}</div>
                {p.description && <div style={{ color: "#333", lineHeight: 1.4, marginTop: 2 }}>• {p.description}</div>}
              </div>
            ))}
          </div>
        )}

        {skills.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <AtlanticSection title="Skills" icon="⚡" isDark={false} />
            {/* WRAPPING ROW: Changed from column to wrap, added bulletproof PDF alignment */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, pageBreakInside: "avoid", breakInside: "avoid", width: "100%" }}>
              {skills.map((s, i) => (
                <div key={i} style={{ 
                  background: coral, 
                  color: "#fff", 
                  padding: "0 10px", 
                  height: "22px",           /* Strict height */
                  lineHeight: "22px",       /* Matches height to perfectly center text */
                  borderRadius: 4, 
                  fontSize: 10.5, 
                  fontWeight: 700, 
                  display: "inline-block"   /* Prevents html2canvas flex bugs */
                }}>
                  {s.name} {s.level ? `— ${s.level}` : ""}
                </div>
              ))}
            </div>
          </div>
        )}

        <EmptyState resume={resume} experiences={experiences} educations={educations} />
      </div>

    </div>
  );
} 

function TemplateBlueAccent({ resume, experiences, educations, skills, projects, certs }) {
  const { full_name, professional_title, email, phone, location, linkedin, summary } = resume;
  const accent = "#4f39a3"; // The specific purple/blue accent color

  // Custom section header with Goldilocks spacing
  const AccentSection = ({ title, icon, children }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 15 }}>{icon}</span>
        <h2 style={{ fontSize: 14, fontWeight: 800, color: "#111", margin: 0, letterSpacing: "0.02em" }}>{title}</h2>
      </div>
      {/* The short thick underline */}
      <div style={{ width: 32, height: 3.5, background: accent, borderRadius: 2, marginBottom: 10 }}></div>
      {children}
    </div>
  );

  return (
    // THE GOLDILOCKS: 10.5 font, 1.4 line-height, balanced 20px 40px outer padding
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: 10.5, color: "#222", lineHeight: 1.4, padding: "20px 40px", background: "#fff", minHeight: "100%", boxSizing: "border-box" }}>
      
      {/* Header - Tightened margins */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 4px", color: accent, letterSpacing: "0.02em" }}>
          {full_name || <span style={{ opacity: 0.5 }}>Your Name</span>}
        </h1>
        {professional_title && <div style={{ fontSize: 13.5, color: "#555", fontStyle: "italic", marginBottom: 8 }}>{professional_title}</div>}
        
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px 16px", fontSize: 10.5, color: "#444", fontWeight: 600 }}>
          {location && <span style={{ display: "flex", alignItems: "center", gap: 4 }}>📍 {location}</span>}
          {email && <span style={{ display: "flex", alignItems: "center", gap: 4 }}>✉ {email}</span>}
          {phone && <span style={{ display: "flex", alignItems: "center", gap: 4 }}>📞 {phone}</span>}
          {linkedin && <span style={{ display: "flex", alignItems: "center", gap: 4 }}>🔗 {linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div style={{ pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
          <AccentSection title="Profile" icon="📇">
            <p style={{ margin: 0, color: "#444", lineHeight: 1.45, textAlign: "justify" }}>{summary}</p>
          </AccentSection>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div>
          <AccentSection title="Professional Experience" icon="💼">
            {experiences.map((exp, i) => (
              <div key={i} style={{ marginBottom: 12, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: 800, fontSize: 11.5, color: "#111" }}>{exp.company}</span>
                  <span style={{ fontSize: 10, color: accent, fontWeight: 700 }}>{exp.start_date} – {exp.end_date || "Present"}</span>
                </div>
                <div style={{ fontSize: 10.5, fontStyle: "italic", color: "#555", marginBottom: 3 }}>{exp.role}</div>
                {exp.description && <div style={{ color: "#444", marginTop: 2, lineHeight: 1.4 }}>• {exp.description}</div>}
              </div>
            ))}
          </AccentSection>
        </div>
      )}

      {/* Education */}
      {educations.length > 0 && (
        <div>
          <AccentSection title="Education" icon="🎓">
            {educations.map((edu, i) => (
              <div key={i} style={{ marginBottom: 10, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: 800, fontSize: 11.5, color: "#111" }}>{edu.degree}</span>
                  <span style={{ fontSize: 10, color: accent, fontWeight: 700 }}>{edu.start_year} – {edu.end_year}</span>
                </div>
                <div style={{ fontSize: 10.5, fontStyle: "italic", color: "#555" }}>
                  {edu.institution}{edu.score && ` · Score: ${edu.score}`}
                </div>
              </div>
            ))}
          </AccentSection>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div>
          <AccentSection title="Projects" icon="🚀">
            {projects.map((p, i) => (
              <div key={i} style={{ marginBottom: 10, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: 800, fontSize: 11.5, color: "#111" }}>{p.title}</span>
                  {p.link && <a href={p.link} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: accent, fontWeight: 700, textDecoration: "none" }}>View Link</a>}
                </div>
                {p.tech_stack && <div style={{ fontSize: 10, fontStyle: "italic", color: "#666", marginBottom: 2 }}>{p.tech_stack}</div>}
                {p.description && <div style={{ color: "#444", lineHeight: 1.4 }}>• {p.description}</div>}
              </div>
            ))}
          </AccentSection>
        </div>
      )}

      {/* Skills - VERTICAL CENTERING FIX */}
      {skills.length > 0 && (
        <div style={{ pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
          <AccentSection title="Skills" icon="⚡">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {skills.map((s, i) => (
                <div key={i} style={{ 
                  border: "1.5px solid #444", 
                  borderRadius: 4, 
                  padding: "0 10px",          /* Removed vertical padding */
                  height: "22px",             /* Strict height */
                  lineHeight: "22px",         /* Centering trick */
                  fontSize: 10, 
                  color: "#222", 
                  fontWeight: 600,
                  display: "inline-block" 
                }}>
                  {s.name} {s.level ? `(${s.level})` : ""}
                </div>
              ))}
            </div>
          </AccentSection>
        </div>
      )}

      {/* Certifications */}
      {certs.length > 0 && (
        <div>
          <AccentSection title="Certifications" icon="🏆">
            {certs.map((c, i) => (
              <div key={i} style={{ marginBottom: 6, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
                <span style={{ fontWeight: 800, fontSize: 11, color: "#111" }}>{c.name}</span>
                <span style={{ color: "#555", fontSize: 10.5 }}>
                  {c.issuer && ` · ${c.issuer}`} {c.issue_date && ` · ${c.issue_date}`}
                </span>
              </div>
            ))}
          </AccentSection>
        </div>
      )}

      <EmptyState resume={resume} experiences={experiences} educations={educations} />
    </div>
  );
}

function TemplateGreenAccent({ resume, experiences, educations, skills, projects, certs }) {
  const { full_name, professional_title, email, phone, location, linkedin, summary } = resume;
  const teal = "#0d9488"; // Deep green/teal accent color

  // Custom section header with tightened margins
  const GreenSection = ({ title, children }) => (
    <div style={{ marginBottom: 12 }}>
      <h2 style={{ fontSize: 13, fontWeight: 800, color: teal, borderBottom: `1.5px solid ${teal}`, paddingBottom: 3, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {title}
      </h2>
      {children}
    </div>
  );

  // Custom layout: Date on the left (in teal), content on the right
  const SplitItem = ({ dates, title, subtitle, locationText, description, link }) => (
    <div style={{ display: "flex", marginBottom: 10, gap: 16, pageBreakInside: "avoid", breakInside: "avoid", width: "100%" }}>
      <div style={{ width: 100, flexShrink: 0, color: teal, fontSize: 10, fontWeight: 700 }}>
        {dates}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontSize: 11.5, color: "#111" }}>
            <span style={{ fontWeight: 800 }}>{title}</span>
            {subtitle && <span style={{ fontStyle: "italic", fontWeight: 400 }}>, {subtitle}</span>}
          </div>
          {/* Enhanced Right Side (Link or Location) */}
          {link ? (
            <a href={link} target="_blank" rel="noreferrer" style={{ fontSize: 10.5, color: teal, fontWeight: 700, textDecoration: "none" }}>View Link</a>
          ) : locationText && (
            <span style={{ fontSize: 10.5, color: "#333" }}>{locationText}</span>
          )}
        </div>
        {description && <div style={{ marginTop: 2, color: "#333", fontSize: 10.5, lineHeight: 1.4 }}>• {description}</div>}
      </div>
    </div>
  );

  return (
    // THE GOLDILOCKS: 10.5 font, 1.4 line-height, balanced 20px 36px outer padding.
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: 10.5, color: "#222", lineHeight: 1.4, padding: "20px 36px", background: "#fff", minHeight: "100%", boxSizing: "border-box" }}>
      
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <h1 style={{ 
          fontSize: 32, 
          fontWeight: 600, 
          margin: "0 0 4px", 
          color: teal, 
          fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive, Georgia, serif" 
        }}>
          {full_name || <span style={{ opacity: 0.5 }}>Your Name</span>}
        </h1>
        {professional_title && <div style={{ fontSize: 13.5, color: "#555", marginBottom: 8 }}>{professional_title}</div>}
        
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 16px", fontSize: 10.5, color: "#333", fontWeight: 600 }}>
          {location && <span style={{ display: "flex", alignItems: "center", gap: 4 }}>📍 {location}</span>}
          {email && <span style={{ display: "flex", alignItems: "center", gap: 4 }}>✉ {email}</span>}
          {phone && <span style={{ display: "flex", alignItems: "center", gap: 4 }}>📞 {phone}</span>}
          {linkedin && <span style={{ display: "flex", alignItems: "center", gap: 4 }}>🔗 {linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div style={{ pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
          <GreenSection title="Profile">
            <p style={{ margin: 0, color: "#333", lineHeight: 1.45, textAlign: "justify" }}>{summary}</p>
          </GreenSection>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <GreenSection title="Work Experience">
          {experiences.map((exp, i) => (
            <SplitItem 
              key={i}
              dates={`${exp.start_date} – ${exp.end_date || "Present"}`}
              title={exp.role}
              subtitle={exp.company}
              description={exp.description}
            />
          ))}
        </GreenSection>
      )}

      {/* Education */}
      {educations.length > 0 && (
        <GreenSection title="Education">
          {educations.map((edu, i) => (
            <SplitItem 
              key={i}
              dates={`${edu.start_year} – ${edu.end_year}`}
              title={edu.degree}
              subtitle={edu.institution}
              locationText={edu.score}
            />
          ))}
        </GreenSection>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <GreenSection title="Projects">
          {projects.map((p, i) => (
            <SplitItem 
              key={i}
              dates={p.tech_stack || "Project"}
              title={p.title}
              link={p.link}
              description={p.description}
            />
          ))}
        </GreenSection>
      )}

      {/* Skills - VERTICAL CENTERING FIX */}
      {skills.length > 0 && (
        <div style={{ pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
          <GreenSection title="Skills">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {skills.map((s, i) => (
                <div key={i} style={{ 
                  border: "1.5px solid #444", 
                  borderRadius: 4, 
                  padding: "0 10px",          /* Removed vertical padding */
                  height: "22px",             /* Strict height */
                  lineHeight: "22px",         /* Line-height matching height perfectly centers text */
                  fontSize: 10, 
                  color: "#222", 
                  fontWeight: 600,
                  display: "inline-block" 
                }}>
                  {s.name} {s.level ? `(${s.level})` : ""}
                </div>
              ))}
            </div>
          </GreenSection>
        </div>
      )}

      {/* Certifications */}
      {certs.length > 0 && (
        <GreenSection title="Certifications">
          {certs.map((c, i) => (
             <SplitItem 
               key={i}
               dates={c.issue_date || "Certified"}
               title={c.name}
               subtitle={c.issuer}
             />
          ))}
        </GreenSection>
      )}

      <EmptyState resume={resume} experiences={experiences} educations={educations} />
    </div>
  );
}
function TemplateSimplyBlue({ resume, experiences, educations, skills, projects, certs }) {
  const { full_name, professional_title, email, phone, location, linkedin, summary } = resume;
  const blue = "#2a3b8f"; // Deep vibrant blue
  const lightBg = "#f0f4f8"; // Light grey-blue for section headers

  // Custom section header with light background (Margins tightened)
  const SimplyBlueSection = ({ title }) => (
    <div style={{ background: lightBg, padding: "4px 0", marginBottom: 10, marginTop: 14, pageBreakInside: "avoid", breakInside: "avoid" }}>
      <h2 style={{ fontSize: 12.5, fontWeight: 800, color: blue, margin: 0, textAlign: "center", letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {title}
      </h2>
    </div>
  );

  return (
    // MAX COMPRESSION / GOLDILOCKS: 10.5 base font, 1.4 line-height, balanced 20px 36px padding
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: 10.5, color: "#222", lineHeight: 1.4, padding: "20px 36px", background: "#fff", minHeight: "100%", boxSizing: "border-box" }}>
      
      {/* HEADER SECTION */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "baseline", marginBottom: 6, flexWrap: "wrap" }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: blue, letterSpacing: "0.02em" }}>
            {full_name || <span style={{ opacity: 0.5 }}>Anna Field</span>}
          </h1>
          {professional_title && (
            <span style={{ fontSize: 15, color: blue, marginLeft: 10, fontWeight: 500 }}>
              {professional_title}
            </span>
          )}
        </div>
        
        {/* Contact Info Row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px", fontSize: 10.5, color: "#111", fontWeight: 600 }}>
          {location && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{color: blue, fontSize: 12}}>📍</span> {location}</span>}
          {email && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{color: blue, fontSize: 12}}>✉</span> {email}</span>}
          {phone && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{color: blue, fontSize: 12}}>📞</span> {phone}</span>}
          {linkedin && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{color: blue, fontSize: 12}}>🔗</span> {linkedin}</span>}
        </div>
      </div>

      {/* SUMMARY */}
      {summary && (
        <div style={{ pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
          <SimplyBlueSection title="Profile" />
          <p style={{ margin: 0, color: "#333", lineHeight: 1.45, textAlign: "justify" }}>{summary}</p>
        </div>
      )}

      {/* EXPERIENCE */}
      {experiences.length > 0 && (
        <div>
          <SimplyBlueSection title="Work Experience" />
          {experiences.map((exp, i) => (
            <div key={i} style={{ marginBottom: 12, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontSize: 11.5, color: "#111", fontWeight: 800 }}>{exp.role}</div>
                <div style={{ fontSize: 10.5, color: "#333" }}>{exp.start_date} – {exp.end_date || "Present"}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
                <div style={{ fontSize: 11, color: "#333", fontStyle: "italic" }}>{exp.company}</div>
                {exp.location && <div style={{ fontSize: 10.5, color: "#333" }}>{exp.location}</div>}
              </div>
              {exp.description && <div style={{ color: "#333", lineHeight: 1.4, marginTop: 2 }}>• {exp.description}</div>}
            </div>
          ))}
        </div>
      )}

      {/* EDUCATION */}
      {educations.length > 0 && (
        <div>
          <SimplyBlueSection title="Education" />
          {educations.map((edu, i) => (
            <div key={i} style={{ marginBottom: 10, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontSize: 11.5, color: "#111", fontWeight: 800 }}>{edu.degree}</div>
                <div style={{ fontSize: 10.5, color: "#333" }}>{edu.start_year} – {edu.end_year}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontSize: 11, color: "#333", fontStyle: "italic" }}>{edu.institution}</div>
                {edu.location && <div style={{ fontSize: 10.5, color: "#333" }}>{edu.location}</div>}
              </div>
              {edu.score && <div style={{ fontSize: 10.5, color: "#555", marginTop: 2 }}>{edu.score}</div>}
            </div>
          ))}
        </div>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <div>
          <SimplyBlueSection title="Projects" />
          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: 10, pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontSize: 11.5, color: "#111", fontWeight: 800 }}>{p.title}</div>
                {p.link && <a href={p.link} target="_blank" rel="noreferrer" style={{ fontSize: 10.5, color: blue, fontWeight: 700 }}>View Link</a>}
              </div>
              {p.tech_stack && <div style={{ fontSize: 10.5, color: "#555", fontStyle: "italic", marginBottom: 2 }}>{p.tech_stack}</div>}
              {p.description && <div style={{ color: "#333", lineHeight: 1.4, marginTop: 2 }}>• {p.description}</div>}
            </div>
          ))}
        </div>
      )}

      {/* SKILLS */}
      {skills.length > 0 && (
        <div style={{ pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
          <SimplyBlueSection title="Skills" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 20px" }}>
            {skills.map((s, i) => (
              <div key={i} style={{ fontSize: 10.5, color: "#222" }}>
                <span style={{ marginRight: 6, color: blue }}>•</span>
                <span style={{ fontWeight: 600 }}>{s.name}</span>
                {s.level && <span style={{ color: "#555" }}> — {s.level}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CERTIFICATIONS */}
      {certs.length > 0 && (
        <div>
          <SimplyBlueSection title="Certifications" />
          {certs.map((c, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, pageBreakInside: "avoid", breakInside: "avoid", width: "100%" }}>
              <div style={{ fontWeight: 800, fontSize: 11, color: "#111" }}>{c.name}</div>
              <div style={{ color: "#444", fontSize: 10.5 }}>
                {c.issuer && `${c.issuer} `}
                {c.issue_date && `| ${c.issue_date}`}
              </div>
            </div>
          ))}
        </div>
      )}

      <EmptyState resume={resume} experiences={experiences} educations={educations} />
    </div>
  );
}

function TemplateAnnaField({ resume, experiences, educations, skills, projects, certs }) {
  const { full_name, professional_title, email, phone, location, linkedin, summary } = resume;
  
  return (
    // GOLDILOCKS SQUEEZE: Tightened padding to 20px 36px, lowered line-height to 1.45, base font 10.5
    <div style={{ fontFamily: "Georgia, serif", fontSize: 10.5, color: "#1a1a1a", lineHeight: 1.45, padding: "20px 36px", background: "#fff", minHeight: "100%", boxSizing: "border-box" }}>
      
      <div style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: 12, marginBottom: 12 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 4px" }}>{full_name || <span style={{ color: "#ccc" }}>Your Name</span>}</h1>
        {professional_title && <div style={{ fontSize: 13.5, color: "#555", marginBottom: 8, fontStyle: "italic" }}>{professional_title}</div>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, fontSize: 10.5, color: "#777" }}>
          {email && <span>✉ {email}</span>}
          {phone && <span>📱 {phone}</span>}
          {location && <span>📍 {location}</span>}
          {linkedin && <span>🔗 {linkedin}</span>}
        </div>
      </div>

      {summary && (
        <div style={{ pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
          <AnnaSection title="Profile">
            <p style={{ margin: 0, fontSize: 10.5, lineHeight: 1.5 }}>{summary}</p>
          </AnnaSection>
        </div>
      )}

      {experiences.length > 0 && (
        <div>
          <AnnaSection title="Work Experience">
            {experiences.map((exp, i) => <ExpItem key={i} exp={exp} />)}
          </AnnaSection>
        </div>
      )}

      {educations.length > 0 && (
        <div>
          <AnnaSection title="Education">
            {educations.map((edu, i) => <EduItem key={i} edu={edu} />)}
          </AnnaSection>
        </div>
      )}

      {skills.length > 0 && (
        <div style={{ pageBreakInside: "avoid", breakInside: "avoid", display: "inline-block", width: "100%" }}>
          <AnnaSection title="Skills">
            <div style={{ columns: 2, gap: 12 }}>
              {skills.map((s, i) => (
                <div key={i} style={{ fontSize: 10.5, marginBottom: 4 }}>
                  • {s.name}{s.level ? ` (${s.level})` : ""}
                </div>
              ))}
            </div>
          </AnnaSection>
        </div>
      )}

      {projects.length > 0 && (
        <div>
          <AnnaSection title="Projects">
            {projects.map((p, i) => <ProjItem key={i} p={p} />)}
          </AnnaSection>
        </div>
      )}

      {certs.length > 0 && (
        <div>
          <AnnaSection title="Certifications">
            {certs.map((c, i) => <CertItem key={i} c={c} />)}
          </AnnaSection>
        </div>
      )}

      <EmptyState resume={resume} experiences={experiences} educations={educations} />
    </div>
  );
}

function TemplatePrecisionLine({ resume, experiences, educations, skills, projects, certs }) {
  const { full_name, professional_title, email, phone, location, linkedin, summary } = resume;
  return (
    <div style={{ fontFamily: "'Arial Narrow', Arial, sans-serif", fontSize: 11, color: "#111", lineHeight: 1.6, padding: "28px 32px", background: "#fff", minHeight: "100%" }}>
      <div style={{ borderBottom: "2px solid #111", paddingBottom: 10, marginBottom: 14 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 2px", letterSpacing: "-0.02em" }}>{full_name || <span style={{ color: "#ccc" }}>Your Name</span>}</h1>
        {professional_title && <div style={{ fontSize: 11, color: "#555", fontStyle: "italic", marginBottom: 6 }}>{professional_title}</div>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 10, color: "#555" }}>
          {email && <span>{email}</span>}{phone && <span>{phone}</span>}{location && <span>{location}</span>}{linkedin && <span>{linkedin}</span>}
        </div>
      </div>
      {summary && <PrecisionSection title="Professional Summary"><p style={{ margin: 0, fontSize: 10.5 }}>{summary}</p></PrecisionSection>}
      {experiences.length > 0 && <PrecisionSection title="Work Experience">{experiences.map((exp, i) => <ExpItem key={i} exp={exp} />)}</PrecisionSection>}
      {educations.length > 0 && <PrecisionSection title="Education">{educations.map((edu, i) => <EduItem key={i} edu={edu} />)}</PrecisionSection>}
      {skills.length > 0 && <PrecisionSection title="Technical Skills"><div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{skills.map((s, i) => <span key={i} style={{ fontSize: 10, background: "#f3f4f6", padding: "2px 8px", borderRadius: 2, border: "1px solid #e5e7eb" }}>{s.name}</span>)}</div></PrecisionSection>}
      {projects.length > 0 && <PrecisionSection title="Projects">{projects.map((p, i) => <ProjItem key={i} p={p} />)}</PrecisionSection>}
      {certs.length > 0 && <PrecisionSection title="Certifications">{certs.map((c, i) => <CertItem key={i} c={c} />)}</PrecisionSection>}
      <EmptyState resume={resume} experiences={experiences} educations={educations} />
    </div>
  );
}

function TemplateObsidian({ resume, experiences, educations, skills, projects, certs }) {
  const { full_name, professional_title, email, phone, location, linkedin, summary } = resume;
  const accent = "#1f2937";
  return (
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#111", lineHeight: 1.6, background: "#fff", minHeight: "100%" }}>
      <div style={{ background: accent, padding: "28px 32px", color: "#fff" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 4px", color: "#fff" }}>{full_name || <span style={{ opacity: 0.4 }}>Your Name</span>}</h1>
        {professional_title && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginBottom: 10 }}>{professional_title}</div>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, fontSize: 10, color: "rgba(255,255,255,0.7)" }}>
          {email && <span>✉ {email}</span>}{phone && <span>📱 {phone}</span>}{location && <span>📍 {location}</span>}{linkedin && <span>🔗 {linkedin}</span>}
        </div>
      </div>
      <div style={{ padding: "24px 32px" }}>
        {summary && <ColorSection title="Profile" accent={accent}><p style={{ margin: 0, fontSize: 10.5, color: "#444", lineHeight: 1.7 }}>{summary}</p></ColorSection>}
        {experiences.length > 0 && <ColorSection title="Experience" accent={accent}>{experiences.map((exp, i) => <ExpItem key={i} exp={exp} />)}</ColorSection>}
        {educations.length > 0 && <ColorSection title="Education" accent={accent}>{educations.map((edu, i) => <EduItem key={i} edu={edu} />)}</ColorSection>}
        {skills.length > 0 && <ColorSection title="Skills" accent={accent}><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{skills.map((s, i) => <span key={i} style={{ background: `${accent}10`, color: accent, border: `1px solid ${accent}30`, borderRadius: 4, padding: "2px 8px", fontSize: 10 }}>{s.name}</span>)}</div></ColorSection>}
        {projects.length > 0 && <ColorSection title="Projects" accent={accent}>{projects.map((p, i) => <ProjItem key={i} p={p} />)}</ColorSection>}
        {certs.length > 0 && <ColorSection title="Certifications" accent={accent}>{certs.map((c, i) => <CertItem key={i} c={c} />)}</ColorSection>}
        <EmptyState resume={resume} experiences={experiences} educations={educations} />
      </div>
    </div>
  );
}

function TemplateMercury({ resume, experiences, educations, skills, projects, certs }) {
  const { full_name, professional_title, email, phone, location, linkedin, summary } = resume;
  return (
    <div style={{ fontFamily: "Verdana, sans-serif", fontSize: 10.5, color: "#222", lineHeight: 1.6, padding: "30px 34px", background: "#fff", minHeight: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "3px double #111", paddingBottom: 12, marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 3px", letterSpacing: "0.02em" }}>{full_name || <span style={{ color: "#ccc" }}>Your Name</span>}</h1>
          {professional_title && <div style={{ fontSize: 11, color: "#666" }}>{professional_title}</div>}
        </div>
        <div style={{ textAlign: "right", fontSize: 9.5, color: "#666", lineHeight: 1.8 }}>
          {email && <div>{email}</div>}{phone && <div>{phone}</div>}{location && <div>{location}</div>}
        </div>
      </div>
      {summary && <MercurySection title="Summary"><p style={{ margin: 0 }}>{summary}</p></MercurySection>}
      {experiences.length > 0 && <MercurySection title="Experience">{experiences.map((exp, i) => <ExpItem key={i} exp={exp} />)}</MercurySection>}
      {educations.length > 0 && <MercurySection title="Education">{educations.map((edu, i) => <EduItem key={i} edu={edu} />)}</MercurySection>}
      {skills.length > 0 && <MercurySection title="Skills"><div style={{ columns: 3, gap: 10 }}>{skills.map((s, i) => <div key={i} style={{ fontSize: 10, marginBottom: 3 }}>◆ {s.name}</div>)}</div></MercurySection>}
      {projects.length > 0 && <MercurySection title="Projects">{projects.map((p, i) => <ProjItem key={i} p={p} />)}</MercurySection>}
      {certs.length > 0 && <MercurySection title="Certifications">{certs.map((c, i) => <CertItem key={i} c={c} />)}</MercurySection>}
      <EmptyState resume={resume} experiences={experiences} educations={educations} />
    </div>
  );
}


// ── SHARED SECTION COMPONENTS ──
function Section({ title, children }) {
  return <div style={{ marginBottom: 14 }}><div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1.5px solid #111", paddingBottom: 3, marginBottom: 8 }}>{title}</div>{children}</div>;
}
function ModSection({ title, accent, children }) {
  return <div style={{ marginBottom: 14 }}><div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: accent, borderBottom: `2px solid ${accent}`, paddingBottom: 3, marginBottom: 8 }}>{title}</div>{children}</div>;
}
function ClassicSection({ title, children }) {
  return <div style={{ marginBottom: 16 }}><div style={{ fontSize: 12, fontWeight: 700, color: "#111", borderBottom: "1px solid #999", paddingBottom: 3, marginBottom: 8, letterSpacing: "0.04em" }}>{title}</div>{children}</div>;
}
function ColorSection({ title, accent, children }) {
  return <div style={{ marginBottom: 14 }}><div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: accent, paddingBottom: 4, marginBottom: 8, borderBottom: `2px solid ${accent}` }}>{title}</div>{children}</div>;
}
function HarvardSection({ title, children }) {
  return <div style={{ marginBottom: 14 }}><div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #000", paddingBottom: 2, marginBottom: 6 }}>{title}</div>{children}</div>;
}
function AnnaSection({ title, children }) {
  return <div style={{ marginBottom: 14 }}><div style={{ fontSize: 11, fontWeight: 700, background: "#f3f4f6", padding: "3px 8px", marginBottom: 8, textAlign: "center", letterSpacing: "0.06em", color: "#374151" }}>{title}</div>{children}</div>;
}
function PrecisionSection({ title, children }) {
  return <div style={{ marginBottom: 14 }}><div style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: "1px solid #111", paddingBottom: 2, marginBottom: 8 }}>{title}</div>{children}</div>;
}
function MercurySection({ title, children }) {
  return <div style={{ marginBottom: 14 }}><div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "3px double #111", paddingBottom: 3, marginBottom: 8 }}>{title}</div>{children}</div>;
}
function FinanceSection({ title, children }) {
  return <div style={{ marginBottom: 14 }}><div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1.5px solid #374151", paddingBottom: 3, marginBottom: 8, color: "#374151" }}>{title}</div>{children}</div>;
}
function SideSection({ title, color, children }) {
  return <div style={{ marginBottom: 14 }}><div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: `1px solid rgba(255,255,255,0.3)`, paddingBottom: 3, marginBottom: 6, color }}>{title}</div>{children}</div>;
}

// ── SHARED ITEM COMPONENTS ──
function ExpItem({ exp }) {
  return (
    <div style={{ marginBottom: 10, pageBreakInside: "avoid", breakInside: "avoid" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontWeight: 700, fontSize: 11 }}>{exp.role}</span>
        <span style={{ fontSize: 10, color: "#777" }}>{exp.start_date} – {exp.end_date || "Present"}</span>
      </div>
      <div style={{ fontSize: 10, color: "#555", fontStyle: "italic" }}>{exp.company}</div>
      {exp.description && <div style={{ fontSize: 10, color: "#666", marginTop: 3 }}>• {exp.description}</div>}
    </div>
  );
}
function EduItem({ edu }) {
  return (
    <div style={{ marginBottom: 8, pageBreakInside: "avoid", breakInside: "avoid" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontWeight: 700, fontSize: 11 }}>{edu.degree}</span>
        <span style={{ fontSize: 10, color: "#777" }}>{edu.start_year} – {edu.end_year}</span>
      </div>
      <div style={{ fontSize: 10, color: "#555" }}>
        {edu.institution}{edu.score ? ` · Score: ${edu.score}` : ""}
      </div>
    </div>
  );
}
function ProjItem({ p }) {
  return (
    <div style={{ marginBottom: 8, pageBreakInside: "avoid", breakInside: "avoid" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontWeight: 700, fontSize: 11 }}>{p.title}</span>
        {p.link && <a href={p.link} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: "#2563eb" }}>Link</a>}
      </div>
      {p.tech_stack && <div style={{ fontSize: 10, color: "#555", fontStyle: "italic" }}>{p.tech_stack}</div>}
      {p.description && <div style={{ fontSize: 10, color: "#666", marginTop: 2 }}>• {p.description}</div>}
    </div>
  );
}
function CertItem({ c }) {
  return (
    <div style={{ marginBottom: 6, pageBreakInside: "avoid", breakInside: "avoid" }}>
      <span style={{ fontWeight: 700, fontSize: 11 }}>{c.name}</span>
      {c.issuer && <span style={{ fontSize: 10, color: "#666" }}> · {c.issuer}</span>}
      {c.issue_date && <span style={{ fontSize: 10, color: "#888" }}> · {c.issue_date}</span>}
    </div>
  );
}
function EmptyState({ resume, experiences, educations }) {
  if (resume.full_name || resume.summary || experiences.length > 0 || educations.length > 0) return null;
  return <div style={{ textAlign: "center", color: "#ccc", marginTop: 60, fontSize: 13 }}>Start filling in your details to see the preview here →</div>;
}

// ── TEMPLATE MAP ──
// ── TEMPLATE OPTIONS for the switcher dropdown ──
const TEMPLATE_OPTIONS = [
  { label: "Classic", style: "classic", category: "Simple" },
  { label: "Harvard", style: "minimal", category: "Simple" },
  { label: "Banking", style: "finance", category: "Simple" },
  { label: "Quiet Blue", style: "quiet_blue", category: "Simple" },
  { label: "Anna Field", style: "annafield", category: "Simple" },
  { label: "Modern (Sidebar)", style: "sidebar", category: "Modern" },
  { label: "Simply Blue", style: "simplyblue_modern", category: "Modern" },
  { label: "Hunter Green", style: "hunter_green", category: "Modern" },
  { label: "Silver", style: "silver", category: "Modern" },
  { label: "Slate Dawn", style: "slate_dawn", category: "Modern" },
  { label: "Creative", style: "creative", category: "Creative" },
  { label: "Black Pattern", style: "black_pattern", category: "Creative" },
  { label: "Atlantic Blue", style: "atlantic_blue", category: "Creative" },
  { label: "Green Accent", style: "green_accent", category: "Creative" },
  { label: "Rosewood", style: "rosewood", category: "Creative" },
  { label: "Blue Accent", style: "blue_accent", category: "Creative" },
];

const TEMPLATE_MAP = {
  corporate: TemplateCorporate,
  modern: TemplateModern,
  classic: TemplateClassic,
  harvard: TemplateHarvard,
  atlantic: TemplateAtlantic,
  simplyblue: TemplateSimplyBlue,
  annafield: TemplateAnnaField,
  meghana: TemplatePrecisionLine,
  obsidian: TemplateObsidian,
  mercury: TemplateMercury,
  finance: TemplateBanking,

  minimal: TemplateHarvard,
  sidebar: TemplateModern,
  banking: TemplateBanking,
  quiet_blue: TemplateQuietBlue,
  simplyblue_modern: TemplateSimplyBlue,
  hunter_green: TemplateHunterGreen,
  silver: TemplateSilver,
  slate_dawn: TemplateSlateDawn,
  creative: TemplateCreative,
  black_pattern: TemplateBlackPattern,
  atlantic_blue: TemplateAtlantic,
  green_accent: TemplateGreenAccent,
  rosewood: TemplateRosewood,
  blue_accent: TemplateBlueAccent
};

function ResumePreview({ resume, experiences, educations, skills, projects, certs, templateStyle }) {
  // 1. Get the style passed from state, fallback to template_name, fallback to corporate
  const activeKey = templateStyle || resume.template_name || "corporate";
  
  // 2. Pick the correct component from the updated map!
  const TemplateComponent = TEMPLATE_MAP[activeKey] || TemplateCorporate;
  
  return (
    <TemplateComponent 
      resume={resume} 
      experiences={experiences} 
      educations={educations} 
      skills={skills} 
      projects={projects} 
      certs={certs} 
    />
  );
}

// ── MAIN BUILDER ──
export default function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const componentRef = useRef(null);
  const handlePrint = () => {
    const element = componentRef.current;
    
    // Configuration for a perfect A4 PDF download
    const opt = {
      margin:       0,
      filename:     `${resume.full_name || 'My'}_Resume.pdf`,
      image:        { type: 'jpeg', quality: 1.0 },
      html2canvas:  { scale: 2, useCORS: true,scrollY: 0}, // Scale 2 keeps it HD!
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Triggers the real browser download instantly
    html2pdf().set(opt).from(element).save();
  };
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const [activeTab, setActiveTab] = useState(0);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [showExtra, setShowExtra] = useState(false);
   
  const [resume, setResume] = useState({
    title: "", summary: "", full_name: "", professional_title: "",
    email: "", phone: "", location: "", linkedin: "", website: "",
    nationality: "", date_of_birth: "", template_name: "simple",
  });
  
  const [templateStyle, setTemplateStyle] = useState("classic");
  const [showTemplateSwitcher, setShowTemplateSwitcher] = useState(false);
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

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

 const fetchAll = async () => {
    try {
      // 1. Fetch Resume Basic Info
      const resResume = await fetch(`/api/resume/${id}`, { headers });
      const data = await resResume.json();
      
      // Note: your backend returns { resume: {...}, message: "..." } 
      // based on the route code you shared earlier.
      const resumeData = data.resume || data; 

      if (resumeData) {
        setResume(resumeData);
        
        // ✅ STEP 5 LOGIC: Handle the Template Style
        if (resumeData.template_style) {
          setTemplateStyle(resumeData.template_style);
          console.log("✅ Applied saved style:", resumeData.template_style);
        } else {
          // Fallback logic for older resumes that don't have a style saved yet
          const fallbackMap = {
            'simple': 'classic',
            'modern': 'sidebar',
            'creative': 'creative'
          };
          const fallback = fallbackMap[resumeData.template_name] || 'classic';
          setTemplateStyle(fallback);
          console.log("⚠️ No style found, using fallback:", fallback);
        }
      }

      // 2. Fetch all related data in parallel
      const [resExp, resEdu, resSkills, resProj, resCerts] = await Promise.all([
        fetch(`/api/experience/${id}`, { headers }),
        fetch(`/api/education/${id}`, { headers }),
        fetch(`/api/skills/${id}`, { headers }),
        fetch(`/api/projects/${id}`, { headers }),
        fetch(`/api/certifications/${id}`, { headers })
      ]);

      // Convert all responses to JSON
      setExperiences(await resExp.json() || []);
      setEducations(await resEdu.json() || []);
      setSkills(await resSkills.json() || []);
      setProjects(await resProj.json() || []);
      setCerts(await resCerts.json() || []);

    } catch (err) {
      console.error("❌ Error in fetchAll:", err);
      showToast("Failed to load resume data");
    }
  };

  const saveResume = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/resume/${id}`, { method: "PUT", headers, body: JSON.stringify(resume) });
      if (res.ok) showToast("✅ Resume saved successfully!");
      else showToast("❌ Failed to save");
    } catch { showToast("❌ Failed to save"); }
    finally { setSaving(false); }
  };

  // ── TEMPLATE SWITCHER: change template & save to backend ──
  const handleTemplateSwitch = async (newStyle) => {
    // Find the category for the chosen style
    const opt = TEMPLATE_OPTIONS.find(o => o.style === newStyle);
    const newCategory = opt ? opt.category.toLowerCase() : resume.template_name;

    // Update local state instantly (live preview updates immediately)
    setTemplateStyle(newStyle);
    setResume(prev => ({ ...prev, template_name: newCategory, template_style: newStyle }));
    setShowTemplateSwitcher(false);

    // Save to backend
    try {
      const res = await fetch(`/api/resume/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ ...resume, template_name: newCategory, template_style: newStyle })
      });
      if (res.ok) showToast("✅ Template changed!");
      else showToast("❌ Failed to save template");
    } catch {
      showToast("❌ Failed to save template");
    }
  };

  const addItem = async (url, body, resetFn, type) => {
    try {
      const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { console.error("Backend error:", data); alert(data.error || "Failed to add"); return; }
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
      <header style={{ backgroundColor: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 20px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => navigate("/dashboard")} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 13 }}>← Dashboard</button>
          <input value={resume.title} onChange={e => setResume({ ...resume, title: e.target.value })} placeholder="Resume Title"
            style={{ border: "none", outline: "none", fontSize: 14, fontWeight: 700, color: "#111827", background: "transparent", width: 200 }} />
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
  {/* ── TEMPLATE SWITCHER BUTTON ── */}
  <div style={{ position: "relative" }}>
    <button
      onClick={() => setShowTemplateSwitcher(!showTemplateSwitcher)}
      style={{ background: "#7c3aed", color: "#fff", border: "none", borderRadius: 8, padding: "7px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
      🎨 Change Template
    </button>
    {showTemplateSwitcher && (
      <div style={{
        position: "absolute", top: 42, right: 0, background: "#fff", border: "1px solid #e5e7eb",
        borderRadius: 12, boxShadow: "0 8px 30px rgba(0,0,0,0.18)", width: 280, maxHeight: 400,
        overflowY: "auto", zIndex: 999, padding: "8px 0"
      }}>
        {["Simple", "Modern", "Creative"].map(cat => (
          <div key={cat}>
            <div style={{ padding: "8px 16px 4px", fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>{cat}</div>
            {TEMPLATE_OPTIONS.filter(o => o.category === cat).map(opt => (
              <button key={opt.style} onClick={() => handleTemplateSwitch(opt.style)}
                style={{
                  display: "block", width: "100%", textAlign: "left", padding: "8px 16px", border: "none",
                  background: templateStyle === opt.style ? "#ede9fe" : "transparent",
                  color: templateStyle === opt.style ? "#7c3aed" : "#374151",
                  fontWeight: templateStyle === opt.style ? 700 : 400,
                  fontSize: 13, cursor: "pointer"
                }}>
                {opt.label} {templateStyle === opt.style && "✓"}
              </button>
            ))}
          </div>
        ))}
      </div>
    )}
  </div>
  <button
    onClick={() => {
      showToast("📄 Preparing PDF...");
      handlePrint();
    }}
    style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 8, padding: "7px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
    📄 Download PDF
  </button>
  <button onClick={saveResume} disabled={saving} style={{ ...btn, padding: "7px 18px" }}>
    {saving ? "Saving..." : "💾 Save"}
  </button>
</div>
      </header>

      {toast && (
        <div style={{ position: "fixed", top: 70, right: 24, zIndex: 999, background: toast.startsWith("✅") ? "#16a34a" : "#dc2626", color: "#fff", padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600, boxShadow: "0 4px 16px rgba(0,0,0,0.15)", animation: "fadeIn 0.3s ease" }}>
          {toast}
          <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", height: "calc(100vh - 52px)" }}>
        {/* LEFT */}
        <div style={{ overflowY: "auto", padding: "20px 16px", borderRight: "1px solid #e5e7eb" }}>
          <div style={{ display: "flex", gap: 3, backgroundColor: "#e5e7eb", borderRadius: 10, padding: 3, marginBottom: 18 }}>
            {TABS.map((tab, i) => (
              <button key={tab} onClick={() => setActiveTab(i)}
                style={{ flex: 1, padding: "7px 2px", borderRadius: 7, border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer", backgroundColor: activeTab === i ? "#fff" : "transparent", color: activeTab === i ? "#2563eb" : "#6b7280", boxShadow: activeTab === i ? "0 1px 3px rgba(0,0,0,0.08)" : "none" }}>
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
                  {[["Full Name", "full_name", "e.g. Anna Field"], ["Professional Title", "professional_title", "Target position or current role"], ["Email", "email", "Enter email"], ["Phone", "phone", "Enter Phone"]].map(([label, key, ph]) => (
                    <div key={key} style={fld}><label style={lbl}>{label}</label><input style={inp} placeholder={ph} value={resume[key]} onChange={e => setResume({ ...resume, [key]: e.target.value })} /></div>
                  ))}
                  <div style={{ ...fld, gridColumn: "1/-1" }}><label style={lbl}>Location</label><input style={inp} placeholder="City, Country" value={resume.location} onChange={e => setResume({ ...resume, location: e.target.value })} /></div>
                </div>
                <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 14, marginBottom: 14 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Add details</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {["LinkedIn", "Website", "Nationality", "Date of Birth"].map(label => (
                      <button key={label} onClick={() => setShowExtra(true)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", border: "1px solid #e5e7eb", borderRadius: 20, background: "#fff", fontSize: 12, cursor: "pointer", color: "#374151" }}>+ {label}</button>
                    ))}
                  </div>
                  {showExtra && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
                      {[["LinkedIn", "linkedin", "linkedin.com/in/yourname"], ["Website", "website", "yourwebsite.com"], ["Nationality", "nationality", "e.g. Indian"], ["Date of Birth", "date_of_birth", "DD/MM/YYYY"]].map(([label, key, ph]) => (
                        <div key={key} style={fld}><label style={lbl}>{label}</label><input style={inp} placeholder={ph} value={resume[key]} onChange={e => setResume({ ...resume, [key]: e.target.value })} /></div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={fld}>
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
    <label style={lbl}>Professional Summary</label>
    <button
      onClick={async () => {
        if (!resume.full_name && !resume.professional_title) {
          showToast("❌ Please fill in Full Name and Professional Title first!");
          return;
        }
        await fetch(`/api/resume/${id}`, { method: "PUT", headers, body: JSON.stringify(resume) });
        showToast("✨ Generating summary...");
        try {
          const res = await fetch(`/api/ai/generate-summary/${id}`, { headers });
          const data = await res.json();
          if (data.ai_generated_summary) {
            setResume(prev => ({ ...prev, summary: data.ai_generated_summary }));
            showToast("✅ Summary generated!");
          } else {
            showToast("❌ Failed to generate");
          }
        } catch {
          showToast("❌ Failed to generate");
        }
                 }}
                 style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none", borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                ✨ Generate with AI
                </button>
                </div>
                <textarea style={{ ...inp, resize: "none" }} rows={4} placeholder="Write a brief professional summary or click ✨ Generate with AI..." value={resume.summary} onChange={e => setResume({ ...resume, summary: e.target.value })} />
                </div>
                <button onClick={saveResume} disabled={saving} style={{ ...btn, width: "100%", padding: "12px", fontSize: 14, borderRadius: 10, background: "linear-gradient(135deg, #ec4899, #f97316)" }}>{saving ? "Saving..." : "✓  Done"}</button>
              </div>
            )}

            {/* EXPERIENCE */}
            {activeTab === 1 && (
              <div>
                <h2 style={{ fontWeight: 800, fontSize: 17, marginBottom: 14 }}>Work Experience</h2>
                {experiences.map((exp, i) => (
                  <div key={i} style={card}>
                    <div><p style={{ fontWeight: 700, fontSize: 13, margin: 0 }}>{exp.role} at {exp.company}</p><p style={{ fontSize: 11, color: "#6b7280", margin: "2px 0" }}>{exp.start_date} – {exp.end_date || "Present"}</p></div>
                    <button style={delBtn} onClick={() => deleteItem(`/api/experience/${exp.id}`, "experience", i)}>Delete</button>
                  </div>
                ))}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  {[["Company", "company", "e.g. Google"], ["Role", "role", "e.g. Software Engineer"], ["Start Date", "start_date", "Jan 2022"], ["End Date", "end_date", "Present"]].map(([label, key, ph]) => (
                    <div key={key}><label style={lbl}>{label}</label><input style={inp} placeholder={ph} value={expForm[key]} onChange={e => setExpForm({ ...expForm, [key]: e.target.value })} /></div>
                  ))}
                </div>
                <div style={fld}>
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
    <label style={lbl}>Description</label>
    <button
      onClick={async () => {
        if (!expForm.role || !expForm.company) {
          showToast("❌ Please fill in Company and Role first!");
          return;
        }
        showToast("✨ Generating description...");
        try {
          const res = await fetch("/api/ai/generate-experience", {
            method: "POST",
            headers,
            body: JSON.stringify({
              role: expForm.role,
              company: expForm.company,
              start_date: expForm.start_date,
              end_date: expForm.end_date
            })
          });
          const data = await res.json();
          if (data.description) {
            setExpForm(prev => ({ ...prev, description: data.description }));
            showToast("✅ Description generated!");
          } else {
            showToast("❌ Failed to generate");
          }
        } catch {
          showToast("❌ Failed to generate");
        }
      }}
      style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none", borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
      ✨ Generate with AI
    </button>
  </div>
  <textarea style={{ ...inp, resize: "none" }} rows={3}
    placeholder="Describe responsibilities or click ✨ Generate with AI..."
    value={expForm.description}
    onChange={e => setExpForm({ ...expForm, description: e.target.value })} />
</div>
                <button style={btn} onClick={() => addItem(`/api/experience/`, { ...expForm, resume_id: parseInt(id) }, () => setExpForm({ company: "", role: "", start_date: "", end_date: "", description: "" }), "experience")}>+ Add Experience</button>
              </div>
            )}

            {/* EDUCATION */}
            {activeTab === 2 && (
              <div>
                <h2 style={{ fontWeight: 800, fontSize: 17, marginBottom: 14 }}>Education</h2>
                {educations.map((edu, i) => (
                  <div key={i} style={card}>
                    <div><p style={{ fontWeight: 700, fontSize: 13, margin: 0 }}>{edu.degree} — {edu.institution}</p><p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>{edu.start_year} – {edu.end_year}</p></div>
                    <button style={delBtn} onClick={() => deleteItem(`/api/education/${edu.id}`, "education", i)}>Delete</button>
                  </div>
                ))}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  {[["Degree", "degree", "e.g. B.Tech"], ["Institution", "institution", "e.g. IIT Bombay"], ["Start Year", "start_year", "2018"], ["End Year", "end_year", "2022"], ["Grade / Score", "score", "e.g. 79% or 9.08 CGPA"]].map(([label, key, ph]) => (
                    <div key={key}><label style={lbl}>{label}</label><input style={inp} placeholder={ph} value={eduForm[key]} onChange={e => setEduForm({ ...eduForm, [key]: e.target.value })} /></div>
                  ))}
                </div>
                <button style={btn} onClick={() => addItem(`/api/education/`, { ...eduForm, resume_id: parseInt(id) }, () => setEduForm({ degree: "", institution: "", start_year: "", end_year: "", gpa: "" }), "education")}>+ Add Education</button>
              </div>
            )}

            {/* SKILLS */}
            {activeTab === 3 && (
              <div>
                <h2 style={{ fontWeight: 800, fontSize: 17, marginBottom: 14 }}>Skills</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 16 }}>
                  {skills.map((s, i) => (
                    <span key={i} style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: 20, padding: "4px 10px", fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
                      {s.name} · {s.level}
                      <button onClick={() => deleteItem(`/api/skills/${s.id}`, "skills", i)} style={{ ...delBtn, fontSize: 11, padding: 0 }}>✕</button>
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                  <div style={{ flex: 1 }}><label style={lbl}>Skill</label><input style={inp} placeholder="e.g. React" value={skillForm.name} onChange={e => setSkillForm({ ...skillForm, name: e.target.value })} /></div>
                  <div style={{ width: 130 }}><label style={lbl}>Level</label>
                    <select style={inp} value={skillForm.level} onChange={e => setSkillForm({ ...skillForm, level: e.target.value })}>
                      {["Beginner", "Intermediate", "Advanced", "Expert"].map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                  <button style={btn} onClick={() => addItem(`/api/skills/`, { ...skillForm, resume_id: parseInt(id) }, () => setSkillForm({ name: "", level: "Intermediate" }), "skills")}>+ Add</button>
                </div>
              </div>
            )}

            {/* PROJECTS */}
            {activeTab === 4 && (
              <div>
                <h2 style={{ fontWeight: 800, fontSize: 17, marginBottom: 14 }}>Projects</h2>
                {projects.map((p, i) => (
                  <div key={i} style={card}>
                    <div><p style={{ fontWeight: 700, fontSize: 13, margin: 0 }}>{p.title}</p><p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>{p.tech_stack}</p></div>
                    <button style={delBtn} onClick={() => deleteItem(`/api/projects/${p.id}`, "projects", i)}>Delete</button>
                  </div>
                ))}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  {[["Title", "title", "e.g. AI Resume Builder"], ["Tech Stack", "tech_stack", "React, Flask"], ["Link", "link", "https://github.com/..."]].map(([label, key, ph]) => (
                    <div key={key}><label style={lbl}>{label}</label><input style={inp} placeholder={ph} value={projForm[key]} onChange={e => setProjForm({ ...projForm, [key]: e.target.value })} /></div>
                  ))}
                </div>
                <div style={fld}>
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
    <label style={lbl}>Description</label>
    <button
      onClick={async () => {
        if (!projForm.title) {
          showToast("❌ Please fill in Project Title first!");
          return;
        }
        showToast("✨ Generating description...");
        try {
          const res = await fetch("/api/ai/generate-project", {
            method: "POST",
            headers,
            body: JSON.stringify({
              title: projForm.title,
              tech_stack: projForm.tech_stack
            })
          });
          const data = await res.json();
          if (data.description) {
            setProjForm(prev => ({ ...prev, description: data.description }));
            showToast("✅ Description generated!");
          } else {
            showToast("❌ Failed to generate");
          }
        } catch {
          showToast("❌ Failed to generate");
        }
      }}
      style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none", borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
      ✨ Generate with AI
    </button>
  </div>
  <textarea style={{ ...inp, resize: "none" }} rows={3}
    placeholder="Describe the project or click ✨ Generate with AI..."
    value={projForm.description}
    onChange={e => setProjForm({ ...projForm, description: e.target.value })} />
</div>
                <button style={btn} onClick={() => addItem(`/api/projects/`, { ...projForm, resume_id: parseInt(id) }, () => setProjForm({ title: "", description: "", tech_stack: "", link: "" }), "projects")}>+ Add Project</button>
              </div>
            )}

            {/* CERTIFICATIONS */}
            {activeTab === 5 && (
              <div>
                <h2 style={{ fontWeight: 800, fontSize: 17, marginBottom: 14 }}>Certifications</h2>
                {certs.map((c, i) => (
                  <div key={i} style={card}>
                    <div><p style={{ fontWeight: 700, fontSize: 13, margin: 0 }}>{c.name}</p><p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>{c.issuer} · {c.issue_date}</p></div>
                    <button style={delBtn} onClick={() => deleteItem(`/api/certifications/${c.id}`, "certs", i)}>Delete</button>
                  </div>
                ))}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  {[["Name", "name", "AWS Solutions Architect"], ["Issuer", "issuer", "Amazon"], ["Issue Date", "issue_date", "Jan 2023"], ["Expiry Date", "expiry_date", "Jan 2026"]].map(([label, key, ph]) => (
                    <div key={key}><label style={lbl}>{label}</label><input style={inp} placeholder={ph} value={certForm[key]} onChange={e => setCertForm({ ...certForm, [key]: e.target.value })} /></div>
                  ))}
                </div>
                <button style={btn} onClick={() => addItem(`/api/certifications/`, { ...certForm, resume_id: parseInt(id) }, () => setCertForm({ name: "", issuer: "", issue_date: "", expiry_date: "" }), "certs")}>+ Add Certification</button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Live Preview */}
        <div style={{ overflowY: "auto", background: "#e5e7eb", padding: "20px 0", display: "flex", justifyContent: "center" }}>
          
          {/* ✅ The A4 Canvas Wrapper */}
          <div 
            ref={componentRef} 
            style={{ 
              background: "#fff", 
              width: "210mm",       /* Exact A4 Width */
              minHeight: "297mm",
              boxSizing: "border-box",
              position: "relative",
              boxShadow: "0 4px 24px rgba(0,0,0,0.1)", 
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact" 
            }}
          >
            {/* The flex: 1 here tells the preview to stretch and fill the whole 297mm height */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <ResumePreview 
                resume={resume} 
                experiences={experiences} 
                educations={educations} 
                skills={skills} 
                projects={projects} 
                certs={certs} 
                templateStyle={templateStyle} 
              />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}