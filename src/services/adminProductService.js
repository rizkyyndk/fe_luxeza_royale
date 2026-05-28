import { httpClient } from "./httpClient";

const unwrapData = (response, fallback = null) => {
  return response?.data ?? response ?? fallback;
};

const normalizeImageUrl = (url) => {
  if (!url || typeof url !== "string") return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const cleanPath = url.replace(/^\/+/, "").replace(/^app\//, "");
  const baseUrl = import.meta.env.BASE_URL || "/";

  return `${baseUrl.replace(/\/$/, "")}/${cleanPath}`;
};

const normalizeProduct = (product) => {
  if (!product) return null;

  const images = Array.isArray(product.images)
    ? product.images.map((image) => ({
        id: image.id,
        imageUrl: normalizeImageUrl(image.image_url),
        rawImageUrl: image.image_url,
        isPrimary: Boolean(image.is_primary),
      }))
    : [];

  const primaryImage =
    product.primary_image?.image_url ||
    images.find((image) => image.isPrimary)?.rawImageUrl ||
    images[0]?.rawImageUrl ||
    "";

  return {
    id: product.id,
    categoryId: product.category_id || null,
    categoryName: product.category?.name || "Uncategorized",
    name: product.name,
    slug: product.slug,
    description: product.description || "",
    price: Number(product.price || 0),
    stock: Number(product.stock || 0),
    isActive: Boolean(product.is_active),
    image: normalizeImageUrl(primaryImage),
    images,
    sizes: Array.isArray(product.sizes)
      ? product.sizes.map((size) => ({
          id: size.id,
          size: size.size,
          stock: Number(size.stock || 0),
          sortOrder: Number(size.sort_order || 0),
          isActive: Boolean(size.is_active),
        }))
      : [],
    attributes: Array.isArray(product.attributes)
      ? product.attributes.map((attribute) => ({
          id: attribute.id,
          label: attribute.label,
          value: attribute.value,
          sortOrder: Number(attribute.sort_order || 0),
          isActive: Boolean(attribute.is_active),
        }))
      : [],
    createdAt: product.created_at,
    updatedAt: product.updated_at,
    raw: product,
  };
};

const normalizeProducts = (products) => {
  if (!Array.isArray(products)) return [];

  return products.map(normalizeProduct).filter(Boolean);
};

const normalizeCategory = (category) => {
  if (!category) return null;

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    isActive: Boolean(category.is_active),
    raw: category,
  };
};

const getApiBaseUrl = () => {
  return (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");
};

const getAuthToken = () => {
  return sessionStorage.getItem("authToken");
};

export const adminProductService = {
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = query ? `/admin/products?${query}` : "/admin/products";

    const response = await httpClient.get(endpoint);
    const data = unwrapData(response, []);

    return normalizeProducts(data);
  },

  async getCategories() {
    const response = await httpClient.get("/admin/categories");
    const data = unwrapData(response, []);

    return Array.isArray(data)
      ? data.map(normalizeCategory).filter(Boolean)
      : [];
  },

  async uploadProductImage(file) {
    const formData = new FormData();
    formData.append("image", file);

    const token = getAuthToken();

    const response = await fetch(
      `${getApiBaseUrl()}/admin/products/images/upload`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      },
    );

    const result = await response.json().catch(() => null);

    if (!response.ok || result?.success === false) {
      const error = new Error(
        result?.message || "Failed to upload product image.",
      );

      error.status = response.status;
      error.errors = result?.errors || null;
      error.data = result;

      throw error;
    }

    return result?.data || result;
  },

  async createProduct(payload) {
    const response = await httpClient.post("/admin/products", payload);
    const data = unwrapData(response, null);

    return normalizeProduct(data);
  },

  async updateProduct(productId, payload) {
    const response = await httpClient.put(
      `/admin/products/${productId}`,
      payload,
    );
    const data = unwrapData(response, null);

    return normalizeProduct(data);
  },

  async updateProductStatus(productId, isActive) {
    const response = await httpClient.patch(
      `/admin/products/${productId}/status`,
      {
        is_active: isActive,
      },
    );

    const data = unwrapData(response, null);

    return normalizeProduct(data);
  },
};
