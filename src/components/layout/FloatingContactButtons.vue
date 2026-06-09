<template>
  <div v-if="!isHiddenPage">
    <!-- MOBILE FLOATING MENU -->
    <div class="sm:hidden fixed bottom-5 right-4 z-[90]">
      <!-- OVERLAY TAP AREA -->
      <button
        v-if="isMobileOpen"
        type="button"
        class="fixed inset-0 z-[80] bg-transparent"
        aria-label="Tutup menu kontak"
        @click="isMobileOpen = false"
      ></button>

      <!-- MOBILE ACTION PANEL -->
      <Transition name="contact-panel">
        <div
          v-if="isMobileOpen"
          class="relative z-[91] mb-3 w-[min(280px,calc(100vw-2rem))] rounded-[1.6rem] border border-luxe-sand/70 bg-luxe-ivory p-3 shadow-[0_20px_70px_rgba(43,26,18,0.22)]"
        >
          <div class="px-3 py-2">
            <p class="text-sm font-bold text-luxe-espresso">Butuh bantuan?</p>
            <p class="mt-1 text-xs leading-5 text-luxe-brown/70">
              Tanya stok produk, GoSend, atau cek katalog terbaru.
            </p>
          </div>

          <div class="mt-2 space-y-2">
            <!-- WHATSAPP MOBILE -->
            <a
              :href="whatsappLink"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-green-700 transition active:scale-[0.98]"
              @click="isMobileOpen = false"
            >
              <span
                class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-white"
              >
                <svg
                  class="h-5 w-5"
                  viewBox="0 0 32 32"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M16.04 3C8.86 3 3.03 8.82 3.03 15.99c0 2.29.6 4.52 1.73 6.49L3 29l6.68-1.74a12.92 12.92 0 0 0 6.36 1.62h.01c7.17 0 13-5.82 13-12.99C29.05 8.82 23.22 3 16.04 3Zm0 23.67h-.01a10.75 10.75 0 0 1-5.48-1.5l-.39-.23-3.96 1.03 1.06-3.86-.25-.4a10.68 10.68 0 0 1-1.64-5.72c0-5.9 4.8-10.7 10.71-10.7 2.86 0 5.55 1.12 7.57 3.14a10.63 10.63 0 0 1 3.14 7.56c0 5.9-4.8 10.68-10.75 10.68Zm5.87-8.01c-.32-.16-1.9-.94-2.2-1.05-.3-.11-.52-.16-.74.16-.22.32-.85 1.05-1.04 1.27-.19.22-.38.24-.7.08-.32-.16-1.36-.5-2.59-1.59-.96-.85-1.6-1.9-1.79-2.22-.19-.32-.02-.49.14-.65.15-.15.32-.38.48-.57.16-.19.22-.32.32-.54.11-.22.05-.41-.03-.57-.08-.16-.74-1.78-1.01-2.44-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.57.08-.87.41-.3.32-1.14 1.11-1.14 2.71s1.17 3.15 1.33 3.36c.16.22 2.3 3.51 5.57 4.92.78.34 1.39.54 1.86.69.78.25 1.49.21 2.05.13.63-.09 1.9-.78 2.17-1.53.27-.75.27-1.39.19-1.53-.08-.14-.3-.22-.62-.38Z"
                  />
                </svg>
              </span>

              <span class="min-w-0">
                <span class="block text-sm font-bold">WhatsApp</span>
                <span class="block text-xs leading-5 text-green-700/80">
                  Tanya stok / pengiriman GoSend
                </span>
              </span>
            </a>

            <!-- INSTAGRAM MOBILE -->
            <a
              :href="instagramLink"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 rounded-2xl border border-pink-100 bg-pink-50 px-4 py-3 text-pink-700 transition active:scale-[0.98]"
              @click="isMobileOpen = false"
            >
              <span
                class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 text-white"
              >
                <svg
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </span>

              <span class="min-w-0">
                <span class="block text-sm font-bold">Instagram</span>
                <span class="block text-xs leading-5 text-pink-700/80">
                  Lihat katalog dan update terbaru
                </span>
              </span>
            </a>
          </div>
        </div>
      </Transition>

      <!-- MOBILE MAIN BUTTON -->
      <button
        type="button"
        class="relative z-[92] flex h-14 min-w-14 items-center justify-center gap-2 rounded-full bg-luxe-espresso px-4 text-luxe-ivory shadow-[0_14px_40px_rgba(43,26,18,0.35)] transition active:scale-95"
        aria-label="Buka kontak Luxeza Royale"
        @click="isMobileOpen = !isMobileOpen"
      >
        <span
          v-if="!isMobileOpen"
          class="absolute -left-1 -top-1 h-4 w-4 rounded-full bg-green-500 ring-4 ring-luxe-ivory animate-pulse"
        ></span>

        <span v-if="!isMobileOpen" class="text-lg">💬</span>
        <span v-else class="text-2xl leading-none">×</span>

        <span class="text-sm font-bold">
          {{ isMobileOpen ? "Tutup" : "Chat" }}
        </span>
      </button>
    </div>

    <!-- DESKTOP FLOATING BUTTONS -->
    <div class="hidden sm:flex fixed bottom-6 right-6 z-[80] flex-col gap-3">
      <!-- WHATSAPP DESKTOP -->
      <a
        :href="whatsappLink"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp Luxeza Royale"
        class="group relative flex items-center justify-end"
      >
        <span
          class="mr-3 rounded-full bg-luxe-espresso px-4 py-2 text-xs font-semibold text-luxe-ivory opacity-0 shadow-lg transition group-hover:opacity-100 whitespace-nowrap"
        >
          Tanya Stok / GoSend
        </span>

        <span
          class="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-[0_12px_35px_rgba(34,197,94,0.35)] transition hover:scale-110 hover:bg-green-600"
        >
          <svg
            class="h-7 w-7"
            viewBox="0 0 32 32"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M16.04 3C8.86 3 3.03 8.82 3.03 15.99c0 2.29.6 4.52 1.73 6.49L3 29l6.68-1.74a12.92 12.92 0 0 0 6.36 1.62h.01c7.17 0 13-5.82 13-12.99C29.05 8.82 23.22 3 16.04 3Zm0 23.67h-.01a10.75 10.75 0 0 1-5.48-1.5l-.39-.23-3.96 1.03 1.06-3.86-.25-.4a10.68 10.68 0 0 1-1.64-5.72c0-5.9 4.8-10.7 10.71-10.7 2.86 0 5.55 1.12 7.57 3.14a10.63 10.63 0 0 1 3.14 7.56c0 5.9-4.8 10.68-10.75 10.68Zm5.87-8.01c-.32-.16-1.9-.94-2.2-1.05-.3-.11-.52-.16-.74.16-.22.32-.85 1.05-1.04 1.27-.19.22-.38.24-.7.08-.32-.16-1.36-.5-2.59-1.59-.96-.85-1.6-1.9-1.79-2.22-.19-.32-.02-.49.14-.65.15-.15.32-.38.48-.57.16-.19.22-.32.32-.54.11-.22.05-.41-.03-.57-.08-.16-.74-1.78-1.01-2.44-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.57.08-.87.41-.3.32-1.14 1.11-1.14 2.71s1.17 3.15 1.33 3.36c.16.22 2.3 3.51 5.57 4.92.78.34 1.39.54 1.86.69.78.25 1.49.21 2.05.13.63-.09 1.9-.78 2.17-1.53.27-.75.27-1.39.19-1.53-.08-.14-.3-.22-.62-.38Z"
            />
          </svg>
        </span>
      </a>

      <!-- INSTAGRAM DESKTOP -->
      <a
        :href="instagramLink"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram Luxeza Royale"
        class="group relative flex items-center justify-end"
      >
        <span
          class="mr-3 rounded-full bg-luxe-espresso px-4 py-2 text-xs font-semibold text-luxe-ivory opacity-0 shadow-lg transition group-hover:opacity-100 whitespace-nowrap"
        >
          Instagram
        </span>

        <span
          class="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 text-white shadow-[0_12px_35px_rgba(236,72,153,0.32)] transition hover:scale-110"
        >
          <svg
            class="h-7 w-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
            <circle cx="12" cy="12" r="4" />
            <circle
              cx="17.5"
              cy="6.5"
              r="1"
              fill="currentColor"
              stroke="none"
            />
          </svg>
        </span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useSiteContentStore } from "../../stores/siteContentStore";

