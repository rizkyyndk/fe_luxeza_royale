import { defineStore } from "pinia";

const AUTH_USER_KEY = "authUser";

const LEGACY_CART_STORAGE_KEY = "cart";
const GUEST_CART_STORAGE_KEY = "cart:guest";

const getStoredUserId = () => {
  try {
    const savedUser = sessionStorage.getItem(AUTH_USER_KEY);
    const user = savedUser ? JSON.parse(savedUser) : null;

    return user?.id || null;
  } catch (error) {
    console.error("Failed to load auth user for cart:", error);
    return null;
  }
};

const getCartStorageKey = (userId) => {
  return userId ? `cart:user:${userId}` : GUEST_CART_STORAGE_KEY;
};

const normalizeCartItems = (items) => {
  if (!Array.isArray(items)) return [];

  return items.map((item) => ({
    ...item,
    price: Number(item.price || 0),
    quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
    selected: item.selected ?? true,
  }));
};

const loadCartFromStorage = (storageKey) => {
  try {
    const savedCart = sessionStorage.getItem(storageKey);

    if (savedCart) {
      return normalizeCartItems(JSON.parse(savedCart));
    }

    if (storageKey === GUEST_CART_STORAGE_KEY) {
      const legacyCart = sessionStorage.getItem(LEGACY_CART_STORAGE_KEY);
      return legacyCart ? normalizeCartItems(JSON.parse(legacyCart)) : [];
    }

    return [];
  } catch (error) {
    console.error("Failed to load cart from sessionStorage:", error);
    return [];
  }
};

const hasStockLimit = (stock) => {
  return typeof stock === "number" && Number.isFinite(stock);
};

const mergeCartItems = (baseItems = [], incomingItems = []) => {
  const merged = [];

  const addItem = (item) => {
    const existingItem = merged.find(
      (cartItem) => cartItem.id === item.id && cartItem.size === item.size,
    );

    if (existingItem) {
      const nextQuantity =
        Number(existingItem.quantity || 1) + Number(item.quantity || 1);

      existingItem.quantity = hasStockLimit(existingItem.stock)
        ? Math.min(nextQuantity, existingItem.stock)
        : nextQuantity;

      existingItem.selected = item.selected ?? existingItem.selected ?? true;
    } else {
      merged.push({
        ...item,
        quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
        selected: item.selected ?? true,
      });
    }
  };

  normalizeCartItems(baseItems).forEach(addItem);
  normalizeCartItems(incomingItems).forEach(addItem);

  return merged;
};

const initialUserId = getStoredUserId();
const initialStorageKey = getCartStorageKey(initialUserId);

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: loadCartFromStorage(initialStorageKey),
    storageKey: initialStorageKey,
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
      sessionStorage.setItem(this.storageKey, JSON.stringify(this.items));
    },

    switchToUserCart(userId) {
      if (!userId) return;

      const userStorageKey = getCartStorageKey(userId);
      const savedUserCart = loadCartFromStorage(userStorageKey);

      this.items = mergeCartItems(savedUserCart, this.items);
      this.storageKey = userStorageKey;

      this.saveCart();

      sessionStorage.removeItem(GUEST_CART_STORAGE_KEY);
      sessionStorage.removeItem(LEGACY_CART_STORAGE_KEY);
    },

    resetToGuestEmpty() {
      this.storageKey = GUEST_CART_STORAGE_KEY;
      this.items = [];

      sessionStorage.removeItem(GUEST_CART_STORAGE_KEY);
      sessionStorage.removeItem(LEGACY_CART_STORAGE_KEY);
    },

    refreshForCurrentAuth() {
      const userId = getStoredUserId();
      const nextStorageKey = getCartStorageKey(userId);

      this.storageKey = nextStorageKey;
      this.items = loadCartFromStorage(nextStorageKey);
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
        existingProduct.price = Number(
          product.price || existingProduct.price || 0,
        );
        existingProduct.stock = product.stock;

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
      sessionStorage.removeItem(this.storageKey);
    },
  },
});
