<template>
  <div class="group cursor-pointer block">
    <div
      class="relative overflow-hidden rounded-3xl bg-luxe-cream mb-5 shadow-[0_18px_50px_rgba(92,56,36,0.12)] border border-luxe-sand/50"
    >
      <RouterLink :to="`/product/${id}`" class="block">
        <ProductImage
          :src="image"
          :alt="title"
          class="w-full h-[420px] object-cover group-hover:scale-110 transition duration-700"
        />
      </RouterLink>

      <!-- STOCK BADGE -->
      <div
        :class="stockBadgeClass"
        class="absolute top-4 left-4 px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-md"
      >
        {{ stockLabel }}
      </div>

      <!-- WISHLIST BUTTON -->
      <button
        @click.stop="toggleWishlist"
        type="button"
        :class="
          wishlistStore.isInWishlist(id)
            ? 'bg-luxe-espresso text-luxe-ivory'
            : 'bg-luxe-ivory text-luxe-espresso'
        "
        class="absolute top-4 right-4 w-11 h-11 rounded-full shadow-lg border border-luxe-sand/50 flex items-center justify-center hover:scale-110 transition"
      >
        <span class="text-lg">
          {{ wishlistStore.isInWishlist(id) ? "♥" : "♡" }}
        </span>
      </button>

      <!-- QUICK VIEW BUTTON -->
      <button
        @click.stop="isQuickViewOpen = true"
        type="button"
        class="absolute left-5 right-5 bottom-5 bg-luxe-ivory/90 backdrop-blur-xl text-luxe-espresso py-4 rounded-full font-medium translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-luxe-espresso hover:text-luxe-ivory transition duration-300"
      >
        Quick View
      </button>
    </div>

    <RouterLink :to="`/product/${id}`" class="block">
      <p class="text-sm uppercase tracking-[3px] text-luxe-brown mb-2">
        {{ category }}
      </p>

      <h3
        class="text-2xl font-semibold mb-2 text-luxe-espresso group-hover:text-luxe-royal transition"
      >
        {{ title }}
      </h3>

      <div class="flex items-center justify-between gap-4">
        <p class="font-bold text-luxe-espresso">
          {{ formatCurrency(price) }}
        </p>

        <p class="text-sm text-luxe-brown/70">
          {{ stockText }}
        </p>
      </div>
    </RouterLink>

    <ProductQuickViewModal
      v-if="isQuickViewOpen"
      :product="productPayload"
      @close="isQuickViewOpen = false"
    />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

import ProductImage from "../ui/ProductImage.vue";
import ProductQuickViewModal from "./ProductQuickViewModal.vue";

import { formatCurrency } from "../../utils/formatCurrency";
import { useWishlistStore } from "../../stores/wishlistStore";
import { useToastStore } from "../../stores/toastStore";

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  images: {
    type: Array,
    default: () => [],
  },
  description: {
    type: String,
    default: "",
  },
  sizes: {
    type: Array,
    default: () => [],
  },
  sizeOptions: {
    type: Array,
    default: () => [],
  },
  stock: {
    type: Number,
    default: null,
  },
});

const wishlistStore = useWishlistStore();
const toastStore = useToastStore();

const isQuickViewOpen = ref(false);

const productPayload = computed(() => {
  return {
    id: props.id,
    title: props.title,
    category: props.category,
    price: props.price,
    image: props.image,
    images: props.images,
    description: props.description,
    sizes: props.sizes,
    sizeOptions: props.sizeOptions,
    stock: props.stock,
  };
});

const isOutOfStock = computed(() => {
  return typeof props.stock === "number" && props.stock <= 0;
});

const isLowStock = computed(() => {
  return typeof props.stock === "number" && props.stock > 0 && props.stock <= 3;
});

const stockLabel = computed(() => {
  if (isOutOfStock.value) return "Out of Stock";
  if (isLowStock.value) return "Low Stock";
  return "In Stock";
});

const stockText = computed(() => {
  if (typeof props.stock !== "number") return "Available";
  if (props.stock <= 0) return "Unavailable";
  return `${props.stock} left`;
});

const stockBadgeClass = computed(() => {
  if (isOutOfStock.value) return "bg-luxe-ivory/90 text-red-600";
  if (isLowStock.value) return "bg-luxe-ivory/90 text-orange-600";
  return "bg-luxe-ivory/90 text-luxe-espresso";
});

const toggleWishlist = () => {
  const wasSaved = wishlistStore.isInWishlist(props.id);

  wishlistStore.toggleWishlist({
    id: props.id,
    title: props.title,
    category: props.category,
    price: props.price,
    image: props.image,
    images: props.images,
    description: props.description,
    sizes: props.sizes,
    sizeOptions: props.sizeOptions,
    stock: props.stock,
  });

  toastStore.showToast({
    title: wasSaved ? "Removed from Wishlist" : "Saved to Wishlist",
    message: props.title,
    type: wasSaved ? "info" : "success",
  });
};
</script>
