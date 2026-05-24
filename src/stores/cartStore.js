import { defineStore } from "pinia";

const CART_STORAGE_KEY = "cart";

const normalizeCartItems = (items) => {
  if (!Array.isArray(items)) return [];

  return items.map((item) => ({
    ...item,
    quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
    selected: item.selected ?? true,
  }));
};

const loadCartFromStorage = () => {
  try {
    const savedCart = sessionStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? normalizeCartItems(JSON.parse(savedCart)) : [];
  } catch (error) {
    console.error("Failed to load cart from sessionStorage:", error);
    return [];
  }
};

const hasStockLimit = (stock) => {
  return typeof stock === "number" && Number.isFinite(stock);
};

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: loadCartFromStorage(),
  }),

  getters: {
    totalItems: (state) =>
      state.items.reduce((total, item) => total + item.quantity, 0),

    totalPrice: (state) =>
      state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ),

    selectedItems: (state) => state.items.filter((item) => item.selected),

    selectedTotalItems: (state) =>
      state.items
        .filter((item) => item.selected)
        .reduce((total, item) => total + item.quantity, 0),

    selectedTotalPrice: (state) =>
      state.items
        .filter((item) => item.selected)
        .reduce((total, item) => total + item.price * item.quantity, 0),

    isEmpty: (state) => state.items.length === 0,

    hasSelectedItems: (state) => state.items.some((item) => item.selected),
  },

  actions: {
    saveCart() {
      sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items));
    },

    addToCart(product, quantity = 1) {
      const requestedQuantity = Math.max(1, Number(quantity) || 1);
      const stock = product.stock;

      if (hasStockLimit(stock) && stock <= 0) {
        return;
      }

      const existingProduct = this.items.find(
        (item) => item.id === product.id && item.size === product.size,
      );

      if (existingProduct) {
        const nextQuantity = existingProduct.quantity + requestedQuantity;

        existingProduct.quantity = hasStockLimit(existingProduct.stock)
          ? Math.min(nextQuantity, existingProduct.stock)
          : nextQuantity;

        existingProduct.selected = true;
      } else {
        this.items.push({
          ...product,
          quantity: hasStockLimit(stock)
            ? Math.min(requestedQuantity, stock)
            : requestedQuantity,
          selected: true,
        });
      }

      this.saveCart();
    },

    increaseQuantity(id, size) {
      const product = this.items.find(
        (item) => item.id === id && item.size === size,
      );

      if (!product) return;

      if (hasStockLimit(product.stock) && product.quantity >= product.stock) {
        return;
      }

      product.quantity++;
      this.saveCart();
    },

    decreaseQuantity(id, size) {
      const product = this.items.find(
        (item) => item.id === id && item.size === size,
      );

      if (!product) return;

      if (product.quantity > 1) {
        product.quantity--;
      } else {
        this.removeItem(id, size);
        return;
      }

      this.saveCart();
    },

    removeItem(id, size) {
      this.items = this.items.filter(
        (item) => !(item.id === id && item.size === size),
      );

      this.saveCart();
    },

    toggleItemSelection(id, size) {
      const product = this.items.find(
        (item) => item.id === id && item.size === size,
      );

      if (product) {
        product.selected = !product.selected;
      }

      this.saveCart();
    },

    selectAllItems() {
      this.items = this.items.map((item) => ({
        ...item,
        selected: true,
      }));

      this.saveCart();
    },

    unselectAllItems() {
      this.items = this.items.map((item) => ({
        ...item,
        selected: false,
      }));

      this.saveCart();
    },

    removeSelectedItems() {
      this.items = this.items.filter((item) => !item.selected);
      this.saveCart();
    },

    clearCart() {
      this.items = [];
      sessionStorage.removeItem(CART_STORAGE_KEY);
    },
  },
});
