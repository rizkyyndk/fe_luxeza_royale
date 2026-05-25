<template>
  <div
    class="fixed inset-0 z-[999] bg-luxe-espresso/60 px-6 flex items-center justify-center"
    @click.self="closeModal"
  >
    <div
      class="bg-luxe-ivory rounded-[2rem] w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-[0_30px_90px_rgba(43,26,18,0.28)] border border-luxe-sand/60 grid lg:grid-cols-2"
    >
      <!-- IMAGE -->
      <div class="relative bg-luxe-cream min-h-[420px]">
        <ProductImage
          :src="mainImage"
          :alt="product.title"
          class="w-full h-full min-h-[420px] object-cover"
        />

        <button
          @click="closeModal"
          class="absolute top-5 right-5 w-11 h-11 rounded-full bg-luxe-ivory/90 backdrop-blur-xl flex items-center justify-center text-2xl text-luxe-espresso hover:bg-luxe-espresso hover:text-luxe-ivory transition"
        >
          ×
        </button>

        <div
          :class="stockStatusClass"
          class="absolute top-5 left-5 px-4 py-2 rounded-full text-sm font-semibold"
        >
          {{ stockStatus }}
        </div>
      </div>

      <!-- CONTENT -->
      <div class="p-8 md:p-10 overflow-y-auto max-h-[90vh]">
        <p class="uppercase tracking-[4px] text-sm text-gray-500 mb-4">
          {{ product.category }}
        </p>

        <h2 class="text-4xl font-bold mb-5 leading-tight">
          {{ product.title }}
        </h2>

        <p class="text-3xl font-bold mb-6">
          {{ formatCurrency(product.price) }}
        </p>

        <p class="text-gray-600 leading-8 mb-8">
          {{
            product.description ||
            "Premium luxury fashion piece from Luxeza Royale collection."
          }}
        </p>

        <!-- SIZE -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <p class="font-semibold">Select Size</p>

            <p class="text-sm text-gray-400">
              {{ product.stock }} item available
            </p>
          </div>

          <div class="flex flex-wrap gap-3">
            <button
              v-for="size in availableSizes"
              :key="size"
              @click="selectSize(size)"
              :class="
                selectedSize === size
                  ? 'bg-luxe-espresso text-luxe-ivory scale-105 shadow-lg'
                  : 'border border-luxe-sand text-luxe-espresso hover:bg-luxe-cream'
              "
              class="px-5 py-3 rounded-full transition"
            >
              {{ size }}
            </button>
          </div>

          <p v-if="errorMessage" class="text-red-500 text-sm mt-4">
            {{ errorMessage }}
          </p>
        </div>

        <!-- QUANTITY -->
        <div class="mb-8">
          <p class="font-semibold mb-4">Quantity</p>

          <div
            class="inline-flex items-center gap-6 border border-gray-300 rounded-full px-6 py-3"
          >
            <button
              @click="decreaseQuantity"
              class="text-2xl leading-none hover:scale-110 transition"
            >
              -
            </button>

            <span class="min-w-6 text-center font-semibold">
              {{ quantity }}
            </span>

            <button
              @click="increaseQuantity"
              class="text-2xl leading-none hover:scale-110 transition"
            >
              +
            </button>
          </div>
        </div>

        <!-- ACTIONS -->
        <div class="flex flex-col gap-4">
          <button
            @click="addToCart"
            :disabled="isOutOfStock"
            :class="
              isOutOfStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-luxe-espresso text-luxe-ivory hover:bg-luxe-royal hover:scale-[1.02]'
            "
            class="w-full py-5 rounded-full text-lg transition"
          >
            {{ isOutOfStock ? "Out of Stock" : "Add To Cart" }}
          </button>

          <button
            @click="toggleWishlist"
            :class="
              wishlistStore.isInWishlist(product.id)
                ? 'bg-luxe-espresso text-luxe-ivory'
                : 'border border-luxe-espresso text-luxe-espresso hover:bg-luxe-espresso hover:text-luxe-ivory'
            "
            class="w-full py-5 rounded-full text-lg transition"
          >
            {{
              wishlistStore.isInWishlist(product.id)
                ? "Saved to Wishlist"
                : "Add to Wishlist"
            }}
          </button>

          <RouterLink
            :to="`/product/${product.id}`"
            @click="closeModal"
            class="w-full text-center py-5 rounded-full text-lg bg-luxe-cream text-luxe-espresso hover:bg-luxe-espresso hover:text-luxe-ivory transition"
          >
            View Full Details
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";

