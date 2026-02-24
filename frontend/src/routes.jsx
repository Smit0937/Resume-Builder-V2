import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder"; 
import { useAuth } from "./context/AuthContext";
import TemplateSelect from "./pages/TemplateSelect";


function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/resume/:id/edit" element={<PrivateRoute><ResumeBuilder /></PrivateRoute>} />
        <Route path="/resume/new" element={<PrivateRoute><TemplateSelect /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}