const route = useRoute();
const siteContentStore = useSiteContentStore();

const isMobileOpen = ref(false);

const content = (key, fallback = "") => {
  return siteContentStore.getContent(key, fallback);
};

const whatsappNumber = computed(() => {
  const rawNumber = content("contact.whatsapp.number", "6281315092040");

  return String(rawNumber || "")
    .replace(/\D/g, "")
    .replace(/^0/, "62");
});

const instagramLink = computed(() => {
  const rawInstagram = content(
    "contact.instagram.url",
    "https://www.instagram.com/luxezaroyale.id",
  );

  const value = String(rawInstagram || "").trim();

  if (!value) return "https://www.instagram.com/luxezaroyale.id";

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  const username = value.replace("@", "").replace("/", "");

  return `https://www.instagram.com/${username}`;
});

const whatsappMessage = computed(() => {
  const currentUrl = window.location.href;

  return [
    "Halo Luxeza Royale, saya ingin bertanya ketersediaan stok produk.",
    "Saya juga ingin tanya apakah bisa pengiriman menggunakan GoSend.",
    "",
    `Halaman produk/toko: ${currentUrl}`,
  ].join("\n");
});

const whatsappLink = computed(() => {
  return `https://wa.me/${whatsappNumber.value}?text=${encodeURIComponent(
    whatsappMessage.value,
  )}`;
});

const isHiddenPage = computed(() => {
  return route.path.startsWith("/admin");
});

watch(
  () => route.fullPath,
  () => {
    isMobileOpen.value = false;
  },
);
</script>

<style scoped>
.contact-panel-enter-active,
.contact-panel-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.contact-panel-enter-from,
.contact-panel-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.96);
}
</style>
