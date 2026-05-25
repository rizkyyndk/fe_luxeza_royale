<template>
  <div>
    <Navbar />
    <CartSidebar />

    <section class="pt-36 pb-24 px-6">
      <div class="max-w-7xl mx-auto">
        <div
          class="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <p class="uppercase tracking-[4px] text-sm text-luxe-brown mb-4">
              Admin Panel
            </p>

            <h1 class="text-4xl md:text-5xl font-bold mb-4 text-luxe-espresso">
              Payment Methods
            </h1>

            <p class="text-luxe-brown/75 max-w-xl leading-7">
              Manage QRIS and bank transfer methods for Luxeza Royale checkout.
            </p>
          </div>

          <button
            @click="resetForm"
            class="bg-luxe-espresso text-luxe-ivory px-6 py-3 rounded-full hover:bg-luxe-royal transition w-fit"
          >
            Add Payment Method
          </button>
        </div>

        <div class="grid lg:grid-cols-[1fr_420px] gap-8">
          <!-- LIST -->
          <div class="space-y-5">
            <div
              v-if="isLoading"
              class="bg-luxe-cream border border-luxe-sand/60 rounded-[2rem] p-8 text-luxe-brown/75"
            >
              Loading payment methods...
            </div>

            <div
              v-else-if="paymentMethods.length === 0"
              class="bg-luxe-cream border border-luxe-sand/60 rounded-[2rem] p-8 text-luxe-brown/75"
            >
              No payment method found.
            </div>

            <div
              v-for="method in paymentMethods"
              v-else
              :key="method.id"
              class="bg-luxe-ivory border border-luxe-sand/70 rounded-[2rem] p-6 shadow-[0_18px_60px_rgba(92,56,36,0.10)]"
            >
              <div
                class="flex flex-col md:flex-row md:items-start md:justify-between gap-5"
              >
                <div>
                  <div class="flex flex-wrap items-center gap-3 mb-3">
                    <span class="text-2xl">
                      {{ method.type === "qris" ? "📱" : "🏦" }}
                    </span>

                    <h2 class="text-2xl font-bold text-luxe-espresso">
                      {{ method.name }}
                    </h2>

                    <span
                      :class="
                        method.isActive
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      "
                      class="px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      {{ method.isActive ? "Active" : "Inactive" }}
                    </span>
                  </div>

                  <p class="text-sm text-luxe-brown/75 mb-2">
                    Code: <span class="font-semibold">{{ method.code }}</span>
                  </p>

                  <p class="text-sm text-luxe-brown/75 mb-2">
                    Type:
                    <span class="font-semibold">
                      {{ method.type === "qris" ? "QRIS" : "Bank Transfer" }}
                    </span>
                  </p>

                  <div
                    v-if="method.type === 'bank_transfer'"
                    class="text-sm text-luxe-brown/75 space-y-1 mt-3"
                  >
                    <p>
                      Bank:
                      <span class="font-semibold">{{ method.bankName }}</span>
                    </p>
                    <p>
                      Account:
                      <span class="font-semibold">{{
                        method.accountName
                      }}</span>
                    </p>
                    <p>
                      Number:
                      <span class="font-semibold">{{
                        method.accountNumber
                      }}</span>
                    </p>
                  </div>

                  <div
                    v-if="method.type === 'qris' && method.qrImageUrl"
                    class="mt-4"
                  >
                    <img
                      :src="method.qrImageUrl"
                      :alt="method.name"
                      class="w-32 h-32 object-cover rounded-2xl border border-luxe-sand/60 bg-luxe-cream"
                    />
                  </div>
                </div>

                <div class="flex flex-wrap gap-3">
                  <button
                    @click="editMethod(method)"
                    class="border border-luxe-sand text-luxe-espresso px-4 py-2 rounded-full hover:bg-luxe-cream transition"
                  >
                    Edit
                  </button>

                  <button
                    @click="deleteMethod(method)"
                    class="border border-red-200 text-red-600 px-4 py-2 rounded-full hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- FORM -->
          <div
            class="bg-luxe-ivory border border-luxe-sand/70 rounded-[2rem] p-6 h-fit shadow-[0_18px_60px_rgba(92,56,36,0.10)] sticky top-28"
          >
            <h2 class="text-2xl font-bold text-luxe-espresso mb-6">
              {{ form.id ? "Edit Payment Method" : "Add Payment Method" }}
            </h2>

            <form class="space-y-5" @submit.prevent="submitForm">
              <div>
                <label class="block text-sm text-luxe-brown/75 mb-2"
                  >Type</label
                >
                <select
                  v-model="form.type"
                  class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                >
                  <option value="qris">QRIS</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label class="block text-sm text-luxe-brown/75 mb-2"
                  >Code</label
                >
                <input
                  v-model="form.code"
                  type="text"
                  placeholder="qris-main / bca-001"
                  class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                />
              </div>

              <div>
                <label class="block text-sm text-luxe-brown/75 mb-2"
                  >Name</label
                >
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="QRIS GoPay Merchant / Bank BCA"
                  class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                />
              </div>

              <div v-if="form.type === 'bank_transfer'" class="space-y-5">
                <div>
                  <label class="block text-sm text-luxe-brown/75 mb-2"
                    >Bank Name</label
                  >
                  <input
                    v-model="form.bank_name"
                    type="text"
                    placeholder="BCA / BNI / Mandiri"
                    class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                  />
                </div>

                <div>
                  <label class="block text-sm text-luxe-brown/75 mb-2"
                    >Account Name</label
                  >
                  <input
                    v-model="form.account_name"
                    type="text"
                    placeholder="Rizky Andika"
                    class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                  />
                </div>

                <div>
                  <label class="block text-sm text-luxe-brown/75 mb-2"
                    >Account Number</label
                  >
                  <input
                    v-model="form.account_number"
                    type="text"
                    placeholder="7641543661"
                    class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                  />
                </div>
              </div>

              <div v-if="form.type === 'qris'">
                <label class="block text-sm text-luxe-brown/75 mb-2"
                  >QR Image URL</label
                >
                <input
                  v-model="form.qr_image_url"
                  type="text"
                  placeholder="/app/payment/qris-placeholder.svg"
                  class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                />

                <div
                  v-if="form.qr_image_url"
                  class="mt-4 bg-luxe-cream border border-luxe-sand/60 rounded-3xl p-4 flex justify-center"
                >
                  <img
                    :src="form.qr_image_url"
                    alt="QR Preview"
                    class="w-40 h-40 object-cover rounded-2xl bg-luxe-ivory"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm text-luxe-brown/75 mb-2"
                  >Instructions</label
                >
                <textarea
                  v-model="form.instructions"
                  rows="4"
                  placeholder="Payment instructions..."
                  class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition resize-none"
                ></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-luxe-brown/75 mb-2"
                    >Status</label
                  >
                  <select
                    v-model="form.is_active"
                    class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                  >
                    <option :value="true">Active</option>
                    <option :value="false">Inactive</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm text-luxe-brown/75 mb-2"
                    >Sort Order</label
                  >
                  <input
                    v-model.number="form.sort_order"
                    type="number"
                    class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full bg-luxe-espresso text-luxe-ivory py-4 rounded-full hover:bg-luxe-royal disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {{
                  isSubmitting
                    ? "Saving..."
                    : form.id
                      ? "Update Payment Method"
                      : "Create Payment Method"
                }}
              </button>

              <button
                v-if="form.id"
                type="button"
                @click="resetForm"
                class="w-full border border-luxe-sand text-luxe-espresso py-4 rounded-full hover:bg-luxe-cream transition"
              >
                Cancel Edit
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";

