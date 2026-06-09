<template>
  <div>
    <Navbar />
    <CartSidebar />

    <SizeGuideModal
      v-if="isSizeGuideOpen && product"
      :category="product.category"
      :sizes="sizeGuideSizes"
      @close="isSizeGuideOpen = false"
    />

    <section v-if="isLoading" class="pt-28 pb-24 px-6">
      <div class="max-w-7xl mx-auto text-center py-24">
        <p class="uppercase tracking-[4px] text-sm text-luxe-brown mb-4">
          Memuat Produk
        </p>

        <h1 class="text-4xl md:text-5xl font-bold mb-5">Mohon Tunggu...</h1>

        <p class="text-luxe-brown/75 leading-7">
          Detail produk sedang dimuat dari database.
        </p>
      </div>
    </section>

    <section v-else-if="product" class="pt-28 pb-24 px-6">
      <div class="max-w-7xl mx-auto">
        <!-- BREADCRUMB -->
        <div class="mb-10 flex items-center gap-2 text-sm text-luxe-brown/70">
          <RouterLink to="/" class="hover:text-luxe-espresso transition">
            Beranda
          </RouterLink>

          <span>/</span>

          <button
            @click="goToProducts"
            class="hover:text-luxe-espresso transition"
          >
            Koleksi
          </button>

          <span>/</span>

          <span class="text-luxe-espresso">
            {{ product.title }}
          </span>
        </div>

        <!-- PRODUCT DETAIL -->
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <!-- IMAGE GALLERY -->
          <div class="space-y-5">
            <!-- MAIN IMAGE -->
            <div class="relative overflow-hidden rounded-[2rem] bg-luxe-cream">
              <ProductImage
                :src="selectedImage"
                :alt="product.title"
                class="w-full h-[480px] md:h-[700px] object-cover hover:scale-105 transition duration-700"
              />

              <!-- IMAGE COUNTER -->
              <div
                class="absolute top-5 left-5 bg-luxe-ivory/85 backdrop-blur-xl px-4 py-2 rounded-full text-sm font-medium"
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
                  class="w-11 h-11 rounded-full bg-luxe-ivory/85 text-luxe-espresso backdrop-blur-xl flex items-center justify-center hover:bg-luxe-espresso hover:text-luxe-ivory transition"
                >
                  ←
                </button>

                <button
                  @click="nextImage"
                  class="w-11 h-11 rounded-full bg-luxe-ivory/85 text-luxe-espresso backdrop-blur-xl flex items-center justify-center hover:bg-luxe-espresso hover:text-luxe-ivory transition"
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
                    ? 'border-luxe-espresso opacity-100'
                    : 'border-transparent opacity-70 hover:opacity-100'
                "
                class="overflow-hidden rounded-2xl bg-luxe-cream border-2 transition"
              >
                <ProductImage
                  :src="image"
                  :alt="`${product.title} pratinjau ${index + 1}`"
                  class="w-full h-28 md:h-32 object-cover"
                />
              </button>
            </div>
          </div>

          <!-- CONTENT -->
          <div class="flex flex-col justify-center">
            <!-- CATEGORY -->
            <p class="uppercase tracking-[4px] text-sm text-luxe-brown mb-4">
              {{ product.category }}
            </p>

            <!-- TITLE -->
            <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {{ product.title }}
            </h1>

            <!-- PRICE -->
            <div class="mb-8 flex flex-wrap items-center gap-4">
              <p class="text-3xl font-bold">
                {{ formatCurrency(selectedPrice) }}
              </p>

              <span
                :class="stockStatusClass"
                class="px-4 py-2 rounded-full text-sm font-semibold"
              >
                {{ stockStatus }}
              </span>

              <span class="text-sm text-luxe-brown/70">
                {{ selectedStockLabel }}
              </span>
            </div>

            <!-- DESCRIPTION -->
            <p class="text-gray-600 leading-8 mb-10 max-w-xl">
              {{ product.description }}
            </p>

            <!-- PRODUCT INFO -->
            <div
              v-if="productAttributes.length > 0"
              class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
            >
              <div
                v-for="attribute in productAttributes"
                :key="attribute.id || attribute.label"
                class="bg-luxe-ivory border border-luxe-sand/70 shadow-[0_16px_45px_rgba(92,56,36,0.12)] rounded-3xl p-5"
              >
                <p class="text-sm text-luxe-brown/70 mb-2">
                  {{ attribute.label }}
                </p>

                <p class="font-semibold text-luxe-espresso">
                  {{ attribute.value }}
                </p>
              </div>
            </div>

            <!-- SIZE -->
            <div class="mb-8">
              <div class="flex items-center justify-between mb-4">
                <p class="font-semibold text-luxe-espresso">Pilih Ukuran</p>

                <button
                  @click="isSizeGuideOpen = true"
                  type="button"
                  class="text-sm text-luxe-brown/60 hover:text-luxe-espresso underline underline-offset-4 transition"
                >
                  Panduan ukuran
                </button>
              </div>

              <div class="flex flex-wrap gap-4">
                <button
                  v-for="sizeOption in availableSizes"
                  :key="sizeOption.size"
                  type="button"
                  :disabled="!sizeOption.isActive || sizeOption.stock <= 0"
                  @click="selectSize(sizeOption)"
                  :class="
                    !sizeOption.isActive || sizeOption.stock <= 0
                      ? 'border border-luxe-sand/60 text-luxe-brown/35 bg-luxe-cream/60 cursor-not-allowed line-through'
                      : selectedSize === sizeOption.size
                        ? 'bg-luxe-espresso text-luxe-ivory scale-105 shadow-lg shadow-luxe-brown/20'
                        : 'border border-luxe-sand text-luxe-espresso hover:bg-luxe-cream'
                  "
                  class="px-5 py-3 rounded-full transition"
                >
                  <span class="flex flex-col leading-tight">
                    <span>{{ sizeOption.size }}</span>
                    <span class="text-xs opacity-80">
                      {{ formatCurrency(sizeOption.price) }}
                    </span>
                  </span>
                </button>
              </div>

              <p v-if="errorMessage" class="text-red-500 text-sm mt-4">
                {{ errorMessage }}
              </p>
            </div>

            <!-- QUANTITY -->
            <div class="mb-10">
              <p class="font-semibold mb-4">Jumlah</p>

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
                    ? 'bg-luxe-sand/60 text-luxe-brown/60 cursor-not-allowed'
                    : 'bg-luxe-espresso text-luxe-ivory hover:bg-luxe-royal hover:scale-[1.02] shadow-lg shadow-luxe-brown/20'
                "
                class="flex-1 py-5 rounded-full text-lg transition"
              >
                {{ isOutOfStock ? "Stok Habis" : "Tambah ke Keranjang" }}
              </button>

              <button
                @click="toggleWishlist"
                :class="
                  wishlistStore.isInWishlist(product.id)
                    ? 'bg-luxe-espresso text-luxe-ivory'
                    : 'border border-luxe-espresso text-luxe-espresso hover:bg-luxe-espresso hover:text-luxe-ivory'
                "
                class="flex-1 text-center py-5 rounded-full text-lg transition"
              >
                {{
                  wishlistStore.isInWishlist(product.id)
                    ? "Tersimpan di Wishlist"
                    : "Simpan ke Wishlist"
                }}
              </button>
            </div>

            <!-- EXTRA INFO -->
            <div class="mt-10 space-y-4 text-sm text-luxe-brown/75">
              <div class="flex items-center gap-3">
                <span class="w-2 h-2 bg-luxe-gold rounded-full"></span>
                <p>
                  Kualitas premium pilihan untuk gaya hidup modern yang elegan.
                </p>
              </div>

              <div class="flex items-center gap-3">
                <span class="w-2 h-2 bg-luxe-gold rounded-full"></span>
                <p>
                  Detail stok dan pesanan diproses secara rapi melalui sistem.
                </p>
              </div>

              <div class="flex items-center gap-3">
                <span class="w-2 h-2 bg-luxe-gold rounded-full"></span>
                <p>Jumlah dan harga keranjang diperbarui secara real time.</p>
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
              <p class="uppercase tracking-[4px] text-sm text-luxe-brown mb-3">
                Anda Mungkin Suka
              </p>

              <h2 class="text-4xl md:text-5xl font-bold">Produk Terkait</h2>
            </div>

            <RouterLink
              to="/"
              class="text-sm text-luxe-brown/70 hover:text-luxe-espresso transition"
            >
              Lihat semua koleksi →
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
              :size-options="item.sizeOptions"
              :stock="item.stock"
            />
          </div>
        </section>
      </div>
    </section>

    <section
      v-else
      class="min-h-screen pt-40 pb-24 px-6 flex items-center justify-center"
    >
      <div class="text-center max-w-xl">
        <p class="text-6xl mb-6">🛍️</p>

        <p class="uppercase tracking-[4px] text-sm text-luxe-brown mb-4">
          Produk Tidak Ditemukan
        </p>

        <h1 class="text-4xl md:text-5xl font-bold mb-5">
          Produk Ini Tidak Tersedia
        </h1>

        <p class="text-luxe-brown/75 mb-8 leading-7">
          Produk yang Anda cari tidak tersedia atau sudah tidak lagi masuk dalam
          koleksi Luxeza Royale.
        </p>

        <RouterLink
          to="/"
          class="bg-luxe-espresso text-luxe-ivory px-8 py-4 rounded-full inline-block hover:bg-luxe-royal hover:scale-105 transition shadow-lg shadow-luxe-brown/20"
        >
          Kembali ke Beranda
        </RouterLink>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import Navbar from "../components/layout/Navbar.vue";
