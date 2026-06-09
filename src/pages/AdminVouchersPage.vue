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
              Voucher
            </h1>

            <p class="text-luxe-brown/75 max-w-xl leading-7">
              Kelola voucher diskon untuk proses checkout Luxeza Royale.
            </p>
          </div>

          <button
            @click="resetForm"
            class="bg-luxe-espresso text-luxe-ivory px-6 py-3 rounded-full hover:bg-luxe-royal transition w-fit"
          >
            Tambah Voucher
          </button>
        </div>

        <div class="grid lg:grid-cols-[1fr_420px] gap-8">
          <!-- LIST -->
          <div class="space-y-5">
            <!-- FILTER -->
            <div
              class="bg-luxe-ivory border border-luxe-sand/70 rounded-[2rem] p-6 shadow-[0_18px_60px_rgba(92,56,36,0.08)]"
            >
              <div class="grid md:grid-cols-[1fr_220px_auto_auto] gap-4">
                <input
                  v-model="filters.search"
                  type="text"
                  placeholder="Cari kode voucher..."
                  class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                  @keyup.enter="loadVouchers"
                />

                <LuxeSelect
                  v-model="filters.status"
                  :options="voucherStatusFilterOptions"
                  placeholder="Semua Status"
                />

                <button
                  @click="loadVouchers"
                  class="bg-luxe-espresso text-luxe-ivory px-6 py-3 rounded-full hover:bg-luxe-royal transition"
                >
                  Terapkan
                </button>

                <button
                  @click="clearFilters"
                  class="border border-luxe-sand text-luxe-espresso px-6 py-3 rounded-full hover:bg-luxe-cream transition"
                >
                  Atur Ulang
                </button>
              </div>
            </div>

            <div
              v-if="isLoading"
              class="bg-luxe-cream border border-luxe-sand/60 rounded-[2rem] p-8 text-luxe-brown/75"
            >
              Memuat voucher...
            </div>

            <div
              v-else-if="vouchers.length === 0"
              class="bg-luxe-cream border border-luxe-sand/60 rounded-[2rem] p-8 text-luxe-brown/75"
            >
              Voucher belum tersedia.
            </div>

            <template v-else>
              <div
                v-for="voucher in vouchers"
                :key="voucher.id"
                class="bg-luxe-ivory border border-luxe-sand/70 rounded-[2rem] p-6 shadow-[0_18px_60px_rgba(92,56,36,0.10)]"
              >
                <div
                  class="flex flex-col md:flex-row md:items-start md:justify-between gap-5"
                >
                  <div>
                    <div class="flex flex-wrap items-center gap-3 mb-3">
                      <span class="text-2xl">🎟️</span>

                      <h2 class="text-2xl font-bold text-luxe-espresso">
                        {{ voucher.code }}
                      </h2>

                      <span
                        :class="
                          voucher.isActive
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        "
                        class="px-3 py-1 rounded-full text-xs font-semibold"
                      >
                        {{ voucher.isActive ? "Aktif" : "Tidak Aktif" }}
                      </span>
                    </div>

                    <p class="text-sm text-luxe-brown/75 mb-2">
                      Diskon:
                      <span class="font-semibold text-luxe-espresso">
                        {{ formatDiscount(voucher) }}
                      </span>
                    </p>

                    <p class="text-sm text-luxe-brown/75 mb-2">
                      Berlaku:
                      <span class="font-semibold text-luxe-espresso">
                        {{ formatDate(voucher.validFrom) }} -
                        {{ formatDate(voucher.validUntil) }}
                      </span>
                    </p>

                    <p class="text-sm text-luxe-brown/75 mb-2">
                      Penggunaan:
                      <span class="font-semibold text-luxe-espresso">
                        {{ voucher.usedCount }}
                        /
                        {{ voucher.usageLimit ?? "Tanpa Batas" }}
                      </span>
                    </p>
                  </div>

                  <div class="flex flex-wrap gap-3">
                    <button
                      @click="editVoucher(voucher)"
                      class="border border-luxe-sand text-luxe-espresso px-4 py-2 rounded-full hover:bg-luxe-cream transition"
                    >
                      Ubah
                    </button>

                    <button
                      @click="deleteVoucher(voucher)"
                      class="border border-red-200 text-red-600 px-4 py-2 rounded-full hover:bg-red-50 transition"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- FORM -->
          <div
            class="bg-luxe-ivory border border-luxe-sand/70 rounded-[2rem] p-6 h-fit shadow-[0_18px_60px_rgba(92,56,36,0.10)] sticky top-28"
          >
            <h2 class="text-2xl font-bold text-luxe-espresso mb-6">
              {{ form.id ? "Ubah Voucher" : "Tambah Voucher" }}
            </h2>

            <form class="space-y-5" @submit.prevent="submitForm">
              <div>
                <label class="block text-sm text-luxe-brown/75 mb-2">
                  Kode Voucher
                </label>

                <input
                  v-model="form.code"
                  type="text"
                  placeholder="LR50000 / DISKON10"
                  class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition uppercase"
                />

                <p class="text-xs text-luxe-brown/60 mt-2">
                  Kode akan disimpan dalam huruf kapital.
                </p>
              </div>

              <div>
                <label class="block text-sm text-luxe-brown/75 mb-2">
                  Jenis Diskon
                </label>

                <LuxeSelect
                  v-model="form.discount_type"
                  :options="discountTypeOptions"
                  placeholder="Pilih jenis diskon"
                />
              </div>

              <div>
                <label class="block text-sm text-luxe-brown/75 mb-2">
                  Nilai Diskon
                </label>

                <input
                  v-model.number="form.discount_value"
                  type="number"
                  min="0"
                  :max="form.discount_type === 'percent' ? 100 : null"
                  :placeholder="
                    form.discount_type === 'percent'
                      ? 'Contoh: 10'
                      : 'Contoh: 50000'
                  "
                  class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                />

                <p class="text-xs text-luxe-brown/60 mt-2">
                  {{
                    form.discount_type === "percent"
                      ? "Gunakan nilai persen antara 1 - 100."
                      : "Gunakan nominal tetap dalam Rupiah."
                  }}
                </p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-luxe-brown/75 mb-2">
                    Berlaku Mulai
                  </label>

                  <input
                    v-model="form.valid_from"
                    type="date"
                    class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                  />
                </div>

                <div>
                  <label class="block text-sm text-luxe-brown/75 mb-2">
                    Berlaku Sampai
                  </label>

                  <input
                    v-model="form.valid_until"
                    type="date"
                    class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-luxe-brown/75 mb-2">
                    Batas Penggunaan
                  </label>

                  <input
                    v-model.number="form.usage_limit"
                    type="number"
                    min="1"
                    placeholder="50"
                    class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                  />

                  <p class="text-xs text-luxe-brown/60 mt-2">
                    Kosongkan jika voucher tidak memiliki batas penggunaan.
                  </p>
                </div>

                <div>
                  <label class="block text-sm text-luxe-brown/75 mb-2">
                    Sudah Digunakan
                  </label>

                  <input
                    v-model.number="form.used_count"
                    type="number"
                    min="0"
                    class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm text-luxe-brown/75 mb-2">
                  Status
                </label>

                <LuxeSelect
                  v-model="form.is_active"
                  :options="voucherStatusOptions"
                  placeholder="Pilih status"
                />
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
                      ? "Perbarui Voucher"
                      : "Buat Voucher"
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

