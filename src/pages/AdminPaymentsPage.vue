<template>
  <div>
    <Navbar />
    <CartSidebar />

    <section class="pt-36 pb-24 px-6">
      <div class="max-w-7xl mx-auto">
        <div
          class="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <p class="uppercase tracking-[4px] text-sm text-luxe-brown mb-4">
              Panel Admin
            </p>

            <h1 class="text-4xl md:text-5xl font-bold mb-4 text-luxe-espresso">
              Metode Pembayaran
            </h1>

            <p class="text-luxe-brown/75 max-w-xl leading-7">
              Kelola metode pembayaran QRIS dan transfer bank yang digunakan
              pada proses checkout Luxeza Royale.
            </p>
          </div>

          <button
            @click="resetForm"
            class="bg-luxe-espresso text-luxe-ivory px-6 py-3 rounded-full hover:bg-luxe-royal transition w-fit"
          >
            Tambah Metode Pembayaran
          </button>
        </div>

        <div class="grid lg:grid-cols-[1fr_420px] gap-8">
          <!-- LIST -->
          <div class="space-y-5">
            <div
              v-if="isLoading"
              class="bg-luxe-cream border border-luxe-sand/60 rounded-[2rem] p-8 text-luxe-brown/75"
            >
              Memuat metode pembayaran...
            </div>

            <div
              v-else-if="paymentMethods.length === 0"
              class="bg-luxe-cream border border-luxe-sand/60 rounded-[2rem] p-8 text-luxe-brown/75"
            >
              Metode pembayaran belum tersedia.
            </div>

            <div
              v-for="method in paymentMethods"
              v-else
              :key="method.id"
              class="bg-luxe-ivory border border-luxe-sand/70 rounded-[2rem] p-6 shadow-[0_18px_60px_rgba(92,56,36,0.10)]"
            >
              <div
                class="flex flex-col md:flex-row md:items-start md:justify-between gap-5"
              >
                <div>
                  <div class="flex flex-wrap items-center gap-3 mb-3">
                    <span class="text-2xl">
                      {{ method.type === "qris" ? "📱" : "🏦" }}
                    </span>

                    <h2 class="text-2xl font-bold text-luxe-espresso">
                      {{ method.name }}
                    </h2>

                    <span
                      :class="
                        method.isActive
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      "
                      class="px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      {{ method.isActive ? "Aktif" : "Tidak Aktif" }}
                    </span>
                  </div>

                  <p class="text-sm text-luxe-brown/75 mb-2">
                    Kode:
                    <span class="font-semibold">{{ method.code }}</span>
                  </p>

                  <p class="text-sm text-luxe-brown/75 mb-2">
                    Tipe:
                    <span class="font-semibold">
                      {{ method.type === "qris" ? "QRIS" : "Transfer Bank" }}
                    </span>
                  </p>

                  <div
                    v-if="method.type === 'bank_transfer'"
                    class="text-sm text-luxe-brown/75 space-y-1 mt-3"
                  >
                    <p>
                      Bank:
                      <span class="font-semibold">{{ method.bankName }}</span>
                    </p>

                    <p>
                      Nama Rekening:
                      <span class="font-semibold">
                        {{ method.accountName }}
                      </span>
                    </p>

                    <p>
                      Nomor Rekening:
                      <span class="font-semibold">
                        {{ method.accountNumber }}
                      </span>
                    </p>
                  </div>

                  <div
                    v-if="method.type === 'qris' && method.qrImageUrl"
                    class="mt-4"
                  >
                    <img
                      :src="method.qrImageUrl"
                      :alt="method.name"
                      class="w-32 h-32 object-cover rounded-2xl border border-luxe-sand/60 bg-luxe-cream"
                    />
                  </div>
                </div>

                <div class="flex flex-wrap gap-3">
                  <button
                    @click="editMethod(method)"
                    class="border border-luxe-sand text-luxe-espresso px-4 py-2 rounded-full hover:bg-luxe-cream transition"
                  >
                    Ubah
                  </button>

                  <button
                    @click="deleteMethod(method)"
                    class="border border-red-200 text-red-600 px-4 py-2 rounded-full hover:bg-red-50 transition"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- FORM -->
          <div
            class="bg-luxe-ivory border border-luxe-sand/70 rounded-[2rem] p-6 h-fit shadow-[0_18px_60px_rgba(92,56,36,0.10)] sticky top-28"
          >
            <h2 class="text-2xl font-bold text-luxe-espresso mb-6">
              {{
                form.id ? "Ubah Metode Pembayaran" : "Tambah Metode Pembayaran"
              }}
            </h2>

            <form class="space-y-5" @submit.prevent="submitForm">
              <div>
                <label class="block text-sm text-luxe-brown/75 mb-2">
                  Tipe Pembayaran
                </label>

                <LuxeSelect
                  v-model="form.type"
                  :options="paymentTypeOptions"
                  placeholder="Pilih tipe pembayaran"
                />
              </div>

              <div>
                <label class="block text-sm text-luxe-brown/75 mb-2">
                  Kode
                </label>

                <input
                  v-model="form.code"
                  type="text"
                  placeholder="qris-main / bca-001"
                  class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                />
              </div>

              <div>
                <label class="block text-sm text-luxe-brown/75 mb-2">
                  Nama Metode
                </label>

                <input
                  v-model="form.name"
                  type="text"
                  placeholder="QRIS GoPay Merchant / Bank BCA"
                  class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                />
              </div>

              <div v-if="form.type === 'bank_transfer'" class="space-y-5">
                <div>
                  <label class="block text-sm text-luxe-brown/75 mb-2">
                    Nama Bank
                  </label>

                  <input
                    v-model="form.bank_name"
                    type="text"
                    placeholder="BCA / BNI / Mandiri"
                    class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                  />
                </div>

                <div>
                  <label class="block text-sm text-luxe-brown/75 mb-2">
                    Nama Rekening
                  </label>

                  <input
                    v-model="form.account_name"
                    type="text"
                    placeholder="Rizky Andika"
                    class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                  />
                </div>

                <div>
                  <label class="block text-sm text-luxe-brown/75 mb-2">
                    Nomor Rekening
                  </label>

                  <input
                    v-model="form.account_number"
                    type="text"
                    placeholder="7641543661"
                    class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                  />
                </div>
              </div>

              <div v-if="form.type === 'qris'">
                <label class="block text-sm text-luxe-brown/75 mb-2">
                  Gambar QR / Gambar Pembayaran
                </label>

                <div
                  class="bg-luxe-cream border border-luxe-sand/60 rounded-3xl p-4 space-y-4"
                >
                  <div v-if="form.qr_image_url" class="flex items-start gap-4">
                    <img
                      :src="form.qr_image_url"
                      alt="Pratinjau QR"
                      class="w-32 h-32 object-cover rounded-2xl border border-luxe-sand/60 bg-luxe-ivory"
                    />

                    <div class="min-w-0 flex-1">
                      <p class="text-sm font-semibold text-luxe-espresso mb-1">
                        Pratinjau Gambar
                      </p>

                      <p class="text-xs text-luxe-brown/60 break-all leading-5">
                        {{ form.qr_image_url }}
                      </p>
                    </div>
                  </div>

                  <div
                    v-else
                    class="h-32 rounded-2xl border border-dashed border-luxe-sand bg-luxe-ivory flex items-center justify-center text-luxe-brown/50 text-sm"
                  >
                    Belum ada gambar QR yang dipilih
                  </div>

                  <input
                    v-model="form.qr_image_url"
                    type="text"
                    placeholder="/uploads/payments/payment-image.png atau URL gambar eksternal"
                    class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                  />

                  <input
                    id="payment-image-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    class="hidden"
                    @change="handlePaymentImageUpload"
                  />

                  <label
                    for="payment-image-upload"
                    :class="
                      isUploadingPaymentImage
                        ? 'opacity-60 pointer-events-none'
                        : 'hover:bg-luxe-ivory cursor-pointer'
                    "
                    class="inline-flex items-center justify-center px-5 py-3 rounded-2xl border border-luxe-sand bg-luxe-cream text-luxe-espresso transition text-sm font-medium"
                  >
                    {{
                      isUploadingPaymentImage
                        ? "Mengunggah..."
                        : "Unggah dari Perangkat"
                    }}
                  </label>

                  <p class="text-xs text-luxe-brown/60 leading-5">
                    Unggah gambar QRIS dari perangkat, atau tempel URL gambar QR
                    eksternal.
                  </p>
                </div>
              </div>

              <div>
                <label class="block text-sm text-luxe-brown/75 mb-2">
                  Instruksi Pembayaran
                </label>

                <textarea
                  v-model="form.instructions"
                  rows="4"
                  placeholder="Instruksi pembayaran..."
                  class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition resize-none"
                ></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-luxe-brown/75 mb-2">
                    Status
                  </label>

                  <LuxeSelect
                    v-model="form.is_active"
                    :options="paymentStatusOptions"
                    placeholder="Pilih status"
                  />
                </div>

                <div>
                  <label class="block text-sm text-luxe-brown/75 mb-2">
                    Urutan Tampil
                  </label>

                  <input
                    v-model.number="form.sort_order"
                    type="number"
                    class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full bg-luxe-espresso text-luxe-ivory py-4 rounded-full hover:bg-luxe-royal disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {{
                  isSubmitting
                    ? "Menyimpan..."
                    : form.id
                      ? "Perbarui Metode Pembayaran"
                      : "Buat Metode Pembayaran"
                }}
              </button>

              <button
                v-if="form.id"
                type="button"
                @click="resetForm"
                class="w-full border border-luxe-sand text-luxe-espresso py-4 rounded-full hover:bg-luxe-cream transition"
              >
                Batal Ubah
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";

