import { httpClient } from "./httpClient";

const unwrapData = (response, fallback = null) => {
  const payload = response?.data ?? response ?? fallback;

  if (payload?.data !== undefined) {
    return payload.data;
  }

  return payload ?? fallback;
};

const getApiBaseUrl = () => {
  return (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");
};

const getApiOrigin = () => {
  const apiBaseUrl = getApiBaseUrl();

  if (apiBaseUrl.startsWith("http://") || apiBaseUrl.startsWith("https://")) {
    return new URL(apiBaseUrl).origin;
  }

  return window.location.origin;
};

const getAuthToken = () => {
  return sessionStorage.getItem("authToken");
};

const normalizeImageUrl = (url) => {
  if (!url || typeof url !== "string") return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const cleanPath = url.startsWith("/") ? url : `/${url}`;

  return `${getApiOrigin()}${cleanPath}`;
};

export const normalizePaymentMethod = (method) => {
  if (!method) return null;

  return {
    id: method.id,
    type: method.type,
    code: method.code,
    name: method.name,
    bankName: method.bank_name || "",
    accountName: method.account_name || "",
    accountNumber: method.account_number || "",
    qrImageUrl: normalizeImageUrl(method.qr_image_url),
    instructions: method.instructions || "",
    isActive: Boolean(method.is_active),
    sortOrder: Number(method.sort_order || 0),
    raw: method,
  };
};

const normalizePaymentMethods = (methods) => {
  if (!Array.isArray(methods)) return [];

  return methods.map(normalizePaymentMethod).filter(Boolean);
};

export const paymentMethodService = {
  async getActivePaymentMethods() {
    const response = await httpClient.get("/payment-methods");
    const data = unwrapData(response, []);

    return normalizePaymentMethods(data);
  },

  async getAdminPaymentMethods() {
    const response = await httpClient.get("/admin/payment-methods");
    const data = unwrapData(response, []);

    return normalizePaymentMethods(data);
  },

  async uploadPaymentImage(file) {
    const formData = new FormData();
    formData.append("image", file);

    const token = getAuthToken();

    const response = await fetch(
      `${getApiBaseUrl()}/admin/payment-methods/images/upload`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      },
    );

    const result = await response.json().catch(() => null);

    if (!response.ok || result?.success === false) {
      const error = new Error(
        result?.message || "Gambar pembayaran belum dapat diunggah.",
      );

      error.status = response.status;
      error.errors = result?.errors || null;
      error.data = result;

      throw error;
    }

    return result?.data || result;
  },

  async createPaymentMethod(payload) {
    const response = await httpClient.post("/admin/payment-methods", payload);
    const data = unwrapData(response, null);

    return normalizePaymentMethod(data);
  },

  async updatePaymentMethod(id, payload) {
    const response = await httpClient.put(
      `/admin/payment-methods/${id}`,
      payload,
    );

    const data = unwrapData(response, null);

    return normalizePaymentMethod(data);
  },

  async deletePaymentMethod(id) {
    return httpClient.delete(`/admin/payment-methods/${id}`);
  },
};
