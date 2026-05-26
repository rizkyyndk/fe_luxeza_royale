<template>
  <div>
    <Navbar />
    <CartSidebar />

    <section
      class="min-h-screen pt-36 pb-24 px-6 flex items-center justify-center"
    >
      <div
        class="max-w-xl w-full bg-luxe-ivory border border-luxe-sand/70 rounded-[2rem] p-8 md:p-12 shadow-[0_24px_90px_rgba(92,56,36,0.16)]"
      >
        <div class="text-center mb-10">
          <div
            class="w-20 h-20 mx-auto mb-6 rounded-full bg-luxe-cream border border-luxe-sand/60 flex items-center justify-center text-3xl"
          >
            ✨
          </div>

          <p class="uppercase tracking-[4px] text-sm text-luxe-brown mb-4">
            Create Account
          </p>

          <h1 class="text-4xl md:text-5xl font-bold text-luxe-espresso mb-4">
            Join Luxeza Royale
          </h1>

          <p class="text-luxe-brown/75 leading-7">
            Create an account to checkout and track your luxury fashion orders.
          </p>
        </div>

        <form class="space-y-5" @submit.prevent="submitRegister">
          <div>
            <input
              v-model="form.name"
              type="text"
              placeholder="Full Name"
              class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-6 py-5 outline-none focus:border-luxe-royal transition"
            />

            <p v-if="errors.name" class="text-red-500 text-sm mt-2">
              {{ errors.name }}
            </p>
          </div>

          <div>
            <input
              v-model="form.email"
              type="email"
              placeholder="Email Address"
              class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-6 py-5 outline-none focus:border-luxe-royal transition"
            />

            <p v-if="errors.email" class="text-red-500 text-sm mt-2">
              {{ errors.email }}
            </p>
          </div>

          <div>
            <input
              v-model="form.password"
              type="password"
              placeholder="Password"
              class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-6 py-5 outline-none focus:border-luxe-royal transition"
            />

            <p v-if="errors.password" class="text-red-500 text-sm mt-2">
              {{ errors.password }}
            </p>
          </div>

          <p v-if="errorMessage" class="text-red-500 text-sm">
            {{ errorMessage }}
          </p>

          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="w-full bg-luxe-espresso text-luxe-ivory py-5 rounded-full text-lg hover:bg-luxe-royal disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-luxe-brown/20"
          >
            {{ authStore.isLoading ? "Creating account..." : "Register" }}
          </button>
        </form>

        <p class="text-center text-luxe-brown/75 mt-8">
          Already have an account?
          <RouterLink
            to="/login"
            class="font-semibold text-luxe-espresso hover:underline"
          >
            Login
          </RouterLink>
        </p>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import Navbar from "../components/layout/Navbar.vue";
import CartSidebar from "../components/layout/CartSidebar.vue";
import Footer from "../components/layout/Footer.vue";

import { useAuthStore } from "../stores/authStore";
import { useToastStore } from "../stores/toastStore";

import { useCartStore } from "../stores/cartStore";
import { useWishlistStore } from "../stores/wishlistStore";

const router = useRouter();
const route = useRoute();

const authStore = useAuthStore();
const toastStore = useToastStore();

const cartStore = useCartStore();
const wishlistStore = useWishlistStore();

const errorMessage = ref("");
const errors = ref({});

const form = reactive({
  name: "",
  email: "",
  password: "",
});

const validateForm = () => {
  const validationErrors = {};

  if (!form.name.trim()) {
    validationErrors.name = "Full name is required.";
  }

  if (!form.email.trim()) {
    validationErrors.email = "Email is required.";
  }

  if (!form.password.trim()) {
    validationErrors.password = "Password is required.";
  } else if (form.password.length < 6) {
    validationErrors.password = "Password must be at least 6 characters.";
  }

  errors.value = validationErrors;

  return Object.keys(validationErrors).length === 0;
};

const submitRegister = async () => {
  errorMessage.value = "";

  if (!validateForm()) return;

  try {
    await authStore.register({
      name: form.name,
      email: form.email,
      password: form.password,
    });

    cartStore.switchToUserCart(authStore.user?.id);
    wishlistStore.switchToUserWishlist(authStore.user?.id);

    toastStore.showToast({
      title: "Account Created",
      message: `Welcome, ${authStore.userName}.`,
      type: "success",
    });

    const redirectPath = route.query.redirect || "/";

    router.push(String(redirectPath));
  } catch (error) {
    errorMessage.value = error?.message || "Register failed.";

    toastStore.showToast({
      title: "Register Failed",
      message: errorMessage.value,
      type: "error",
    });
  }
};
</script>
