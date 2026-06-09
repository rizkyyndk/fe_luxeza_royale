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
              Panel Admin
            </p>

            <h1 class="text-4xl md:text-5xl font-bold mb-4 text-luxe-espresso">
              Kelola Pesanan
            </h1>

            <p class="text-luxe-brown/75 max-w-xl leading-7">
              Kelola pesanan customer Luxeza Royale, verifikasi pembayaran, dan
              atur alur pemrosesan pesanan secara manual.
            </p>
          </div>

          <button
            @click="loadOrders"
            class="border border-luxe-espresso text-luxe-espresso px-6 py-3 rounded-full hover:bg-luxe-espresso hover:text-luxe-ivory transition w-fit"
          >
            Muat Ulang Pesanan
          </button>
        </div>

        <!-- FILTER BAR -->
        <div
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
                placeholder="Nomor pesanan, customer, email, nomor telepon..."
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
                {{ filteredOrders.length }}
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
              Mohon tunggu, data pesanan admin sedang dimuat.
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

        <!-- EMPTY -->
        <div
          v-else-if="orders.length === 0"
          class="min-h-[50vh] bg-luxe-cream border border-luxe-sand/60 shadow-[0_18px_60px_rgba(92,56,36,0.10)] rounded-[2rem] flex items-center justify-center text-center px-6"
        >
          <div>
            <p class="text-6xl mb-6">📦</p>

            <h2 class="text-3xl md:text-4xl font-bold mb-4 text-luxe-espresso">
              Belum ada pesanan
            </h2>

            <p class="text-luxe-brown/75">
              Pesanan customer akan tampil di sini setelah checkout.
            </p>
          </div>
        </div>

        <!-- EMPTY FILTER -->
        <div
          v-else-if="filteredOrders.length === 0"
          class="min-h-[45vh] bg-luxe-cream border border-luxe-sand/60 shadow-[0_18px_60px_rgba(92,56,36,0.10)] rounded-[2rem] flex items-center justify-center text-center px-6"
        >
          <div>
            <p class="text-6xl mb-6">🔎</p>

            <h2 class="text-3xl md:text-4xl font-bold mb-4 text-luxe-espresso">
              Pesanan tidak ditemukan
            </h2>

            <p class="text-luxe-brown/75 mb-8">
              Coba ubah status, periode, atau kata kunci pencarian.
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
            v-for="order in filteredOrders"
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
            <div class="p-6 md:p-8 grid lg:grid-cols-[1fr_380px] gap-10">
              <!-- LEFT -->
              <div>
                <!-- CUSTOMER / ADDRESS -->
                <AddressSummaryCard
                  :customer="order.customer || {}"
                  title="Customer & Alamat Pengiriman"
                  eyebrow="Penerima Pesanan"
                  class="mb-6"
                />

                <!-- SHIPPING COURIER DETAIL -->
                <div
                  v-if="hasShippingDetail(order)"
                  class="mb-6 bg-luxe-ivory border border-luxe-sand/60 rounded-3xl p-5 shadow-sm"
                >
                  <p
                    class="uppercase tracking-[3px] text-xs text-luxe-brown/70 mb-2"
                  >
                    Kurir Pengiriman
                  </p>

                  <h3 class="text-xl font-bold text-luxe-espresso mb-5">
                    Detail Pengiriman
                  </h3>

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
                        class="font-semibold text-luxe-espresso text-right max-w-[320px]"
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

                <!-- ITEMS -->
                <div>
                  <div class="mb-6 flex items-center justify-between gap-4">
                    <h3 class="text-2xl font-bold text-luxe-espresso">
                      Item Pesanan
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
                        <h4
                          class="font-semibold leading-snug text-luxe-espresso"
                        >
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
              </div>

              <!-- RIGHT SUMMARY -->
              <div
                class="bg-luxe-ivory border border-luxe-sand/60 rounded-3xl p-6 h-fit shadow-[0_16px_45px_rgba(92,56,36,0.10)]"
              >
                <h3 class="text-2xl font-bold mb-6 text-luxe-espresso">
                  Ringkasan Admin
                </h3>

                <div class="space-y-4">
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

                  <!-- PAYMENT PROOF -->
                  <div
                    class="bg-luxe-cream border border-luxe-sand/60 rounded-3xl p-5 mt-5"
                  >
                    <div class="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <p class="text-sm font-semibold text-luxe-espresso">
                          Bukti Pembayaran
                        </p>

                        <p
                          v-if="order.paymentProofUrl"
                          class="text-xs text-luxe-brown/70 mt-1 leading-5"
                        >
                          Customer telah mengunggah bukti pembayaran. Silakan
                          periksa sebelum menandai pesanan sebagai lunas.
                        </p>

                        <p
                          v-else
                          class="text-xs text-luxe-brown/70 mt-1 leading-5"
                        >
                          Customer belum mengunggah bukti pembayaran.
                        </p>
                      </div>

                      <span
                        v-if="order.paymentProofUrl"
                        class="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold"
                      >
                        Perlu Dicek
                      </span>

                      <span
                        v-else
                        class="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-semibold"
                      >
                        Belum Ada Bukti
                      </span>
                    </div>

                    <div v-if="order.paymentProofUrl">
                      <a
                        :href="order.paymentProofUrl"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-block"
                      >
                        <img
                          :src="order.paymentProofUrl"
                          alt="Bukti pembayaran"
                          class="w-full max-w-[220px] h-[220px] object-cover rounded-2xl border border-luxe-sand/60 bg-luxe-ivory"
                        />
                      </a>

                      <p
                        v-if="order.paymentProofUploadedAt"
                        class="text-xs text-luxe-brown/60 mt-3"
                      >
                        Diunggah pada
                        {{ formatDate(order.paymentProofUploadedAt) }}
                      </p>

                      <a
                        :href="order.paymentProofUrl"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-block mt-4 text-sm font-semibold text-luxe-espresso hover:text-luxe-royal transition"
                      >
                        Buka Gambar Penuh
                      </a>
                    </div>
                  </div>

                  <!-- SHIPPING RECEIPT -->
                  <div
                    v-if="shippingReceiptForms[order.orderNumber]"
                    class="bg-luxe-cream border border-luxe-sand/60 rounded-3xl p-5 mt-5"
                  >
                    <div class="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <p class="text-sm font-semibold text-luxe-espresso">
                          Resi Pengiriman
                        </p>

                        <p
                          v-if="canManageShippingReceipt(order)"
                          class="text-xs text-luxe-brown/70 mt-1 leading-5"
                        >
                          Masukkan nomor resi dan unggah foto resi setelah
                          pembayaran berhasil diverifikasi.
                        </p>

                        <p v-else class="text-xs text-red-600 mt-1 leading-5">
                          Ubah status pesanan menjadi Sedang Diproses terlebih
                          dahulu sebelum mengunggah resi.
                        </p>
                      </div>

                      <span
                        v-if="order.trackingNumber"
                        class="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold"
                      >
                        Tersedia
                      </span>

                      <span
                        v-else
                        class="bg-luxe-ivory text-luxe-espresso px-3 py-1 rounded-full text-xs font-semibold"
                      >
                        Manual
                      </span>
                    </div>

                    <div class="space-y-4">
                      <div>
                        <label class="block text-xs text-luxe-brown/75 mb-2">
                          Kurir
                        </label>

                        <input
                          :value="getShippingCourierLabel(order) || '-'"
                          type="text"
                          disabled
                          class="w-full border border-luxe-sand/70 bg-luxe-ivory/60 text-luxe-brown rounded-full px-4 py-3 outline-none cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label class="block text-xs text-luxe-brown/75 mb-2">
                          Nomor Resi
                        </label>

                        <input
                          v-model="
                            shippingReceiptForms[order.orderNumber]
                              .trackingNumber
                          "
                          type="text"
                          placeholder="Contoh: JNE1234567890"
                          :disabled="
                            !canManageShippingReceipt(order) ||
                            uploadingShippingReceiptOrderCode ===
                              order.orderNumber
                          "
                          class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-full px-4 py-3 outline-none focus:border-luxe-royal transition disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label class="block text-xs text-luxe-brown/75 mb-2">
                          Unggah Foto Resi
                        </label>

                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          :disabled="
                            !canManageShippingReceipt(order) ||
                            uploadingShippingReceiptOrderCode ===
                              order.orderNumber
                          "
                          @change="
                            handleShippingReceiptFileChange(order, $event)
                          "
                          class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso rounded-2xl px-4 py-3 outline-none focus:border-luxe-royal transition disabled:opacity-50 disabled:cursor-not-allowed"
                        />

                        <p
                          v-if="
                            shippingReceiptForms[order.orderNumber].fileName
                          "
                          class="text-xs text-luxe-brown/60 mt-2"
                        >
                          File dipilih:
                          {{ shippingReceiptForms[order.orderNumber].fileName }}
                        </p>
                      </div>

                      <div v-if="order.shippingReceiptUrl">
                        <a
                          :href="order.shippingReceiptUrl"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="inline-block"
                        >
                          <img
                            :src="order.shippingReceiptUrl"
                            alt="Foto resi pengiriman"
                            class="w-full max-w-[220px] h-[220px] object-cover rounded-2xl border border-luxe-sand/60 bg-luxe-ivory"
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
                          class="inline-block mt-4 text-sm font-semibold text-luxe-espresso hover:text-luxe-royal transition"
                        >
                          Buka Foto Resi
                        </a>
                      </div>

                      <button
                        type="button"
                        @click="submitShippingReceipt(order)"
                        :disabled="
                          !canManageShippingReceipt(order) ||
                          uploadingShippingReceiptOrderCode ===
                            order.orderNumber
                        "
                        class="w-full bg-luxe-espresso text-luxe-ivory px-5 py-3 rounded-full text-sm font-semibold hover:bg-luxe-royal disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        {{
                          uploadingShippingReceiptOrderCode ===
                          order.orderNumber
                            ? "Menyimpan Resi..."
                            : order.shippingReceiptUrl
                              ? "Perbarui Resi Pengiriman"
                              : "Simpan Resi Pengiriman"
                        }}
                      </button>
                    </div>
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

                <!-- STATUS ACTIONS -->
                <div class="mt-6 border-t border-luxe-sand/60 pt-6">
                  <p class="text-sm font-semibold mb-3 text-luxe-espresso">
                    Perbarui Status Pesanan
                  </p>

                  <div class="grid grid-cols-2 gap-3">
                    <button
                      v-for="action in statusActions"
                      :key="action.value"
                      type="button"
                      @click="updateOrderStatus(order, action.value)"
                      :disabled="isStatusActionDisabled(order, action.value)"
                      :class="getStatusButtonClass(action)"
                    >
                      {{ getStatusButtonLabel(action, order) }}
                    </button>
                  </div>

                  <p class="text-xs text-luxe-brown/70 mt-3 leading-5">
                    {{ getStatusFlowHint(order) }}
                  </p>

                  <p
                    v-if="updatingOrderCode === order.orderNumber"
                    class="text-xs text-luxe-brown/70 mt-3"
                  >
                    Memperbarui status pesanan...
                  </p>
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
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import Navbar from "../components/layout/Navbar.vue";
import CartSidebar from "../components/layout/CartSidebar.vue";
import Footer from "../components/layout/Footer.vue";
import ProductImage from "../components/ui/ProductImage.vue";

