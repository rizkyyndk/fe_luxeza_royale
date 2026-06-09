import { httpClient } from "./httpClient";

const CACHE_PREFIX = "luxezaRegionCache";
const CACHE_TTL = 1000 * 60 * 60 * 24 * 7; // 7 hari

const memoryCache = new Map();
const inFlightRequests = new Map();

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

const getCacheKey = (key) => {
  return `${CACHE_PREFIX}:${key}`;
};

const getCachedRegions = (key) => {
  if (memoryCache.has(key)) {
    return memoryCache.get(key);
  }

  try {
    const raw = localStorage.getItem(getCacheKey(key));

    if (!raw) return null;

    const cached = JSON.parse(raw);

    if (!cached?.expiresAt || Date.now() > cached.expiresAt) {
      localStorage.removeItem(getCacheKey(key));
      return null;
    }

    memoryCache.set(key, cached.data);

    return cached.data;
  } catch (error) {
    return null;
  }
};

const setCachedRegions = (key, data) => {
  memoryCache.set(key, data);

  try {
    localStorage.setItem(
      getCacheKey(key),
      JSON.stringify({
        data,
        expiresAt: Date.now() + CACHE_TTL,
      }),
    );
  } catch (error) {
    // Abaikan jika localStorage penuh atau tidak tersedia.
  }
};

const fetchRegions = async (key, requestCallback) => {
  const cached = getCachedRegions(key);

  if (cached) {
    return cached;
  }

  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key);
  }

  const request = requestCallback()
    .then((response) => {
      const normalized = normalizeRegions(unwrapData(response, []));
      setCachedRegions(key, normalized);

      return normalized;
    })
    .finally(() => {
      inFlightRequests.delete(key);
    });

  inFlightRequests.set(key, request);

  return request;
};

export const regionService = {
  async getProvinces() {
    return fetchRegions("provinces", () =>
      httpClient.get("/regions/provinces"),
    );
  },

  async getCities(provinceId) {
    if (!provinceId) return [];

    return fetchRegions(`cities:${provinceId}`, () =>
      httpClient.get(`/regions/cities/${provinceId}`),
    );
  },

  async getDistricts(cityId) {
    if (!cityId) return [];

    return fetchRegions(`districts:${cityId}`, () =>
      httpClient.get(`/regions/districts/${cityId}`),
    );
  },

  async getVillages(districtId) {
    if (!districtId) return [];

    return fetchRegions(`villages:${districtId}`, () =>
      httpClient.get(`/regions/villages/${districtId}`),
    );
  },

  clearCache() {
    memoryCache.clear();

    try {
      Object.keys(localStorage)
        .filter((key) => key.startsWith(CACHE_PREFIX))
        .forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      // Abaikan.
    }
  },
};
