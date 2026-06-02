import { httpClient } from "./httpClient";

const unwrapData = (response, fallback = null) => {
  const payload = response?.data ?? response ?? fallback;

  if (payload?.data !== undefined) {
    return payload.data;
  }

  return payload ?? fallback;
};

export const authService = {
  async register(payload) {
    const response = await httpClient.post("/auth/register", payload);
    return unwrapData(response, null);
  },

  async login(payload) {
    const response = await httpClient.post("/auth/login", payload);
    return unwrapData(response, null);
  },

  async forgotPassword(email) {
    const response = await httpClient.post("/auth/forgot-password", {
      email,
    });

    return unwrapData(response, null);
  },

  async resetPassword(payload) {
    const response = await httpClient.post("/auth/reset-password", payload);

    return unwrapData(response, null);
  },

  async verifyAccount(payload) {
    const response = await httpClient.post("/auth/verify", payload);
    return unwrapData(response, null);
  },

  async resendVerificationCode(payload) {
    const response = await httpClient.post("/auth/resend-code", payload);
    return unwrapData(response, null);
  },

  async me() {
    const response = await httpClient.get("/auth/me");
    return unwrapData(response, null);
  },

  async logout() {
    return httpClient.post("/auth/logout", {});
  },
};
