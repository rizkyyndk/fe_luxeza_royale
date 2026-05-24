import { httpClient } from "./httpClient";

const USE_MOCK_ORDER = true;
const ORDER_HISTORY_KEY = "orderHistory";
const LAST_ORDER_KEY = "lastOrder";

const loadOrdersFromStorage = () => {
  try {
    const savedOrders = sessionStorage.getItem(ORDER_HISTORY_KEY);
    return savedOrders ? JSON.parse(savedOrders) : [];
  } catch (error) {
    console.error("Failed to load order history:", error);
    return [];
  }
};

const saveOrderToStorage = (order) => {
  const orders = loadOrdersFromStorage();

  const orderWithStatus = {
    ...order,
    status: order.status || "Processing",
  };

  const updatedOrders = [orderWithStatus, ...orders];

  sessionStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(updatedOrders));
  sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(orderWithStatus));

  return orderWithStatus;
};

export const orderService = {
  async createOrder(orderPayload) {
    if (USE_MOCK_ORDER) {
      return saveOrderToStorage(orderPayload);
    }

    return httpClient.post("/orders", orderPayload);
  },

  async getOrders() {
    if (USE_MOCK_ORDER) {
      return loadOrdersFromStorage();
    }

    return httpClient.get("/orders");
  },
};
