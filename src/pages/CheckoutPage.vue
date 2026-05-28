<template>
  <div>
    <Navbar />
    <CartSidebar />

    <section class="pt-36 pb-24 px-6">
      <div class="max-w-7xl mx-auto">
        <!-- EMPTY CHECKOUT -->
        <div
          v-if="cartStore.isEmpty || !cartStore.hasSelectedItems"
          class="min-h-[60vh] flex items-center justify-center text-center"
        >
          <div>
            <p class="text-6xl mb-6">🛒</p>

            <h1 class="text-4xl md:text-5xl font-bold mb-4">
              No selected items
            </h1>

            <p class="text-luxe-brown/75 mb-8">
              Please select at least one item from your cart before checkout.
            </p>

            <RouterLink
              to="/"
              class="bg-luxe-espresso text-luxe-ivory px-8 py-4 rounded-full inline-block hover:bg-luxe-royal hover:scale-105 transition shadow-lg shadow-luxe-brown/20"
            >
              Back to Collection
            </RouterLink>
          </div>
        </div>

        <!-- CHECKOUT CONTENT -->
        <div v-else class="grid lg:grid-cols-2 gap-20">
          <!-- LEFT -->
          <div>
            <p class="uppercase tracking-[4px] text-sm text-luxe-brown mb-4">
              Checkout
            </p>

            <h1 class="text-4xl md:text-5xl font-bold mb-4">
              Shipping Information
            </h1>

            <p class="text-luxe-brown/75 mb-10 leading-7">
              Complete your shipping details to place an order through Luxeza
              Royale backend system.
            </p>

            <form class="space-y-6" @submit.prevent="placeOrder">
              <!-- FULL NAME -->
              <div>
                <input
                  v-model="form.fullName"
                  type="text"
                  placeholder="Full Name"
                  class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-6 py-5 outline-none focus:border-luxe-royal transition shadow-sm"
                />

                <p v-if="errors.fullName" class="text-red-500 text-sm mt-2">
                  {{ errors.fullName }}
                </p>
              </div>

              <!-- EMAIL -->
              <div>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="Email Address"
                  class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-6 py-5 outline-none focus:border-luxe-royal transition shadow-sm"
                />

                <p v-if="errors.email" class="text-red-500 text-sm mt-2">
                  {{ errors.email }}
                </p>
              </div>

              <!-- PHONE -->
              <div>
                <div>
                  <div class="flex">
                    <div
                      class="px-5 py-5 rounded-l-2xl border border-r-0 border-luxe-sand bg-luxe-cream text-luxe-espresso font-semibold"
                    >
                      +62
                    </div>

                    <input
                      v-model="form.phone"
                      @input="handlePhoneInput"
                      type="text"
                      inputmode="numeric"
                      placeholder="81234567890"
                      class="w-full border border-luxe-sand rounded-r-2xl px-6 py-5 outline-none focus:border-luxe-royal transition bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50"
                    />
                  </div>

                  <p v-if="errors.phone" class="text-red-500 text-sm mt-2">
                    {{ errors.phone }}
                  </p>
                </div>

                <p v-if="errors.phone" class="text-red-500 text-sm mt-2">
                  {{ errors.phone }}
                </p>
              </div>

              <!-- ADDRESS -->
              <div>
                <!-- ADDRESS DETAIL -->
                <div class="grid md:grid-cols-2 gap-5">
                  <div>
                    <input
                      v-model="form.province"
                      type="text"
                      placeholder="Province"
                      class="w-full border border-luxe-sand rounded-2xl px-6 py-5 outline-none focus:border-luxe-royal transition bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50"
                    />

                    <p v-if="errors.province" class="text-red-500 text-sm mt-2">
                      {{ errors.province }}
                    </p>
                  </div>

                  <div>
                    <input
                      v-model="form.city"
                      type="text"
                      placeholder="City / Regency"
                      class="w-full border border-luxe-sand rounded-2xl px-6 py-5 outline-none focus:border-luxe-royal transition bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50"
                    />

                    <p v-if="errors.city" class="text-red-500 text-sm mt-2">
                      {{ errors.city }}
                    </p>
                  </div>

                  <div>
                    <input
                      v-model="form.district"
                      type="text"
                      placeholder="District / Kecamatan"
                      class="w-full border border-luxe-sand rounded-2xl px-6 py-5 outline-none focus:border-luxe-royal transition bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50"
                    />

                    <p v-if="errors.district" class="text-red-500 text-sm mt-2">
                      {{ errors.district }}
                    </p>
                  </div>

                  <div>
                    <input
                      v-model="form.village"
                      type="text"
                      placeholder="Village / Kelurahan"
                      class="w-full border border-luxe-sand rounded-2xl px-6 py-5 outline-none focus:border-luxe-royal transition bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50"
                    />

                    <p v-if="errors.village" class="text-red-500 text-sm mt-2">
                      {{ errors.village }}
                    </p>
                  </div>

                  <div>
                    <input
                      v-model="form.rt"
                      @input="handleNumericInput('rt')"
                      type="text"
                      inputmode="numeric"
                      placeholder="RT"
                      class="w-full border border-luxe-sand rounded-2xl px-6 py-5 outline-none focus:border-luxe-royal transition bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50"
                    />

                    <p v-if="errors.rt" class="text-red-500 text-sm mt-2">
                      {{ errors.rt }}
                    </p>
                  </div>

                  <div>
                    <input
                      v-model="form.rw"
                      @input="handleNumericInput('rw')"
                      type="text"
                      inputmode="numeric"
                      placeholder="RW"
                      class="w-full border border-luxe-sand rounded-2xl px-6 py-5 outline-none focus:border-luxe-royal transition bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50"
                    />

                    <p v-if="errors.rw" class="text-red-500 text-sm mt-2">
                      {{ errors.rw }}
                    </p>
                  </div>

                  <div class="md:col-span-2">
                    <input
                      v-model="form.postalCode"
                      @input="handleNumericInput('postalCode')"
                      type="text"
                      inputmode="numeric"
                      placeholder="Postal Code"
                      class="w-full border border-luxe-sand rounded-2xl px-6 py-5 outline-none focus:border-luxe-royal transition bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50"
                    />

                    <p
                      v-if="errors.postalCode"
                      class="text-red-500 text-sm mt-2"
                    >
                      {{ errors.postalCode }}
                    </p>
                  </div>

                  <div class="md:col-span-2">
                    <textarea
                      v-model="form.addressDetail"
                      placeholder="Street name, house number, building, landmark"
                      rows="5"
                      class="w-full border border-luxe-sand rounded-2xl px-6 py-5 outline-none focus:border-luxe-royal transition resize-none bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50"
                    ></textarea>

                    <p
                      v-if="errors.addressDetail"
                      class="text-red-500 text-sm mt-2"
                    >
                      {{ errors.addressDetail }}
                    </p>
                  </div>
                </div>

                <p v-if="errors.address" class="text-red-500 text-sm mt-2">
                  {{ errors.address }}
                </p>
              </div>

              <!-- SHIPPING METHOD -->
              <div>
                <div class="flex items-center justify-between gap-4 mb-3">
                  <label class="block text-sm text-luxe-brown/75">
                    Shipping Method
                  </label>

                  <span
                    v-if="isFreeShippingUnlocked"
                    class="text-xs bg-luxe-espresso text-luxe-ivory px-4 py-2 rounded-full"
                  >
                    Free shipping unlocked
                  </span>
                </div>

                <div class="grid sm:grid-cols-2 gap-4">
                  <button
                    v-for="method in shippingMethods"
                    :key="method.value"
                    type="button"
                    @click="form.shippingMethod = method.value"
                    :class="
                      form.shippingMethod === method.value
                        ? 'bg-luxe-espresso text-luxe-ivory shadow-lg shadow-luxe-brown/20'
                        : 'border border-luxe-sand bg-luxe-ivory text-luxe-espresso hover:border-luxe-royal hover:bg-luxe-cream'
                    "
                    class="rounded-2xl px-5 py-4 text-left transition"
                  >
                    <div class="flex items-start justify-between gap-4">
                      <div>
                        <p class="font-semibold">
                          {{ method.label }}
                        </p>

                        <p
                          :class="
                            form.shippingMethod === method.value
                              ? 'text-luxe-sand'
                              : 'text-luxe-brown/70'
                          "
                          class="text-sm mt-1"
                        >
                          {{ method.description }}
                        </p>
                      </div>

                      <span
                        :class="
                          form.shippingMethod === method.value
                            ? 'text-luxe-ivory'
                            : 'text-luxe-espresso'
                        "
                        class="text-sm font-semibold whitespace-nowrap"
                      >
                        {{
                          isFreeShippingUnlocked
                            ? "Free"
                            : formatCurrency(method.cost)
                        }}
                      </span>
                    </div>
                  </button>
                </div>

                <!-- FREE SHIPPING PROGRESS -->
                <div
                  class="mt-5 bg-luxe-cream border border-luxe-sand/60 rounded-3xl p-5"
                >
                  <div class="flex items-center justify-between gap-4 mb-3">
                    <p class="text-sm font-semibold text-luxe-espresso">
                      Free Shipping Progress
                    </p>

                    <p class="text-xs text-luxe-brown/70">
                      {{ freeShippingProgress }}%
                    </p>
                  </div>

                  <div
                    class="w-full h-2 bg-luxe-ivory rounded-full overflow-hidden mb-3"
                  >
                    <div
                      class="h-full bg-luxe-espresso rounded-full transition-all duration-500"
                      :style="{ width: `${freeShippingProgress}%` }"
                    ></div>
                  </div>

                  <p class="text-sm text-luxe-brown/75 leading-6">
                    <span v-if="remainingForFreeShipping > 0">
                      Add {{ formatCurrency(remainingForFreeShipping) }} more
                      selected items to unlock free shipping.
                    </span>

                    <span v-else>
                      Congratulations, your selected items qualify for free
                      shipping.
                    </span>
                  </p>
                </div>
              </div>

              <!-- PAYMENT METHOD -->
              <div>
                <label class="block text-sm text-luxe-brown/75 mb-3">
                  Payment Method
                </label>

                <div
                  v-if="isLoadingPaymentMethods"
                  class="bg-luxe-cream border border-luxe-sand/60 rounded-3xl p-5 text-luxe-brown/75"
                >
                  Loading payment methods...
                </div>

                <div
                  v-else-if="paymentMethodError"
                  class="bg-red-50 border border-red-100 text-red-600 rounded-3xl p-5"
                >
                  {{ paymentMethodError }}
                </div>

                <div
                  v-else-if="paymentMethods.length === 0"
                  class="bg-luxe-cream border border-luxe-sand/60 rounded-3xl p-5 text-luxe-brown/75"
                >
                  No active payment method available. Please contact admin.
                </div>

                <div v-else>
                  <div class="grid sm:grid-cols-2 gap-4">
                    <button
                      v-for="method in paymentMethods"
                      :key="method.code"
                      type="button"
                      @click="form.paymentMethod = method.code"
                      :class="
                        form.paymentMethod === method.code
                          ? 'bg-luxe-espresso text-luxe-ivory shadow-lg shadow-luxe-brown/20'
                          : 'border border-luxe-sand bg-luxe-ivory text-luxe-espresso hover:border-luxe-royal hover:bg-luxe-cream'
                      "
                      class="rounded-2xl px-5 py-4 text-left transition"
                    >
                      <div class="flex items-start justify-between gap-4">
                        <div>
                          <p class="font-semibold">
                            {{ method.name }}
                          </p>

                          <!-- isi detail payment kamu lanjutkan di sini -->
                        </div>
                      </div>
                    </button>
                  </div>

                  <p
                    v-if="errors.paymentMethod"
                    class="text-red-500 text-sm mt-2"
                  >
                    {{ errors.paymentMethod }}
                  </p>
                </div>
              </div>
            </form>
          </div>

          <!-- RIGHT -->
          <div>
            <div
              class="bg-luxe-ivory border border-luxe-sand/70 shadow-[0_24px_80px_rgba(92,56,36,0.16)] p-8 md:p-10 rounded-[2rem] sticky top-28"
            >
              <div class="flex items-center justify-between mb-10">
                <h2 class="text-3xl font-bold text-luxe-espresso">
                  Order Summary
                </h2>

                <span class="text-sm text-luxe-brown/70">
                  {{ cartStore.selectedTotalItems }} selected item
                </span>
              </div>

              <!-- ITEMS -->
              <div class="space-y-6 mb-10 max-h-[420px] overflow-y-auto pr-2">
                <div
                  v-for="item in cartStore.selectedItems"
                  :key="`${item.id}-${item.size}`"
                  class="flex items-center gap-5"
                >
                  <ProductImage
                    :src="item.image"
                    :alt="item.title"
                    class="w-24 h-24 object-cover rounded-2xl"
                  />

                  <div class="flex-1">
                    <h3 class="font-semibold leading-snug">
                      {{ item.title }}
                    </h3>

                    <p class="text-luxe-brown/70 text-sm mt-1">
                      Size: {{ item.size }}
                    </p>

                    <p class="text-luxe-brown/70 text-sm">
                      Qty: {{ item.quantity }}
                    </p>
                  </div>

                  <p class="font-bold text-right">
                    {{ formatCurrency(item.price * item.quantity) }}
                  </p>
                </div>
              </div>

              <!-- VOUCHER -->
              <div class="mb-8 border-t border-luxe-sand pt-6">
                <label class="block text-sm text-luxe-brown/75 mb-3">
                  Voucher Code
                </label>

                <div
                  v-if="!appliedVoucher"
                  class="flex flex-col sm:flex-row gap-3"
                >
                  <input
                    v-model="voucherCode"
                    @keyup.enter="applyVoucher"
                    type="text"
                    placeholder="Enter voucher code"
                    class="flex-1 border border-luxe-sand rounded-full px-5 py-4 outline-none focus:border-luxe-royal transition bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50"
                  />

                  <button
                    @click="applyVoucher"
                    type="button"
                    class="bg-luxe-espresso text-luxe-ivory px-6 py-4 rounded-full hover:bg-luxe-royal hover:scale-105 transition"
                  >
                    Apply
                  </button>
                </div>

                <div
                  v-else
                  class="bg-luxe-ivory rounded-3xl p-5 flex items-start justify-between gap-4"
                >
                  <div>
                    <p class="font-semibold">
                      {{ appliedVoucher.code }}
                    </p>

                    <p class="text-sm text-luxe-brown/70 mt-1">
                      <span v-if="appliedVoucher.discountType === 'percentage'">
                        {{ appliedVoucher.discountValue }}% off
                      </span>

                      <span v-else>
                        {{ formatCurrency(appliedVoucher.discountAmount) }} off
                      </span>
                    </p>
                  </div>

                  <button
                    @click="removeVoucher"
                    type="button"
                    class="text-sm text-luxe-brown/60 hover:text-luxe-espresso transition"
                  >
                    Remove
                  </button>
                </div>

                <p v-if="voucherError" class="text-red-500 text-sm mt-3">
                  {{ voucherError }}
                </p>

                <p v-else class="text-luxe-brown/60 text-sm mt-3">
                  Try code:
                  <span class="font-semibold text-luxe-royal"> LRDISC10 </span>
                </p>
              </div>

              <!-- PRICE DETAIL -->
              <div class="space-y-4 border-t border-luxe-sand pt-6 mb-8">
                <div class="flex items-center justify-between">
                  <span class="text-luxe-brown/70">Subtotal</span>

                  <span class="font-semibold">
                    {{ formatCurrency(cartStore.selectedTotalPrice) }}
                  </span>
                </div>

                <div
                  v-if="discountAmount > 0"
                  class="flex items-center justify-between"
                >
                  <span class="text-luxe-brown/70">
                    Discount
                    <span v-if="appliedVoucher">
                      ({{ appliedVoucher.code }})
                    </span>
                  </span>

                  <span class="font-semibold text-green-600">
                    -{{ formatCurrency(discountAmount) }}
                  </span>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-luxe-brown/70">Shipping</span>

                  <span class="font-semibold">
                    {{ shippingLabel }}
                  </span>
                </div>

                <div
                  class="flex items-center justify-between text-xl pt-4 border-t border-luxe-sand"
                >
                  <span>Total</span>

                  <span class="text-3xl font-bold">
                    {{ formatCurrency(grandTotal) }}
                  </span>
                </div>
              </div>

              <!-- BUTTON -->
              <button
                @click="placeOrder"
                :disabled="!isFormValid || isSubmitting"
                :class="
                  isFormValid && !isSubmitting
                    ? 'bg-luxe-espresso text-luxe-ivory hover:bg-luxe-royal hover:scale-[1.02] shadow-lg shadow-luxe-brown/20'
                    : 'bg-luxe-sand/60 text-luxe-brown/60 cursor-not-allowed'
                "
                class="w-full py-5 rounded-full text-lg transition flex items-center justify-center gap-3"
              >
                <span
                  v-if="isSubmitting"
                  class="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"
                ></span>

                <span>
                  {{ isSubmitting ? "Processing Order..." : "Place Order" }}
                </span>
              </button>

              <p
                v-if="!isFormValid"
                class="text-center text-sm text-luxe-brown/60 mt-4"
              >
                Complete shipping information to place order.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";