import Navbar from "../components/layout/Navbar.vue";
import CartSidebar from "../components/layout/CartSidebar.vue";
import Footer from "../components/layout/Footer.vue";

import { paymentMethodService } from "../services/paymentMethodService";
import { useToastStore } from "../stores/toastStore";
import LuxeSelect from "../components/ui/LuxeSelect.vue";

const toastStore = useToastStore();

const paymentMethods = ref([]);
const isLoading = ref(false);
const isSubmitting = ref(false);
const isUploadingPaymentImage = ref(false);

const paymentTypeOptions = [
  {
    label: "QRIS",
    value: "qris",
  },
  {
    label: "Transfer Bank",
    value: "bank_transfer",
  },
];

const paymentStatusOptions = [
  {
    label: "Aktif",
    value: true,
  },
  {
    label: "Tidak Aktif",
    value: false,
  },
];

const defaultForm = () => ({
  id: null,
  type: "qris",
  code: "",
  name: "",
  bank_name: "",
  account_name: "",
  account_number: "",
  qr_image_url: "",
  instructions: "",
  is_active: true,
  sort_order: 0,
});

const form = reactive(defaultForm());

const loadPaymentMethods = async () => {
  isLoading.value = true;

  try {
    paymentMethods.value = await paymentMethodService.getAdminPaymentMethods();
  } catch (error) {
    toastStore.showToast({
      title: "Gagal Memuat Pembayaran",
      message: error?.message || "Metode pembayaran belum dapat dimuat.",
      type: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  Object.assign(form, defaultForm());
};

const editMethod = (method) => {
  form.id = method.id;
  form.type = method.type || "qris";
  form.code = method.code || "";
  form.name = method.name || "";

  form.bank_name = method.raw?.bank_name || method.bankName || "";
  form.account_name = method.raw?.account_name || method.accountName || "";
  form.account_number =
    method.raw?.account_number || method.accountNumber || "";

  form.qr_image_url = method.raw?.qr_image_url || method.qrImageUrl || "";

  form.instructions = method.raw?.instructions || method.instructions || "";
  form.is_active = Boolean(method.raw?.is_active ?? method.isActive);
  form.sort_order = Number(method.raw?.sort_order ?? method.sortOrder ?? 0);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const buildPayload = () => {
  return {
    type: form.type,
    code: form.code.trim(),
    name: form.name.trim(),
    bank_name: form.type === "bank_transfer" ? form.bank_name.trim() : null,
    account_name: form.account_name.trim() || null,
    account_number:
      form.type === "bank_transfer" ? form.account_number.trim() : null,
    qr_image_url: form.type === "qris" ? form.qr_image_url.trim() : null,
    instructions: form.instructions.trim() || null,
    is_active: Boolean(form.is_active),
    sort_order: Number(form.sort_order || 0),
  };
};

const submitForm = async () => {
  if (!form.code.trim() || !form.name.trim()) {
    toastStore.showToast({
      title: "Data Belum Lengkap",
      message: "Kode dan nama metode pembayaran wajib diisi.",
      type: "error",
    });

    return;
  }

  isSubmitting.value = true;

  try {
    const payload = buildPayload();

    if (form.id) {
      await paymentMethodService.updatePaymentMethod(form.id, payload);

      toastStore.showToast({
        title: "Metode Pembayaran Diperbarui",
        message: "Metode pembayaran berhasil diperbarui.",
        type: "success",
      });
    } else {
      await paymentMethodService.createPaymentMethod(payload);

      toastStore.showToast({
        title: "Metode Pembayaran Dibuat",
        message: "Metode pembayaran baru berhasil dibuat.",
        type: "success",
      });
    }

    resetForm();
    await loadPaymentMethods();
  } catch (error) {
    toastStore.showToast({
      title: "Gagal Menyimpan Pembayaran",
      message: error?.message || "Metode pembayaran belum dapat disimpan.",
      type: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};

const handlePaymentImageUpload = async (event) => {
  const file = event.target.files?.[0];

  if (!file) return;

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    toastStore.showToast({
      title: "Gambar Tidak Valid",
      message: "Silakan unggah gambar jpg, jpeg, png, atau webp.",
      type: "error",
    });

    event.target.value = "";
    return;
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    toastStore.showToast({
      title: "Gambar Terlalu Besar",
      message: "Ukuran gambar maksimal 5 MB.",
      type: "error",
    });

    event.target.value = "";
    return;
  }

  isUploadingPaymentImage.value = true;

  try {
    const uploadedImage = await paymentMethodService.uploadPaymentImage(file);

    form.qr_image_url = uploadedImage.image_url || "";

    toastStore.showToast({
      title: "Gambar Berhasil Diunggah",
      message: "Gambar pembayaran berhasil diunggah.",
      type: "success",
    });
  } catch (error) {
    toastStore.showToast({
      title: "Unggah Gambar Gagal",
      message: error?.message || "Gambar pembayaran belum dapat diunggah.",
      type: "error",
    });
  } finally {
    isUploadingPaymentImage.value = false;
    event.target.value = "";
  }
};

const deleteMethod = async (method) => {
  const isConfirmed = window.confirm(
    `Hapus metode pembayaran "${method.name}"?`,
  );

  if (!isConfirmed) return;

  try {
    await paymentMethodService.deletePaymentMethod(method.id);

    toastStore.showToast({
      title: "Metode Pembayaran Dihapus",
      message: "Metode pembayaran berhasil dihapus.",
      type: "info",
    });

    await loadPaymentMethods();
  } catch (error) {
    toastStore.showToast({
      title: "Gagal Menghapus Pembayaran",
      message: error?.message || "Metode pembayaran belum dapat dihapus.",
      type: "error",
    });
  }
};

onMounted(() => {
  loadPaymentMethods();
});
</script>
