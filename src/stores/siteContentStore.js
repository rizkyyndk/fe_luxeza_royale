import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { siteContentService } from "../services/siteContentService";

export const useSiteContentStore = defineStore("siteContent", () => {
  const contents = ref([]);
  const isLoading = ref(false);
  const errorMessage = ref("");
  const hasLoaded = ref(false);

  const contentMap = computed(() => {
    return contents.value.reduce((map, item) => {
      map[item.contentKey] = item.value;
      return map;
    }, {});
  });

  const groupedContents = computed(() => {
    return contents.value.reduce((groups, item) => {
      if (!groups[item.section]) {
        groups[item.section] = [];
      }

      groups[item.section].push(item);

      return groups;
    }, {});
  });

  const getContent = (key, fallback = "") => {
    const value = contentMap.value[key];

    if (value === undefined || value === null || value === "") {
      return fallback;
    }

    return value;
  };

  const loadPublicContents = async (force = false) => {
    if (hasLoaded.value && !force) return;

    isLoading.value = true;
    errorMessage.value = "";

    try {
      contents.value = await siteContentService.getPublicContents();
      hasLoaded.value = true;
    } catch (error) {
      console.error("Gagal memuat konten website:", error);

      errorMessage.value =
        error?.message || "Konten website belum dapat dimuat.";
    } finally {
      isLoading.value = false;
    }
  };

  const loadAdminContents = async () => {
    isLoading.value = true;
    errorMessage.value = "";

    try {
      contents.value = await siteContentService.getAdminContents();
      hasLoaded.value = true;
    } catch (error) {
      console.error("Gagal memuat konten website admin:", error);

      errorMessage.value =
        error?.message || "Konten website admin belum dapat dimuat.";

      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const updateContent = async (id, payload) => {
    const updatedContent = await siteContentService.updateContent(id, payload);

    if (updatedContent) {
      contents.value = contents.value.map((item) =>
        item.id === updatedContent.id ? updatedContent : item,
      );
    }

    return updatedContent;
  };

  const seedDefaults = async () => {
    const seededContents = await siteContentService.seedDefaults();

    contents.value = seededContents;
    hasLoaded.value = true;

    return seededContents;
  };

  const uploadImage = async (file) => {
    return siteContentService.uploadImage(file);
  };

  return {
    contents,
    groupedContents,
    isLoading,
    errorMessage,
    hasLoaded,

    getContent,
    loadPublicContents,
    loadAdminContents,
    updateContent,
    uploadImage,
    seedDefaults,
  };
});
