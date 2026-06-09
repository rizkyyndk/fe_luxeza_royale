<template>
  <div>
    <Navbar />
    <CartSidebar />

    <section class="pt-36 pb-24 px-6">
      <div class="max-w-7xl mx-auto">
        <!-- HEADER -->
        <div
          class="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <p class="uppercase tracking-[4px] text-sm text-luxe-brown mb-4">
              Riwayat Pesanan
            </p>

            <h1 class="text-4xl md:text-5xl font-bold mb-4 text-luxe-espresso">
              Pesanan Anda
            </h1>

            <p class="text-luxe-brown/75 max-w-xl leading-7">
              Lihat dan pantau pesanan Luxeza Royale Anda, mulai dari
              pembayaran, pengiriman, hingga status pesanan selesai.
            </p>
          </div>

          <button
            v-if="orders.length > 0"
            @click="loadOrders"
            class="border border-luxe-espresso text-luxe-espresso px-6 py-3 rounded-full hover:bg-luxe-espresso hover:text-luxe-ivory transition w-fit"
          >
            Muat Ulang Pesanan
          </button>
        </div>

        <!-- FILTER BAR -->
        <div
          v-if="orders.length > 0"
          class="mb-10 bg-luxe-ivory border border-luxe-sand/70 shadow-[0_18px_60px_rgba(92,56,36,0.10)] rounded-[2rem] p-6"
        >
          <div class="grid lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-4">
            <!-- SEARCH -->
            <div>
              <label class="block text-sm text-luxe-brown/75 mb-2">
                Cari Pesanan
              </label>

              <input
                v-model="searchKeyword"
                type="text"
                placeholder="Nomor pesanan, nama, email, alamat, atau resi..."
                class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-full px-5 py-4 outline-none focus:border-luxe-royal transition shadow-sm"
              />
            </div>

            <!-- STATUS -->
            <div>
              <label class="block text-sm text-luxe-brown/75 mb-2">
                Status
              </label>

              <LuxeSelect
                v-model="statusFilter"
                :options="statusOptions"
                placeholder="Pilih status"
              />
            </div>

            <!-- PERIOD -->
            <div>
              <label class="block text-sm text-luxe-brown/75 mb-2">
                Periode
              </label>

              <LuxeSelect
                v-model="periodFilter"
                :options="periodOptions"
                placeholder="Pilih periode"
              />
            </div>

            <!-- SORT -->
            <div>
              <label class="block text-sm text-luxe-brown/75 mb-2">
                Urutkan
              </label>

              <LuxeSelect
                v-model="sortOrder"
                :options="sortOptions"
                placeholder="Pilih urutan"
              />
            </div>
          </div>

          <!-- CUSTOM DATE -->
          <div
            v-if="periodFilter === 'custom'"
            class="grid sm:grid-cols-2 gap-4 mt-5"
          >
            <div>
              <label class="block text-sm text-luxe-brown/75 mb-2">
                Tanggal Mulai
              </label>

              <input
                v-model="customStartDate"
                type="date"
                class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso rounded-full px-5 py-4 outline-none focus:border-luxe-royal transition shadow-sm"
              />
            </div>

            <div>
              <label class="block text-sm text-luxe-brown/75 mb-2">
                Tanggal Akhir
              </label>

              <input
                v-model="customEndDate"
                type="date"
                class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso rounded-full px-5 py-4 outline-none focus:border-luxe-royal transition shadow-sm"
              />
            </div>
          </div>

          <!-- FILTER SUMMARY -->
          <div
            class="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-luxe-sand/60 pt-5"
          >
            <p class="text-sm text-luxe-brown/75">
              Menampilkan
              <span class="font-semibold text-luxe-espresso">
                {{ latestOrders.length }}
              </span>
              dari
              <span class="font-semibold text-luxe-espresso">
                {{ orders.length }}
              </span>
              pesanan
            </p>

            <button
              @click="resetFilters"
              :disabled="!hasActiveFilters"
              :class="
                hasActiveFilters
                  ? 'border-luxe-espresso text-luxe-espresso hover:bg-luxe-espresso hover:text-luxe-ivory'
                  : 'border-luxe-sand/60 text-luxe-brown/40 cursor-not-allowed'
              "
              class="border px-5 py-2 rounded-full text-sm transition w-fit"
            >
              Atur Ulang Filter
            </button>
          </div>
        </div>

        <!-- LOADING -->
        <div
          v-if="isLoadingOrders"
          class="min-h-[50vh] bg-luxe-cream border border-luxe-sand/60 shadow-[0_18px_60px_rgba(92,56,36,0.10)] rounded-[2rem] flex items-center justify-center text-center px-6"
        >
          <div>
            <p class="text-6xl mb-6">⏳</p>

            <h2 class="text-3xl md:text-4xl font-bold mb-4 text-luxe-espresso">
              Memuat pesanan...
            </h2>

            <p class="text-luxe-brown/75">
              Mohon tunggu, riwayat pesanan Anda sedang dimuat.
            </p>
          </div>
        </div>

        <!-- ERROR -->
        <div
          v-else-if="orderErrorMessage"
          class="min-h-[50vh] bg-red-50 border border-red-100 rounded-[2rem] flex items-center justify-center text-center px-6"
        >
          <div>
            <p class="text-6xl mb-6">⚠️</p>

            <h2 class="text-3xl md:text-4xl font-bold mb-4 text-red-700">
              Pesanan belum dapat dimuat
            </h2>

            <p class="text-red-500 mb-8">
              {{ orderErrorMessage }}
            </p>

            <button
              @click="loadOrders"
              class="bg-luxe-espresso text-luxe-ivory px-8 py-4 rounded-full inline-block hover:bg-luxe-royal hover:scale-105 transition"
            >
              Coba Lagi
            </button>
          </div>
        </div>

        <!-- EMPTY ALL ORDERS -->
        <div
          v-else-if="orders.length === 0"
          class="min-h-[50vh] bg-luxe-cream border border-luxe-sand/60 shadow-[0_18px_60px_rgba(92,56,36,0.10)] rounded-[2rem] flex items-center justify-center text-center px-6"
        >
          <div>
            <p class="text-6xl mb-6">📦</p>

            <h2 class="text-3xl md:text-4xl font-bold mb-4 text-luxe-espresso">
              Belum ada pesanan
            </h2>

            <p class="text-luxe-brown/75 mb-8">
              Pesanan checkout Anda akan tampil di halaman ini.
            </p>

            <RouterLink
              to="/"
              class="bg-luxe-espresso text-luxe-ivory px-8 py-4 rounded-full inline-block hover:bg-luxe-royal hover:scale-105 transition shadow-lg shadow-luxe-brown/20"
            >
              Mulai Belanja
            </RouterLink>
          </div>
        </div>

        <!-- EMPTY FILTER RESULT -->
        <div
          v-else-if="latestOrders.length === 0"
          class="min-h-[45vh] bg-luxe-cream border border-luxe-sand/60 shadow-[0_18px_60px_rgba(92,56,36,0.10)] rounded-[2rem] flex items-center justify-center text-center px-6"
        >
          <div>
            <p class="text-6xl mb-6">🔎</p>

            <h2 class="text-3xl md:text-4xl font-bold mb-4 text-luxe-espresso">
              Pesanan tidak ditemukan
            </h2>

            <p class="text-luxe-brown/75 mb-8">
              Coba ubah status, periode tanggal, atau kata kunci pencarian.
            </p>

            <button
              @click="resetFilters"
              class="bg-luxe-espresso text-luxe-ivory px-8 py-4 rounded-full inline-block hover:bg-luxe-royal hover:scale-105 transition"
            >
              Atur Ulang Filter
            </button>
          </div>
        </div>

        <!-- ORDERS -->
        <div v-else class="space-y-8">
          <div
            v-for="order in latestOrders"
            :key="order.orderNumber"
            class="bg-luxe-cream border border-luxe-sand/60 shadow-[0_20px_70px_rgba(92,56,36,0.12)] rounded-[2rem] overflow-hidden"
          >
            <!-- ORDER HEADER -->
            <div
              class="p-6 md:p-8 bg-luxe-espresso text-luxe-ivory flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5"
            >
              <div>
                <p class="text-sm text-luxe-sand mb-2">Nomor Pesanan</p>

                <h2 class="text-2xl md:text-3xl font-bold">
                  {{ order.orderNumber }}
                </h2>
              </div>

              <div class="flex flex-wrap gap-3">
                <span
                  :class="getStatusClass(order.status)"
                  class="px-4 py-2 rounded-full text-sm font-semibold"
                >
                  {{ formatStatus(order.status) }}
                </span>

                <span
                  class="bg-luxe-ivory/10 border border-luxe-sand/20 px-4 py-2 rounded-full text-sm text-luxe-sand"
                >
                  {{ formatDate(order.createdAt) }}
                </span>
              </div>
            </div>

            <!-- ORDER BODY -->
            <div
              class="p-6 md:p-8 grid lg:grid-cols-[minmax(0,1fr)_420px] gap-8 items-start"
            >
              <!-- ITEMS -->
              <div>
                <div class="mb-6 flex items-center justify-between gap-4">
                  <h3 class="text-2xl font-bold text-luxe-espresso">
                    Produk Dibeli
                  </h3>

                  <p class="text-sm text-luxe-brown/70">
                    {{ getTotalItems(order.items) }} item
                  </p>
                </div>

                <div class="space-y-5">
                  <div
                    v-for="item in order.items"
                    :key="`${order.orderNumber}-${item.id}-${item.size}`"
                    class="bg-luxe-ivory border border-luxe-sand/60 rounded-3xl p-4 flex items-center gap-5 shadow-sm"
                  >
                    <ProductImage
                      :src="item.image"
                      :alt="item.title"
                      class="w-24 h-24 object-cover rounded-2xl"
                    />

                    <div class="flex-1">
                      <h4 class="font-semibold leading-snug text-luxe-espresso">
                        {{ item.title }}
                      </h4>

                      <p class="text-sm text-luxe-brown/70 mt-1">
                        Ukuran: {{ item.size || "-" }}
                      </p>

                      <p class="text-sm text-luxe-brown/70">
                        Jumlah: {{ item.quantity }}
                      </p>
                    </div>

                    <p class="font-bold text-right text-luxe-espresso">
                      {{ formatCurrency(item.price * item.quantity) }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- SUMMARY -->
              <div
                class="bg-luxe-ivory border border-luxe-sand/60 rounded-3xl p-6 h-fit shadow-[0_16px_45px_rgba(92,56,36,0.10)] lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto"
              >
                <h3 class="text-2xl font-bold mb-6 text-luxe-espresso">
                  Ringkasan Pesanan
                </h3>

                <div class="space-y-4">
                  <div class="flex justify-between gap-4">
                    <span class="text-luxe-brown/70">Pelanggan</span>
                    <span class="font-semibold text-right text-luxe-espresso">
                      {{ order.customer?.fullName }}
                    </span>
                  </div>

                  <div class="flex justify-between gap-4">
                    <span class="text-luxe-brown/70">Subtotal</span>
                    <span class="font-semibold text-luxe-espresso">
                      {{ formatCurrency(order.subtotal) }}
                    </span>
                  </div>

                  <div v-if="order.voucher" class="flex justify-between gap-4">
                    <span class="text-luxe-brown/70">Voucher</span>
                    <span class="font-semibold text-right text-luxe-espresso">
                      {{ order.voucher.code }}
                    </span>
                  </div>

                  <div
                    v-if="order.discountAmount > 0"
                    class="flex justify-between gap-4"
                  >
                    <span class="text-luxe-brown/70">Diskon</span>
                    <span class="font-semibold text-green-600">
                      -{{ formatCurrency(order.discountAmount) }}
                    </span>
                  </div>

                  <div class="flex justify-between gap-4">
                    <span class="text-luxe-brown/70">Ongkir</span>

                    <div class="text-right">
                      <p class="font-semibold text-luxe-espresso">
                        {{
                          Number(order.shippingCost || 0) === 0
                            ? "Gratis"
                            : formatCurrency(order.shippingCost)
                        }}
                      </p>

                      <p
                        v-if="getShippingCourierLabel(order)"
                        class="text-sm text-luxe-brown/70 mt-1"
                      >
                        {{ getShippingCourierLabel(order) }}
                      </p>

                      <p
                        v-if="getShippingDestinationLabel(order)"
                        class="text-xs text-luxe-brown/60 mt-1 max-w-[240px]"
                      >
                        {{ getShippingDestinationLabel(order) }}
                      </p>
                    </div>
                  </div>

                  <div class="flex justify-between gap-4">
                    <span class="text-luxe-brown/70">Pembayaran</span>
                    <span class="font-semibold text-right text-luxe-espresso">
                      {{ formatPaymentMethod(order.paymentMethod) }}
                    </span>
                  </div>

                  <div
                    class="border-t border-luxe-sand/60 pt-5 flex justify-between gap-4"
                  >
                    <span class="text-lg text-luxe-espresso">Total</span>
                    <span class="text-2xl font-bold text-luxe-espresso">
                      {{ formatCurrency(order.total) }}
                    </span>
                  </div>
                </div>

                <AddressSummaryCard
                  :customer="order.customer || {}"
                  title="Alamat Pengiriman"
                  eyebrow="Informasi Pengiriman"
                  class="mt-6"
                />

                <!-- SHIPPING COURIER DETAIL -->
                <div
                  v-if="hasShippingDetail(order)"
                  class="mt-6 bg-luxe-cream border border-luxe-sand/50 rounded-3xl p-5"
                >
                  <p class="text-sm font-semibold text-luxe-espresso mb-4">
                    Kurir Pengiriman
                  </p>

                  <div class="space-y-3">
                    <div
                      v-if="getShippingCourierLabel(order)"
                      class="flex justify-between gap-4"
                    >
                      <span class="text-luxe-brown/70">Kurir</span>

                      <span class="font-semibold text-luxe-espresso text-right">
                        {{ getShippingCourierLabel(order) }}
                      </span>
                    </div>

                    <div
                      v-if="getShippingDestinationLabel(order)"
                      class="flex justify-between gap-4"
                    >
                      <span class="text-luxe-brown/70">Tujuan</span>

                      <span
                        class="font-semibold text-luxe-espresso text-right max-w-[240px]"
                      >
                        {{ getShippingDestinationLabel(order) }}
                      </span>
                    </div>

                    <div
                      v-if="getShippingEtdLabel(order)"
                      class="flex justify-between gap-4"
                    >
                      <span class="text-luxe-brown/70">
                        Estimasi Pengiriman
                      </span>

                      <span class="font-semibold text-luxe-espresso text-right">
                        {{ getShippingEtdLabel(order) }}
                      </span>
                    </div>

                    <div class="flex justify-between gap-4">
                      <span class="text-luxe-brown/70">Biaya Ongkir</span>

                      <span class="font-semibold text-luxe-espresso text-right">
                        {{
                          Number(order.shippingCost || 0) === 0
                            ? "Gratis"
                            : formatCurrency(order.shippingCost)
                        }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- SHIPPING RECEIPT / TRACKING NUMBER -->
                <div
                  class="mt-6 bg-luxe-cream border border-luxe-sand/50 rounded-3xl p-5"
                >
                  <div
                    class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
                  >
                    <div>
                      <p class="text-sm font-semibold text-luxe-espresso mb-2">
                        Resi Pengiriman
                      </p>

                      <p
                        v-if="order.trackingNumber"
                        class="text-sm text-luxe-brown/75 leading-6"
                      >
                        Nomor resi sudah tersedia. Silakan salin nomor resi dan
                        cek pengiriman melalui website resmi ekspedisi.
                      </p>

                      <p v-else class="text-sm text-luxe-brown/75 leading-6">
                        Nomor resi belum tersedia. Admin akan menambahkan resi
                        setelah pesanan diproses.
                      </p>
                    </div>

                    <span
                      v-if="order.trackingNumber"
                      class="bg-green-50 text-green-700 px-4 py-2 rounded-full text-xs font-semibold w-fit"
                    >
                      Tersedia
                    </span>

                    <span
                      v-else
                      class="bg-luxe-ivory text-luxe-espresso px-4 py-2 rounded-full text-xs font-semibold w-fit"
                    >
                      Menunggu
                    </span>
                  </div>

                  <div
                    v-if="order.trackingNumber"
                    class="mt-5 bg-luxe-ivory border border-luxe-sand/60 rounded-2xl p-4"
                  >
                    <div class="space-y-3">
                      <div
                        v-if="getShippingCourierLabel(order)"
                        class="flex justify-between gap-4"
                      >
                        <span class="text-luxe-brown/70">Kurir</span>

                        <span
                          class="font-semibold text-luxe-espresso text-right"
                        >
                          {{ getShippingCourierLabel(order) }}
                        </span>
                      </div>

                      <div class="flex justify-between gap-4">
                        <span class="text-luxe-brown/70">Nomor Resi</span>

                        <span
                          class="font-bold text-luxe-espresso text-right break-all"
                        >
                          {{ order.trackingNumber }}
                        </span>
                      </div>

                      <div
                        v-if="order.shippedAt"
                        class="flex justify-between gap-4"
                      >
                        <span class="text-luxe-brown/70">Dikirim Pada</span>

                        <span
                          class="font-semibold text-luxe-espresso text-right"
                        >
                          {{ formatDate(order.shippedAt) }}
                        </span>
                      </div>
                    </div>

                    <div class="mt-5 grid gap-3">
                      <button
                        type="button"
                        @click="copyTrackingNumber(order)"
                        class="w-full bg-luxe-espresso text-luxe-ivory py-3 rounded-full hover:bg-luxe-royal transition"
                      >
                        Salin Nomor Resi
                      </button>

                      <a
                        v-if="getTrackingWebsiteUrl(order)"
                        :href="getTrackingWebsiteUrl(order)"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="w-full text-center border border-luxe-espresso text-luxe-espresso py-3 rounded-full hover:bg-luxe-espresso hover:text-luxe-ivory transition"
                      >
                        {{ getTrackingWebsiteLabel(order) }}
                      </a>
                    </div>

                    <p class="text-xs text-luxe-brown/60 leading-5 mt-4">
                      Gunakan nomor resi di atas untuk melakukan tracking secara
                      manual melalui website resmi JNE, J&T, atau ekspedisi yang
                      dipilih.
                    </p>

                    <div v-if="order.shippingReceiptUrl" class="mt-5">
                      <p class="text-sm font-semibold text-luxe-espresso mb-3">
                        Foto Resi
                      </p>

                      <a
                        :href="order.shippingReceiptUrl"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-block"
                      >
                        <img
                          :src="order.shippingReceiptUrl"
                          alt="Foto resi pengiriman"
                          class="w-40 h-40 object-cover rounded-2xl border border-luxe-sand/60 bg-luxe-cream"
                        />
                      </a>

                      <p
                        v-if="order.shippingReceiptUploadedAt"
                        class="text-xs text-luxe-brown/60 mt-3"
                      >
                        Diunggah pada
                        {{ formatDate(order.shippingReceiptUploadedAt) }}
                      </p>

                      <a
                        :href="order.shippingReceiptUrl"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-block mt-3 text-sm font-semibold text-luxe-espresso hover:text-luxe-royal transition"
                      >
                        Buka Foto Resi
                      </a>
                    </div>
                  </div>
                </div>

                <!-- PAYMENT PROOF -->
                <div
                  class="mt-6 bg-luxe-cream border border-luxe-sand/50 rounded-3xl p-5"
                >
                  <div
                    class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
                  >
                    <div>
                      <p class="text-sm font-semibold text-luxe-espresso mb-2">
                        Konfirmasi Pembayaran
                      </p>

                      <p
                        v-if="isPaymentVerified(order)"
                        class="text-sm text-green-700 leading-6"
                      >
                        Pembayaran telah diverifikasi.
                      </p>

                      <p
                        v-else-if="order.paymentProofUrl"
                        class="text-sm text-luxe-brown/75 leading-6"
                      >
                        Bukti pembayaran sudah dikirim dan sedang menunggu
                        konfirmasi admin.
                      </p>

                      <p v-else class="text-sm text-luxe-brown/75 leading-6">
                        Unggah struk transfer atau tangkapan layar pembayaran
                        QRIS di sini.
                      </p>
                    </div>

                    <span
                      v-if="isPaymentVerified(order)"
                      class="bg-green-50 text-green-700 px-4 py-2 rounded-full text-xs font-semibold w-fit"
                    >
                      Lunas
                    </span>

                    <span
                      v-else-if="order.paymentProofUrl"
                      class="bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-xs font-semibold w-fit"
                    >
                      Menunggu Review
                    </span>

                    <span
                      v-else
                      class="bg-red-50 text-red-700 px-4 py-2 rounded-full text-xs font-semibold w-fit"
                    >
                      Menunggu Bukti
                    </span>
                  </div>

                  <!-- EXISTING PROOF -->
                  <div
                    v-if="order.paymentProofUrl"
                    class="mt-5 bg-luxe-ivory border border-luxe-sand/60 rounded-2xl p-4"
                  >
                    <p class="text-sm font-semibold text-luxe-espresso mb-3">
                      Bukti Terunggah
                    </p>

                    <a
                      :href="order.paymentProofUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-block"
                    >
                      <img
                        :src="order.paymentProofUrl"
                        alt="Bukti pembayaran"
                        class="w-40 h-40 object-cover rounded-2xl border border-luxe-sand/60 bg-luxe-cream"
                      />
                    </a>

                    <p
                      v-if="order.paymentProofUploadedAt"
                      class="text-xs text-luxe-brown/60 mt-3"
                    >
                      Diunggah pada
                      {{ formatDate(order.paymentProofUploadedAt) }}
                    </p>
                  </div>

                  <!-- UPLOAD FORM -->
                  <div
                    v-else-if="canUploadPaymentProof(order)"
                    class="mt-5 bg-luxe-ivory border border-dashed border-luxe-sand rounded-2xl p-4"
                  >
                    <div class="flex flex-col gap-4">
                      <div
                        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                      >
                        <div>
                          <p class="font-semibold text-luxe-espresso">
                            Unggah gambar bukti pembayaran
                          </p>

                          <p class="text-sm text-luxe-brown/70 mt-1">
                            Hanya JPG, PNG, atau WEBP. Maksimal 5 MB.
                          </p>
                        </div>

                        <label
                          class="inline-flex items-center justify-center bg-luxe-espresso text-luxe-ivory px-5 py-3 rounded-full cursor-pointer hover:bg-luxe-royal transition w-fit"
                        >
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            class="hidden"
                            @change="handlePaymentProofChange($event, order)"
                          />

                          Pilih Gambar
                        </label>
                      </div>

                      <div
                        v-if="paymentProofFiles[getOrderKey(order)]"
                        class="bg-luxe-cream border border-luxe-sand/60 rounded-2xl p-4"
                      >
                        <div class="flex items-start justify-between gap-4">
                          <div>
                            <p class="font-semibold text-luxe-espresso">
                              {{ paymentProofFiles[getOrderKey(order)].name }}
                            </p>

                            <p class="text-sm text-luxe-brown/70 mt-1">
                              {{
                                (
                                  paymentProofFiles[getOrderKey(order)].size /
                                  1024 /
                                  1024
                                ).toFixed(2)
                              }}
                              MB
                            </p>
                          </div>

                          <button
                            @click="removePaymentProof(order)"
                            type="button"
                            class="text-red-600 hover:text-red-700 text-sm font-semibold"
                          >
                            Hapus
                          </button>
                        </div>

                        <img
                          v-if="paymentProofPreviews[getOrderKey(order)]"
                          :src="paymentProofPreviews[getOrderKey(order)]"
                          alt="Pratinjau bukti pembayaran"
                          class="mt-4 w-40 h-40 object-cover rounded-2xl border border-luxe-sand/60 bg-luxe-ivory"
                        />

                        <button
                          @click="uploadPaymentProof(order)"
                          :disabled="isUploadingPaymentProof(order)"
                          type="button"
                          class="mt-5 w-full bg-luxe-espresso text-luxe-ivory py-4 rounded-full hover:bg-luxe-royal disabled:opacity-60 disabled:cursor-not-allowed transition"
                        >
                          {{
                            isUploadingPaymentProof(order)
                              ? "Mengunggah Bukti..."
                              : "Kirim Bukti Pembayaran"
                          }}
                        </button>
                      </div>

                      <p
                        v-if="paymentProofErrors[getOrderKey(order)]"
                        class="text-red-500 text-sm"
                      >
                        {{ paymentProofErrors[getOrderKey(order)] }}
                      </p>
                    </div>
                  </div>
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
import ProductImage from "../components/ui/ProductImage.vue";
import AddressSummaryCard from "../components/order/AddressSummaryCard.vue";

import { useToastStore } from "../stores/toastStore";
import { formatCurrency } from "../utils/formatCurrency";
import { orderService } from "../services/orderService";
import LuxeSelect from "../components/ui/LuxeSelect.vue";

const toastStore = useToastStore();

const orders = ref([]);
const isLoadingOrders = ref(false);
const orderErrorMessage = ref("");

const searchKeyword = ref("");
const statusFilter = ref("all");
const periodFilter = ref("all");
const sortOrder = ref("newest");
const customStartDate = ref("");
const customEndDate = ref("");
const paymentProofFiles = ref({});
const paymentProofPreviews = ref({});
const paymentProofErrors = ref({});
const uploadingPaymentProofOrderNumbers = ref([]);

const periodOptions = [
  {
    label: "Semua Waktu",
    value: "all",
  },
  {
    label: "Hari Ini",
    value: "today",
  },
  {
    label: "7 Hari Terakhir",
    value: "last-7-days",
  },
  {
    label: "30 Hari Terakhir",
    value: "last-30-days",
  },
  {
    label: "Tanggal Khusus",
    value: "custom",
  },
];

const sortOptions = [
  {
    label: "Terbaru Dulu",
    value: "newest",
  },
  {
    label: "Terlama Dulu",
    value: "oldest",
  },
];

const statusOptions = [
  {
    label: "Semua Status",
    value: "all",
  },
  {
    label: "Menunggu Pembayaran",
    value: "pending",
  },
  {
    label: "Bukti Pembayaran Dikirim",
    value: "payment_submitted",
  },
  {
    label: "Sedang Diproses",
    value: "processing",
  },
  {
    label: "Dikirim",
    value: "shipped",
  },
  {
    label: "Pembayaran Diterima",
    value: "paid",
  },
  {
    label: "Selesai",
    value: "completed",
  },
  {
    label: "Dibatalkan",
    value: "cancelled",
  },
];

const hasActiveFilters = computed(() => {
  return (
    searchKeyword.value.trim() !== "" ||
    statusFilter.value !== "all" ||
    periodFilter.value !== "all" ||
    sortOrder.value !== "newest" ||
    customStartDate.value !== "" ||
    customEndDate.value !== ""
  );
});

const latestOrders = computed(() => {
  const keyword = searchKeyword.value.toLowerCase().trim();

  let result = orders.value.filter((order) => {
    const orderNumber = String(order.orderNumber || "").toLowerCase();
    const customerName = String(order.customer?.fullName || "").toLowerCase();
    const customerEmail = String(order.customer?.email || "").toLowerCase();
    const customerPhone = String(order.customer?.phone || "").toLowerCase();

    const customerAddress = [
      order.customer?.address,
      order.customer?.addressDetail,
      order.customer?.village,
      order.customer?.district,
      order.customer?.city,
      order.customer?.province,
      order.customer?.postalCode,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const shippingInfo = [
      getShippingCourierLabel(order),
      getShippingDestinationLabel(order),
      getShippingEtdLabel(order),
      order.trackingNumber,
      order.shippingReceiptUrl,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesKeyword =
      !keyword ||
      orderNumber.includes(keyword) ||
      customerName.includes(keyword) ||
      customerEmail.includes(keyword) ||
      customerPhone.includes(keyword) ||
      customerAddress.includes(keyword) ||
      shippingInfo.includes(keyword);

    const orderStatus = String(order.status || "").toLowerCase();

    const matchesStatus =
      statusFilter.value === "all" || orderStatus === statusFilter.value;

    const matchesPeriod = isOrderWithinPeriod(order.createdAt);

    return matchesKeyword && matchesStatus && matchesPeriod;
  });

  result = [...result].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();

    return sortOrder.value === "oldest" ? dateA - dateB : dateB - dateA;
  });

  return result;
});

const getOrderKey = (order) => {
  return order.orderNumber || order.order_code || order.id;
};

const canUploadPaymentProof = (order) => {
  const status = String(order.status || "pending").toLowerCase();

  return (
    order &&
    getOrderKey(order) &&
    !order.hasPaymentProof &&
    !order.paymentProofUrl &&
    status === "pending"
  );
};

const isPaymentVerified = (order) => {
  const status = String(order.status || "").toLowerCase();

  return ["paid", "processing", "shipped", "completed"].includes(status);
};

const isUploadingPaymentProof = (order) => {
  return uploadingPaymentProofOrderNumbers.value.includes(getOrderKey(order));
};

const handlePaymentProofChange = (event, order) => {
  const file = event.target.files?.[0];
  const orderKey = getOrderKey(order);

  event.target.value = "";

  paymentProofFiles.value = {
    ...paymentProofFiles.value,
    [orderKey]: null,
  };

  paymentProofPreviews.value = {
    ...paymentProofPreviews.value,
    [orderKey]: "",
  };

  paymentProofErrors.value = {
    ...paymentProofErrors.value,
    [orderKey]: "",
  };

  if (!file) return;

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    paymentProofErrors.value = {
      ...paymentProofErrors.value,
      [orderKey]: "Bukti pembayaran harus berupa gambar JPG, PNG, atau WEBP.",
    };

    toastStore.showToast({
      title: "File Tidak Valid",
      message: "Bukti pembayaran harus berupa gambar JPG, PNG, atau WEBP.",
      type: "error",
    });

    return;
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    paymentProofErrors.value = {
      ...paymentProofErrors.value,
      [orderKey]: "Ukuran bukti pembayaran maksimal 5 MB.",
    };

    toastStore.showToast({
      title: "File Terlalu Besar",
      message: "Ukuran bukti pembayaran maksimal 5 MB.",
      type: "error",
    });

    return;
  }

  paymentProofFiles.value = {
    ...paymentProofFiles.value,
    [orderKey]: file,
  };

  paymentProofPreviews.value = {
    ...paymentProofPreviews.value,
    [orderKey]: URL.createObjectURL(file),
  };
};

const removePaymentProof = (order) => {
  const orderKey = getOrderKey(order);

  paymentProofFiles.value = {
    ...paymentProofFiles.value,
    [orderKey]: null,
  };

  paymentProofPreviews.value = {
    ...paymentProofPreviews.value,
    [orderKey]: "",
  };

  paymentProofErrors.value = {
    ...paymentProofErrors.value,
    [orderKey]: "",
  };
};

const updateOrderInList = (updatedOrder) => {
  orders.value = orders.value.map((order) => {
    const currentKey = getOrderKey(order);
    const updatedKey = getOrderKey(updatedOrder);

    return currentKey === updatedKey ? updatedOrder : order;
  });
};

const uploadPaymentProof = async (order) => {
  const orderKey = getOrderKey(order);
  const file = paymentProofFiles.value[orderKey];

  if (!file || isUploadingPaymentProof(order)) return;

  uploadingPaymentProofOrderNumbers.value = [
    ...uploadingPaymentProofOrderNumbers.value,
    orderKey,
  ];

  paymentProofErrors.value = {
    ...paymentProofErrors.value,
    [orderKey]: "",
  };

  try {
    const updatedOrder = await orderService.uploadPaymentProof(orderKey, file);

    updateOrderInList(updatedOrder);
    removePaymentProof(updatedOrder);

    toastStore.showToast({
      title: "Bukti Pembayaran Terkirim",
      message:
        "Bukti pembayaran Anda berhasil dikirim dan sedang menunggu konfirmasi admin.",
      type: "success",
    });
  } catch (error) {
    paymentProofErrors.value = {
      ...paymentProofErrors.value,
      [orderKey]: error?.message || "Gagal mengunggah bukti pembayaran.",
    };

    toastStore.showToast({
      title: "Unggah Bukti Gagal",
      message: error?.message || "Gagal mengunggah bukti pembayaran.",
      type: "error",
    });
  } finally {
    uploadingPaymentProofOrderNumbers.value =
      uploadingPaymentProofOrderNumbers.value.filter(
        (item) => item !== orderKey,
      );
  }
};

const copyTrackingNumber = async (order) => {
  const trackingNumber = String(order.trackingNumber || "").trim();

  if (!trackingNumber) {
    toastStore.showToast({
      title: "Nomor Resi Belum Tersedia",
      message: "Nomor resi belum tersedia untuk pesanan ini.",
      type: "error",
    });

    return;
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(trackingNumber);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = trackingNumber;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }

    toastStore.showToast({
      title: "Nomor Resi Disalin",
      message: `Nomor resi ${trackingNumber} berhasil disalin.`,
      type: "success",
    });
  } catch (error) {
    toastStore.showToast({
      title: "Gagal Menyalin",
      message: "Nomor resi belum dapat disalin. Silakan salin secara manual.",
      type: "error",
    });
  }
};

