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
            👤
          </div>

          <p class="uppercase tracking-[4px] text-sm text-luxe-brown mb-4">
            Account Login
          </p>

          <h1 class="text-4xl md:text-5xl font-bold text-luxe-espresso mb-4">
            Welcome Back
          </h1>

          <p class="text-luxe-brown/75 leading-7">
            Login to continue shopping and track your Luxeza Royale orders.
          </p>
        </div>

        <form class="space-y-5" @submit.prevent="submitLogin">
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
            {{ authStore.isLoading ? "Logging in..." : "Login" }}
          </button>
        </form>

        <p class="text-center text-luxe-brown/75 mt-8">
          Don't have an account?
          <RouterLink
            to="/register"
            class="font-semibold text-luxe-espresso hover:underline"
          >
            Register
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

const router = useRouter();
const route = useRoute();

const authStore = useAuthStore();
const toastStore = useToastStore();

const errorMessage = ref("");
const errors = ref({});

const form = reactive({
  email: "",
  password: "",
});

const validateForm = () => {
  const validationErrors = {};

  if (!form.email.trim()) {
    validationErrors.email = "Email is required.";
  }

  if (!form.password.trim()) {
    validationErrors.password = "Password is required.";
  }

  errors.value = validationErrors;

  return Object.keys(validationErrors).length === 0;
};

const submitLogin = async () => {
  errorMessage.value = "";

  if (!validateForm()) return;

  try {
    await authStore.login({
      email: form.email,
      password: form.password,
    });

    toastStore.showToast({
      title: "Login Successful",
      message: `Welcome back, ${authStore.userName}.`,
      type: "success",
    });

    const redirectPath = route.query.redirect || "/";

    router.push(String(redirectPath));
  } catch (error) {
    errorMessage.value = error?.message || "Login failed.";

    toastStore.showToast({
      title: "Login Failed",
      message: errorMessage.value,
      type: "error",
    });
  }
};
</script>
