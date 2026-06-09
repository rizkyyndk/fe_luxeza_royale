<template>
  <div>
    <Navbar />
    <CartSidebar />

    <section class="pt-32 pb-24 px-6 min-h-screen">
      <div class="max-w-7xl mx-auto">
        <div class="mb-10">
          <p class="uppercase tracking-[4px] text-sm text-luxe-brown mb-3">
            Akun
          </p>

          <div
            class="flex flex-col md:flex-row md:items-end md:justify-between gap-5"
          >
            <div>
              <h1 class="text-4xl md:text-5xl font-bold text-luxe-espresso">
                Alamat Saya
              </h1>

              <p class="text-luxe-brown/70 mt-4 leading-7 max-w-2xl">
                Kelola alamat pengiriman Anda agar proses checkout berikutnya
                menjadi lebih cepat dan nyaman.
              </p>
            </div>

            <button
              type="button"
              @click="startCreate"
              class="bg-luxe-espresso text-luxe-ivory px-7 py-4 rounded-full hover:bg-luxe-royal hover:scale-[1.02] transition shadow-lg shadow-luxe-brown/20"
            >
              + Tambah Alamat Baru
            </button>
          </div>
        </div>

        <div
          v-if="!authStore.isAuthenticated"
          class="bg-luxe-cream border border-luxe-sand/70 rounded-[2rem] p-8 text-center"
        >
          <h2 class="text-2xl font-bold text-luxe-espresso mb-3">
            Silakan masuk terlebih dahulu
          </h2>

          <p class="text-luxe-brown/70 mb-6">
            Anda perlu masuk untuk mengelola alamat tersimpan.
          </p>

          <RouterLink
            to="/login"
            class="inline-block bg-luxe-espresso text-luxe-ivory px-7 py-4 rounded-full hover:bg-luxe-royal transition"
          >
            Masuk
          </RouterLink>
        </div>

        <div v-else class="grid lg:grid-cols-[1fr_460px] gap-8 items-start">
          <!-- ADDRESS LIST -->
          <div class="space-y-5">
            <div
              v-if="isLoadingAddresses"
              class="bg-luxe-cream border border-luxe-sand/70 rounded-[2rem] p-8 text-luxe-brown/70"
            >
              Memuat alamat tersimpan...
            </div>

            <div
              v-else-if="addressError"
              class="bg-red-50 border border-red-100 rounded-[2rem] p-8 text-red-600"
            >
              {{ addressError }}
            </div>

            <div
              v-else-if="addresses.length === 0"
              class="bg-luxe-cream border border-luxe-sand/70 rounded-[2rem] p-8 text-center"
            >
              <p class="text-5xl mb-5">📍</p>

              <h2 class="text-2xl font-bold text-luxe-espresso mb-3">
                Belum ada alamat tersimpan
              </h2>

              <p class="text-luxe-brown/70">
                Tambahkan alamat pengiriman pertama Anda agar checkout lebih
                cepat.
              </p>
            </div>

            <div
              v-for="address in addresses"
              :key="address.id"
              class="bg-luxe-ivory border border-luxe-sand/70 rounded-[2rem] p-5 md:p-6 shadow-[0_18px_60px_rgba(92,56,36,0.10)]"
            >
              <div
                class="flex flex-col md:flex-row md:items-start md:justify-between gap-5"
              >
                <div class="flex-1">
                  <div class="flex flex-wrap items-center gap-3 mb-4">
                    <h2 class="text-2xl font-bold text-luxe-espresso">
                      {{ address.label }}
                    </h2>

                    <span
                      v-if="address.isPrimary"
                      class="text-xs bg-luxe-espresso text-luxe-ivory px-3 py-1 rounded-full"
                    >
                      Utama
                    </span>
                  </div>

                  <AddressSummaryCard
                    :customer="addressToCustomer(address)"
                    title="Alamat Pengiriman"
                    eyebrow="Alamat Tersimpan"
                  />
                </div>

                <div class="flex md:flex-col gap-3 md:w-40">
                  <button
                    type="button"
                    @click="startEdit(address)"
                    class="flex-1 border border-luxe-sand text-luxe-espresso px-5 py-3 rounded-full hover:bg-luxe-cream transition"
                  >
                    Ubah
                  </button>

                  <button
                    v-if="!address.isPrimary"
                    type="button"
                    @click="setPrimary(address)"
                    class="flex-1 border border-luxe-sand text-luxe-espresso px-5 py-3 rounded-full hover:bg-luxe-cream transition"
                  >
                    Jadikan Utama
                  </button>

                  <button
                    type="button"
                    @click="deleteAddress(address)"
                    class="flex-1 border border-red-100 text-red-500 px-5 py-3 rounded-full hover:bg-red-50 transition"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- FORM -->
          <aside
            class="bg-luxe-cream border border-luxe-sand/70 rounded-[2rem] p-5 md:p-6 sticky top-28"
          >
            <div class="mb-6">
              <p
                class="uppercase tracking-[3px] text-xs text-luxe-brown/70 mb-2"
              >
                {{ editingAddressId ? "Ubah Alamat" : "Alamat Baru" }}
              </p>

              <h2 class="text-2xl font-bold text-luxe-espresso">
                {{ editingAddressId ? "Perbarui Alamat" : "Tambah Alamat" }}
              </h2>
            </div>

            <form class="space-y-5" @submit.prevent="submitAddress">
              <div>
                <label
                  class="block text-sm font-medium text-luxe-brown/75 mb-2"
                >
                  Label Alamat
                </label>

                <input
                  v-model="form.label"
                  type="text"
                  placeholder="Rumah, Kantor, Kos"
                  class="input-field"
                />

                <p v-if="errors.label" class="error-text">
                  {{ errors.label }}
                </p>
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-luxe-brown/75 mb-2"
                >
                  Nama Penerima
                </label>

                <input
                  v-model="form.recipientName"
                  type="text"
                  placeholder="Nama penerima"
                  class="input-field"
                />

                <p v-if="errors.recipientName" class="error-text">
                  {{ errors.recipientName }}
                </p>
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-luxe-brown/75 mb-2"
                >
                  Nomor Telepon
                </label>

                <div class="flex">
                  <div
                    class="px-5 py-4 rounded-l-2xl border border-r-0 border-luxe-sand bg-luxe-ivory text-luxe-espresso font-semibold"
                  >
                    +62
                  </div>

                  <input
                    v-model="form.phone"
                    @input="handlePhoneInput"
                    type="text"
                    inputmode="numeric"
                    placeholder="81234567890"
                    class="w-full border border-luxe-sand rounded-r-2xl px-5 py-4 outline-none focus:border-luxe-royal transition bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50"
                  />
                </div>

                <p v-if="errors.phone" class="error-text">
                  {{ errors.phone }}
                </p>
              </div>

              <SearchableSelect
                v-model="form.provinceId"
                label="Provinsi"
                :options="provinces"
                :loading="isLoadingProvinces"
                placeholder="Pilih Provinsi"
                search-placeholder="Cari provinsi..."
                :error="errors.province"
                @change="handleProvinceChange"
              />

              <SearchableSelect
                v-model="form.cityId"
                label="Kota / Kabupaten"
                :options="cities"
                :loading="isLoadingCities"
                :disabled="!form.provinceId || isLoadingCities"
                placeholder="Pilih Kota / Kabupaten"
                search-placeholder="Cari kota atau kabupaten..."
                :error="errors.city"
                @change="handleCityChange"
              />

              <SearchableSelect
                v-model="form.districtId"
                label="Kecamatan"
                :options="districts"
                :loading="isLoadingDistricts"
                :disabled="!form.cityId || isLoadingDistricts"
                placeholder="Pilih Kecamatan"
                search-placeholder="Cari kecamatan..."
                :error="errors.district"
                @change="handleDistrictChange"
              />

              <SearchableSelect
                v-model="form.villageId"
                label="Kelurahan / Desa"
                :options="villages"
                :loading="isLoadingVillages"
                :disabled="!form.districtId || isLoadingVillages"
                placeholder="Pilih Kelurahan / Desa"
                search-placeholder="Cari kelurahan atau desa..."
                :error="errors.village"
                @change="handleVillageChange"
              />

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium text-luxe-brown/75 mb-2"
                  >
                    RT
                  </label>

                  <input
                    v-model="form.rt"
                    @input="handleNumericInput('rt')"
                    type="text"
                    inputmode="numeric"
                    placeholder="001"
                    class="input-field"
                  />

                  <p v-if="errors.rt" class="error-text">
                    {{ errors.rt }}
                  </p>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-luxe-brown/75 mb-2"
                  >
                    RW
                  </label>

                  <input
                    v-model="form.rw"
                    @input="handleNumericInput('rw')"
                    type="text"
                    inputmode="numeric"
                    placeholder="002"
                    class="input-field"
                  />

                  <p v-if="errors.rw" class="error-text">
                    {{ errors.rw }}
                  </p>
                </div>
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-luxe-brown/75 mb-2"
                >
                  Kode Pos
                </label>

                <input
                  v-model="form.postalCode"
                  @input="handleNumericInput('postalCode')"
                  type="text"
                  inputmode="numeric"
                  placeholder="15710"
                  class="input-field"
                />

                <p v-if="errors.postalCode" class="error-text">
                  {{ errors.postalCode }}
                </p>
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-luxe-brown/75 mb-2"
                >
                  Detail Alamat
                </label>

                <textarea
                  v-model="form.addressDetail"
                  rows="4"
                  placeholder="Nama jalan, nomor rumah, gedung, atau patokan alamat"
                  class="input-field resize-none"
                ></textarea>

                <p v-if="errors.addressDetail" class="error-text">
                  {{ errors.addressDetail }}
                </p>
              </div>

              <label
                class="flex items-center gap-3 bg-luxe-ivory border border-luxe-sand/70 rounded-2xl px-5 py-4 cursor-pointer"
              >
                <input
                  v-model="form.isPrimary"
                  type="checkbox"
                  class="w-5 h-5 accent-black"
                />

                <span class="text-sm text-luxe-espresso">
                  Jadikan alamat utama
                </span>
              </label>

              <div class="flex gap-3">
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="flex-1 bg-luxe-espresso text-luxe-ivory py-4 rounded-full hover:bg-luxe-royal disabled:opacity-50 transition"
                >
                  {{
                    isSubmitting
                      ? "Menyimpan..."
                      : editingAddressId
                        ? "Perbarui"
                        : "Simpan"
                  }}
                </button>

                <button
                  type="button"
                  @click="resetForm"
                  class="border border-luxe-sand text-luxe-espresso px-6 py-4 rounded-full hover:bg-luxe-ivory transition"
                >
                  Bersihkan
                </button>
              </div>
            </form>
          </aside>
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
import SearchableSelect from "../components/ui/SearchableSelect.vue";
import AddressSummaryCard from "../components/order/AddressSummaryCard.vue";

