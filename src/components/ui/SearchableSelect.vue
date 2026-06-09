<template>
  <div class="relative">
    <label
      v-if="label"
      class="block text-sm font-medium text-luxe-brown/75 mb-2"
    >
      {{ label }}
    </label>

    <button
      type="button"
      :disabled="disabled"
      @click="toggleDropdown"
      class="w-full border border-luxe-sand rounded-2xl px-5 py-4 bg-luxe-ivory text-luxe-espresso text-left outline-none focus:border-luxe-royal transition disabled:bg-luxe-sand/40 disabled:text-luxe-brown/50 disabled:cursor-not-allowed flex items-center justify-between gap-4"
    >
      <span
        :class="selectedLabel ? 'text-luxe-espresso' : 'text-luxe-brown/50'"
      >
        {{ selectedLabel || placeholder }}
      </span>

      <span class="text-luxe-brown/60 transition">
        {{ isOpen ? "⌃" : "⌄" }}
      </span>
    </button>

    <Transition name="dropdown">
      <div
        v-if="isOpen"
        class="absolute z-50 mt-3 w-full bg-luxe-ivory border border-luxe-sand/70 rounded-3xl shadow-[0_20px_70px_rgba(92,56,36,0.18)] overflow-hidden"
      >
        <div class="p-3 border-b border-luxe-sand/60 bg-luxe-cream">
          <input
            ref="searchInput"
            v-model="search"
            type="text"
            :placeholder="searchPlaceholder"
            class="w-full border border-luxe-sand rounded-2xl px-4 py-3 bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/45 outline-none focus:border-luxe-royal transition"
            @keydown.esc="closeDropdown"
          />
        </div>

        <div class="max-h-64 overflow-y-auto overscroll-contain py-2">
          <button
            v-for="option in filteredOptions"
            :key="option.id"
            type="button"
            @click="selectOption(option)"
            :class="
              String(modelValue) === String(option.id)
                ? 'bg-luxe-espresso text-luxe-ivory'
                : 'text-luxe-espresso hover:bg-luxe-cream'
            "
            class="w-full text-left px-5 py-3 transition"
          >
            {{ option.name }}
          </button>

          <div
            v-if="filteredOptions.length === 0"
            class="px-5 py-5 text-sm text-luxe-brown/60 text-center"
          >
            Data tidak ditemukan.
          </div>
        </div>
      </div>
    </Transition>

    <p v-if="error" class="text-red-500 text-sm mt-2">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  options: {
    type: Array,
    default: () => [],
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "Pilih opsi",
  },
  searchPlaceholder: {
    type: String,
    default: "Cari...",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

const isOpen = ref(false);
const search = ref("");
const searchInput = ref(null);

const selectedOption = computed(() => {
  return props.options.find(
    (option) => String(option.id) === String(props.modelValue),
  );
});

const selectedLabel = computed(() => {
  if (props.loading) return "Memuat...";
  return selectedOption.value?.name || "";
});

const filteredOptions = computed(() => {
  const keyword = search.value.trim().toLowerCase();

  return props.options
    .filter((option) => {
      if (!keyword) return true;

      return String(option.name || "")
        .toLowerCase()
        .includes(keyword);
    })
    .sort((a, b) => String(a.name).localeCompare(String(b.name), "id"));
});

const toggleDropdown = async () => {
  if (props.disabled || props.loading) return;

  isOpen.value = !isOpen.value;

  if (isOpen.value) {
    await nextTick();
    searchInput.value?.focus();
  }
};

const closeDropdown = () => {
  isOpen.value = false;
  search.value = "";
};

const selectOption = (option) => {
  emit("update:modelValue", String(option.id));
  emit("change", option);
  closeDropdown();
};

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) closeDropdown();
  },
);
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
</style>
