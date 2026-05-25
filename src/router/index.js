import { createRouter, createWebHashHistory } from "vue-router";

import HomePage from "../pages/HomePage.vue";
import ProductDetailPage from "../pages/ProductDetailPage.vue";
import CheckoutPage from "../pages/CheckoutPage.vue";
import CheckoutSuccessPage from "../pages/CheckoutSuccessPage.vue";
import WishlistPage from "../pages/WishlistPage.vue";
import OrderHistoryPage from "../pages/OrderHistoryPage.vue";
import NotFoundPage from "../pages/NotFoundPage.vue";

const routes = [
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/product/:id",
    component: ProductDetailPage,
  },
  {
    path: "/checkout",
    component: CheckoutPage,
  },
  {
    path: "/checkout/success",
    component: CheckoutSuccessPage,
  },
  {
    path: "/wishlist",
    component: WishlistPage,
  },
  {
    path: "/orders",
    component: OrderHistoryPage,
  },

  // Wajib paling bawah
  {
    path: "/:pathMatch(.*)*",
    component: NotFoundPage,
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }

    if (to.hash) {
      return {
        el: to.hash,
        top: 90,
        behavior: "smooth",
      };
    }

    return {
      top: 0,
      left: 0,
      behavior: "smooth",
    };
  },
});

export default router;
