import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
    <div style={{ fontFamily: "'Helvetica Neue', sans-serif", fontSize: 11, color: "#111", lineHeight: 1.6, background: "#fff", minHeight: "100%", display: "flex" }}>
      <div style={{ width: 200, background: accent, padding: "28px 18px", color: "#fff", flexShrink: 0 }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 4px", color: "#fff", lineHeight: 1.2 }}>{full_name || <span style={{ opacity: 0.4 }}>Your Name</span>}</h1>
          {professional_title && <div style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", fontStyle: "italic" }}>{professional_title}</div>}
        </div>
        <SideSection title="Contact" color="#fff">
          {email && <div style={{ fontSize: 9, opacity: 0.8, marginBottom: 3 }}>✉ {email}</div>}
          {phone && <div style={{ fontSize: 9, opacity: 0.8, marginBottom: 3 }}>📱 {phone}</div>}
          {location && <div style={{ fontSize: 9, opacity: 0.8, marginBottom: 3 }}>📍 {location}</div>}
          {linkedin && <div style={{ fontSize: 9, opacity: 0.8, marginBottom: 3 }}>🔗 {linkedin}</div>}
        </SideSection>
        {skills.length > 0 && <SideSection title="Skills" color="#fff">{skills.map((s, i) => <div key={i} style={{ fontSize: 9, opacity: 0.85, marginBottom: 4 }}>• {s.name}{s.level ? ` (${s.level})` : ""}</div>)}</SideSection>}
        {certs.length > 0 && <SideSection title="Certifications" color="#fff">{certs.map((c, i) => <div key={i} style={{ fontSize: 9, opacity: 0.85, marginBottom: 4 }}>• {c.name}</div>)}</SideSection>}
      </div>
      <div style={{ flex: 1, padding: "28px 24px" }}>
        {summary && <ModSection title="Profile" accent={accent}><p style={{ margin: 0, fontSize: 10.5, color: "#444", lineHeight: 1.7 }}>{summary}</p></ModSection>}
        {experiences.length > 0 && <ModSection title="Experience" accent={accent}>{experiences.map((exp, i) => <ExpItem key={i} exp={exp} />)}</ModSection>}
        {educations.length > 0 && <ModSection title="Education" accent={accent}>{educations.map((edu, i) => <EduItem key={i} edu={edu} />)}</ModSection>}
        {projects.length > 0 && <ModSection title="Projects" accent={accent}>{projects.map((p, i) => <ProjItem key={i} p={p} />)}</ModSection>}
        <EmptyState resume={resume} experiences={experiences} educations={educations} />
      </div>
    </div>
  );
}