const getCourierCode = (order) => {
  const rawOrder = getRawOrder(order);

  return String(
    order.shippingCourier ||
      order.shipping_courier ||
      rawOrder.shipping_courier ||
      "",
  )
    .toLowerCase()
    .trim();
};

const getTrackingWebsiteUrl = (order) => {
  const courierCode = getCourierCode(order);

  if (courierCode.includes("jne")) {
    return "https://jne.co.id/tracking-package";
  }

  if (
    courierCode.includes("jnt") ||
    courierCode.includes("j&t") ||
    courierCode.includes("jet")
  ) {
    return "https://jet.co.id/track";
  }

  return "";
};

const getTrackingWebsiteLabel = (order) => {
  const courierCode = getCourierCode(order);

  if (courierCode.includes("jne")) {
    return "Cek di Website JNE";
  }

  if (
    courierCode.includes("jnt") ||
    courierCode.includes("j&t") ||
    courierCode.includes("jet")
  ) {
    return "Cek di Website J&T";
  }

  return "Cek di Website Ekspedisi";
};

const loadOrders = async () => {
  isLoadingOrders.value = true;
  orderErrorMessage.value = "";

  try {
    orders.value = await orderService.getOrders();
  } catch (error) {
    console.error("Gagal memuat pesanan:", error);

    orderErrorMessage.value =
      error?.response?.data?.message ||
      error?.message ||
      "Riwayat pesanan belum dapat dimuat.";

    toastStore.showToast({
      title: "Gagal Memuat Pesanan",
      message: orderErrorMessage.value,
      type: "error",
    });
  } finally {
    isLoadingOrders.value = false;
  }
};

