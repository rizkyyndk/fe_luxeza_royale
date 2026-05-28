<template>
  <div>
    <Navbar />
    <CartSidebar />

    <section class="pt-36 pb-24 px-6">
      <div class="max-w-7xl mx-auto">
        <!-- HEADER -->
        <div
          class="mb-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
        >
          <div>
            <p class="uppercase tracking-[4px] text-sm text-luxe-brown mb-4">
              Admin Products
            </p>

            <h1 class="text-4xl md:text-5xl font-bold text-luxe-espresso mb-4">
              Product Management
            </h1>

            <p class="text-luxe-brown/75 max-w-2xl leading-7">
              Manage Luxeza Royale products, stock, prices, categories, images,
              sizes, and product attributes.
            </p>
          </div>

          <button
            @click="openAddModal"
            type="button"
            class="bg-luxe-espresso text-luxe-ivory px-7 py-4 rounded-full hover:bg-luxe-royal transition shadow-lg shadow-luxe-brown/20"
          >
            + Add Product
          </button>
        </div>

        <!-- FILTERS -->
        <div
          class="bg-luxe-ivory border border-luxe-sand/70 rounded-[2rem] p-5 md:p-6 mb-8 shadow-[0_18px_60px_rgba(92,56,36,0.10)]"
        >
          <div class="grid md:grid-cols-[1fr_220px_220px_auto] gap-4">
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search product name, slug, or description"
              class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
              @keyup.enter="loadProducts"
            />

            <select
              v-model="filters.categoryId"
              class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
            >
              <option value="">All Categories</option>

              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>

            <select
              v-model="filters.status"
              class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <button
              @click="loadProducts"
              type="button"
              class="bg-luxe-espresso text-luxe-ivory px-6 py-4 rounded-2xl hover:bg-luxe-royal transition"
            >
              Apply
            </button>
          </div>
        </div>

        <!-- LOADING -->
        <div
          v-if="isLoading"
          class="min-h-[360px] bg-luxe-ivory border border-luxe-sand/70 rounded-[2rem] flex items-center justify-center text-center"
        >
          <div>
            <div
              class="w-12 h-12 mx-auto mb-5 border-4 border-luxe-sand border-t-luxe-espresso rounded-full animate-spin"
            ></div>

            <p class="text-luxe-brown/75">Loading admin products...</p>
          </div>
        </div>

        <!-- ERROR -->
        <div
          v-else-if="errorMessage"
          class="min-h-[360px] bg-luxe-ivory border border-red-100 rounded-[2rem] flex items-center justify-center text-center px-6"
        >
          <div>
            <h2 class="text-3xl font-bold text-luxe-espresso mb-4">
              Failed to load products
            </h2>

            <p class="text-red-500 mb-6">{{ errorMessage }}</p>

            <button
              @click="loadProducts"
              class="bg-luxe-espresso text-luxe-ivory px-8 py-4 rounded-full hover:bg-luxe-royal transition"
            >
              Try Again
            </button>
          </div>
        </div>

        <!-- EMPTY -->
        <div
          v-else-if="products.length === 0"
          class="min-h-[360px] bg-luxe-ivory border border-luxe-sand/70 rounded-[2rem] flex items-center justify-center text-center px-6"
        >
          <div>
            <p class="text-5xl mb-5">📦</p>

            <h2 class="text-3xl font-bold text-luxe-espresso mb-4">
              No products found
            </h2>

            <p class="text-luxe-brown/75">
              Try changing your filter or add a new product.
            </p>
          </div>
        </div>

        <!-- PRODUCTS -->
        <div v-else class="grid gap-5">
          <div
            v-for="product in products"
            :key="product.id"
            class="bg-luxe-ivory border border-luxe-sand/70 rounded-[2rem] p-5 md:p-6 shadow-[0_18px_60px_rgba(92,56,36,0.10)]"
          >
            <div
              class="grid lg:grid-cols-[120px_1fr_auto] gap-6 lg:items-center"
            >
              <ProductImage
                :src="product.image"
                :alt="product.name"
                class="w-full lg:w-[120px] h-[160px] lg:h-[120px] object-cover rounded-3xl bg-luxe-cream"
              />

              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-3 mb-3">
                  <span
                    :class="
                      product.isActive
                        ? 'bg-green-50 text-green-700 border-green-100'
                        : 'bg-red-50 text-red-700 border-red-100'
                    "
                    class="border px-4 py-2 rounded-full text-xs font-semibold"
                  >
                    {{ product.isActive ? "Active" : "Inactive" }}
                  </span>

                  <span
                    class="bg-luxe-cream border border-luxe-sand/70 text-luxe-brown px-4 py-2 rounded-full text-xs font-semibold"
                  >
                    {{ product.categoryName }}
                  </span>
                </div>

                <h2
                  class="text-2xl md:text-3xl font-bold text-luxe-espresso mb-2 break-words"
                >
                  {{ product.name }}
                </h2>

                <p class="text-sm text-luxe-brown/60 mb-4">
                  /{{ product.slug }}
                </p>

                <div
                  class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-luxe-brown/80"
                >
                  <div>
                    <p class="text-luxe-brown/55 mb-1">Price</p>
                    <p class="font-bold text-luxe-espresso">
                      {{ formatCurrency(product.price) }}
                    </p>
                  </div>

                  <div>
                    <p class="text-luxe-brown/55 mb-1">Stock</p>
                    <p class="font-bold text-luxe-espresso">
                      {{ product.stock }}
                    </p>
                  </div>

                  <div>
                    <p class="text-luxe-brown/55 mb-1">Sizes</p>
                    <p class="font-bold text-luxe-espresso">
                      {{ product.sizes.length }}
                    </p>
                  </div>

                  <div>
                    <p class="text-luxe-brown/55 mb-1">Images</p>
                    <p class="font-bold text-luxe-espresso">
                      {{ product.images.length }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex flex-col sm:flex-row lg:flex-col gap-3">
                <button
                  @click="openEditModal(product)"
                  type="button"
                  class="border border-luxe-espresso text-luxe-espresso px-6 py-3 rounded-full hover:bg-luxe-espresso hover:text-luxe-ivory transition"
                >
                  Edit
                </button>

                <button
                  @click="toggleProductStatus(product)"
                  type="button"
                  :disabled="updatingProductId === product.id"
                  :class="
                    product.isActive
                      ? 'border-red-100 text-red-600 hover:bg-red-50'
                      : 'border-green-100 text-green-700 hover:bg-green-50'
                  "
                  class="border px-6 py-3 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{
                    updatingProductId === product.id
                      ? "Updating..."
                      : product.isActive
                        ? "Deactivate"
                        : "Activate"
                  }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PRODUCT FORM MODAL -->
    <div
      v-if="isProductModalOpen"
      class="fixed inset-0 z-[999] bg-luxe-espresso/60 backdrop-blur-sm px-4 md:px-6 flex items-center justify-center"
      @click.self="closeProductModal"
    >
      <div
        class="w-full max-w-5xl max-h-[90vh] bg-luxe-ivory border border-luxe-sand/70 rounded-[2rem] shadow-[0_30px_90px_rgba(43,26,18,0.28)] overflow-hidden flex flex-col"
      >
        <!-- MODAL HEADER -->
        <div
          class="shrink-0 p-6 md:p-8 border-b border-luxe-sand/60 flex items-start justify-between gap-6"
        >
          <div>
            <p class="uppercase tracking-[4px] text-sm text-luxe-brown mb-3">
              {{ isEditMode ? "Edit Product" : "Add Product" }}
            </p>

            <h2 class="text-3xl md:text-4xl font-bold text-luxe-espresso">
              {{ isEditMode ? "Update Product" : "Create New Product" }}
            </h2>

            <p class="text-luxe-brown/75 mt-3 leading-7">
              Manage product information, stock, images, sizes, and attributes.
            </p>
          </div>

          <button
            @click="closeProductModal"
            type="button"
            class="text-3xl leading-none text-luxe-espresso hover:text-luxe-royal transition"
          >
            ×
          </button>
        </div>

        <!-- MODAL CONTENT -->
        <form
          class="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y p-6 md:p-8 space-y-8"
          @submit.prevent="saveProduct"
        >
          <!-- BASIC INFO -->
          <div class="grid md:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm text-luxe-brown/75 mb-2">
                Product Name
              </label>

              <input
                v-model="productForm.name"
                type="text"
                placeholder="Example: Kaos Navy Luxeza"
                class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
              />
            </div>

            <div>
              <label class="block text-sm text-luxe-brown/75 mb-2">
                Slug
              </label>

              <input
                v-model="productForm.slug"
                type="text"
                placeholder="Auto generated if empty"
                class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
              />
            </div>

            <div>
              <label class="block text-sm text-luxe-brown/75 mb-2">
                Category
              </label>

              <select
                v-model="productForm.category_id"
                class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
              >
                <option value="">No Category</option>

                <option
                  v-for="category in categories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm text-luxe-brown/75 mb-2">
                Product Status
              </label>

              <select
                v-model="productForm.is_active"
                class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
              >
                <option :value="true">Active</option>
                <option :value="false">Inactive</option>
              </select>
            </div>

            <div>
              <label class="block text-sm text-luxe-brown/75 mb-2">
                Price
              </label>

              <input
                v-model.number="productForm.price"
                type="number"
                min="0"
                placeholder="150000"
                class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
              />
            </div>

            <div>
              <label class="block text-sm text-luxe-brown/75 mb-2">
                Stock
              </label>

              <input
                v-model.number="productForm.stock"
                type="number"
                min="0"
                placeholder="10"
                class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm text-luxe-brown/75 mb-2">
              Description
            </label>

            <textarea
              v-model="productForm.description"
              rows="4"
              placeholder="Product description"
              class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition resize-none"
            ></textarea>
          </div>

          <!-- IMAGES -->
          <div
            class="bg-luxe-cream border border-luxe-sand/60 rounded-[2rem] p-5 md:p-6"
          >
            <div class="flex items-center justify-between gap-4 mb-5">
              <div>
                <h3 class="text-2xl font-bold text-luxe-espresso">
                  Product Images
                </h3>

                <p class="text-sm text-luxe-brown/70 mt-1">
                  Use image URL for now. File upload can be added later.
                </p>
              </div>

              <button
                @click="addImageRow"
                type="button"
                class="bg-luxe-espresso text-luxe-ivory px-5 py-3 rounded-full hover:bg-luxe-royal transition"
              >
                + Image
              </button>
            </div>

            <div class="space-y-4">
              <div
                v-for="(image, index) in productForm.images"
                :key="index"
                class="bg-luxe-ivory border border-luxe-sand/60 rounded-3xl p-4 grid md:grid-cols-[1fr_auto_auto] gap-4 md:items-center"
              >
                <input
                  v-model="image.image_url"
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                />

                <label
                  class="min-h-[48px] px-4 py-3 rounded-2xl bg-luxe-cream border border-luxe-sand/60 flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="primaryImage"
                    :checked="image.is_primary"
                    @change="setPrimaryImage(index)"
                    class="w-5 h-5 accent-luxe-espresso"
                  />

                  <span class="text-sm font-medium text-luxe-espresso">
                    Primary
                  </span>
                </label>

                <button
                  @click="removeImageRow(index)"
                  type="button"
                  class="min-h-[48px] px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          <!-- SIZES -->
          <div
            class="bg-luxe-cream border border-luxe-sand/60 rounded-[2rem] p-5 md:p-6"
          >
            <div class="flex items-center justify-between gap-4 mb-5">
              <div>
                <h3 class="text-2xl font-bold text-luxe-espresso">Sizes</h3>

                <p class="text-sm text-luxe-brown/70 mt-1">
                  Add available sizes and size-level stock.
                </p>
              </div>

              <button
                @click="addSizeRow"
                type="button"
                class="bg-luxe-espresso text-luxe-ivory px-5 py-3 rounded-full hover:bg-luxe-royal transition"
              >
                + Size
              </button>
            </div>

            <div class="space-y-4">
              <div
                v-for="(size, index) in productForm.sizes"
                :key="index"
                class="bg-luxe-ivory border border-luxe-sand/60 rounded-3xl p-4 grid md:grid-cols-[1fr_130px_130px_150px_auto] gap-4 md:items-center"
              >
                <input
                  v-model="size.size"
                  type="text"
                  placeholder="S / M / L / XL"
                  class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                />

                <input
                  v-model.number="size.stock"
                  type="number"
                  min="0"
                  placeholder="Stock"
                  class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                />

                <input
                  v-model.number="size.sort_order"
                  type="number"
                  min="0"
                  placeholder="Order"
                  class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                />

                <select
                  v-model="size.is_active"
                  class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                >
                  <option :value="true">Active</option>
                  <option :value="false">Inactive</option>
                </select>

                <button
                  @click="removeSizeRow(index)"
                  type="button"
                  class="min-h-[48px] px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          <!-- ATTRIBUTES -->
          <div
            class="bg-luxe-cream border border-luxe-sand/60 rounded-[2rem] p-5 md:p-6"
          >
            <div class="flex items-center justify-between gap-4 mb-5">
              <div>
                <h3 class="text-2xl font-bold text-luxe-espresso">
                  Attributes
                </h3>

                <p class="text-sm text-luxe-brown/70 mt-1">
                  Example: Material, Fit, Style.
                </p>
              </div>

              <button
                @click="addAttributeRow"
                type="button"
                class="bg-luxe-espresso text-luxe-ivory px-5 py-3 rounded-full hover:bg-luxe-royal transition"
              >
                + Attribute
              </button>
            </div>

            <div class="space-y-4">
              <div
                v-for="(attribute, index) in productForm.attributes"
                :key="index"
                class="bg-luxe-ivory border border-luxe-sand/60 rounded-3xl p-4 grid md:grid-cols-[1fr_1fr_130px_150px_auto] gap-4 md:items-center"
              >
                <input
                  v-model="attribute.label"
                  type="text"
                  placeholder="Material"
                  class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                />

                <input
                  v-model="attribute.value"
                  type="text"
                  placeholder="Premium Cotton"
                  class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                />

                <input
                  v-model.number="attribute.sort_order"
                  type="number"
                  min="0"
                  placeholder="Order"
                  class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                />

                <select
                  v-model="attribute.is_active"
                  class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                >
                  <option :value="true">Active</option>
                  <option :value="false">Inactive</option>
                </select>

                <button
                  @click="removeAttributeRow(index)"
                  type="button"
                  class="min-h-[48px] px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </form>
        <!-- MODAL FOOTER -->
        <div
          class="shrink-0 p-6 border-t border-luxe-sand/60 bg-luxe-ivory flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3"
        >
          <button
            @click="closeProductModal"
            type="button"
            class="px-7 py-4 rounded-full border border-luxe-sand text-luxe-espresso hover:bg-luxe-cream transition"
          >
            Cancel
          </button>

          <button
            @click="saveProduct"
            type="button"
            :disabled="isSavingProduct"
            class="px-7 py-4 rounded-full bg-luxe-espresso text-luxe-ivory hover:bg-luxe-royal disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-luxe-brown/20"
          >
            {{
              isSavingProduct
                ? "Saving..."
                : isEditMode
                  ? "Update Product"
                  : "Create Product"
            }}
          </button>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";

