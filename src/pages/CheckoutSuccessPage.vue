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
          Pesanan Dibuat
        </p>

        <h1 class="text-4xl md:text-5xl font-bold mb-5 text-luxe-espresso">
          Terima kasih atas pesanan Anda
        </h1>

        <p class="text-luxe-brown/75 leading-7 mb-8 max-w-2xl mx-auto">
          Pesanan Luxeza Royale Anda berhasil dibuat. Silakan selesaikan
          pembayaran sesuai metode yang dipilih agar pesanan dapat segera
          diproses.
        </p>

        <!-- ORDER SUMMARY -->
        <div
          v-if="lastOrder"
          class="bg-luxe-cream border border-luxe-sand/60 rounded-3xl p-6 text-left mb-8 space-y-4"
        >
          <div class="flex justify-between gap-4">
            <span class="text-luxe-brown/70">Nomor Pesanan</span>
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
            <span class="text-luxe-brown/70">Pelanggan</span>
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
            <span class="text-luxe-brown/70">Diskon</span>

            <span class="font-semibold text-green-600">
              -{{ formatCurrency(lastOrder.discountAmount) }}
            </span>
          </div>

          <div class="flex justify-between gap-4">
            <span class="text-luxe-brown/70">Ongkir</span>

            <div class="text-right">
              <p class="font-semibold text-luxe-espresso">
                {{
                  Number(lastOrder.shippingCost || 0) === 0
                    ? "Gratis"
                    : formatCurrency(lastOrder.shippingCost)
                }}
              </p>

              <p
                v-if="shippingCourierLabel"
                class="text-sm text-luxe-brown/70 mt-1"
              >
                {{ shippingCourierLabel }}
              </p>

              <p
                v-if="shippingDestinationLabel"
                class="text-xs text-luxe-brown/60 mt-1 max-w-[260px]"
              >
                {{ shippingDestinationLabel }}
              </p>
            </div>
          </div>

          <div class="flex justify-between gap-4">
            <span class="text-luxe-brown/70">Pembayaran</span>

            <span class="font-semibold text-luxe-espresso text-right">
              {{ formatPaymentMethod(lastOrder.paymentMethod) }}
            </span>
          </div>

          <div
            class="border-t border-luxe-sand/60 pt-5 flex justify-between gap-4"
          >
            <span class="text-lg text-luxe-espresso">Total Pembayaran</span>

            <span class="text-2xl font-bold text-luxe-espresso">
              {{ formatCurrency(lastOrder.total || 0) }}
            </span>
          </div>
        </div>

        <!-- SHIPPING ADDRESS -->
        <AddressSummaryCard
          v-if="lastOrder"
          :customer="lastOrder.customer || {}"
          title="Alamat Pengiriman"
          eyebrow="Informasi Pengiriman"
          class="text-left mb-8"
        />

        <!-- SHIPPING COURIER DETAIL -->
        <div
          v-if="lastOrder && hasShippingDetail"
          class="bg-luxe-ivory border border-luxe-sand/70 rounded-3xl p-6 text-left mb-8 shadow-sm"
        >
          <p class="uppercase tracking-[3px] text-xs text-luxe-brown/70 mb-2">
            Kurir Pengiriman
          </p>

          <h2 class="text-xl font-bold text-luxe-espresso mb-5">
            Layanan Pengiriman
          </h2>

          <div class="space-y-3">
            <div v-if="shippingCourierLabel" class="flex justify-between gap-4">
              <span class="text-luxe-brown/70">Kurir</span>

              <span class="font-semibold text-luxe-espresso text-right">
                {{ shippingCourierLabel }}
              </span>
            </div>

            <div
              v-if="shippingDestinationLabel"
              class="flex justify-between gap-4"
            >
              <span class="text-luxe-brown/70">Tujuan</span>

              <span
                class="font-semibold text-luxe-espresso text-right max-w-[320px]"
              >
                {{ shippingDestinationLabel }}
              </span>
            </div>

            <div v-if="shippingEtdLabel" class="flex justify-between gap-4">
              <span class="text-luxe-brown/70">Estimasi Pengiriman</span>

              <span class="font-semibold text-luxe-espresso text-right">
                {{ shippingEtdLabel }}
              </span>
            </div>

            <div class="flex justify-between gap-4">
              <span class="text-luxe-brown/70">Biaya Ongkir</span>

              <span class="font-semibold text-luxe-espresso text-right">
                {{
                  Number(lastOrder.shippingCost || 0) === 0
                    ? "Gratis"
                    : formatCurrency(lastOrder.shippingCost)
                }}
              </span>
            </div>
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
              {{ paymentMethodData?.type === "qris" ? "📱" : "🏦" }}
            </div>

            <div class="flex-1">
              <h2 class="text-xl font-bold text-luxe-espresso mb-2">
                {{
                  paymentMethodData?.name ||
                  formatPaymentMethod(lastOrder?.paymentMethod)
                }}
              </h2>

              <!-- QRIS -->
              <div v-if="paymentMethodData?.type === 'qris'">
                <div
                  v-if="paymentMethodData.qrImageUrl"
                  class="mt-5 bg-luxe-cream border border-luxe-sand/60 rounded-3xl p-5 flex justify-center"
                >
                  <img
                    :src="paymentMethodData.qrImageUrl"
                    :alt="paymentMethodData.name"
                    class="w-full max-w-[320px] rounded-2xl border border-luxe-sand/60 bg-luxe-ivory"
                  />
                </div>

                <p class="text-luxe-brown/75 leading-7 mt-5">
                  {{ paymentMethodData.instructions }}
                </p>

                <div
                  class="mt-5 bg-luxe-cream border border-luxe-sand/50 rounded-3xl p-5"
                >
                  <p class="text-sm font-semibold text-luxe-espresso mb-2">
                    Catatan QRIS
                  </p>

                  <p class="text-sm text-luxe-brown/75 leading-6">
                    Silakan bayar sesuai nominal Total Pembayaran. Jika QRIS
                    kedaluwarsa, lakukan checkout ulang atau hubungi admin untuk
                    mendapatkan QRIS baru.
                  </p>
                </div>
              </div>

              <!-- BANK TRANSFER -->
              <div v-else-if="paymentMethodData?.type === 'bank_transfer'">
                <div
                  class="mt-5 bg-luxe-cream border border-luxe-sand/60 rounded-3xl p-5 space-y-3"
                >
                  <div class="flex justify-between gap-4">
                    <span class="text-luxe-brown/70">Bank</span>
                    <span class="font-semibold text-luxe-espresso text-right">
                      {{ paymentMethodData.bankName || paymentMethodData.name }}
                    </span>
                  </div>

                  <div class="flex justify-between gap-4">
                    <span class="text-luxe-brown/70">Nama Rekening</span>
                    <span class="font-semibold text-luxe-espresso text-right">
                      {{ paymentMethodData.accountName }}
                    </span>
                  </div>

                  <div class="flex justify-between gap-4">
                    <span class="text-luxe-brown/70">Nomor Rekening</span>
                    <span class="font-semibold text-luxe-espresso text-right">
                      {{ paymentMethodData.accountNumber }}
                    </span>
                  </div>
                </div>

                <p class="text-luxe-brown/75 leading-7 mt-5">
                  {{ paymentMethodData.instructions }}
                </p>
              </div>

              <!-- FALLBACK -->
              <div v-else>
                <p class="text-luxe-brown/75 leading-7 mt-4">
                  Silakan selesaikan pembayaran menggunakan metode yang telah
                  dipilih. Setelah pembayaran berhasil, simpan bukti pembayaran
                  dan unggah pada halaman ini untuk proses konfirmasi admin.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- PAYMENT PROOF UPLOAD -->
        <div
          v-if="lastOrder"
          class="bg-luxe-ivory border border-luxe-sand/70 rounded-3xl p-6 text-left mb-8 shadow-sm"
        >
          <div
            class="flex flex-col md:flex-row md:items-start md:justify-between gap-5"
          >
            <div>
              <p
                class="uppercase tracking-[3px] text-xs text-luxe-brown/70 mb-2"
              >
                Konfirmasi Pembayaran
              </p>

              <h2 class="text-xl font-bold text-luxe-espresso mb-2">
                Unggah Bukti Pembayaran
              </h2>

              <p class="text-luxe-brown/75 leading-7">
                Unggah struk transfer atau tangkapan layar pembayaran QRIS. File
                yang diterima: JPG, PNG, atau WEBP. Ukuran maksimal 5 MB.
              </p>
            </div>

            <span
              v-if="lastOrder.hasPaymentProof"
              class="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold w-fit"
            >
              Bukti Terkirim
            </span>

            <span
              v-else
              class="bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold w-fit"
            >
              Menunggu Bukti
            </span>
          </div>

          <!-- CURRENT PROOF -->
          <div
            v-if="lastOrder.paymentProofUrl"
            class="mt-6 bg-luxe-cream border border-luxe-sand/60 rounded-3xl p-5"
          >
            <p class="text-sm font-semibold text-luxe-espresso mb-4">
              Bukti Pembayaran Terunggah
            </p>

            <a
              :href="lastOrder.paymentProofUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block"
            >
              <img
                :src="lastOrder.paymentProofUrl"
                alt="Bukti pembayaran"
                class="w-44 h-44 object-cover rounded-2xl border border-luxe-sand/60 bg-luxe-ivory"
              />
            </a>

            <p class="text-sm text-luxe-brown/70 mt-4">
              Status: {{ formatStatus(lastOrder.status) }}
            </p>
          </div>

          <!-- UPLOAD FORM -->
          <div v-else class="mt-6">
            <div
              class="bg-luxe-cream border border-dashed border-luxe-sand rounded-3xl p-5"
            >
              <div
                class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div>
                  <p class="font-semibold text-luxe-espresso mb-1">
                    Pilih gambar bukti pembayaran
                  </p>

                  <p class="text-sm text-luxe-brown/70">
                    Hanya file JPG, PNG, atau WEBP.
                  </p>
                </div>

                <label
                  class="inline-flex items-center justify-center bg-luxe-espresso text-luxe-ivory px-5 py-3 rounded-full cursor-pointer hover:bg-luxe-royal transition w-fit"
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    class="hidden"
                    @change="handlePaymentProofChange"
                  />

                  Pilih Gambar
                </label>
              </div>

              <div
                v-if="paymentProofFile"
                class="mt-5 bg-luxe-ivory border border-luxe-sand/60 rounded-2xl p-4"
              >
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <p class="font-semibold text-luxe-espresso">
                      {{ paymentProofFile.name }}
                    </p>

                    <p class="text-sm text-luxe-brown/70 mt-1">
                      {{ (paymentProofFile.size / 1024 / 1024).toFixed(2) }} MB
                    </p>
                  </div>

                  <button
                    @click="removePaymentProof"
                    type="button"
                    class="text-red-600 hover:text-red-700 text-sm font-semibold"
                  >
                    Hapus
                  </button>
                </div>

                <img
                  v-if="paymentProofPreview"
                  :src="paymentProofPreview"
                  alt="Pratinjau bukti pembayaran"
                  class="mt-4 w-44 h-44 object-cover rounded-2xl border border-luxe-sand/60 bg-luxe-cream"
                />

                <button
                  @click="uploadPaymentProof"
                  :disabled="isUploadingPaymentProof"
                  type="button"
                  class="mt-5 w-full bg-luxe-espresso text-luxe-ivory py-4 rounded-full hover:bg-luxe-royal disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {{
                    isUploadingPaymentProof
                      ? "Mengunggah Bukti..."
                      : "Kirim Bukti Pembayaran"
                  }}
                </button>
              </div>

              <p v-if="paymentProofError" class="text-red-500 text-sm mt-3">
                {{ paymentProofError }}
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
            Lanjut Belanja
          </RouterLink>

          <RouterLink
            to="/orders"
            class="inline-block border border-luxe-espresso text-luxe-espresso px-8 py-4 rounded-full hover:bg-luxe-espresso hover:text-luxe-ivory transition"
          >
            Lihat Riwayat Pesanan
          </RouterLink>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { orderService } from "../services/orderService";
