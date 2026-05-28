import { defineStore } from "pinia";
import { authService } from "../services/authService";

const AUTH_TOKEN_KEY = "authToken";
const AUTH_USER_KEY = "authUser";

const loadUserFromStorage = () => {
  try {
    const savedUser = sessionStorage.getItem(AUTH_USER_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error("Failed to load auth user:", error);
    return null;
  }
};

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: sessionStorage.getItem(AUTH_TOKEN_KEY),
    user: loadUserFromStorage(),
    isLoading: false,
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.token && state.user),
    isAdmin: (state) => state.user?.role === "admin",
    isCustomer: (state) => state.user?.role === "customer",
    userName: (state) => state.user?.name || "",
  },

  actions: {
    setAuth(data) {
      const token = data?.token || null;
      const user = data?.user || null;

      this.token = token;
      this.user = user;

      if (token) {
        sessionStorage.setItem(AUTH_TOKEN_KEY, token);
      }

      if (user) {
        sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      }
    },

    clearAuth() {
      this.token = null;
      this.user = null;

      sessionStorage.removeItem(AUTH_TOKEN_KEY);
      sessionStorage.removeItem(AUTH_USER_KEY);
    },

    async login(payload) {
      this.isLoading = true;

      try {
        const data = await authService.login(payload);

        if (data?.token && data?.user) {
          this.setAuth(data);
        }

        return data;
      } finally {
        this.isLoading = false;
      }
    },

    async register(payload) {
      this.isLoading = true;

      try {
        const data = await authService.register(payload);

        if (data?.token && data?.user) {
          this.setAuth(data);
        }

        return data;
      } finally {
        this.isLoading = false;
      }
    },

    async verifyAccount(payload) {
      this.isLoading = true;

      try {
        const data = await authService.verifyAccount(payload);

        if (data?.token && data?.user) {
          this.setAuth(data);
        }

        return data;
      } finally {
        this.isLoading = false;
      }
    },

    async resendVerificationCode(payload) {
      this.isLoading = true;

      try {
        return await authService.resendVerificationCode(payload);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchCurrentUser() {
      if (!this.token) return null;

      this.isLoading = true;

      try {
        const data = await authService.me();
        const user = data?.user || data;

        this.user = user;
        sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));

        return user;
      } catch (error) {
        this.clearAuth();
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async logout() {
      try {
        if (this.token) {
          await authService.logout();
        }
      } catch (error) {
        console.error("Failed to logout:", error);
      } finally {
        this.clearAuth();
      }
    },
  },
});
