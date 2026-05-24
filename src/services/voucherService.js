import { httpClient } from "./httpClient";
import { findVoucherByCode } from "../data/vouchers";

const USE_MOCK_VOUCHER = true;

export const voucherService = {
  async validateVoucher(code) {
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

    return httpClient.post("/vouchers/validate", {
      code,
    });
  },
};