import Navbar from "../components/layout/Navbar.vue";
import CartSidebar from "../components/layout/CartSidebar.vue";
import ProductImage from "../components/ui/ProductImage.vue";
import Footer from "../components/layout/Footer.vue";

import { useCartStore } from "../stores/cartStore";
import { useToastStore } from "../stores/toastStore";
import { useOrderStore } from "../stores/orderStore";
import { useAuthStore } from "../stores/authStore";

import { formatCurrency } from "../utils/formatCurrency";
import { voucherService } from "../services/voucherService";
import { orderService } from "../services/orderService";
import { paymentMethodService } from "../services/paymentMethodService";

const router = useRouter();

const cartStore = useCartStore();
const toastStore = useToastStore();
const orderStore = useOrderStore();
const authStore = useAuthStore();

const errors = ref({});
const isSubmitting = ref(false);

const voucherCode = ref("");
const appliedVoucher = ref(null);
const voucherError = ref("");

const FREE_SHIPPING_TARGET = 2000000;

const form = reactive({
  fullName: "",
  email: "",
  phone: "",
  province: "",
  city: "",
  district: "",
  village: "",
  rt: "",
  rw: "",
  postalCode: "",
  addressDetail: "",
  shippingMethod: "standard",
  paymentMethod: "",
});