import { regionService } from "../services/regionService";
import { userAddressService } from "../services/userAddressService";
import { useAuthStore } from "../stores/authStore";
import { useToastStore } from "../stores/toastStore";

const authStore = useAuthStore();
const toastStore = useToastStore();

const addresses = ref([]);
const isLoadingAddresses = ref(false);
const addressError = ref("");

const provinces = ref([]);
const cities = ref([]);
const districts = ref([]);
const villages = ref([]);

const isLoadingProvinces = ref(false);
const isLoadingCities = ref(false);
const isLoadingDistricts = ref(false);
const isLoadingVillages = ref(false);

const editingAddressId = ref(null);
const isSubmitting = ref(false);
const errors = ref({});

const form = reactive({
  label: "Rumah",
  recipientName: "",
  phone: "",

  provinceId: "",
  province: "",

  cityId: "",
  city: "",

  districtId: "",
  district: "",

  villageId: "",
  village: "",

  rt: "",
  rw: "",
  postalCode: "",
  addressDetail: "",

  isPrimary: false,
});

const normalizePhoneNumber = (phone) => {
  const digits = String(phone || "")
    .replace(/\D/g, "")
    .replace(/^0+/, "");

  return `62${digits}`;
};

const phoneWithoutCountryCode = (phone) => {
  return String(phone || "")
    .replace(/\D/g, "")
    .replace(/^62/, "")
    .replace(/^0+/, "");
};

