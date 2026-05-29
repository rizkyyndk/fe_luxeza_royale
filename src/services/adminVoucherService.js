import { httpClient } from "./httpClient";

const unwrapRoot = (response) => {
  return response?.data ?? response ?? {};
};

const unwrapData = (response, fallback = null) => {
  const root = unwrapRoot(response);
  return root?.data ?? root ?? fallback;
};

const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();

  return query ? `?${query}` : "";
};

const toNumberOrNull = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return Number(value);
};

const mapVoucher = (voucher) => {
  const discountAmount = toNumberOrNull(voucher.discount_amount);
  const discountPercent = toNumberOrNull(voucher.discount_percent);

  const discountType = discountPercent !== null ? "percent" : "amount";
  const discountValue =
    discountType === "percent" ? discountPercent : discountAmount;

  return {
    id: voucher.id,
    code: voucher.code || "",
    discountType,
    discountValue: discountValue ?? 0,
    discountAmount,
    discountPercent,
    validFrom: voucher.valid_from || null,
    validUntil: voucher.valid_until || null,
    usageLimit: toNumberOrNull(voucher.usage_limit),
    usedCount: Number(voucher.used_count || 0),
    isActive: Boolean(voucher.is_active),
    raw: voucher,
  };
};

export const adminVoucherService = {
  async getAdminVouchers(params = {}) {
    const queryString = buildQueryString(params);
    const response = await httpClient.get(`/admin/vouchers${queryString}`);

    const data = unwrapData(response, []);

    return Array.isArray(data) ? data.map(mapVoucher) : [];
  },

  async createVoucher(payload) {
    const response = await httpClient.post("/admin/vouchers", payload);
    const data = unwrapData(response, null);

    return data ? mapVoucher(data) : null;
  },

  async updateVoucher(id, payload) {
    const response = await httpClient.put(`/admin/vouchers/${id}`, payload);
    const data = unwrapData(response, null);

    return data ? mapVoucher(data) : null;
  },

  async deleteVoucher(id) {
    return await httpClient.delete(`/admin/vouchers/${id}`);
  },
};
