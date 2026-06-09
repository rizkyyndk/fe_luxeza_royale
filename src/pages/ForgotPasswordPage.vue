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
            Pemulihan Akun
          </p>

          <h1 class="text-4xl md:text-5xl font-bold text-luxe-espresso mb-4">
            Lupa Kata Sandi
          </h1>

          <p class="text-luxe-brown/70 leading-7">
            Masukkan email yang terdaftar. Kami akan mengirimkan kode reset
            untuk membantu Anda membuat kata sandi baru.
          </p>
        </div>

        <form class="space-y-5" @submit.prevent="submitForgotPassword">
          <div>
            <label class="block text-sm font-medium text-luxe-brown/75 mb-2">
              Alamat Email
            </label>

            <input
              v-model="email"
              type="email"
              placeholder="nama@email.com"
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
            {{ isSubmitting ? "Mengirim kode..." : "Kirim Kode Reset" }}
          </button>
        </form>

        <div
          v-if="resetCode"
          class="mt-6 bg-luxe-ivory border border-luxe-sand/70 rounded-3xl p-5 text-center"
        >
          <p class="text-sm text-luxe-brown/70 mb-2">
            Kode reset kata sandi Anda:
          </p>

          <p class="text-3xl font-bold tracking-[6px] text-luxe-espresso">
            {{ resetCode }}
          </p>

          <p class="text-xs text-luxe-brown/60 mt-3 leading-5">
            Kode ini berlaku selama 10 menit. Gunakan kode tersebut untuk
            membuat kata sandi baru.
          </p>
        </div>

        <div class="mt-8 flex flex-col sm:flex-row gap-3">
          <RouterLink
            to="/login"
            class="flex-1 text-center border border-luxe-sand text-luxe-espresso py-4 rounded-full hover:bg-luxe-ivory transition"
          >
            Kembali ke Masuk
          </RouterLink>

          <RouterLink
            :to="resetPasswordLink"
            class="flex-1 text-center bg-luxe-ivory border border-luxe-sand text-luxe-espresso py-4 rounded-full hover:bg-white transition"
          >
            Lanjut Atur Kata Sandi
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
  const params = new URLSearchParams();

  if (email.value.trim()) {
    params.set("email", email.value.trim());
  }

  if (resetCode.value) {
    params.set("code", resetCode.value);
  }

  const query = params.toString();

  return query ? `/reset-password?${query}` : "/reset-password";
});

const isValidEmail = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

const submitForgotPassword = async () => {
  errorMessage.value = "";
  resetCode.value = "";

  const cleanEmail = email.value.trim();

  if (!cleanEmail) {
    errorMessage.value = "Alamat email wajib diisi.";
    return;
  }

  if (!isValidEmail(cleanEmail)) {
    errorMessage.value = "Masukkan alamat email yang valid.";
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await authService.forgotPassword(cleanEmail);

    const code =
      response?.reset_code ||
      response?.data?.reset_code ||
      response?.data?.data?.reset_code ||
      "";

    resetCode.value = code;

    if (!resetCode.value) {
      errorMessage.value =
        "Kode reset berhasil dibuat, namun belum dapat ditampilkan. Silakan cek email Anda atau coba kembali.";

      toastStore.showToast({
        title: "Kode Belum Tersedia",
        message: errorMessage.value,
        type: "info",
      });

      return;
    }

    toastStore.showToast({
      title: "Kode Reset Berhasil Dibuat",
      message: "Gunakan kode yang tampil untuk membuat kata sandi baru.",
      type: "success",
    });
  } catch (error) {
    errorMessage.value =
      error?.message || "Gagal membuat kode reset. Silakan coba lagi.";

    toastStore.showToast({
      title: "Gagal Membuat Kode",
      message: errorMessage.value,
      type: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>
