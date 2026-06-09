<template>
  <div>
    <!-- NAVBAR -->
    <Navbar />

    <!-- CART -->
    <CartSidebar />

    <!-- HERO -->
    <section
      class="min-h-screen px-5 sm:px-6 pt-28 pb-20 flex items-center overflow-hidden"
    >
      <div class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
        <!-- HERO CONTENT -->
        <div>
          <p class="uppercase tracking-[4px] text-sm text-luxe-brown mb-5">
            {{ content("home.hero.eyebrow", "Fashion Mewah") }}
          </p>

          <h1
            class="max-w-full text-[38px] sm:text-5xl md:text-7xl font-bold leading-[1.15] sm:leading-tight mb-8 break-words overflow-hidden"
          >
            {{
              content(
                "home.hero.title",
                "Kemewahan Modern untuk Elegansi Setiap Hari.",
              )
            }}
          </h1>

          <p class="max-w-xl text-gray-600 leading-8 mb-10 break-words">
            {{
              content(
                "home.hero.subtitle",
                "Temukan koleksi fashion minimalis dengan sentuhan premium, kenyamanan elegan, dan gaya modern yang mudah dikenakan setiap hari.",
              )
            }}
          </p>

          <div class="flex flex-col sm:flex-row gap-4">
            <button
              @click="goToProducts"
              class="bg-luxe-espresso text-luxe-ivory px-10 py-5 rounded-full hover:bg-luxe-royal hover:scale-105 transition shadow-lg shadow-luxe-brown/20"
            >
              {{ content("home.hero.primary_button", "Belanja Koleksi") }}
            </button>

            <button
              @click="goToCategories"
              class="border border-luxe-espresso text-luxe-espresso px-10 py-5 rounded-full hover:bg-luxe-espresso hover:text-luxe-ivory transition"
            >
              {{ content("home.hero.secondary_button", "Lihat Kategori") }}
            </button>
          </div>

          <div class="grid grid-cols-3 gap-6 mt-14 max-w-lg">
            <div>
              <p class="text-3xl font-bold">10+</p>
              <p class="text-sm text-luxe-brown/70 mt-1">Koleksi Pilihan</p>
            </div>

            <div>
              <p class="text-3xl font-bold">5</p>
              <p class="text-sm text-luxe-brown/70 mt-1">Kategori</p>
            </div>

            <div>
              <p class="text-3xl font-bold">100%</p>
              <p class="text-sm text-luxe-brown/70 mt-1">Siap Dipesan</p>
            </div>
          </div>
        </div>

        <!-- HERO IMAGE -->
        <div class="relative">
          <div
            class="absolute -top-6 -left-6 w-40 h-40 bg-luxe-gold rounded-full opacity-20 blur-sm"
          ></div>
          <div
            class="absolute -bottom-6 -right-6 w-52 h-52 border border-luxe-brown/20 rounded-full"
          ></div>

          <div
            v-if="heroProduct"
            class="relative overflow-hidden rounded-[2.5rem] bg-luxe-ivory shadow-[0_30px_90px_rgba(92,56,36,0.18)] border border-luxe-sand/60"
          >
            <ProductImage
              :src="heroProduct.image"
              :alt="heroProduct.title"
              class="w-full h-[460px] sm:h-[560px] md:h-[680px] object-contain object-top bg-luxe-cream"
            />

            <div
              class="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-luxe-ivory/90 backdrop-blur-xl rounded-3xl p-4 sm:p-5 border border-luxe-sand/50"
            >
              <div
                class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div class="min-w-0">
                  <p class="text-sm text-luxe-brown/70 mb-1">Pilihan Utama</p>

                  <h3 class="font-bold text-lg text-luxe-espresso truncate">
                    {{ heroProduct.title }}
                  </h3>

                  <p class="text-xs text-luxe-brown/60 mt-1">
                    {{ heroProduct.category }}
                  </p>
                </div>

                <div
                  class="flex items-center justify-between sm:justify-end gap-2"
                >
                  <button
                    v-if="heroProducts.length > 1"
                    @click="previousHeroProduct"
                    type="button"
                    class="w-10 h-10 shrink-0 rounded-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso hover:bg-luxe-espresso hover:text-luxe-ivory transition"
                  >
                    ←
                  </button>

                  <button
                    v-if="heroProducts.length > 1"
                    @click="nextHeroProduct"
                    type="button"
                    class="w-10 h-10 shrink-0 rounded-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso hover:bg-luxe-espresso hover:text-luxe-ivory transition"
                  >
                    →
                  </button>

                  <RouterLink
                    :to="`/product/${heroProduct.id}`"
                    class="shrink-0 bg-luxe-espresso text-luxe-ivory px-5 py-3 rounded-full text-sm hover:bg-luxe-royal hover:scale-105 transition"
                  >
                    Lihat
                  </RouterLink>
                </div>
              </div>

              <div
                v-if="heroProducts.length > 1"
                class="mt-4 flex items-center justify-center gap-2"
              >
                <button
                  v-for="(item, index) in heroProducts"
                  :key="item.id"
                  @click="selectHeroProduct(index)"
                  type="button"
                  :class="
                    heroProductIndex === index
                      ? 'w-6 bg-luxe-espresso'
                      : 'w-2 bg-luxe-brown/30 hover:bg-luxe-brown/50'
                  "
                  class="h-2 rounded-full transition-all"
                ></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PROMO STRIP -->
    <section class="bg-luxe-espresso text-luxe-ivory px-6 py-5">
      <div class="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 text-center">
        <p class="text-sm tracking-[3px] uppercase">Koleksi Premium</p>

        <p class="text-sm tracking-[3px] uppercase">Desain Mewah Minimalis</p>

        <p class="text-sm tracking-[3px] uppercase">Nyaman untuk Setiap Hari</p>
      </div>
    </section>

    <!-- CATEGORY SPOTLIGHT -->
    <section id="categories" class="py-24 px-6 bg-luxe-ivory/70">
      <div class="max-w-7xl mx-auto">
        <div
          class="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <p class="uppercase tracking-[4px] text-sm text-luxe-brown/75 mb-3">
              Belanja Berdasarkan Kategori
            </p>

            <h2 class="text-4xl md:text-5xl font-bold">
              Esensial Mewah Pilihan
            </h2>
          </div>

          <p class="text-luxe-brown/75 max-w-md leading-7">
            Pilih koleksi fashion esensial dengan desain rapi, nyaman, dan mudah
            dipadukan untuk berbagai kesempatan.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          <button
            v-for="category in categoryCards"
            :key="category.name"
            @click="selectCategoryFromCard(category.name)"
            class="group relative overflow-hidden rounded-[2rem] h-[360px] sm:h-[340px] lg:h-[320px] text-left bg-luxe-cream"
          >
            <ProductImage
              :src="category.image"
              :alt="category.name"
              class="absolute inset-0 w-full h-full object-contain object-top bg-luxe-cream group-hover:scale-105 transition duration-700"
            />

            <div
              class="absolute inset-0 bg-luxe-espresso/35 group-hover:bg-luxe-espresso/50 transition"
            ></div>

            <div
              class="relative h-full p-6 flex flex-col justify-end text-white"
            >
              <p class="text-sm uppercase tracking-[3px] mb-2">Kategori</p>

              <h3 class="text-2xl font-bold">
                {{ category.name }}
              </h3>
            </div>
          </button>
        </div>
      </div>
    </section>

    <!-- PRODUCTS -->
    <section id="products" class="pt-28 pb-24 px-6 bg-luxe-ivory/80">
      <div class="max-w-7xl mx-auto">
        <!-- SECTION HEADER -->
        <div
          class="mb-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8"
        >
          <div>
            <p class="uppercase tracking-[4px] text-sm text-luxe-brown/75 mb-3">
              {{ content("home.products.eyebrow", "Koleksi Mewah") }}
            </p>

            <h2 class="text-4xl md:text-5xl font-bold mb-6">
              {{ content("home.products.title", "Produk Pilihan") }}
            </h2>

            <p class="text-luxe-brown/75 max-w-xl leading-7">
              {{
                content(
                  "home.products.subtitle",
                  "Temukan pilihan fashion premium yang dirancang untuk gaya hidup modern, elegan, dan mudah dipadukan.",
                )
              }}
            </p>
          </div>

          <p class="text-sm text-luxe-brown/75">
            Menampilkan
            <span class="font-semibold text-luxe-espresso">
              {{ sortedProducts.length }}
            </span>
            hasil dari
            <span class="font-semibold text-luxe-espresso">
              {{ products.length }}
            </span>
            produk
          </p>
        </div>

        <!-- FILTER BAR -->
        <div class="mb-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6">
          <!-- SEARCH -->
          <div class="relative">
            <label class="block text-sm text-luxe-brown/75 mb-2">
              Temukan koleksi pilihan Anda
            </label>

            <input
              v-model="search"
              @focus="isSearchFocused = true"
              @blur="handleSearchBlur"
              @keyup.enter="handleSearchEnter"
              type="text"
              placeholder="Cari berdasarkan produk, kategori, atau deskripsi..."
              class="border border-luxe-sand bg-luxe-ivory px-6 py-4 rounded-full outline-none w-full lg:max-w-[520px] focus:border-luxe-royal transition text-luxe-espresso placeholder:text-luxe-brown/50 shadow-sm"
            />

            <!-- SEARCH PANEL -->
            <div
              v-if="showSearchPanel"
              class="absolute left-0 right-0 lg:max-w-[520px] mt-3 bg-luxe-ivory border border-luxe-sand/60 rounded-3xl shadow-[0_18px_60px_rgba(92,56,36,0.14)] p-4 z-40"
            >
              <!-- PRODUCT SUGGESTIONS -->
              <div v-if="searchSuggestions.length > 0">
                <p
                  class="text-xs uppercase tracking-[3px] text-luxe-brown/60 mb-3"
                >
                  Rekomendasi
                </p>

                <div class="space-y-2">
                  <button
                    v-for="product in searchSuggestions"
                    :key="product.id"
                    @mousedown.prevent="applyProductSuggestion(product)"
                    type="button"
                    class="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-luxe-cream transition text-left"
                  >
                    <ProductImage
                      :src="product.image"
                      :alt="product.title"
                      class="w-14 h-14 object-cover rounded-xl"
                    />

                    <div class="flex-1">
                      <p class="font-semibold">
                        {{ product.title }}
                      </p>

                      <p class="text-sm text-luxe-brown/75">
                        {{ product.category }} ·
                        {{ formatCurrency(product.price) }}
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              <!-- RECENT SEARCH -->
              <div
                v-if="recentSearches.length > 0"
                :class="
                  searchSuggestions.length > 0
                    ? 'mt-5 pt-5 border-t border-gray-100'
                    : ''
                "
              >
                <div class="flex items-center justify-between mb-3">
                  <p
                    class="text-xs uppercase tracking-[3px] text-luxe-brown/60"
                  >
                    Pencarian Terakhir
                  </p>

                  <button
                    @mousedown.prevent="clearRecentSearches"
                    type="button"
                    class="text-xs text-luxe-brown/60 hover:text-luxe-espresso transition"
                  >
                    Hapus
                  </button>
                </div>

                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="keyword in recentSearches"
                    :key="keyword"
                    @mousedown.prevent="applySearchKeyword(keyword)"
                    type="button"
                    class="px-4 py-2 rounded-full bg-luxe-cream text-sm text-luxe-brown hover:bg-luxe-espresso hover:text-luxe-ivory transition"
                  >
                    {{ keyword }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- SORT -->
          <div class="relative">
            <label class="block text-sm text-luxe-brown/75 mb-2">
              Urutkan Produk
            </label>

            <button
              @click="isSortOpen = !isSortOpen"
              type="button"
              class="w-full lg:w-[280px] border border-luxe-sand px-6 py-4 rounded-full bg-luxe-ivory text-luxe-espresso flex items-center justify-between gap-4 hover:border-luxe-royal transition shadow-sm"
            >
              <span class="font-medium">
                {{ sortLabels[sortOption] }}
              </span>

              <span
                :class="isSortOpen ? 'rotate-180' : ''"
                class="transition-transform duration-300 text-luxe-brown/75"
              >
                ↓
              </span>
            </button>

            <div
              v-if="isSortOpen"
              class="absolute right-0 mt-3 w-full lg:w-[280px] bg-luxe-ivory border border-luxe-sand/60 rounded-3xl shadow-[0_18px_60px_rgba(92,56,36,0.14)] p-3 z-30"
            >
              <button
                v-for="option in sortOptions"
                :key="option.value"
                @click="setSortOption(option.value)"
                type="button"
                :class="
                  sortOption === option.value
                    ? 'bg-luxe-espresso text-luxe-ivory'
                    : 'text-luxe-brown hover:bg-luxe-cream'
                "
                class="w-full text-left px-5 py-3 rounded-2xl transition"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- FILTER SUMMARY -->
        <div
          class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <p class="text-sm text-luxe-brown/75">
            {{ activeFilterCount }} filter aktif
          </p>

          <button
            @click="resetFilters"
            :disabled="activeFilterCount === 0"
            :class="
              activeFilterCount > 0
                ? 'border-luxe-espresso text-luxe-espresso hover:bg-luxe-espresso hover:text-luxe-ivory'
                : 'border-gray-200 text-gray-300 cursor-not-allowed'
            "
            class="text-sm border px-5 py-2 rounded-full transition w-fit"
          >
            Hapus Semua Filter
          </button>
        </div>

        <!-- CATEGORIES -->
        <div class="mb-10">
          <p class="text-sm text-luxe-brown/75 mb-3">Kategori</p>

          <div class="flex flex-wrap gap-4">
            <button
              v-for="cat in categories"
              :key="cat"
              @click="activeCategory = cat"
              :class="
                activeCategory === cat
                  ? 'bg-luxe-espresso text-luxe-ivory scale-105 shadow-lg shadow-luxe-brown/20'
                  : 'border border-luxe-sand text-luxe-espresso hover:bg-luxe-cream'
              "
              class="px-6 py-2 rounded-full transition"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <!-- ADVANCED FILTERS -->
        <div class="grid md:grid-cols-2 gap-8 mb-12">
          <!-- PRICE FILTER -->
          <div>
            <p class="text-sm text-luxe-brown/75 mb-3">Rentang Harga</p>

            <div class="flex flex-wrap gap-3">
              <button
                v-for="option in priceOptions"
                :key="option.value"
                @click="priceFilter = option.value"
                :class="
                  priceFilter === option.value
                    ? 'bg-luxe-espresso text-luxe-ivory'
                    : 'bg-luxe-cream text-luxe-brown hover:bg-luxe-espresso hover:text-luxe-ivory'
                "
                class="px-5 py-3 rounded-full text-sm transition"
              >
                {{ option.label }}
              </button>
            </div>
          </div>

          <!-- STOCK FILTER -->
          <div>
            <p class="text-sm text-luxe-brown/75 mb-3">Ketersediaan</p>

            <div class="flex flex-wrap gap-3">
              <button
                v-for="option in stockOptions"
                :key="option.value"
                @click="stockFilter = option.value"
                :class="
                  stockFilter === option.value
                    ? 'bg-luxe-espresso text-luxe-ivory'
                    : 'bg-luxe-cream text-luxe-brown hover:bg-luxe-espresso hover:text-luxe-ivory'
                "
                class="px-5 py-3 rounded-full text-sm transition"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- PRODUCT RESULT AREA -->
        <div>
          <!-- PRODUCT LOADING -->
          <div
            v-if="isLoadingProducts"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <ProductCardSkeleton v-for="item in 8" :key="item" />
          </div>

          <!-- PRODUCT ERROR -->
          <div
            v-else-if="productErrorMessage"
            class="text-center py-24 bg-red-50 rounded-3xl"
          >
            <p class="text-5xl mb-5">⚠️</p>

            <h3 class="text-2xl font-bold mb-3">Produk belum dapat dimuat</h3>

            <p class="text-red-500 mb-8">
              {{ productErrorMessage }}
            </p>

            <button
              @click="loadProducts"
              class="bg-luxe-espresso text-luxe-ivory px-8 py-4 rounded-full inline-block hover:bg-luxe-royal hover:scale-105 transition"
            >
              Coba Lagi
            </button>
          </div>

          <!-- PRODUCT GRID -->
          <div
            v-else-if="sortedProducts.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <ProductCard
              v-for="product in sortedProducts"
              :key="product.id"
              :id="product.id"
              :title="product.title"
              :category="product.category"
              :price="product.price"
              :image="product.image"
              :images="product.images"
              :description="product.description"
              :sizes="product.sizes"
              :size-options="product.sizeOptions"
              :stock="product.stock"
            />
          </div>

          <!-- EMPTY STATE -->
          <div
            v-else
            class="text-center py-24 bg-luxe-cream rounded-3xl border border-luxe-sand/60 shadow-[0_18px_60px_rgba(92,56,36,0.10)]"
          >
            <p class="text-5xl mb-5">🔎</p>

            <h3 class="text-2xl font-bold mb-3">Produk tidak ditemukan</h3>

            <p class="text-luxe-brown/75 mb-8">
              Coba gunakan kata kunci lain atau pilih kategori yang berbeda.
            </p>

            <button
              @click="resetFilters"
              class="bg-luxe-espresso text-luxe-ivory px-8 py-4 rounded-full hover:bg-luxe-royal hover:scale-105 transition"
            >
              Atur Ulang Filter
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- EDITORIAL BANNER -->
    <section class="px-6 pb-24 bg-luxe-ivory/80">
      <div
        class="max-w-7xl mx-auto bg-luxe-cream rounded-[2.5rem] overflow-hidden grid lg:grid-cols-2 border border-luxe-sand/60 shadow-[0_24px_80px_rgba(92,56,36,0.14)]"
      >
        <div class="p-10 md:p-16 flex flex-col justify-center">
          <p class="uppercase tracking-[4px] text-sm text-luxe-brown/75 mb-4">
            {{ content("home.editorial.eyebrow", "Koleksi Editorial") }}
          </p>

          <h2 class="text-4xl md:text-5xl font-bold leading-tight mb-6">
            {{
              content(
                "home.editorial.title",
                "Sentuhan elegan untuk gaya harian yang effortless.",
              )
            }}
          </h2>

          <p class="text-gray-600 leading-8 mb-8">
            {{
              content(
                "home.editorial.subtitle",
                "Temukan koleksi Luxeza Royale dengan siluet bersih, kenyamanan premium, dan detail modern yang tak lekang oleh waktu.",
              )
            }}
          </p>

          <button
            @click="goToProducts"
            class="bg-luxe-espresso text-luxe-ivory px-8 py-4 rounded-full w-fit hover:bg-luxe-royal hover:scale-105 transition shadow-lg shadow-luxe-brown/20"
          >
            Jelajahi Produk
          </button>
        </div>

        <div
          v-if="editorialProduct"
          class="relative min-h-[420px] lg:min-h-full bg-luxe-cream overflow-hidden"
        >
          <RouterLink
            :to="`/product/${editorialProduct.id}`"
            class="block h-full"
          >
            <ProductImage
              :src="editorialProduct.image"
              :alt="editorialProduct.title"
              class="w-full h-[420px] sm:h-[520px] lg:h-full object-contain object-center bg-luxe-cream transition duration-700"
            />
          </RouterLink>

          <div
            v-if="editorialProducts.length > 1"
            class="absolute bottom-5 left-0 right-0 flex items-center justify-center gap-2"
          >
            <button
              v-for="(item, index) in editorialProducts"
              :key="item.id"
              @click="selectEditorialSlide(index)"
              type="button"
              :class="
                editorialSlideIndex === index
                  ? 'w-6 bg-luxe-espresso'
                  : 'w-2 bg-luxe-brown/30 hover:bg-luxe-brown/50'
              "
              class="h-2 rounded-full transition-all"
            ></button>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

import Navbar from "../components/layout/Navbar.vue";
import CartSidebar from "../components/layout/CartSidebar.vue";
import Footer from "../components/layout/Footer.vue";
import ProductCard from "../components/product/ProductCard.vue";
import ProductCardSkeleton from "../components/ui/ProductCardSkeleton.vue";
import ProductImage from "../components/ui/ProductImage.vue";
import { formatCurrency } from "../utils/formatCurrency";

import { productService } from "../services/productService";
import { useSiteContentStore } from "../stores/siteContentStore";

const siteContentStore = useSiteContentStore();

const content = (key, fallback = "") => {
  return siteContentStore.getContent(key, fallback);
};

const products = ref([]);
const search = ref("");
const activeCategory = ref("Semua");
const sortOption = ref("featured");
const priceFilter = ref("all");
const stockFilter = ref("all");
const isSortOpen = ref(false);
const isLoadingProducts = ref(true);
const productErrorMessage = ref("");

const isSearchFocused = ref(false);
const RECENT_SEARCH_KEY = "recentSearches";
const MAX_RECENT_SEARCH = 5;

const loadRecentSearches = () => {
  try {
    const savedSearches = sessionStorage.getItem(RECENT_SEARCH_KEY);
    return savedSearches ? JSON.parse(savedSearches) : [];
  } catch (error) {
    console.error("Gagal memuat pencarian terakhir:", error);
    return [];
  }
};

const recentSearches = ref(loadRecentSearches());

const sortOptions = [
  {
    label: "Pilihan Utama",
    value: "featured",
  },
  {
    label: "Harga: Terendah ke Tertinggi",
    value: "price-low",
  },
  {
    label: "Harga: Tertinggi ke Terendah",
    value: "price-high",
  },
  {
    label: "Nama: A ke Z",
    value: "name-az",
  },
];

const priceOptions = [
  {
    label: "Semua Harga",
    value: "all",
  },
  {
    label: "Di bawah Rp 500.000",
    value: "under-500",
  },
  {
    label: "Rp 500.000 - Rp 1.000.000",
    value: "500-1000",
  },
  {
    label: "Rp 1.000.000 - Rp 1.500.000",
    value: "1000-1500",
  },
  {
    label: "Di atas Rp 1.500.000",
    value: "above-1500",
  },
];

const stockOptions = [
  {
    label: "Semua Stok",
    value: "all",
  },
  {
    label: "Tersedia",
    value: "in-stock",
  },
  {
    label: "Stok Terbatas",
    value: "low-stock",
  },
  {
    label: "Habis",
    value: "out-of-stock",
  },
];

const sortLabels = {
  featured: "Pilihan Utama",
  "price-low": "Harga: Terendah ke Tertinggi",
  "price-high": "Harga: Tertinggi ke Terendah",
  "name-az": "Nama: A ke Z",
};

const loadProducts = async () => {
  isLoadingProducts.value = true;
  productErrorMessage.value = "";

  try {
    products.value = await productService.getProducts();
  } catch (error) {
    console.error("Gagal memuat produk:", error);

    productErrorMessage.value =
      error?.response?.data?.message ||
      error?.message ||
      "Produk belum dapat dimuat dari database.";

    products.value = [];
  } finally {
    isLoadingProducts.value = false;
  }
};

onMounted(() => {
  loadProducts();

  editorialSlideInterval = setInterval(() => {
    nextEditorialSlide();
  }, 4000);
});

onBeforeUnmount(() => {
  if (editorialSlideInterval) {
    clearInterval(editorialSlideInterval);
  }
});

const heroProductIndex = ref(0);

const heroProducts = computed(() => {
  return products.value.slice(0, 5);
});

const heroProduct = computed(() => {
  if (heroProducts.value.length === 0) return null;

  return heroProducts.value[heroProductIndex.value] || heroProducts.value[0];
});

const nextHeroProduct = () => {
  if (heroProducts.value.length <= 1) return;

  heroProductIndex.value =
    heroProductIndex.value === heroProducts.value.length - 1
      ? 0
      : heroProductIndex.value + 1;
};

const previousHeroProduct = () => {
  if (heroProducts.value.length <= 1) return;

  heroProductIndex.value =
    heroProductIndex.value === 0
      ? heroProducts.value.length - 1
      : heroProductIndex.value - 1;
};

const selectHeroProduct = (index) => {
  heroProductIndex.value = index;
};

const editorialSlideIndex = ref(0);
let editorialSlideInterval = null;

const editorialProducts = computed(() => {
  return products.value.slice(0, 5);
});

const editorialProduct = computed(() => {
  if (editorialProducts.value.length === 0) return null;

  return (
    editorialProducts.value[editorialSlideIndex.value] ||
    editorialProducts.value[0]
  );
});

const nextEditorialSlide = () => {
  if (editorialProducts.value.length <= 1) return;

  editorialSlideIndex.value =
    editorialSlideIndex.value === editorialProducts.value.length - 1
      ? 0
      : editorialSlideIndex.value + 1;
};

const selectEditorialSlide = (index) => {
  editorialSlideIndex.value = index;
};

const editorialImage = computed(() => {
  return (
    content("home.editorial.image", "") || editorialProduct.value?.image || ""
  );
});

const categories = computed(() => {
  const productCategories = products.value.map((product) => product.category);
  return ["Semua", ...new Set(productCategories)];
});

const categoryCards = computed(() => {
  const uniqueCategories = [
    ...new Set(products.value.map((product) => product.category)),
  ];

  return uniqueCategories.map((category) => {
    const product = products.value.find((item) => item.category === category);

    return {
      name: category,
      image: product?.image,
    };
  });
});

const activeFilterCount = computed(() => {
  let count = 0;

  if (search.value.trim()) count++;
  if (activeCategory.value !== "Semua") count++;
  if (priceFilter.value !== "all") count++;
  if (stockFilter.value !== "all") count++;
  if (sortOption.value !== "featured") count++;

  return count;
});

const searchSuggestions = computed(() => {
  const keyword = search.value.toLowerCase().trim();

  if (!keyword) return [];

  return products.value
    .filter((product) => {
      return (
        product.title.toLowerCase().includes(keyword) ||
        product.category.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword)
      );
    })
    .slice(0, 5);
});

