<template>
  <div>
    <Navbar />
    <CartSidebar />

    <section
      class="min-h-screen pt-32 pb-24 px-6 flex items-center justify-center"
    >
      <div
        class="w-full max-w-xl bg-luxe-cream border border-luxe-sand/70 rounded-[2rem] p-6 md:p-8 shadow-[0_24px_90px_rgba(92,56,36,0.14)]"
      >
        <div class="text-center mb-8">
          <p class="uppercase tracking-[4px] text-sm text-luxe-brown mb-3">
            Account Recovery
          </p>

          <h1 class="text-4xl md:text-5xl font-bold text-luxe-espresso mb-4">
            Forgot Password
          </h1>

          <p class="text-luxe-brown/70 leading-7">
            Enter your registered email address. We will generate a verification
            code to reset your password.
          </p>
        </div>

        <form class="space-y-5" @submit.prevent="submitForgotPassword">
          <div>
            <label class="block text-sm font-medium text-luxe-brown/75 mb-2">
              Email Address
            </label>

            <input
              v-model="email"
              type="email"
              placeholder="your@email.com"
              class="w-full border border-luxe-sand rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50"
            />

            <p v-if="errorMessage" class="text-red-500 text-sm mt-2">
              {{ errorMessage }}
            </p>
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full bg-luxe-espresso text-luxe-ivory py-4 rounded-full hover:bg-luxe-royal disabled:opacity-50 transition shadow-lg shadow-luxe-brown/20"
          >
            {{ isSubmitting ? "Sending Code..." : "Send Reset Code" }}
          </button>
        </form>

        <div
          v-if="resetCode"
          class="mt-6 bg-luxe-ivory border border-luxe-sand/70 rounded-3xl p-5"
        >
          <p class="text-sm text-luxe-brown/70 mb-2">
            Reset code for local testing:
          </p>

          <p class="text-3xl font-bold tracking-[6px] text-luxe-espresso">
            {{ resetCode }}
          </p>
        </div>

        <div class="mt-8 flex flex-col sm:flex-row gap-3">
          <RouterLink
            to="/login"
            class="flex-1 text-center border border-luxe-sand text-luxe-espresso py-4 rounded-full hover:bg-luxe-ivory transition"
          >
            Back to Login
          </RouterLink>

          <RouterLink
            :to="resetPasswordLink"
            class="flex-1 text-center bg-luxe-ivory border border-luxe-sand text-luxe-espresso py-4 rounded-full hover:bg-white transition"
          >
            I Have a Code
          </RouterLink>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import Navbar from "../components/layout/Navbar.vue";
import CartSidebar from "../components/layout/CartSidebar.vue";
import Footer from "../components/layout/Footer.vue";

import { authService } from "../services/authService";
import { useToastStore } from "../stores/toastStore";

const router = useRouter();
const toastStore = useToastStore();

const email = ref("");
const resetCode = ref("");
const errorMessage = ref("");
const isSubmitting = ref(false);

const resetPasswordLink = computed(() => {
  const query = email.value ? `?email=${encodeURIComponent(email.value)}` : "";

  return `/reset-password${query}`;
});

const isValidEmail = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

const submitForgotPassword = async () => {
  errorMessage.value = "";
  resetCode.value = "";

  if (!email.value.trim()) {
    errorMessage.value = "Email address is required.";
    return;
  }

  if (!isValidEmail(email.value)) {
    errorMessage.value = "Please enter a valid email address.";
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await authService.forgotPassword(email.value.trim());

    resetCode.value = response?.reset_code || response?.data?.reset_code || "";

    toastStore.showToast({
      title: "Reset Code Generated",
      message: "Please use the verification code to reset your password.",
      type: "success",
    });

    router.push({
      path: "/reset-password",
      query: {
        email: email.value.trim(),
        code: resetCode.value || undefined,
      },
    });
  } catch (error) {
    errorMessage.value =
      error?.message || "Failed to generate reset code. Please try again.";

    toastStore.showToast({
      title: "Failed",
      message: errorMessage.value,
      type: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>