import CartSidebar from "../components/layout/CartSidebar.vue";
import ProductCard from "../components/product/ProductCard.vue";
import ProductImage from "../components/ui/ProductImage.vue";
import SizeGuideModal from "../components/ui/SizeGuideModal.vue";
import Footer from "../components/layout/Footer.vue";

import { productService } from "../services/productService";
import { useCartStore } from "../stores/cartStore";
import { useUiStore } from "../stores/uiStore";
import { useWishlistStore } from "../stores/wishlistStore";
import { useToastStore } from "../stores/toastStore";
import { formatCurrency } from "../utils/formatCurrency";

const route = useRoute();
const router = useRouter();

const cartStore = useCartStore();
const uiStore = useUiStore();
const wishlistStore = useWishlistStore();
const toastStore = useToastStore();

const product = ref(null);
const relatedProducts = ref([]);
const isLoading = ref(false);
const loadError = ref("");

const selectedSize = ref("");
const quantity = ref(1);
const errorMessage = ref("");
const selectedImageIndex = ref(0);
const isSizeGuideOpen = ref(false);

const resetProductState = () => {
  selectedSize.value = "";
  quantity.value = 1;
  errorMessage.value = "";
  selectedImageIndex.value = 0;
  isSizeGuideOpen.value = false;
};

