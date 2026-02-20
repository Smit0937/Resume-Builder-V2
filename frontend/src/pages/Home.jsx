import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

import {
  FileText,
  Sparkles,
  Shield,
  Download,
  ArrowRight,
  Zap,
  Layout,
} from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: Sparkles,
      title: "AI Suggestions",
      desc: "Generate summaries, improve wording, and get skill recommendations powered by AI.",
    },
    {
      icon: Layout,
      title: "Multiple Templates",
      desc: "Choose from Modern, Classic, and Minimal templates. Switch anytime.",
    },
    {
      icon: Download,
      title: "PDF Download",
      desc: "Download your resume as a professionally styled PDF ready for applications.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      desc: "Your data is encrypted and protected with enterprise-grade security.",
    },
    {
      icon: Zap,
      title: "ATS Optimized",
      desc: "Resumes are optimized to pass Applicant Tracking Systems used by employers.",
    },
    {
      icon: FileText,
      title: "Full Control",
      desc: "Create, edit, duplicate, and manage multiple resumes from your dashboard.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-blue-600">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">ResumeAI</span>
          </div>

          {/* CTA */}
          {user ? (
            <Button onClick={() => navigate("/dashboard")} className="gap-2">
              Dashboard <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => navigate("/login")} className="gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <Sparkles className="h-4 w-4" />
          AI-Powered Resume Builder
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
          Build{" "}
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            ATS-Friendly
          </span>{" "}
          Resumes in Minutes
        </h1>

        {/* Subheading */}
        <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
          Create professional resumes with AI-powered suggestions, multiple templates,
          and instant PDF downloads. Stand out to recruiters and pass ATS screening.
        </p>

        {/* CTA Button */}
        <Button
          size="lg"
          onClick={() => navigate(user ? "/Dashboard" : "/login")}
          className="gap-2 px-8 mx-auto"
        >
          Start Building <ArrowRight className="h-4 w-4" />
        </Button>
      </section>

      {/* FEATURES */}
      <section className="border-t border-gray-200 bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 tracking-tight">
            Everything You Need
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 bg-gray-50 p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="mb-4 h-10 w-10 flex items-center justify-center rounded-lg bg-blue-100">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 py-8 bg-gray-50">
        <div className="text-center text-sm text-gray-400">
          © {new Date().getFullYear()} ResumeAI. Build professional resumes with AI.
        </div>
      </footer>
    </div>
  );
}