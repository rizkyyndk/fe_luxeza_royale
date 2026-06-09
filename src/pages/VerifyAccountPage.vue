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
            Verifikasi Akun
          </p>

          <h1 class="text-4xl md:text-5xl font-bold text-luxe-espresso mb-4">
            Masukkan Kode Verifikasi
          </h1>

          <p class="text-luxe-brown/75 leading-7">
            Kami telah mengirimkan kode verifikasi ke email Anda. Masukkan kode
            tersebut untuk mengaktifkan akun Luxeza Royale.
          </p>
        </div>

        <div
          v-if="devCode"
          class="mb-6 bg-luxe-cream border border-luxe-sand/70 rounded-3xl p-5 text-center"
        >
          <p class="text-sm text-luxe-brown/70 mb-2">
            Kode verifikasi pengembangan
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
              placeholder="Alamat Email"
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
              placeholder="Kode 6 digit"
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
            {{ authStore.isLoading ? "Memverifikasi..." : "Verifikasi Akun" }}
          </button>
        </form>

        <button
          @click="resendCode"
          type="button"
          :disabled="authStore.isLoading || !form.email.trim()"
          class="w-full mt-5 border border-luxe-sand text-luxe-espresso py-4 rounded-full hover:bg-luxe-cream disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Kirim Ulang Kode
        </button>

        <p class="text-center text-luxe-brown/75 mt-8">
          Akun sudah terverifikasi?
          <RouterLink
            to="/login"
            class="font-semibold text-luxe-espresso hover:underline"
          >
            Masuk
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
    validationErrors.email = "Alamat email wajib diisi.";
  }

  if (!form.code.trim()) {
    validationErrors.code = "Kode verifikasi wajib diisi.";
  } else if (form.code.length < 6) {
    validationErrors.code = "Kode verifikasi harus terdiri dari 6 digit.";
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
      title: "Akun Terverifikasi",
      message: `Selamat datang, ${authStore.userName}.`,
      type: "success",
    });

    const redirectPath = route.query.redirect || "/";
    router.push(String(redirectPath));
  } catch (error) {
    errorMessage.value = error?.message || "Verifikasi gagal.";

    toastStore.showToast({
      title: "Verifikasi Gagal",
      message: errorMessage.value,
      type: "error",
    });
  }
};

const resendCode = async () => {
  errorMessage.value = "";

  if (!form.email.trim()) {
    errors.value = {
      email: "Alamat email wajib diisi.",
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
      title: "Kode Dikirim Ulang",
      message: "Kode verifikasi baru telah dikirim.",
      type: "success",
    });
  } catch (error) {
    errorMessage.value = error?.message || "Gagal mengirim ulang kode.";

    toastStore.showToast({
      title: "Gagal Mengirim Ulang Kode",
      message: errorMessage.value,
      type: "error",
    });
  }
};
</script>