function TemplateClassic({ resume, experiences, educations, skills, projects, certs }) {
  const { full_name, professional_title, email, phone, location, linkedin, summary } = resume;
  return (
    <div style={{ fontFamily: "Garamond, Georgia, serif", fontSize: 11, color: "#1a1a1a", lineHeight: 1.7, padding: "36px 40px", background: "#fff", minHeight: "100%" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 2px", fontFamily: "Garamond, Georgia, serif" }}>{full_name || <span style={{ color: "#ccc" }}>Your Name</span>}</h1>
        {professional_title && <div style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>{professional_title}</div>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, fontSize: 10, color: "#666", borderTop: "1px solid #ddd", paddingTop: 8 }}>
          {email && <span>{email}</span>}{phone && <span>{phone}</span>}{location && <span>{location}</span>}{linkedin && <span>{linkedin}</span>}
        </div>
      </div>
      {summary && <ClassicSection title="Profile"><p style={{ margin: 0, fontSize: 10.5, lineHeight: 1.8 }}>{summary}</p></ClassicSection>}
      {experiences.length > 0 && <ClassicSection title="Professional Experience">{experiences.map((exp, i) => <ExpItem key={i} exp={exp} />)}</ClassicSection>}
      {educations.length > 0 && <ClassicSection title="Education">{educations.map((edu, i) => <EduItem key={i} edu={edu} />)}</ClassicSection>}
      {skills.length > 0 && <ClassicSection title="Core Skills"><div style={{ columns: 2, gap: 16 }}>{skills.map((s, i) => <div key={i} style={{ fontSize: 10, marginBottom: 3 }}>▸ {s.name}{s.level ? ` — ${s.level}` : ""}</div>)}</div></ClassicSection>}
      {projects.length > 0 && <ClassicSection title="Projects">{projects.map((p, i) => <ProjItem key={i} p={p} />)}</ClassicSection>}
      {certs.length > 0 && <ClassicSection title="Certifications">{certs.map((c, i) => <CertItem key={i} c={c} />)}</ClassicSection>}
      <EmptyState resume={resume} experiences={experiences} educations={educations} />
    </div>
  );
}

function TemplateCreative({ resume, experiences, educations, skills, projects, certs }) {
  const { full_name, professional_title, email, phone, location, linkedin, summary } = resume;
  const accent = "#7c3aed";
  return (
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#111", lineHeight: 1.6, background: "#fff", minHeight: "100%" }}>
      <div style={{ background: accent, padding: "28px 32px", color: "#fff" }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 4px", color: "#fff" }}>{full_name || <span style={{ opacity: 0.4 }}>Your Name</span>}</h1>
        {professional_title && <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginBottom: 10 }}>{professional_title}</div>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, fontSize: 10, color: "rgba(255,255,255,0.8)" }}>
          {email && <span>✉ {email}</span>}{phone && <span>📱 {phone}</span>}{location && <span>📍 {location}</span>}{linkedin && <span>🔗 {linkedin}</span>}
        </div>
      </div>
      <div style={{ padding: "24px 32px" }}>
        {summary && <ColorSection title="About Me" accent={accent}><p style={{ margin: 0, fontSize: 10.5, color: "#444", lineHeight: 1.7 }}>{summary}</p></ColorSection>}
        {experiences.length > 0 && <ColorSection title="Experience" accent={accent}>{experiences.map((exp, i) => <ExpItem key={i} exp={exp} />)}</ColorSection>}
        {educations.length > 0 && <ColorSection title="Education" accent={accent}>{educations.map((edu, i) => <EduItem key={i} edu={edu} />)}</ColorSection>}
        {skills.length > 0 && <ColorSection title="Skills" accent={accent}><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{skills.map((s, i) => <span key={i} style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}40`, borderRadius: 20, padding: "2px 10px", fontSize: 10 }}>{s.name}</span>)}</div></ColorSection>}
        {projects.length > 0 && <ColorSection title="Projects" accent={accent}>{projects.map((p, i) => <ProjItem key={i} p={p} />)}</ColorSection>}
        {certs.length > 0 && <ColorSection title="Certifications" accent={accent}>{certs.map((c, i) => <CertItem key={i} c={c} />)}</ColorSection>}
        <EmptyState resume={resume} experiences={experiences} educations={educations} />
      </div>
    </div>
  );
}

function TemplateHarvard({ resume, experiences, educations, skills, projects, certs }) {
  const { full_name, professional_title, email, phone, location, linkedin, summary } = resume;
  return (
    <div style={{ fontFamily: "Times New Roman, serif", fontSize: 11, color: "#000", lineHeight: 1.5, padding: "28px 32px", background: "#fff", minHeight: "100%" }}>
      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.12em" }}>{full_name || <span style={{ color: "#ccc" }}>Your Name</span>}</h1>
        <div style={{ fontSize: 10, color: "#444" }}>
          {[email, phone, location, linkedin].filter(Boolean).join("  •  ")}
        </div>
      </div>
      <div style={{ borderTop: "1.5px solid #000", borderBottom: "1.5px solid #000", padding: "4px 0", marginBottom: 14 }}>
        {professional_title && <div style={{ textAlign: "center", fontSize: 11, fontStyle: "italic" }}>{professional_title}</div>}
      </div>
      {summary && <HarvardSection title="Summary"><p style={{ margin: 0, fontSize: 10.5 }}>{summary}</p></HarvardSection>}
      {experiences.length > 0 && <HarvardSection title="Professional Experience">{experiences.map((exp, i) => <ExpItem key={i} exp={exp} />)}</HarvardSection>}
      {educations.length > 0 && <HarvardSection title="Education">{educations.map((edu, i) => <EduItem key={i} edu={edu} />)}</HarvardSection>}
      {skills.length > 0 && <HarvardSection title="Skills & Competencies"><p style={{ margin: 0, fontSize: 10.5 }}>{skills.map(s => s.name).join(" • ")}</p></HarvardSection>}
      {projects.length > 0 && <HarvardSection title="Projects">{projects.map((p, i) => <ProjItem key={i} p={p} />)}</HarvardSection>}
      {certs.length > 0 && <HarvardSection title="Certifications">{certs.map((c, i) => <CertItem key={i} c={c} />)}</HarvardSection>}
      <EmptyState resume={resume} experiences={experiences} educations={educations} />
    </div>
  );
}

function TemplateAtlantic({ resume, experiences, educations, skills, projects, certs }) {
  const { full_name, professional_title, email, phone, location, linkedin, summary } = resume;
  const accent = "#1e3a5f";
  return (
    <div style={{ fontFamily: "Calibri, Arial, sans-serif", fontSize: 11, color: "#111", lineHeight: 1.6, background: "#fff", minHeight: "100%", display: "flex" }}>
      <div style={{ width: 195, background: accent, padding: "28px 16px", color: "#fff", flexShrink: 0 }}>
        <div style={{ marginBottom: 18 }}>
          <h1 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 4px", color: "#fff", lineHeight: 1.2 }}>{full_name || <span style={{ opacity: 0.4 }}>Your Name</span>}</h1>
          {professional_title && <div style={{ fontSize: 9, color: "rgba(255,255,255,0.75)", fontStyle: "italic" }}>{professional_title}</div>}
        </div>
        <SideSection title="Contact" color="#fff">
          {email && <div style={{ fontSize: 9, opacity: 0.8, marginBottom: 3, wordBreak: "break-all" }}>✉ {email}</div>}
          {phone && <div style={{ fontSize: 9, opacity: 0.8, marginBottom: 3 }}>📱 {phone}</div>}
          {location && <div style={{ fontSize: 9, opacity: 0.8, marginBottom: 3 }}>📍 {location}</div>}
          {linkedin && <div style={{ fontSize: 9, opacity: 0.8, marginBottom: 3, wordBreak: "break-all" }}>🔗 {linkedin}</div>}
        </SideSection>
        {skills.length > 0 && <SideSection title="Skills" color="#fff">{skills.map((s, i) => <div key={i} style={{ fontSize: 9, opacity: 0.85, marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.6)", flexShrink: 0, display: "inline-block" }}></span>{s.name}</div>)}</SideSection>}
        {certs.length > 0 && <SideSection title="Certifications" color="#fff">{certs.map((c, i) => <div key={i} style={{ fontSize: 9, opacity: 0.85, marginBottom: 4 }}>• {c.name}</div>)}</SideSection>}
      </div>
      <div style={{ flex: 1, padding: "28px 22px" }}>
        {summary && <ModSection title="Profile" accent={accent}><p style={{ margin: 0, fontSize: 10.5, color: "#444", lineHeight: 1.7 }}>{summary}</p></ModSection>}
        {experiences.length > 0 && <ModSection title="Work Experience" accent={accent}>{experiences.map((exp, i) => <ExpItem key={i} exp={exp} />)}</ModSection>}
        {educations.length > 0 && <ModSection title="Education" accent={accent}>{educations.map((edu, i) => <EduItem key={i} edu={edu} />)}</ModSection>}
        {projects.length > 0 && <ModSection title="Projects" accent={accent}>{projects.map((p, i) => <ProjItem key={i} p={p} />)}</ModSection>}
        <EmptyState resume={resume} experiences={experiences} educations={educations} />
      </div>
    </div>
  );
}

function TemplateSimplyBlue({ resume, experiences, educations, skills, projects, certs }) {
  const { full_name, professional_title, email, phone, location, linkedin, summary } = resume;
  const blue = "#3b5bdb";
  return (
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#111", lineHeight: 1.6, padding: "28px 32px", background: "#fff", minHeight: "100%" }}>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 2px" }}>{full_name || <span style={{ color: "#ccc" }}>Your Name</span>}</h1>
        {professional_title && <div style={{ fontSize: 12, color: "#555", marginBottom: 8 }}>{professional_title}</div>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 10, color: "#666" }}>
          {email && <span>✉ {email}</span>}{phone && <span>📱 {phone}</span>}{location && <span>📍 {location}</span>}{linkedin && <span>🔗 {linkedin}</span>}
        </div>
      </div>
      {[["Profile", summary ? <p style={{ margin: 0, fontSize: 10.5, color: "#444", lineHeight: 1.7 }}>{summary}</p> : null],
        experiences.length > 0 ? ["Work Experience", experiences.map((exp, i) => <ExpItem key={i} exp={exp} />)] : null,
        educations.length > 0 ? ["Education", educations.map((edu, i) => <EduItem key={i} edu={edu} />)] : null,
        skills.length > 0 ? ["Skills", <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{skills.map((s, i) => <span key={i} style={{ background: `${blue}15`, color: blue, borderRadius: 4, padding: "2px 10px", fontSize: 10, border: `1px solid ${blue}30` }}>{s.name}</span>)}</div>] : null,
        projects.length > 0 ? ["Projects", projects.map((p, i) => <ProjItem key={i} p={p} />)] : null,
        certs.length > 0 ? ["Certifications", certs.map((c, i) => <CertItem key={i} c={c} />)] : null,
      ].filter(Boolean).filter(([, content]) => content).map(([title, content], i) => (
        <div key={i} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, background: `${blue}15`, color: blue, padding: "3px 8px", borderRadius: 3, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>{title}</div>
          {content}
        </div>
      ))}
      <EmptyState resume={resume} experiences={experiences} educations={educations} />
    </div>
  );
}

function TemplateAnnaField({ resume, experiences, educations, skills, projects, certs }) {
  const { full_name, professional_title, email, phone, location, linkedin, summary } = resume;
  return (
    <div style={{ fontFamily: "Georgia, serif", fontSize: 11, color: "#1a1a1a", lineHeight: 1.7, padding: "32px 36px", background: "#fff", minHeight: "100%" }}>
      <div style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: 16, marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 3px" }}>{full_name || <span style={{ color: "#ccc" }}>Your Name</span>}</h1>
        {professional_title && <div style={{ fontSize: 13, color: "#555", marginBottom: 8, fontStyle: "italic" }}>{professional_title}</div>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, fontSize: 10, color: "#777" }}>
          {email && <span>✉ {email}</span>}{phone && <span>📱 {phone}</span>}{location && <span>📍 {location}</span>}{linkedin && <span>🔗 {linkedin}</span>}
        </div>
      </div>
      {summary && <AnnaSection title="Profile"><p style={{ margin: 0, fontSize: 10.5, lineHeight: 1.8 }}>{summary}</p></AnnaSection>}
      {experiences.length > 0 && <AnnaSection title="Work Experience">{experiences.map((exp, i) => <ExpItem key={i} exp={exp} />)}</AnnaSection>}
      {educations.length > 0 && <AnnaSection title="Education">{educations.map((edu, i) => <EduItem key={i} edu={edu} />)}</AnnaSection>}
      {skills.length > 0 && <AnnaSection title="Skills"><div style={{ columns: 2, gap: 12 }}>{skills.map((s, i) => <div key={i} style={{ fontSize: 10, marginBottom: 4 }}>• {s.name}{s.level ? ` (${s.level})` : ""}</div>)}</div></AnnaSection>}
      {projects.length > 0 && <AnnaSection title="Projects">{projects.map((p, i) => <ProjItem key={i} p={p} />)}</AnnaSection>}
      {certs.length > 0 && <AnnaSection title="Certifications">{certs.map((c, i) => <CertItem key={i} c={c} />)}</AnnaSection>}
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

function TemplateFinance({ resume, experiences, educations, skills, projects, certs }) {
  const { full_name, professional_title, email, phone, location, linkedin, summary } = resume;
  return (
    <div style={{ fontFamily: "'Times New Roman', serif", fontSize: 11, color: "#000", lineHeight: 1.6, padding: "28px 36px", background: "#fff", minHeight: "100%" }}>
      <div style={{ textAlign: "center", borderBottom: "2px solid #374151", paddingBottom: 12, marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.1em" }}>{full_name || <span style={{ color: "#ccc" }}>Your Name</span>}</h1>
        {professional_title && <div style={{ fontSize: 11, color: "#444", marginBottom: 6, fontStyle: "italic" }}>{professional_title}</div>}
        <div style={{ fontSize: 10, color: "#555" }}>{[email, phone, location, linkedin].filter(Boolean).join("  |  ")}</div>
      </div>
      {summary && <FinanceSection title="Executive Summary"><p style={{ margin: 0, fontSize: 10.5, lineHeight: 1.7 }}>{summary}</p></FinanceSection>}
      {experiences.length > 0 && <FinanceSection title="Professional Experience">{experiences.map((exp, i) => <ExpItem key={i} exp={exp} />)}</FinanceSection>}
      {educations.length > 0 && <FinanceSection title="Education">{educations.map((edu, i) => <EduItem key={i} edu={edu} />)}</FinanceSection>}
      {skills.length > 0 && <FinanceSection title="Technical Expertise"><p style={{ margin: 0, fontSize: 10.5 }}>{skills.map(s => s.name).join("  •  ")}</p></FinanceSection>}
      {projects.length > 0 && <FinanceSection title="Notable Projects">{projects.map((p, i) => <ProjItem key={i} p={p} />)}</FinanceSection>}
      {certs.length > 0 && <FinanceSection title="Certifications">{certs.map((c, i) => <CertItem key={i} c={c} />)}</FinanceSection>}
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
    <div style={{ marginBottom: 10 }}>
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
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontWeight: 700, fontSize: 11 }}>{edu.degree}</span>
        <span style={{ fontSize: 10, color: "#777" }}>{edu.start_year} – {edu.end_year}</span>
      </div>
      <div style={{ fontSize: 10, color: "#555" }}>{edu.institution}{edu.gpa ? ` · GPA: ${edu.gpa}` : ""}</div>
    </div>
  );
}
function ProjItem({ p }) {
  return (
    <div style={{ marginBottom: 8 }}>
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
    <div style={{ marginBottom: 6 }}>
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
const TEMPLATE_MAP = {
  corporate: TemplateCorporate,
  modern: TemplateModern,
  classic: TemplateClassic,
  creative: TemplateCreative,
  harvard: TemplateHarvard,
  atlantic: TemplateAtlantic,
  simplyblue: TemplateSimplyBlue,
  annafield: TemplateAnnaField,
  meghana: TemplatePrecisionLine,
  obsidian: TemplateObsidian,
  mercury: TemplateMercury,
  finance: TemplateFinance,
};

function ResumePreview({ resume, experiences, educations, skills, projects, certs }) {
  const templateName = resume.template_name || "corporate";
  const TemplateComponent = TEMPLATE_MAP[templateName] || TemplateCorporate;
  return <TemplateComponent resume={resume} experiences={experiences} educations={educations} skills={skills} projects={projects} certs={certs} />;
}

// ── MAIN BUILDER ──
export default function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const [activeTab, setActiveTab] = useState(0);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [showExtra, setShowExtra] = useState(false);

  const [resume, setResume] = useState({
    title: "", summary: "", full_name: "", professional_title: "",
    email: "", phone: "", location: "", linkedin: "", website: "",
    nationality: "", date_of_birth: "", template_name: "corporate",
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

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

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
        template_name: data.template_name || "corporate",
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
      const res = await fetch(`/api/resume/${id}`, { method: "PUT", headers, body: JSON.stringify(resume) });
      if (res.ok) showToast("✅ Resume saved successfully!");
      else showToast("❌ Failed to save");
    } catch { showToast("❌ Failed to save"); }
    finally { setSaving(false); }
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
        <button onClick={saveResume} disabled={saving} style={{ ...btn, padding: "7px 18px" }}>
          {saving ? "Saving..." : "💾 Save"}
        </button>
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
                <div style={fld}><label style={lbl}>Description</label><textarea style={{ ...inp, resize: "none" }} rows={3} placeholder="Describe responsibilities..." value={expForm.description} onChange={e => setExpForm({ ...expForm, description: e.target.value })} /></div>
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
                  {[["Degree", "degree", "e.g. B.Tech"], ["Institution", "institution", "e.g. IIT Bombay"], ["Start Year", "start_year", "2018"], ["End Year", "end_year", "2022"], ["GPA", "gpa", "3.8"]].map(([label, key, ph]) => (
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
                <div style={fld}><label style={lbl}>Description</label><textarea style={{ ...inp, resize: "none" }} rows={3} placeholder="Describe the project..." value={projForm.description} onChange={e => setProjForm({ ...projForm, description: e.target.value })} /></div>
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
        <div style={{ overflowY: "auto", background: "#e5e7eb", padding: 20 }}>
          <div style={{ background: "#fff", minHeight: "100%", boxShadow: "0 4px 24px rgba(0,0,0,0.1)", borderRadius: 4, overflow: "hidden" }}>
            <ResumePreview resume={resume} experiences={experiences} educations={educations} skills={skills} projects={projects} certs={certs} />
          </div>
        </div>
      </div>
    </div>
  );
}