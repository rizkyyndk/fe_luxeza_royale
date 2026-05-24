<template>
  <div>
    <Navbar />
    <CartSidebar />

    <SizeGuideModal
      v-if="isSizeGuideOpen && product"
      :category="product.category"
      :sizes="availableSizes"
      @close="isSizeGuideOpen = false"
    />

    <section v-if="product" class="pt-28 pb-24 px-6">
      <div class="max-w-7xl mx-auto">
        <!-- BREADCRUMB -->
        <div class="mb-10 flex items-center gap-2 text-sm text-gray-500">
          <RouterLink to="/" class="hover:text-black transition">
            Home
          </RouterLink>

          <span>/</span>

          <button @click="goToProducts" class="hover:text-black transition">
            Collection
          </button>

          <span>/</span>

          <span class="text-black">
            {{ product.title }}
          </span>
        </div>

        <!-- PRODUCT DETAIL -->
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <!-- IMAGE GALLERY -->
          <div class="space-y-5">
            <!-- MAIN IMAGE -->
            <div class="relative overflow-hidden rounded-[2rem] bg-[#f8f5f2]">
              <ProductImage
                :src="selectedImage"
                :alt="product.title"
                class="w-full h-[480px] md:h-[700px] object-cover hover:scale-105 transition duration-700"
              />

              <!-- IMAGE COUNTER -->
              <div
                class="absolute top-5 left-5 bg-white/85 backdrop-blur-xl px-4 py-2 rounded-full text-sm font-medium"
              >
                {{ selectedImageIndex + 1 }} / {{ galleryImages.length }}
              </div>

              <!-- GALLERY CONTROLS -->
              <div
                v-if="galleryImages.length > 1"
                class="absolute bottom-5 right-5 flex items-center gap-3"
              >
                <button
                  @click="previousImage"
                  class="w-11 h-11 rounded-full bg-white/85 backdrop-blur-xl flex items-center justify-center hover:bg-black hover:text-white transition"
                >
                  ←
                </button>

                <button
                  @click="nextImage"
                  class="w-11 h-11 rounded-full bg-white/85 backdrop-blur-xl flex items-center justify-center hover:bg-black hover:text-white transition"
                >
                  →
                </button>
              </div>
            </div>

            <!-- THUMBNAILS -->
            <div class="grid grid-cols-3 gap-4">
              <button
                v-for="(image, index) in galleryImages"
                :key="`${image}-${index}`"
                @click="selectImage(index)"
                :class="
                  selectedImageIndex === index
                    ? 'border-black opacity-100'
                    : 'border-transparent opacity-70 hover:opacity-100'
                "
                class="overflow-hidden rounded-2xl bg-[#f8f5f2] border-2 transition"
              >
                <ProductImage
                  :src="image"
                  :alt="`${product.title} preview ${index + 1}`"
                  class="w-full h-28 md:h-32 object-cover"
                />
              </button>
            </div>
          </div>

          <!-- CONTENT -->
          <div class="flex flex-col justify-center">
            <!-- CATEGORY -->
            <p class="uppercase tracking-[4px] text-sm text-gray-500 mb-4">
              {{ product.category }}
            </p>

            <!-- TITLE -->
            <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {{ product.title }}
            </h1>

            <!-- PRICE -->
            <div class="mb-8 flex flex-wrap items-center gap-4">
              <p class="text-3xl font-bold">
                {{ formatCurrency(product.price) }}
              </p>

              <span
                :class="stockStatusClass"
                class="px-4 py-2 rounded-full text-sm font-semibold"
              >
                {{ stockStatus }}
              </span>

              <span class="text-sm text-gray-500">
                {{ product.stock }} item available
              </span>
            </div>

            <!-- DESCRIPTION -->
            <p class="text-gray-600 leading-8 mb-10 max-w-xl">
              {{ product.description }}
            </p>

            <!-- PRODUCT INFO -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <div class="bg-[#f8f5f2] rounded-3xl p-5">
                <p class="text-sm text-gray-500 mb-2">Material</p>
                <p class="font-semibold">Premium Fabric</p>
              </div>

              <div class="bg-[#f8f5f2] rounded-3xl p-5">
                <p class="text-sm text-gray-500 mb-2">Fit</p>
                <p class="font-semibold">Modern Luxury</p>
              </div>

              <div class="bg-[#f8f5f2] rounded-3xl p-5">
                <p class="text-sm text-gray-500 mb-2">Style</p>
                <p class="font-semibold">Minimalist</p>
              </div>
            </div>

            <!-- SIZE -->
            <div class="mb-8">
              <div class="flex items-center justify-between mb-4">
                <p class="font-semibold">Select Size</p>

                <button
                  @click="isSizeGuideOpen = true"
                  type="button"
                  class="text-sm text-gray-400 hover:text-black underline underline-offset-4 transition"
                >
                  Size guide
                </button>
              </div>

              <div class="flex flex-wrap gap-4">
                <button
                  v-for="size in availableSizes"
                  :key="size"
                  @click="selectSize(size)"
                  :class="
                    selectedSize === size
                      ? 'bg-black text-white scale-105 shadow-lg'
                      : 'border border-black hover:bg-gray-100'
                  "
                  class="px-6 py-3 rounded-full transition"
                >
                  {{ size }}
                </button>
              </div>

              <p v-if="errorMessage" class="text-red-500 text-sm mt-4">
                {{ errorMessage }}
              </p>
            </div>

            <!-- QUANTITY -->
            <div class="mb-10">
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

            <!-- BUTTONS -->
            <div class="flex flex-col sm:flex-row gap-4">
              <button
                @click="addToCart"
                :disabled="isOutOfStock"
                :class="
                  isOutOfStock
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-black text-white hover:scale-[1.02]'
                "
                class="flex-1 py-5 rounded-full text-lg transition"
              >
                {{ isOutOfStock ? "Out of Stock" : "Add To Cart" }}
              </button>

              <button
                @click="toggleWishlist"
                :class="
                  wishlistStore.isInWishlist(product.id)
                    ? 'bg-black text-white'
                    : 'border border-black hover:bg-black hover:text-white'
                "
                class="flex-1 text-center py-5 rounded-full text-lg transition"
              >
                {{
                  wishlistStore.isInWishlist(product.id)
                    ? "Saved to Wishlist"
                    : "Add to Wishlist"
                }}
              </button>
            </div>

            <!-- EXTRA INFO -->
            <div class="mt-10 space-y-4 text-sm text-gray-500">
              <div class="flex items-center gap-3">
                <span class="w-2 h-2 bg-black rounded-full"></span>
                <p>Premium quality selected for modern luxury lifestyle.</p>
              </div>

              <div class="flex items-center gap-3">
                <span class="w-2 h-2 bg-black rounded-full"></span>
                <p>Ready for future backend stock and order integration.</p>
              </div>

              <div class="flex items-center gap-3">
                <span class="w-2 h-2 bg-black rounded-full"></span>
                <p>Cart quantity and price are calculated in real time.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- RELATED PRODUCTS -->
        <section v-if="relatedProducts.length > 0" class="pt-32">
          <div
            class="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
          >
            <div>
              <p class="uppercase tracking-[4px] text-sm text-gray-500 mb-3">
                You May Also Like
              </p>

              <h2 class="text-4xl md:text-5xl font-bold">Related Products</h2>
            </div>

            <RouterLink
              to="/"
              class="text-sm text-gray-500 hover:text-black transition"
            >
              View all collection →
            </RouterLink>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ProductCard
              v-for="item in relatedProducts"
              :key="item.id"
              :id="item.id"
              :title="item.title"
              :category="item.category"
              :price="item.price"
              :image="item.image"
              :images="item.images"
              :description="item.description"
              :sizes="item.sizes"
              :stock="item.stock"
            />
          </div>
        </section>
      </div>
    </section>

    <!-- PRODUCT NOT FOUND -->
    <section
      v-else
      class="min-h-screen pt-40 pb-24 px-6 flex items-center justify-center"
    >
      <div class="text-center max-w-xl">
        <p class="text-6xl mb-6">🛍️</p>

        <p class="uppercase tracking-[4px] text-sm text-gray-500 mb-4">
          Product Not Found
        </p>

        <h1 class="text-4xl md:text-5xl font-bold mb-5">
          This product is unavailable
        </h1>

        <p class="text-gray-500 mb-8 leading-7">
          The product you are looking for does not exist or may have been
          removed from the collection.
        </p>

        <RouterLink
          to="/"
          class="bg-black text-white px-8 py-4 rounded-full inline-block hover:scale-105 transition"
        >
          Back to Home
        </RouterLink>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import Navbar from "../components/layout/Navbar.vue";
