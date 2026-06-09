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
              Admin Produk
            </p>

            <h1 class="text-4xl md:text-5xl font-bold text-luxe-espresso mb-4">
              Manajemen Produk
            </h1>

            <p class="text-luxe-brown/75 max-w-2xl leading-7">
              Kelola produk Luxeza Royale, mulai dari stok, harga, kategori,
              gambar, ukuran, hingga atribut produk.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-3">
            <button
              @click="openCategoryModal"
              type="button"
              class="border border-luxe-espresso text-luxe-espresso px-7 py-4 rounded-full hover:bg-luxe-espresso hover:text-luxe-ivory transition"
            >
              Kelola Kategori
            </button>

            <button
              @click="openAddModal"
              type="button"
              class="bg-luxe-espresso text-luxe-ivory px-7 py-4 rounded-full hover:bg-luxe-royal transition shadow-lg shadow-luxe-brown/20"
            >
              + Tambah Produk
            </button>
          </div>
        </div>

        <!-- FILTERS -->
        <div
          class="bg-luxe-ivory border border-luxe-sand/70 rounded-[2rem] p-5 md:p-6 mb-8 shadow-[0_18px_60px_rgba(92,56,36,0.10)]"
        >
          <div class="grid md:grid-cols-[1fr_220px_220px_auto] gap-4">
            <input
              v-model="filters.search"
              type="text"
              placeholder="Cari nama produk, slug, atau deskripsi"
              class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
              @keyup.enter="loadProducts"
            />

            <LuxeSelect
              v-model="filters.categoryId"
              :options="categoryFilterOptions"
              placeholder="Semua Kategori"
            />

            <LuxeSelect
              v-model="filters.status"
              :options="productStatusFilterOptions"
              placeholder="Semua Status"
            />

            <button
              @click="loadProducts"
              type="button"
              class="bg-luxe-espresso text-luxe-ivory px-6 py-4 rounded-2xl hover:bg-luxe-royal transition"
            >
              Terapkan
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

            <p class="text-luxe-brown/75">Memuat data produk admin...</p>
          </div>
        </div>

        <!-- ERROR -->
        <div
          v-else-if="errorMessage"
          class="min-h-[360px] bg-luxe-ivory border border-red-100 rounded-[2rem] flex items-center justify-center text-center px-6"
        >
          <div>
            <h2 class="text-3xl font-bold text-luxe-espresso mb-4">
              Produk belum dapat dimuat
            </h2>

            <p class="text-red-500 mb-6">{{ errorMessage }}</p>

            <button
              @click="loadProducts"
              class="bg-luxe-espresso text-luxe-ivory px-8 py-4 rounded-full hover:bg-luxe-royal transition"
            >
              Coba Lagi
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
              Produk tidak ditemukan
            </h2>

            <p class="text-luxe-brown/75">
              Coba ubah filter atau tambahkan produk baru.
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
                    {{
                      product.isActive ? "Produk Aktif" : "Produk Tidak Aktif"
                    }}
                  </span>

                  <span
                    :class="
                      product.categoryIsActive
                        ? 'bg-luxe-cream border-luxe-sand/70 text-luxe-brown'
                        : 'bg-red-50 border-red-100 text-red-600'
                    "
                    class="border px-4 py-2 rounded-full text-xs font-semibold"
                  >
                    {{ product.categoryName }}
                    <template v-if="!product.categoryIsActive">
                      · Kategori Tidak Aktif
                    </template>
                  </span>

                  <span
                    :class="
                      product.isVisibleToCustomer
                        ? 'bg-green-50 text-green-700 border-green-100'
                        : 'bg-orange-50 text-orange-700 border-orange-100'
                    "
                    class="border px-4 py-2 rounded-full text-xs font-semibold"
                  >
                    {{
                      product.isVisibleToCustomer
                        ? "Tampil di Toko"
                        : `Tersembunyi di Toko: ${product.customerHiddenReason}`
                    }}
                  </span>
                </div>

                <h2
                  class="text-2xl md:text-3xl font-bold text-luxe-espresso mb-2 break-words"
                >
                  {{ product.name }}
                </h2>

                <div class="mb-4">
                  <p class="text-sm text-luxe-brown/60">/{{ product.slug }}</p>

                  <p
                    v-if="!product.isVisibleToCustomer"
                    class="text-sm text-orange-700 mt-2"
                  >
                    Produk ini tidak tampil di halaman customer karena:
                    {{ product.customerHiddenReason }}.
                  </p>
                </div>

                <div
                  class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-luxe-brown/80"
                >
                  <div>
                    <p class="text-luxe-brown/55 mb-1">Harga</p>
                    <p class="font-bold text-luxe-espresso">
                      {{ formatCurrency(product.price) }}
                    </p>
                  </div>

                  <div>
                    <p class="text-luxe-brown/55 mb-1">Stok</p>
                    <p class="font-bold text-luxe-espresso">
                      {{ product.stock }}
                    </p>
                  </div>

                  <div>
                    <p class="text-luxe-brown/55 mb-1">Ukuran</p>
                    <p class="font-bold text-luxe-espresso">
                      {{ product.sizes.length }}
                    </p>
                  </div>

                  <div>
                    <p class="text-luxe-brown/55 mb-1">Gambar</p>
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
                  Ubah
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
                      ? "Memperbarui..."
                      : product.isActive
                        ? "Nonaktifkan"
                        : "Aktifkan"
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
        class="w-full max-w-5xl h-[calc(100dvh-1rem)] md:h-auto md:max-h-[90vh] bg-luxe-ivory border border-luxe-sand/70 rounded-[2rem] shadow-[0_30px_90px_rgba(43,26,18,0.28)] overflow-hidden flex flex-col"
      >
        <!-- MODAL HEADER -->
        <div
          class="shrink-0 p-6 md:p-8 border-b border-luxe-sand/60 flex items-start justify-between gap-6"
        >
          <div>
            <p class="uppercase tracking-[4px] text-sm text-luxe-brown mb-3">
              {{ isEditMode ? "Ubah Produk" : "Tambah Produk" }}
            </p>

            <h2 class="text-3xl md:text-4xl font-bold text-luxe-espresso">
              {{ isEditMode ? "Perbarui Produk" : "Buat Produk Baru" }}
            </h2>

            <p class="text-luxe-brown/75 mt-3 leading-7">
              Kelola informasi produk, stok, gambar, ukuran, dan atribut produk.
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
          class="flex-1 min-h-0 overflow-y-auto overscroll-y-contain touch-pan-y [-webkit-overflow-scrolling:touch] p-6 md:p-8 space-y-8"
          @submit.prevent="saveProduct"
          @wheel.stop
          @touchmove.stop
        >
          <!-- BASIC INFO -->
          <div class="grid md:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm text-luxe-brown/75 mb-2">
                Nama Produk
              </label>

              <input
                v-model="productForm.name"
                type="text"
                placeholder="Contoh: Kaos Navy Luxeza"
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
                placeholder="Otomatis dibuat jika dikosongkan"
                class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
              />
            </div>

            <div>
              <label class="block text-sm text-luxe-brown/75 mb-2">
                Kategori
              </label>

              <LuxeSelect
                v-model="productForm.category_id"
                :options="productCategoryOptions"
                placeholder="Tanpa Kategori"
              />
            </div>

            <div>
              <label class="block text-sm text-luxe-brown/75 mb-2">
                Status Produk
              </label>

              <LuxeSelect
                v-model="productForm.is_active"
                :options="activeStatusOptions"
                placeholder="Pilih Status"
              />
            </div>

            <div>
              <label class="block text-sm text-luxe-brown/75 mb-2">
                Harga
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
                Berat Produk Default (gram)
              </label>

              <input
                v-model.number="productForm.weight_gram"
                type="number"
                min="1"
                placeholder="1000"
                class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
              />

              <p class="text-xs text-luxe-brown/60 mt-2">
                Berat ini digunakan untuk menghitung ongkir.
              </p>
            </div>
          </div>

          <div>
            <label class="block text-sm text-luxe-brown/75 mb-2">
              Deskripsi
            </label>

            <textarea
              v-model="productForm.description"
              rows="4"
              placeholder="Deskripsi produk"
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
                  Gambar Produk
                </h3>

                <p class="text-sm text-luxe-brown/70 mt-1">
                  Tempel URL gambar atau unggah gambar produk dari perangkat.
                </p>
              </div>

              <button
                @click="addImageRow"
                type="button"
                class="bg-luxe-espresso text-luxe-ivory px-5 py-3 rounded-full hover:bg-luxe-royal transition"
              >
                + Gambar
              </button>
            </div>

            <div class="space-y-4">
              <div
                v-for="(image, index) in productForm.images"
                :key="index"
                class="bg-luxe-ivory border border-luxe-sand/60 rounded-3xl p-4 grid md:grid-cols-[120px_1fr_auto_auto] gap-4 md:items-center"
              >
                <!-- PREVIEW -->
                <div class="w-full md:w-[120px]">
                  <ProductImage
                    v-if="image.image_url"
                    :src="image.image_url"
                    alt="Pratinjau gambar produk"
                    class="w-full h-32 md:h-[100px] object-cover rounded-2xl bg-luxe-cream border border-luxe-sand/60"
                  />

                  <div
                    v-else
                    class="w-full h-32 md:h-[100px] rounded-2xl bg-luxe-cream border border-dashed border-luxe-sand flex items-center justify-center text-luxe-brown/50 text-sm text-center px-3"
                  >
                    Belum Ada Gambar
                  </div>
                </div>

                <!-- URL + UPLOAD -->
                <div class="space-y-3">
                  <input
                    v-model="image.image_url"
                    type="text"
                    placeholder="https://images.unsplash.com/... atau URL gambar upload"
                    class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                  />

                  <input
                    :id="`product-image-upload-${index}`"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    class="hidden"
                    @change="handleImageUpload($event, index)"
                  />

                  <label
                    :for="`product-image-upload-${index}`"
                    :class="
                      imageUploadStates[index]
                        ? 'opacity-60 pointer-events-none'
                        : 'hover:bg-luxe-cream cursor-pointer'
                    "
                    class="inline-flex items-center justify-center px-5 py-3 rounded-2xl border border-luxe-sand bg-luxe-ivory text-luxe-espresso transition text-sm font-medium"
                  >
                    {{
                      imageUploadStates[index]
                        ? "Mengunggah..."
                        : "Unggah dari Perangkat"
                    }}
                  </label>
                </div>

                <!-- PRIMARY -->
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
                    Utama
                  </span>
                </label>

                <!-- REMOVE -->
                <button
                  @click="removeImageRow(index)"
                  type="button"
                  class="min-h-[48px] px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition"
                >
                  Hapus
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
                <h3 class="text-2xl font-bold text-luxe-espresso">Ukuran</h3>

                <p class="text-sm text-luxe-brown/70 mt-1">
                  Tambahkan ukuran yang tersedia beserta stok per ukuran.
                </p>
              </div>

              <button
                @click="addSizeRow"
                type="button"
                class="bg-luxe-espresso text-luxe-ivory px-5 py-3 rounded-full hover:bg-luxe-royal transition"
              >
                + Ukuran
              </button>
            </div>

            <div class="space-y-4">
              <div
                class="hidden md:grid md:grid-cols-[1fr_150px_130px_130px_150px_auto] gap-4 px-4 text-xs uppercase tracking-[2px] text-luxe-brown/60"
              >
                <span>Ukuran</span>
                <span>Harga</span>
                <span>Stok</span>
                <span>Urutan</span>
                <span>Status</span>
                <span>Aksi</span>
              </div>

              <div
                v-for="(size, index) in productForm.sizes"
                :key="index"
                class="bg-luxe-ivory border border-luxe-sand/60 rounded-3xl p-4 grid md:grid-cols-[1fr_150px_130px_130px_150px_auto] gap-4 md:items-center"
              >
                <div>
                  <label
                    class="md:hidden block text-xs text-luxe-brown/60 mb-2"
                  >
                    Ukuran
                  </label>

                  <input
                    v-model="size.size"
                    type="text"
                    placeholder="S / M / L / XL"
                    class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                  />
                </div>

                <div>
                  <label
                    class="md:hidden block text-xs text-luxe-brown/60 mb-2"
                  >
                    Harga
                  </label>

                  <input
                    v-model.number="size.price"
                    type="number"
                    min="0"
                    placeholder="Harga"
                    class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                  />
                </div>

                <div>
                  <label
                    class="md:hidden block text-xs text-luxe-brown/60 mb-2"
                  >
                    Stok
                  </label>

                  <input
                    v-model.number="size.stock"
                    type="number"
                    min="0"
                    placeholder="Stok"
                    class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                  />
                </div>

                <div>
                  <label
                    class="md:hidden block text-xs text-luxe-brown/60 mb-2"
                  >
                    Urutan
                  </label>

                  <input
                    v-model.number="size.sort_order"
                    type="number"
                    min="0"
                    placeholder="Urutan"
                    class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                  />
                </div>

                <div>
                  <label
                    class="md:hidden block text-xs text-luxe-brown/60 mb-2"
                  >
                    Status
                  </label>

                  <LuxeSelect
                    v-model="size.is_active"
                    :options="activeStatusOptions"
                    placeholder="Pilih Status"
                  />
                </div>

                <button
                  @click="removeSizeRow(index)"
                  type="button"
                  class="min-h-[48px] px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition"
                >
                  Hapus
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
                <h3 class="text-2xl font-bold text-luxe-espresso">Atribut</h3>

                <p class="text-sm text-luxe-brown/70 mt-1">
                  Contoh: Material, Fit, Style.
                </p>
              </div>

              <button
                @click="addAttributeRow"
                type="button"
                class="bg-luxe-espresso text-luxe-ivory px-5 py-3 rounded-full hover:bg-luxe-royal transition"
              >
                + Atribut
              </button>
            </div>

            <div class="space-y-4">
              <div
                class="hidden md:grid md:grid-cols-[1fr_1fr_130px_150px_auto] gap-4 px-4 text-xs uppercase tracking-[2px] text-luxe-brown/60"
              >
                <span>Label</span>
                <span>Nilai</span>
                <span>Urutan</span>
                <span>Status</span>
                <span>Aksi</span>
              </div>

              <div
                v-for="(attribute, index) in productForm.attributes"
                :key="index"
                class="bg-luxe-ivory border border-luxe-sand/60 rounded-3xl p-4 grid md:grid-cols-[1fr_1fr_130px_150px_auto] gap-4 md:items-center"
              >
                <div>
                  <label
                    class="md:hidden block text-xs text-luxe-brown/60 mb-2"
                  >
                    Label
                  </label>

                  <input
                    v-model="attribute.label"
                    type="text"
                    placeholder="Material"
                    class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                  />
                </div>

                <div>
                  <label
                    class="md:hidden block text-xs text-luxe-brown/60 mb-2"
                  >
                    Nilai
                  </label>

                  <input
                    v-model="attribute.value"
                    type="text"
                    placeholder="Premium Cotton"
                    class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                  />
                </div>

                <div>
                  <label
                    class="md:hidden block text-xs text-luxe-brown/60 mb-2"
                  >
                    Urutan
                  </label>

                  <input
                    v-model.number="attribute.sort_order"
                    type="number"
                    min="0"
                    placeholder="Urutan"
                    class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                  />
                </div>

                <div>
                  <label
                    class="md:hidden block text-xs text-luxe-brown/60 mb-2"
                  >
                    Status
                  </label>

                  <LuxeSelect
                    v-model="attribute.is_active"
                    :options="activeStatusOptions"
                    placeholder="Pilih Status"
                  />
                </div>

                <button
                  @click="removeAttributeRow(index)"
                  type="button"
                  class="min-h-[48px] px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition"
                >
                  Hapus
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
            Batal
          </button>

          <button
            @click="saveProduct"
            type="button"
            :disabled="isSavingProduct"
            class="px-7 py-4 rounded-full bg-luxe-espresso text-luxe-ivory hover:bg-luxe-royal disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-luxe-brown/20"
          >
            {{
              isSavingProduct
                ? "Menyimpan..."
                : isEditMode
                  ? "Perbarui Produk"
                  : "Buat Produk"
            }}
          </button>
        </div>
      </div>
    </div>

    <!-- CATEGORY MANAGEMENT MODAL -->
    <div
      v-if="isCategoryModalOpen"
      class="fixed inset-0 z-[999] bg-luxe-espresso/60 backdrop-blur-sm px-4 md:px-6 flex items-center justify-center"
      @click.self="closeCategoryModal"
    >
      <div
        class="w-full max-w-4xl h-[calc(100dvh-1rem)] md:h-auto md:max-h-[90vh] bg-luxe-ivory border border-luxe-sand/70 rounded-[2rem] shadow-[0_30px_90px_rgba(43,26,18,0.28)] overflow-hidden flex flex-col"
      >
        <div
          class="shrink-0 p-6 md:p-8 border-b border-luxe-sand/60 flex items-start justify-between gap-6"
        >
          <div>
            <p class="uppercase tracking-[4px] text-sm text-luxe-brown mb-3">
              Admin Kategori
            </p>

            <h2 class="text-3xl md:text-4xl font-bold text-luxe-espresso">
              Manajemen Kategori
            </h2>

            <p class="text-luxe-brown/75 mt-3 leading-7">
              Tambah, ubah, aktifkan, nonaktifkan, atau hapus kategori produk.
            </p>
          </div>

          <button
            @click="closeCategoryModal"
            type="button"
            class="text-3xl leading-none text-luxe-espresso hover:text-luxe-royal transition"
          >
            ×
          </button>
        </div>

        <div
          class="flex-1 min-h-0 overflow-y-auto overscroll-y-contain touch-pan-y [-webkit-overflow-scrolling:touch] p-6 md:p-8 space-y-6"
          @wheel.stop
          @touchmove.stop
        >
          <div
            class="bg-luxe-cream border border-luxe-sand/60 rounded-[2rem] p-5 md:p-6"
          >
            <h3 class="text-2xl font-bold text-luxe-espresso mb-5">
              {{ isEditCategoryMode ? "Ubah Kategori" : "Tambah Kategori" }}
            </h3>

            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-luxe-brown/75 mb-2">
                  Nama Kategori
                </label>

                <input
                  v-model="categoryForm.name"
                  type="text"
                  placeholder="Contoh: Kaos"
                  class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                />
              </div>

              <div>
                <label class="block text-sm text-luxe-brown/75 mb-2">
                  Slug
                </label>

                <input
                  v-model="categoryForm.slug"
                  type="text"
                  placeholder="Otomatis dibuat jika dikosongkan"
                  class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition"
                />
              </div>

              <div>
                <label class="block text-sm text-luxe-brown/75 mb-2">
                  Status
                </label>

                <LuxeSelect
                  v-model="categoryForm.is_active"
                  :options="activeStatusOptions"
                  placeholder="Pilih Status"
                />
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 mt-5">
              <button
                @click="saveCategory"
                type="button"
                :disabled="isSavingCategory"
                class="bg-luxe-espresso text-luxe-ivory px-7 py-4 rounded-full hover:bg-luxe-royal disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {{
                  isSavingCategory
                    ? "Menyimpan..."
                    : isEditCategoryMode
                      ? "Perbarui Kategori"
                      : "Buat Kategori"
                }}
              </button>

              <button
                v-if="isEditCategoryMode"
                @click="resetCategoryForm"
                type="button"
                :disabled="isSavingCategory"
                class="border border-luxe-sand text-luxe-espresso px-7 py-4 rounded-full hover:bg-luxe-ivory disabled:opacity-50 transition"
              >
                Batal Ubah
              </button>
            </div>
          </div>

          <div
            class="bg-luxe-ivory border border-luxe-sand/70 rounded-[2rem] overflow-hidden"
          >
            <div
              class="p-5 md:p-6 border-b border-luxe-sand/60 flex items-center justify-between gap-4"
            >
              <div>
                <h3 class="text-2xl font-bold text-luxe-espresso">
                  Daftar Kategori
                </h3>

                <p class="text-sm text-luxe-brown/70 mt-1">
                  Total: {{ categories.length }} kategori
                </p>
              </div>
            </div>

            <div v-if="categories.length === 0" class="p-6 text-center">
              <p class="text-luxe-brown/70">Kategori tidak ditemukan.</p>
            </div>

            <div v-else class="divide-y divide-luxe-sand/60">
              <div
                v-for="category in categories"
                :key="category.id"
                class="p-5 md:p-6 grid lg:grid-cols-[1fr_auto] gap-5 lg:items-center"
              >
                <div>
                  <div class="flex flex-wrap items-center gap-3 mb-3">
                    <span
                      :class="
                        category.isActive
                          ? 'bg-green-50 text-green-700 border-green-100'
                          : 'bg-red-50 text-red-700 border-red-100'
                      "
                      class="border px-4 py-2 rounded-full text-xs font-semibold"
                    >
                      {{ category.isActive ? "Aktif" : "Tidak Aktif" }}
                    </span>

                    <span
                      class="bg-luxe-cream border border-luxe-sand/70 text-luxe-brown px-4 py-2 rounded-full text-xs font-semibold"
                    >
                      {{ category.productsCount }} produk
                    </span>
                  </div>

                  <h4 class="text-xl font-bold text-luxe-espresso">
                    {{ category.name }}
                  </h4>

                  <p class="text-sm text-luxe-brown/60 mt-1">
                    /{{ category.slug }}
                  </p>
                </div>

                <div class="flex flex-col sm:flex-row lg:justify-end gap-3">
                  <button
                    @click="openEditCategory(category)"
                    type="button"
                    class="border border-luxe-espresso text-luxe-espresso px-5 py-3 rounded-full hover:bg-luxe-espresso hover:text-luxe-ivory transition"
                  >
                    Ubah
                  </button>

                  <button
                    @click="toggleCategoryStatus(category)"
                    type="button"
                    :disabled="updatingCategoryId === category.id"
                    :class="
                      category.isActive
                        ? 'border-red-100 text-red-600 hover:bg-red-50'
                        : 'border-green-100 text-green-700 hover:bg-green-50'
                    "
                    class="border px-5 py-3 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{
                      updatingCategoryId === category.id
                        ? "Memperbarui..."
                        : category.isActive
                          ? "Nonaktifkan"
                          : "Aktifkan"
                    }}
                  </button>

                  <button
                    @click="deleteCategory(category)"
                    type="button"
                    :disabled="
                      deletingCategoryId === category.id ||
                      Number(category.productsCount) > 0
                    "
                    class="border border-red-100 text-red-600 px-5 py-3 rounded-full hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{
                      deletingCategoryId === category.id
                        ? "Menghapus..."
                        : "Hapus"
                    }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <p class="text-sm text-luxe-brown/65 leading-6">
            Catatan: Kategori yang masih digunakan oleh produk tidak dapat
            dihapus. Nonaktifkan kategori jika hanya ingin menyembunyikannya
            dari penggunaan aktif.
          </p>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";

