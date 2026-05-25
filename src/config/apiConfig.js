const rawBaseURL =
  import.meta.env.VITE_API_BASE_URL || "http://luxeza-royale-api.test/api";

export const API_CONFIG = {
  baseURL: rawBaseURL.replace(/\/$/, ""),

  appName: import.meta.env.VITE_APP_NAME || "Luxeza Royale",

  backendStack: import.meta.env.VITE_BACKEND_STACK || "Laravel",

  timeout: 15000,
};
