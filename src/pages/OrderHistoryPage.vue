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
              Order History
            </p>

            <h1 class="text-4xl md:text-5xl font-bold mb-4">
              Your Mock Orders
            </h1>

            <p class="text-gray-500 max-w-xl leading-7">
              This page stores frontend mock order history using sessionStorage.
              Later, this data can be replaced with real backend order data from
              Spring Boot API.
            </p>
          </div>

          <button
            v-if="!orderStore.isEmpty"
            @click="clearOrderHistory"
            class="border border-black px-6 py-3 rounded-full hover:bg-black hover:text-white transition w-fit"
          >
            Clear History
          </button>
        </div>

        <!-- EMPTY -->
        <div
          v-if="orderStore.isEmpty"
          class="min-h-[50vh] bg-[#f8f5f2] rounded-[2rem] flex items-center justify-center text-center px-6"
        >
          <div>
            <p class="text-6xl mb-6">📦</p>

            <h2 class="text-3xl md:text-4xl font-bold mb-4">No orders yet</h2>

            <p class="text-gray-500 mb-8">
              Your completed mock checkout orders will appear here.
            </p>

            <RouterLink
              to="/"
              class="bg-black text-white px-8 py-4 rounded-full inline-block hover:scale-105 transition"
            >
              Start Shopping
            </RouterLink>
          </div>
        </div>

        <!-- ORDERS -->
        <div v-else class="space-y-8">
          <div
            v-for="order in orderStore.latestOrders"
            :key="order.orderNumber"
            class="bg-[#f8f5f2] rounded-[2rem] overflow-hidden"
          >
            <!-- ORDER HEADER -->
            <div
              class="p-6 md:p-8 bg-black text-white flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5"
            >
              <div>
                <p class="text-sm text-gray-400 mb-2">Order Number</p>

                <h2 class="text-2xl md:text-3xl font-bold">
                  {{ order.orderNumber }}
                </h2>
              </div>

              <div class="flex flex-wrap gap-3">
                <span
                  class="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold"
                >
                  {{ order.status || "Processing" }}
                </span>

                <span class="bg-white/10 px-4 py-2 rounded-full text-sm">
                  {{ formatDate(order.createdAt) }}
                </span>
              </div>
            </div>

            <!-- ORDER BODY -->
            <div class="p-6 md:p-8 grid lg:grid-cols-[1fr_360px] gap-10">
              <!-- ITEMS -->
              <div>
                <div class="mb-6 flex items-center justify-between gap-4">
                  <h3 class="text-2xl font-bold">Purchased Items</h3>

                  <p class="text-sm text-gray-500">
                    {{ getTotalItems(order.items) }} item
                  </p>
                </div>

                <div class="space-y-5">
                  <div
                    v-for="item in order.items"
                    :key="`${order.orderNumber}-${item.id}-${item.size}`"
                    class="bg-white rounded-3xl p-4 flex items-center gap-5"
                  >
                    <ProductImage
                      :src="item.image"
                      :alt="item.title"
                      class="w-24 h-24 object-cover rounded-2xl"
                    />

                    <div class="flex-1">
                      <h4 class="font-semibold leading-snug">
                        {{ item.title }}
                      </h4>

                      <p class="text-sm text-gray-500 mt-1">
                        Size: {{ item.size }}
                      </p>

                      <p class="text-sm text-gray-500">
                        Qty: {{ item.quantity }}
                      </p>
                    </div>

                    <p class="font-bold text-right">
                      {{ formatCurrency(item.price * item.quantity) }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- SUMMARY -->
              <div class="bg-white rounded-3xl p-6 h-fit">
                <h3 class="text-2xl font-bold mb-6">Order Summary</h3>

                <div class="space-y-4">
                  <div class="flex justify-between gap-4">
                    <span class="text-gray-500">Customer</span>
                    <span class="font-semibold text-right">
                      {{ order.customer?.fullName }}
                    </span>
                  </div>

                  <div class="flex justify-between gap-4">
                    <span class="text-gray-500">Subtotal</span>
                    <span class="font-semibold">
                      {{ formatCurrency(order.subtotal) }}
                    </span>
                  </div>

                  <div v-if="order.voucher" class="flex justify-between gap-4">
                    <span class="text-gray-500">Voucher</span>
                    <span class="font-semibold text-right">
                      {{ order.voucher.code }}
                    </span>
                  </div>

                  <div
                    v-if="order.discountAmount > 0"
                    class="flex justify-between gap-4"
                  >
                    <span class="text-gray-500">Discount</span>
                    <span class="font-semibold text-green-600">
                      -{{ formatCurrency(order.discountAmount) }}
                    </span>
                  </div>

                  <div class="flex justify-between gap-4">
                    <span class="text-gray-500">Shipping</span>
                    <span class="font-semibold">
                      {{
                        order.shippingCost === 0
                          ? "Free"
                          : formatCurrency(order.shippingCost)
                      }}
                    </span>
                  </div>

                  <div class="flex justify-between gap-4">
                    <span class="text-gray-500">Payment</span>
                    <span class="font-semibold text-right">
                      {{ formatPaymentMethod(order.paymentMethod) }}
                    </span>
                  </div>

                  <div
                    class="border-t border-gray-100 pt-5 flex justify-between gap-4"
                  >
                    <span class="text-lg">Total</span>
                    <span class="text-2xl font-bold">
                      {{ formatCurrency(order.total) }}
                    </span>
                  </div>
                </div>

                <div class="mt-6 bg-[#f8f5f2] rounded-3xl p-5">
                  <p class="text-sm font-semibold mb-2">Shipping Address</p>

                  <p class="text-sm text-gray-500 leading-6">
                    {{ order.customer?.address }}
                  </p>
                </div>
              </div>
            </div>
          </div>
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
import ProductImage from "../components/ui/ProductImage.vue";

import { useOrderStore } from "../stores/orderStore";
import { useToastStore } from "../stores/toastStore";
import { formatCurrency } from "../utils/formatCurrency";

const orderStore = useOrderStore();
const toastStore = useToastStore();

const formatDate = (date) => {
  if (!date) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
};

const getTotalItems = (items = []) => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

const formatPaymentMethod = (method) => {
  if (method === "bank-transfer") return "Bank Transfer";
  if (method === "virtual-account") return "Virtual Account";

  return method || "-";
};

const clearOrderHistory = () => {
  orderStore.clearOrders();

  toastStore.showToast({
    title: "Order History Cleared",
    message: "All mock order history has been removed.",
    type: "info",
  });
};
</script>
