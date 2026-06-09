<template>
  <div>
    <Navbar />
    <CartSidebar />

    <section class="pt-36 pb-24 px-6">
      <div class="max-w-7xl mx-auto">
        <!-- HEADER -->
        <div
          class="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <p class="uppercase tracking-[4px] text-sm text-luxe-brown mb-4">
              Wishlist
            </p>

            <h1 class="text-4xl md:text-5xl font-bold mb-4 text-luxe-espresso">
              Koleksi Favorit Anda
            </h1>

            <p class="text-luxe-brown/75 max-w-xl leading-7">
              Produk Luxeza Royale pilihan Anda tersimpan di sini. Lihat kembali
              kapan saja sebelum menambahkannya ke keranjang.
            </p>
          </div>

          <button
            v-if="!wishlistStore.isEmpty"
            @click="wishlistStore.clearWishlist()"
            class="border border-luxe-espresso text-luxe-espresso px-6 py-3 rounded-full hover:bg-luxe-espresso hover:text-luxe-ivory transition w-fit"
          >
            Hapus Semua Wishlist
          </button>
        </div>

        <!-- EMPTY -->
        <div
          v-if="wishlistStore.isEmpty"
          class="min-h-[50vh] bg-luxe-cream border border-luxe-sand/60 shadow-[0_18px_60px_rgba(92,56,36,0.10)] rounded-[2rem] flex items-center justify-center text-center px-6"
        >
          <div>
            <p class="text-6xl mb-6 text-luxe-espresso">♡</p>

            <h2 class="text-3xl md:text-4xl font-bold mb-4 text-luxe-espresso">
              Wishlist Anda masih kosong
            </h2>

            <p class="text-luxe-brown/75 mb-8">
              Simpan produk favorit Anda dan temukan kembali koleksi pilihan
              dengan lebih mudah.
            </p>

            <RouterLink
              to="/"
              class="bg-luxe-espresso text-luxe-ivory px-8 py-4 rounded-full inline-block hover:bg-luxe-royal hover:scale-105 transition shadow-lg shadow-luxe-brown/20"
            >
              Jelajahi Koleksi
            </RouterLink>
          </div>
        </div>

        <!-- WISHLIST GRID -->
        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <ProductCard
            v-for="product in wishlistStore.items"
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
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import Navbar from "../components/layout/Navbar.vue";
import CartSidebar from "../components/layout/CartSidebar.vue";
import Footer from "../components/layout/Footer.vue";
import ProductCard from "../components/product/ProductCard.vue";

import { useWishlistStore } from "../stores/wishlistStore";

const wishlistStore = useWishlistStore();
</script>
