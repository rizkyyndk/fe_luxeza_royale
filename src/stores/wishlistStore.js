import { defineStore } from "pinia";

const WISHLIST_STORAGE_KEY = "wishlist";

const loadWishlistFromStorage = () => {
  try {
    const savedWishlist = sessionStorage.getItem(WISHLIST_STORAGE_KEY);
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  } catch (error) {
    console.error("Failed to load wishlist from sessionStorage:", error);
    return [];
  }
};

export const useWishlistStore = defineStore("wishlist", {
  state: () => ({
    items: loadWishlistFromStorage(),
  }),

  getters: {
    totalWishlistItems: (state) => state.items.length,

    isEmpty: (state) => state.items.length === 0,

    isInWishlist: (state) => {
      return (productId) => state.items.some((item) => item.id === productId);
    },
  },

  actions: {
    saveWishlist() {
      sessionStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(this.items));
    },

    addToWishlist(product) {
      const exists = this.items.some((item) => item.id === product.id);

      if (!exists) {
        this.items.push(product);
        this.saveWishlist();
      }
    },

    removeFromWishlist(productId) {
      this.items = this.items.filter((item) => item.id !== productId);
      this.saveWishlist();
    },

    toggleWishlist(product) {
      if (this.isInWishlist(product.id)) {
        this.removeFromWishlist(product.id);
      } else {
        this.addToWishlist(product);
      }
    },

    clearWishlist() {
      this.items = [];
      sessionStorage.removeItem(WISHLIST_STORAGE_KEY);
    },
  },
});
