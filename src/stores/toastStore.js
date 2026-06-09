import { defineStore } from "pinia";

let toastId = 0;

export const useToastStore = defineStore("toast", {
  state: () => ({
    toasts: [],
  }),

  actions: {
    showToast({
      title = "Notifikasi",
      message = "",
      type = "success",
      duration = 2500,
    }) {
      const id = ++toastId;

      this.toasts.push({
        id,
        title,
        message,
        type,
      });

      setTimeout(() => {
        this.removeToast(id);
      }, duration);
    },

    removeToast(id) {
      this.toasts = this.toasts.filter((toast) => toast.id !== id);
    },
  },
});
