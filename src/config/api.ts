// API Configuration
// Uses environment variable if available, otherwise defaults based on environment

// For local development: API_BASE = http://localhost:4000
// For production: API_BASE = https://bhs-backend-ou0m.onrender.com

const isLocalDev =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

export const API_BASE = isLocalDev
  ? "http://localhost:4000"
  : "https://bhs-backend-ou0m.onrender.com";
