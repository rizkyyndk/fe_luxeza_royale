<template>
  <header
    class="fixed top-0 left-0 w-full z-50 bg-luxe-ivory/85 backdrop-blur-xl border-b border-luxe-sand/60 shadow-sm"
  >
    <div class="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
      <!-- LOGO -->
      <RouterLink to="/" class="flex flex-col leading-none group">
        <span
          class="text-2xl font-bold tracking-wide text-luxe-espresso group-hover:text-luxe-royal transition"
        >
          LUXEZA
        </span>

        <span class="text-[10px] tracking-[4px] text-luxe-gold uppercase">
          Royale
        </span>
      </RouterLink>

      <!-- DESKTOP MENU -->
      <nav class="hidden md:flex items-center gap-8 font-medium text-sm">
        <RouterLink
          to="/"
          :class="route.path === '/' ? 'text-luxe-espresso' : 'text-luxe-brown'"
          class="hover:text-luxe-espresso transition"
        >
          Home
        </RouterLink>

        <button
          @click="goToProducts"
          class="text-luxe-brown hover:text-luxe-espresso transition"
        >
          Shop
        </button>

        <button
          @click="goToProducts"
          class="text-luxe-brown hover:text-luxe-espresso transition"
        >
          Collections
        </button>

        <RouterLink
          to="/wishlist"
          :class="
            route.path === '/wishlist'
              ? 'text-luxe-espresso'
              : 'text-luxe-brown'
          "
          class="hover:text-luxe-espresso transition"
        >
          Wishlist
        </RouterLink>

        <RouterLink
          to="/orders"
          :class="
            route.path === '/orders' ? 'text-luxe-espresso' : 'text-luxe-brown'
          "
          class="hover:text-luxe-espresso transition"
        >
          Orders
        </RouterLink>

        <RouterLink
          v-if="authStore.isAdmin"
          to="/admin/orders"
          :class="
            route.path === '/admin/orders'
              ? 'text-luxe-espresso'
              : 'text-luxe-brown'
          "
          class="hover:text-luxe-espresso transition"
        >
          Admin
        </RouterLink>

        <RouterLink
          v-if="authStore.isAdmin"
          to="/admin/payments"
          :class="
            route.path === '/admin/payments'
              ? 'text-luxe-espresso'
              : 'text-luxe-brown'
          "
          class="hover:text-luxe-espresso transition"
        >
          Payments
        </RouterLink>
      </nav>

      <!-- RIGHT -->
      <div class="flex items-center gap-4">
        <!-- WISHLIST -->
        <RouterLink
          to="/wishlist"
          class="relative w-11 h-11 rounded-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso flex items-center justify-center hover:bg-luxe-espresso hover:text-luxe-ivory transition"
        >
          <span class="text-xl">♡</span>

          <span
            v-if="wishlistStore.totalWishlistItems"
            class="absolute -top-2 -right-2 bg-luxe-royal text-luxe-ivory text-xs w-5 h-5 rounded-full flex items-center justify-center"
          >
            {{ wishlistStore.totalWishlistItems }}
          </span>
        </RouterLink>

        <!-- CART -->
        <button
          @click="uiStore.toggleCart()"
          class="relative w-11 h-11 rounded-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso flex items-center justify-center hover:bg-luxe-espresso hover:text-luxe-ivory transition"
        >
          <span class="text-lg">🛒</span>

          <span
            v-if="cartStore.totalItems"
            class="absolute -top-2 -right-2 bg-luxe-royal text-luxe-ivory text-xs w-5 h-5 rounded-full flex items-center justify-center"
          >
            {{ cartStore.totalItems }}
          </span>
        </button>

        <!-- ACCOUNT -->
        <div class="relative">
          <RouterLink
            v-if="!authStore.isAuthenticated"
            to="/login"
            class="hidden sm:flex items-center gap-2 border border-luxe-sand text-luxe-espresso px-5 py-3 rounded-full hover:bg-luxe-cream transition"
          >
            <span>👤</span>
            <span class="text-sm font-medium">Login</span>
          </RouterLink>

          <button
            v-else
            @click="isAccountMenuOpen = !isAccountMenuOpen"
            type="button"
            class="hidden sm:flex items-center gap-2 border border-luxe-sand text-luxe-espresso px-5 py-3 rounded-full hover:bg-luxe-cream transition"
          >
            <span>👤</span>
            <span class="text-sm font-medium">
              {{ authStore.userName }}
            </span>
          </button>

          <div
            v-if="authStore.isAuthenticated && isAccountMenuOpen"
            class="absolute right-0 mt-3 w-64 bg-luxe-ivory border border-luxe-sand/70 rounded-3xl shadow-[0_18px_60px_rgba(92,56,36,0.16)] p-3 z-[70]"
          >
            <div class="px-4 py-3 border-b border-luxe-sand/60 mb-2">
              <p class="font-semibold text-luxe-espresso">
                {{ authStore.userName }}
              </p>

              <p class="text-xs text-luxe-brown/70 mt-1">
                {{ authStore.user?.email }}
              </p>

              <p
                v-if="authStore.isAdmin"
                class="inline-block mt-3 text-xs bg-luxe-espresso text-luxe-ivory px-3 py-1 rounded-full"
              >
                Admin
              </p>
            </div>

            <RouterLink
              to="/orders"
              @click="isAccountMenuOpen = false"
              class="block px-4 py-3 rounded-2xl text-luxe-espresso hover:bg-luxe-cream transition"
            >
              My Orders
            </RouterLink>

            <RouterLink
              v-if="authStore.isAdmin"
              to="/admin/orders"
              @click="isAccountMenuOpen = false"
              class="block px-4 py-3 rounded-2xl text-luxe-espresso hover:bg-luxe-cream transition"
            >
              Admin Orders
            </RouterLink>

            <RouterLink
              v-if="authStore.isAdmin"
              to="/admin/payments"
              @click="isAccountMenuOpen = false"
              class="block px-4 py-3 rounded-2xl text-luxe-espresso hover:bg-luxe-cream transition"
            >
              Admin Payments
            </RouterLink>

            <button
              @click="logout"
              type="button"
              class="w-full text-left px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50 transition"
            >
              Logout
            </button>
          </div>
        </div>

        <!-- MOBILE MENU BUTTON -->
        <button
          @click="isMobileMenuOpen = true"
          class="md:hidden w-11 h-11 rounded-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso flex items-center justify-center text-2xl hover:bg-luxe-espresso hover:text-luxe-ivory transition"
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
      class="absolute inset-0 bg-luxe-espresso/60"
    ></div>

    <!-- SIDEBAR -->
    <aside
      class="absolute right-0 top-0 w-full max-w-[340px] h-screen bg-luxe-ivory p-8 shadow-2xl"
    >
      <div class="flex items-center justify-between mb-12">
        <div>
          <h2 class="text-2xl font-bold text-luxe-espresso">Menu</h2>
          <p class="text-sm text-luxe-brown mt-1">Luxeza Royale</p>
        </div>

        <button
          @click="isMobileMenuOpen = false"
          class="text-3xl text-luxe-espresso hover:text-luxe-royal transition"
        >
          ×
        </button>
      </div>

      <nav class="flex flex-col gap-3 text-lg font-medium text-luxe-espresso">
        <RouterLink
          to="/"
          @click="isMobileMenuOpen = false"
          class="px-5 py-4 rounded-2xl hover:bg-luxe-cream transition"
        >
          Home
        </RouterLink>

        <button
          @click="goToProductsFromMobile"
          class="text-left px-5 py-4 rounded-2xl hover:bg-luxe-cream transition"
        >
          Shop
        </button>

        <button
          @click="goToProductsFromMobile"
          class="text-left px-5 py-4 rounded-2xl hover:bg-luxe-cream transition"
        >
          Collections
        </button>

        <RouterLink
          to="/checkout"
          @click="isMobileMenuOpen = false"
          class="px-5 py-4 rounded-2xl hover:bg-luxe-cream transition"
        >
          Checkout
        </RouterLink>

        <RouterLink
          to="/wishlist"
          @click="isMobileMenuOpen = false"
          class="px-5 py-4 rounded-2xl hover:bg-luxe-cream transition"
        >
          Wishlist
        </RouterLink>

        <RouterLink
          to="/orders"
          @click="isMobileMenuOpen = false"
          class="px-5 py-4 rounded-2xl hover:bg-luxe-cream transition"
        >
          Orders
        </RouterLink>

        <RouterLink
          v-if="authStore.isAdmin"
          to="/admin/orders"
          :class="
            route.path === '/admin/orders'
              ? 'text-luxe-espresso'
              : 'text-luxe-brown'
          "
          class="hover:text-luxe-espresso transition"
        >
          Admin
        </RouterLink>

        <RouterLink
          v-if="authStore.isAdmin"
          to="/admin/payments"
          @click="isMobileMenuOpen = false"
          class="px-5 py-4 rounded-2xl hover:bg-luxe-cream transition"
        >
          Admin Payments
        </RouterLink>

        <div class="border-t border-luxe-sand/60 mt-4 pt-4">
          <RouterLink
            v-if="!authStore.isAuthenticated"
            to="/login"
            @click="isMobileMenuOpen = false"
            class="px-5 py-4 rounded-2xl hover:bg-luxe-cream transition block"
          >
            Login / Register
          </RouterLink>

          <template v-else>
            <div class="px-5 py-4">
              <p class="font-semibold text-luxe-espresso">
                {{ authStore.userName }}
              </p>

              <p class="text-sm text-luxe-brown/70 mt-1">
                {{ authStore.user?.email }}
              </p>
            </div>

            <RouterLink
              to="/orders"
              @click="isMobileMenuOpen = false"
              class="px-5 py-4 rounded-2xl hover:bg-luxe-cream transition block"
            >
              My Orders
            </RouterLink>

            <RouterLink
              v-if="authStore.isAdmin"
              to="/admin/orders"
              @click="isMobileMenuOpen = false"
              class="px-5 py-4 rounded-2xl hover:bg-luxe-cream transition block"
            >
              Admin Orders
            </RouterLink>

            <RouterLink
              v-if="authStore.isAdmin"
              to="/admin/payments"
              @click="isMobileMenuOpen = false"
              class="px-5 py-4 rounded-2xl hover:bg-luxe-cream transition block"
            >
              Admin Payments
            </RouterLink>

            <button
              @click="logout"
              type="button"
              class="w-full text-left px-5 py-4 rounded-2xl text-red-600 hover:bg-red-50 transition"
            >
              Logout
            </button>
          </template>
        </div>
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
import { useAuthStore } from "../../stores/authStore";

const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const uiStore = useUiStore();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const isMobileMenuOpen = ref(false);
const isAccountMenuOpen = ref(false);

const goToProducts = async () => {
  if (route.path !== "/") {
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

const logout = async () => {
  await authStore.logout();

  cartStore.resetToGuestEmpty();
  wishlistStore.resetToGuestEmpty();

  isAccountMenuOpen.value = false;
  isMobileMenuOpen.value = false;

  await router.push("/");
};
</script>
