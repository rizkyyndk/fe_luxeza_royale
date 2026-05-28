import { httpClient } from "./httpClient";

const unwrapData = (response, fallback = null) => {
  const payload = response?.data ?? response ?? fallback;

  if (payload?.data !== undefined) {
    return payload.data;
  }

  return payload ?? fallback;
};

const normalizeContent = (content) => {
  if (!content) return null;

  return {
    id: content.id,
    contentKey: content.content_key || content.contentKey,
    section: content.section || "general",
    label: content.label || "",
    value: content.value || "",
    inputType: content.input_type || content.inputType || "text",
    isPublic: Boolean(content.is_public ?? content.isPublic),
    sortOrder: Number(content.sort_order || content.sortOrder || 0),
    raw: content,
  };
};

const normalizeContents = (contents) => {
  if (!Array.isArray(contents)) return [];

  return contents.map(normalizeContent).filter(Boolean);
};

export const siteContentService = {
  async getPublicContents() {
    const response = await httpClient.get("/site-contents");
    const data = unwrapData(response, []);

    return normalizeContents(data);
  },

  async getAdminContents() {
    const response = await httpClient.get("/admin/site-contents");
    const data = unwrapData(response, []);

    return normalizeContents(data);
  },

  async updateContent(id, payload) {
    const response = await httpClient.put(
      `/admin/site-contents/${id}`,
      payload,
    );
    const data = unwrapData(response, null);

    return normalizeContent(data);
  },

  async uploadImage(file) {
    const formData = new FormData();

    formData.append("image", file);

    const baseURL =
      import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

    const token =
      sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

    const response = await fetch(
      `${baseURL}/admin/site-contents/images/upload`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    const result = await response.json();

    if (!response.ok || result?.success === false) {
      throw new Error(
        result?.message ||
          result?.errors?.image?.[0] ||
          "Failed to upload image.",
      );
    }

    return result.data;
  },

  async seedDefaults() {
    const response = await httpClient.post(
      "/admin/site-contents/seed-defaults",
    );
    const data = unwrapData(response, []);

    return normalizeContents(data);
  },
};
