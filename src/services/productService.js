import { httpClient } from "./httpClient";
import { products } from "../data/products";

const USE_MOCK_DATA = true; //backend Laravel sudah ready = false

export const productService = {
  async getProducts() {
    if (USE_MOCK_DATA) {
      return products;
    }

    return httpClient.get("/products");
  },

  async getProductById(id) {
    if (USE_MOCK_DATA) {
      return products.find((product) => product.id === Number(id)) || null;
    }

    return httpClient.get(`/products/${id}`);
  },

  async getRelatedProducts(category, currentProductId) {
    if (USE_MOCK_DATA) {
      return products
        .filter(
          (product) =>
            product.category === category &&
            product.id !== Number(currentProductId),
        )
        .slice(0, 4);
    }

    return httpClient.get(
      `/products/related?category=${category}&exclude=${currentProductId}`,
    );
  },
};