const isSameDate = (dateA, dateB) => {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
};

const isOrderWithinPeriod = (createdAt) => {
  if (periodFilter.value === "all") return true;
  if (!createdAt) return false;

  const orderDate = new Date(createdAt);

  if (Number.isNaN(orderDate.getTime())) return false;

  const now = new Date();

  if (periodFilter.value === "today") {
    return isSameDate(orderDate, now);
  }

  if (periodFilter.value === "last-7-days") {
    const startDate = new Date();
    startDate.setDate(now.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);

    return orderDate >= startDate && orderDate <= now;
  }

  if (periodFilter.value === "last-30-days") {
    const startDate = new Date();
    startDate.setDate(now.getDate() - 30);
    startDate.setHours(0, 0, 0, 0);

    return orderDate >= startDate && orderDate <= now;
  }

  if (periodFilter.value === "custom") {
    if (!customStartDate.value && !customEndDate.value) return true;

    const startDate = customStartDate.value
      ? new Date(`${customStartDate.value}T00:00:00`)
      : null;

    const endDate = customEndDate.value
      ? new Date(`${customEndDate.value}T23:59:59`)
      : null;

    if (startDate && orderDate < startDate) return false;
    if (endDate && orderDate > endDate) return false;

    return true;
  }

  return true;
};