import { useToastStore } from "../stores/toastStore";

import Navbar from "../components/layout/Navbar.vue";
import CartSidebar from "../components/layout/CartSidebar.vue";
import Footer from "../components/layout/Footer.vue";
import AddressSummaryCard from "../components/order/AddressSummaryCard.vue";
import { formatCurrency } from "../utils/formatCurrency";

const loadLastOrder = () => {
  try {
    const savedOrder = sessionStorage.getItem("lastOrder");
    return savedOrder ? JSON.parse(savedOrder) : null;
  } catch (error) {
    console.error("Gagal memuat pesanan terakhir:", error);
    return null;
  }
};

const lastOrder = ref(loadLastOrder());

const toastStore = useToastStore();

const paymentProofFile = ref(null);
const paymentProofPreview = ref("");
const paymentProofError = ref("");
const isUploadingPaymentProof = ref(false);

const orderCode = computed(() => {
  return lastOrder.value?.orderNumber || lastOrder.value?.order_code || "";
});

const canUploadPaymentProof = computed(() => {
  return (
    lastOrder.value &&
    orderCode.value &&
    !lastOrder.value.hasPaymentProof &&
    ["pending", "payment_submitted"].includes(
      lastOrder.value.status || "pending",
    )
  );
});

const handlePaymentProofChange = (event) => {
  const file = event.target.files?.[0];

  event.target.value = "";

  paymentProofFile.value = null;
  paymentProofPreview.value = "";
  paymentProofError.value = "";

  if (!file) return;

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    paymentProofError.value =
      "Bukti pembayaran harus berupa gambar JPG, PNG, atau WEBP.";

    toastStore.showToast({
      title: "File Tidak Valid",
      message: paymentProofError.value,
      type: "error",
    });

    return;
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    paymentProofError.value = "Ukuran bukti pembayaran maksimal 5 MB.";

    toastStore.showToast({
      title: "File Terlalu Besar",
      message: paymentProofError.value,
      type: "error",
    });

    return;
  }

  paymentProofFile.value = file;
  paymentProofPreview.value = URL.createObjectURL(file);
};