import Navbar from "../components/layout/Navbar.vue";
import CartSidebar from "../components/layout/CartSidebar.vue";
import Footer from "../components/layout/Footer.vue";
import ProductImage from "../components/ui/ProductImage.vue";

import { adminProductService } from "../services/adminProductService";
import { useToastStore } from "../stores/toastStore";
import { formatCurrency } from "../utils/formatCurrency";

const toastStore = useToastStore();

const products = ref([]);
const categories = ref([]);
const isLoading = ref(false);
const errorMessage = ref("");
const updatingProductId = ref(null);

const filters = reactive({
  search: "",
  categoryId: "",
  status: "",
});

const isProductModalOpen = ref(false);
const isSavingProduct = ref(false);
const editingProductId = ref(null);

const isEditMode = computed(() => Boolean(editingProductId.value));

const createEmptyProductForm = () => ({
  category_id: "",
  name: "",
  slug: "",
  description: "",
  price: 0,
  stock: 0,
  is_active: true,
  images: [
    {
      image_url: "",
      is_primary: true,
    },
  ],
  sizes: [
    {
      size: "M",
      stock: 0,
      sort_order: 1,
      is_active: true,
    },
  ],
  attributes: [
    {
      label: "Material",
      value: "",
      sort_order: 1,
      is_active: true,
    },
    {
      label: "Fit",
      value: "",
      sort_order: 2,
      is_active: true,
    },
    {
      label: "Style",
      value: "",
      sort_order: 3,
      is_active: true,
    },
  ],
});