/*
|--------------------------------------------------------------------------
| Checkout Draft Autosave
|--------------------------------------------------------------------------
*/

const CHECKOUT_DRAFT_PREFIX = "checkoutFormDraft";

const getCheckoutDraftKey = () => {
  const userId = authStore.user?.id || "guest";
  return `${CHECKOUT_DRAFT_PREFIX}:user:${userId}`;
};

const checkoutDraftFields = [
  "fullName",
  "email",
  "phone",
  "province",
  "city",
  "district",
  "village",
  "rt",
  "rw",
  "postalCode",
  "addressDetail",
  "shippingMethod",
  "paymentMethod",
];

const saveCheckoutDraft = () => {
  const draft = {};

  checkoutDraftFields.forEach((field) => {
    draft[field] = form[field];
  });

  sessionStorage.setItem(getCheckoutDraftKey(), JSON.stringify(draft));
};

const loadCheckoutDraft = () => {
  try {
    const savedDraft = sessionStorage.getItem(getCheckoutDraftKey());

    if (!savedDraft) return;

    const draft = JSON.parse(savedDraft);

    checkoutDraftFields.forEach((field) => {
      if (draft[field] !== undefined) {
        form[field] = draft[field];
      }
    });
  } catch (error) {
    console.error("Failed to load checkout draft:", error);
  }
};

