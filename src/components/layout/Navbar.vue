<template>
  <header
    class="fixed top-0 left-0 w-full max-w-full z-50 bg-luxe-ivory/85 backdrop-blur-xl border-b border-luxe-sand/60 shadow-sm overflow-x-clip"
  >
    <div
      class="w-full max-w-7xl mx-auto px-4 py-3.5 sm:px-6 sm:py-5 flex md:grid md:grid-cols-[1fr_auto_1fr] items-center justify-between md:justify-normal gap-2 sm:gap-3 overflow-x-clip"
    >
      <!-- LOGO -->
      <RouterLink
        to="/"
        class="flex items-center gap-2.5 sm:gap-3 group min-w-0 flex-1 md:flex-none overflow-hidden justify-self-start"
      >
        <img
          v-if="cmsImage('navbar.logo.image')"
          :src="cmsImage('navbar.logo.image')"
          :alt="content('navbar.brand.main', 'LUXEZA')"
          class="w-11 h-11 sm:w-12 sm:h-12 object-contain rounded-xl sm:rounded-2xl bg-luxe-cream border border-luxe-sand/60 p-1 flex-shrink-0"
        />

        <div class="flex flex-col leading-none min-w-0 overflow-hidden">
          <span
            class="text-[21px] sm:text-2xl font-bold tracking-wide text-luxe-espresso group-hover:text-luxe-royal transition truncate max-w-[140px] sm:max-w-none"
          >
            {{ content("navbar.brand.main", "LUXEZA") }}
          </span>

          <span
            class="text-[10px] sm:text-[10px] tracking-[3px] sm:tracking-[4px] text-luxe-gold uppercase truncate max-w-[140px] sm:max-w-none mt-1"
          >
            {{ content("navbar.brand.sub", "Royale") }}
          </span>
        </div>
      </RouterLink>

      <!-- DESKTOP MENU -->
      <nav
        class="hidden md:flex items-center justify-center gap-8 font-medium text-sm justify-self-center"
      >
        <RouterLink
          to="/"
          :class="route.path === '/' ? 'text-luxe-espresso' : 'text-luxe-brown'"
          class="hover:text-luxe-espresso transition"
        >
          {{ content("navbar.home", "Beranda") }}
        </RouterLink>

        <button
          @click="goToProducts"
          type="button"
          class="text-luxe-brown hover:text-luxe-espresso transition"
        >
          {{ content("navbar.shop", "Belanja") }}
        </button>

        <button
          @click="goToProducts"
          type="button"
          class="text-luxe-brown hover:text-luxe-espresso transition"
        >
          {{ content("navbar.collections", "Koleksi") }}
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
          {{ content("navbar.wishlist", "Wishlist") }}
        </RouterLink>
      </nav>

      <!-- RIGHT -->
      <div
        class="flex items-center justify-end gap-1.5 sm:gap-3 md:gap-4 flex-shrink-0 justify-self-end"
      >
        <!-- WISHLIST -->
        <RouterLink
          to="/wishlist"
          class="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-luxe-espresso bg-transparent border-0 rounded-none hover:text-luxe-royal transition"
          aria-label="Wishlist"
        >
          <span
            class="text-[34px] sm:text-[34px] leading-none translate-y-[-3px]"
          >
            ♡
          </span>

          <span
            v-if="wishlistStore.totalWishlistItems"
            class="absolute -top-1 right-0 bg-luxe-royal text-luxe-ivory text-[9px] sm:text-xs min-w-4 h-4 sm:min-w-5 sm:h-5 px-1 rounded-full flex items-center justify-center font-semibold leading-none"
          >
            {{ wishlistStore.totalWishlistItems }}
          </span>
        </RouterLink>

        <!-- CART -->
        <button
          @click="uiStore.toggleCart()"
          type="button"
          class="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-luxe-espresso bg-transparent border-0 rounded-none hover:text-luxe-royal transition"
          aria-label="Keranjang"
        >
          <span
            class="text-[27px] sm:text-[27px] leading-none translate-y-[-1px]"
          >
            🛒
          </span>

          <span
            v-if="cartStore.totalItems"
            class="absolute -top-1 right-0 bg-luxe-royal text-luxe-ivory text-[9px] sm:text-xs min-w-4 h-4 sm:min-w-5 sm:h-5 px-1 rounded-full flex items-center justify-center font-semibold leading-none"
          >
            {{ cartStore.totalItems }}
          </span>
        </button>

        <!-- ACCOUNT -->
        <div class="relative">
          <RouterLink
            v-if="!authStore.isAuthenticated"
            to="/login"
            class="hidden sm:flex items-center gap-2 border border-luxe-sand text-luxe-espresso px-4 md:px-5 py-3 rounded-full hover:bg-luxe-cream transition"
          >
            <span>👤</span>
            <span class="text-sm font-medium">Masuk</span>
          </RouterLink>

          <button
            v-else
            @click="isAccountMenuOpen = !isAccountMenuOpen"
            type="button"
            class="hidden sm:flex items-center gap-2 border border-luxe-sand text-luxe-espresso px-4 md:px-5 py-3 rounded-full hover:bg-luxe-cream transition max-w-[170px] md:max-w-none"
          >
            <span>👤</span>
            <span class="text-sm font-medium truncate">
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

              <p class="text-xs text-luxe-brown/70 mt-1 break-all">
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
              Pesanan Saya
            </RouterLink>

            <RouterLink
              to="/my-addresses"
              @click="isAccountMenuOpen = false"
              class="block px-4 py-3 rounded-2xl text-luxe-espresso hover:bg-luxe-cream transition"
            >
              Alamat Saya
            </RouterLink>

            <RouterLink
              v-if="authStore.isAdmin"
              to="/admin/orders"
              @click="isAccountMenuOpen = false"
              class="block px-4 py-3 rounded-2xl text-luxe-espresso hover:bg-luxe-cream transition"
            >
              Pesanan Admin
            </RouterLink>

            <RouterLink
              v-if="authStore.isAdmin"
              to="/admin/payments"
              @click="isAccountMenuOpen = false"
              class="block px-4 py-3 rounded-2xl text-luxe-espresso hover:bg-luxe-cream transition"
            >
              Pembayaran Admin
            </RouterLink>

            <RouterLink
              v-if="authStore.isAdmin"
              to="/admin/shipping-methods"
              @click="isAccountMenuOpen = false"
              class="block px-4 py-3 rounded-2xl text-luxe-espresso hover:bg-luxe-cream transition"
            >
              Pengiriman Admin
            </RouterLink>

            <RouterLink
              v-if="authStore.isAdmin"
              to="/admin/vouchers"
              @click="isAccountMenuOpen = false"
              class="block px-4 py-3 rounded-2xl text-luxe-espresso hover:bg-luxe-cream transition"
            >
              Voucher Admin
            </RouterLink>

            <RouterLink
              v-if="authStore.isAdmin"
              to="/admin/products"
              @click="isAccountMenuOpen = false"
              class="block px-4 py-3 rounded-2xl text-luxe-espresso hover:bg-luxe-cream transition"
            >
              Produk Admin
            </RouterLink>

            <RouterLink
              v-if="authStore.isAdmin"
              to="/admin/content"
              @click="isAccountMenuOpen = false"
              class="block px-4 py-3 rounded-2xl text-luxe-espresso hover:bg-luxe-cream transition"
            >
              Konten Website
            </RouterLink>

            <button
              @click="logout"
              type="button"
              class="w-full text-left px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50 transition"
            >
              Keluar
            </button>
          </div>
        </div>

        <!-- MOBILE MENU BUTTON -->
        <button
          @click="isMobileMenuOpen = true"
          type="button"
          class="md:hidden w-8 h-8 flex items-center justify-center text-luxe-espresso bg-transparent border-0 rounded-none text-[34px] leading-none hover:text-luxe-royal transition"
          aria-label="Buka menu"
        >
          <span class="leading-none translate-y-[-2px]">☰</span>
        </button>
      </div>
    </div>
  </header>

  <!-- MOBILE MENU -->
  <div v-if="isMobileMenuOpen" class="fixed inset-0 z-[100] overflow-hidden">
    <!-- OVERLAY -->
    <div
      @click="isMobileMenuOpen = false"
      class="absolute inset-0 bg-luxe-espresso/60"
    ></div>

    <!-- SIDEBAR -->
    <aside
      class="absolute right-0 top-0 w-[min(340px,100vw)] max-w-full h-[100dvh] bg-luxe-ivory shadow-2xl flex flex-col overflow-hidden overscroll-contain"
    >
      <!-- SIDEBAR HEADER -->
      <div
        class="flex items-center justify-between px-6 sm:px-8 pt-7 sm:pt-8 pb-5 sm:pb-6 flex-shrink-0"
      >
        <div class="min-w-0">
          <h2 class="text-2xl font-bold text-luxe-espresso">Menu</h2>
          <p class="text-sm text-luxe-brown mt-1">Luxeza Royale</p>
        </div>

        <button
          @click="isMobileMenuOpen = false"
          type="button"
          class="w-10 h-10 rounded-full border border-luxe-sand text-3xl text-luxe-espresso hover:text-luxe-royal hover:bg-luxe-cream transition flex items-center justify-center flex-shrink-0"
          aria-label="Tutup menu"
        >
          ×
        </button>
      </div>

      <!-- MOBILE QUICK ACTION -->
      <div
        class="px-6 sm:px-8 pb-4 grid grid-cols-2 gap-3 flex-shrink-0 overflow-hidden"
      >
        <RouterLink
          to="/wishlist"
          @click="isMobileMenuOpen = false"
          class="relative min-w-0 flex items-center justify-center gap-2 rounded-2xl border border-luxe-sand bg-luxe-cream px-3 py-3 text-luxe-espresso font-medium hover:bg-luxe-espresso hover:text-luxe-ivory transition"
        >
          <span>♡</span>
          <span class="truncate">Wishlist</span>

          <span
            v-if="wishlistStore.totalWishlistItems"
            class="absolute top-1 right-1 bg-luxe-royal text-luxe-ivory text-[10px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center"
          >
            {{ wishlistStore.totalWishlistItems }}
          </span>
        </RouterLink>

        <button
          @click="openCartFromMobile"
          type="button"
          class="relative min-w-0 flex items-center justify-center gap-2 rounded-2xl border border-luxe-sand bg-luxe-cream px-3 py-3 text-luxe-espresso font-medium hover:bg-luxe-espresso hover:text-luxe-ivory transition"
        >
          <span>🛒</span>
          <span class="truncate">Keranjang</span>

          <span
            v-if="cartStore.totalItems"
            class="absolute top-1 right-1 bg-luxe-royal text-luxe-ivory text-[10px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center"
          >
            {{ cartStore.totalItems }}
          </span>
        </button>
      </div>

      <!-- SCROLLABLE MENU CONTENT -->
      <nav
        class="flex-1 overflow-y-auto overscroll-contain px-6 sm:px-8 pb-8 flex flex-col gap-2 text-base sm:text-lg font-medium text-luxe-espresso"
      >
        <RouterLink
          to="/"
          @click="isMobileMenuOpen = false"
          class="px-5 py-4 rounded-2xl hover:bg-luxe-cream transition"
        >
          {{ content("navbar.home", "Beranda") }}
        </RouterLink>

        <button
          @click="goToProductsFromMobile"
          type="button"
          class="text-left px-5 py-4 rounded-2xl hover:bg-luxe-cream transition"
        >
          {{ content("navbar.shop", "Belanja") }}
        </button>

        <button
          @click="goToProductsFromMobile"
          type="button"
          class="text-left px-5 py-4 rounded-2xl hover:bg-luxe-cream transition"
        >
          {{ content("navbar.collections", "Koleksi") }}
        </button>

        <RouterLink
          to="/checkout"
          @click="isMobileMenuOpen = false"
          class="px-5 py-4 rounded-2xl hover:bg-luxe-cream transition"
        >
          {{ content("navbar.checkout", "Checkout") }}
        </RouterLink>

        <RouterLink
          to="/wishlist"
          @click="isMobileMenuOpen = false"
          class="px-5 py-4 rounded-2xl hover:bg-luxe-cream transition"
        >
          {{ content("navbar.wishlist", "Wishlist") }}
        </RouterLink>

        <div class="border-t border-luxe-sand/60 mt-4 pt-4">
          <RouterLink
            v-if="!authStore.isAuthenticated"
            to="/login"
            @click="isMobileMenuOpen = false"
            class="px-5 py-4 rounded-2xl hover:bg-luxe-cream transition block"
          >
            Masuk / Daftar
          </RouterLink>

          <template v-else>
            <div class="px-5 py-4">
              <p class="font-semibold text-luxe-espresso">
                {{ authStore.userName }}
              </p>

              <p class="text-sm text-luxe-brown/70 mt-1 break-all">
                {{ authStore.user?.email }}
              </p>
            </div>

            <RouterLink
              to="/orders"
              @click="isMobileMenuOpen = false"
              class="px-5 py-4 rounded-2xl hover:bg-luxe-cream transition block"
            >
              Pesanan Saya
            </RouterLink>

            <RouterLink
              to="/my-addresses"
              @click="isMobileMenuOpen = false"
              class="px-5 py-4 rounded-2xl hover:bg-luxe-cream transition block"
            >
              Alamat Saya
            </RouterLink>

            <RouterLink
              v-if="authStore.isAdmin"
              to="/admin/orders"
              @click="isMobileMenuOpen = false"
              class="px-5 py-4 rounded-2xl hover:bg-luxe-cream transition block"
            >
              Pesanan Admin
            </RouterLink>

            <RouterLink
              v-if="authStore.isAdmin"
              to="/admin/payments"
              @click="isMobileMenuOpen = false"
              class="px-5 py-4 rounded-2xl hover:bg-luxe-cream transition block"
            >
              Pembayaran Admin
            </RouterLink>

            <RouterLink
              v-if="authStore.isAdmin"
              to="/admin/shipping-methods"
              @click="isMobileMenuOpen = false"
              class="px-5 py-4 rounded-2xl hover:bg-luxe-cream transition block"
            >
              Pengiriman Admin
            </RouterLink>

            <RouterLink
              v-if="authStore.isAdmin"
              to="/admin/vouchers"
              @click="isMobileMenuOpen = false"
              class="px-5 py-4 rounded-2xl hover:bg-luxe-cream transition block"
            >
              Voucher Admin
            </RouterLink>

            <RouterLink
              v-if="authStore.isAdmin"
              to="/admin/products"
              @click="isMobileMenuOpen = false"
              class="px-5 py-4 rounded-2xl hover:bg-luxe-cream transition block"
            >
              Produk Admin
            </RouterLink>

            <RouterLink
              v-if="authStore.isAdmin"
              to="/admin/content"
              @click="isMobileMenuOpen = false"
              class="px-5 py-4 rounded-2xl hover:bg-luxe-cream transition block"
            >
              Konten Website
            </RouterLink>

            <button
              @click="logout"
              type="button"
              class="w-full text-left px-5 py-4 rounded-2xl text-red-600 hover:bg-red-50 transition"
            >
              Keluar
            </button>
          </template>
        </div>
      </nav>
    </aside>
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useCartStore } from "../../stores/cartStore";
import { useUiStore } from "../../stores/uiStore";
import { useWishlistStore } from "../../stores/wishlistStore";
import { useAuthStore } from "../../stores/authStore";
import { useSiteContentStore } from "../../stores/siteContentStore";

const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const uiStore = useUiStore();
const authStore = useAuthStore();
const siteContentStore = useSiteContentStore();

const router = useRouter();
const route = useRoute();

const isMobileMenuOpen = ref(false);
const isAccountMenuOpen = ref(false);

const content = (key, fallback = "") => {
  return siteContentStore.getContent(key, fallback);
};

const cmsImage = (key, fallback = "") => {
  const url = content(key, fallback);

  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return url.startsWith("/") ? url : `/${url}`;
};

watch(
  () => isMobileMenuOpen.value,
  (isOpen) => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  },
);

onBeforeUnmount(() => {
  document.body.style.overflow = "";
});

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

const openCartFromMobile = () => {
  isMobileMenuOpen.value = false;
  uiStore.toggleCart();
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

<style scoped>
:global(html),
:global(body),
:global(#app) {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}
</style>