const productForm = reactive(createEmptyProductForm());

const resetProductForm = () => {
  Object.assign(productForm, createEmptyProductForm());
};

const fillProductForm = (product) => {
  productForm.category_id = product.categoryId || "";
  productForm.name = product.name || "";
  productForm.slug = product.slug || "";
  productForm.description = product.description || "";
  productForm.price = product.price || 0;
  productForm.stock = product.stock || 0;
  productForm.is_active = product.isActive;

  productForm.images =
    product.images.length > 0
      ? product.images.map((image) => ({
          image_url: image.rawImageUrl || image.imageUrl || "",
          is_primary: image.isPrimary,
        }))
      : [
          {
            image_url: "",
            is_primary: true,
          },
        ];

  productForm.sizes =
    product.sizes.length > 0
      ? product.sizes.map((size) => ({
          size: size.size,
          stock: size.stock,
          sort_order: size.sortOrder,
          is_active: size.isActive,
        }))
      : [];

  productForm.attributes =
    product.attributes.length > 0
      ? product.attributes.map((attribute) => ({
          label: attribute.label,
          value: attribute.value,
          sort_order: attribute.sortOrder,
          is_active: attribute.isActive,
        }))
      : [];
};

const loadCategories = async () => {
  try {
    categories.value = await adminProductService.getCategories();
  } catch (error) {
    toastStore.showToast({
      title: "Failed to Load Categories",
      message: error?.message || "Unable to load categories.",
      type: "error",
    });
  }
};

