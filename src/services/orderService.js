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

const normalizeImageUrl = (url) => {
  if (!url || typeof url !== "string") return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  if (url.startsWith("/")) {
    return `${window.location.origin}${url}`;
  }

  return `${window.location.origin}/${url}`;
};

const getPrimaryImageValue = (product) => {
  const primaryImage = product?.primary_image;

  if (!primaryImage) return "";

  if (typeof primaryImage === "string") {
    return primaryImage;
  }

  return (
    primaryImage.image_url ||
    primaryImage.url ||
    primaryImage.path ||
    primaryImage.file_path ||
    primaryImage.image ||
    ""
  );
};

const normalizeOrderItem = (item) => {
  const product = item.product || {};
  const image = normalizeImageUrl(getPrimaryImageValue(product));

  return {
    id: item.id,
    product_id: item.product_id,
    slug: product.slug || null,
    title: product.title || product.name || "Product",
    image,
    size: item.size || "-",
    quantity: Number(item.quantity || 0),
    price: Number(item.price || product.price || 0),
    subtotal: Number(item.subtotal || 0),
    product,
    raw: item,
  };
};

const normalizePaymentMethodFromBackend = (method) => {
  if (!method) return null;

  return {
    id: method.id,
    type: method.type,
    code: method.code,
    name: method.name,
    bankName: method.bank_name || "",
    accountName: method.account_name || "",
    accountNumber: method.account_number || "",
    qrImageUrl: method.qr_image_url || "",
    instructions: method.instructions || "",
    isActive: Boolean(method.is_active),
    sortOrder: Number(method.sort_order || 0),
    raw: method,
  };
};

const normalizeOrder = (order, summary = {}) => {
  if (!order) return null;

  const items = Array.isArray(order.items)
    ? order.items.map(normalizeOrderItem)
    : [];

  const subtotalFromItems = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const subtotal = Number(
    order.subtotal_amount ?? summary.subtotal ?? subtotalFromItems,
  );

  const discountAmount = Number(
    order.discount_amount ?? summary.discount_amount ?? 0,
  );

  const shippingCost = Number(
    order.shipping_cost ?? summary.shipping_cost ?? 0,
  );

  const total = Number(
    order.total_amount ??
      summary.grand_total ??
      subtotal - discountAmount + shippingCost,
  );

  return {
    id: order.id,
    order_code: order.order_code,
    orderNumber: order.order_code,

    customer: {
      fullName: order.customer_name,
      email: order.customer_email,
      phone: order.customer_phone,
      address: order.customer_address,
    },

    items,

    subtotal,
    discountAmount,
    shippingCost,
    total,

    voucher: order.voucher_code
      ? {
          code: order.voucher_code,
        }
      : null,

    shippingMethod: order.shipping_method || "standard",
    paymentMethod:
      order.payment_method_code ||
      order.paymentMethod ||
      order.payment_method ||
      null,

    paymentMethodData: order.payment_method
      ? normalizePaymentMethodFromBackend(order.payment_method)
      : order.paymentMethodData || null,

    status: order.status || "pending",
    createdAt: order.created_at,
    updatedAt: order.updated_at,

    raw: order,
  };
};

const normalizeOrderList = (orders) => {
  if (!Array.isArray(orders)) return [];

  return orders.map((order) => normalizeOrder(order)).filter(Boolean);
};

const normalizeOrderPayload = (orderPayload) => {
  const normalizedItems = (orderPayload.items || []).map((item) => {
    return {
      product_id: item.product_id || item.productId || item.id || null,
      slug: item.slug || null,
      size: item.size || null,
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
      const normalizedOrder = normalizeOrder(data.order, data.summary);

      sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(normalizedOrder));

      return normalizedOrder;
    }

    const normalizedOrder = normalizeOrder(data);

    if (normalizedOrder) {
      sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(normalizedOrder));
    }

    return normalizedOrder || data;
  },

  async getOrders(params = {}) {
    if (USE_MOCK_ORDER) {
      return loadOrdersFromStorage();
    }

    const query = new URLSearchParams(params).toString();
    const endpoint = query ? `/orders?${query}` : "/orders";

    const response = await httpClient.get(endpoint);
    const data = unwrapData(response, []);

    return normalizeOrderList(data);
  },

  async getOrderDetail(orderCode) {
    const response = await httpClient.get(`/orders/${orderCode}`);
    const data = unwrapData(response, null);

    return normalizeOrder(data);
  },

  async updateOrderStatus(orderCode, status) {
    const response = await httpClient.put(`/orders/${orderCode}/status`, {
      status,
    });

    const data = unwrapData(response, null);

    return normalizeOrder(data);
  },
};
