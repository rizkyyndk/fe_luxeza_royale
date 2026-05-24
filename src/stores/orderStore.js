import { defineStore } from "pinia";

const ORDER_HISTORY_KEY = "orderHistory";

const loadOrdersFromStorage = () => {
  try {
    const savedOrders = sessionStorage.getItem(ORDER_HISTORY_KEY);
    return savedOrders ? JSON.parse(savedOrders) : [];
  } catch (error) {
    console.error("Failed to load order history:", error);
    return [];
  }
};

export const useOrderStore = defineStore("order", {
  state: () => ({
    orders: loadOrdersFromStorage(),
  }),

  getters: {
    totalOrders: (state) => state.orders.length,

    isEmpty: (state) => state.orders.length === 0,

    latestOrders: (state) => {
      return [...state.orders].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    },
  },

  actions: {
    saveOrders() {
      sessionStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(this.orders));
    },

    addOrder(order) {
      const safeOrder = JSON.parse(JSON.stringify(order));

      this.orders.unshift({
        ...safeOrder,
        status: safeOrder.status || "Processing",
      });

      this.saveOrders();
    },

    clearOrders() {
      this.orders = [];
      sessionStorage.removeItem(ORDER_HISTORY_KEY);
    },
  },
});