const handlePhoneInput = () => {
  form.phone = String(form.phone || "")
    .replace(/\D/g, "")
    .replace(/^0+/, "");
};

const handleNumericInput = (field) => {
  form[field] = String(form[field] || "").replace(/\D/g, "");
};

const findRegionName = (items, id) => {
  return items.find((item) => String(item.id) === String(id))?.name || "";
};

const addressToCustomer = (address) => {
  return {
    fullName: address.recipientName,
    phone: address.phone,
    province: address.province,
    city: address.city,
    district: address.district,
    village: address.village,
    rt: address.rt,
    rw: address.rw,
    postalCode: address.postalCode,
    addressDetail: address.addressDetail,
  };
};

const loadAddresses = async () => {
  if (!authStore.token) return;

  isLoadingAddresses.value = true;
  addressError.value = "";

  try {
    addresses.value = await userAddressService.getAddresses();
  } catch (error) {
    if (error?.status === 401) {
      authStore.clearAuth();
      addressError.value = "";
      return;
    }

    addressError.value = error?.message || "Gagal memuat alamat tersimpan.";
  } finally {
    isLoadingAddresses.value = false;
  }
};

const loadProvinces = async () => {
  isLoadingProvinces.value = true;

  try {
    provinces.value = await regionService.getProvinces();
  } finally {
    isLoadingProvinces.value = false;
  }
};