const removePaymentProof = () => {
  paymentProofFile.value = null;
  paymentProofPreview.value = "";
  paymentProofError.value = "";
};

const uploadPaymentProof = async () => {
  if (
    !paymentProofFile.value ||
    !orderCode.value ||
    isUploadingPaymentProof.value
  ) {
    return;
  }

  isUploadingPaymentProof.value = true;
  paymentProofError.value = "";

  try {
    const updatedOrder = await orderService.uploadPaymentProof(
      orderCode.value,
      paymentProofFile.value,
    );

    lastOrder.value = updatedOrder;
    sessionStorage.setItem("lastOrder", JSON.stringify(updatedOrder));

    paymentProofFile.value = null;
    paymentProofPreview.value = "";

    toastStore.showToast({
      title: "Bukti Pembayaran Terkirim",
      message:
        "Bukti pembayaran Anda berhasil dikirim dan sedang menunggu konfirmasi admin.",
      type: "success",
    });
  } catch (error) {
    paymentProofError.value =
      error?.message || "Gagal mengunggah bukti pembayaran.";

    toastStore.showToast({
      title: "Unggah Bukti Gagal",
      message: paymentProofError.value,
      type: "error",
    });
  } finally {
    isUploadingPaymentProof.value = false;
  }
};

const formatPaymentMethod = (method) => {
  if (method === "qris-main") return "QRIS GoPay Merchant";
  if (method === "bca-001") return "Bank BCA";

  return method || "-";
};