const showSearchPanel = computed(() => {
  return (
    isSearchFocused.value &&
    (searchSuggestions.value.length > 0 || recentSearches.value.length > 0)
  );
});

const filteredProducts = computed(() => {
  const keyword = search.value.toLowerCase().trim();

  return products.value.filter((product) => {
    const matchSearch =
      product.title.toLowerCase().includes(keyword) ||
      product.category.toLowerCase().includes(keyword) ||
      product.description.toLowerCase().includes(keyword);

    const matchCategory =
      activeCategory.value === "Semua"
        ? true
        : product.category === activeCategory.value;

    const matchPrice =
      priceFilter.value === "all"
        ? true
        : priceFilter.value === "under-500"
          ? product.price < 500000
          : priceFilter.value === "500-1000"
            ? product.price >= 500000 && product.price <= 1000000
            : priceFilter.value === "1000-1500"
              ? product.price > 1000000 && product.price <= 1500000
              : product.price > 1500000;

    const matchStock =
      stockFilter.value === "all"
        ? true
        : stockFilter.value === "in-stock"
          ? product.stock > 3
          : stockFilter.value === "low-stock"
            ? product.stock > 0 && product.stock <= 3
            : product.stock <= 0;

    return matchSearch && matchCategory && matchPrice && matchStock;
  });
});