import { adminVoucherService } from "../services/adminVoucherService";
import { useToastStore } from "../stores/toastStore";

const toastStore = useToastStore();

const vouchers = ref([]);
const isLoading = ref(false);
const isSubmitting = ref(false);

const filters = reactive({
  search: "",
  status: "",
});

const voucherStatusFilterOptions = [
  {
    label: "Semua Status",
    value: "",
  },
  {
    label: "Aktif",
    value: "active",
  },
  {
    label: "Tidak Aktif",
    value: "inactive",
  },
];

const voucherStatusOptions = [
  {
    label: "Aktif",
    value: true,
  },
  {
    label: "Tidak Aktif",
    value: false,
  },
];

const discountTypeOptions = [
  {
    label: "Nominal Tetap",
    value: "amount",
  },
  {
    label: "Persentase",
    value: "percent",
  },
];

const defaultForm = () => ({
  id: null,
  code: "",
  discount_type: "amount",
  discount_value: "",
  valid_from: "",
  valid_until: "",
  usage_limit: "",
  used_count: 0,
  is_active: true,
});

const form = reactive(defaultForm());

const toDateInput = (value) => {
  if (!value) return "";

  return String(value).slice(0, 10);
};

const toNullableNumber = (value) => {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  return Number(value);
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
};

