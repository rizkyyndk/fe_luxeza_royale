<template>
  <div v-if="uiStore.isCartOpen">
    <!-- OVERLAY -->
    <div
      @click="uiStore.closeCart()"
      class="fixed inset-0 bg-black/40 z-40"
    ></div>

    <!-- SIDEBAR -->
    <aside
      class="fixed top-0 right-0 w-full sm:w-[440px] h-screen bg-white shadow-2xl z-50 flex flex-col"
    >
      <!-- HEADER -->
      <div
        class="p-6 border-b border-gray-200 flex items-center justify-between"
      >
        <div>
          <p class="uppercase tracking-[3px] text-xs text-gray-400 mb-1">
            Shopping Bag
          </p>

          <h2 class="text-2xl font-bold">Your Cart</h2>

          <p class="text-sm text-gray-500 mt-1">
            {{ cartStore.totalItems }} item in cart
          </p>
        </div>

        <button
          @click="uiStore.closeCart()"
          class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-2xl leading-none hover:bg-black hover:text-white transition"
        >
          ×
        </button>
      </div>

      <!-- EMPTY -->
      <div
        v-if="cartStore.isEmpty"
        class="flex-1 flex flex-col items-center justify-center text-center px-8"
      >
        <p class="text-5xl mb-5">🛒</p>

        <h3 class="text-xl font-semibold mb-2">Your cart is empty</h3>

        <p class="text-gray-500 mb-8 leading-7">
          Discover our luxury collection and add your favorite pieces.
        </p>

        <button
          @click="goToProducts"
          class="bg-black text-white px-8 py-4 rounded-full hover:scale-105 transition"
        >
          Start Shopping
        </button>
      </div>

      <!-- CART CONTENT -->
      <template v-else>
        <!-- CART SUMMARY -->
        <div class="px-6 py-5 border-b border-gray-100 bg-[#f8f5f2]">
          <div class="grid grid-cols-2 gap-4 mb-5">
            <div class="bg-white rounded-3xl p-4">
              <p class="text-xs text-gray-400 mb-1">Selected Items</p>

              <p class="text-xl font-bold">
                {{ cartStore.selectedTotalItems }}
              </p>
            </div>

            <div class="bg-white rounded-3xl p-4">
              <p class="text-xs text-gray-400 mb-1">Selected Total</p>

              <p class="text-xl font-bold">
                {{ formatPrice(cartStore.selectedTotalPrice) }}
              </p>
            </div>
          </div>

          <!-- FREE SHIPPING PROGRESS -->
          <div class="bg-white rounded-3xl p-4">
            <div class="flex items-center justify-between gap-4 mb-3">
              <p class="text-sm font-semibold">Free Shipping Progress</p>

              <p class="text-xs text-gray-500">{{ freeShippingProgress }}%</p>
            </div>

            <div
              class="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3"
            >
              <div
                class="h-full bg-black rounded-full transition-all duration-500"
                :style="{ width: `${freeShippingProgress}%` }"
              ></div>
            </div>

            <p class="text-xs text-gray-500 leading-5">
              <span v-if="remainingForFreeShipping > 0">
                Add {{ formatPrice(remainingForFreeShipping) }} more selected
                items to get free shipping.
              </span>

              <span v-else>
                Congratulations, your selected items qualify for free shipping.
              </span>
            </p>
          </div>
        </div>

        <!-- SELECT ALL -->
        <div
          class="px-6 py-4 border-b border-gray-100 flex items-center justify-between"
        >
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              :checked="allItemsSelected"
              @change="toggleSelectAll"
              class="w-5 h-5 accent-black"
            />

            <span class="text-sm font-medium"> Select all items </span>
          </label>

          <button
            v-if="cartStore.hasSelectedItems"
            @click="cartStore.removeSelectedItems()"
            class="text-sm text-gray-400 hover:text-red-500 transition"
          >
            Remove selected
          </button>
        </div>

        <!-- ITEMS -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <div
            v-for="item in cartStore.items"
            :key="`${item.id}-${item.size}`"
            :class="
              item.selected
                ? 'opacity-100 border-black/10 bg-white'
                : 'opacity-55 border-gray-100 bg-gray-50'
            "
            class="flex gap-4 border rounded-3xl p-4 transition"
          >
            <!-- CHECKBOX -->
            <div class="pt-9">
              <input
                type="checkbox"
                :checked="item.selected"
                @change="cartStore.toggleItemSelection(item.id, item.size)"
                class="w-5 h-5 accent-black"
              />
            </div>

            <ProductImage
              :src="item.image"
              :alt="item.title"
              class="w-24 h-24 object-cover rounded-2xl"
            />

            <div class="flex-1">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="font-semibold leading-snug">
                      {{ item.title }}
                    </h3>

                    <span
                      v-if="item.selected"
                      class="text-[10px] uppercase tracking-[2px] bg-black text-white px-2 py-1 rounded-full"
                    >
                      Selected
                    </span>
                  </div>

                  <p class="text-gray-500 text-sm">
                    {{ formatPrice(item.price) }}
                  </p>

                  <p class="text-sm text-gray-400 mt-1">
                    Size: {{ item.size }}
                  </p>

                  <p class="text-sm text-gray-400 mt-1">
                    Stock: {{ item.stock }}
                  </p>
                </div>

                <button
                  @click="cartStore.removeItem(item.id, item.size)"
                  class="text-gray-400 hover:text-black transition"
                >
                  ×
                </button>
              </div>

              <!-- QUANTITY -->
              <div class="flex items-center justify-between mt-5">
                <div class="flex items-center gap-3">
                  <button
                    @click="cartStore.decreaseQuantity(item.id, item.size)"
                    class="w-8 h-8 rounded-full border border-gray-300 hover:bg-black hover:text-white transition"
                  >
                    -
                  </button>

                  <span class="min-w-6 text-center">
                    {{ item.quantity }}
                  </span>

                  <button
                    @click="cartStore.increaseQuantity(item.id, item.size)"
                    :disabled="
                      typeof item.stock === 'number' &&
                      item.quantity >= item.stock
                    "
                    :class="
                      typeof item.stock === 'number' &&
                      item.quantity >= item.stock
                        ? 'opacity-40 cursor-not-allowed'
                        : 'hover:bg-black hover:text-white'
                    "
                    class="w-8 h-8 rounded-full border border-gray-300 transition"
                  >
                    +
                  </button>
                </div>

                <p class="font-semibold">
                  {{ formatPrice(item.price * item.quantity) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- FOOTER -->
        <div class="p-6 border-t border-gray-200 bg-white">
          <div class="space-y-3 mb-6">
            <div class="flex items-center justify-between">
              <span class="text-gray-500"> Selected subtotal </span>

              <span class="font-semibold">
                {{ formatPrice(cartStore.selectedTotalPrice) }}
              </span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-gray-500"> Estimated shipping </span>

              <span class="font-semibold">
                {{ estimatedShippingLabel }}
              </span>
            </div>

            <div
              class="flex items-center justify-between border-t border-gray-100 pt-4"
            >
              <span class="text-lg"> Estimated total </span>

              <span class="text-2xl font-bold">
                {{ formatPrice(estimatedCartTotal) }}
              </span>
            </div>
          </div>

          <button
            @click="goToCheckout"
            :disabled="!cartStore.hasSelectedItems"
            :class="
              cartStore.hasSelectedItems
                ? 'bg-black text-white hover:scale-[1.02]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            "
            class="w-full py-4 rounded-full text-lg transition"
          >
            {{ checkoutButtonText }}
          </button>

          <button
            @click="cartStore.clearCart()"
            class="w-full mt-4 text-sm text-gray-500 hover:text-black transition"
          >
            Clear Cart
          </button>
        </div>
      </template>
    </aside>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

import ProductImage from "../ui/ProductImage.vue";

import { useCartStore } from "../../stores/cartStore";
import { useUiStore } from "../../stores/uiStore";
import { formatCurrency } from "../../utils/formatCurrency";

const cartStore = useCartStore();
const uiStore = useUiStore();

const router = useRouter();

const FREE_SHIPPING_TARGET = 2000000;
const DEFAULT_SHIPPING_COST = 20000;

const allItemsSelected = computed(() => {
  return (
    cartStore.items.length > 0 && cartStore.items.every((item) => item.selected)
  );
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

const estimatedShipping = computed(() => {
  if (!cartStore.hasSelectedItems) return 0;

  return remainingForFreeShipping.value === 0 ? 0 : DEFAULT_SHIPPING_COST;
});

const estimatedShippingLabel = computed(() => {
  if (!cartStore.hasSelectedItems) return "-";

  return estimatedShipping.value === 0
    ? "Free"
    : formatPrice(estimatedShipping.value);
});

const estimatedCartTotal = computed(() => {
  return cartStore.selectedTotalPrice + estimatedShipping.value;
});

const checkoutButtonText = computed(() => {
  if (!cartStore.hasSelectedItems) {
    return "Select Items to Checkout";
  }

  return `Checkout ${cartStore.selectedTotalItems} Selected Item`;
});

const formatPrice = (value) => {
  return formatCurrency(value);
};

const toggleSelectAll = () => {
  if (allItemsSelected.value) {
    cartStore.unselectAllItems();
  } else {
    cartStore.selectAllItems();
  }
};

const goToCheckout = () => {
  if (!cartStore.hasSelectedItems) return;

  uiStore.closeCart();
  router.push("/checkout");
};

const goToProducts = async () => {
  uiStore.closeCart();

  if (window.location.pathname !== "/") {
    await router.push("/");
  }

  setTimeout(() => {
    const el = document.getElementById("products");

    if (!el) return;

    const top = el.getBoundingClientRect().top + window.pageYOffset - 90;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  }, 150);
};
</script>
