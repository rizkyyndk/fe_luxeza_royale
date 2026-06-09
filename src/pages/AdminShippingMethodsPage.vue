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
              Metode Pengiriman
            </h1>

            <p class="text-luxe-brown/75 max-w-xl leading-7">
              Kelola metode pengiriman, biaya ongkir, deskripsi, status, dan
              urutan tampil untuk proses checkout Luxeza Royale.
            </p>
          </div>

          <button
            @click="resetForm"
            type="button"
            class="bg-luxe-espresso text-luxe-ivory px-6 py-3 rounded-full hover:bg-luxe-royal transition w-fit"
          >
            Tambah Metode Pengiriman
          </button>
        </div>

        <div class="grid lg:grid-cols-[1fr_420px] gap-8">
          <!-- LIST -->
          <div class="space-y-5">
            <div
              v-if="isLoading"
              class="bg-luxe-cream border border-luxe-sand/60 rounded-[2rem] p-8 text-luxe-brown/75"
            >
              Memuat metode pengiriman...
            </div>

            <div
              v-else-if="shippingMethods.length === 0"
              class="bg-luxe-cream border border-luxe-sand/60 rounded-[2rem] p-8 text-luxe-brown/75"
            >
              Metode pengiriman belum tersedia.
            </div>

            <div
              v-for="method in shippingMethods"
              v-else
              :key="method.id"
              class="bg-luxe-ivory border border-luxe-sand/70 rounded-[2rem] p-6 shadow-[0_18px_60px_rgba(92,56,36,0.10)]"
            >
              <div
                class="flex flex-col md:flex-row md:items-start md:justify-between gap-5"
              >
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-3 mb-3">
                    <span class="text-2xl">🚚</span>

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
                    Deskripsi:
                    <span class="font-semibold">
                      {{ method.description || "-" }}
                    </span>
                  </p>

                  <div class="grid sm:grid-cols-2 gap-4 mt-5">
                    <div
                      class="bg-luxe-cream border border-luxe-sand/60 rounded-3xl p-4"
                    >
                      <p class="text-luxe-brown/60 text-sm mb-1">Biaya</p>
                      <p class="text-xl font-bold text-luxe-espresso">
                        {{ formatCurrency(method.cost) }}
                      </p>
                    </div>

                    <div
                      class="bg-luxe-cream border border-luxe-sand/60 rounded-3xl p-4"
                    >
                      <p class="text-luxe-brown/60 text-sm mb-1">
                        Urutan Tampil
                      </p>
                      <p class="text-xl font-bold text-luxe-espresso">
                        {{ method.sortOrder }}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap gap-3">
                  <button
                    @click="editMethod(method)"
                    type="button"
                    class="border border-luxe-sand text-luxe-espresso px-4 py-2 rounded-full hover:bg-luxe-cream transition"
                  >
                    Ubah
                  </button>

                  <button
                    @click="deleteMethod(method)"
                    type="button"
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
                form.id ? "Ubah Metode Pengiriman" : "Tambah Metode Pengiriman"
              }}
            </h2>

            <form class="space-y-5" @submit.prevent="submitForm">
              <div>
                <label class="block text-sm text-luxe-brown/75 mb-2">
                  Kode
                </label>

                <input
                  v-model="form.code"
                  type="text"
                  placeholder="standard / express"
                  class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                />

                <p class="text-xs text-luxe-brown/60 mt-2 leading-5">
                  Kode digunakan oleh sistem checkout. Contoh: standard,
                  express, same-day.
                </p>
              </div>

              <div>
                <label class="block text-sm text-luxe-brown/75 mb-2">
                  Nama Metode
                </label>

                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Pengiriman Standar"
                  class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                />
              </div>

              <div>
                <label class="block text-sm text-luxe-brown/75 mb-2">
                  Deskripsi
                </label>

                <input
                  v-model="form.description"
                  type="text"
                  placeholder="2-4 hari kerja"
                  class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                />
              </div>

              <div>
                <label class="block text-sm text-luxe-brown/75 mb-2">
                  Biaya
                </label>

                <input
                  v-model.number="form.cost"
                  type="number"
                  min="0"
                  placeholder="20000"
                  class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-luxe-brown/75 mb-2">
                    Status
                  </label>

                  <LuxeSelect
                    v-model="form.is_active"
                    :options="statusOptions"
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
                    min="0"
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
                      ? "Perbarui Metode Pengiriman"
                      : "Buat Metode Pengiriman"
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
import LuxeSelect from "../components/ui/LuxeSelect.vue";

