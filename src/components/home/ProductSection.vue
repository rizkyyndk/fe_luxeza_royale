<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
</template>

<script setup>
import ProductCard from "../product/ProductCard.vue";
import { products } from "../../data/products";
</script>
