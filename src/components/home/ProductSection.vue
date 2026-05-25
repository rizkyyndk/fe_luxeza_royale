<template>
  <div>
    <div
      v-if="isLoading"
      class="py-16 text-center text-sm uppercase tracking-[3px] text-luxe-brown/60"
    >
      Loading products...
    </div>

    <div v-else-if="errorMessage" class="py-16 text-center text-red-500">
      {{ errorMessage }}
    </div>

    <div
      v-else-if="products.length === 0"
      class="py-16 text-center text-luxe-brown/75"
    >
      Product belum tersedia.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :id="product.id"
        :title="product.title"
        :category="product.category"
        :price="product.price"
        :image="product.image"
        :images="product.images"
        :description="product.description"
        :sizes="product.sizes"
        :stock="product.stock"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

import ProductCard from "../product/ProductCard.vue";
import { productService } from "../../services/productService";

const products = ref([]);
const isLoading = ref(false);
const errorMessage = ref("");

const loadProducts = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    products.value = await productService.getProducts();
  } catch (error) {
    console.error("Failed to load products:", error);

    errorMessage.value =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to load products.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadProducts();
});
</script>