const formatDate = (value) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

const formatDiscount = (voucher) => {
  if (voucher.discountType === "percent") {
    return `${voucher.discountValue}%`;
  }

  return formatCurrency(voucher.discountValue);
};

const loadVouchers = async () => {
  isLoading.value = true;

  try {
    const params = {
      search: filters.search.trim(),
      status: filters.status,
    };

    vouchers.value = await adminVoucherService.getAdminVouchers(params);
  } catch (error) {
    toastStore.showToast({
      title: "Gagal Memuat Voucher",
      message: error?.message || "Voucher belum dapat dimuat.",
      type: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

const clearFilters = async () => {
  filters.search = "";
  filters.status = "";

  await loadVouchers();
};

const resetForm = () => {
  Object.assign(form, defaultForm());

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const editVoucher = (voucher) => {
  form.id = voucher.id;
  form.code = voucher.code || "";
  form.discount_type = voucher.discountType || "amount";
  form.discount_value = voucher.discountValue || "";
  form.valid_from = toDateInput(voucher.validFrom);
  form.valid_until = toDateInput(voucher.validUntil);
  form.usage_limit = voucher.usageLimit ?? "";
  form.used_count = Number(voucher.usedCount || 0);
  form.is_active = Boolean(voucher.isActive);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const buildPayload = () => {
  return {
    code: form.code.trim().toUpperCase(),
    discount_type: form.discount_type,
    discount_value: Number(form.discount_value || 0),
    valid_from: form.valid_from || null,
    valid_until: form.valid_until || null,
    usage_limit: toNullableNumber(form.usage_limit),
    used_count: Number(form.used_count || 0),
    is_active: Boolean(form.is_active),
  };
};

const validateForm = () => {
  if (!form.code.trim()) {
    return "Kode voucher wajib diisi.";
  }

  if (!form.discount_value || Number(form.discount_value) <= 0) {
    return "Nilai diskon harus lebih dari 0.";
  }

  if (
    form.discount_type === "percent" &&
    (Number(form.discount_value) < 1 || Number(form.discount_value) > 100)
  ) {
    return "Diskon persentase harus berada antara 1 sampai 100.";
  }

  if (form.valid_from && form.valid_until) {
    const validFrom = new Date(form.valid_from);
    const validUntil = new Date(form.valid_until);

    if (validUntil < validFrom) {
      return "Tanggal berlaku sampai harus setelah tanggal berlaku mulai.";
    }
  }

  if (
    form.usage_limit !== "" &&
    form.usage_limit !== null &&
    Number(form.usage_limit) < 1
  ) {
    return "Batas penggunaan minimal 1.";
  }

  if (Number(form.used_count || 0) < 0) {
    return "Jumlah penggunaan tidak boleh bernilai negatif.";
  }

  return "";
};

const submitForm = async () => {
  const validationMessage = validateForm();

  if (validationMessage) {
    toastStore.showToast({
      title: "Data Belum Valid",
      message: validationMessage,
      type: "error",
    });

    return;
  }

  isSubmitting.value = true;

  try {
    const payload = buildPayload();

    if (form.id) {
      await adminVoucherService.updateVoucher(form.id, payload);

      toastStore.showToast({
        title: "Voucher Diperbarui",
        message: "Voucher berhasil diperbarui.",
        type: "success",
      });
    } else {
      await adminVoucherService.createVoucher(payload);

      toastStore.showToast({
        title: "Voucher Dibuat",
        message: "Voucher baru berhasil dibuat.",
        type: "success",
      });
    }

    resetForm();
    await loadVouchers();
  } catch (error) {
    toastStore.showToast({
      title: "Gagal Menyimpan Voucher",
      message: error?.message || "Voucher belum dapat disimpan.",
      type: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};

const deleteVoucher = async (voucher) => {
  const isConfirmed = window.confirm(`Hapus voucher "${voucher.code}"?`);

  if (!isConfirmed) return;

  try {
    await adminVoucherService.deleteVoucher(voucher.id);

    toastStore.showToast({
      title: "Voucher Dihapus",
      message: "Voucher berhasil dihapus.",
      type: "info",
    });

    await loadVouchers();
  } catch (error) {
    toastStore.showToast({
      title: "Gagal Menghapus Voucher",
      message: error?.message || "Voucher belum dapat dihapus.",
      type: "error",
    });
  }
};

onMounted(() => {
  loadVouchers();
});
</script>
