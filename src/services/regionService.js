import { httpClient } from "./httpClient";

const unwrapData = (response, fallback = []) => {
  return response?.data ?? response ?? fallback;
};

const normalizeRegion = (region) => {
  if (!region) return null;

  return {
    id: String(region.id),
    name: region.name,
    raw: region,
  };
};

const normalizeRegions = (regions) => {
  if (!Array.isArray(regions)) return [];

  return regions
    .map(normalizeRegion)
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name, "id"));
};

export const regionService = {
  async getProvinces() {
    const response = await httpClient.get("/regions/provinces");
    return normalizeRegions(unwrapData(response, []));
  },

  async getCities(provinceId) {
    if (!provinceId) return [];

    const response = await httpClient.get(`/regions/cities/${provinceId}`);
    return normalizeRegions(unwrapData(response, []));
  },

  async getDistricts(cityId) {
    if (!cityId) return [];

    const response = await httpClient.get(`/regions/districts/${cityId}`);
    return normalizeRegions(unwrapData(response, []));
  },

  async getVillages(districtId) {
    if (!districtId) return [];

    const response = await httpClient.get(`/regions/villages/${districtId}`);
    return normalizeRegions(unwrapData(response, []));
  },
};