const clearCheckoutDraft = () => {
  sessionStorage.removeItem(getCheckoutDraftKey());
};

watch(
  form,
  () => {
    saveCheckoutDraft();
  },
  {
    deep: true,
  },
);

/*
|--------------------------------------------------------------------------
| Shipping
|--------------------------------------------------------------------------
*/

const shippingMethods = [
  {
    label: "Standard Delivery",
    value: "standard",
    description: "2-4 working days",
    cost: 20000,
  },
  {
    label: "Express Delivery",
    value: "express",
    description: "1-2 working days",
    cost: 35000,
  },
];

const selectedShippingMethod = computed(() => {
  return shippingMethods.find((method) => method.value === form.shippingMethod);
});

const isFreeShippingUnlocked = computed(() => {
  return cartStore.selectedTotalPrice >= FREE_SHIPPING_TARGET;
});

const remainingForFreeShipping = computed(() => {
  return Math.max(FREE_SHIPPING_TARGET - cartStore.selectedTotalPrice, 0);
});

const freeShippingProgress = computed(() => {
  if (cartStore.selectedTotalPrice <= 0) return 0;

  return Math.min(
    Math.round((cartStore.selectedTotalPrice / FREE_SHIPPING_TARGET) * 100),
    100,
  );
});

const shippingCost = computed(() => {
  if (isFreeShippingUnlocked.value) return 0;

  return selectedShippingMethod.value?.cost || 0;
});

