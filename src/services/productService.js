import { httpClient } from "./httpClient";

const unwrapData = (response, fallback = null) => {
  const payload = response?.data ?? response ?? fallback;

  if (payload?.data !== undefined) {
    return payload.data;
  }

  return payload ?? fallback;
};

const parseArrayValue = (value, fallback = []) => {
  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (error) {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return fallback;
};

const getApiOrigin = () => {
  const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

  if (baseURL.startsWith("http")) {
    return new URL(baseURL).origin;
  }

  return window.location.origin;
};

const normalizeImageUrl = (url) => {
  if (!url || typeof url !== "string") return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const apiOrigin = getApiOrigin();

  if (url.startsWith("/")) {
    return `${apiOrigin}${url}`;
  }

  return `${apiOrigin}/${url}`;
};

const getPrimaryImageValue = (product) => {
  const primaryImage = product.primary_image;

  if (!primaryImage) return "";

  if (typeof primaryImage === "string") {
    return primaryImage;
  }

  return (
    primaryImage.image_url ||
    primaryImage.url ||
    primaryImage.path ||
    primaryImage.file_path ||
    primaryImage.image ||
    ""
  );
};

const normalizeImages = (product, fallbackImage = "") => {
  const rawImages = parseArrayValue(
    product.images ||
      product.product_images ||
      product.gallery ||
      product.image_list,
    [],
  );

  const images = rawImages
    .map((item) => {
      if (typeof item === "string") {
        return normalizeImageUrl(item);
      }

      return normalizeImageUrl(
        item.image_url || item.url || item.path || item.file_path || item.image,
      );
    })
    .filter(Boolean);

  if (images.length > 0) return images;

  return fallbackImage ? [fallbackImage] : [];
};

const normalizeSizes = (product) => {
  const rawSizes = parseArrayValue(product.sizes || product.size_options, []);

  const sizeOptions = rawSizes
    .map((item) => {
      if (typeof item === "string") {
        return {
          id: item,
          size: item,
          stock: null,
          isActive: true,
        };
      }

      return {
        id: item.id,
        size: item.size || item.name || item.label,
        stock:
          item.stock === null || item.stock === undefined
            ? null
            : Number(item.stock),
        isActive: item.is_active ?? true,
      };
    })
    .filter((item) => item.size && item.isActive);

  return {
    sizeOptions,
    sizes: sizeOptions.map((item) => item.size),
  };
};

const normalizeAttributes = (product) => {
  const rawAttributes = parseArrayValue(product.attributes, []);

  return rawAttributes
    .map((item) => ({
      id: item.id,
      label: item.label || item.name || "",
      value: item.value || item.description || "",
      sortOrder: Number(item.sort_order || 0),
      isActive: item.is_active ?? true,
    }))
    .filter((item) => item.label && item.value && item.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);
};

const normalizeCategory = (product) => {
  if (product.category_name) return product.category_name;

  if (product.category && typeof product.category === "object") {
    return product.category.name || "Collection";
  }

  if (typeof product.category === "string") {
    return product.category;
  }

  return "Collection";
};

const normalizeProduct = (product) => {
  if (!product) return null;

  const primaryImageValue = getPrimaryImageValue(product);

  const image =
    normalizeImageUrl(
      product.primary_image_url ||
        primaryImageValue ||
        product.image_url ||
        product.image ||
        product.thumbnail ||
        product.photo,
    ) || "";

  const images = normalizeImages(product, image);
  const { sizes, sizeOptions } = normalizeSizes(product);
  const attributes = normalizeAttributes(product);

  return {
    ...product,

    id: Number(product.id),
    slug: product.slug || String(product.id),

    title: product.title || product.name || "Untitled Product",
    name: product.name || product.title || "Untitled Product",

    category: normalizeCategory(product),
    categoryData:
      product.category && typeof product.category === "object"
        ? product.category
        : null,

    price: Number(product.price || product.selling_price || 0),
    image,
    images,

    description: product.description || product.detail || "",

    sizes,
    sizeOptions,
    attributes,

    stock:
      product.stock === null || product.stock === undefined
        ? null
        : Number(product.stock),

    raw: product,
  };
};

const normalizeProductList = (products) => {
  if (!Array.isArray(products)) return [];

  return products.map(normalizeProduct).filter(Boolean);
};

const getProductsFromApi = async () => {
  const response = await httpClient.get("/products");
  const data = unwrapData(response, []);

  return normalizeProductList(data);
};

export const productService = {
  async getProducts() {
    return getProductsFromApi();
  },

  async getProductById(idOrSlug) {
    const isNumericId = /^\d+$/.test(String(idOrSlug));

    if (isNumericId) {
      const products = await getProductsFromApi();

      return (
        products.find((product) => Number(product.id) === Number(idOrSlug)) ||
        null
      );
    }

    const response = await httpClient.get(`/products/${idOrSlug}`);
    const data = unwrapData(response, null);

    return normalizeProduct(data);
  },

  async getProductBySlug(slug) {
    const response = await httpClient.get(`/products/${slug}`);
    const data = unwrapData(response, null);

    return normalizeProduct(data);
  },

  async getRelatedProducts(category, currentProductIdOrSlug) {
    let slugOrId = currentProductIdOrSlug;

    const isNumericId = /^\d+$/.test(String(currentProductIdOrSlug));

    if (isNumericId) {
      const products = await getProductsFromApi();
      const currentProduct = products.find(
        (product) => Number(product.id) === Number(currentProductIdOrSlug),
      );

      if (!currentProduct) {
        return [];
      }

      slugOrId = currentProduct.slug || currentProduct.id;
    }

    try {
      const response = await httpClient.get(`/products/${slugOrId}/related`);
      const data = unwrapData(response, []);

      return normalizeProductList(data);
    } catch (error) {
      const products = await getProductsFromApi();

      return products
        .filter(
          (product) =>
            product.category === category &&
            String(product.id) !== String(currentProductIdOrSlug) &&
            String(product.slug) !== String(currentProductIdOrSlug),
        )
        .slice(0, 4);
    }
  },
};
