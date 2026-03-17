import React from "react";

/**
 * LoadingScreen Component
 * A full-page loading overlay with spinner
 * Used during auth operations (login, register) and other async actions
 * Props:
 *   - visible (bool): Show/hide the loading screen
 *   - message (string): Optional custom message (default: "Loading...")
 */
export default function LoadingScreen({ visible, message = "Loading..." }) {
  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.5)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        animation: "fadeIn 0.2s ease"
      }}
    >
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .loading-spinner {
          animation: spin 1s linear infinite;
        }
      `}</style>

      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 40,
          textAlign: "center",
          boxShadow: "0 20px 60px -12px rgba(99,102,241,0.2)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          maxWidth: 300
        }}
      >
        {/* Spinner */}
        <svg
          className="loading-spinner"
          width={48}
          height={48}
          viewBox="0 0 24 24"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#6366f1", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#8b5cf6", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <circle cx="12" cy="12" r="10" />
        </svg>

        {/* Message */}
        <div>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#0f172a" }}>
            {message}
          </p>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
            Please wait...
          </p>
        </div>
      </div>
    </div>
  );
}
