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
              Order History
            </p>

            <h1 class="text-4xl md:text-5xl font-bold mb-4 text-luxe-espresso">
              Your Orders
            </h1>

            <p class="text-luxe-brown/75 max-w-xl leading-7">
              View your completed checkout orders directly from the Luxeza
              Royale backend database.
            </p>
          </div>

          <button
            v-if="orders.length > 0"
            @click="loadOrders"
            class="border border-luxe-espresso text-luxe-espresso px-6 py-3 rounded-full hover:bg-luxe-espresso hover:text-luxe-ivory transition w-fit"
          >
            Refresh Orders
          </button>
        </div>

        <!-- FILTER BAR -->
        <div
          v-if="orders.length > 0"
          class="mb-10 bg-luxe-ivory border border-luxe-sand/70 shadow-[0_18px_60px_rgba(92,56,36,0.10)] rounded-[2rem] p-6"
        >
          <div class="grid lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-4">
            <!-- SEARCH -->
            <div>
              <label class="block text-sm text-luxe-brown/75 mb-2">
                Search Order
              </label>

              <input
                v-model="searchKeyword"
                type="text"
                placeholder="Order number, customer, email..."
                class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-full px-5 py-4 outline-none focus:border-luxe-royal transition shadow-sm"
              />
            </div>

            <!-- STATUS -->
            <div>
              <label class="block text-sm text-luxe-brown/75 mb-2">
                Status
              </label>

              <LuxeSelect
                v-model="statusFilter"
                :options="statusOptions"
                placeholder="Select status"
              />
            </div>

            <!-- PERIOD -->
            <div>
              <label class="block text-sm text-luxe-brown/75 mb-2">
                Period
              </label>

              <LuxeSelect
                v-model="periodFilter"
                :options="periodOptions"
                placeholder="Select period"
              />
            </div>

            <!-- SORT -->
            <div>
              <label class="block text-sm text-luxe-brown/75 mb-2">
                Sort
              </label>

              <LuxeSelect
                v-model="sortOrder"
                :options="sortOptions"
                placeholder="Select sort"
              />
            </div>
          </div>

          <!-- CUSTOM DATE -->
          <div
            v-if="periodFilter === 'custom'"
            class="grid sm:grid-cols-2 gap-4 mt-5"
          >
            <div>
              <label class="block text-sm text-luxe-brown/75 mb-2">
                Start Date
              </label>

              <input
                v-model="customStartDate"
                type="date"
                class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso rounded-full px-5 py-4 outline-none focus:border-luxe-royal transition shadow-sm"
              />
            </div>

            <div>
              <label class="block text-sm text-luxe-brown/75 mb-2">
                End Date
              </label>

              <input
                v-model="customEndDate"
                type="date"
                class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso rounded-full px-5 py-4 outline-none focus:border-luxe-royal transition shadow-sm"
              />
            </div>
          </div>

          <!-- FILTER SUMMARY -->
          <div
            class="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-luxe-sand/60 pt-5"
          >
            <p class="text-sm text-luxe-brown/75">
              Showing
              <span class="font-semibold text-luxe-espresso">
                {{ latestOrders.length }}
              </span>
              of
              <span class="font-semibold text-luxe-espresso">
                {{ orders.length }}
              </span>
              orders
            </p>

            <button
              @click="resetFilters"
              :disabled="!hasActiveFilters"
              :class="
                hasActiveFilters
                  ? 'border-luxe-espresso text-luxe-espresso hover:bg-luxe-espresso hover:text-luxe-ivory'
                  : 'border-luxe-sand/60 text-luxe-brown/40 cursor-not-allowed'
              "
              class="border px-5 py-2 rounded-full text-sm transition w-fit"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <!-- LOADING -->
        <div
          v-if="isLoadingOrders"
          class="min-h-[50vh] bg-luxe-cream border border-luxe-sand/60 shadow-[0_18px_60px_rgba(92,56,36,0.10)] rounded-[2rem] flex items-center justify-center text-center px-6"
        >
          <div>
            <p class="text-6xl mb-6">⏳</p>

            <h2 class="text-3xl md:text-4xl font-bold mb-4 text-luxe-espresso">
              Loading orders...
            </h2>

            <p class="text-luxe-brown/75">
              Please wait while we load your order history.
            </p>
          </div>
        </div>

        <!-- ERROR -->
        <div
          v-else-if="orderErrorMessage"
          class="min-h-[50vh] bg-red-50 border border-red-100 rounded-[2rem] flex items-center justify-center text-center px-6"
        >
          <div>
            <p class="text-6xl mb-6">⚠️</p>

            <h2 class="text-3xl md:text-4xl font-bold mb-4 text-red-700">
              Failed to load orders
            </h2>

            <p class="text-red-500 mb-8">
              {{ orderErrorMessage }}
            </p>

            <button
              @click="loadOrders"
              class="bg-luxe-espresso text-luxe-ivory px-8 py-4 rounded-full inline-block hover:bg-luxe-royal hover:scale-105 transition"
            >
              Try Again
            </button>
          </div>
        </div>

        <!-- EMPTY ALL ORDERS -->
        <div
          v-else-if="orders.length === 0"
          class="min-h-[50vh] bg-luxe-cream border border-luxe-sand/60 shadow-[0_18px_60px_rgba(92,56,36,0.10)] rounded-[2rem] flex items-center justify-center text-center px-6"
        >
          <div>
            <p class="text-6xl mb-6">📦</p>

            <h2 class="text-3xl md:text-4xl font-bold mb-4 text-luxe-espresso">
              No orders yet
            </h2>

            <p class="text-luxe-brown/75 mb-8">
              Your completed checkout orders will appear here.
            </p>

            <RouterLink
              to="/"
              class="bg-luxe-espresso text-luxe-ivory px-8 py-4 rounded-full inline-block hover:bg-luxe-royal hover:scale-105 transition shadow-lg shadow-luxe-brown/20"
            >
              Start Shopping
            </RouterLink>
          </div>
        </div>

        <!-- EMPTY FILTER RESULT -->
        <div
          v-else-if="latestOrders.length === 0"
          class="min-h-[45vh] bg-luxe-cream border border-luxe-sand/60 shadow-[0_18px_60px_rgba(92,56,36,0.10)] rounded-[2rem] flex items-center justify-center text-center px-6"
        >
          <div>
            <p class="text-6xl mb-6">🔎</p>

            <h2 class="text-3xl md:text-4xl font-bold mb-4 text-luxe-espresso">
              No matching orders
            </h2>

            <p class="text-luxe-brown/75 mb-8">
              Try changing your status, date period, or search keyword.
            </p>

            <button
              @click="resetFilters"
              class="bg-luxe-espresso text-luxe-ivory px-8 py-4 rounded-full inline-block hover:bg-luxe-royal hover:scale-105 transition"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <!-- ORDERS -->
        <div v-else class="space-y-8">
          <div
            v-for="order in latestOrders"
            :key="order.orderNumber"
            class="bg-luxe-cream border border-luxe-sand/60 shadow-[0_20px_70px_rgba(92,56,36,0.12)] rounded-[2rem] overflow-hidden"
          >
            <!-- ORDER HEADER -->
            <div
              class="p-6 md:p-8 bg-luxe-espresso text-luxe-ivory flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5"
            >
              <div>
                <p class="text-sm text-luxe-sand mb-2">Order Number</p>

                <h2 class="text-2xl md:text-3xl font-bold">
                  {{ order.orderNumber }}
                </h2>
              </div>

              <div class="flex flex-wrap gap-3">
                <span
                  :class="getStatusClass(order.status)"
                  class="px-4 py-2 rounded-full text-sm font-semibold"
                >
                  {{ formatStatus(order.status) }}
                </span>

                <span
                  class="bg-luxe-ivory/10 border border-luxe-sand/20 px-4 py-2 rounded-full text-sm text-luxe-sand"
                >
                  {{ formatDate(order.createdAt) }}
                </span>
              </div>
            </div>

            <!-- ORDER BODY -->
            <div class="p-6 md:p-8 grid lg:grid-cols-[1fr_360px] gap-10">
              <!-- ITEMS -->
              <div>
                <div class="mb-6 flex items-center justify-between gap-4">
                  <h3 class="text-2xl font-bold text-luxe-espresso">
                    Purchased Items
                  </h3>

                  <p class="text-sm text-luxe-brown/70">
                    {{ getTotalItems(order.items) }} item
                  </p>
                </div>

                <div class="space-y-5">
                  <div
                    v-for="item in order.items"
                    :key="`${order.orderNumber}-${item.id}-${item.size}`"
                    class="bg-luxe-ivory border border-luxe-sand/60 rounded-3xl p-4 flex items-center gap-5 shadow-sm"
                  >
                    <ProductImage
                      :src="item.image"
                      :alt="item.title"
                      class="w-24 h-24 object-cover rounded-2xl"
                    />

                    <div class="flex-1">
                      <h4 class="font-semibold leading-snug text-luxe-espresso">
                        {{ item.title }}
                      </h4>

                      <p class="text-sm text-luxe-brown/70 mt-1">
                        Size: {{ item.size || "-" }}
                      </p>

                      <p class="text-sm text-luxe-brown/70">
                        Qty: {{ item.quantity }}
                      </p>
                    </div>

                    <p class="font-bold text-right text-luxe-espresso">
                      {{ formatCurrency(item.price * item.quantity) }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- SUMMARY -->
              <div
                class="bg-luxe-ivory border border-luxe-sand/60 rounded-3xl p-6 h-fit shadow-[0_16px_45px_rgba(92,56,36,0.10)]"
              >
                <h3 class="text-2xl font-bold mb-6 text-luxe-espresso">
                  Order Summary
                </h3>

                <div class="space-y-4">
                  <div class="flex justify-between gap-4">
                    <span class="text-luxe-brown/70">Customer</span>
                    <span class="font-semibold text-right text-luxe-espresso">
                      {{ order.customer?.fullName }}
                    </span>
                  </div>

                  <div class="flex justify-between gap-4">
                    <span class="text-luxe-brown/70">Subtotal</span>
                    <span class="font-semibold text-luxe-espresso">
                      {{ formatCurrency(order.subtotal) }}
                    </span>
                  </div>

                  <div v-if="order.voucher" class="flex justify-between gap-4">
                    <span class="text-luxe-brown/70">Voucher</span>
                    <span class="font-semibold text-right text-luxe-espresso">
                      {{ order.voucher.code }}
                    </span>
                  </div>

                  <div
                    v-if="order.discountAmount > 0"
                    class="flex justify-between gap-4"
                  >
                    <span class="text-luxe-brown/70">Discount</span>
                    <span class="font-semibold text-green-600">
                      -{{ formatCurrency(order.discountAmount) }}
                    </span>
                  </div>

                  <div class="flex justify-between gap-4">
                    <span class="text-luxe-brown/70">Shipping</span>

                    <div class="text-right">
                      <p class="font-semibold text-luxe-espresso">
                        {{
                          Number(order.shippingCost || 0) === 0
                            ? "Free"
                            : formatCurrency(order.shippingCost)
                        }}
                      </p>

                      <p
                        v-if="getShippingCourierLabel(order)"
                        class="text-sm text-luxe-brown/70 mt-1"
                      >
                        {{ getShippingCourierLabel(order) }}
                      </p>

                      <p
                        v-if="getShippingDestinationLabel(order)"
                        class="text-xs text-luxe-brown/60 mt-1 max-w-[240px]"
                      >
                        {{ getShippingDestinationLabel(order) }}
                      </p>
                    </div>
                  </div>

                  <div class="flex justify-between gap-4">
                    <span class="text-luxe-brown/70">Payment</span>
                    <span class="font-semibold text-right text-luxe-espresso">
                      {{ formatPaymentMethod(order.paymentMethod) }}
                    </span>
                  </div>

                  <div
                    class="border-t border-luxe-sand/60 pt-5 flex justify-between gap-4"
                  >
                    <span class="text-lg text-luxe-espresso">Total</span>
                    <span class="text-2xl font-bold text-luxe-espresso">
                      {{ formatCurrency(order.total) }}
                    </span>
                  </div>
                </div>

                <AddressSummaryCard
                  :customer="order.customer || {}"
                  title="Shipping Address"
                  eyebrow="Delivery Information"
                  class="mt-6"
                />

                <!-- SHIPPING COURIER DETAIL -->
                <div
                  v-if="hasShippingDetail(order)"
                  class="mt-6 bg-luxe-cream border border-luxe-sand/50 rounded-3xl p-5"
                >
                  <p class="text-sm font-semibold text-luxe-espresso mb-4">
                    Shipping Courier
                  </p>

                  <div class="space-y-3">
                    <div
                      v-if="getShippingCourierLabel(order)"
                      class="flex justify-between gap-4"
                    >
                      <span class="text-luxe-brown/70">Courier</span>

                      <span class="font-semibold text-luxe-espresso text-right">
                        {{ getShippingCourierLabel(order) }}
                      </span>
                    </div>

                    <div
                      v-if="getShippingDestinationLabel(order)"
                      class="flex justify-between gap-4"
                    >
                      <span class="text-luxe-brown/70">Destination</span>

                      <span
                        class="font-semibold text-luxe-espresso text-right max-w-[240px]"
                      >
                        {{ getShippingDestinationLabel(order) }}
                      </span>
                    </div>

                    <div
                      v-if="getShippingEtdLabel(order)"
                      class="flex justify-between gap-4"
                    >
                      <span class="text-luxe-brown/70">Estimated Delivery</span>

                      <span class="font-semibold text-luxe-espresso text-right">
                        {{ getShippingEtdLabel(order) }}
                      </span>
                    </div>

                    <div class="flex justify-between gap-4">
                      <span class="text-luxe-brown/70">Shipping Cost</span>

                      <span class="font-semibold text-luxe-espresso text-right">
                        {{
                          Number(order.shippingCost || 0) === 0
                            ? "Free"
                            : formatCurrency(order.shippingCost)
                        }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- PAYMENT PROOF -->
                <div
                  class="mt-6 bg-luxe-cream border border-luxe-sand/50 rounded-3xl p-5"
                >
                  <div
                    class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
                  >
                    <div>
                      <p class="text-sm font-semibold text-luxe-espresso mb-2">
                        Payment Confirmation
                      </p>

                      <p
                        v-if="order.paymentProofUrl"
                        class="text-sm text-luxe-brown/75 leading-6"
                      >
                        Payment proof has been submitted and is waiting for
                        admin review.
                      </p>

                      <p
                        v-else-if="order.status === 'paid'"
                        class="text-sm text-green-700 leading-6"
                      >
                        Payment has been verified.
                      </p>

                      <p v-else class="text-sm text-luxe-brown/75 leading-6">
                        Upload your transfer receipt or QRIS payment screenshot
                        here.
                      </p>
                    </div>

                    <span
                      v-if="order.paymentProofUrl"
                      class="bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-xs font-semibold w-fit"
                    >
                      Waiting Review
                    </span>

                    <span
                      v-else-if="order.status === 'paid'"
                      class="bg-green-50 text-green-700 px-4 py-2 rounded-full text-xs font-semibold w-fit"
                    >
                      Paid
                    </span>

                    <span
                      v-else
                      class="bg-red-50 text-red-700 px-4 py-2 rounded-full text-xs font-semibold w-fit"
                    >
                      Waiting Proof
                    </span>
                  </div>

                  <!-- EXISTING PROOF -->
                  <div
                    v-if="order.paymentProofUrl"
                    class="mt-5 bg-luxe-ivory border border-luxe-sand/60 rounded-2xl p-4"
                  >
                    <p class="text-sm font-semibold text-luxe-espresso mb-3">
                      Uploaded Proof
                    </p>

                    <a
                      :href="order.paymentProofUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-block"
                    >
                      <img
                        :src="order.paymentProofUrl"
                        alt="Payment proof"
                        class="w-40 h-40 object-cover rounded-2xl border border-luxe-sand/60 bg-luxe-cream"
                      />
                    </a>

                    <p
                      v-if="order.paymentProofUploadedAt"
                      class="text-xs text-luxe-brown/60 mt-3"
                    >
                      Uploaded at {{ formatDate(order.paymentProofUploadedAt) }}
                    </p>
                  </div>

                  <!-- UPLOAD FORM -->
                  <div
                    v-else-if="canUploadPaymentProof(order)"
                    class="mt-5 bg-luxe-ivory border border-dashed border-luxe-sand rounded-2xl p-4"
                  >
                    <div class="flex flex-col gap-4">
                      <div
                        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                      >
                        <div>
                          <p class="font-semibold text-luxe-espresso">
                            Upload payment proof image
                          </p>

                          <p class="text-sm text-luxe-brown/70 mt-1">
                            JPG, PNG, or WEBP only. Maximum 5 MB.
                          </p>
                        </div>

                        <label
                          class="inline-flex items-center justify-center bg-luxe-espresso text-luxe-ivory px-5 py-3 rounded-full cursor-pointer hover:bg-luxe-royal transition w-fit"
                        >
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            class="hidden"
                            @change="handlePaymentProofChange($event, order)"
                          />

                          Choose Image
                        </label>
                      </div>

                      <div
                        v-if="paymentProofFiles[getOrderKey(order)]"
                        class="bg-luxe-cream border border-luxe-sand/60 rounded-2xl p-4"
                      >
                        <div class="flex items-start justify-between gap-4">
                          <div>
                            <p class="font-semibold text-luxe-espresso">
                              {{ paymentProofFiles[getOrderKey(order)].name }}
                            </p>

                            <p class="text-sm text-luxe-brown/70 mt-1">
                              {{
                                (
                                  paymentProofFiles[getOrderKey(order)].size /
                                  1024 /
                                  1024
                                ).toFixed(2)
                              }}
                              MB
                            </p>
                          </div>

                          <button
                            @click="removePaymentProof(order)"
                            type="button"
                            class="text-red-600 hover:text-red-700 text-sm font-semibold"
                          >
                            Remove
                          </button>
                        </div>

                        <img
                          v-if="paymentProofPreviews[getOrderKey(order)]"
                          :src="paymentProofPreviews[getOrderKey(order)]"
                          alt="Payment proof preview"
                          class="mt-4 w-40 h-40 object-cover rounded-2xl border border-luxe-sand/60 bg-luxe-ivory"
                        />

                        <button
                          @click="uploadPaymentProof(order)"
                          :disabled="isUploadingPaymentProof(order)"
                          type="button"
                          class="mt-5 w-full bg-luxe-espresso text-luxe-ivory py-4 rounded-full hover:bg-luxe-royal disabled:opacity-60 disabled:cursor-not-allowed transition"
                        >
                          {{
                            isUploadingPaymentProof(order)
                              ? "Uploading Proof..."
                              : "Submit Payment Proof"
                          }}
                        </button>
                      </div>

                      <p
                        v-if="paymentProofErrors[getOrderKey(order)]"
                        class="text-red-500 text-sm"
                      >
                        {{ paymentProofErrors[getOrderKey(order)] }}
                      </p>
                    </div>
                  </div>
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
import { computed, onMounted, ref } from "vue";

import Navbar from "../components/layout/Navbar.vue";
import CartSidebar from "../components/layout/CartSidebar.vue";
import Footer from "../components/layout/Footer.vue";
import ProductImage from "../components/ui/ProductImage.vue";
import AddressSummaryCard from "../components/order/AddressSummaryCard.vue";

import { useToastStore } from "../stores/toastStore";
import { formatCurrency } from "../utils/formatCurrency";
import { orderService } from "../services/orderService";
import LuxeSelect from "../components/ui/LuxeSelect.vue";
const toastStore = useToastStore();

const orders = ref([]);
const isLoadingOrders = ref(false);
const orderErrorMessage = ref("");

const searchKeyword = ref("");
const statusFilter = ref("all");
const periodFilter = ref("all");
const sortOrder = ref("newest");
const customStartDate = ref("");
const customEndDate = ref("");
const paymentProofFiles = ref({});
const paymentProofPreviews = ref({});
const paymentProofErrors = ref({});
const uploadingPaymentProofOrderNumbers = ref([]);

const periodOptions = [
  {
    label: "All Time",
    value: "all",
  },
  {
    label: "Today",
    value: "today",
  },
  {
    label: "Last 7 Days",
    value: "last-7-days",
  },
  {
    label: "Last 30 Days",
    value: "last-30-days",
  },
  {
    label: "Custom Date",
    value: "custom",
  },
];

const sortOptions = [
  {
    label: "Newest First",
    value: "newest",
  },
  {
    label: "Oldest First",
    value: "oldest",
  },
];

const statusOptions = [
  {
    label: "All Status",
    value: "all",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Payment Submitted",
    value: "payment_submitted",
  },
  {
    label: "Processing",
    value: "processing",
  },
  {
    label: "Paid",
    value: "paid",
  },
  {
    label: "Completed",
    value: "completed",
  },
  {
    label: "Cancelled",
    value: "cancelled",
  },
];

const hasActiveFilters = computed(() => {
  return (
    searchKeyword.value.trim() !== "" ||
    statusFilter.value !== "all" ||
    periodFilter.value !== "all" ||
    sortOrder.value !== "newest" ||
    customStartDate.value !== "" ||
    customEndDate.value !== ""
  );
});

const latestOrders = computed(() => {
  const keyword = searchKeyword.value.toLowerCase().trim();

  let result = orders.value.filter((order) => {
    const orderNumber = String(order.orderNumber || "").toLowerCase();
    const customerName = String(order.customer?.fullName || "").toLowerCase();
    const customerEmail = String(order.customer?.email || "").toLowerCase();
    const customerPhone = String(order.customer?.phone || "").toLowerCase();

    const customerAddress = [
      order.customer?.address,
      order.customer?.addressDetail,
      order.customer?.village,
      order.customer?.district,
      order.customer?.city,
      order.customer?.province,
      order.customer?.postalCode,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const shippingInfo = [
      getShippingCourierLabel(order),
      getShippingDestinationLabel(order),
      getShippingEtdLabel(order),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesKeyword =
      !keyword ||
      orderNumber.includes(keyword) ||
      customerName.includes(keyword) ||
      customerEmail.includes(keyword) ||
      customerPhone.includes(keyword) ||
      customerAddress.includes(keyword) ||
      shippingInfo.includes(keyword);

    const orderStatus = String(order.status || "").toLowerCase();

    const matchesStatus =
      statusFilter.value === "all" || orderStatus === statusFilter.value;

    const matchesPeriod = isOrderWithinPeriod(order.createdAt);

    return matchesKeyword && matchesStatus && matchesPeriod;
  });

  result = [...result].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();

    return sortOrder.value === "oldest" ? dateA - dateB : dateB - dateA;
  });

  return result;
});

const getOrderKey = (order) => {
  return order.orderNumber || order.order_code || order.id;
};

const canUploadPaymentProof = (order) => {
  const status = String(order.status || "pending").toLowerCase();

  return (
    order &&
    getOrderKey(order) &&
    !order.hasPaymentProof &&
    !order.paymentProofUrl &&
    status === "pending"
  );
};

const isUploadingPaymentProof = (order) => {
  return uploadingPaymentProofOrderNumbers.value.includes(getOrderKey(order));
};

const handlePaymentProofChange = (event, order) => {
  const file = event.target.files?.[0];
  const orderKey = getOrderKey(order);

  event.target.value = "";

  paymentProofFiles.value = {
    ...paymentProofFiles.value,
    [orderKey]: null,
  };

  paymentProofPreviews.value = {
    ...paymentProofPreviews.value,
    [orderKey]: "",
  };

  paymentProofErrors.value = {
    ...paymentProofErrors.value,
    [orderKey]: "",
  };

  if (!file) return;

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    paymentProofErrors.value = {
      ...paymentProofErrors.value,
      [orderKey]: "Payment proof must be JPG, PNG, or WEBP image.",
    };

    toastStore.showToast({
      title: "Invalid File",
      message: "Payment proof must be JPG, PNG, or WEBP image.",
      type: "error",
    });

    return;
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    paymentProofErrors.value = {
      ...paymentProofErrors.value,
      [orderKey]: "Maximum payment proof size is 5 MB.",
    };

    toastStore.showToast({
      title: "File Too Large",
      message: "Maximum payment proof size is 5 MB.",
      type: "error",
    });

    return;
  }

  paymentProofFiles.value = {
    ...paymentProofFiles.value,
    [orderKey]: file,
  };

  paymentProofPreviews.value = {
    ...paymentProofPreviews.value,
    [orderKey]: URL.createObjectURL(file),
  };
};

const removePaymentProof = (order) => {
  const orderKey = getOrderKey(order);

  paymentProofFiles.value = {
    ...paymentProofFiles.value,
    [orderKey]: null,
  };

  paymentProofPreviews.value = {
    ...paymentProofPreviews.value,
    [orderKey]: "",
  };

  paymentProofErrors.value = {
    ...paymentProofErrors.value,
    [orderKey]: "",
  };
};

const updateOrderInList = (updatedOrder) => {
  orders.value = orders.value.map((order) => {
    const currentKey = getOrderKey(order);
    const updatedKey = getOrderKey(updatedOrder);

    return currentKey === updatedKey ? updatedOrder : order;
  });
};

const uploadPaymentProof = async (order) => {
  const orderKey = getOrderKey(order);
  const file = paymentProofFiles.value[orderKey];

  if (!file || isUploadingPaymentProof(order)) return;

  uploadingPaymentProofOrderNumbers.value = [
    ...uploadingPaymentProofOrderNumbers.value,
    orderKey,
  ];

  paymentProofErrors.value = {
    ...paymentProofErrors.value,
    [orderKey]: "",
  };

  try {
    const updatedOrder = await orderService.uploadPaymentProof(orderKey, file);

    updateOrderInList(updatedOrder);
    removePaymentProof(updatedOrder);

    toastStore.showToast({
      title: "Payment Proof Uploaded",
      message:
        "Your payment proof has been submitted and is waiting for admin review.",
      type: "success",
    });
  } catch (error) {
    paymentProofErrors.value = {
      ...paymentProofErrors.value,
      [orderKey]: error?.message || "Failed to upload payment proof.",
    };

    toastStore.showToast({
      title: "Upload Failed",
      message: error?.message || "Failed to upload payment proof.",
      type: "error",
    });
  } finally {
    uploadingPaymentProofOrderNumbers.value =
      uploadingPaymentProofOrderNumbers.value.filter(
        (item) => item !== orderKey,
      );
  }
};

const loadOrders = async () => {
  isLoadingOrders.value = true;
  orderErrorMessage.value = "";

  try {
    orders.value = await orderService.getOrders();
  } catch (error) {
    console.error("Failed to load orders:", error);

    orderErrorMessage.value =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to load order history.";

    toastStore.showToast({
      title: "Failed to Load Orders",
      message: orderErrorMessage.value,
      type: "error",
    });
  } finally {
    isLoadingOrders.value = false;
  }
};

const isSameDate = (dateA, dateB) => {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
};

const isOrderWithinPeriod = (createdAt) => {
  if (periodFilter.value === "all") return true;
  if (!createdAt) return false;

  const orderDate = new Date(createdAt);

  if (Number.isNaN(orderDate.getTime())) return false;

  const now = new Date();

  if (periodFilter.value === "today") {
    return isSameDate(orderDate, now);
  }

  if (periodFilter.value === "last-7-days") {
    const startDate = new Date();
    startDate.setDate(now.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);

    return orderDate >= startDate && orderDate <= now;
  }

  if (periodFilter.value === "last-30-days") {
    const startDate = new Date();
    startDate.setDate(now.getDate() - 30);
    startDate.setHours(0, 0, 0, 0);

    return orderDate >= startDate && orderDate <= now;
  }

  if (periodFilter.value === "custom") {
    if (!customStartDate.value && !customEndDate.value) return true;

    const startDate = customStartDate.value
      ? new Date(`${customStartDate.value}T00:00:00`)
      : null;

    const endDate = customEndDate.value
      ? new Date(`${customEndDate.value}T23:59:59`)
      : null;

    if (startDate && orderDate < startDate) return false;
    if (endDate && orderDate > endDate) return false;

    return true;
  }

  return true;
};

const resetFilters = () => {
  searchKeyword.value = "";
  statusFilter.value = "all";
  periodFilter.value = "all";
  sortOrder.value = "newest";
  customStartDate.value = "";
  customEndDate.value = "";
};

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
  if (method === "qris-main") return "QRIS GoPay Merchant";
  if (method === "bca-001") return "Bank BCA";

  return method || "-";
};

