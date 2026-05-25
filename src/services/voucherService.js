import { httpClient } from "./httpClient";
import { findVoucherByCode } from "../data/vouchers";

const USE_MOCK_VOUCHER = false;

const unwrapData = (response, fallback = null) => {
  return response?.data ?? response ?? fallback;
};

export const voucherService = {
  async validateVoucher(code, subtotal = 0) {
    if (USE_MOCK_VOUCHER) {
      const voucher = findVoucherByCode(code);

      if (!voucher) {
        throw {
          status: 404,
          message: "Invalid voucher code.",
        };
      }

      return voucher;
    }

    const response = await httpClient.post("/vouchers/validate", {
      code,
      subtotal,
    });

    return unwrapData(response, null);
  },
};
