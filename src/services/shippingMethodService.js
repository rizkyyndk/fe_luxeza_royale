import { httpClient } from "./httpClient";

const unwrapData = (response, fallback = null) => {
  const payload = response?.data ?? response ?? fallback;

  if (payload?.data !== undefined) {
    return payload.data;
  }

  return payload ?? fallback;
};

export const normalizeShippingMethod = (method) => {
  if (!method) return null;

  return {
    id: method.id,
    code: method.code,
    value: method.code,
    name: method.name,
    label: method.name,
    description: method.description || "",
    cost: Number(method.cost || 0),
    isActive: Boolean(method.is_active),
    sortOrder: Number(method.sort_order || 0),
    raw: method,
  };
};

const normalizeShippingMethods = (methods) => {
  if (!Array.isArray(methods)) return [];

  return methods.map(normalizeShippingMethod).filter(Boolean);
};

export const shippingMethodService = {
  async getActiveShippingMethods() {
    const response = await httpClient.get("/shipping-methods");
    const data = unwrapData(response, []);

    return normalizeShippingMethods(data);
  },

  async getAdminShippingMethods() {
    const response = await httpClient.get("/admin/shipping-methods");
    const data = unwrapData(response, []);

    return normalizeShippingMethods(data);
  },

  async createShippingMethod(payload) {
    const response = await httpClient.post("/admin/shipping-methods", payload);
    const data = unwrapData(response, null);

    return normalizeShippingMethod(data);
  },

  async updateShippingMethod(id, payload) {
    const response = await httpClient.put(
      `/admin/shipping-methods/${id}`,
      payload,
    );

    const data = unwrapData(response, null);

    return normalizeShippingMethod(data);
  },

  async deleteShippingMethod(id) {
    return httpClient.delete(`/admin/shipping-methods/${id}`);
  },
};