const shippingLabel = computed(() => {
  return shippingCost.value === 0 ? "Free" : formatCurrency(shippingCost.value);
});

/*
|--------------------------------------------------------------------------
| Payment Methods
|--------------------------------------------------------------------------
*/

const paymentMethods = ref([]);
const isLoadingPaymentMethods = ref(false);
const paymentMethodError = ref("");

const selectedPaymentMethod = computed(() => {
  return (
    paymentMethods.value.find((method) => method.code === form.paymentMethod) ||
    null
  );
});

const loadPaymentMethods = async () => {
  isLoadingPaymentMethods.value = true;
  paymentMethodError.value = "";

  try {
    paymentMethods.value = await paymentMethodService.getActivePaymentMethods();

    const selectedMethodStillExists = paymentMethods.value.some(
      (method) => method.code === form.paymentMethod,
    );

    if (form.paymentMethod && !selectedMethodStillExists) {
      form.paymentMethod = "";
    }
  } catch (error) {
    console.error("Failed to load payment methods:", error);

    paymentMethodError.value =
      error?.message || "Failed to load payment methods.";
  } finally {
    isLoadingPaymentMethods.value = false;
  }
};

/*
|--------------------------------------------------------------------------
| Totals
|--------------------------------------------------------------------------
*/

const discountAmount = computed(() => {
  if (!appliedVoucher.value) return 0;

  return Number(appliedVoucher.value.discountAmount || 0);
});