const resetFilters = () => {
  searchKeyword.value = "";
  statusFilter.value = "all";
  periodFilter.value = "all";
  sortOrder.value = "newest";
  customStartDate.value = "";
  customEndDate.value = "";
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
};

const getTotalItems = (items = []) => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

const formatPaymentMethod = (method) => {
  if (method === "qris-main") return "QRIS GoPay Merchant";
  if (method === "bca-001") return "Bank BCA";

  return method || "-";
};

const getRawOrder = (order) => {
  return order?.raw || order?.backendOrder || order || {};
};

const formatCourierName = (value) => {
  const text = String(value || "").trim();

  if (!text) return "";

  const lowerText = text.toLowerCase();

  if (lowerText === "jnt") return "J&T";
  if (lowerText === "jne") return "JNE";

  return text.toUpperCase();
};

const getShippingCourierLabel = (order) => {
  const rawOrder = getRawOrder(order);

  const courier =
    order.shippingCourier ||
    order.shipping_courier ||
    rawOrder.shipping_courier ||
    "";

  const courierName =
    order.shippingRate?.name ||
    rawOrder.shipping_rate?.name ||
    formatCourierName(courier);

  const service =
    order.shippingService ||
    order.shipping_service ||
    rawOrder.shipping_service ||
    order.shippingRate?.service ||
    "";

  return [courierName, service].filter(Boolean).join(" ");
};

