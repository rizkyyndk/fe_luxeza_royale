<template>
  <div v-if="uiStore.isCartOpen">
    <!-- OVERLAY -->
    <div
      @click="uiStore.closeCart()"
      class="fixed inset-0 bg-luxe-espresso/45 backdrop-blur-sm z-40"
    ></div>

    <!-- SIDEBAR -->
    <aside
      class="fixed top-0 right-0 w-full sm:w-[440px] h-screen bg-luxe-ivory border-l border-luxe-sand/60 shadow-[0_24px_90px_rgba(92,56,36,0.22)] z-50 flex flex-col"
    >
      <!-- HEADER -->
      <div
        class="p-6 border-b border-luxe-sand/60 flex items-center justify-between"
      >
        <div>
          <p class="uppercase tracking-[3px] text-xs text-luxe-brown/70 mb-1">
            Shopping Bag
          </p>

          <h2 class="text-2xl font-bold">Your Cart</h2>

          <p class="text-sm text-luxe-brown/70 mt-1">
            {{ cartStore.totalItems }} item in cart
          </p>
        </div>

        <button
          @click="uiStore.closeCart()"
          class="w-10 h-10 rounded-full border border-luxe-sand text-luxe-espresso flex items-center justify-center text-2xl leading-none hover:bg-luxe-espresso hover:text-luxe-ivory transition"
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

        <p class="text-luxe-brown/70 mb-8 leading-7">
          Discover our luxury collection and add your favorite pieces.
        </p>

        <button
          @click="goToProducts"
          class="bg-luxe-espresso text-luxe-ivory px-8 py-4 rounded-full hover:bg-luxe-royal hover:scale-105 transition shadow-lg shadow-luxe-brown/20"
        >
          Start Shopping
        </button>
      </div>

      <!-- CART CONTENT -->
      <template v-else>
        <!-- CART SUMMARY -->
        <div class="px-6 py-5 border-b border-luxe-sand/60 bg-luxe-cream">
          <div class="grid grid-cols-2 gap-4 mb-5">
            <div
              class="bg-luxe-ivory rounded-3xl p-4 border border-luxe-sand/50 shadow-sm"
            >
              <p class="text-xs text-luxe-brown/70 mb-1">Selected Items</p>

              <p class="text-xl font-bold">
                {{ cartStore.selectedTotalItems }}
              </p>
            </div>

            <div
              class="bg-luxe-ivory rounded-3xl p-4 border border-luxe-sand/50 shadow-sm"
            >
              <p class="text-xs text-luxe-brown/70 mb-1">Selected Total</p>

              <p class="text-xl font-bold">
                {{ formatPrice(cartStore.selectedTotalPrice) }}
              </p>
            </div>
          </div>

          <!-- FREE SHIPPING PROGRESS -->
          <div
            class="bg-luxe-ivory rounded-3xl p-4 border border-luxe-sand/50 shadow-sm"
          >
            <div class="flex items-center justify-between gap-4 mb-3">
              <p class="text-sm font-semibold">Free Shipping Progress</p>

              <p class="text-xs text-luxe-brown/70">
                {{ freeShippingProgress }}%
              </p>
            </div>

            <div
              class="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3"
            >
              <div
                class="h-full bg-luxe-espresso rounded-full transition-all duration-500"
                :style="{ width: `${freeShippingProgress}%` }"
              ></div>
            </div>

            <p class="text-xs text-luxe-brown/70 leading-5">
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
          class="px-6 py-4 border-b border-luxe-sand/60 flex items-center justify-between"
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
            class="text-sm text-luxe-brown/70 hover:text-red-500 transition"
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
                ? 'opacity-100 border-luxe-sand/70 bg-luxe-ivory shadow-sm'
                : 'opacity-55 border-luxe-sand/60 bg-gray-50'
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
                      class="text-[10px] uppercase tracking-[2px] bg-luxe-espresso text-luxe-ivory px-2 py-1 rounded-full"
                    >
                      Selected
                    </span>
                  </div>

                  <p class="text-luxe-brown/70 text-sm">
                    {{ formatPrice(item.price) }}
                  </p>

                  <p class="text-sm text-luxe-brown/70 mt-1">
                    Size: {{ item.size }}
                  </p>

                  <p class="text-sm text-luxe-brown/70 mt-1">
                    Stock: {{ item.stock }}
                  </p>
                </div>

                <button
                  @click="cartStore.removeItem(item.id, item.size)"
                  class="text-luxe-brown/60 hover:text-luxe-espresso transition"
                >
                  ×
                </button>
              </div>

              <!-- QUANTITY -->
              <div class="flex items-center justify-between mt-5">
                <div class="flex items-center gap-3">
                  <button
                    @click="cartStore.decreaseQuantity(item.id, item.size)"
                    class="w-8 h-8 rounded-full border border-luxe-sand text-luxe-espresso hover:bg-luxe-espresso hover:text-luxe-ivory transition"
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
                        : 'hover:bg-luxe-espresso hover:text-luxe-ivory'
                    "
                    class="w-8 h-8 rounded-full border border-luxe-sand/60 transition"
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
        <div class="p-6 border-t border-luxe-sand/60 bg-luxe-ivory">
          <div class="space-y-3 mb-6">
            <div class="flex items-center justify-between">
              <span class="text-luxe-brown/70"> Selected subtotal </span>

              <span class="font-semibold">
                {{ formatPrice(cartStore.selectedTotalPrice) }}
              </span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-luxe-brown/70"> Estimated shipping </span>

              <span class="font-semibold">
                {{ estimatedShippingLabel }}
              </span>
            </div>

            <div
              class="flex items-center justify-between border-t border-luxe-sand/60 pt-4"
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
                ? 'bg-luxe-espresso text-luxe-ivory hover:bg-luxe-royal hover:scale-[1.02] shadow-lg shadow-luxe-brown/20'
                : 'bg-luxe-sand/60 text-luxe-brown/60 cursor-not-allowed'
            "
            class="w-full py-4 rounded-full text-lg transition"
          >
            {{ checkoutButtonText }}
          </button>

          <button
            @click="cartStore.clearCart()"
            class="w-full mt-4 text-sm text-luxe-brown/70 hover:text-luxe-espresso transition"
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
