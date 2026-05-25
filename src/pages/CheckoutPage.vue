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

            <p class="text-gray-500 mb-8">
              Please select at least one item from your cart before checkout.
            </p>

            <RouterLink
              to="/"
              class="bg-black text-white px-8 py-4 rounded-full inline-block hover:scale-105 transition"
            >
              Back to Collection
            </RouterLink>
          </div>
        </div>

        <!-- CHECKOUT CONTENT -->
        <div v-else class="grid lg:grid-cols-2 gap-20">
          <!-- LEFT -->
          <div>
            <p class="uppercase tracking-[4px] text-sm text-gray-500 mb-4">
              Checkout
            </p>

            <h1 class="text-4xl md:text-5xl font-bold mb-4">
              Shipping Information
            </h1>

            <p class="text-gray-500 mb-10 leading-7">
              Complete your details to continue the mock checkout process.
              Backend order submission will be integrated later.
            </p>

            <form class="space-y-6" @submit.prevent="placeOrder">
              <!-- FULL NAME -->
              <div>
                <input
                  v-model="form.fullName"
                  type="text"
                  placeholder="Full Name"
                  class="w-full border border-luxe-sand rounded-2xl px-6 py-5 outline-none focus:border-black transition"
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
                  class="w-full border border-luxe-sand rounded-2xl px-6 py-5 outline-none focus:border-black transition"
                />

                <p v-if="errors.email" class="text-red-500 text-sm mt-2">
                  {{ errors.email }}
                </p>
              </div>

              <!-- PHONE -->
              <div>
                <input
                  v-model="form.phone"
                  type="text"
                  placeholder="Phone Number"
                  class="w-full border border-luxe-sand rounded-2xl px-6 py-5 outline-none focus:border-black transition"
                />

                <p v-if="errors.phone" class="text-red-500 text-sm mt-2">
                  {{ errors.phone }}
                </p>
              </div>

              <!-- ADDRESS -->
              <div>
                <textarea
                  v-model="form.address"
                  placeholder="Shipping Address"
                  rows="5"
                  class="w-full border border-luxe-sand rounded-2xl px-6 py-5 outline-none focus:border-black transition resize-none"
                ></textarea>

                <p v-if="errors.address" class="text-red-500 text-sm mt-2">
                  {{ errors.address }}
                </p>
              </div>

              <!-- SHIPPING METHOD -->
              <div>
                <div class="flex items-center justify-between gap-4 mb-3">
                  <label class="block text-sm text-gray-500">
                    Shipping Method
                  </label>

                  <span
                    v-if="isFreeShippingUnlocked"
                    class="text-xs bg-black text-white px-4 py-2 rounded-full"
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
                        ? 'bg-black text-white'
                        : 'border border-luxe-sand hover:border-black'
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
                              ? 'text-gray-300'
                              : 'text-gray-500'
                          "
                          class="text-sm mt-1"
                        >
                          {{ method.description }}
                        </p>
                      </div>

                      <span
                        :class="
                          form.shippingMethod === method.value
                            ? 'text-white'
                            : 'text-black'
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
                <div class="mt-5 bg-luxe-cream rounded-3xl p-5">
                  <div class="flex items-center justify-between gap-4 mb-3">
                    <p class="text-sm font-semibold">Free Shipping Progress</p>

                    <p class="text-xs text-gray-500">
                      {{ freeShippingProgress }}%
                    </p>
                  </div>

                  <div
                    class="w-full h-2 bg-luxe-ivory rounded-full overflow-hidden mb-3"
                  >
                    <div
                      class="h-full bg-black rounded-full transition-all duration-500"
                      :style="{ width: `${freeShippingProgress}%` }"
                    ></div>
                  </div>

                  <p class="text-sm text-gray-500 leading-6">
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
                <label class="block text-sm text-gray-500 mb-3">
                  Payment Method
                </label>

                <div class="grid sm:grid-cols-2 gap-4">
                  <button
                    v-for="method in paymentMethods"
                    :key="method.value"
                    type="button"
                    @click="form.paymentMethod = method.value"
                    :class="
                      form.paymentMethod === method.value
                        ? 'bg-black text-white'
                        : 'border border-luxe-sand hover:border-black'
                    "
                    class="rounded-2xl px-5 py-4 text-left transition"
                  >
                    <p class="font-semibold">
                      {{ method.label }}
                    </p>

                    <p
                      :class="
                        form.paymentMethod === method.value
                          ? 'text-gray-300'
                          : 'text-gray-500'
                      "
                      class="text-sm mt-1"
                    >
                      {{ method.description }}
                    </p>
                  </button>
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

                <span class="text-sm text-gray-500">
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

                    <p class="text-gray-500 text-sm mt-1">
                      Size: {{ item.size }}
                    </p>

                    <p class="text-gray-500 text-sm">
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
                <label class="block text-sm text-gray-500 mb-3">
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
                    class="flex-1 border border-luxe-sand rounded-full px-5 py-4 outline-none focus:border-luxe-royal transition bg-white text-luxe-espresso placeholder:text-luxe-brown/50"
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

                    <p class="text-sm text-gray-500 mt-1">
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
                    class="text-sm text-gray-400 hover:text-black transition"
                  >
                    Remove
                  </button>
                </div>

                <p v-if="voucherError" class="text-red-500 text-sm mt-3">
                  {{ voucherError }}
                </p>

                <p v-else class="text-gray-400 text-sm mt-3">
                  Try code:
                  <span class="font-semibold text-luxe-royal"> LRDISC10 </span>
                </p>
              </div>

              <!-- PRICE DETAIL -->
              <div class="space-y-4 border-t border-luxe-sand pt-6 mb-8">
                <div class="flex items-center justify-between">
                  <span class="text-gray-500">Subtotal</span>

                  <span class="font-semibold">
                    {{ formatCurrency(cartStore.selectedTotalPrice) }}
                  </span>
                </div>

                <div
                  v-if="discountAmount > 0"
                  class="flex items-center justify-between"
                >
                  <span class="text-gray-500">
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
                  <span class="text-gray-500">Shipping</span>

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
                class="text-center text-sm text-gray-400 mt-4"
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
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";

