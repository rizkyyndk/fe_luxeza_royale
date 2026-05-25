import { httpClient } from "./httpClient";

const USE_MOCK_ORDER = false;
const ORDER_HISTORY_KEY = "orderHistory";
const LAST_ORDER_KEY = "lastOrder";

const unwrapData = (response, fallback = null) => {
  return response?.data ?? response ?? fallback;
};

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

const normalizeOrderPayload = (orderPayload) => {
  const normalizedItems = (orderPayload.items || []).map((item) => {
    return {
      product_id: item.product_id || item.productId || item.id || null,
      slug: item.slug || null,
      quantity: Number(item.quantity || item.qty || 1),
    };
  });

  return {
    ...orderPayload,
    items: normalizedItems,
  };
};

export const orderService = {
  async createOrder(orderPayload) {
    if (USE_MOCK_ORDER) {
      return saveOrderToStorage(orderPayload);
    }

    const payload = normalizeOrderPayload(orderPayload);
    const response = await httpClient.post("/orders", payload);
    const data = unwrapData(response, null);

    if (data?.order) {
      sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(data.order));
      return data.order;
    }

    return data;
  },

  async getOrders(params = {}) {
    if (USE_MOCK_ORDER) {
      return loadOrdersFromStorage();
    }

    const query = new URLSearchParams(params).toString();
    const endpoint = query ? `/orders?${query}` : "/orders";

    const response = await httpClient.get(endpoint);
    return unwrapData(response, []);
  },

  async getOrderDetail(orderCode) {
    const response = await httpClient.get(`/orders/${orderCode}`);
    return unwrapData(response, null);
  },
};
