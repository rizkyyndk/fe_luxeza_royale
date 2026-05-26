import { defineStore } from "pinia";

const AUTH_USER_KEY = "authUser";

const LEGACY_WISHLIST_STORAGE_KEY = "wishlist";
const GUEST_WISHLIST_STORAGE_KEY = "wishlist:guest";

const getStoredUserId = () => {
  try {
    const savedUser = sessionStorage.getItem(AUTH_USER_KEY);
    const user = savedUser ? JSON.parse(savedUser) : null;

    return user?.id || null;
  } catch (error) {
    console.error("Failed to load auth user for wishlist:", error);
    return null;
  }
};

const getWishlistStorageKey = (userId) => {
  return userId ? `wishlist:user:${userId}` : GUEST_WISHLIST_STORAGE_KEY;
};

const normalizeWishlistItems = (items) => {
  if (!Array.isArray(items)) return [];

  return items.filter(Boolean);
};

const loadWishlistFromStorage = (storageKey) => {
  try {
    const savedWishlist = sessionStorage.getItem(storageKey);

    if (savedWishlist) {
      return normalizeWishlistItems(JSON.parse(savedWishlist));
    }

    if (storageKey === GUEST_WISHLIST_STORAGE_KEY) {
      const legacyWishlist = sessionStorage.getItem(
        LEGACY_WISHLIST_STORAGE_KEY,
      );

      return legacyWishlist
        ? normalizeWishlistItems(JSON.parse(legacyWishlist))
        : [];
    }

    return [];
  } catch (error) {
    console.error("Failed to load wishlist from sessionStorage:", error);
    return [];
  }
};

const mergeWishlistItems = (baseItems = [], incomingItems = []) => {
  const merged = [];

  const addItem = (item) => {
    const exists = merged.some((wishlistItem) => wishlistItem.id === item.id);

    if (!exists) {
      merged.push(item);
    }
  };

  normalizeWishlistItems(baseItems).forEach(addItem);
  normalizeWishlistItems(incomingItems).forEach(addItem);

  return merged;
};

const initialUserId = getStoredUserId();
const initialStorageKey = getWishlistStorageKey(initialUserId);

export const useWishlistStore = defineStore("wishlist", {
  state: () => ({
    items: loadWishlistFromStorage(initialStorageKey),
    storageKey: initialStorageKey,
  }),

  getters: {
    totalWishlistItems: (state) => state.items.length,

    isEmpty: (state) => state.items.length === 0,
  },

  actions: {
    saveWishlist() {
      sessionStorage.setItem(this.storageKey, JSON.stringify(this.items));
    },

    switchToUserWishlist(userId) {
      if (!userId) return;

      const userStorageKey = getWishlistStorageKey(userId);
      const savedUserWishlist = loadWishlistFromStorage(userStorageKey);

      this.items = mergeWishlistItems(savedUserWishlist, this.items);
      this.storageKey = userStorageKey;

      this.saveWishlist();

      sessionStorage.removeItem(GUEST_WISHLIST_STORAGE_KEY);
      sessionStorage.removeItem(LEGACY_WISHLIST_STORAGE_KEY);
    },

    resetToGuestEmpty() {
      this.storageKey = GUEST_WISHLIST_STORAGE_KEY;
      this.items = [];

      sessionStorage.removeItem(GUEST_WISHLIST_STORAGE_KEY);
      sessionStorage.removeItem(LEGACY_WISHLIST_STORAGE_KEY);
    },

    refreshForCurrentAuth() {
      const userId = getStoredUserId();
      const nextStorageKey = getWishlistStorageKey(userId);

      this.storageKey = nextStorageKey;
      this.items = loadWishlistFromStorage(nextStorageKey);
    },

    isInWishlist(productId) {
      return this.items.some((item) => item.id === productId);
    },

    toggleWishlist(product) {
      const exists = this.isInWishlist(product.id);

      if (exists) {
        this.items = this.items.filter((item) => item.id !== product.id);
      } else {
        this.items.push(product);
      }

      this.saveWishlist();
    },

    removeFromWishlist(productId) {
      this.items = this.items.filter((item) => item.id !== productId);
      this.saveWishlist();
    },

    clearWishlist() {
      this.items = [];
      sessionStorage.removeItem(this.storageKey);
    },
  },
});