import { useToastStore } from "../stores/toastStore";
import { formatCurrency } from "../utils/formatCurrency";
import { orderService } from "../services/orderService";
import AddressSummaryCard from "../components/order/AddressSummaryCard.vue";
import LuxeSelect from "../components/ui/LuxeSelect.vue";

const route = useRoute();
const toastStore = useToastStore();

const orders = ref([]);
const isLoadingOrders = ref(false);
const orderErrorMessage = ref("");
const updatingOrderCode = ref("");

const uploadingShippingReceiptOrderCode = ref("");
const shippingReceiptForms = ref({});

const searchKeyword = ref("");
const statusFilter = ref("all");
const periodFilter = ref("all");
const sortOrder = ref("newest");
const customStartDate = ref("");
const customEndDate = ref("");

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
  { label: "Semua Status", value: "all" },
  { label: "Menunggu Pembayaran", value: "pending" },
  {
    label: "Bukti Pembayaran Dikirim",
    value: "payment_submitted",
  },
  { label: "Pembayaran Diterima", value: "paid" },
  { label: "Sedang Diproses", value: "processing" },
  { label: "Dikirim", value: "shipped" },
  { label: "Selesai", value: "completed" },
  { label: "Dibatalkan", value: "cancelled" },
];

const getQueryValue = (value) => {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
};