import CartSidebar from "../components/layout/CartSidebar.vue";
import ProductCard from "../components/product/ProductCard.vue";

import { products } from "../data/products";
import { useCartStore } from "../stores/cartStore";
import { useUiStore } from "../stores/uiStore";
import { useWishlistStore } from "../stores/wishlistStore";
import { useToastStore } from "../stores/toastStore";
import { formatCurrency } from "../utils/formatCurrency";
import ProductImage from "../components/ui/ProductImage.vue";
import SizeGuideModal from "../components/ui/SizeGuideModal.vue";

import Footer from "../components/layout/Footer.vue";

const route = useRoute();
const router = useRouter();

const cartStore = useCartStore();
const uiStore = useUiStore();
const wishlistStore = useWishlistStore();
const toastStore = useToastStore();

const availableSizes = computed(() => {
  return product.value?.sizes || ["S", "M", "L", "XL"];
});

const stockStatus = computed(() => {
  if (!product.value) return "Unavailable";
  if (product.value.stock <= 0) return "Out of Stock";
  if (product.value.stock <= 3) return "Low Stock";
  return "In Stock";
});

const stockStatusClass = computed(() => {
  if (!product.value || product.value.stock <= 0) {
    return "bg-red-50 text-red-600";
  }

  if (product.value.stock <= 3) {
    return "bg-orange-50 text-orange-600";
  }

  return "bg-black text-white";
});

