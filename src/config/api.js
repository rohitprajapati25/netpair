// Centralized API configuration
// Reads VITE_API_URL from .env (production) or .env.local (local dev)
// .env.local overrides .env — so local dev always hits localhost:5000
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Strip trailing slash for consistency
export const API_URL = API_BASE.replace(/\/$/, "");

// Base origin without /api — used for socket.io and file/upload URLs
export const BASE_URL = API_URL.replace(/\/api$/, "");

export default API_URL;