const getShippingDestinationLabel = (order) => {
  const rawOrder = getRawOrder(order);

  return (
    order.shippingDestinationLabel ||
    order.shipping_destination_label ||
    rawOrder.shipping_destination_label ||
    order.shippingDestination?.label ||
    ""
  );
};

const getShippingEtdLabel = (order) => {
  const rawOrder = getRawOrder(order);

  const etd =
    order.shippingEtd ||
    order.shipping_etd ||
    rawOrder.shipping_etd ||
    order.shippingRate?.etd ||
    "";

  return etd ? `${etd} hari` : "";
};

const hasShippingDetail = (order) => {
  return Boolean(
    getShippingCourierLabel(order) ||
    getShippingDestinationLabel(order) ||
    getShippingEtdLabel(order),
  );
};

const formatStatus = (status) => {
  const statusMap = {
    pending: "Menunggu Pembayaran",
    payment_submitted: "Bukti Pembayaran Dikirim",
    paid: "Pembayaran Diterima",
    processing: "Sedang Diproses",
    shipped: "Dikirim",
    completed: "Selesai",
    cancelled: "Dibatalkan",
  };

  return statusMap[status] || "Menunggu Pembayaran";
};

const getStatusClass = (status) => {
  if (status === "paid") {
    return "bg-green-50 text-green-700";
  }

  if (status === "payment_submitted") {
    return "bg-amber-50 text-amber-700";
  }

  if (status === "cancelled") {
    return "bg-red-50 text-red-700";
  }

  if (status === "processing") {
    return "bg-blue-50 text-blue-700";
  }

  if (status === "shipped") {
    return "bg-indigo-50 text-indigo-700";
  }

  if (status === "completed") {
    return "bg-luxe-gold text-luxe-espresso";
  }

  return "bg-luxe-ivory text-luxe-espresso";
};

onMounted(() => {
  loadOrders();
});
</script>
