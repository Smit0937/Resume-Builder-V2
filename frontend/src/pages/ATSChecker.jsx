import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

// ── SCORING ENGINE ──
function analyzeResume(text) {
  const t = text.toLowerCase();
  let score = 0;
  const issues = [];
  const suggestions = [];
  const breakdown = [];

  // 1. Contact Information (10 pts)
  let contactScore = 0;
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
  const hasPhone = /(\+?\d[\d\s\-().]{7,}\d)/.test(text);
  const hasLocation = /(city|state|country|india|usa|uk|mumbai|delhi|bangalore|ahmedabad|pune|hyderabad|chennai|kolkata|\b[A-Z][a-z]+,\s*[A-Z]{2}\b)/i.test(text);
  const hasLinkedIn = /linkedin\.com/i.test(text);
  if (hasEmail) contactScore += 4; else issues.push({ type: "critical", text: "Email address is missing from your resume" });
  if (hasPhone) contactScore += 3; else issues.push({ type: "critical", text: "Phone number is missing" });
  if (hasLocation) contactScore += 2; else issues.push({ type: "warning", text: "Location/city not found" });
  if (hasLinkedIn) contactScore += 1; else issues.push({ type: "warning", text: "LinkedIn profile URL not included" });
  score += contactScore;
  breakdown.push({ label: "Contact Info", score: contactScore, max: 10, icon: "📇" });

  // 2. Professional Summary (10 pts)
let summaryScore = 0;
// Try to find a labeled summary section first
const summaryMatch = text.match(/(?:summary|profile|objective|about\s*me|career\s*objective)[:\s\n]+([\s\S]{20,600}?)(?:\n{2,}|\n(?:experience|education|skills|work|employment|project))/i);
let summaryWords = 0;
if (summaryMatch) {
  summaryWords = summaryMatch[1].trim().split(/\s+/).filter(w => w.length > 1).length;
} else {
  // Fallback: count total words in document — if resume has 150+ words it likely has a summary
  const totalWords = text.trim().split(/\s+/).filter(w => w.length > 2).length;
  // Estimate: subtract ~60 words for contact/headers/section titles
  const contentWords = Math.max(0, totalWords - 60);
  // If doc has good amount of content, assume summary exists
  if (contentWords >= 200) summaryWords = 60; // treat as full summary
  else if (contentWords >= 100) summaryWords = 25; // treat as short summary
}
if (summaryWords >= 50) { summaryScore = 10; }
else if (summaryWords >= 15) { summaryScore = 5; issues.push({ type: "warning", text: `Summary detected but may be too short. Aim for 50+ words` }); }
else { issues.push({ type: "critical", text: "Professional summary/objective is missing or not detected" }); }
score += summaryScore;
breakdown.push({ label: "Summary", score: summaryScore, max: 10, icon: "📝" });

  // 3. Work Experience (25 pts)
  let expScore = 0;
  const expSection = text.match(/(?:experience|employment|work history)[:\s\n]+([\s\S]{50,}?)(?:\n{3,}|\n(?:education|skills|projects|certif))/i);
  const jobCount = (text.match(/(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s*\d{4}/gi) || []).length / 2;
  const estimatedJobs = Math.min(Math.round(jobCount), 5);
  if (estimatedJobs >= 2) expScore += 15;
  else if (estimatedJobs >= 1) { expScore += 10; issues.push({ type: "warning", text: "Only 1 work experience entry found — add more if applicable" }); }
  else { issues.push({ type: "critical", text: "Work experience section is missing or undetected" }); }

  const actionVerbs = ["led", "managed", "achieved", "developed", "created", "launched", "improved", "built", "designed", "implemented", "increased", "reduced", "delivered", "collaborated", "coordinated"];
  const hasActionVerbs = actionVerbs.some(v => t.includes(v));
  if (hasActionVerbs) expScore += 5;
  else issues.push({ type: "warning", text: "Use action verbs: Led, Managed, Achieved, Developed, Launched" });

  const hasNumbers = /\d+\s*(%|percent|users|customers|million|thousand|k\b|projects|members)/i.test(text);
  if (hasNumbers) expScore += 5;
  else { issues.push({ type: "warning", text: "No quantifiable achievements found (e.g. 'Increased sales by 25%')" }); suggestions.push({ text: "Add metrics: 'Reduced load time by 40%', 'Managed team of 8 engineers'" }); }
  score += expScore;
  breakdown.push({ label: "Work Experience", score: expScore, max: 25, icon: "💼" });

  // 4. Education (15 pts)
  let eduScore = 0;
  const hasEdu = /(?:bachelor|master|b\.?tech|m\.?tech|bsc|msc|b\.?e|m\.?e|phd|degree|university|college|institute|school)/i.test(text);
  const hasEduYear = /20\d{2}|19\d{2}/.test(text);
  if (hasEdu && hasEduYear) { eduScore = 15; }
  else if (hasEdu) { eduScore = 10; issues.push({ type: "warning", text: "Education entry found but graduation year is missing" }); }
  else { issues.push({ type: "critical", text: "Education section is missing or not recognized" }); }
  score += eduScore;
  breakdown.push({ label: "Education", score: eduScore, max: 15, icon: "🎓" });

  // 5. Skills (20 pts)
  let skillScore = 0;
  const skillSection = text.match(/(?:skills?|competencies|expertise|technologies)[:\s\n]+([\s\S]{20,400}?)(?:\n{2,})/i);
  const techKeywords = ["python", "java", "javascript", "react", "node", "sql", "html", "css", "excel", "word", "powerpoint", "photoshop", "autocad", "tableau", "aws", "docker", "git", "communication", "leadership", "management", "analytical", "problem solving", "teamwork"];
  const skillsFound = techKeywords.filter(k => t.includes(k)).length;
  const skillsInSection = skillSection ? skillSection[1].split(/[,\n•|\/]/).filter(s => s.trim().length > 1).length : skillsFound;
  const totalSkills = Math.max(skillsFound, skillsInSection);
  if (totalSkills >= 5) skillScore = 20;
  else if (totalSkills >= 3) { skillScore = 15; issues.push({ type: "warning", text: `Only ${totalSkills} skills detected. Add more (aim for 8-12)` }); }
  else if (totalSkills >= 1) { skillScore = 10; issues.push({ type: "critical", text: "Very few skills listed. Add technical and soft skills" }); }
  else { issues.push({ type: "critical", text: "Skills section is missing — this is critical for ATS" }); }
  if (totalSkills < 5) suggestions.push({ text: "Add 8-12 skills: mix technical skills, tools, and soft skills relevant to your role" });
  score += skillScore;
  breakdown.push({ label: "Skills", score: skillScore, max: 20, icon: "⚡" });

  // 6. Keywords (10 pts)
  let keywordScore = 0;
  const keywordGroups = [
    { terms: ["project", "projects"], label: "project" },
    { terms: ["team", "teamwork", "collaborative"], label: "team" },
    { terms: ["management", "manage", "managed"], label: "management" },
    { terms: ["develop", "development", "developer"], label: "development" },
    { terms: ["analys", "analysis", "analytical"], label: "analysis" },
  ];
  const foundKeywords = keywordGroups.filter(g => g.terms.some(term => t.includes(term)));
  keywordScore = Math.min(foundKeywords.length * 2, 10);
  if (keywordScore < 6) {
    issues.push({ type: "warning", text: `Missing ATS keywords: ${keywordGroups.filter(g => !g.terms.some(term => t.includes(term))).map(g => g.label).join(", ")}` });
    suggestions.push({ text: "Include terms like 'project management', 'team collaboration', 'data analysis', 'software development'" });
  }
  score += keywordScore;
  breakdown.push({ label: "Keywords", score: keywordScore, max: 10, icon: "🔑" });

  // 7. Formatting (10 pts — auto-awarded for using our platform)
  const formattingScore = 10;
  score += formattingScore;
  breakdown.push({ label: "Formatting", score: formattingScore, max: 10, icon: "📄" });

  // General suggestions
  if (!hasLinkedIn) suggestions.push({ text: "Add your LinkedIn profile URL to increase credibility by 40%" });
  if (summaryWords < 50) suggestions.push({ text: "Write a 100-150 word summary highlighting your top 3 skills and career goals" });
  suggestions.push({ text: "Tailor keywords from the job description to pass ATS filters" });

  // Grade
  let grade, gradeColor, gradeMsg;
  if (score >= 90) { grade = "A+"; gradeColor = "#059669"; gradeMsg = "Excellent — ATS Optimized! 🎉"; }
  else if (score >= 80) { grade = "A"; gradeColor = "#10b981"; gradeMsg = "Great — Minor improvements possible"; }
  else if (score >= 70) { grade = "B"; gradeColor = "#3b82f6"; gradeMsg = "Good — Some optimization needed"; }
  else if (score >= 60) { grade = "C"; gradeColor = "#f59e0b"; gradeMsg = "Fair — Significant improvements required"; }
  else if (score >= 50) { grade = "D"; gradeColor = "#f97316"; gradeMsg = "Needs Work — Major gaps found"; }
  else { grade = "F"; gradeColor = "#ef4444"; gradeMsg = "Poor — Comprehensive revision needed"; }

  return { score, grade, gradeColor, gradeMsg, issues, suggestions, breakdown };
}

// ── GRADE COLOR ──
function getScoreColor(score) {
  if (score >= 80) return "#059669";
  if (score >= 70) return "#3b82f6";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
}

export default function ATSChecker() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [fileName, setFileName] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const fileRef = useRef();

  const processPDF = async (file) => {
    setLoading(true);
    setResult(null);
    setAiSuggestions(null);
    setFileName(file.name);
    try {
      // Use PDF.js via CDN to extract text
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Load PDF.js dynamically
      if (!window.pdfjsLib) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      }

      const pdf = await window.pdfjsLib.getDocument({ data: uint8Array }).promise;
      let text = "";
      for (let i = 1; i <= Math.min(pdf.numPages, 5); i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(" ") + "\n";
      }

      setResumeText(text);
      const analysis = analyzeResume(text);
      setResult(analysis);
    } catch (err) {
      console.error("PDF error:", err);
      alert("Could not read the PDF. Please ensure it's a text-based PDF (not scanned image).");
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") processPDF(file);
    else alert("Please upload a PDF file.");
  }, []);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processPDF(file);
  };

  const getAISuggestions = async () => {
    if (!resumeText) return;
    setAiLoading(true);
    try {
      const response = await api.post("/ai/analyze-resume", {
        resume_text: resumeText.slice(0, 3000),
      });
      const data = response.data;
      if (data?.improvements) {
        setAiSuggestions(data);
      } else {
        setAiSuggestions({
          improvements: [{ title: "Analysis Complete", detail: data?.message || "Could not parse suggestions.", impact: "medium" }],
          summary: ""
        });
      }
    } catch (err) {
      console.error("AI error:", err);
      alert("AI analysis failed. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const impactColor = { high: "#ef4444", medium: "#f59e0b", low: "#3b82f6" };
  const impactBg = { high: "#fef2f2", medium: "#fffbeb", low: "#eff6ff" };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f5f3ff 100%)", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scoreAnim { from { stroke-dashoffset: 314; } }
        .ats-card { background: #fff; border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; padding: 20px; margin-bottom: 16px; animation: fadeUp 0.4s ease; }
        .drop-zone { border: 2px dashed #c7d2fe; border-radius: 16px; background: #f8faff; text-align: center; padding: 40px 20px; cursor: pointer; transition: all 0.2s ease; }
        .drop-zone:hover, .drop-zone.drag { border-color: #6366f1; background: #eef2ff; }
        .issue-chip { display: flex; align-items: flex-start; gap: 10px; padding: 10px 14px; border-radius: 10px; margin-bottom: 8px; font-size: 13px; line-height: 1.4; }
        .suggestion-chip { display: flex; align-items: flex-start; gap: 10px; padding: 10px 14px; border-radius: 10px; margin-bottom: 8px; font-size: 13px; line-height: 1.4; background: #f0fdf4; border: 1px solid #bbf7d0; }
        .score-bar { height: 8px; border-radius: 4px; background: #e2e8f0; overflow: hidden; }
        .score-bar-fill { height: 100%; border-radius: 4px; transition: width 1s ease; }
        .btn-primary { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; border: none; border-radius: 10px; padding: 12px 20px; font-size: 14px; font-weight: 600; cursor: pointer; width: 100%; font-family: inherit; transition: all 0.2s; }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-secondary { background: #fff; color: #6366f1; border: 1.5px solid #6366f1; border-radius: 10px; padding: 10px 16px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
        .template-chip { border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 8px 12px; font-size: 12px; font-weight: 600; cursor: pointer; background: #fff; transition: all 0.15s; color: #334155; }
        .template-chip:hover { border-color: #6366f1; color: #6366f1; background: #eef2ff; }

        /* MOBILE RESPONSIVE */
        @media (max-width: 768px) {
          .ats-header { padding: 14px 16px !important; }
          .ats-body { padding: 16px !important; }
          .ats-card { padding: 16px !important; border-radius: 12px !important; }
          .score-circle-wrap { flex-direction: column !important; align-items: center !important; }
          .breakdown-grid { grid-template-columns: 1fr 1fr !important; }
          .drop-zone { padding: 28px 16px !important; }
        }
        @media (max-width: 480px) {
          .breakdown-grid { grid-template-columns: 1fr !important; }
          .ats-title { font-size: 18px !important; }
        }
      `}</style>

      {/* ── HEADER ── */}
      <div className="ats-header" style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid #e2e8f0", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => navigate("/dashboard")} style={{ background: "none", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: "#64748b", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, fontFamily: "inherit" }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Dashboard
          </button>
          <div style={{ width: 1, height: 20, background: "#e2e8f0" }} />
          <span style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>ATS <span style={{ color: "#6366f1" }}>Score Checker</span></span>
        </div>
        <div style={{ fontSize: 12, color: "#94a3b8", background: "#f1f5f9", padding: "4px 10px", borderRadius: 20, fontWeight: 600 }}>Free · Unlimited</div>
      </div>

      {/* ── BODY ── */}
      <div className="ats-body" style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px 80px" }}>

        {/* Intro */}
        {!result && !loading && (
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📊</div>
            <h1 className="ats-title" style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>Check Your ATS Score</h1>
            <p style={{ fontSize: 14, color: "#64748b", margin: 0, lineHeight: 1.6 }}>90% of Fortune 500 companies use ATS to filter resumes. Upload your PDF to get instant feedback and improve your chances.</p>
          </div>
        )}

        {/* ── DROP ZONE ── */}
        {!result && (
          <div
            className={`drop-zone ${dragging ? "drag" : ""}`}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current.click()}
          >
            <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={onFileChange} />
            {loading ? (
              <div>
                <div style={{ width: 40, height: 40, border: "4px solid #e0e7ff", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
                <p style={{ color: "#6366f1", fontWeight: 600, margin: 0 }}>Analyzing your resume...</p>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 6px" }}>Drag & Drop your Resume PDF</p>
                <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 16px" }}>or click to browse files</p>
                <button className="btn-primary" style={{ width: "auto", padding: "10px 24px" }} onClick={e => { e.stopPropagation(); fileRef.current.click(); }}>
                  📂 Choose PDF File
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── RESULTS ── */}
        {result && (
          <div>
            {/* Re-upload button */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
              <div style={{ fontSize: 13, color: "#64748b" }}>📄 <strong>{fileName}</strong></div>
              <button className="btn-secondary" onClick={() => { setResult(null); setAiSuggestions(null); setFileName(""); fileRef.current.value = ""; }}>
                ↩ Check Another Resume
              </button>
            </div>

            {/* ── SCORE CARD ── */}
            <div className="ats-card" style={{ textAlign: "center" }}>
              <div className="score-circle-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
                {/* Circle */}
                <div style={{ position: "relative", width: 130, height: 130, flexShrink: 0 }}>
                  <svg width="130" height="130" viewBox="0 0 130 130">
                    <circle cx="65" cy="65" r="55" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                    <circle cx="65" cy="65" r="55" fill="none" stroke={result.gradeColor} strokeWidth="10"
                      strokeDasharray="346" strokeDashoffset={346 - (346 * result.score / 100)}
                      strokeLinecap="round" transform="rotate(-90 65 65)" style={{ transition: "stroke-dashoffset 1.2s ease" }} />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 30, fontWeight: 900, color: result.gradeColor, lineHeight: 1 }}>{result.score}</span>
                    <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>/ 100</span>
                  </div>
                </div>
                {/* Grade info */}
                <div style={{ textAlign: "left" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: result.gradeColor + "15", borderRadius: 20, padding: "6px 16px", marginBottom: 8 }}>
                    <span style={{ fontSize: 22, fontWeight: 900, color: result.gradeColor }}>{result.grade}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: result.gradeColor }}>{result.grade === "A+" ? "Excellent" : result.grade === "A" ? "Great" : result.grade === "B" ? "Good" : result.grade === "C" ? "Fair" : result.grade === "D" ? "Needs Work" : "Poor"}</span>
                  </div>
                  <p style={{ fontSize: 14, color: "#334155", margin: "0 0 12px", fontWeight: 500 }}>{result.gradeMsg}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, color: "#ef4444", fontWeight: 600 }}>🔴 {result.issues.filter(i => i.type === "critical").length} Critical</span>
                    <span style={{ fontSize: 12, color: "#f59e0b", fontWeight: 600 }}>🟡 {result.issues.filter(i => i.type === "warning").length} Warnings</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── SCORE BREAKDOWN ── */}
            <div className="ats-card">
              <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: "0 0 16px" }}>📊 Score Breakdown</h3>
              <div className="breakdown-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {result.breakdown.map((item, i) => (
                  <div key={i} style={{ background: "#f8fafc", borderRadius: 10, padding: "12px" }}>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{item.icon}</div>
                    <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4, fontWeight: 600 }}>{item.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: getScoreColor(item.score / item.max * 100), marginBottom: 6 }}>{item.score}<span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 400 }}>/{item.max}</span></div>
                    <div className="score-bar">
                      <div className="score-bar-fill" style={{ width: `${item.score / item.max * 100}%`, background: getScoreColor(item.score / item.max * 100) }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── ISSUES ── */}
            {result.issues.length > 0 && (
              <div className="ats-card">
                <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: "0 0 14px" }}>🚨 Issues Found</h3>
                {result.issues.map((issue, i) => (
                  <div key={i} className="issue-chip" style={{ background: issue.type === "critical" ? "#fef2f2" : "#fffbeb", border: `1px solid ${issue.type === "critical" ? "#fecaca" : "#fde68a"}` }}>
                    <span style={{ fontSize: 14, flexShrink: 0 }}>{issue.type === "critical" ? "🔴" : "🟡"}</span>
                    <span style={{ color: issue.type === "critical" ? "#dc2626" : "#92400e" }}>{issue.text}</span>
                  </div>
                ))}
              </div>
            )}

            {/* ── SUGGESTIONS ── */}
            {result.suggestions.length > 0 && (
              <div className="ats-card">
                <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: "0 0 14px" }}>💡 Improvement Tips</h3>
                {result.suggestions.map((s, i) => (
                  <div key={i} className="suggestion-chip">
                    <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
                    <span style={{ color: "#166534" }}>{s.text}</span>
                  </div>
                ))}
              </div>
            )}

            {/* ── AI ANALYSIS ── */}
            <div className="ats-card" style={{ background: "linear-gradient(135deg, #eef2ff, #f5f3ff)", border: "1px solid #c7d2fe" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 22 }}>✨</span>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: 0 }}>AI-Powered Deep Analysis</h3>
                  <p style={{ fontSize: 12, color: "#6366f1", margin: 0, fontWeight: 600 }}>Get personalized suggestions from our AI assistant</p>
                </div>
              </div>
              {!aiSuggestions ? (
                <button className="btn-primary" onClick={getAISuggestions} disabled={aiLoading}>
                  {aiLoading ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                      Analyzing with AI...
                    </span>
                  ) : "✨ Get AI Suggestions"}
                </button>
              ) : (
                <div>
                  {aiSuggestions.summary && (
                    <p style={{ fontSize: 13, color: "#334155", background: "#fff", borderRadius: 10, padding: 12, marginBottom: 12, lineHeight: 1.6 }}>{aiSuggestions.summary}</p>
                  )}
                  {aiSuggestions.improvements?.map((imp, i) => (
                    <div key={i} style={{ background: impactBg[imp.impact] || "#f8fafc", border: `1px solid ${imp.impact === "high" ? "#fecaca" : imp.impact === "medium" ? "#fde68a" : "#bfdbfe"}`, borderRadius: 10, padding: "10px 14px", marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{imp.title}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: impactColor[imp.impact] || "#64748b", background: impactBg[imp.impact], border: `1px solid ${impactColor[imp.impact]}30`, borderRadius: 20, padding: "2px 8px" }}>{(imp.impact || "").toUpperCase()}</span>
                      </div>
                      <p style={{ fontSize: 12, color: "#475569", margin: 0, lineHeight: 1.5 }}>{imp.detail}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── TEMPLATE SUGGESTIONS ── */}
            <div className="ats-card">
              <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>🎨 Improve With Our Templates</h3>
              <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 14px" }}>Our ATS-optimized templates automatically score 10/10 on formatting. Switch your resume template to boost your score.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                {["Classic", "Harvard", "Simply Blue", "Black Pattern", "Atlantic Blue", "Green Accent", "Hunter Green", "Silver"].map(t => (
                  <button key={t} className="template-chip" onClick={() => navigate("/dashboard")}>{t}</button>
                ))}
              </div>
              <button className="btn-primary" onClick={() => navigate("/dashboard")}>
                🚀 Build Optimized Resume →
              </button>
            </div>

            {/* ── SCORE TIPS ── */}
            <div className="ats-card" style={{ background: "#0f172a", color: "#fff" }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 12px" }}>🏆 How to Score 90+</h3>
              {[
                ["📇", "Complete contact info (email, phone, location, LinkedIn)"],
                ["📝", "Write a 100-150 word professional summary"],
                ["💼", "List 2+ jobs with action verbs and metrics"],
                ["⚡", "Add 8-12 relevant skills (technical + soft)"],
                ["🔑", "Use industry keywords naturally in your content"],
                ["🎓", "Include full education with dates and institution"],
              ].map(([icon, tip], i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8, fontSize: 13, color: "#94a3b8" }}>
                  <span style={{ flexShrink: 0 }}>{icon}</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}