const grandTotal = computed(() => {
  return Math.max(
    cartStore.selectedTotalPrice - discountAmount.value + shippingCost.value,
    0,
  );
});

/*
|--------------------------------------------------------------------------
| Form Validation
|--------------------------------------------------------------------------
*/

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isFormValid = computed(() => {
  return (
    form.fullName.trim() !== "" &&
    isValidEmail(form.email) &&
    form.phone.trim() !== "" &&
    form.phone.length >= 8 &&
    form.province.trim() !== "" &&
    form.city.trim() !== "" &&
    form.district.trim() !== "" &&
    form.village.trim() !== "" &&
    form.rt.trim() !== "" &&
    form.rw.trim() !== "" &&
    form.postalCode.trim() !== "" &&
    form.addressDetail.trim() !== "" &&
    String(form.paymentMethod || "").trim() !== "" &&
    !cartStore.isEmpty &&
    cartStore.hasSelectedItems
  );
});

const normalizePhoneNumber = (phone) => {
  const digits = String(phone || "")
    .replace(/\D/g, "")
    .replace(/^0+/, "");

  return `62${digits}`;
};

const handlePhoneInput = () => {
  form.phone = String(form.phone || "")
    .replace(/\D/g, "")
    .replace(/^0+/, "");
};

const handleNumericInput = (field) => {
  form[field] = String(form[field] || "").replace(/\D/g, "");
};

