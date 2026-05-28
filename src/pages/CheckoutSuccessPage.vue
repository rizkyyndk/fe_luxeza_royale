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

        <!-- SHIPPING ADDRESS -->
        <AddressSummaryCard
          v-if="lastOrder"
          :customer="lastOrder.customer || {}"
          title="Shipping Address"
          eyebrow="Delivery Information"
          class="text-left mb-8"
        />

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
                    QRIS Note
                  </p>

                  <p class="text-sm text-luxe-brown/75 leading-6">
                    Please pay exactly according to the Total Payment amount. If
                    your QRIS expires, repeat checkout or contact admin for a
                    new QRIS.
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
                    <span class="text-luxe-brown/70">Account Name</span>
                    <span class="font-semibold text-luxe-espresso text-right">
                      {{ paymentMethodData.accountName }}
                    </span>
                  </div>

                  <div class="flex justify-between gap-4">
                    <span class="text-luxe-brown/70">Account Number</span>
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
                  Please complete your payment using the selected method. After
                  payment, save the receipt and send it to the admin for manual
                  confirmation.
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
                Payment Confirmation
              </p>

              <h2 class="text-xl font-bold text-luxe-espresso mb-2">
                Upload Payment Proof
              </h2>

              <p class="text-luxe-brown/75 leading-7">
                Upload your transfer receipt or QRIS payment screenshot.
                Accepted file: JPG, PNG, or WEBP image only. Maximum size 5 MB.
              </p>
            </div>

            <span
              v-if="lastOrder.hasPaymentProof"
              class="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold w-fit"
            >
              Proof Submitted
            </span>

            <span
              v-else
              class="bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold w-fit"
            >
              Waiting for Proof
            </span>
          </div>

          <!-- CURRENT PROOF -->
          <div
            v-if="lastOrder.paymentProofUrl"
            class="mt-6 bg-luxe-cream border border-luxe-sand/60 rounded-3xl p-5"
          >
            <p class="text-sm font-semibold text-luxe-espresso mb-4">
              Uploaded Payment Proof
            </p>

            <a
              :href="lastOrder.paymentProofUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block"
            >
              <img
                :src="lastOrder.paymentProofUrl"
                alt="Payment proof"
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
                    Select payment proof image
                  </p>

                  <p class="text-sm text-luxe-brown/70">
                    JPG, PNG, or WEBP only.
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

                  Choose Image
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
                    Remove
                  </button>
                </div>

                <img
                  v-if="paymentProofPreview"
                  :src="paymentProofPreview"
                  alt="Payment proof preview"
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
                      ? "Uploading Proof..."
                      : "Submit Payment Proof"
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
    console.error("Failed to load last order:", error);
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
    paymentProofError.value = "Payment proof must be JPG, PNG, or WEBP image.";

    toastStore.showToast({
      title: "Invalid File",
      message: paymentProofError.value,
      type: "error",
    });

    return;
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    paymentProofError.value = "Maximum payment proof size is 5 MB.";

    toastStore.showToast({
      title: "File Too Large",
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
      title: "Payment Proof Uploaded",
      message:
        "Your payment proof has been submitted and is waiting for admin review.",
      type: "success",
    });
  } catch (error) {
    paymentProofError.value =
      error?.message || "Failed to upload payment proof.";

    toastStore.showToast({
      title: "Upload Failed",
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
</script>