const isOutOfStock = computed(() => {
  return !product.value || product.value.stock <= 0;
});

const selectedSize = ref("");
const quantity = ref(1);
const errorMessage = ref("");
const selectedImageIndex = ref(0);
const isSizeGuideOpen = ref(false);

const product = computed(() => {
  return products.find((item) => item.id === Number(route.params.id));
});

const galleryImages = computed(() => {
  if (!product.value) return [];

  if (Array.isArray(product.value.images) && product.value.images.length > 0) {
    return product.value.images;
  }

  return [product.value.image];
});

const selectedImage = computed(() => {
  return galleryImages.value[selectedImageIndex.value] || product.value?.image;
});

const relatedProducts = computed(() => {
  if (!product.value) return [];

  return products
    .filter(
      (item) =>
        item.category === product.value.category &&
        item.id !== product.value.id,
    )
    .slice(0, 4);
});

const selectSize = (size) => {
  selectedSize.value = size;
  errorMessage.value = "";
};

const increaseQuantity = () => {
  if (!product.value) return;

  if (quantity.value >= product.value.stock) {
    toastStore.showToast({
      title: "Stock Limit Reached",
      message: `Only ${product.value.stock} item available.`,
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

const selectImage = (index) => {
  selectedImageIndex.value = index;
};

const nextImage = () => {
  if (galleryImages.value.length <= 1) return;

  selectedImageIndex.value =
    selectedImageIndex.value === galleryImages.value.length - 1
      ? 0
      : selectedImageIndex.value + 1;
};

const previousImage = () => {
  if (galleryImages.value.length <= 1) return;

  selectedImageIndex.value =
    selectedImageIndex.value === 0
      ? galleryImages.value.length - 1
      : selectedImageIndex.value - 1;
};

const addToCart = () => {
  if (!selectedSize.value) {
    errorMessage.value = "Please select a size before adding to cart.";

    toastStore.showToast({
      title: "Size Required",
      message: "Please select a size before adding this item.",
      type: "error",
    });

    return;
  }

  if (!product.value) return;

  if (product.value.stock <= 0) {
    toastStore.showToast({
      title: "Out of Stock",
      message: "This product is currently unavailable.",
      type: "error",
    });

    return;
  }

  if (quantity.value > product.value.stock) {
    toastStore.showToast({
      title: "Stock Limit Reached",
      message: `Only ${product.value.stock} item available.`,
      type: "info",
    });

    quantity.value = product.value.stock;
    return;
  }

  cartStore.addToCart(
    {
      ...product.value,
      size: selectedSize.value,
    },
    quantity.value,
  );

  uiStore.openCart();

  toastStore.showToast({
    title: "Added to Cart",
    message: `${product.value.title} • Size ${selectedSize.value}`,
    type: "success",
  });
};

const toggleWishlist = () => {
  if (!product.value) return;

  const wasSaved = wishlistStore.isInWishlist(product.value.id);

  wishlistStore.toggleWishlist({
    id: product.value.id,
    title: product.value.title,
    category: product.value.category,
    price: product.value.price,
    image: product.value.image,
    images: product.value.images,
    description: product.value.description,
    sizes: product.value.sizes,
    stock: product.value.stock,
  });

  toastStore.showToast({
    title: wasSaved ? "Removed from Wishlist" : "Saved to Wishlist",
    message: product.value.title,
    type: wasSaved ? "info" : "success",
  });
};

const goToProducts = async () => {
  await router.push("/");

  setTimeout(() => {
    const el = document.getElementById("products");

    if (!el) return;

    const top = el.getBoundingClientRect().top + window.pageYOffset - 90;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  }, 150);
};

watch(
  () => route.params.id,
  () => {
    selectedSize.value = "";
    quantity.value = 1;
    errorMessage.value = "";
    selectedImageIndex.value = 0;
    isSizeGuideOpen.value = false;

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  },
);
</script>
