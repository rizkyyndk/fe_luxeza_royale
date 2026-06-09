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

  const toBoolean = (value) => {
    return value === true || value === 1 || value === "1";
  };

  const images = Array.isArray(product.images)
    ? product.images.map((image) => ({
        id: image.id,
        imageUrl: normalizeImageUrl(image.image_url),
        rawImageUrl: image.image_url,
        isPrimary: toBoolean(image.is_primary),
      }))
    : [];

  const sizes = Array.isArray(product.sizes)
    ? product.sizes.map((size) => ({
        id: size.id,
        size: size.size,
        price: Number(size.price ?? product.price ?? 0),
        stock: Number(size.stock ?? 0),
        sortOrder: Number(size.sort_order ?? 0),
        isActive: toBoolean(size.is_active),
      }))
    : [];

  const activeSizes = sizes.filter((size) => size.isActive);

  const totalSizeStock = activeSizes.reduce((total, size) => {
    return total + Number(size.stock ?? 0);
  }, 0);

  const hasSizes = sizes.length > 0;

  const displayStock = hasSizes ? totalSizeStock : Number(product.stock ?? 0);

  const primaryImage =
    product.primary_image?.image_url ||
    images.find((image) => image.isPrimary)?.rawImageUrl ||
    images[0]?.rawImageUrl ||
    "";

  return {
    id: product.id,
    categoryId: product.category_id || null,
    categoryName: product.category?.name || "Tanpa Kategori",
    categoryIsActive: product.category_id
      ? toBoolean(product.category?.is_active)
      : true,
    isVisibleToCustomer:
      toBoolean(product.is_active) &&
      (!product.category_id || toBoolean(product.category?.is_active)),
    customerHiddenReason: !toBoolean(product.is_active)
      ? "Produk Tidak Aktif"
      : product.category_id && !toBoolean(product.category?.is_active)
        ? "Kategori Tidak Aktif"
        : "",
    name: product.name,
    slug: product.slug,
    description: product.description || "",
    price: Number(product.price || 0),

    // penting: stock yang tampil di admin
    stock: displayStock,

    // tambahan supaya aman untuk kebutuhan debug / form edit
    rawStock: Number(product.stock ?? 0),
    totalSizeStock,
    hasSizes,

    weightGram: Number(product.weight_gram || 1000),
    isActive: toBoolean(product.is_active),
    image: normalizeImageUrl(primaryImage),
    images,
    sizes,
    attributes: Array.isArray(product.attributes)
      ? product.attributes.map((attribute) => ({
          id: attribute.id,
          label: attribute.label,
          value: attribute.value,
          sortOrder: Number(attribute.sort_order || 0),
          isActive: toBoolean(attribute.is_active),
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
    productsCount: Number(category.products_count || 0),
    createdAt: category.created_at,
    updatedAt: category.updated_at,
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

  async createCategory(payload) {
    const response = await httpClient.post("/admin/categories", payload);
    const data = unwrapData(response, null);

    return normalizeCategory(data);
  },

  async updateCategory(categoryId, payload) {
    const response = await httpClient.put(
      `/admin/categories/${categoryId}`,
      payload,
    );

    const data = unwrapData(response, null);

    return normalizeCategory(data);
  },

  async updateCategoryStatus(categoryId, isActive) {
    const response = await httpClient.patch(
      `/admin/categories/${categoryId}/status`,
      {
        is_active: isActive,
      },
    );

    const data = unwrapData(response, null);

    return normalizeCategory(data);
  },

  async deleteCategory(categoryId) {
    return httpClient.delete(`/admin/categories/${categoryId}`);
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
        result?.message || "Gambar produk belum dapat diunggah.",
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