import Navbar from "../components/layout/Navbar.vue";
import CartSidebar from "../components/layout/CartSidebar.vue";
import Footer from "../components/layout/Footer.vue";

import { paymentMethodService } from "../services/paymentMethodService";
import { useToastStore } from "../stores/toastStore";

const toastStore = useToastStore();

const paymentMethods = ref([]);
const isLoading = ref(false);
const isSubmitting = ref(false);

const defaultForm = () => ({
  id: null,
  type: "qris",
  code: "",
  name: "",
  bank_name: "",
  account_name: "",
  account_number: "",
  qr_image_url: "/app/payment/qris-placeholder.svg",
  instructions: "",
  is_active: true,
  sort_order: 0,
});

const form = reactive(defaultForm());

const loadPaymentMethods = async () => {
  isLoading.value = true;

  try {
    paymentMethods.value = await paymentMethodService.getAdminPaymentMethods();
  } catch (error) {
    toastStore.showToast({
      title: "Failed to Load Payments",
      message: error?.message || "Unable to load payment methods.",
      type: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  Object.assign(form, defaultForm());
};

const editMethod = (method) => {
  Object.assign(form, {
    id: method.id,
    type: method.type,
    code: method.code,
    name: method.name,
    bank_name: method.bankName,
    account_name: method.accountName,
    account_number: method.accountNumber,
    qr_image_url: method.qrImageUrl,
    instructions: method.instructions,
    is_active: method.isActive,
    sort_order: method.sortOrder,
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const buildPayload = () => {
  return {
    type: form.type,
    code: form.code.trim(),
    name: form.name.trim(),
    bank_name: form.type === "bank_transfer" ? form.bank_name.trim() : null,
    account_name: form.account_name.trim() || null,
    account_number:
      form.type === "bank_transfer" ? form.account_number.trim() : null,
    qr_image_url: form.type === "qris" ? form.qr_image_url.trim() : null,
    instructions: form.instructions.trim() || null,
    is_active: Boolean(form.is_active),
    sort_order: Number(form.sort_order || 0),
  };
};

const submitForm = async () => {
  if (!form.code.trim() || !form.name.trim()) {
    toastStore.showToast({
      title: "Validation Error",
      message: "Code and name are required.",
      type: "error",
    });

    return;
  }

  isSubmitting.value = true;

  try {
    const payload = buildPayload();

    if (form.id) {
      await paymentMethodService.updatePaymentMethod(form.id, payload);

      toastStore.showToast({
        title: "Payment Updated",
        message: "Payment method has been updated successfully.",
        type: "success",
      });
    } else {
      await paymentMethodService.createPaymentMethod(payload);

      toastStore.showToast({
        title: "Payment Created",
        message: "Payment method has been created successfully.",
        type: "success",
      });
    }

    resetForm();
    await loadPaymentMethods();
  } catch (error) {
    toastStore.showToast({
      title: "Save Failed",
      message: error?.message || "Unable to save payment method.",
      type: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};

const deleteMethod = async (method) => {
  const isConfirmed = window.confirm(`Delete payment method "${method.name}"?`);

  if (!isConfirmed) return;

  try {
    await paymentMethodService.deletePaymentMethod(method.id);

    toastStore.showToast({
      title: "Payment Deleted",
      message: "Payment method has been deleted.",
      type: "info",
    });

    await loadPaymentMethods();
  } catch (error) {
    toastStore.showToast({
      title: "Delete Failed",
      message: error?.message || "Unable to delete payment method.",
      type: "error",
    });
  }
};

onMounted(() => {
  loadPaymentMethods();
});
</script>
