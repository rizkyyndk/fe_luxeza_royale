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
              Admin Panel
            </p>

            <h1 class="text-4xl md:text-5xl font-bold mb-4 text-luxe-espresso">
              Manage Orders
            </h1>

            <p class="text-luxe-brown/75 max-w-xl leading-7">
              Manage Luxeza Royale customer orders, update payment status, and
              control manual order processing flow.
            </p>
          </div>

          <button
            @click="loadOrders"
            class="border border-luxe-espresso text-luxe-espresso px-6 py-3 rounded-full hover:bg-luxe-espresso hover:text-luxe-ivory transition w-fit"
          >
            Refresh Orders
          </button>
        </div>

        <!-- FILTER BAR -->
        <div
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
                placeholder="Order number, customer, email, phone..."
                class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-full px-5 py-4 outline-none focus:border-luxe-royal transition shadow-sm"
              />
            </div>

            <!-- STATUS -->
            <div>
              <label class="block text-sm text-luxe-brown/75 mb-2">
                Status
              </label>

              <select
                v-model="statusFilter"
                class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso rounded-full px-5 py-4 outline-none focus:border-luxe-royal transition shadow-sm"
              >
                <option
                  v-for="option in statusOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>

            <!-- PERIOD -->
            <div>
              <label class="block text-sm text-luxe-brown/75 mb-2">
                Period
              </label>

              <select
                v-model="periodFilter"
                class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso rounded-full px-5 py-4 outline-none focus:border-luxe-royal transition shadow-sm"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="last-7-days">Last 7 Days</option>
                <option value="last-30-days">Last 30 Days</option>
                <option value="custom">Custom Date</option>
              </select>
            </div>

            <!-- SORT -->
            <div>
              <label class="block text-sm text-luxe-brown/75 mb-2">
                Sort
              </label>

              <select
                v-model="sortOrder"
                class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso rounded-full px-5 py-4 outline-none focus:border-luxe-royal transition shadow-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
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
                {{ filteredOrders.length }}
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
              Please wait while we load admin order data.
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

        <!-- EMPTY -->
        <div
          v-else-if="orders.length === 0"
          class="min-h-[50vh] bg-luxe-cream border border-luxe-sand/60 shadow-[0_18px_60px_rgba(92,56,36,0.10)] rounded-[2rem] flex items-center justify-center text-center px-6"
        >
          <div>
            <p class="text-6xl mb-6">📦</p>

            <h2 class="text-3xl md:text-4xl font-bold mb-4 text-luxe-espresso">
              No orders yet
            </h2>

            <p class="text-luxe-brown/75">
              Customer orders will appear here after checkout.
            </p>
          </div>
        </div>

        <!-- EMPTY FILTER -->
        <div
          v-else-if="filteredOrders.length === 0"
          class="min-h-[45vh] bg-luxe-cream border border-luxe-sand/60 shadow-[0_18px_60px_rgba(92,56,36,0.10)] rounded-[2rem] flex items-center justify-center text-center px-6"
        >
          <div>
            <p class="text-6xl mb-6">🔎</p>

            <h2 class="text-3xl md:text-4xl font-bold mb-4 text-luxe-espresso">
              No matching orders
            </h2>

            <p class="text-luxe-brown/75 mb-8">
              Try changing your status, period, or search keyword.
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
            v-for="order in filteredOrders"
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
            <div class="p-6 md:p-8 grid lg:grid-cols-[1fr_380px] gap-10">
              <!-- LEFT -->
              <div>
                <!-- CUSTOMER -->
                <div
                  class="bg-luxe-ivory border border-luxe-sand/60 rounded-3xl p-6 mb-6 shadow-sm"
                >
                  <h3 class="text-2xl font-bold text-luxe-espresso mb-5">
                    Customer Detail
                  </h3>

                  <div class="space-y-3 text-sm">
                    <div class="flex justify-between gap-4">
                      <span class="text-luxe-brown/70">Name</span>
                      <span class="font-semibold text-luxe-espresso text-right">
                        {{ order.customer?.fullName || "-" }}
                      </span>
                    </div>

                    <div class="flex justify-between gap-4">
                      <span class="text-luxe-brown/70">Email</span>
                      <span class="font-semibold text-luxe-espresso text-right">
                        {{ order.customer?.email || "-" }}
                      </span>
                    </div>

                    <div class="flex justify-between gap-4">
                      <span class="text-luxe-brown/70">Phone</span>
                      <span class="font-semibold text-luxe-espresso text-right">
                        {{ order.customer?.phone || "-" }}
                      </span>
                    </div>
                  </div>

                  <div
                    class="mt-5 bg-luxe-cream border border-luxe-sand/50 rounded-3xl p-5"
                  >
                    <p class="text-sm font-semibold mb-2 text-luxe-espresso">
                      Shipping Address
                    </p>

                    <p class="text-sm text-luxe-brown/75 leading-6">
                      {{ order.customer?.address || "-" }}
                    </p>
                  </div>
                </div>

                <!-- ITEMS -->
                <div>
                  <div class="mb-6 flex items-center justify-between gap-4">
                    <h3 class="text-2xl font-bold text-luxe-espresso">
                      Ordered Items
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
                        <h4
                          class="font-semibold leading-snug text-luxe-espresso"
                        >
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
              </div>

              <!-- RIGHT SUMMARY -->
              <div
                class="bg-luxe-ivory border border-luxe-sand/60 rounded-3xl p-6 h-fit shadow-[0_16px_45px_rgba(92,56,36,0.10)]"
              >
                <h3 class="text-2xl font-bold mb-6 text-luxe-espresso">
                  Admin Summary
                </h3>

                <div class="space-y-4">
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
                    <span class="font-semibold text-luxe-espresso">
                      {{
                        order.shippingCost === 0
                          ? "Free"
                          : formatCurrency(order.shippingCost)
                      }}
                    </span>
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

                <!-- STATUS ACTIONS -->
                <div class="mt-6 border-t border-luxe-sand/60 pt-6">
                  <p class="text-sm font-semibold mb-3 text-luxe-espresso">
                    Update Order Status
                  </p>

                  <div class="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      @click="updateOrderStatus(order, 'paid')"
                      :disabled="
                        updatingOrderCode === order.orderNumber ||
                        order.status === 'paid'
                      "
                      class="px-4 py-3 rounded-full text-sm border border-luxe-sand text-luxe-espresso hover:bg-luxe-cream disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      Mark Paid
                    </button>

                    <button
                      type="button"
                      @click="updateOrderStatus(order, 'processing')"
                      :disabled="
                        updatingOrderCode === order.orderNumber ||
                        order.status === 'processing'
                      "
                      class="px-4 py-3 rounded-full text-sm border border-luxe-sand text-luxe-espresso hover:bg-luxe-cream disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      Processing
                    </button>

                    <button
                      type="button"
                      @click="updateOrderStatus(order, 'completed')"
                      :disabled="
                        updatingOrderCode === order.orderNumber ||
                        order.status === 'completed'
                      "
                      class="px-4 py-3 rounded-full text-sm bg-luxe-espresso text-luxe-ivory hover:bg-luxe-royal disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      Completed
                    </button>

                    <button
                      type="button"
                      @click="updateOrderStatus(order, 'cancelled')"
                      :disabled="
                        updatingOrderCode === order.orderNumber ||
                        order.status === 'cancelled'
                      "
                      class="px-4 py-3 rounded-full text-sm border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      Cancel
                    </button>
                  </div>

                  <p
                    v-if="updatingOrderCode === order.orderNumber"
                    class="text-xs text-luxe-brown/70 mt-3"
                  >
                    Updating order status...
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
import { computed, onMounted, ref } from "vue";