const loadCities = async (provinceId) => {
  cities.value = [];
  districts.value = [];
  villages.value = [];

  if (!provinceId) return;

  isLoadingCities.value = true;

  try {
    cities.value = await regionService.getCities(provinceId);
  } finally {
    isLoadingCities.value = false;
  }
};

const loadDistricts = async (cityId) => {
  districts.value = [];
  villages.value = [];

  if (!cityId) return;

  isLoadingDistricts.value = true;

  try {
    districts.value = await regionService.getDistricts(cityId);
  } finally {
    isLoadingDistricts.value = false;
  }
};

const loadVillages = async (districtId) => {
  villages.value = [];

  if (!districtId) return;

  isLoadingVillages.value = true;

  try {
    villages.value = await regionService.getVillages(districtId);
  } finally {
    isLoadingVillages.value = false;
  }
};

const handleProvinceChange = async () => {
  form.province = findRegionName(provinces.value, form.provinceId);

  form.cityId = "";
  form.city = "";
  form.districtId = "";
  form.district = "";
  form.villageId = "";
  form.village = "";

  await loadCities(form.provinceId);
};

const handleCityChange = async () => {
  form.city = findRegionName(cities.value, form.cityId);

  form.districtId = "";
  form.district = "";
  form.villageId = "";
  form.village = "";

  await loadDistricts(form.cityId);
};

const handleDistrictChange = async () => {
  form.district = findRegionName(districts.value, form.districtId);

  form.villageId = "";
  form.village = "";

  await loadVillages(form.districtId);
};

const handleVillageChange = () => {
  form.village = findRegionName(villages.value, form.villageId);
};

const validateForm = () => {
  const validationErrors = {};

  if (!form.label.trim()) {
    validationErrors.label = "Label alamat wajib diisi.";
  }

  if (!form.recipientName.trim()) {
    validationErrors.recipientName = "Nama penerima wajib diisi.";
  }

  if (!form.phone.trim()) {
    validationErrors.phone = "Nomor telepon wajib diisi.";
  }

  if (form.phone.trim() && form.phone.length < 8) {
    validationErrors.phone = "Nomor telepon terlalu pendek.";
  }

  if (!form.province.trim()) {
    validationErrors.province = "Provinsi wajib dipilih.";
  }

  if (!form.city.trim()) {
    validationErrors.city = "Kota atau kabupaten wajib dipilih.";
  }

  if (!form.district.trim()) {
    validationErrors.district = "Kecamatan wajib dipilih.";
  }

  if (!form.village.trim()) {
    validationErrors.village = "Kelurahan atau desa wajib dipilih.";
  }

  if (!form.rt.trim()) {
    validationErrors.rt = "RT wajib diisi.";
  }

  if (!form.rw.trim()) {
    validationErrors.rw = "RW wajib diisi.";
  }

  if (!form.postalCode.trim()) {
    validationErrors.postalCode = "Kode pos wajib diisi.";
  }

  if (!form.addressDetail.trim()) {
    validationErrors.addressDetail = "Detail alamat wajib diisi.";
  }

  errors.value = validationErrors;

  return Object.keys(validationErrors).length === 0;
};

