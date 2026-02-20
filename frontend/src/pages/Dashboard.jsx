import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { resumeService } from "../services/resumeService";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchResumes = async () => {
    try {
      const data = await resumeService.getAll();
      setResumes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResumes(); }, []);

  const createResume = async () => {
    try {
      const data = await resumeService.create({ title: "Untitled Resume" });
      navigate(`/resume/${data.id}/edit`);
    } catch (err) {
      alert("Failed to create resume");
    }
  };

  const duplicateResume = async (e, resume) => {
    e.stopPropagation();
    try {
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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M7 8h10M7 12h6M7 16h8M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
                  stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900">ResumeAI</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
              title="Logout"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Title row */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
            <p className="text-gray-500 mt-1">Create and manage your AI-powered resumes</p>
          </div>
          <button
            onClick={createResume}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            New Resume
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>

        /* Empty state */
        ) : resumes.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center py-20">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="text-gray-400 mb-4">
              <path d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zM12 8v8M8 12h8"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">No resumes yet</h3>
            <p className="text-gray-500 text-sm mb-5">Create your first AI-powered resume</p>
            <button
              onClick={createResume}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Create Resume
            </button>
          </div>

        /* Resume grid */
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume, i) => (
              <div
                key={resume.id}
                onClick={() => navigate(`/resume/${resume.id}/edit`)}
                className="group bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <path d="M7 8h10M7 12h6M7 16h8M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
                        stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>

                  {/* Action buttons — visible on hover */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => duplicateResume(e, resume)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Duplicate"
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                        <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                    <button
                      onClick={(e) => deleteResume(e, resume.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 text-sm mb-1">{resume.title}</h3>
                <p className="text-xs text-gray-400">
                  Updated {new Date(resume.updated_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}