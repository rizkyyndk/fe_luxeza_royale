import { httpClient } from "./httpClient";

const unwrapData = (response, fallback = []) => {
  return response?.data ?? response ?? fallback;
};

const normalizeAddress = (address) => {
  if (!address) return null;

  return {
    id: address.id,
    userId: address.user_id || address.userId,

    label: address.label || "Rumah",
    recipientName: address.recipient_name || address.recipientName || "",
    phone: address.phone || "",

    provinceId: address.province_id || address.provinceId || "",
    province: address.province || "",

    cityId: address.city_id || address.cityId || "",
    city: address.city || "",

    districtId: address.district_id || address.districtId || "",
    district: address.district || "",

    villageId: address.village_id || address.villageId || "",
    village: address.village || "",

    rt: address.rt || "",
    rw: address.rw || "",
    postalCode: address.postal_code || address.postalCode || "",
    addressDetail: address.address_detail || address.addressDetail || "",

    isPrimary: Boolean(address.is_primary ?? address.isPrimary),
    raw: address,
  };
};

const normalizeAddresses = (addresses) => {
  if (!Array.isArray(addresses)) return [];

  return addresses.map(normalizeAddress).filter(Boolean);
};

export const userAddressService = {
  async getAddresses() {
    const response = await httpClient.get("/user/addresses");
    return normalizeAddresses(unwrapData(response, []));
  },

  async createAddress(payload) {
    const response = await httpClient.post("/user/addresses", payload);
    return normalizeAddress(unwrapData(response, null));
  },

  async updateAddress(id, payload) {
    const response = await httpClient.put(`/user/addresses/${id}`, payload);
    return normalizeAddress(unwrapData(response, null));
  },

  async deleteAddress(id) {
    return httpClient.delete(`/user/addresses/${id}`);
  },

  async setPrimaryAddress(id) {
    const response = await httpClient.put(`/user/addresses/${id}/primary`, {});
    return normalizeAddress(unwrapData(response, null));
  },
};
