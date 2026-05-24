<template>
  <div>
    <Navbar />
    <CartSidebar />

    <section
      class="min-h-screen pt-36 pb-24 px-6 flex items-center justify-center bg-[#f8f5f2]"
    >
      <div
        class="max-w-2xl w-full bg-white rounded-[2rem] p-10 md:p-14 text-center shadow-xl"
      >
        <p class="text-6xl mb-6">✓</p>

        <p class="uppercase tracking-[4px] text-sm text-gray-500 mb-4">
          Order Confirmed
        </p>

        <h1 class="text-4xl md:text-5xl font-bold mb-5">
          Thank you for your order
        </h1>

        <p class="text-gray-500 leading-7 mb-8">
          Your luxury fashion order has been successfully created. This page is
          currently using frontend mock order data and will be connected to the
          backend API later.
        </p>

        <div
          v-if="lastOrder"
          class="bg-[#f8f5f2] rounded-3xl p-6 text-left mb-8 space-y-4"
        >
          <div class="flex justify-between gap-4">
            <span class="text-gray-500">Order Number</span>
            <span class="font-semibold">{{ lastOrder.orderNumber }}</span>
          </div>

          <div class="flex justify-between gap-4">
            <span class="text-gray-500">Customer</span>
            <span class="font-semibold">{{ lastOrder.customer.fullName }}</span>
          </div>

          <div v-if="lastOrder.voucher" class="flex justify-between gap-4">
            <span class="text-gray-500">Voucher</span>

            <span class="font-semibold text-right">
              {{ lastOrder.voucher.code }}
            </span>
          </div>

          <div
            v-if="lastOrder.discountAmount > 0"
            class="flex justify-between gap-4"
          >
            <span class="text-gray-500">Discount</span>

            <span class="font-semibold text-green-600">
              -{{ formatCurrency(lastOrder.discountAmount) }}
            </span>
          </div>

          <div class="flex justify-between gap-4">
            <span class="text-gray-500">Shipping</span>

            <span class="font-semibold">
              {{
                lastOrder.shippingCost === 0
                  ? "Free"
                  : formatCurrency(lastOrder.shippingCost)
              }}
            </span>
          </div>

          <div class="flex justify-between gap-4">
            <span class="text-gray-500">Total</span>
            <span class="font-semibold">{{
              formatCurrency(lastOrder.total)
            }}</span>
          </div>
        </div>

        <div
          class="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <RouterLink
            to="/"
            class="inline-block bg-black text-white px-8 py-4 rounded-full hover:scale-105 transition"
          >
            Continue Shopping
          </RouterLink>

          <RouterLink
            to="/orders"
            class="inline-block border border-black px-8 py-4 rounded-full hover:bg-black hover:text-white transition"
          >
            View Order History
          </RouterLink>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref } from "vue";

import Navbar from "../components/layout/Navbar.vue";
import CartSidebar from "../components/layout/CartSidebar.vue";
import { formatCurrency } from "../utils/formatCurrency";
import Footer from "../components/layout/Footer.vue";

const savedOrder = sessionStorage.getItem("lastOrder");

const lastOrder = ref(savedOrder ? JSON.parse(savedOrder) : null);
</script>