import ProductImage from "../ui/ProductImage.vue";

import { useCartStore } from "../../stores/cartStore";
import { useUiStore } from "../../stores/uiStore";
import { useWishlistStore } from "../../stores/wishlistStore";
import { useToastStore } from "../../stores/toastStore";
import { formatCurrency } from "../../utils/formatCurrency";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const cartStore = useCartStore();
const uiStore = useUiStore();
const wishlistStore = useWishlistStore();
const toastStore = useToastStore();

const selectedSize = ref("");
const quantity = ref(1);
const errorMessage = ref("");

const availableSizes = computed(() => {
  return props.product.sizes || [];
});

const mainImage = computed(() => {
  if (Array.isArray(props.product.images) && props.product.images.length > 0) {
    return props.product.images[0];
  }

  return props.product.image;
});

const isOutOfStock = computed(() => {
  return props.product.stock <= 0;
});

const isLowStock = computed(() => {
  return props.product.stock > 0 && props.product.stock <= 3;
});

const stockStatus = computed(() => {
  if (isOutOfStock.value) return "Out of Stock";
  if (isLowStock.value) return "Low Stock";
  return "In Stock";
});

const stockStatusClass = computed(() => {
  if (isOutOfStock.value) return "bg-red-50 text-red-600";
  if (isLowStock.value) return "bg-orange-50 text-orange-600";
  return "bg-black text-white";
});

const closeModal = () => {
  emit("close");
};

const selectSize = (size) => {
  selectedSize.value = size;
  errorMessage.value = "";
};

const increaseQuantity = () => {
  if (quantity.value >= props.product.stock) {
    toastStore.showToast({
      title: "Stock Limit Reached",
      message: `Only ${props.product.stock} item available.`,
      type: "info",
    });

    return;
  }

  quantity.value++;
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const addToCart = () => {
  if (isOutOfStock.value) {
    toastStore.showToast({
      title: "Out of Stock",
      message: "This product is currently unavailable.",
      type: "error",
    });

    return;
  }

  if (availableSizes.value.length > 0 && !selectedSize.value) {
    errorMessage.value = "Please select a size before adding to cart.";

    toastStore.showToast({
      title: "Size Required",
      message: "Please select a size before adding this item.",
      type: "error",
    });

    return;
  }

  cartStore.addToCart(
    {
      ...props.product,
      size: selectedSize.value || "One Size",
    },
    quantity.value,
  );

  uiStore.openCart();

  toastStore.showToast({
    title: "Added to Cart",
    message: `${props.product.title} • Size ${
      selectedSize.value || "One Size"
    }`,
    type: "success",
  });

  closeModal();
};

const toggleWishlist = () => {
  const wasSaved = wishlistStore.isInWishlist(props.product.id);

  wishlistStore.toggleWishlist({
    id: props.product.id,
    title: props.product.title,
    category: props.product.category,
    price: props.product.price,
    image: props.product.image,
    images: props.product.images,
    description: props.product.description,
    sizes: props.product.sizes,
    stock: props.product.stock,
  });

  toastStore.showToast({
    title: wasSaved ? "Removed from Wishlist" : "Saved to Wishlist",
    message: props.product.title,
    type: wasSaved ? "info" : "success",
  });
};

watch(
  () => props.product.id,
  () => {
    selectedSize.value = "";
    quantity.value = 1;
    errorMessage.value = "";
  },
);
</script>