const buildPayload = () => {
  return {
    label: form.label,
    recipient_name: form.recipientName,
    phone: normalizePhoneNumber(form.phone),

    province_id: form.provinceId,
    province: form.province,

    city_id: form.cityId,
    city: form.city,

    district_id: form.districtId,
    district: form.district,

    village_id: form.villageId,
    village: form.village,

    rt: form.rt,
    rw: form.rw,
    postal_code: form.postalCode,
    address_detail: form.addressDetail,

    is_primary: form.isPrimary,
  };
};

const resetForm = () => {
  editingAddressId.value = null;
  errors.value = {};

  form.label = "Rumah";
  form.recipientName = "";
  form.phone = "";

  form.provinceId = "";
  form.province = "";

  form.cityId = "";
  form.city = "";

  form.districtId = "";
  form.district = "";

  form.villageId = "";
  form.village = "";

  form.rt = "";
  form.rw = "";
  form.postalCode = "";
  form.addressDetail = "";

  form.isPrimary = addresses.value.length === 0;

  cities.value = [];
  districts.value = [];
  villages.value = [];
};

const startCreate = () => {
  resetForm();
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const startEdit = async (address) => {
  editingAddressId.value = address.id;
  errors.value = {};

  form.label = address.label || "Rumah";
  form.recipientName = address.recipientName || "";
  form.phone = phoneWithoutCountryCode(address.phone);

  form.provinceId = address.provinceId || "";
  form.province = address.province || "";

  form.cityId = "";
  form.city = "";
  form.districtId = "";
  form.district = "";
  form.villageId = "";
  form.village = "";

  cities.value = [];
  districts.value = [];
  villages.value = [];

  if (form.provinceId) {
    await loadCities(form.provinceId);
  }

  form.cityId = address.cityId || "";
  form.city = address.city || "";

  if (form.cityId) {
    await loadDistricts(form.cityId);
  }

  form.districtId = address.districtId || "";
  form.district = address.district || "";

  if (form.districtId) {
    await loadVillages(form.districtId);
  }

  form.villageId = address.villageId || "";
  form.village = address.village || "";

  form.rt = address.rt || "";
  form.rw = address.rw || "";
  form.postalCode = address.postalCode || "";
  form.addressDetail = address.addressDetail || "";
  form.isPrimary = Boolean(address.isPrimary);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const submitAddress = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;

  try {
    if (editingAddressId.value) {
      await userAddressService.updateAddress(
        editingAddressId.value,
        buildPayload(),
      );

      toastStore.showToast({
        title: "Alamat Berhasil Diperbarui",
        message: "Alamat Anda berhasil diperbarui.",
        type: "success",
      });
    } else {
      await userAddressService.createAddress(buildPayload());

      toastStore.showToast({
        title: "Alamat Berhasil Disimpan",
        message: "Alamat baru Anda berhasil disimpan.",
        type: "success",
      });
    }

    await loadAddresses();
    resetForm();
  } catch (error) {
    toastStore.showToast({
      title: "Gagal Menyimpan Alamat",
      message: error?.message || "Silakan periksa kembali formulir alamat.",
      type: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};

const deleteAddress = async (address) => {
  const confirmed = window.confirm(`Hapus alamat "${address.label}"?`);

  if (!confirmed) return;

  try {
    await userAddressService.deleteAddress(address.id);

    toastStore.showToast({
      title: "Alamat Berhasil Dihapus",
      message: "Alamat telah dihapus dari daftar alamat Anda.",
      type: "success",
    });

    await loadAddresses();
    resetForm();
  } catch (error) {
    toastStore.showToast({
      title: "Gagal Menghapus Alamat",
      message: error?.message || "Silakan coba lagi.",
      type: "error",
    });
  }
};

const setPrimary = async (address) => {
  try {
    await userAddressService.setPrimaryAddress(address.id);

    toastStore.showToast({
      title: "Alamat Utama Diperbarui",
      message: `${address.label} sekarang menjadi alamat utama Anda.`,
      type: "success",
    });

    await loadAddresses();
  } catch (error) {
    toastStore.showToast({
      title: "Gagal Mengubah Alamat Utama",
      message: error?.message || "Silakan coba lagi.",
      type: "error",
    });
  }
};

onMounted(async () => {
  await loadProvinces();
  await loadAddresses();

  form.isPrimary = addresses.value.length === 0;
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
