<template>
  <div
    class="fixed inset-0 z-[999] bg-black/50 px-6 flex items-center justify-center"
    @click.self="closeModal"
  >
    <div
      class="bg-white rounded-[2rem] w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl"
    >
      <!-- HEADER -->
      <div
        class="p-6 md:p-8 border-b border-gray-100 flex items-start justify-between gap-6"
      >
        <div>
          <p class="uppercase tracking-[4px] text-sm text-gray-500 mb-3">
            Size Guide
          </p>

          <h2 class="text-3xl md:text-4xl font-bold">
            {{ guideTitle }}
          </h2>

          <p class="text-gray-500 mt-3 leading-7">
            Use this guide as a general reference before selecting your size.
          </p>
        </div>

        <button
          @click="closeModal"
          class="text-3xl leading-none hover:scale-110 transition"
        >
          ×
        </button>
      </div>

      <!-- CONTENT -->
      <div class="p-6 md:p-8 overflow-y-auto max-h-[60vh]">
        <!-- AVAILABLE SIZE -->
        <div class="mb-8">
          <p class="font-semibold mb-4">Available Sizes</p>

          <div class="flex flex-wrap gap-3">
            <span
              v-for="size in sizes"
              :key="size"
              class="px-5 py-2 rounded-full bg-[#f8f5f2] text-sm font-medium"
            >
              {{ size }}
            </span>
          </div>
        </div>

        <!-- TABLE -->
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-black text-white">
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
                class="border-b border-gray-100"
              >
                <td
                  v-for="heading in tableHeadings"
                  :key="heading"
                  class="px-5 py-4 text-sm text-gray-600 whitespace-nowrap"
                >
                  {{ row[heading] }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- NOTE -->
        <div class="mt-8 bg-[#f8f5f2] rounded-3xl p-6">
          <h3 class="font-semibold mb-2">Fit Recommendation</h3>

          <p class="text-gray-500 leading-7 text-sm">
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
  if (normalizedCategory.value === "shoes") return "shoes";
  if (normalizedCategory.value === "pants") return "pants";
  return "clothing";
});

const guideTitle = computed(() => {
  if (guideType.value === "shoes") return "Shoes Size Guide";
  if (guideType.value === "pants") return "Pants Size Guide";
  return "Clothing Size Guide";
});

const tableHeadings = computed(() => {
  if (guideType.value === "shoes") {
    return ["Size", "EU", "US", "Foot Length"];
  }

  if (guideType.value === "pants") {
    return ["Size", "Waist", "Hip", "Length"];
  }

  return ["Size", "Chest", "Shoulder", "Length"];
});

const sizeRows = computed(() => {
  if (guideType.value === "shoes") {
    return [
      {
        Size: "39",
        EU: "39",
        US: "6.5",
        "Foot Length": "24.5 cm",
      },
      {
        Size: "40",
        EU: "40",
        US: "7",
        "Foot Length": "25 cm",
      },
      {
        Size: "41",
        EU: "41",
        US: "8",
        "Foot Length": "26 cm",
      },
      {
        Size: "42",
        EU: "42",
        US: "8.5",
        "Foot Length": "26.5 cm",
      },
      {
        Size: "43",
        EU: "43",
        US: "9.5",
        "Foot Length": "27.5 cm",
      },
      {
        Size: "44",
        EU: "44",
        US: "10",
        "Foot Length": "28 cm",
      },
    ];
  }

  if (guideType.value === "pants") {
    return [
      {
        Size: "28",
        Waist: "72 cm",
        Hip: "90 cm",
        Length: "96 cm",
      },
      {
        Size: "30",
        Waist: "76 cm",
        Hip: "94 cm",
        Length: "98 cm",
      },
      {
        Size: "32",
        Waist: "82 cm",
        Hip: "100 cm",
        Length: "100 cm",
      },
      {
        Size: "34",
        Waist: "86 cm",
        Hip: "104 cm",
        Length: "102 cm",
      },
      {
        Size: "36",
        Waist: "92 cm",
        Hip: "110 cm",
        Length: "104 cm",
      },
    ];
  }

  return [
    {
      Size: "S",
      Chest: "88-94 cm",
      Shoulder: "42 cm",
      Length: "66 cm",
    },
    {
      Size: "M",
      Chest: "95-100 cm",
      Shoulder: "44 cm",
      Length: "68 cm",
    },
    {
      Size: "L",
      Chest: "101-106 cm",
      Shoulder: "46 cm",
      Length: "70 cm",
    },
    {
      Size: "XL",
      Chest: "107-114 cm",
      Shoulder: "48 cm",
      Length: "72 cm",
    },
  ];
});

const guideNote = computed(() => {
  if (guideType.value === "shoes") {
    return "For shoes, measure your foot from heel to toe and choose the closest foot length. If you are between two sizes, choose the larger size for better comfort.";
  }

  if (guideType.value === "pants") {
    return "For pants, use your waist measurement as the main reference. Choose a larger size if you prefer a relaxed fit.";
  }

  return "For clothing, use chest measurement as the main reference. Choose one size larger if you prefer an oversized luxury silhouette.";
});
</script>
