import { API_CONFIG } from "../config/apiConfig";

const buildUrl = (endpoint) => {
  if (endpoint.startsWith("http")) {
    return endpoint;
  }

  return `${API_CONFIG.baseURL}${endpoint}`;
};

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
};

export const httpClient = {
  async get(endpoint) {
    const response = await fetch(buildUrl(endpoint), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      throw {
        status: response.status,
        message: data?.message || "Request failed",
        errors: data?.errors || null,
      };
    }

    return data;
  },

  async post(endpoint, payload) {
    const response = await fetch(buildUrl(endpoint), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      throw {
        status: response.status,
        message: data?.message || "Request failed",
        errors: data?.errors || null,
      };
    }

    return data;
  },

  async put(endpoint, payload) {
    const response = await fetch(buildUrl(endpoint), {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      throw {
        status: response.status,
        message: data?.message || "Request failed",
        errors: data?.errors || null,
      };
    }

    return data;
  },

  async delete(endpoint) {
    const response = await fetch(buildUrl(endpoint), {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      throw {
        status: response.status,
        message: data?.message || "Request failed",
        errors: data?.errors || null,
      };
    }

    return data;
  },
};
