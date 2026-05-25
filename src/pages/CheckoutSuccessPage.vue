<template>
  <div>
    <Navbar />
    <CartSidebar />

    <section
      class="min-h-screen pt-36 pb-24 px-6 flex items-center justify-center"
    >
      <div
        class="max-w-3xl w-full bg-luxe-ivory border border-luxe-sand/70 rounded-[2rem] p-8 md:p-12 text-center shadow-[0_24px_90px_rgba(92,56,36,0.16)]"
      >
        <!-- SUCCESS ICON -->
        <div
          class="w-20 h-20 mx-auto mb-6 rounded-full bg-luxe-espresso text-luxe-ivory flex items-center justify-center text-4xl shadow-lg shadow-luxe-brown/20"
        >
          ✓
        </div>

        <p class="uppercase tracking-[4px] text-sm text-luxe-brown mb-4">
          Order Created
        </p>

        <h1 class="text-4xl md:text-5xl font-bold mb-5 text-luxe-espresso">
          Thank you for your order
        </h1>

        <p class="text-luxe-brown/75 leading-7 mb-8 max-w-2xl mx-auto">
          Your Luxeza Royale order has been successfully created through the
          backend system. Please complete your payment based on the selected
          payment method.
        </p>

        <!-- ORDER SUMMARY -->
        <div
          v-if="lastOrder"
          class="bg-luxe-cream border border-luxe-sand/60 rounded-3xl p-6 text-left mb-8 space-y-4"
        >
          <div class="flex justify-between gap-4">
            <span class="text-luxe-brown/70">Order Number</span>
            <span class="font-semibold text-luxe-espresso text-right">
              {{ lastOrder.orderNumber || lastOrder.order_code || "-" }}
            </span>
          </div>

          <div class="flex justify-between gap-4">
            <span class="text-luxe-brown/70">Status</span>
            <span
              class="font-semibold bg-luxe-ivory text-luxe-espresso px-3 py-1 rounded-full text-sm"
            >
              {{ formatStatus(lastOrder.status) }}
            </span>
          </div>

          <div class="flex justify-between gap-4">
            <span class="text-luxe-brown/70">Customer</span>
            <span class="font-semibold text-luxe-espresso text-right">
              {{ lastOrder.customer?.fullName || "-" }}
            </span>
          </div>

          <div v-if="lastOrder.voucher" class="flex justify-between gap-4">
            <span class="text-luxe-brown/70">Voucher</span>

            <span class="font-semibold text-luxe-espresso text-right">
              {{ lastOrder.voucher.code }}
            </span>
          </div>

          <div
            v-if="Number(lastOrder.discountAmount || 0) > 0"
            class="flex justify-between gap-4"
          >
            <span class="text-luxe-brown/70">Discount</span>

            <span class="font-semibold text-green-600">
              -{{ formatCurrency(lastOrder.discountAmount) }}
            </span>
          </div>

          <div class="flex justify-between gap-4">
            <span class="text-luxe-brown/70">Shipping</span>

            <span class="font-semibold text-luxe-espresso">
              {{
                Number(lastOrder.shippingCost || 0) === 0
                  ? "Free"
                  : formatCurrency(lastOrder.shippingCost)
              }}
            </span>
          </div>

          <div class="flex justify-between gap-4">
            <span class="text-luxe-brown/70">Payment</span>

            <span class="font-semibold text-luxe-espresso text-right">
              {{ formatPaymentMethod(lastOrder.paymentMethod) }}
            </span>
          </div>

          <div
            class="border-t border-luxe-sand/60 pt-5 flex justify-between gap-4"
          >
            <span class="text-lg text-luxe-espresso">Total Payment</span>

            <span class="text-2xl font-bold text-luxe-espresso">
              {{ formatCurrency(lastOrder.total || 0) }}
            </span>
          </div>
        </div>

        <!-- PAYMENT INSTRUCTION -->
        <div
          class="bg-luxe-ivory border border-luxe-sand/70 rounded-3xl p-6 text-left mb-8 shadow-sm"
        >
          <div class="flex items-start gap-4">
            <div
              class="w-11 h-11 rounded-full bg-luxe-cream text-luxe-espresso flex items-center justify-center text-xl shrink-0"
            >
              💳
            </div>

            <div>
              <h2 class="text-xl font-bold text-luxe-espresso mb-2">
                Payment Instruction
              </h2>

              <p class="text-luxe-brown/75 leading-7">
                Please complete the payment using your selected method. For the
                current MVP flow, payment confirmation can be handled manually
                by the admin after the customer sends proof of payment.
              </p>

              <p class="text-luxe-brown/75 leading-7 mt-3">
                If you use QRIS, scan the merchant QRIS and pay according to the
                total amount above before the QRIS expires.
              </p>
            </div>
          </div>
        </div>

        <!-- ACTION BUTTONS -->
        <div
          class="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <RouterLink
            to="/"
            class="inline-block bg-luxe-espresso text-luxe-ivory px-8 py-4 rounded-full hover:bg-luxe-royal hover:scale-105 transition shadow-lg shadow-luxe-brown/20"
          >
            Continue Shopping
          </RouterLink>

          <RouterLink
            to="/orders"
            class="inline-block border border-luxe-espresso text-luxe-espresso px-8 py-4 rounded-full hover:bg-luxe-espresso hover:text-luxe-ivory transition"
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
import Footer from "../components/layout/Footer.vue";

import { formatCurrency } from "../utils/formatCurrency";

const loadLastOrder = () => {
  try {
    const savedOrder = sessionStorage.getItem("lastOrder");
    return savedOrder ? JSON.parse(savedOrder) : null;
  } catch (error) {
    console.error("Failed to load last order:", error);
    return null;
  }
};

const lastOrder = ref(loadLastOrder());

const formatPaymentMethod = (method) => {
  if (method === "bank-transfer") return "Bank Transfer";
  if (method === "virtual-account") return "Virtual Account";

  return method || "-";
};

const formatStatus = (status) => {
  if (!status) return "Pending";

  return status
    .split("-")
    .join(" ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};
</script>
