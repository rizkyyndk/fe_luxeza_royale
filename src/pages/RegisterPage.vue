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
            Buat Akun
          </p>

          <h1 class="text-4xl md:text-5xl font-bold text-luxe-espresso mb-4">
            Bergabung dengan Luxeza Royale
          </h1>

          <p class="text-luxe-brown/75 leading-7">
            Buat akun untuk menyelesaikan belanja dan memantau pesanan koleksi
            pilihan Anda dengan lebih mudah.
          </p>
        </div>

        <form class="space-y-5" @submit.prevent="submitRegister">
          <div>
            <input
              v-model="form.name"
              type="text"
              placeholder="Nama Lengkap"
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
              placeholder="Alamat Email"
              class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-6 py-5 outline-none focus:border-luxe-royal transition"
            />

            <p v-if="errors.email" class="text-red-500 text-sm mt-2">
              {{ errors.email }}
            </p>
          </div>

          <div>
            <div>
              <div class="relative">
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Kata Sandi"
                  class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-6 py-5 pr-16 outline-none focus:border-luxe-royal transition"
                />

                <button
                  @click="showPassword = !showPassword"
                  type="button"
                  class="absolute right-5 top-1/2 -translate-y-1/2 text-luxe-brown/70 hover:text-luxe-espresso transition"
                >
                  {{ showPassword ? "🙈" : "👁" }}
                </button>
              </div>

              <p v-if="errors.password" class="text-red-500 text-sm mt-2">
                {{ errors.password }}
              </p>

              <div class="mt-4 grid sm:grid-cols-2 gap-2 text-sm">
                <p
                  :class="
                    passwordRules.minLength
                      ? 'text-green-600'
                      : 'text-luxe-brown/60'
                  "
                >
                  ✓ Minimal 8 karakter
                </p>

                <p
                  :class="
                    passwordRules.uppercase
                      ? 'text-green-600'
                      : 'text-luxe-brown/60'
                  "
                >
                  ✓ Huruf besar
                </p>

                <p
                  :class="
                    passwordRules.lowercase
                      ? 'text-green-600'
                      : 'text-luxe-brown/60'
                  "
                >
                  ✓ Huruf kecil
                </p>

                <p
                  :class="
                    passwordRules.number
                      ? 'text-green-600'
                      : 'text-luxe-brown/60'
                  "
                >
                  ✓ Angka
                </p>

                <p
                  :class="
                    passwordRules.symbol
                      ? 'text-green-600'
                      : 'text-luxe-brown/60'
                  "
                  class="sm:col-span-2"
                >
                  ✓ Simbol @ $ ! % * # ? &
                </p>
              </div>
            </div>
          </div>

          <p v-if="errorMessage" class="text-red-500 text-sm">
            {{ errorMessage }}
          </p>

          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="w-full bg-luxe-espresso text-luxe-ivory py-5 rounded-full text-lg hover:bg-luxe-royal disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-luxe-brown/20"
          >
            {{ authStore.isLoading ? "Membuat akun..." : "Daftar" }}
          </button>
        </form>

        <p class="text-center text-luxe-brown/75 mt-8">
          Sudah memiliki akun?
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
import { computed, reactive, ref } from "vue";
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

const showPassword = ref(false);

const errorMessage = ref("");
const errors = ref({});

const form = reactive({
  name: "",
  email: "",
  password: "",
});

const passwordRules = computed(() => ({
  minLength: form.password.length >= 8,
  uppercase: /[A-Z]/.test(form.password),
  lowercase: /[a-z]/.test(form.password),
  number: /[0-9]/.test(form.password),
  symbol: /[@$!%*#?&]/.test(form.password),
}));

const isPasswordStrong = computed(() => {
  return Object.values(passwordRules.value).every(Boolean);
});

const validateForm = () => {
  const validationErrors = {};

  if (!form.name.trim()) {
    validationErrors.name = "Nama lengkap wajib diisi.";
  }

  if (!form.email.trim()) {
    validationErrors.email = "Alamat email wajib diisi.";
  }

  if (!form.password.trim()) {
    validationErrors.password = "Kata sandi wajib diisi.";
  } else if (!isPasswordStrong.value) {
    validationErrors.password =
      "Kata sandi minimal 8 karakter dan harus memuat huruf besar, huruf kecil, angka, serta simbol.";
  }

  errors.value = validationErrors;

  return Object.keys(validationErrors).length === 0;
};

const submitRegister = async () => {
  errorMessage.value = "";

  if (!validateForm()) return;

  try {
    const data = await authStore.register({
      name: form.name,
      email: form.email,
      password: form.password,
    });

    sessionStorage.setItem(
      "pendingVerificationEmail",
      data?.email || form.email,
    );

    if (data?.verification_code) {
      sessionStorage.setItem("pendingVerificationCode", data.verification_code);
    } else {
      sessionStorage.removeItem("pendingVerificationCode");
    }

    toastStore.showToast({
      title: "Pendaftaran Berhasil",
      message: "Silakan verifikasi akun Anda menggunakan kode verifikasi.",
      type: "success",
    });

    const redirectPath = route.query.redirect || "/";

    router.push({
      path: "/verify-account",
      query: {
        email: data?.email || form.email,
        redirect: String(redirectPath),
      },
    });
  } catch (error) {
    errorMessage.value = error?.message || "Pendaftaran gagal.";

    const firstError = error?.errors
      ? Object.values(error.errors).flat()[0]
      : null;

    toastStore.showToast({
      title: "Pendaftaran Gagal",
      message: firstError || errorMessage.value,
      type: "error",
    });
  }
};
</script>
