<template>
  <img :src="currentSrc" :alt="alt" @error="handleImageError" v-bind="$attrs" />
</template>

<script setup>
import { ref, watch } from "vue";

const fallbackSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200">
    <rect width="900" height="1200" fill="#f8f5f2"/>
    <circle cx="450" cy="480" r="110" fill="#111111" opacity="0.08"/>
    <rect x="250" y="650" width="400" height="36" rx="18" fill="#111111" opacity="0.12"/>
    <rect x="310" y="710" width="280" height="26" rx="13" fill="#111111" opacity="0.08"/>
    <text x="450" y="820" text-anchor="middle" font-family="Arial" font-size="34" fill="#111111" opacity="0.35">
      LUXEZA ROYALE
    </text>
    <text x="450" y="870" text-anchor="middle" font-family="Arial" font-size="20" fill="#111111" opacity="0.25">
      Gambar belum tersedia
    </text>
  </svg>
`;

const fallbackImage = `data:image/svg+xml;utf8,${encodeURIComponent(fallbackSvg)}`;

const props = defineProps({
  src: {
    type: String,
    default: "",
  },
  alt: {
    type: String,
    default: "Gambar produk",
  },
});

const currentSrc = ref(props.src || fallbackImage);
const hasError = ref(false);

watch(
  () => props.src,
  (newSrc) => {
    hasError.value = false;
    currentSrc.value = newSrc || fallbackImage;
  },
);

const handleImageError = () => {
  if (hasError.value) return;

  hasError.value = true;
  currentSrc.value = fallbackImage;
};
</script>