const loadProducts = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const params = {};

    if (filters.search.trim()) {
      params.search = filters.search.trim();
    }

    if (filters.categoryId) {
      params.category_id = filters.categoryId;
    }

    if (filters.status) {
      params.status = filters.status;
    }

    products.value = await adminProductService.getProducts(params);
  } catch (error) {
    errorMessage.value = error?.message || "Unable to load products.";
  } finally {
    isLoading.value = false;
  }
};

const toggleProductStatus = async (product) => {
  updatingProductId.value = product.id;

  try {
    const updatedProduct = await adminProductService.updateProductStatus(
      product.id,
      !product.isActive,
    );

    products.value = products.value.map((item) =>
      item.id === product.id ? updatedProduct : item,
    );

    toastStore.showToast({
      title: "Product Updated",
      message: `${updatedProduct.name} is now ${
        updatedProduct.isActive ? "active" : "inactive"
      }.`,
      type: "success",
    });
  } catch (error) {
    toastStore.showToast({
      title: "Failed to Update Product",
      message: error?.message || "Unable to update product status.",
      type: "error",
    });
  } finally {
    updatingProductId.value = null;
  }
};

const openAddModal = () => {
  editingProductId.value = null;
  resetProductForm();
  isProductModalOpen.value = true;
};

const openEditModal = (product) => {
  editingProductId.value = product.id;
  resetProductForm();
  fillProductForm(product);
  isProductModalOpen.value = true;
};

