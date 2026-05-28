<template>
  <div
    class="fixed inset-0 z-[999] bg-luxe-espresso/60 backdrop-blur-sm px-6 flex items-center justify-center"
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
        <p class="uppercase tracking-[4px] text-sm text-luxe-brown mb-4">
          {{ product.category }}
        </p>

        <h2 class="text-4xl font-bold mb-5 leading-tight text-luxe-espresso">
          {{ product.title }}
        </h2>

        <p class="text-3xl font-bold mb-6 text-luxe-espresso">
          {{ formatCurrency(product.price) }}
        </p>

        <p class="text-luxe-brown/80 leading-8 mb-8">
          {{
            product.description ||
            "Premium luxury fashion piece from Luxeza Royale collection."
          }}
        </p>

        <!-- SIZE -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <p class="font-semibold text-luxe-espresso">Select Size</p>

            <p class="text-sm text-luxe-brown/65">
              {{ selectedStockLabel }}
            </p>
          </div>

          <div class="flex flex-wrap gap-3">
            <button
              v-for="sizeOption in availableSizes"
              :key="sizeOption.size"
              type="button"
              :disabled="sizeOption.stock <= 0"
              @click="selectSize(sizeOption)"
              :class="
                sizeOption.stock <= 0
                  ? 'border border-luxe-sand/60 text-luxe-brown/35 bg-luxe-cream/60 cursor-not-allowed line-through'
                  : selectedSize === sizeOption.size
                    ? 'bg-luxe-espresso text-luxe-ivory scale-105 shadow-lg shadow-luxe-brown/20'
                    : 'border border-luxe-sand text-luxe-espresso hover:bg-luxe-cream'
              "
              class="px-5 py-3 rounded-full transition"
            >
              {{ sizeOption.size }}
            </button>
          </div>

          <p v-if="errorMessage" class="text-red-500 text-sm mt-4">
            {{ errorMessage }}
          </p>
        </div>

        <!-- QUANTITY -->
        <div class="mb-8">
          <p class="font-semibold mb-4 text-luxe-espresso">Quantity</p>

          <div
            class="inline-flex items-center gap-6 border border-luxe-sand bg-luxe-ivory rounded-full px-6 py-3 shadow-sm"
          >
            <button
              @click="decreaseQuantity"
              class="text-2xl leading-none text-luxe-espresso hover:text-luxe-royal hover:scale-110 transition"
            >
              -
            </button>

            <span class="min-w-6 text-center font-semibold text-luxe-espresso">
              {{ quantity }}
            </span>

            <button
              @click="increaseQuantity"
              class="text-2xl leading-none text-luxe-espresso hover:text-luxe-royal hover:scale-110 transition"
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
                ? 'bg-luxe-sand/60 text-luxe-brown/60 cursor-not-allowed'
                : 'bg-luxe-espresso text-luxe-ivory hover:bg-luxe-royal hover:scale-[1.02] shadow-lg shadow-luxe-brown/20'
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
            class="w-full text-center py-5 rounded-full text-lg bg-luxe-cream border border-luxe-sand/60 text-luxe-espresso hover:bg-luxe-espresso hover:text-luxe-ivory transition"
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
  const rawSizes =
    props.product.sizeOptions && props.product.sizeOptions.length > 0
      ? props.product.sizeOptions
      : props.product.sizes || [];

  return rawSizes.map((size) => {
    if (typeof size === "string") {
      return {
        size,
        stock: Number(props.product.stock || 0),
        isActive: true,
      };
    }

    return {
      size: size.size,
      stock: Number(size.stock || 0),
      isActive: size.isActive ?? size.is_active ?? true,
    };
  });
});

const totalAvailableStock = computed(() => {
  if (availableSizes.value.length === 0) {
    return Number(props.product.stock || 0);
  }

  return availableSizes.value
    .filter((size) => size.isActive)
    .reduce((total, size) => total + Number(size.stock || 0), 0);
});

const selectedSizeData = computed(() => {
  return (
    availableSizes.value.find((size) => size.size === selectedSize.value) ||
    null
  );
});

const selectedStock = computed(() => {
  if (selectedSizeData.value) {
    return Number(selectedSizeData.value.stock || 0);
  }

  return totalAvailableStock.value;
});

const selectedStockLabel = computed(() => {
  if (availableSizes.value.length > 0 && !selectedSize.value) {
    return `${totalAvailableStock.value} item available`;
  }

  if (selectedStock.value <= 0) {
    return "Out of stock";
  }

  return `${selectedStock.value} item available`;
});

const isSelectedSizeOutOfStock = computed(() => {
  return Boolean(selectedSize.value) && selectedStock.value <= 0;
});

const mainImage = computed(() => {
  if (Array.isArray(props.product.images) && props.product.images.length > 0) {
    return props.product.images[0];
  }

  return props.product.image;
});

const isOutOfStock = computed(() => {
  return totalAvailableStock.value <= 0;
});

const isLowStock = computed(() => {
  return totalAvailableStock.value > 0 && totalAvailableStock.value <= 3;
});

const stockStatus = computed(() => {
  if (isOutOfStock.value) return "Out of Stock";
  if (isLowStock.value) return "Low Stock";
  return "In Stock";
});

const stockStatusClass = computed(() => {
  if (isOutOfStock.value) {
    return "bg-red-50/95 text-red-700 border border-red-100";
  }

  if (isLowStock.value) {
    return "bg-amber-50/95 text-amber-700 border border-amber-100";
  }

  return "bg-luxe-ivory/95 text-luxe-espresso border border-luxe-sand/60";
});

const closeModal = () => {
  emit("close");
};

const selectSize = (sizeOption) => {
  if (sizeOption.stock <= 0) {
    toastStore.showToast({
      title: "Size Out of Stock",
      message: `Size ${sizeOption.size} is currently out of stock.`,
      type: "info",
    });

    return;
  }

  selectedSize.value = sizeOption.size;
  quantity.value = 1;
  errorMessage.value = "";
};

const increaseQuantity = () => {
  if (quantity.value >= selectedStock.value) {
    toastStore.showToast({
      title: "Stock Limit Reached",
      message: `Only ${selectedStock.value} item available for this size.`,
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

  if (isSelectedSizeOutOfStock.value) {
    errorMessage.value = "Selected size is out of stock.";

    toastStore.showToast({
      title: "Out of Stock",
      message: "Please select another size.",
      type: "error",
    });

    return;
  }

  if (isSelectedSizeOutOfStock.value) {
    errorMessage.value = "Selected size is out of stock.";

    toastStore.showToast({
      title: "Out of Stock",
      message: "Please select another size.",
      type: "error",
    });

    return;
  }

  cartStore.addToCart(
    {
      ...props.product,
      size: selectedSize.value || "One Size",
      stock: selectedStock.value,
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
    sizeOptions: props.product.sizeOptions,
    stock: props.product.stock,
  });

  toastStore.showToast({
    title: wasSaved ? "Removed from Wishlist" : "Saved to Wishlist",
    message: props.product.title,
    type: wasSaved ? "info" : "success",
  });
};

console.log("Quick view product:", props.product);
console.log("Size options:", props.product.sizeOptions);

watch(
  () => props.product.id,
  () => {
    selectedSize.value = "";
    quantity.value = 1;
    errorMessage.value = "";
  },
);
</script>
