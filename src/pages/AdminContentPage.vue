<template>
  <div>
    <Navbar />
    <CartSidebar />

    <section class="pt-36 pb-24 px-6">
      <div class="max-w-7xl mx-auto">
        <!-- HEADER -->
        <div
          class="mb-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
        >
          <div>
            <p class="uppercase tracking-[4px] text-sm text-luxe-brown mb-4">
              Panel Admin
            </p>

            <h1 class="text-4xl md:text-5xl font-bold mb-4 text-luxe-espresso">
              Konten Website
            </h1>

            <p class="text-luxe-brown/75 max-w-2xl leading-7">
              Kelola teks website, label, deskripsi, konten footer, dan visual
              berbasis CMS tanpa perlu mengubah kode frontend.
            </p>
          </div>

          <button
            @click="loadContents"
            :disabled="isLoading"
            type="button"
            class="bg-luxe-espresso text-luxe-ivory px-7 py-4 rounded-full hover:bg-luxe-royal disabled:opacity-60 transition shadow-lg shadow-luxe-brown/20"
          >
            {{ isLoading ? "Memuat..." : "Muat Ulang Konten" }}
          </button>
        </div>

        <!-- FILTER BAR -->
        <div
          class="mb-10 bg-luxe-cream border border-luxe-sand/60 rounded-[2rem] p-5 md:p-6 grid lg:grid-cols-[1fr_260px] gap-5 shadow-[0_18px_60px_rgba(92,56,36,0.10)]"
        >
          <div>
            <label class="block text-sm text-luxe-brown/75 mb-2">
              Cari Konten
            </label>

            <input
              v-model="searchKeyword"
              type="text"
              placeholder="Cari berdasarkan key, label, bagian, atau isi konten..."
              class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-full px-5 py-4 outline-none focus:border-luxe-royal transition shadow-sm"
            />
          </div>

          <div>
            <label class="block text-sm text-luxe-brown/75 mb-2">
              Bagian
            </label>

            <LuxeSelect
              v-model="sectionFilter"
              :options="sectionOptions"
              placeholder="Semua Bagian"
            />
          </div>
        </div>

        <!-- LOADING -->
        <div
          v-if="isLoading"
          class="bg-luxe-cream border border-luxe-sand/60 rounded-[2rem] p-10 text-center text-luxe-brown/75"
        >
          Memuat konten website...
        </div>

        <!-- ERROR -->
        <div
          v-else-if="errorMessage"
          class="bg-red-50 border border-red-100 rounded-[2rem] p-10 text-center"
        >
          <p class="text-4xl mb-4">⚠️</p>

          <h2 class="text-2xl font-bold text-red-700 mb-3">
            Konten Belum Dapat Dimuat
          </h2>

          <p class="text-red-600 mb-6">
            {{ errorMessage }}
          </p>

          <button
            @click="loadContents"
            type="button"
            class="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition"
          >
            Coba Lagi
          </button>
        </div>

        <!-- EMPTY -->
        <div
          v-else-if="filteredContents.length === 0"
          class="bg-luxe-cream border border-luxe-sand/60 rounded-[2rem] p-10 text-center"
        >
          <p class="text-5xl mb-5">🔎</p>

          <h2 class="text-3xl font-bold text-luxe-espresso mb-3">
            Konten tidak ditemukan
          </h2>

          <p class="text-luxe-brown/75 mb-6">
            Coba gunakan kata kunci lain atau pilih bagian yang berbeda.
          </p>

          <button
            @click="resetFilters"
            type="button"
            class="bg-luxe-espresso text-luxe-ivory px-6 py-3 rounded-full hover:bg-luxe-royal transition"
          >
            Atur Ulang Filter
          </button>
        </div>

        <!-- CONTENT GROUPS -->
        <div v-else class="space-y-10">
          <div
            v-for="group in groupedFilteredContents"
            :key="group.section"
            class="bg-luxe-cream border border-luxe-sand/60 rounded-[2rem] overflow-hidden shadow-[0_18px_60px_rgba(92,56,36,0.10)]"
          >
            <!-- GROUP HEADER -->
            <div
              class="bg-luxe-espresso text-luxe-ivory px-6 md:px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div>
                <p class="text-sm text-luxe-sand mb-1">Bagian Konten</p>

                <h2 class="text-2xl md:text-3xl font-bold">
                  {{ formatSectionName(group.section) }}
                </h2>
              </div>

              <span
                class="bg-luxe-ivory/10 border border-luxe-sand/30 text-luxe-sand px-4 py-2 rounded-full text-sm"
              >
                {{ group.items.length }} item
              </span>
            </div>

            <!-- ITEMS -->
            <div class="p-5 md:p-7 space-y-5">
              <div
                v-for="item in group.items"
                :key="item.id"
                class="bg-luxe-ivory border border-luxe-sand/60 rounded-3xl p-5 md:p-6"
              >
                <div
                  class="mb-5 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4"
                >
                  <div class="min-w-0">
                    <div class="flex flex-wrap items-center gap-3 mb-2">
                      <h3 class="text-xl font-bold text-luxe-espresso">
                        {{ item.label }}
                      </h3>

                      <span
                        class="text-xs px-3 py-1 rounded-full bg-luxe-cream text-luxe-brown/75 border border-luxe-sand/60"
                      >
                        {{ formatInputType(item.inputType) }}
                      </span>

                      <span
                        :class="
                          item.isPublic
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        "
                        class="text-xs px-3 py-1 rounded-full"
                      >
                        {{ item.isPublic ? "Publik" : "Tersembunyi" }}
                      </span>
                    </div>

                    <p class="text-sm text-luxe-brown/60 break-all">
                      {{ item.contentKey }}
                    </p>
                  </div>

                  <button
                    @click="saveContent(item)"
                    :disabled="savingIds.includes(item.id)"
                    type="button"
                    class="bg-luxe-espresso text-luxe-ivory px-5 py-3 rounded-full hover:bg-luxe-royal disabled:opacity-60 transition w-fit"
                  >
                    {{
                      savingIds.includes(item.id)
                        ? "Menyimpan..."
                        : "Simpan Perubahan"
                    }}
                  </button>
                </div>

                <div class="grid lg:grid-cols-[1fr_220px] gap-5">
                  <!-- VALUE -->
                  <div>
                    <label class="block text-sm text-luxe-brown/75 mb-2">
                      Isi Konten
                    </label>

                    <textarea
                      v-if="item.inputType === 'textarea'"
                      v-model="item.value"
                      rows="5"
                      class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition resize-none"
                    ></textarea>

                    <input
                      v-else
                      v-model="item.value"
                      :type="
                        item.inputType === 'url' || item.inputType === 'image'
                          ? 'text'
                          : 'text'
                      "
                      class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                    />

                    <div
                      v-if="item.inputType === 'image'"
                      class="mt-4 space-y-3"
                    >
                      <p class="text-xs text-luxe-brown/60 leading-5">
                        Contoh: /app/logo/luxeza-logo.png atau URL gambar penuh.
                      </p>

                      <div class="flex flex-col sm:flex-row gap-3">
                        <label
                          :class="
                            uploadingIds.includes(item.id)
                              ? 'opacity-60 cursor-not-allowed'
                              : 'cursor-pointer hover:bg-luxe-royal'
                          "
                          class="inline-flex items-center justify-center bg-luxe-espresso text-luxe-ivory px-5 py-3 rounded-full transition w-fit"
                        >
                          <input
                            type="file"
                            accept="image/*"
                            class="hidden"
                            :disabled="uploadingIds.includes(item.id)"
                            @change="handleImageUpload($event, item)"
                          />

                          {{
                            uploadingIds.includes(item.id)
                              ? "Mengunggah..."
                              : "Unggah Gambar"
                          }}
                        </label>

                        <button
                          v-if="item.value"
                          @click="item.value = ''"
                          type="button"
                          class="inline-flex items-center justify-center border border-red-200 text-red-600 px-5 py-3 rounded-full hover:bg-red-50 transition w-fit"
                        >
                          Hapus Gambar
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- OPTIONS -->
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm text-luxe-brown/75 mb-2">
                        Urutan Tampil
                      </label>

                      <input
                        v-model.number="item.sortOrder"
                        type="number"
                        class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                      />
                    </div>

                    <label
                      class="flex items-center gap-3 bg-luxe-cream border border-luxe-sand/60 rounded-2xl px-5 py-4 cursor-pointer"
                    >
                      <input
                        v-model="item.isPublic"
                        type="checkbox"
                        class="w-5 h-5 accent-luxe-espresso"
                      />

                      <span class="text-sm font-medium text-luxe-espresso">
                        Tampilkan untuk publik
                      </span>
                    </label>
                  </div>
                </div>

                <!-- IMAGE PREVIEW -->
                <div
                  v-if="item.inputType === 'image' && item.value"
                  class="mt-5 bg-luxe-cream border border-luxe-sand/60 rounded-3xl p-5"
                >
                  <p class="text-sm font-semibold text-luxe-espresso mb-4">
                    Pratinjau Gambar
                  </p>

                  <img
                    :src="previewImage(item.value)"
                    :alt="item.label"
                    class="w-28 h-28 object-contain rounded-2xl bg-luxe-ivory border border-luxe-sand/60 p-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";

