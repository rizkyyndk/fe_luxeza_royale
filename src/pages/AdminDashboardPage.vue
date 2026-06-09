<template>
  <div>
    <Navbar />
    <CartSidebar />

    <section class="pt-36 pb-24 px-6">
      <div class="max-w-7xl mx-auto">
        <!-- HEADER -->
        <div
          class="mb-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
        >
          <div>
            <p class="uppercase tracking-[4px] text-sm text-luxe-brown mb-4">
              Admin Dashboard
            </p>

            <h1 class="text-4xl md:text-5xl font-bold text-luxe-espresso mb-4">
              Ringkasan Luxeza Royale
            </h1>

            <p class="text-luxe-brown/75 max-w-2xl leading-7">
              Pantau performa toko, pesanan terbaru, pendapatan, produk aktif,
              voucher, dan stok menipis dari satu halaman utama admin.
            </p>
          </div>

          <button
            @click="loadDashboard"
            type="button"
            :disabled="isLoading"
            class="border border-luxe-espresso text-luxe-espresso px-7 py-4 rounded-full hover:bg-luxe-espresso hover:text-luxe-ivory disabled:opacity-50 disabled:cursor-not-allowed transition w-fit"
          >
            {{ isLoading ? "Memuat..." : "Muat Ulang Dashboard" }}
          </button>
        </div>

        <!-- LOADING -->
        <div
          v-if="isLoading"
          class="min-h-[420px] bg-luxe-ivory border border-luxe-sand/70 rounded-[2rem] flex items-center justify-center text-center shadow-[0_18px_60px_rgba(92,56,36,0.10)]"
        >
          <div>
            <div
              class="w-12 h-12 mx-auto mb-5 border-4 border-luxe-sand border-t-luxe-espresso rounded-full animate-spin"
            ></div>

            <h2 class="text-3xl font-bold text-luxe-espresso mb-3">
              Memuat dashboard...
            </h2>

            <p class="text-luxe-brown/75">
              Data ringkasan toko sedang diambil dari server.
            </p>
          </div>
        </div>

        <!-- ERROR -->
        <div
          v-else-if="errorMessage"
          class="min-h-[420px] bg-red-50 border border-red-100 rounded-[2rem] flex items-center justify-center text-center px-6"
        >
          <div>
            <p class="text-6xl mb-6">⚠️</p>

            <h2 class="text-3xl md:text-4xl font-bold mb-4 text-red-700">
              Dashboard belum dapat dimuat
            </h2>

            <p class="text-red-500 mb-8">
              {{ errorMessage }}
            </p>

            <button
              @click="loadDashboard"
              class="bg-luxe-espresso text-luxe-ivory px-8 py-4 rounded-full inline-block hover:bg-luxe-royal transition"
            >
              Coba Lagi
            </button>
          </div>
        </div>

        <template v-else>
          <!-- MAIN STATS -->
          <div class="grid md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
            <div
              v-for="card in mainStatCards"
              :key="card.label"
              class="bg-luxe-ivory border border-luxe-sand/70 rounded-[2rem] p-6 shadow-[0_18px_60px_rgba(92,56,36,0.10)]"
            >
              <div class="flex items-start justify-between gap-4 mb-5">
                <div>
                  <p class="text-sm text-luxe-brown/70 mb-2">
                    {{ card.label }}
                  </p>

                  <h2 class="text-3xl font-bold text-luxe-espresso">
                    {{ card.value }}
                  </h2>
                </div>

                <span
                  class="w-12 h-12 rounded-2xl bg-luxe-cream border border-luxe-sand/60 flex items-center justify-center text-2xl"
                >
                  {{ card.icon }}
                </span>
              </div>

              <p class="text-sm text-luxe-brown/65 leading-6">
                {{ card.description }}
              </p>
            </div>
          </div>

          <!-- QUICK LINKS -->
          <div
            class="bg-luxe-espresso text-luxe-ivory rounded-[2rem] p-6 md:p-8 mb-8 shadow-[0_20px_70px_rgba(92,56,36,0.14)]"
          >
            <div
              class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
            >
              <div>
                <p class="uppercase tracking-[4px] text-sm text-luxe-sand mb-3">
                  Akses Cepat
                </p>

                <h2 class="text-3xl font-bold mb-3">Menu Admin</h2>

                <p class="text-luxe-sand/90 max-w-2xl leading-7">
                  Gunakan shortcut ini untuk masuk ke pengelolaan pesanan,
                  produk, voucher, pembayaran, pengiriman, dan konten website.
                </p>
              </div>

              <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <RouterLink
                  v-for="link in quickLinks"
                  :key="link.to"
                  :to="link.to"
                  class="bg-luxe-ivory/10 border border-luxe-sand/20 text-luxe-ivory px-5 py-3 rounded-2xl hover:bg-luxe-ivory hover:text-luxe-espresso transition text-sm font-semibold"
                >
                  {{ link.label }}
                </RouterLink>
              </div>
            </div>
          </div>

          <!-- STATUS + REVENUE -->
          <div class="grid xl:grid-cols-[1.1fr_0.9fr] gap-8 mb-8">
            <!-- ORDER STATUS -->
            <div
              class="bg-luxe-ivory border border-luxe-sand/70 rounded-[2rem] p-6 md:p-8 shadow-[0_18px_60px_rgba(92,56,36,0.10)]"
            >
              <div class="mb-6">
                <p
                  class="uppercase tracking-[4px] text-sm text-luxe-brown mb-3"
                >
                  Status Pesanan
                </p>

                <h2 class="text-3xl font-bold text-luxe-espresso">
                  Ringkasan Order
                </h2>
              </div>

              <div class="grid sm:grid-cols-2 gap-4">
                <div
                  v-for="status in orderStatusCards"
                  :key="status.label"
                  class="bg-luxe-cream border border-luxe-sand/60 rounded-3xl p-5"
                >
                  <div class="flex items-center justify-between gap-4">
                    <p class="text-luxe-brown/75">{{ status.label }}</p>

                    <span
                      :class="status.className"
                      class="px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      {{ status.badge }}
                    </span>
                  </div>

                  <p class="text-3xl font-bold text-luxe-espresso mt-3">
                    {{ status.value }}
                  </p>
                </div>
              </div>
            </div>

            <!-- REVENUE -->
            <div
              class="bg-luxe-ivory border border-luxe-sand/70 rounded-[2rem] p-6 md:p-8 shadow-[0_18px_60px_rgba(92,56,36,0.10)]"
            >
              <div class="mb-6">
                <p
                  class="uppercase tracking-[4px] text-sm text-luxe-brown mb-3"
                >
                  Pendapatan
                </p>

                <h2 class="text-3xl font-bold text-luxe-espresso">
                  Ringkasan Revenue
                </h2>
              </div>

              <div class="space-y-4">
                <div class="bg-luxe-espresso text-luxe-ivory rounded-3xl p-5">
                  <p class="text-luxe-sand mb-2">Pendapatan Terkonfirmasi</p>

                  <h3 class="text-3xl font-bold">
                    {{ formatCurrency(summary.revenue.confirmedRevenue) }}
                  </h3>

                  <p class="text-sm text-luxe-sand/90 mt-3 leading-6">
                    Dihitung dari order yang sudah dibayar, diproses, dikirim,
                    atau selesai.
                  </p>
                </div>

                <div
                  class="bg-luxe-cream border border-luxe-sand/60 rounded-3xl p-5"
                >
                  <p class="text-luxe-brown/75 mb-2">Pendapatan Selesai</p>

                  <h3 class="text-2xl font-bold text-luxe-espresso">
                    {{ formatCurrency(summary.revenue.completedRevenue) }}
                  </h3>
                </div>

                <div
                  class="bg-luxe-cream border border-luxe-sand/60 rounded-3xl p-5"
                >
                  <p class="text-luxe-brown/75 mb-2">Pendapatan Hari Ini</p>

                  <h3 class="text-2xl font-bold text-luxe-espresso">
                    {{ formatCurrency(summary.revenue.todayRevenue) }}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <!-- RECENT ORDER + LOW STOCK -->
          <div class="grid xl:grid-cols-2 gap-8 mb-8">
            <!-- RECENT ORDERS -->
            <div
              class="bg-luxe-ivory border border-luxe-sand/70 rounded-[2rem] p-6 md:p-8 shadow-[0_18px_60px_rgba(92,56,36,0.10)]"
            >
              <div
                class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div>
                  <p
                    class="uppercase tracking-[4px] text-sm text-luxe-brown mb-3"
                  >
                    Pesanan Terbaru
                  </p>

                  <h2 class="text-3xl font-bold text-luxe-espresso">
                    Order Masuk
                  </h2>
                </div>

                <RouterLink
                  to="/admin/orders"
                  class="border border-luxe-espresso text-luxe-espresso px-5 py-3 rounded-full hover:bg-luxe-espresso hover:text-luxe-ivory transition text-sm font-semibold w-fit"
                >
                  Lihat Semua
                </RouterLink>
              </div>

              <div
                v-if="summary.orders.recent.length === 0"
                class="py-10 text-center"
              >
                <p class="text-5xl mb-4">📦</p>
                <p class="text-luxe-brown/75">Belum ada pesanan terbaru.</p>
              </div>

              <div v-else class="space-y-4">
                <div
                  v-for="order in summary.orders.recent"
                  :key="order.id"
                  class="bg-luxe-cream border border-luxe-sand/60 rounded-3xl p-5"
                >
                  <div class="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p class="text-sm text-luxe-brown/70">Nomor Pesanan</p>

                      <h3 class="text-xl font-bold text-luxe-espresso">
                        {{ order.orderCode }}
                      </h3>
                    </div>

                    <span
                      :class="getStatusClass(order.status)"
                      class="px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      {{ formatStatus(order.status) }}
                    </span>
                  </div>

                  <div class="grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p class="text-luxe-brown/60 mb-1">Customer</p>
                      <p class="font-semibold text-luxe-espresso">
                        {{ order.customerName }}
                      </p>
                    </div>

                    <div>
                      <p class="text-luxe-brown/60 mb-1">Total</p>
                      <p class="font-semibold text-luxe-espresso">
                        {{ formatCurrency(order.totalAmount) }}
                      </p>
                    </div>

                    <div>
                      <p class="text-luxe-brown/60 mb-1">Pembayaran</p>
                      <p class="font-semibold text-luxe-espresso">
                        {{
                          order.paymentMethodName ||
                          formatPaymentMethod(order.paymentMethodCode)
                        }}
                      </p>
                    </div>

                    <div>
                      <p class="text-luxe-brown/60 mb-1">Tanggal</p>
                      <p class="font-semibold text-luxe-espresso">
                        {{ formatDate(order.createdAt) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- LOW STOCK -->
            <div
              class="bg-luxe-ivory border border-luxe-sand/70 rounded-[2rem] p-6 md:p-8 shadow-[0_18px_60px_rgba(92,56,36,0.10)]"
            >
              <div
                class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div>
                  <p
                    class="uppercase tracking-[4px] text-sm text-luxe-brown mb-3"
                  >
                    Stok Menipis
                  </p>

                  <h2 class="text-3xl font-bold text-luxe-espresso">
                    Perlu Restock
                  </h2>

                  <p class="text-sm text-luxe-brown/70 mt-2">
                    Threshold stok: ≤ {{ summary.products.lowStockThreshold }}
                  </p>
                </div>

                <RouterLink
                  to="/admin/products"
                  class="border border-luxe-espresso text-luxe-espresso px-5 py-3 rounded-full hover:bg-luxe-espresso hover:text-luxe-ivory transition text-sm font-semibold w-fit"
                >
                  Kelola Produk
                </RouterLink>
              </div>

              <div
                v-if="summary.products.lowStock.length === 0"
                class="py-10 text-center"
              >
                <p class="text-5xl mb-4">✅</p>
                <p class="text-luxe-brown/75">
                  Tidak ada produk dengan stok menipis.
                </p>
              </div>

              <div v-else class="space-y-4">
                <div
                  v-for="item in summary.products.lowStock"
                  :key="`${item.productId}-${item.size || 'default'}`"
                  class="bg-luxe-cream border border-luxe-sand/60 rounded-3xl p-4 flex items-center gap-4"
                >
                  <ProductImage
                    :src="item.imageUrl"
                    :alt="item.productName"
                    class="w-20 h-20 object-cover rounded-2xl bg-luxe-ivory"
                  />

                  <div class="flex-1 min-w-0">
                    <h3
                      class="font-bold text-luxe-espresso leading-snug truncate"
                    >
                      {{ item.productName }}
                    </h3>

                    <p class="text-sm text-luxe-brown/70 mt-1">
                      {{ item.categoryName }}
                      <template v-if="item.size">
                        · Ukuran {{ item.size }}
                      </template>
                    </p>

                    <p class="text-sm text-luxe-brown/70">
                      {{ formatCurrency(item.price) }}
                    </p>
                  </div>

                  <div class="text-right">
                    <p class="text-xs text-luxe-brown/60 mb-1">Stok</p>

                    <p class="text-2xl font-bold text-red-600">
                      {{ item.stock }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- RECENT PRODUCTS -->
          <div
            class="bg-luxe-ivory border border-luxe-sand/70 rounded-[2rem] p-6 md:p-8 shadow-[0_18px_60px_rgba(92,56,36,0.10)]"
          >
            <div
              class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div>
                <p
                  class="uppercase tracking-[4px] text-sm text-luxe-brown mb-3"
                >
                  Produk Terbaru
                </p>

                <h2 class="text-3xl font-bold text-luxe-espresso">
                  Update Katalog
                </h2>
              </div>

              <RouterLink
                to="/admin/products"
                class="border border-luxe-espresso text-luxe-espresso px-5 py-3 rounded-full hover:bg-luxe-espresso hover:text-luxe-ivory transition text-sm font-semibold w-fit"
              >
                Lihat Produk
              </RouterLink>
            </div>

            <div
              v-if="summary.products.recent.length === 0"
              class="py-10 text-center"
            >
              <p class="text-5xl mb-4">🛍️</p>
              <p class="text-luxe-brown/75">Belum ada produk terbaru.</p>
            </div>

            <div v-else class="grid md:grid-cols-2 xl:grid-cols-5 gap-5">
              <div
                v-for="product in summary.products.recent"
                :key="product.id"
                class="bg-luxe-cream border border-luxe-sand/60 rounded-3xl p-4"
              >
                <ProductImage
                  :src="product.imageUrl"
                  :alt="product.name"
                  class="w-full h-40 object-cover rounded-2xl bg-luxe-ivory mb-4"
                />

                <div class="flex flex-wrap gap-2 mb-3">
                  <span
                    :class="
                      product.isActive
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                    "
                    class="px-3 py-1 rounded-full text-xs font-semibold"
                  >
                    {{ product.isActive ? "Aktif" : "Tidak Aktif" }}
                  </span>
                </div>

                <h3 class="font-bold text-luxe-espresso leading-snug">
                  {{ product.name }}
                </h3>

                <p class="text-sm text-luxe-brown/70 mt-1">
                  {{ product.categoryName }}
                </p>

                <p class="font-bold text-luxe-espresso mt-3">
                  {{ formatCurrency(product.price) }}
                </p>

                <p class="text-sm text-luxe-brown/70 mt-1">
                  Stok: {{ product.stock }}
                </p>
              </div>
            </div>
          </div>
        </template>
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

import { dashboardService } from "../services/dashboardService";
import { useToastStore } from "../stores/toastStore";
import { formatCurrency } from "../utils/formatCurrency";

const toastStore = useToastStore();

const dashboard = ref(null);
const isLoading = ref(false);
const errorMessage = ref("");

const emptyDashboard = {
  orders: {
    total: 0,
    today: 0,
    needsAction: 0,
    statusCounts: {
      pending: 0,
      paymentSubmitted: 0,
      paid: 0,
      processing: 0,
      shipped: 0,
      completed: 0,
      cancelled: 0,
    },
    recent: [],
  },
  revenue: {
    confirmedRevenue: 0,
    completedRevenue: 0,
    todayRevenue: 0,
  },
  products: {
    total: 0,
    active: 0,
    inactive: 0,
    lowStockThreshold: 5,
    lowStock: [],
    recent: [],
  },
  vouchers: {
    total: 0,
    active: 0,
  },
};

const summary = computed(() => dashboard.value || emptyDashboard);

const mainStatCards = computed(() => [
  {
    label: "Pendapatan Terkonfirmasi",
    value: formatCurrency(summary.value.revenue.confirmedRevenue),
    description: "Total nilai order yang sudah dibayar atau masuk proses.",
    icon: "💰",
  },
  {
    label: "Total Order",
    value: summary.value.orders.total,
    description: `${summary.value.orders.today} order masuk hari ini.`,
    icon: "📦",
  },
  {
    label: "Order Butuh Aksi",
    value: summary.value.orders.needsAction,
    description: "Order yang perlu diverifikasi, diproses, atau dikirim.",
    icon: "⚡",
  },
  {
    label: "Produk Aktif",
    value: summary.value.products.active,
    description: `${summary.value.products.inactive} produk sedang nonaktif.`,
    icon: "🛍️",
  },
  {
    label: "Stok Menipis",
    value: summary.value.products.lowStock.length,
    description: `Produk dengan stok ≤ ${summary.value.products.lowStockThreshold}.`,
    icon: "⚠️",
  },
  {
    label: "Voucher Aktif",
    value: summary.value.vouchers.active,
    description: `${summary.value.vouchers.total} voucher terdaftar.`,
    icon: "🎟️",
  },
  {
    label: "Order Selesai",
    value: summary.value.orders.statusCounts.completed,
    description: "Pesanan yang sudah berstatus selesai.",
    icon: "✅",
  },
  {
    label: "Pendapatan Hari Ini",
    value: formatCurrency(summary.value.revenue.todayRevenue),
    description: "Pendapatan terkonfirmasi dari order hari ini.",
    icon: "📈",
  },
]);

const orderStatusCards = computed(() => [
  {
    label: "Menunggu Pembayaran",
    value: summary.value.orders.statusCounts.pending,
    badge: "Pending",
    className: "bg-luxe-ivory text-luxe-espresso",
  },
  {
    label: "Bukti Pembayaran Dikirim",
    value: summary.value.orders.statusCounts.paymentSubmitted,
    badge: "Cek Bukti",
    className: "bg-amber-50 text-amber-700",
  },
  {
    label: "Pembayaran Diterima",
    value: summary.value.orders.statusCounts.paid,
    badge: "Paid",
    className: "bg-green-50 text-green-700",
  },
  {
    label: "Sedang Diproses",
    value: summary.value.orders.statusCounts.processing,
    badge: "Proses",
    className: "bg-blue-50 text-blue-700",
  },
  {
    label: "Dikirim",
    value: summary.value.orders.statusCounts.shipped,
    badge: "Shipped",
    className: "bg-indigo-50 text-indigo-700",
  },
  {
    label: "Selesai",
    value: summary.value.orders.statusCounts.completed,
    badge: "Done",
    className: "bg-luxe-gold text-luxe-espresso",
  },
  {
    label: "Dibatalkan",
    value: summary.value.orders.statusCounts.cancelled,
    badge: "Cancel",
    className: "bg-red-50 text-red-700",
  },
]);

const quickLinks = [
  {
    label: "Kelola Pesanan",
    to: "/admin/orders",
  },
  {
    label: "Kelola Produk",
    to: "/admin/products",
  },
  {
    label: "Kelola Voucher",
    to: "/admin/vouchers",
  },
  {
    label: "Metode Pembayaran",
    to: "/admin/payments",
  },
  {
    label: "Metode Pengiriman",
    to: "/admin/shipping-methods",
  },
  {
    label: "Konten Website",
    to: "/admin/content",
  },
];

const loadDashboard = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    dashboard.value = await dashboardService.getSummary();
  } catch (error) {
    console.error("Gagal memuat dashboard admin:", error);

    errorMessage.value =
      error?.message ||
      error?.data?.message ||
      "Data dashboard admin belum dapat dimuat.";

    toastStore.showToast({
      title: "Gagal Memuat Dashboard",
      message: errorMessage.value,
      type: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
};

const formatPaymentMethod = (method) => {
  if (method === "qris-main") return "QRIS GoPay Merchant";
  if (method === "bca-001") return "Bank BCA";

  return method || "-";
};

const formatStatus = (status) => {
  const statusMap = {
    pending: "Menunggu Pembayaran",
    payment_submitted: "Bukti Pembayaran Dikirim",
    paid: "Pembayaran Diterima",
    processing: "Sedang Diproses",
    shipped: "Dikirim",
    completed: "Selesai",
    cancelled: "Dibatalkan",
  };

  return statusMap[status] || "Menunggu Pembayaran";
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

  if (status === "shipped") {
    return "bg-indigo-50 text-indigo-700";
  }

  if (status === "completed") {
    return "bg-luxe-gold text-luxe-espresso";
  }

  return "bg-luxe-ivory text-luxe-espresso";
};

onMounted(() => {
  loadDashboard();
});
</script>
