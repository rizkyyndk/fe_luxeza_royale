import { httpClient } from "./httpClient";
import { products } from "../data/products";

const USE_MOCK_DATA = false;

const unwrapData = (response, fallback = null) => {
  return response?.data ?? response ?? fallback;
};

const getProductsFromApi = async () => {
  const response = await httpClient.get("/products");
  return unwrapData(response, []);
};

export const productService = {
  async getProducts() {
    if (USE_MOCK_DATA) {
      return products;
    }

    return getProductsFromApi();
  },

  async getProductById(idOrSlug) {
    if (USE_MOCK_DATA) {
      return (
        products.find((product) => product.id === Number(idOrSlug)) || null
      );
    }

    // Backend kita pakai slug untuk detail: /products/{slug}
    // Tapi kalau frontend lama masih kirim id angka, kita cari dulu dari list products.
    const isNumericId = /^\d+$/.test(String(idOrSlug));

    if (isNumericId) {
      const apiProducts = await getProductsFromApi();
      return (
        apiProducts.find(
          (product) => Number(product.id) === Number(idOrSlug),
        ) || null
      );
    }

    const response = await httpClient.get(`/products/${idOrSlug}`);
    return unwrapData(response, null);
  },

  async getProductBySlug(slug) {
    if (USE_MOCK_DATA) {
      return products.find((product) => product.slug === slug) || null;
    }

    const response = await httpClient.get(`/products/${slug}`);
    return unwrapData(response, null);
  },

  async getRelatedProducts(category, currentProductIdOrSlug) {
    if (USE_MOCK_DATA) {
      return products
        .filter(
          (product) =>
            product.category === category &&
            product.id !== Number(currentProductIdOrSlug),
        )
        .slice(0, 4);
    }

    let slug = currentProductIdOrSlug;

    // Kalau frontend lama masih kirim product id,
    // kita cari slug-nya dulu dari API products.
    const isNumericId = /^\d+$/.test(String(currentProductIdOrSlug));

    if (isNumericId) {
      const apiProducts = await getProductsFromApi();
      const currentProduct = apiProducts.find(
        (product) => Number(product.id) === Number(currentProductIdOrSlug),
      );

      if (!currentProduct) {
        return [];
      }

      slug = currentProduct.slug;
    }

    const response = await httpClient.get(`/products/${slug}/related`);
    return unwrapData(response, []);
  },
};
