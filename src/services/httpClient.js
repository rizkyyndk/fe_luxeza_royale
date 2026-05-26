import { API_CONFIG } from "../config/apiConfig";

const AUTH_TOKEN_KEY = "authToken";

const getAuthToken = () => {
  return sessionStorage.getItem(AUTH_TOKEN_KEY);
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
    throw {
      status: response.status,
      message: data?.message || "Request failed",
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

  async delete(endpoint) {
    const response = await fetch(buildUrl(endpoint), {
      method: "DELETE",
      headers: buildHeaders(),
    });

    return handleResponse(response);
  },
};
