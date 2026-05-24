<template>
  <div>
    <Navbar />
    <CartSidebar />

    <section
      class="min-h-screen pt-36 pb-24 px-6 flex items-center justify-center bg-[#f8f5f2]"
    >
      <div class="max-w-xl text-center">
        <p class="text-7xl mb-6">404</p>

        <p class="uppercase tracking-[4px] text-sm text-gray-500 mb-4">
          Page Not Found
        </p>

        <h1 class="text-4xl md:text-5xl font-bold mb-5">
          This page is not available
        </h1>

        <p class="text-gray-500 leading-7 mb-8">
          The page you are looking for does not exist or may have been moved.
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
import Navbar from "../components/layout/Navbar.vue";
import CartSidebar from "../components/layout/CartSidebar.vue";
import Footer from "../components/layout/Footer.vue";
</script>
