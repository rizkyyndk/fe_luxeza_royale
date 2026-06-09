<template>
  <div
    class="fixed inset-0 z-[999] bg-luxe-espresso/60 backdrop-blur-sm px-6 flex items-center justify-center"
    @click.self="closeModal"
  >
    <div
      class="bg-luxe-ivory border border-luxe-sand/70 rounded-[2rem] w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-[0_30px_90px_rgba(43,26,18,0.28)]"
    >
      <!-- HEADER -->
      <div
        class="p-6 md:p-8 border-b border-luxe-sand/60 flex items-start justify-between gap-6"
      >
        <div>
          <p class="uppercase tracking-[4px] text-sm text-luxe-brown mb-3">
            Panduan Ukuran
          </p>

          <h2 class="text-3xl md:text-4xl font-bold text-luxe-espresso">
            {{ guideTitle }}
          </h2>

          <p class="text-luxe-brown/75 mt-3 leading-7">
            Gunakan panduan ini sebagai referensi umum sebelum memilih ukuran.
          </p>
        </div>

        <button
          @click="closeModal"
          class="text-3xl leading-none text-luxe-espresso hover:text-luxe-royal hover:scale-110 transition"
        >
          ×
        </button>
      </div>

      <!-- CONTENT -->
      <div class="p-6 md:p-8 overflow-y-auto max-h-[60vh]">
        <!-- AVAILABLE SIZE -->
        <div class="mb-8">
          <p class="font-semibold mb-4 text-luxe-espresso">Ukuran Tersedia</p>

          <div class="flex flex-wrap gap-3">
            <span
              v-for="size in sizes"
              :key="size"
              class="px-5 py-2 rounded-full bg-luxe-cream border border-luxe-sand/60 text-luxe-espresso text-sm font-medium"
            >
              {{ size }}
            </span>
          </div>
        </div>

        <!-- TABLE -->
        <div
          class="overflow-x-auto rounded-3xl border border-luxe-sand/60 bg-luxe-ivory"
        >
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-luxe-espresso text-luxe-ivory">
                <th
                  v-for="heading in tableHeadings"
                  :key="heading"
                  class="text-left px-5 py-4 text-sm font-semibold whitespace-nowrap"
                >
                  {{ heading }}
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(row, index) in sizeRows"
                :key="index"
                class="border-b border-luxe-sand/50 last:border-b-0"
              >
                <td
                  v-for="heading in tableHeadings"
                  :key="heading"
                  class="px-5 py-4 text-sm text-luxe-brown/80 whitespace-nowrap"
                >
                  {{ row[heading] }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- NOTE -->
        <div
          class="mt-8 bg-luxe-cream border border-luxe-sand/60 rounded-3xl p-6"
        >
          <h3 class="font-semibold mb-2 text-luxe-espresso">Rekomendasi Fit</h3>

          <p class="text-luxe-brown/75 leading-7 text-sm">
            {{ guideNote }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  category: {
    type: String,
    required: true,
  },
  sizes: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["close"]);

const closeModal = () => {
  emit("close");
};

const normalizedCategory = computed(() => {
  return props.category.toLowerCase();
});

const guideType = computed(() => {
  if (
    normalizedCategory.value === "shoes" ||
    normalizedCategory.value === "sepatu"
  ) {
    return "shoes";
  }

  if (
    normalizedCategory.value === "pants" ||
    normalizedCategory.value === "celana"
  ) {
    return "pants";
  }

  return "clothing";
});

const guideTitle = computed(() => {
  if (guideType.value === "shoes") return "Panduan Ukuran Sepatu";
  if (guideType.value === "pants") return "Panduan Ukuran Celana";
  return "Panduan Ukuran Pakaian";
});

const tableHeadings = computed(() => {
  if (guideType.value === "shoes") {
    return ["Ukuran", "EU", "US", "Panjang Kaki"];
  }

  if (guideType.value === "pants") {
    return ["Ukuran", "Pinggang", "Pinggul", "Panjang"];
  }

  return ["Ukuran", "Dada", "Bahu", "Panjang"];
});

const sizeRows = computed(() => {
  if (guideType.value === "shoes") {
    return [
      {
        Ukuran: "39",
        EU: "39",
        US: "6.5",
        "Panjang Kaki": "24.5 cm",
      },
      {
        Ukuran: "40",
        EU: "40",
        US: "7",
        "Panjang Kaki": "25 cm",
      },
      {
        Ukuran: "41",
        EU: "41",
        US: "8",
        "Panjang Kaki": "26 cm",
      },
      {
        Ukuran: "42",
        EU: "42",
        US: "8.5",
        "Panjang Kaki": "26.5 cm",
      },
      {
        Ukuran: "43",
        EU: "43",
        US: "9.5",
        "Panjang Kaki": "27.5 cm",
      },
      {
        Ukuran: "44",
        EU: "44",
        US: "10",
        "Panjang Kaki": "28 cm",
      },
    ];
  }

  if (guideType.value === "pants") {
    return [
      {
        Ukuran: "28",
        Pinggang: "72 cm",
        Pinggul: "90 cm",
        Panjang: "96 cm",
      },
      {
        Ukuran: "30",
        Pinggang: "76 cm",
        Pinggul: "94 cm",
        Panjang: "98 cm",
      },
      {
        Ukuran: "32",
        Pinggang: "82 cm",
        Pinggul: "100 cm",
        Panjang: "100 cm",
      },
      {
        Ukuran: "34",
        Pinggang: "86 cm",
        Pinggul: "104 cm",
        Panjang: "102 cm",
      },
      {
        Ukuran: "36",
        Pinggang: "92 cm",
        Pinggul: "110 cm",
        Panjang: "104 cm",
      },
    ];
  }

  return [
    {
      Ukuran: "S",
      Dada: "88-94 cm",
      Bahu: "42 cm",
      Panjang: "66 cm",
    },
    {
      Ukuran: "M",
      Dada: "95-100 cm",
      Bahu: "44 cm",
      Panjang: "68 cm",
    },
    {
      Ukuran: "L",
      Dada: "101-106 cm",
      Bahu: "46 cm",
      Panjang: "70 cm",
    },
    {
      Ukuran: "XL",
      Dada: "107-114 cm",
      Bahu: "48 cm",
      Panjang: "72 cm",
    },
  ];
});

const guideNote = computed(() => {
  if (guideType.value === "shoes") {
    return "Untuk sepatu, ukur panjang kaki dari tumit hingga ujung jari, lalu pilih ukuran yang paling mendekati. Jika berada di antara dua ukuran, pilih ukuran yang lebih besar agar lebih nyaman.";
  }

  if (guideType.value === "pants") {
    return "Untuk celana, gunakan ukuran pinggang sebagai acuan utama. Pilih ukuran lebih besar jika Anda menginginkan fit yang lebih santai.";
  }

  return "Untuk pakaian, gunakan ukuran dada sebagai acuan utama. Pilih satu ukuran lebih besar jika Anda menginginkan siluet yang lebih oversized dan nyaman.";
});
</script>
