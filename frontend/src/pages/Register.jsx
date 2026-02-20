import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">

      {/* Logo */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path d="M7 8h10M7 12h6M7 16h8M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
              stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="text-xl font-bold text-gray-800">ResumeAI</span>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-1">Create account</h2>
        <p className="text-sm text-center text-gray-500 mb-6">Get started with AI-powered resumes</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-sm transition-colors"
          >
            Create Account
          </button>
        </form>

        <p className="text-sm mt-4 text-center text-gray-500">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="text-blue-600 cursor-pointer font-medium hover:underline">
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;