import Navbar from "../components/layout/Navbar.vue";
import CartSidebar from "../components/layout/CartSidebar.vue";
import Footer from "../components/layout/Footer.vue";
import ProductImage from "../components/ui/ProductImage.vue";
import LuxeSelect from "../components/ui/LuxeSelect.vue";

import { adminProductService } from "../services/adminProductService";
import { useToastStore } from "../stores/toastStore";
import { formatCurrency } from "../utils/formatCurrency";

const toastStore = useToastStore();

const products = ref([]);
const categories = ref([]);
const isLoading = ref(false);
const errorMessage = ref("");
const updatingProductId = ref(null);
const imageUploadStates = ref({});

const filters = reactive({
  search: "",
  categoryId: "",
  status: "",
});

const categoryFilterOptions = computed(() => {
  return [
    {
      label: "Semua Kategori",
      value: "",
    },
    ...categories.value.map((category) => ({
      label: category.name,
      value: category.id,
    })),
  ];
});

const productCategoryOptions = computed(() => {
  return [
    {
      label: "Tanpa Kategori",
      value: "",
    },
    ...categories.value.map((category) => ({
      label: category.name,
      value: category.id,
    })),
  ];
});

const productStatusFilterOptions = [
  {
    label: "Semua Status",
    value: "",
  },
  {
    label: "Aktif",
    value: "active",
  },
  {
    label: "Tidak Aktif",
    value: "inactive",
  },
];