import Navbar from "../components/layout/Navbar.vue";
import CartSidebar from "../components/layout/CartSidebar.vue";
import Footer from "../components/layout/Footer.vue";

import { useSiteContentStore } from "../stores/siteContentStore";
import { useToastStore } from "../stores/toastStore";
import LuxeSelect from "../components/ui/LuxeSelect.vue";

const siteContentStore = useSiteContentStore();
const toastStore = useToastStore();

const localContents = ref([]);
const isLoading = ref(false);
const errorMessage = ref("");
const savingIds = ref([]);
const uploadingIds = ref([]);

const searchKeyword = ref("");
const sectionFilter = ref("all");

const sectionOptions = computed(() => {
  return [
    {
      label: "Semua Bagian",
      value: "all",
    },
    ...availableSections.value.map((section) => ({
      label: formatSectionName(section),
      value: section,
    })),
  ];
});

const cloneContent = (item) => {
  return {
    ...item,
    value: item.value || "",
    sortOrder: Number(item.sortOrder || 0),
    isPublic: Boolean(item.isPublic),
  };
};

const loadContents = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    await siteContentStore.loadAdminContents();

    localContents.value = siteContentStore.contents.map(cloneContent);
  } catch (error) {
    errorMessage.value = error?.message || "Konten website belum dapat dimuat.";

    toastStore.showToast({
      title: "Gagal Memuat Konten",
      message: errorMessage.value,
      type: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

const availableSections = computed(() => {
  return [
    ...new Set(localContents.value.map((item) => item.section).filter(Boolean)),
  ].sort();
});

const filteredContents = computed(() => {
  const keyword = searchKeyword.value.toLowerCase().trim();

  return localContents.value.filter((item) => {
    const matchesSection =
      sectionFilter.value === "all" || item.section === sectionFilter.value;

    const searchableText = [
      item.contentKey,
      item.section,
      item.label,
      item.value,
      item.inputType,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesKeyword = !keyword || searchableText.includes(keyword);

    return matchesSection && matchesKeyword;
  });
});

const groupedFilteredContents = computed(() => {
  const groups = filteredContents.value.reduce((result, item) => {
    const section = item.section || "general";

    if (!result[section]) {
      result[section] = [];
    }

    result[section].push(item);

    return result;
  }, {});

  return Object.entries(groups).map(([section, items]) => ({
    section,
    items: [...items].sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }

      return a.id - b.id;
    }),
  }));
});

const formatSectionName = (section) => {
  const sectionMap = {
    general: "Umum",
    home: "Beranda",
    hero: "Hero",
    products: "Produk",
    product: "Produk",
    categories: "Kategori",
    category: "Kategori",
    editorial: "Editorial",
    footer: "Footer",
    navbar: "Navigasi",
    navigation: "Navigasi",
    checkout: "Checkout",
    payment: "Pembayaran",
    shipping: "Pengiriman",
    order: "Pesanan",
    orders: "Pesanan",
    auth: "Akun",
    account: "Akun",
  };

  const key = String(section || "general").toLowerCase();

  if (sectionMap[key]) {
    return sectionMap[key];
  }

  return String(section || "Umum")
    .split("_")
    .join(" ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatInputType = (inputType) => {
  const typeMap = {
    text: "Teks",
    textarea: "Paragraf",
    image: "Gambar",
    url: "URL",
    number: "Angka",
  };

  return typeMap[inputType] || inputType;
};

const previewImage = (url) => {
  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return url.startsWith("/") ? url : `/${url}`;
};

const handleImageUpload = async (event, item) => {
  const file = event.target.files?.[0];

  event.target.value = "";

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    toastStore.showToast({
      title: "File Tidak Valid",
      message: "Silakan unggah file gambar.",
      type: "error",
    });

    return;
  }

  const maxSize = 3 * 1024 * 1024;

  if (file.size > maxSize) {
    toastStore.showToast({
      title: "File Terlalu Besar",
      message: "Ukuran gambar maksimal 3 MB.",
      type: "error",
    });

    return;
  }

  if (uploadingIds.value.includes(item.id)) return;

  uploadingIds.value.push(item.id);

  try {
    const uploaded = await siteContentStore.uploadImage(file);

    const imageUrl = uploaded?.image_url || uploaded?.url || "";

    if (!imageUrl) {
      throw new Error("URL gambar tidak dikembalikan oleh server.");
    }

    item.value = imageUrl;

    await saveContent(item);
  } catch (error) {
    toastStore.showToast({
      title: "Unggah Gambar Gagal",
      message: error?.message || "Gambar belum dapat diunggah.",
      type: "error",
    });
  } finally {
    uploadingIds.value = uploadingIds.value.filter((id) => id !== item.id);
  }
};

const saveContent = async (item) => {
  if (savingIds.value.includes(item.id)) return;

  savingIds.value.push(item.id);

  try {
    await siteContentStore.updateContent(item.id, {
      label: item.label,
      value: item.value,
      input_type: item.inputType,
      is_public: item.isPublic,
      sort_order: Number(item.sortOrder || 0),
    });

    localContents.value = localContents.value.map((content) =>
      content.id === item.id ? cloneContent(item) : content,
    );

    toastStore.showToast({
      title: "Konten Berhasil Diperbarui",
      message: `${item.label} berhasil diperbarui.`,
      type: "success",
    });
  } catch (error) {
    toastStore.showToast({
      title: "Gagal Memperbarui Konten",
      message: error?.message || "Konten belum dapat diperbarui.",
      type: "error",
    });
  } finally {
    savingIds.value = savingIds.value.filter((id) => id !== item.id);
  }
};

const resetFilters = () => {
  searchKeyword.value = "";
  sectionFilter.value = "all";
};

onMounted(() => {
  loadContents();
});
</script>
