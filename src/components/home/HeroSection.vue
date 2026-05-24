<template>
  <section class="min-h-screen bg-gray-50 flex items-center px-6 pt-32">
    <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
      <div>
        <p class="uppercase tracking-[6px] text-sm text-gray-500 mb-4">
          Luxury Fashion
        </p>

        <h1 class="text-6xl md:text-7xl font-bold leading-tight mb-6">
          Elevate Your Style.
        </h1>

        <p class="text-lg text-gray-600 mb-8 max-w-lg">
          Modern premium fashion ecommerce inspired by minimalist luxury brands.
        </p>

        <button
          class="bg-black text-white px-8 py-4 rounded-full hover:scale-105 transition duration-300"
        >
          Shop Now
        </button>
      </div>

      <div>
        <img
          :src="product.image"
          class="rounded-3xl shadow-2xl w-full h-[700px] object-cover"
        />
      </div>
    </div>
  </section>
</template>