const buildFullAddress = () => {
  return [
    form.addressDetail,
    `Kel. ${form.village}`,
    `Kec. ${form.district}`,
    form.city,
    form.province,
    `RT ${form.rt}/RW ${form.rw}`,
    form.postalCode,
  ]
    .filter(Boolean)
    .join(", ");
};

const validateForm = () => {
  const validationErrors = {};

  if (!form.fullName.trim()) {
    validationErrors.fullName = "Full name is required.";
  }

  if (!form.email.trim()) {
    validationErrors.email = "Email address is required.";
  } else if (!isValidEmail(form.email)) {
    validationErrors.email = "Please enter a valid email address.";
  }

  if (!form.phone.trim()) {
    validationErrors.phone = "Phone number is required.";
  } else if (form.phone.length < 8) {
    validationErrors.phone = "Phone number is too short.";
  }

  if (!form.province.trim()) {
    validationErrors.province = "Province is required.";
  }

  if (!form.city.trim()) {
    validationErrors.city = "City or regency is required.";
  }

  if (!form.district.trim()) {
    validationErrors.district = "District is required.";
  }

  if (!form.village.trim()) {
    validationErrors.village = "Village is required.";
  }

  if (!form.rt.trim()) {
    validationErrors.rt = "RT is required.";
  }

  if (!form.rw.trim()) {
    validationErrors.rw = "RW is required.";
  }

  if (!form.postalCode.trim()) {
    validationErrors.postalCode = "Postal code is required.";
  }

  if (!form.addressDetail.trim()) {
    validationErrors.addressDetail = "Address detail is required.";
  }

  if (!form.paymentMethod) {
    validationErrors.paymentMethod = "Payment method is required.";
  }

  errors.value = validationErrors;

  return Object.keys(validationErrors).length === 0;
};

/*
|--------------------------------------------------------------------------
| Voucher
|--------------------------------------------------------------------------
*/

const applyVoucher = async () => {
  voucherError.value = "";

  if (!voucherCode.value.trim()) {
    voucherError.value = "Please enter voucher code.";
    return;
  }

  if (cartStore.selectedTotalPrice <= 0) {
    voucherError.value = "Voucher can only be used when selected item exists.";
    return;
  }

  try {
    const voucher = await voucherService.validateVoucher(
      voucherCode.value,
      cartStore.selectedTotalPrice,
    );

    appliedVoucher.value = voucher;
    voucherCode.value = voucher.code;
    voucherError.value = "";

    toastStore.showToast({
      title: "Voucher Applied",
      message: `${voucher.code} has been applied successfully.`,
      type: "success",
    });
  } catch (error) {
    appliedVoucher.value = null;
    voucherError.value = error?.message || "Invalid voucher code.";

    toastStore.showToast({
      title: "Invalid Voucher",
      message: error?.message || "The voucher code you entered is not valid.",
      type: "error",
    });
  }
};

const removeVoucher = () => {
  appliedVoucher.value = null;
  voucherCode.value = "";
  voucherError.value = "";

  toastStore.showToast({
    title: "Voucher Removed",
    message: "Your voucher has been removed from this order.",
    type: "info",
  });
};

/*
|--------------------------------------------------------------------------
| Place Order
|--------------------------------------------------------------------------
*/

const generateOrderNumber = () => {
  return `LXZ-${Date.now().toString().slice(-6)}`;
};