import Navbar from "../components/layout/Navbar.vue";
import CartSidebar from "../components/layout/CartSidebar.vue";

import { useCartStore } from "../stores/cartStore";
import { useToastStore } from "../stores/toastStore";
import { formatCurrency } from "../utils/formatCurrency";
import ProductImage from "../components/ui/ProductImage.vue";
import Footer from "../components/layout/Footer.vue";
import { voucherService } from "../services/voucherService";
import { orderService } from "../services/orderService";
import { useOrderStore } from "../stores/orderStore";

const router = useRouter();
const cartStore = useCartStore();
const toastStore = useToastStore();
const orderStore = useOrderStore();

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
  address: "",
  shippingMethod: "standard",
  paymentMethod: "bank-transfer",
});

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

const paymentMethods = [
  {
    label: "Bank Transfer",
    value: "bank-transfer",
    description: "Manual payment confirmation",
  },
  {
    label: "Virtual Account",
    value: "virtual-account",
    description: "Frontend mock payment",
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

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isFormValid = computed(() => {
  return (
    form.fullName.trim() !== "" &&
    isValidEmail(form.email) &&
    form.phone.trim() !== "" &&
    form.address.trim() !== "" &&
    !cartStore.isEmpty &&
    cartStore.hasSelectedItems
  );
});

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
  }

  if (!form.address.trim()) {
    validationErrors.address = "Shipping address is required.";
  }

  errors.value = validationErrors;

  return Object.keys(validationErrors).length === 0;
};

const generateOrderNumber = () => {
  return `LXZ-${Date.now().toString().slice(-6)}`;
};

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

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

const placeOrder = async () => {
  if (isSubmitting.value) return;

  const isValid = validateForm();

  if (!isValid || cartStore.isEmpty || !cartStore.hasSelectedItems) return;

  isSubmitting.value = true;

  try {
    const orderPayload = {
      customer_name: form.fullName,
      customer_email: form.email,
      customer_phone: form.phone,
      customer_address: form.address,
      voucher_code: appliedVoucher.value ? appliedVoucher.value.code : null,
      shipping_method: form.shippingMethod,
      payment_method: form.paymentMethod,
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
        phone: form.phone,
        address: form.address,
      },

      shippingMethod: form.shippingMethod,
      shippingMethodLabel: selectedShippingMethod.value?.label,
      paymentMethod: form.paymentMethod,

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
</script>
