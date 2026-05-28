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
            Reset Password
          </p>

          <h1 class="text-4xl md:text-5xl font-bold text-luxe-espresso mb-4">
            Create New Password
          </h1>

          <p class="text-luxe-brown/70 leading-7">
            Enter your email, reset code, and new password.
          </p>
        </div>

        <form class="space-y-5" @submit.prevent="submitResetPassword">
          <div>
            <label class="block text-sm font-medium text-luxe-brown/75 mb-2">
              Email Address
            </label>

            <input
              v-model="form.email"
              type="email"
              placeholder="your@email.com"
              class="input-field"
            />

            <p v-if="errors.email" class="error-text">
              {{ errors.email }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-luxe-brown/75 mb-2">
              Reset Code
            </label>

            <input
              v-model="form.code"
              type="text"
              placeholder="6-digit code"
              class="input-field tracking-[4px] text-center text-xl font-bold"
            />

            <p v-if="errors.code" class="error-text">
              {{ errors.code }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-luxe-brown/75 mb-2">
              New Password
            </label>

            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="@Password123"
                class="input-field pr-14"
              />

              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-luxe-brown/70 hover:text-luxe-espresso transition"
              >
                {{ showPassword ? "🙈" : "👁️" }}
              </button>
            </div>

            <p v-if="errors.password" class="error-text">
              {{ errors.password }}
            </p>

            <p class="text-xs text-luxe-brown/60 mt-2 leading-5">
              Password must start with a symbol, contain uppercase letter,
              lowercase letter, number, and at least 8 characters.
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-luxe-brown/75 mb-2">
              Confirm Password
            </label>

            <div class="relative">
              <input
                v-model="form.passwordConfirmation"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Repeat new password"
                class="input-field pr-14"
              />

              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-luxe-brown/70 hover:text-luxe-espresso transition"
              >
                {{ showConfirmPassword ? "🙈" : "👁️" }}
              </button>
            </div>

            <p v-if="errors.passwordConfirmation" class="error-text">
              {{ errors.passwordConfirmation }}
            </p>
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full bg-luxe-espresso text-luxe-ivory py-4 rounded-full hover:bg-luxe-royal disabled:opacity-50 transition shadow-lg shadow-luxe-brown/20"
          >
            {{ isSubmitting ? "Resetting..." : "Reset Password" }}
          </button>
        </form>

        <div class="mt-8 flex flex-col sm:flex-row gap-3">
          <RouterLink
            to="/forgot-password"
            class="flex-1 text-center border border-luxe-sand text-luxe-espresso py-4 rounded-full hover:bg-luxe-ivory transition"
          >
            Request New Code
          </RouterLink>

          <RouterLink
            to="/login"
            class="flex-1 text-center bg-luxe-ivory border border-luxe-sand text-luxe-espresso py-4 rounded-full hover:bg-white transition"
          >
            Back to Login
          </RouterLink>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import Navbar from "../components/layout/Navbar.vue";
import CartSidebar from "../components/layout/CartSidebar.vue";
import Footer from "../components/layout/Footer.vue";

import { authService } from "../services/authService";
import { useToastStore } from "../stores/toastStore";

const route = useRoute();
const router = useRouter();
const toastStore = useToastStore();

const form = reactive({
  email: "",
  code: "",
  password: "",
  passwordConfirmation: "",
});

const errors = ref({});
const isSubmitting = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const validatePassword = (password) => {
  if (!password) return "New password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/^[@$!%*#?&]/.test(password)) {
    return "Password must start with a symbol, example: @ # ! $";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain a lowercase letter.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain an uppercase letter.";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain a number.";
  }

  return "";
};

const validateForm = () => {
  const validationErrors = {};

  if (!form.email.trim()) {
    validationErrors.email = "Email address is required.";
  }

  if (!form.code.trim()) {
    validationErrors.code = "Reset code is required.";
  }

  const passwordError = validatePassword(form.password);

  if (passwordError) {
    validationErrors.password = passwordError;
  }

  if (!form.passwordConfirmation) {
    validationErrors.passwordConfirmation = "Please confirm your password.";
  } else if (form.password !== form.passwordConfirmation) {
    validationErrors.passwordConfirmation =
      "Password confirmation does not match.";
  }

  errors.value = validationErrors;

  return Object.keys(validationErrors).length === 0;
};

const submitResetPassword = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;

  try {
    await authService.resetPassword({
      email: form.email.trim(),
      code: form.code.trim(),
      password: form.password,
    });

    toastStore.showToast({
      title: "Password Reset Successful",
      message: "Please login with your new password.",
      type: "success",
    });

    router.push("/login");
  } catch (error) {
    toastStore.showToast({
      title: "Reset Failed",
      message: error?.message || "Failed to reset password.",
      type: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  form.email = String(route.query.email || "");
  form.code = String(route.query.code || "");
});
</script>

<style scoped>
.input-field {
  @apply w-full border border-luxe-sand rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50;
}

.error-text {
  @apply text-red-500 text-sm mt-2;
}
</style>
