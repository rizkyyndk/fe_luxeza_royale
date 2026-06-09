import { httpClient } from "./httpClient";

const unwrapData = (response, fallback = null) => {
  return response?.data ?? response ?? fallback;
};

export const voucherService = {
  async validateVoucher(code, subtotal = 0) {
    const response = await httpClient.post("/vouchers/validate", {
      code,
      subtotal,
    });

    const voucherData = unwrapData(response, null);

    if (!voucherData) {
      throw {
        status: 400,
        message: "Response voucher tidak valid.",
      };
    }

    return {
      code: voucherData.code,
      label: `Voucher ${voucherData.code}`,

      // Mapping dari format backend ke format frontend lama
      discountType:
        voucherData.discount_type === "percent" ? "percentage" : "fixed",

      discountValue: Number(voucherData.discount_value || 0),
      discountAmount: Number(voucherData.discount_amount || 0),
      subtotal: Number(voucherData.subtotal || 0),
      grandTotal: Number(voucherData.grand_total || 0),

      raw: voucherData,
    };
  },
};
