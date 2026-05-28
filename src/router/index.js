import { createRouter, createWebHashHistory } from "vue-router";

import HomePage from "../pages/HomePage.vue";
import ProductDetailPage from "../pages/ProductDetailPage.vue";
import CheckoutPage from "../pages/CheckoutPage.vue";
import CheckoutSuccessPage from "../pages/CheckoutSuccessPage.vue";
import WishlistPage from "../pages/WishlistPage.vue";
import OrderHistoryPage from "../pages/OrderHistoryPage.vue";
import NotFoundPage from "../pages/NotFoundPage.vue";
import AdminOrdersPage from "../pages/AdminOrdersPage.vue";
import AdminPaymentsPage from "../pages/AdminPaymentsPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import RegisterPage from "../pages/RegisterPage.vue";
import { useAuthStore } from "../stores/authStore";
import AdminProductsPage from "../pages/AdminProductsPage.vue";
import VerifyAccountPage from "../pages/VerifyAccountPage.vue";
import MyAddressesPage from "../pages/MyAddressesPage.vue";
import ForgotPasswordPage from "../pages/ForgotPasswordPage.vue";
import ResetPasswordPage from "../pages/ResetPasswordPage.vue";

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
    meta: {
      requiresAuth: true,
    },
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
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/my-addresses",
    component: MyAddressesPage,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/admin/orders",
    component: AdminOrdersPage,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/admin/payments",
    component: AdminPaymentsPage,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/admin/products",
    component: AdminProductsPage,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/login",
    component: LoginPage,
  },
  {
    path: "/verify-account",
    component: VerifyAccountPage,
  },
  {
    path: "/register",
    component: RegisterPage,
  },
  {
    path: "/forgot-password",
    component: ForgotPasswordPage,
    meta: {
      guestOnly: true,
    },
  },
  {
    path: "/reset-password",
    component: ResetPasswordPage,
    meta: {
      guestOnly: true,
    },
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

router.beforeEach((to) => {
  const authStore = useAuthStore();

  const isAuthPage = to.path === "/login" || to.path === "/register";

  if (isAuthPage && authStore.isAuthenticated) {
    return "/";
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      path: "/login",
      query: {
        redirect: to.fullPath,
      },
    };
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return "/";
  }

  return true;
});

export default router;