const sortedProducts = computed(() => {
  const result = [...filteredProducts.value];

  if (sortOption.value === "price-low") {
    return result.sort((a, b) => a.price - b.price);
  }

  if (sortOption.value === "price-high") {
    return result.sort((a, b) => b.price - a.price);
  }

  if (sortOption.value === "name-az") {
    return result.sort((a, b) => a.title.localeCompare(b.title));
  }

  return result;
});

const setSortOption = (value) => {
  sortOption.value = value;
  isSortOpen.value = false;
};

const saveRecentSearch = (keyword) => {
  const cleanKeyword = keyword.trim();

  if (!cleanKeyword) return;

  const updatedSearches = [
    cleanKeyword,
    ...recentSearches.value.filter(
      (item) => item.toLowerCase() !== cleanKeyword.toLowerCase(),
    ),
  ].slice(0, MAX_RECENT_SEARCH);

  recentSearches.value = updatedSearches;

  sessionStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(updatedSearches));
};

const applySearchKeyword = (keyword) => {
  search.value = keyword;
  activeCategory.value = "Semua";
  saveRecentSearch(keyword);
  isSearchFocused.value = false;
};

const applyProductSuggestion = (product) => {
  search.value = product.title;
  activeCategory.value = "Semua";
  saveRecentSearch(product.title);
  isSearchFocused.value = false;
};

const handleSearchEnter = () => {
  saveRecentSearch(search.value);
  isSearchFocused.value = false;
};

const clearRecentSearches = () => {
  recentSearches.value = [];
  sessionStorage.removeItem(RECENT_SEARCH_KEY);
};

const handleSearchBlur = () => {
  setTimeout(() => {
    isSearchFocused.value = false;
  }, 150);
};

const resetFilters = () => {
  search.value = "";
  activeCategory.value = "Semua";
  priceFilter.value = "all";
  stockFilter.value = "all";
  sortOption.value = "featured";
  isSortOpen.value = false;
  isSearchFocused.value = false;
};

const selectCategoryFromCard = (category) => {
  activeCategory.value = category;
  search.value = "";
  priceFilter.value = "all";
  stockFilter.value = "all";
  sortOption.value = "featured";

  goToProducts();
};

const goToProducts = () => {
  const el = document.getElementById("products");

  if (!el) return;

  const yOffset = -90;
  const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

  window.scrollTo({
    top: y,
    behavior: "smooth",
  });
};

const goToCategories = () => {
  const el = document.getElementById("categories");

  if (!el) return;

  const yOffset = -90;
  const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

  window.scrollTo({
    top: y,
    behavior: "smooth",
  });
};
</script>
