import { API_CONFIG } from "../config/apiConfig";

const AUTH_TOKEN_KEY = "authToken";
const AUTH_USER_KEY = "authUser";

const getAuthToken = () => {
  return sessionStorage.getItem(AUTH_TOKEN_KEY);
};

const clearExpiredAuth = () => {
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_USER_KEY);
};

const redirectToLoginIfNeeded = () => {
  const currentHash = window.location.hash || "";

  if (currentHash.includes("/login")) {
    return;
  }

  const currentRoute = currentHash.replace("#", "") || "/";

  window.location.href = `/app/#/login?redirect=${encodeURIComponent(
    currentRoute,
  )}`;
};

const buildUrl = (endpoint) => {
  if (endpoint.startsWith("http")) {
    return endpoint;
  }

  return `${API_CONFIG.baseURL}${endpoint}`;
};

const buildHeaders = (customHeaders = {}) => {
  const token = getAuthToken();

  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customHeaders,
  };
};

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
};

const handleResponse = async (response) => {
  const data = await parseResponse(response);

  if (!response.ok) {
    if (response.status === 401) {
      clearExpiredAuth();

      const isLogoutRequest = response.url.includes("/auth/logout");

      if (!isLogoutRequest) {
        redirectToLoginIfNeeded();
      }
    }

    throw {
      status: response.status,
      message: data?.message || "Permintaan belum dapat diproses.",
      errors: data?.errors || null,
      data,
    };
  }

  return data;
};

export const httpClient = {
  async get(endpoint) {
    const response = await fetch(buildUrl(endpoint), {
      method: "GET",
      headers: buildHeaders(),
    });

    return handleResponse(response);
  },

  async post(endpoint, payload) {
    const response = await fetch(buildUrl(endpoint), {
      method: "POST",
      headers: buildHeaders({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(payload),
    });

    return handleResponse(response);
  },

  async put(endpoint, payload) {
    const response = await fetch(buildUrl(endpoint), {
      method: "PUT",
      headers: buildHeaders({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(payload),
    });

    return handleResponse(response);
  },

  async patch(endpoint, payload) {
    const response = await fetch(buildUrl(endpoint), {
      method: "PATCH",
      headers: buildHeaders({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(payload),
    });

    return handleResponse(response);
  },

  async delete(endpoint) {
    const response = await fetch(buildUrl(endpoint), {
      method: "DELETE",
      headers: buildHeaders(),
    });

    return handleResponse(response);
  },
};
