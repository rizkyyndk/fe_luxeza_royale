export const vouchers = [
  {
    code: "LUXEZAROYALE_120926",
    label: "Luxeza Royale Special Voucher",
    discountType: "percentage",
    discountValue: 12,
    maxDiscount: 120000,
  },
];

export const findVoucherByCode = (code) => {
  return vouchers.find(
    (voucher) => voucher.code.toLowerCase() === code.trim().toLowerCase(),
  );
};
