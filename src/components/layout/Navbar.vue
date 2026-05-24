<template>
  <header
    class="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100"
  >
    <div class="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
      <!-- LOGO -->
      <RouterLink to="/" class="flex flex-col leading-none">
        <span class="text-2xl font-bold tracking-wide">LUXEZA</span>
        <span class="text-[10px] tracking-[4px] text-gray-400 uppercase">
          Royale
        </span>
      </RouterLink>

      <!-- DESKTOP MENU -->
      <nav class="hidden md:flex items-center gap-8 font-medium text-sm">
        <RouterLink
          to="/"
          :class="route.path === '/' ? 'text-black' : 'text-gray-500'"
          class="hover:text-black transition"
        >
          Home
        </RouterLink>

        <button
          @click="goToProducts"
          class="text-gray-500 hover:text-black transition"
        >
          Shop
        </button>

        <button
          @click="goToProducts"
          class="text-gray-500 hover:text-black transition"
        >
          Collections
        </button>

        <RouterLink
          to="/wishlist"
          :class="route.path === '/wishlist' ? 'text-black' : 'text-gray-500'"
          class="hover:text-black transition"
        >
          Wishlist
        </RouterLink>

        <RouterLink
          to="/orders"
          :class="route.path === '/orders' ? 'text-black' : 'text-gray-500'"
          class="hover:text-black transition"
        >
          Orders
        </RouterLink>
      </nav>

      <!-- RIGHT -->
      <div class="flex items-center gap-4">
        <!-- WISHLIST -->
        <RouterLink
          to="/wishlist"
          class="relative w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition"
        >
          <span class="text-xl">♡</span>

          <span
            v-if="wishlistStore.totalWishlistItems"
            class="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
          >
            {{ wishlistStore.totalWishlistItems }}
          </span>
        </RouterLink>

        <!-- CART -->
        <button
          @click="uiStore.toggleCart()"
          class="relative w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition"
        >
          <span class="text-lg">🛒</span>

          <span
            v-if="cartStore.totalItems"
            class="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
          >
            {{ cartStore.totalItems }}
          </span>
        </button>

        <!-- MOBILE MENU BUTTON -->
        <button
          @click="isMobileMenuOpen = true"
          class="md:hidden w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-2xl"
        >
          ☰
        </button>
      </div>
    </div>
  </header>

  <!-- MOBILE MENU -->
  <div v-if="isMobileMenuOpen" class="fixed inset-0 z-[60]">
    <!-- OVERLAY -->
    <div
      @click="isMobileMenuOpen = false"
      class="absolute inset-0 bg-black/50"
    ></div>

    <!-- SIDEBAR -->
    <aside
      class="absolute right-0 top-0 w-full max-w-[340px] h-screen bg-white p-8 shadow-2xl"
    >
      <div class="flex items-center justify-between mb-12">
        <div>
          <h2 class="text-2xl font-bold">Menu</h2>
          <p class="text-sm text-gray-400 mt-1">Luxeza Royale</p>
        </div>

        <button @click="isMobileMenuOpen = false" class="text-3xl">×</button>
      </div>

      <nav class="flex flex-col gap-3 text-lg font-medium">
        <RouterLink
          to="/"
          @click="isMobileMenuOpen = false"
          class="px-5 py-4 rounded-2xl hover:bg-[#f8f5f2] transition"
        >
          Home
        </RouterLink>

        <button
          @click="goToProductsFromMobile"
          class="text-left px-5 py-4 rounded-2xl hover:bg-[#f8f5f2] transition"
        >
          Shop
        </button>

        <button
          @click="goToProductsFromMobile"
          class="text-left px-5 py-4 rounded-2xl hover:bg-[#f8f5f2] transition"
        >
          Collections
        </button>

        <RouterLink
          to="/checkout"
          @click="isMobileMenuOpen = false"
          class="px-5 py-4 rounded-2xl hover:bg-[#f8f5f2] transition"
        >
          Checkout
        </RouterLink>

        <RouterLink
          to="/wishlist"
          @click="isMobileMenuOpen = false"
          class="px-5 py-4 rounded-2xl hover:bg-[#f8f5f2] transition"
        >
          Wishlist
        </RouterLink>

        <RouterLink
          to="/orders"
          @click="isMobileMenuOpen = false"
          class="px-5 py-4 rounded-2xl hover:bg-[#f8f5f2] transition"
        >
          Orders
        </RouterLink>
      </nav>
    </aside>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useCartStore } from "../../stores/cartStore";
import { useUiStore } from "../../stores/uiStore";
import { useWishlistStore } from "../../stores/wishlistStore";

const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const uiStore = useUiStore();

const router = useRouter();
const route = useRoute();

const isMobileMenuOpen = ref(false);

const goToProducts = async () => {
  if (window.location.pathname !== "/") {
    await router.push("/");
  }

  setTimeout(() => {
    const el = document.getElementById("products");

    if (!el) return;

    const offset = 90;
    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  }, 150);
};

const goToProductsFromMobile = async () => {
  isMobileMenuOpen.value = false;
  await goToProducts();
};
</script>