const placeOrder = async () => {
  if (isSubmitting.value) return;

  const isValid = validateForm();

  if (!isValid || cartStore.isEmpty || !cartStore.hasSelectedItems) return;

  if (!form.paymentMethod) {
    toastStore.showToast({
      title: "Payment Method Required",
      message: "Please select a payment method before placing your order.",
      type: "error",
    });

    return;
  }

  isSubmitting.value = true;

  try {
    const fullAddress = buildFullAddress();

    const orderPayload = {
      customer_name: form.fullName,
      customer_email: form.email,
      customer_phone: normalizePhoneNumber(form.phone),
      customer_address: fullAddress,

      customer_province: form.province,
      customer_city: form.city,
      customer_district: form.district,
      customer_village: form.village,
      customer_rt: form.rt,
      customer_rw: form.rw,
      customer_postal_code: form.postalCode,
      customer_address_detail: form.addressDetail,

      payment_method_code: form.paymentMethod,
      voucher_code: appliedVoucher.value ? appliedVoucher.value.code : null,

      items: cartStore.selectedItems.map((item) => ({
        product_id: item.product_id || item.productId || item.id,
        slug: item.slug || null,
        size: item.size || null,
        quantity: Number(item.quantity || 1),
      })),
    };

    const createdOrder = await orderService.createOrder(orderPayload);

    const order = {
      orderNumber:
        createdOrder?.order_code ||
        createdOrder?.order?.order_code ||
        generateOrderNumber(),

      customer: {
        fullName: form.fullName,
        email: form.email,
        phone: normalizePhoneNumber(form.phone),
        address: fullAddress,
        province: form.province,
        city: form.city,
        district: form.district,
        village: form.village,
        rt: form.rt,
        rw: form.rw,
        postalCode: form.postalCode,
        addressDetail: form.addressDetail,
      },

      shippingMethod: form.shippingMethod,
      shippingMethodLabel: selectedShippingMethod.value?.label,
      paymentMethod: form.paymentMethod,
      paymentMethodData: selectedPaymentMethod.value,

      items: cartStore.selectedItems,

      subtotal: cartStore.selectedTotalPrice,

      voucher: appliedVoucher.value
        ? {
            code: appliedVoucher.value.code,
            label: appliedVoucher.value.label,
            discountType: appliedVoucher.value.discountType,
            discountValue: appliedVoucher.value.discountValue,
            discountAmount: appliedVoucher.value.discountAmount,
          }
        : null,

      discountAmount: discountAmount.value,
      freeShippingUnlocked: isFreeShippingUnlocked.value,
      shippingCost: shippingCost.value,
      total: grandTotal.value,
      status: createdOrder?.status || createdOrder?.order?.status || "pending",
      backendOrder: createdOrder,
      createdAt: new Date().toISOString(),
    };

    sessionStorage.setItem("lastOrder", JSON.stringify(order));

    clearCheckoutDraft();

    orderStore.addOrder(order);

    cartStore.removeSelectedItems();

    toastStore.showToast({
      title: "Order Placed",
      message: `Order ${order.orderNumber} has been created successfully.`,
      type: "success",
      duration: 3500,
    });

    router.push("/checkout/success");
  } catch (error) {
    const stockError = error?.data || error?.response?.data?.data || null;

    if (
      error?.message?.toLowerCase().includes("insufficient stock") &&
      stockError?.product_id
    ) {
      cartStore.removeItem(stockError.product_id, stockError.size);

      toastStore.showToast({
        title: "Stock Not Available",
        message: `${stockError.product_name} size ${stockError.size} is out of stock and has been removed from your cart.`,
        type: "error",
        duration: 5000,
      });

      return;
    }

    toastStore.showToast({
      title: "Order Failed",
      message: error?.message || "Failed to create order. Please try again.",
      type: "error",
      duration: 4000,
    });
  } finally {
    isSubmitting.value = false;
  }
};

/*
|--------------------------------------------------------------------------
| Lifecycle
|--------------------------------------------------------------------------
*/

onMounted(async () => {
  loadCheckoutDraft();

  await loadPaymentMethods();
});
</script>