const isValidStatusFilter = (value) => {
  return statusOptions.some((option) => option.value === value);
};

const isValidPeriodFilter = (value) => {
  return periodOptions.some((option) => option.value === value);
};

const isValidSortOrder = (value) => {
  return sortOptions.some((option) => option.value === value);
};

const applyRouteFilters = () => {
  const statusQuery = getQueryValue(route.query.status);
  const periodQuery = getQueryValue(route.query.period);
  const sortQuery = getQueryValue(route.query.sort);
  const searchQuery = getQueryValue(route.query.search);
  const startDateQuery = getQueryValue(route.query.start_date);
  const endDateQuery = getQueryValue(route.query.end_date);

  if (statusQuery && isValidStatusFilter(statusQuery)) {
    statusFilter.value = statusQuery;
  }

  if (periodQuery && isValidPeriodFilter(periodQuery)) {
    periodFilter.value = periodQuery;
  }

  if (sortQuery && isValidSortOrder(sortQuery)) {
    sortOrder.value = sortQuery;
  }

  if (searchQuery) {
    searchKeyword.value = searchQuery;
  }

  if (startDateQuery) {
    customStartDate.value = startDateQuery;
    periodFilter.value = "custom";
  }

  if (endDateQuery) {
    customEndDate.value = endDateQuery;
    periodFilter.value = "custom";
  }
};