const getRawOrder = (order) => {
  return order?.raw || order?.backendOrder || order || {};
};

const formatCourierName = (value) => {
  const text = String(value || "").trim();

  if (!text) return "";

  const lowerText = text.toLowerCase();

  if (lowerText === "jnt") return "J&T";
  if (lowerText === "jne") return "JNE";

  return text.toUpperCase();
};

const getShippingCourierLabel = (order) => {
  const rawOrder = getRawOrder(order);

  const courier =
    order.shippingCourier ||
    order.shipping_courier ||
    rawOrder.shipping_courier ||
    "";

  const courierName =
    order.shippingRate?.name ||
    rawOrder.shipping_rate?.name ||
    formatCourierName(courier);

  const service =
    order.shippingService ||
    order.shipping_service ||
    rawOrder.shipping_service ||
    order.shippingRate?.service ||
    "";

  return [courierName, service].filter(Boolean).join(" ");
};

const getShippingDestinationLabel = (order) => {
  const rawOrder = getRawOrder(order);

  return (
    order.shippingDestinationLabel ||
    order.shipping_destination_label ||
    rawOrder.shipping_destination_label ||
    order.shippingDestination?.label ||
    ""
  );
};

const getShippingEtdLabel = (order) => {
  const rawOrder = getRawOrder(order);

  const etd =
    order.shippingEtd ||
    order.shipping_etd ||
    rawOrder.shipping_etd ||
    order.shippingRate?.etd ||
    "";

  return etd ? `${etd} hari` : "";
};

const hasShippingDetail = (order) => {
  return Boolean(
    getShippingCourierLabel(order) ||
    getShippingDestinationLabel(order) ||
    getShippingEtdLabel(order),
  );
};

const formatStatus = (status) => {
  if (!status) return "Pending";

  if (status === "payment_submitted") {
    return "Payment Submitted";
  }

  return status
    .split(/[-_]/)
    .join(" ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getStatusClass = (status) => {
  if (status === "paid") {
    return "bg-green-50 text-green-700";
  }

  if (status === "payment_submitted") {
    return "bg-amber-50 text-amber-700";
  }

  if (status === "cancelled") {
    return "bg-red-50 text-red-700";
  }

  if (status === "processing") {
    return "bg-blue-50 text-blue-700";
  }

  if (status === "completed") {
    return "bg-luxe-gold text-luxe-espresso";
  }

  return "bg-luxe-ivory text-luxe-espresso";
};

onMounted(() => {
  loadOrders();
});
</script>