const activeStatusOptions = [
  {
    label: "Aktif",
    value: true,
  },
  {
    label: "Tidak Aktif",
    value: false,
  },
];

const isProductModalOpen = ref(false);
const isSavingProduct = ref(false);
const editingProductId = ref(null);

const isEditMode = computed(() => Boolean(editingProductId.value));

const isCategoryModalOpen = ref(false);
const isSavingCategory = ref(false);
const editingCategoryId = ref(null);
const updatingCategoryId = ref(null);
const deletingCategoryId = ref(null);

const isEditCategoryMode = computed(() => Boolean(editingCategoryId.value));

const isAnyModalOpen = computed(() => {
  return isProductModalOpen.value || isCategoryModalOpen.value;
});

let lockedScrollY = 0;

const lockBodyScroll = () => {
  lockedScrollY = window.scrollY || document.documentElement.scrollTop || 0;

  document.body.style.position = "fixed";
  document.body.style.top = `-${lockedScrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
  document.body.style.overflow = "hidden";
};

const unlockBodyScroll = () => {
  const scrollY =
    Math.abs(parseInt(document.body.style.top || "0", 10)) || lockedScrollY;

  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  document.body.style.overflow = "";

  window.scrollTo(0, scrollY);
};

watch(isAnyModalOpen, (isOpen) => {
  if (isOpen) {
    lockBodyScroll();
  } else {
    unlockBodyScroll();
  }
});

onUnmounted(() => {
  unlockBodyScroll();
});

const createEmptyCategoryForm = () => ({
  name: "",
  slug: "",
  is_active: true,
});

const categoryForm = reactive(createEmptyCategoryForm());

const resetCategoryForm = () => {
  editingCategoryId.value = null;
  Object.assign(categoryForm, createEmptyCategoryForm());
};

const createEmptyProductForm = () => ({
  category_id: "",
  name: "",
  slug: "",
  description: "",
  price: 0,
  stock: 0,
  weight_gram: 1000,
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
      price: 0,
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
  productForm.weight_gram = product.weightGram || product.weight_gram || 1000;
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
          price: Number(size.price ?? product.price ?? 0),
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
      title: "Gagal Memuat Kategori",
      message: error?.message || "Kategori belum dapat dimuat.",
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
    errorMessage.value = error?.message || "Produk belum dapat dimuat.";
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
      title: "Produk Berhasil Diperbarui",
      message: `${updatedProduct.name} sekarang ${
        updatedProduct.isActive ? "aktif" : "tidak aktif"
      }.`,
      type: "success",
    });
  } catch (error) {
    toastStore.showToast({
      title: "Gagal Memperbarui Produk",
      message: error?.message || "Status produk belum dapat diperbarui.",
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

const openCategoryModal = () => {
  resetCategoryForm();
  isCategoryModalOpen.value = true;
};

const closeCategoryModal = () => {
  if (isSavingCategory.value) return;

  isCategoryModalOpen.value = false;
  resetCategoryForm();
};

const openEditCategory = (category) => {
  editingCategoryId.value = category.id;
  categoryForm.name = category.name || "";
  categoryForm.slug = category.slug || "";
  categoryForm.is_active = category.isActive;
};

const buildCategoryPayload = () => {
  return {
    name: categoryForm.name.trim(),
    slug: categoryForm.slug.trim() || null,
    is_active: Boolean(categoryForm.is_active),
  };
};

const validateCategoryForm = () => {
  if (!categoryForm.name.trim()) {
    toastStore.showToast({
      title: "Nama Kategori Wajib Diisi",
      message: "Silakan masukkan nama kategori.",
      type: "error",
    });

    return false;
  }

  return true;
};

const saveCategory = async () => {
  if (isSavingCategory.value) return;

  if (!validateCategoryForm()) return;

  isSavingCategory.value = true;

  try {
    const payload = buildCategoryPayload();

    const savedCategory = isEditCategoryMode.value
      ? await adminProductService.updateCategory(
          editingCategoryId.value,
          payload,
        )
      : await adminProductService.createCategory(payload);

    if (isEditCategoryMode.value) {
      categories.value = categories.value.map((category) =>
        category.id === savedCategory.id ? savedCategory : category,
      );
    } else {
      categories.value = [...categories.value, savedCategory].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
    }

    toastStore.showToast({
      title: isEditCategoryMode.value
        ? "Kategori Berhasil Diperbarui"
        : "Kategori Berhasil Dibuat",
      message: `${savedCategory.name} berhasil disimpan.`,
      type: "success",
    });

    resetCategoryForm();
    await loadCategories();
    await loadProducts();
  } catch (error) {
    const firstError = error?.errors
      ? Object.values(error.errors).flat()[0]
      : null;

    toastStore.showToast({
      title: "Gagal Menyimpan Kategori",
      message: firstError || error?.message || "Kategori belum dapat disimpan.",
      type: "error",
    });
  } finally {
    isSavingCategory.value = false;
  }
};

const toggleCategoryStatus = async (category) => {
  updatingCategoryId.value = category.id;

  try {
    const updatedCategory = await adminProductService.updateCategoryStatus(
      category.id,
      !category.isActive,
    );

    categories.value = categories.value.map((item) =>
      item.id === category.id ? updatedCategory : item,
    );

    toastStore.showToast({
      title: "Kategori Berhasil Diperbarui",
      message: `${updatedCategory.name} sekarang ${
        updatedCategory.isActive ? "aktif" : "tidak aktif"
      }.`,
      type: "success",
    });

    await loadCategories();
  } catch (error) {
    toastStore.showToast({
      title: "Gagal Memperbarui Kategori",
      message: error?.message || "Status kategori belum dapat diperbarui.",
      type: "error",
    });
  } finally {
    updatingCategoryId.value = null;
  }
};

const deleteCategory = async (category) => {
  if (Number(category.productsCount) > 0) {
    toastStore.showToast({
      title: "Kategori Tidak Dapat Dihapus",
      message: "Kategori ini masih digunakan oleh produk.",
      type: "error",
    });

    return;
  }

  const confirmed = window.confirm(
    `Hapus kategori "${category.name}"? Tindakan ini tidak dapat dibatalkan.`,
  );

  if (!confirmed) return;

  deletingCategoryId.value = category.id;

  try {
    await adminProductService.deleteCategory(category.id);

    categories.value = categories.value.filter(
      (item) => item.id !== category.id,
    );

    toastStore.showToast({
      title: "Kategori Berhasil Dihapus",
      message: `${category.name} berhasil dihapus.`,
      type: "success",
    });

    if (filters.categoryId === category.id) {
      filters.categoryId = "";
    }

    resetCategoryForm();
    await loadCategories();
    await loadProducts();
  } catch (error) {
    toastStore.showToast({
      title: "Gagal Menghapus Kategori",
      message: error?.message || "Kategori belum dapat dihapus.",
      type: "error",
    });
  } finally {
    deletingCategoryId.value = null;
  }
};

const setImageUploading = (index, isUploading) => {
  imageUploadStates.value = {
    ...imageUploadStates.value,
    [index]: isUploading,
  };
};

const handleImageUpload = async (event, index) => {
  const file = event.target.files?.[0];

  if (!file) return;

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    toastStore.showToast({
      title: "Gambar Tidak Valid",
      message: "Silakan unggah gambar jpg, jpeg, png, atau webp.",
      type: "error",
    });

    event.target.value = "";
    return;
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    toastStore.showToast({
      title: "Gambar Terlalu Besar",
      message: "Ukuran gambar maksimal 5 MB.",
      type: "error",
    });

    event.target.value = "";
    return;
  }

  setImageUploading(index, true);

  try {
    const uploadedImage = await adminProductService.uploadProductImage(file);

    productForm.images[index].image_url =
      uploadedImage.image_url || uploadedImage.imageUrl || "";

    if (!productForm.images.some((image) => image.is_primary)) {
      productForm.images[index].is_primary = true;
    }

    toastStore.showToast({
      title: "Gambar Berhasil Diunggah",
      message: "Gambar produk berhasil diunggah.",
      type: "success",
    });
  } catch (error) {
    toastStore.showToast({
      title: "Unggah Gambar Gagal",
      message: error?.message || "Gambar belum dapat diunggah.",
      type: "error",
    });
  } finally {
    setImageUploading(index, false);
    event.target.value = "";
  }
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
    price: Number(productForm.price || 0),
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
      price: Number(size.price ?? productForm.price ?? 0),
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
    weight_gram: Number(productForm.weight_gram || 1000),
    is_active: Boolean(productForm.is_active),
    images,
    sizes,
    attributes,
  };
};

const validateProductForm = () => {
  if (!productForm.name.trim()) {
    toastStore.showToast({
      title: "Nama Produk Wajib Diisi",
      message: "Silakan masukkan nama produk.",
      type: "error",
    });

    return false;
  }

  if (Number(productForm.price) < 0) {
    toastStore.showToast({
      title: "Harga Tidak Valid",
      message: "Harga produk tidak boleh bernilai negatif.",
      type: "error",
    });

    return false;
  }

  const invalidSizePrice = productForm.sizes.find(
    (size) => size.size.trim() !== "" && Number(size.price) < 0,
  );

  if (invalidSizePrice) {
    toastStore.showToast({
      title: "Harga Ukuran Tidak Valid",
      message: "Harga pada ukuran tidak boleh bernilai negatif.",
      type: "error",
    });

    return false;
  }

  if (Number(productForm.stock) < 0) {
    toastStore.showToast({
      title: "Stok Tidak Valid",
      message: "Stok produk tidak boleh bernilai negatif.",
      type: "error",
    });

    return false;
  }

  if (Number(productForm.weight_gram) <= 0) {
    toastStore.showToast({
      title: "Berat Produk Tidak Valid",
      message: "Berat produk harus lebih dari 0 gram.",
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
      title: isEditMode.value
        ? "Produk Berhasil Diperbarui"
        : "Produk Berhasil Dibuat",
      message: `${savedProduct.name} berhasil disimpan.`,
      type: "success",
    });

    closeProductModal();
  } catch (error) {
    const firstError = error?.errors
      ? Object.values(error.errors).flat()[0]
      : null;

    toastStore.showToast({
      title: "Gagal Menyimpan Produk",
      message: firstError || error?.message || "Produk belum dapat disimpan.",
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