const loadProduct = async () => {
  const productIdOrSlug = route.params.id;

  if (!productIdOrSlug) return;

  isLoading.value = true;
  loadError.value = "";
  product.value = null;
  relatedProducts.value = [];
  resetProductState();

  try {
    const loadedProduct = await productService.getProductById(productIdOrSlug);
    product.value = loadedProduct;

    if (loadedProduct) {
      relatedProducts.value = await productService.getRelatedProducts(
        loadedProduct.category,
        loadedProduct.slug || loadedProduct.id,
      );
    }
  } catch (error) {
    console.error("Gagal memuat detail produk:", error);

    loadError.value =
      error?.response?.data?.message ||
      error?.message ||
      "Detail produk belum dapat dimuat.";
  } finally {
    isLoading.value = false;
  }
};

/*
|--------------------------------------------------------------------------
| Size Stock Logic
|--------------------------------------------------------------------------
*/

const availableSizes = computed(() => {
  const rawSizes =
    product.value?.sizeOptions && product.value.sizeOptions.length > 0
      ? product.value.sizeOptions
      : product.value?.sizes || [];

  return rawSizes.map((size) => {
    if (typeof size === "string") {
      return {
        id: null,
        size,
        price: Number(product.value?.price || 0),
        stock: Number(product.value?.stock || 0),
        isActive: true,
      };
    }

    return {
      id: size.id || null,
      size: size.size,
      price: Number(size.price ?? product.value?.price ?? 0),
      stock: Number(size.stock || 0),
      isActive: size.isActive ?? size.is_active ?? true,
    };
  });
});

const activeSizes = computed(() => {
  return availableSizes.value.filter((size) => size.isActive);
});

const sizeGuideSizes = computed(() => {
  return activeSizes.value.map((size) => size.size);
});

const totalAvailableStock = computed(() => {
  if (availableSizes.value.length === 0) {
    return Number(product.value?.stock || 0);
  }

  return activeSizes.value.reduce(
    (total, size) => total + Number(size.stock || 0),
    0,
  );
});

const selectedSizeData = computed(() => {
  return (
    availableSizes.value.find((size) => size.size === selectedSize.value) ||
    null
  );
});

const selectedPrice = computed(() => {
  if (selectedSizeData.value?.price !== undefined) {
    return Number(selectedSizeData.value.price || 0);
  }

  return Number(product.value?.price || 0);
});

const selectedStock = computed(() => {
  if (selectedSizeData.value) {
    return Number(selectedSizeData.value.stock || 0);
  }

  return totalAvailableStock.value;
});

const selectedStockLabel = computed(() => {
  if (availableSizes.value.length > 0 && !selectedSize.value) {
    return `${totalAvailableStock.value} stok tersedia`;
  }

  if (selectedStock.value <= 0) {
    return "Stok habis";
  }

  return `${selectedStock.value} stok tersedia`;
});