const paymentMethodData = computed(() => {
  return lastOrder.value?.paymentMethodData || null;
});

const backendOrderData = computed(() => {
  return (
    lastOrder.value?.backendOrder?.order ||
    lastOrder.value?.backendOrder?.data?.order ||
    lastOrder.value?.backendOrder ||
    {}
  );
});

const formatCourierName = (codeOrName) => {
  const value = String(codeOrName || "").trim();

  if (!value) return "";

  if (value.toLowerCase() === "jnt") return "J&T";
  if (value.toLowerCase() === "jne") return "JNE";

  return value.toUpperCase();
};

const shippingCourierLabel = computed(() => {
  const rate = lastOrder.value?.shippingRate || {};
  const backendOrder = backendOrderData.value;

  const courierName =
    rate.name ||
    lastOrder.value?.shippingCourier ||
    backendOrder.shipping_courier ||
    "";

  const service =
    rate.service ||
    lastOrder.value?.shippingService ||
    backendOrder.shipping_service ||
    "";

  const formattedCourier = formatCourierName(courierName);

  return [formattedCourier, service].filter(Boolean).join(" ");
});

const shippingDestinationLabel = computed(() => {
  return (
    lastOrder.value?.shippingDestination?.label ||
    lastOrder.value?.shippingDestinationLabel ||
    backendOrderData.value?.shipping_destination_label ||
    ""
  );
});

const shippingEtdLabel = computed(() => {
  const etd =
    lastOrder.value?.shippingRate?.etd ||
    lastOrder.value?.shippingEtd ||
    backendOrderData.value?.shipping_etd ||
    "";

  return etd ? `${etd} hari` : "";
});

const hasShippingDetail = computed(() => {
  return Boolean(
    shippingCourierLabel.value ||
    shippingDestinationLabel.value ||
    shippingEtdLabel.value,
  );
});

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
</script>