const closeProductModal = () => {
  if (isSavingProduct.value) return;

  isProductModalOpen.value = false;
  editingProductId.value = null;
  resetProductForm();
};

const addImageRow = () => {
  productForm.images.push({
    image_url: "",
    is_primary: productForm.images.length === 0,
  });
};

const removeImageRow = (index) => {
  productForm.images.splice(index, 1);

  if (
    productForm.images.length > 0 &&
    !productForm.images.some((image) => image.is_primary)
  ) {
    productForm.images[0].is_primary = true;
  }
};

const setPrimaryImage = (selectedIndex) => {
  productForm.images = productForm.images.map((image, index) => ({
    ...image,
    is_primary: index === selectedIndex,
  }));
};

const addSizeRow = () => {
  productForm.sizes.push({
    size: "",
    stock: 0,
    sort_order: productForm.sizes.length + 1,
    is_active: true,
  });
};

const removeSizeRow = (index) => {
  productForm.sizes.splice(index, 1);
};

const addAttributeRow = () => {
  productForm.attributes.push({
    label: "",
    value: "",
    sort_order: productForm.attributes.length + 1,
    is_active: true,
  });
};

const removeAttributeRow = (index) => {
  productForm.attributes.splice(index, 1);
};

const buildProductPayload = () => {
  const images = productForm.images
    .filter((image) => image.image_url.trim() !== "")
    .map((image) => ({
      image_url: image.image_url.trim(),
      is_primary: Boolean(image.is_primary),
    }));

  const sizes = productForm.sizes
    .filter((size) => size.size.trim() !== "")
    .map((size, index) => ({
      size: size.size.trim(),
      stock: Number(size.stock || 0),
      sort_order: Number(size.sort_order || index + 1),
      is_active: Boolean(size.is_active),
    }));

  const attributes = productForm.attributes
    .filter(
      (attribute) =>
        attribute.label.trim() !== "" && attribute.value.trim() !== "",
    )
    .map((attribute, index) => ({
      label: attribute.label.trim(),
      value: attribute.value.trim(),
      sort_order: Number(attribute.sort_order || index + 1),
      is_active: Boolean(attribute.is_active),
    }));

  return {
    category_id: productForm.category_id || null,
    name: productForm.name.trim(),
    slug: productForm.slug.trim() || null,
    description: productForm.description.trim(),
    price: Number(productForm.price || 0),
    stock: Number(productForm.stock || 0),
    is_active: Boolean(productForm.is_active),
    images,
    sizes,
    attributes,
  };
};