import { shippingMethodService } from "../services/shippingMethodService";
import { useToastStore } from "../stores/toastStore";
import { formatCurrency } from "../utils/formatCurrency";

const toastStore = useToastStore();

const shippingMethods = ref([]);
const isLoading = ref(false);
const isSubmitting = ref(false);

const statusOptions = [
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
  code: "",
  name: "",
  description: "",
  cost: 0,
  is_active: true,
  sort_order: 0,
});

const form = reactive(defaultForm());

const resetForm = () => {
  Object.assign(form, defaultForm());
};

const loadShippingMethods = async () => {
  isLoading.value = true;

  try {
    shippingMethods.value =
      await shippingMethodService.getAdminShippingMethods();
  } catch (error) {
    toastStore.showToast({
      title: "Gagal Memuat Pengiriman",
      message: error?.message || "Metode pengiriman belum dapat dimuat.",
      type: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

const editMethod = (method) => {
  form.id = method.id;
  form.code = method.code || "";
  form.name = method.name || "";
  form.description = method.description || "";
  form.cost = Number(method.cost || 0);
  form.is_active = Boolean(method.isActive);
  form.sort_order = Number(method.sortOrder || 0);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const buildPayload = () => {
  return {
    code: form.code.trim(),
    name: form.name.trim(),
    description: form.description.trim(),
    cost: Number(form.cost || 0),
    is_active: Boolean(form.is_active),
    sort_order: Number(form.sort_order || 0),
  };
};

const validateForm = () => {
  if (!form.name.trim()) {
    toastStore.showToast({
      title: "Nama Metode Wajib Diisi",
      message: "Silakan masukkan nama metode pengiriman.",
      type: "error",
    });

    return false;
  }

  if (Number(form.cost || 0) < 0) {
    toastStore.showToast({
      title: "Biaya Tidak Valid",
      message: "Biaya pengiriman tidak boleh bernilai negatif.",
      type: "error",
    });

    return false;
  }

  return true;
};

const submitForm = async () => {
  if (isSubmitting.value) return;

  if (!validateForm()) return;

  isSubmitting.value = true;

  try {
    const payload = buildPayload();

    if (form.id) {
      await shippingMethodService.updateShippingMethod(form.id, payload);

      toastStore.showToast({
        title: "Metode Pengiriman Diperbarui",
        message: "Metode pengiriman berhasil diperbarui.",
        type: "success",
      });
    } else {
      await shippingMethodService.createShippingMethod(payload);

      toastStore.showToast({
        title: "Metode Pengiriman Dibuat",
        message: "Metode pengiriman baru berhasil dibuat.",
        type: "success",
      });
    }

    resetForm();
    await loadShippingMethods();
  } catch (error) {
    toastStore.showToast({
      title: "Gagal Menyimpan Pengiriman",
      message:
        error?.errors?.code?.[0] ||
        error?.errors?.name?.[0] ||
        error?.message ||
        "Metode pengiriman belum dapat disimpan.",
      type: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};

const deleteMethod = async (method) => {
  const confirmed = window.confirm(
    `Hapus metode pengiriman "${method.name}"? Tindakan ini tidak dapat dibatalkan.`,
  );

  if (!confirmed) return;

  try {
    await shippingMethodService.deleteShippingMethod(method.id);

    toastStore.showToast({
      title: "Metode Pengiriman Dihapus",
      message: "Metode pengiriman berhasil dihapus.",
      type: "success",
    });

    if (form.id === method.id) {
      resetForm();
    }

    await loadShippingMethods();
  } catch (error) {
    toastStore.showToast({
      title: "Gagal Menghapus Pengiriman",
      message: error?.message || "Metode pengiriman belum dapat dihapus.",
      type: "error",
    });
  }
};

onMounted(() => {
  loadShippingMethods();
});
</script>
