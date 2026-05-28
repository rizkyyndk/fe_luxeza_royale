<template>
  <div ref="selectRef" class="relative">
    <button
      type="button"
      :disabled="disabled"
      @click="isOpen = !isOpen"
      class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso rounded-full px-5 py-4 outline-none focus:border-luxe-royal transition shadow-sm flex items-center justify-between gap-4 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <span
        :class="selectedOption ? 'text-luxe-espresso' : 'text-luxe-brown/50'"
        class="truncate"
      >
        {{ selectedOption?.label || placeholder }}
      </span>

      <span
        :class="isOpen ? 'rotate-180' : ''"
        class="text-luxe-brown transition"
      >
        ▾
      </span>
    </button>

    <div
      v-if="isOpen"
      class="absolute z-[80] mt-3 w-full bg-luxe-ivory border border-luxe-sand/70 rounded-3xl shadow-[0_18px_60px_rgba(92,56,36,0.18)] p-2 max-h-72 overflow-y-auto"
    >
      <button
        v-for="option in options"
        :key="String(option.value)"
        type="button"
        @click="selectOption(option)"
        :class="
          isSelected(option)
            ? 'bg-luxe-espresso text-luxe-ivory'
            : 'text-luxe-espresso hover:bg-luxe-cream'
        "
        class="w-full text-left px-4 py-3 rounded-2xl transition flex items-center justify-between gap-3"
      >
        <span class="truncate">
          {{ option.label }}
        </span>

        <span v-if="isSelected(option)" class="text-sm"> ✓ </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, null],
    default: "",
  },
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: "Select option",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

const selectRef = ref(null);
const isOpen = ref(false);

const selectedOption = computed(() => {
  return (
    props.options.find((option) => option.value === props.modelValue) || null
  );
});

const isSelected = (option) => {
  return option.value === props.modelValue;
};

const selectOption = (option) => {
  emit("update:modelValue", option.value);
  emit("change", option.value);
  isOpen.value = false;
};

const handleClickOutside = (event) => {
  if (!selectRef.value) return;

  if (!selectRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