import Navbar from "../components/layout/Navbar.vue";
import CartSidebar from "../components/layout/CartSidebar.vue";
import Footer from "../components/layout/Footer.vue";
import ProductImage from "../components/ui/ProductImage.vue";

import { useToastStore } from "../stores/toastStore";
import { formatCurrency } from "../utils/formatCurrency";
import { orderService } from "../services/orderService";

const toastStore = useToastStore();

const orders = ref([]);
const isLoadingOrders = ref(false);
const orderErrorMessage = ref("");
const updatingOrderCode = ref("");

const searchKeyword = ref("");
const statusFilter = ref("all");
const periodFilter = ref("all");
const sortOrder = ref("newest");
const customStartDate = ref("");
const customEndDate = ref("");

const statusOptions = [
  { label: "All Status", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Paid", value: "paid" },
  { label: "Processing", value: "processing" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
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

const filteredOrders = computed(() => {
  const keyword = searchKeyword.value.toLowerCase().trim();

  let result = orders.value.filter((order) => {
    const orderNumber = String(order.orderNumber || "").toLowerCase();
    const customerName = String(order.customer?.fullName || "").toLowerCase();
    const customerEmail = String(order.customer?.email || "").toLowerCase();
    const customerPhone = String(order.customer?.phone || "").toLowerCase();

    const matchesKeyword =
      !keyword ||
      orderNumber.includes(keyword) ||
      customerName.includes(keyword) ||
      customerEmail.includes(keyword) ||
      customerPhone.includes(keyword);

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

const loadOrders = async () => {
  isLoadingOrders.value = true;
  orderErrorMessage.value = "";

  try {
    orders.value = await orderService.getAdminOrders();
  } catch (error) {
    console.error("Failed to load admin orders:", error);

    orderErrorMessage.value =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to load admin order data.";

    toastStore.showToast({
      title: "Failed to Load Orders",
      message: orderErrorMessage.value,
      type: "error",
    });
  } finally {
    isLoadingOrders.value = false;
  }
};

const updateOrderStatus = async (order, status) => {
  if (!order?.orderNumber || updatingOrderCode.value) return;

  updatingOrderCode.value = order.orderNumber;

  try {
    const updatedOrder = await orderService.updateOrderStatus(
      order.orderNumber,
      status,
    );

    orders.value = orders.value.map((item) =>
      item.orderNumber === order.orderNumber ? updatedOrder : item,
    );

    toastStore.showToast({
      title: "Order Status Updated",
      message: `Order ${order.orderNumber} is now ${formatStatus(status)}.`,
      type: "success",
    });
  } catch (error) {
    console.error("Failed to update order status:", error);

    toastStore.showToast({
      title: "Failed to Update Status",
      message: error?.message || "Unable to update order status.",
      type: "error",
    });
  } finally {
    updatingOrderCode.value = "";
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

const formatStatus = (status) => {
  if (!status) return "Pending";

  return status
    .split("-")
    .join(" ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getStatusClass = (status) => {
  if (status === "paid") {
    return "bg-green-50 text-green-700";
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
