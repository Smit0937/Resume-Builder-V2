import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Force Vercel rebuild - FIX DEPLOYED API CALLS
console.log("🚀 App loading - fresh build");


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);