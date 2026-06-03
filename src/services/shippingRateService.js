import { httpClient } from "./httpClient";

const unwrapData = (response, fallback = null) => {
  const payload = response?.data ?? response ?? fallback;

  if (payload?.data !== undefined) {
    return payload.data;
  }

  return payload ?? fallback;
};

const normalizeDestination = (destination) => {
  if (!destination) return null;

  return {
    id: String(destination.id || ""),
    label: destination.label || "",
    provinceName: destination.province_name || "",
    cityName: destination.city_name || "",
    districtName: destination.district_name || "",
    subdistrictName: destination.subdistrict_name || "",
    zipCode: destination.zip_code || "",
    raw: destination,
  };
};

const normalizeRate = (rate) => {
  if (!rate) return null;

  const code = String(rate.code || "").toLowerCase();
  const service = String(rate.service || "");

  return {
    id: rate.id || `${code}:${service}`,
    code,
    name: rate.name || code.toUpperCase(),
    service,
    description: rate.description || "",
    cost: Number(rate.cost || 0),
    etd: rate.etd || "",
    label: `${rate.name || code.toUpperCase()} ${service}`,
    raw: rate,
  };
};

export const shippingRateService = {
  async searchDestinations(keyword, limit = 10) {
    const query = new URLSearchParams({
      search: keyword,
      limit: String(limit),
    }).toString();

    const response = await httpClient.get(`/shipping/destinations?${query}`);
    const data = unwrapData(response, []);

    return Array.isArray(data)
      ? data.map(normalizeDestination).filter(Boolean)
      : [];
  },

  async getRates(destinationId, items = []) {
    const response = await httpClient.post("/shipping/rates", {
      destination_id: destinationId,
      items,
    });

    const data = unwrapData(response, null);

    return {
      destinationId: String(data?.destination_id || destinationId),
      totalWeightGram: Number(data?.total_weight_gram || 0),
      rates: Array.isArray(data?.rates)
        ? data.rates.map(normalizeRate).filter(Boolean)
        : [],
      raw: data,
    };
  },
};
