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
            <p class="uppercase tracking-[4px] text-sm text-gray-500 mb-4">
              Wishlist
            </p>

            <h1 class="text-4xl md:text-5xl font-bold mb-4">
              Saved Luxury Pieces
            </h1>

            <p class="text-gray-500 max-w-xl leading-7">
              Your favorite products are saved here. You can review them anytime
              before adding them to your cart.
            </p>
          </div>

          <button
            v-if="!wishlistStore.isEmpty"
            @click="wishlistStore.clearWishlist()"
            class="border border-black px-6 py-3 rounded-full hover:bg-black hover:text-white transition"
          >
            Clear Wishlist
          </button>
        </div>

        <!-- EMPTY -->
        <div
          v-if="wishlistStore.isEmpty"
          class="min-h-[50vh] bg-[#f8f5f2] rounded-[2rem] flex items-center justify-center text-center px-6"
        >
          <div>
            <p class="text-6xl mb-6">♡</p>

            <h2 class="text-3xl md:text-4xl font-bold mb-4">
              Your wishlist is empty
            </h2>

            <p class="text-gray-500 mb-8">
              Start saving your favorite luxury products.
            </p>

            <RouterLink
              to="/"
              class="bg-black text-white px-8 py-4 rounded-full inline-block hover:scale-105 transition"
            >
              Explore Collection
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
