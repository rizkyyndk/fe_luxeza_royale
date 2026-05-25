<template>
  <div>
    <Navbar />
    <CartSidebar />

    <section
      class="min-h-screen pt-36 pb-24 px-6 flex items-center justify-center"
    >
      <div
        class="max-w-2xl w-full bg-luxe-ivory border border-luxe-sand/70 rounded-[2rem] p-10 md:p-14 text-center shadow-[0_24px_90px_rgba(92,56,36,0.16)]"
      >
        <div
          class="w-24 h-24 mx-auto mb-8 rounded-full bg-luxe-cream border border-luxe-sand/60 flex items-center justify-center"
        >
          <p class="text-4xl font-bold text-luxe-espresso">404</p>
        </div>

        <p class="uppercase tracking-[4px] text-sm text-luxe-brown mb-4">
          Page Not Found
        </p>

        <h1 class="text-4xl md:text-5xl font-bold mb-5 text-luxe-espresso">
          This page is not available
        </h1>

        <p class="text-luxe-brown/75 leading-7 mb-8">
          The page you are looking for does not exist, may have been moved, or
          is no longer available in Luxeza Royale.
        </p>

        <RouterLink
          to="/"
          class="bg-luxe-espresso text-luxe-ivory px-8 py-4 rounded-full inline-block hover:bg-luxe-royal hover:scale-105 transition shadow-lg shadow-luxe-brown/20"
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
