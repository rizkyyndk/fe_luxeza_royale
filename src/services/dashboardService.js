import { httpClient } from "./httpClient";

const unwrapData = (response, fallback = null) => {
  return response?.data ?? response ?? fallback;
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

const normalizeNumber = (value) => {
  return Number(value || 0);
};

const normalizeRecentOrder = (order) => {
  return {
    id: order.id,
    orderCode: order.order_code || "",
    customerName: order.customer_name || "-",
    customerEmail: order.customer_email || "",
    status: order.status || "pending",
    totalAmount: normalizeNumber(order.total_amount),
    paymentMethodCode: order.payment_method_code || "",
    paymentMethodName: order.payment_method_name || "",
    trackingNumber: order.tracking_number || "",
    createdAt: order.created_at || null,
    raw: order,
  };
};

const normalizeLowStockProduct = (item) => {
  return {
    type: item.type || "product",
    productId: item.product_id,
    productName: item.product_name || "Produk",
    slug: item.slug || "",
    categoryName: item.category_name || "-",
    size: item.size || "",
    stock: normalizeNumber(item.stock),
    price: normalizeNumber(item.price),
    imageUrl: normalizeImageUrl(item.image_url || ""),
    raw: item,
  };
};

const normalizeRecentProduct = (product) => {
  return {
    id: product.id,
    name: product.name || "Produk",
    slug: product.slug || "",
    categoryName: product.category_name || "-",
    price: normalizeNumber(product.price),
    stock: normalizeNumber(product.stock),
    isActive: Boolean(product.is_active),
    imageUrl: normalizeImageUrl(product.image_url || ""),
    createdAt: product.created_at || null,
    raw: product,
  };
};

const normalizeDashboardSummary = (payload) => {
  const orders = payload?.orders || {};
  const revenue = payload?.revenue || {};
  const products = payload?.products || {};
  const vouchers = payload?.vouchers || {};

  return {
    orders: {
      total: normalizeNumber(orders.total),
      today: normalizeNumber(orders.today),
      needsAction: normalizeNumber(orders.needs_action),
      statusCounts: {
        pending: normalizeNumber(orders.status_counts?.pending),
        paymentSubmitted: normalizeNumber(
          orders.status_counts?.payment_submitted,
        ),
        paid: normalizeNumber(orders.status_counts?.paid),
        processing: normalizeNumber(orders.status_counts?.processing),
        shipped: normalizeNumber(orders.status_counts?.shipped),
        completed: normalizeNumber(orders.status_counts?.completed),
        cancelled: normalizeNumber(orders.status_counts?.cancelled),
      },
      recent: Array.isArray(orders.recent)
        ? orders.recent.map(normalizeRecentOrder)
        : [],
    },

    revenue: {
      confirmedRevenue: normalizeNumber(revenue.confirmed_revenue),
      completedRevenue: normalizeNumber(revenue.completed_revenue),
      todayRevenue: normalizeNumber(revenue.today_revenue),
    },

    products: {
      total: normalizeNumber(products.total),
      active: normalizeNumber(products.active),
      inactive: normalizeNumber(products.inactive),
      lowStockThreshold: normalizeNumber(products.low_stock_threshold),
      lowStock: Array.isArray(products.low_stock)
        ? products.low_stock.map(normalizeLowStockProduct)
        : [],
      recent: Array.isArray(products.recent)
        ? products.recent.map(normalizeRecentProduct)
        : [],
    },

    vouchers: {
      total: normalizeNumber(vouchers.total),
      active: normalizeNumber(vouchers.active),
    },
  };
};

export const dashboardService = {
  async getSummary(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = query
      ? `/admin/dashboard/summary?${query}`
      : "/admin/dashboard/summary";

    const response = await httpClient.get(endpoint);
    const data = unwrapData(response, null);

    return normalizeDashboardSummary(data);
  },
};