const validateProductForm = () => {
  if (!productForm.name.trim()) {
    toastStore.showToast({
      title: "Product Name Required",
      message: "Please enter product name.",
      type: "error",
    });

    return false;
  }

  if (Number(productForm.price) < 0) {
    toastStore.showToast({
      title: "Invalid Price",
      message: "Product price cannot be negative.",
      type: "error",
    });

    return false;
  }

  if (Number(productForm.stock) < 0) {
    toastStore.showToast({
      title: "Invalid Stock",
      message: "Product stock cannot be negative.",
      type: "error",
    });

    return false;
  }

  return true;
};

const saveProduct = async () => {
  if (isSavingProduct.value) return;

  if (!validateProductForm()) return;

  isSavingProduct.value = true;

  try {
    const payload = buildProductPayload();

    const savedProduct = isEditMode.value
      ? await adminProductService.updateProduct(editingProductId.value, payload)
      : await adminProductService.createProduct(payload);

    if (isEditMode.value) {
      products.value = products.value.map((product) =>
        product.id === savedProduct.id ? savedProduct : product,
      );
    } else {
      products.value = [savedProduct, ...products.value];
    }

    toastStore.showToast({
      title: isEditMode.value ? "Product Updated" : "Product Created",
      message: `${savedProduct.name} has been saved successfully.`,
      type: "success",
    });

    closeProductModal();
  } catch (error) {
    const firstError = error?.errors
      ? Object.values(error.errors).flat()[0]
      : null;

    toastStore.showToast({
      title: "Failed to Save Product",
      message: firstError || error?.message || "Unable to save product.",
      type: "error",
    });
  } finally {
    isSavingProduct.value = false;
  }
};

onMounted(async () => {
  await loadCategories();
  await loadProducts();
});
</script>