const statusActions = [
  {
    label: "Tandai Lunas",
    value: "paid",
    variant: "default",
  },
  {
    label: "Proses Pesanan",
    value: "processing",
    variant: "default",
  },
  {
    label: "Selesaikan",
    value: "completed",
    variant: "primary",
  },
  {
    label: "Batalkan",
    value: "cancelled",
    variant: "danger",
  },
];

const statusFlow = {
  pending: ["cancelled"],
  payment_submitted: ["paid", "cancelled"],
  paid: ["processing", "cancelled"],
  processing: ["cancelled"],
  shipped: ["completed"],
  completed: [],
  cancelled: [],
};

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

const filteredOrders = computed(() => {
  const keyword = searchKeyword.value.toLowerCase().trim();

  let result = orders.value.filter((order) => {
    const orderNumber = String(order.orderNumber || "").toLowerCase();
    const customerName = String(order.customer?.fullName || "").toLowerCase();
    const customerEmail = String(order.customer?.email || "").toLowerCase();
    const customerPhone = String(order.customer?.phone || "").toLowerCase();

    const shippingInfo = [
      getShippingCourierLabel(order),
      getShippingDestinationLabel(order),
      getShippingEtdLabel(order),
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

const loadOrders = async () => {
  isLoadingOrders.value = true;
  orderErrorMessage.value = "";

  try {
    const adminOrders = await orderService.getAdminOrders();

    orders.value = adminOrders;
    syncShippingReceiptForms(adminOrders);
  } catch (error) {
    console.error("Gagal memuat pesanan admin:", error);

    orderErrorMessage.value =
      error?.response?.data?.message ||
      error?.message ||
      "Data pesanan admin belum dapat dimuat.";

    toastStore.showToast({
      title: "Gagal Memuat Pesanan",
      message: orderErrorMessage.value,
      type: "error",
    });
  } finally {
    isLoadingOrders.value = false;
  }
};

const canUpdateToStatus = (order, nextStatus) => {
  const currentStatus = String(order.status || "pending").toLowerCase();
  const targetStatus = String(nextStatus || "").toLowerCase();

  if (!targetStatus || currentStatus === targetStatus) {
    return false;
  }

  const allowedNextStatuses = statusFlow[currentStatus] || [];

  if (!allowedNextStatuses.includes(targetStatus)) {
    return false;
  }

  if (targetStatus === "shipped" && !order.trackingNumber) {
    return false;
  }

  return true;
};

const isStatusActionDisabled = (order, nextStatus) => {
  return (
    updatingOrderCode.value === order.orderNumber ||
    !canUpdateToStatus(order, nextStatus)
  );
};

const getStatusButtonLabel = (action, order) => {
  if (action.value === "paid" && order.status === "payment_submitted") {
    return "Verifikasi & Tandai Lunas";
  }

  return action.label;
};

const getStatusButtonClass = (action) => {
  if (action.variant === "primary") {
    return "px-4 py-3 rounded-full text-sm bg-luxe-espresso text-luxe-ivory hover:bg-luxe-royal disabled:opacity-40 disabled:cursor-not-allowed transition";
  }

  if (action.variant === "danger") {
    return "px-4 py-3 rounded-full text-sm border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition";
  }

  return "px-4 py-3 rounded-full text-sm border border-luxe-sand text-luxe-espresso hover:bg-luxe-cream disabled:opacity-40 disabled:cursor-not-allowed transition";
};

const getStatusFlowHint = (order) => {
  const status = String(order.status || "pending").toLowerCase();

  if (status === "pending") {
    return "Menunggu customer mengunggah bukti pembayaran. Pada tahap ini admin hanya dapat membatalkan pesanan.";
  }

  if (status === "payment_submitted") {
    return "Bukti pembayaran sudah diunggah. Admin perlu memeriksa bukti tersebut, lalu klik Verifikasi & Tandai Lunas.";
  }

  if (status === "paid") {
    return "Pembayaran sudah valid. Klik Proses Pesanan untuk mulai proses packing.";
  }

  if (status === "processing") {
    return "Pesanan sedang diproses. Masukkan nomor resi dan unggah foto resi, lalu status akan otomatis menjadi Dikirim.";
  }

  if (status === "shipped") {
    return "Pesanan sudah dikirim dan nomor resi tersedia. Klik Selesaikan setelah pesanan diterima customer.";
  }

  if (status === "completed") {
    return "Pesanan sudah selesai. Tidak ada aksi status berikutnya.";
  }

  if (status === "cancelled") {
    return "Pesanan sudah dibatalkan. Tidak ada aksi status berikutnya.";
  }

  return "";
};

const updateOrderStatus = async (order, status) => {
  if (updatingOrderCode.value) return;

  updatingOrderCode.value = order.orderNumber;

  try {
    const updatedOrder = await orderService.updateOrderStatus(
      order.orderNumber,
      status,
    );

    orders.value = orders.value.map((item) =>
      item.orderNumber === order.orderNumber ? updatedOrder : item,
    );

    toastStore.showToast({
      title: "Pesanan Berhasil Diperbarui",
      message: `Pesanan ${order.orderNumber} berhasil diperbarui menjadi ${formatStatus(
        status,
      )}.`,
      type: "success",
    });
  } catch (error) {
    toastStore.showToast({
      title: "Gagal Memperbarui Pesanan",
      message: error?.message || "Status pesanan belum dapat diperbarui.",
      type: "error",
    });
  } finally {
    updatingOrderCode.value = "";
  }
};

const createShippingReceiptForm = (order = {}) => {
  return {
    trackingNumber: order.trackingNumber || "",
    shippingReceipt: null,
    fileName: "",
  };
};

const syncShippingReceiptForms = (orderList = []) => {
  const nextForms = { ...shippingReceiptForms.value };

  orderList.forEach((order) => {
    const orderNumber = order.orderNumber;

    if (!orderNumber) return;

    if (!nextForms[orderNumber]) {
      nextForms[orderNumber] = createShippingReceiptForm(order);
      return;
    }

    nextForms[orderNumber] = {
      ...nextForms[orderNumber],
      trackingNumber:
        nextForms[orderNumber].trackingNumber || order.trackingNumber || "",
    };
  });

  shippingReceiptForms.value = nextForms;
};

const canManageShippingReceipt = (order) => {
  const status = String(order.status || "").toLowerCase();

  return ["processing", "shipped"].includes(status);
};

const handleShippingReceiptFileChange = (order, event) => {
  const file = event.target.files?.[0] || null;
  const orderNumber = order.orderNumber;

  if (!shippingReceiptForms.value[orderNumber]) {
    shippingReceiptForms.value[orderNumber] = createShippingReceiptForm(order);
  }

  shippingReceiptForms.value[orderNumber].shippingReceipt = file;
  shippingReceiptForms.value[orderNumber].fileName = file?.name || "";
};

const submitShippingReceipt = async (order) => {
  if (uploadingShippingReceiptOrderCode.value) return;

  const orderNumber = order.orderNumber;
  const form = shippingReceiptForms.value[orderNumber];

  if (!form) return;

  if (!canManageShippingReceipt(order)) {
    toastStore.showToast({
      title: "Resi Belum Dapat Diunggah",
      message:
        "Ubah status pesanan menjadi Sedang Diproses sebelum mengunggah resi.",
      type: "error",
    });

    return;
  }

  if (!form.trackingNumber.trim()) {
    toastStore.showToast({
      title: "Nomor Resi Wajib Diisi",
      message: "Silakan masukkan nomor resi pengiriman terlebih dahulu.",
      type: "error",
    });

    return;
  }

  if (!order.shippingReceiptUrl && !form.shippingReceipt) {
    toastStore.showToast({
      title: "Foto Resi Wajib Diunggah",
      message: "Silakan unggah foto resi pengiriman terlebih dahulu.",
      type: "error",
    });

    return;
  }

  uploadingShippingReceiptOrderCode.value = orderNumber;

  try {
    const updatedOrder = await orderService.uploadShippingReceipt(orderNumber, {
      trackingNumber: form.trackingNumber.trim(),
      shippingReceipt: form.shippingReceipt,
    });

    orders.value = orders.value.map((item) =>
      item.orderNumber === orderNumber ? updatedOrder : item,
    );

    shippingReceiptForms.value[orderNumber] = {
      trackingNumber: updatedOrder.trackingNumber || form.trackingNumber,
      shippingReceipt: null,
      fileName: "",
    };

    toastStore.showToast({
      title: "Resi Pengiriman Tersimpan",
      message: `Resi pengiriman untuk pesanan ${orderNumber} berhasil disimpan.`,
      type: "success",
    });
  } catch (error) {
    toastStore.showToast({
      title: "Unggah Resi Gagal",
      message: error?.message || "Resi pengiriman belum dapat diunggah.",
      type: "error",
    });
  } finally {
    uploadingShippingReceiptOrderCode.value = "";
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

watch(
  () => route.query,
  () => {
    applyRouteFilters();
  },
  {
    deep: true,
  },
);

onMounted(() => {
  applyRouteFilters();
  loadOrders();
});
</script>