const isSelectedSizeOutOfStock = computed(() => {
  return Boolean(selectedSize.value) && selectedStock.value <= 0;
});

const isOutOfStock = computed(() => {
  return totalAvailableStock.value <= 0;
});

const isLowStock = computed(() => {
  return totalAvailableStock.value > 0 && totalAvailableStock.value <= 3;
});

const stockStatus = computed(() => {
  if (!product.value) return "Tidak Tersedia";

  if (isOutOfStock.value) return "Stok Habis";
  if (isLowStock.value) return "Stok Terbatas";

  return "Tersedia";
});

const stockStatusClass = computed(() => {
  if (!product.value || isOutOfStock.value) {
    return "bg-red-50 text-red-600";
  }

  if (isLowStock.value) {
    return "bg-orange-50 text-orange-600";
  }

  return "bg-luxe-espresso text-luxe-ivory";
});

/*
|--------------------------------------------------------------------------
| Gallery
|--------------------------------------------------------------------------
*/

const galleryImages = computed(() => {
  if (!product.value) return [];

  if (Array.isArray(product.value.images) && product.value.images.length > 0) {
    return product.value.images;
  }

  return product.value.image ? [product.value.image] : [];
});

const selectedImage = computed(() => {
  return (
    galleryImages.value[selectedImageIndex.value] || product.value?.image || ""
  );
});

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

/*
|--------------------------------------------------------------------------
| Product Attributes
|--------------------------------------------------------------------------
*/

const productAttributes = computed(() => {
  return Array.isArray(product.value?.attributes)
    ? product.value.attributes
    : [];
});

/*
|--------------------------------------------------------------------------
| Size and Quantity
|--------------------------------------------------------------------------
*/

const selectSize = (sizeOption) => {
  if (!sizeOption.isActive || sizeOption.stock <= 0) {
    toastStore.showToast({
      title: "Ukuran Tidak Tersedia",
      message: `Ukuran ${sizeOption.size} sedang habis.`,
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
      title: "Batas Stok Tercapai",
      message: `Hanya ${selectedStock.value} item tersedia untuk ukuran ini.`,
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

/*
|--------------------------------------------------------------------------
| Cart and Wishlist
|--------------------------------------------------------------------------
*/

const addToCart = () => {
  if (!product.value) return;

  if (isOutOfStock.value) {
    toastStore.showToast({
      title: "Stok Habis",
      message: "Produk ini sedang tidak tersedia.",
      type: "error",
    });

    return;
  }

  if (availableSizes.value.length > 0 && !selectedSize.value) {
    errorMessage.value =
      "Pilih ukuran terlebih dahulu sebelum menambahkan produk ke keranjang.";

    toastStore.showToast({
      title: "Pilih Ukuran",
      message: "Silakan pilih ukuran sebelum menambahkan produk ini.",
      type: "error",
    });

    return;
  }

  if (isSelectedSizeOutOfStock.value) {
    errorMessage.value = "Ukuran yang dipilih sedang habis.";

    toastStore.showToast({
      title: "Stok Habis",
      message: "Silakan pilih ukuran lain.",
      type: "error",
    });

    return;
  }

  if (quantity.value > selectedStock.value) {
    quantity.value = selectedStock.value;

    toastStore.showToast({
      title: "Batas Stok Tercapai",
      message: `Hanya ${selectedStock.value} item tersedia untuk ukuran ini.`,
      type: "info",
    });

    return;
  }

  const displaySize = selectedSize.value || "Ukuran Standar";

  cartStore.addToCart(
    {
      ...product.value,
      price: selectedPrice.value,
      size: displaySize,
      stock: selectedStock.value,
      selectedSizePrice: selectedPrice.value,
    },
    quantity.value,
  );

  uiStore.openCart();

  toastStore.showToast({
    title: "Ditambahkan ke Keranjang",
    message: `${product.value.title} • Ukuran ${displaySize}`,
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
    sizeOptions: product.value.sizeOptions,
    stock: product.value.stock,
  });

  toastStore.showToast({
    title: wasSaved ? "Dihapus dari Wishlist" : "Tersimpan di Wishlist",
    message: product.value.title,
    type: wasSaved ? "info" : "success",
  });
};

/*
|--------------------------------------------------------------------------
| Navigation
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Lifecycle
|--------------------------------------------------------------------------
*/

onMounted(() => {
  loadProduct();
});

watch(
  () => route.params.id,
  (newId) => {
    if (!newId) return;

    loadProduct();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  },
);
</script>
