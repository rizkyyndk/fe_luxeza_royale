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
            ✉️
          </div>

          <p class="uppercase tracking-[4px] text-sm text-luxe-brown mb-4">
            Verify Account
          </p>

          <h1 class="text-4xl md:text-5xl font-bold text-luxe-espresso mb-4">
            Enter Verification Code
          </h1>

          <p class="text-luxe-brown/75 leading-7">
            We sent a verification code to your email. Enter the code to
            activate your Luxeza Royale account.
          </p>
        </div>

        <div
          v-if="devCode"
          class="mb-6 bg-luxe-cream border border-luxe-sand/70 rounded-3xl p-5 text-center"
        >
          <p class="text-sm text-luxe-brown/70 mb-2">
            Development verification code
          </p>

          <p class="text-3xl font-bold tracking-[6px] text-luxe-espresso">
            {{ devCode }}
          </p>
        </div>

        <form class="space-y-5" @submit.prevent="submitVerify">
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
              v-model="form.code"
              type="text"
              inputmode="numeric"
              maxlength="6"
              placeholder="6-digit code"
              class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-6 py-5 outline-none focus:border-luxe-royal transition text-center text-2xl tracking-[8px]"
              @input="form.code = form.code.replace(/\D/g, '')"
            />

            <p v-if="errors.code" class="text-red-500 text-sm mt-2">
              {{ errors.code }}
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
            {{ authStore.isLoading ? "Verifying..." : "Verify Account" }}
          </button>
        </form>

        <button
          @click="resendCode"
          type="button"
          :disabled="authStore.isLoading || !form.email.trim()"
          class="w-full mt-5 border border-luxe-sand text-luxe-espresso py-4 rounded-full hover:bg-luxe-cream disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Resend Code
        </button>

        <p class="text-center text-luxe-brown/75 mt-8">
          Already verified?
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
const devCode = ref(sessionStorage.getItem("pendingVerificationCode") || "");

const form = reactive({
  email:
    String(route.query.email || "") ||
    sessionStorage.getItem("pendingVerificationEmail") ||
    "",
  code: "",
});

const validateForm = () => {
  const validationErrors = {};

  if (!form.email.trim()) {
    validationErrors.email = "Email is required.";
  }

  if (!form.code.trim()) {
    validationErrors.code = "Verification code is required.";
  } else if (form.code.length < 6) {
    validationErrors.code = "Verification code must be 6 digits.";
  }

  errors.value = validationErrors;

  return Object.keys(validationErrors).length === 0;
};

const submitVerify = async () => {
  errorMessage.value = "";

  if (!validateForm()) return;

  try {
    await authStore.verifyAccount({
      email: form.email,
      code: form.code,
    });

    cartStore.switchToUserCart(authStore.user?.id);
    wishlistStore.switchToUserWishlist(authStore.user?.id);

    sessionStorage.removeItem("pendingVerificationEmail");
    sessionStorage.removeItem("pendingVerificationCode");

    toastStore.showToast({
      title: "Account Verified",
      message: `Welcome, ${authStore.userName}.`,
      type: "success",
    });

    const redirectPath = route.query.redirect || "/";
    router.push(String(redirectPath));
  } catch (error) {
    errorMessage.value = error?.message || "Verification failed.";

    toastStore.showToast({
      title: "Verification Failed",
      message: errorMessage.value,
      type: "error",
    });
  }
};

const resendCode = async () => {
  errorMessage.value = "";

  if (!form.email.trim()) {
    errors.value = {
      email: "Email is required.",
    };

    return;
  }

  try {
    const data = await authStore.resendVerificationCode({
      email: form.email,
    });

    if (data?.verification_code) {
      devCode.value = data.verification_code;
      sessionStorage.setItem("pendingVerificationCode", data.verification_code);
    }

    sessionStorage.setItem("pendingVerificationEmail", form.email);

    toastStore.showToast({
      title: "Code Resent",
      message: "A new verification code has been sent.",
      type: "success",
    });
  } catch (error) {
    errorMessage.value = error?.message || "Failed to resend code.";

    toastStore.showToast({
      title: "Failed to Resend Code",
      message: errorMessage.value,
      type: "error",
    });
  }
};
</script>
