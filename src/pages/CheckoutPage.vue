<template>
  <div>
    <Navbar />
    <CartSidebar />

    <section class="pt-36 pb-24 px-6">
      <div class="max-w-7xl mx-auto">
        <!-- EMPTY CHECKOUT -->
        <div
          v-if="cartStore.isEmpty || !cartStore.hasSelectedItems"
          class="min-h-[60vh] flex items-center justify-center text-center"
        >
          <div>
            <p class="text-6xl mb-6">🛒</p>

            <h1 class="text-4xl md:text-5xl font-bold mb-4">
              No selected items
            </h1>

            <p class="text-luxe-brown/75 mb-8">
              Please select at least one item from your cart before checkout.
            </p>

            <RouterLink
              to="/"
              class="bg-luxe-espresso text-luxe-ivory px-8 py-4 rounded-full inline-block hover:bg-luxe-royal hover:scale-105 transition shadow-lg shadow-luxe-brown/20"
            >
              Back to Collection
            </RouterLink>
          </div>
        </div>

        <!-- CHECKOUT CONTENT -->
        <div v-else class="grid lg:grid-cols-2 gap-20">
          <!-- LEFT -->
          <div>
            <p class="uppercase tracking-[4px] text-sm text-luxe-brown mb-4">
              Checkout
            </p>

            <h1 class="text-4xl md:text-5xl font-bold mb-4">
              Shipping Information
            </h1>

            <p class="text-luxe-brown/75 mb-10 leading-7">
              Complete your shipping details to place an order through Luxeza
              Royale backend system.
            </p>

            <form class="space-y-6" @submit.prevent="placeOrder">
              <!-- FULL NAME -->
              <div>
                <input
                  v-model="form.fullName"
                  type="text"
                  placeholder="Full Name"
                  class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-6 py-5 outline-none focus:border-luxe-royal transition shadow-sm"
                />

                <p v-if="errors.fullName" class="text-red-500 text-sm mt-2">
                  {{ errors.fullName }}
                </p>
              </div>

              <!-- EMAIL -->
              <div>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="Email Address"
                  class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50 rounded-2xl px-6 py-5 outline-none focus:border-luxe-royal transition shadow-sm"
                />

                <p v-if="errors.email" class="text-red-500 text-sm mt-2">
                  {{ errors.email }}
                </p>
              </div>

              <!-- PHONE -->
              <div>
                <div>
                  <div class="flex">
                    <div
                      class="px-5 py-5 rounded-l-2xl border border-r-0 border-luxe-sand bg-luxe-cream text-luxe-espresso font-semibold"
                    >
                      +62
                    </div>

                    <input
                      v-model="form.phone"
                      @input="handlePhoneInput"
                      type="text"
                      inputmode="numeric"
                      placeholder="81234567890"
                      class="w-full border border-luxe-sand rounded-r-2xl px-6 py-5 outline-none focus:border-luxe-royal transition bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50"
                    />
                  </div>

                  <p v-if="errors.phone" class="text-red-500 text-sm mt-2">
                    {{ errors.phone }}
                  </p>
                </div>

                <p v-if="errors.phone" class="text-red-500 text-sm mt-2">
                  {{ errors.phone }}
                </p>
              </div>

              <!-- SAVED ADDRESSES -->
              <div
                v-if="authStore.token"
                class="bg-luxe-cream border border-luxe-sand/70 rounded-[2rem] p-5 md:p-6 space-y-5"
              >
                <div
                  class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3"
                >
                  <div>
                    <p
                      class="uppercase tracking-[3px] text-xs text-luxe-brown/70 mb-2"
                    >
                      Saved Addresses
                    </p>

                    <h3 class="text-2xl font-bold text-luxe-espresso">
                      Choose Delivery Address
                    </h3>
                  </div>

                  <p class="text-sm text-luxe-brown/65">
                    Use your primary address or save a new one for the next
                    order.
                  </p>
                </div>

                <div
                  v-if="isLoadingAddresses"
                  class="bg-luxe-ivory border border-luxe-sand/70 rounded-3xl p-5 text-luxe-brown/70"
                >
                  Loading saved addresses...
                </div>

                <div
                  v-else-if="addressBookError"
                  class="bg-red-50 border border-red-100 text-red-600 rounded-3xl p-5"
                >
                  {{ addressBookError }}
                </div>

                <div
                  v-else-if="savedAddresses.length === 0"
                  class="bg-luxe-ivory border border-luxe-sand/70 rounded-3xl p-5 text-luxe-brown/70"
                >
                  You do not have saved addresses yet. Fill the address form
                  below and save it for your next order.
                </div>

                <div v-else class="grid md:grid-cols-2 gap-4">
                  <button
                    v-for="address in savedAddresses"
                    :key="address.id"
                    type="button"
                    @click="applySavedAddress(address)"
                    :class="
                      selectedAddressId === String(address.id)
                        ? 'bg-luxe-espresso text-luxe-ivory border-luxe-espresso shadow-lg shadow-luxe-brown/20'
                        : 'bg-luxe-ivory text-luxe-espresso border-luxe-sand hover:border-luxe-royal hover:bg-white'
                    "
                    class="border rounded-3xl p-5 text-left transition"
                  >
                    <div class="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <p class="font-bold">
                          {{ address.label }}
                        </p>

                        <p
                          :class="
                            selectedAddressId === String(address.id)
                              ? 'text-luxe-sand'
                              : 'text-luxe-brown/70'
                          "
                          class="text-sm mt-1"
                        >
                          {{ address.recipientName }} • +{{ address.phone }}
                        </p>
                      </div>

                      <span
                        v-if="address.isPrimary"
                        :class="
                          selectedAddressId === String(address.id)
                            ? 'bg-luxe-ivory text-luxe-espresso'
                            : 'bg-luxe-espresso text-luxe-ivory'
                        "
                        class="text-xs px-3 py-1 rounded-full whitespace-nowrap"
                      >
                        Primary
                      </span>
                    </div>

                    <p
                      :class="
                        selectedAddressId === String(address.id)
                          ? 'text-luxe-sand'
                          : 'text-luxe-brown/75'
                      "
                      class="text-sm leading-6"
                    >
                      {{ address.addressDetail }}, Kel. {{ address.village }},
                      Kec. {{ address.district }}, {{ address.city }},
                      {{ address.province }}, RT {{ address.rt }}/RW
                      {{ address.rw }},
                      {{ address.postalCode }}
                    </p>
                  </button>
                </div>

                <div
                  v-if="savedAddresses.length > 0"
                  class="flex flex-col sm:flex-row gap-3"
                >
                  <button
                    type="button"
                    @click="showChangeAddress"
                    class="flex-1 border border-luxe-sand bg-luxe-ivory text-luxe-espresso px-5 py-4 rounded-2xl hover:bg-white hover:border-luxe-royal transition"
                  >
                    Change Address
                  </button>

                  <button
                    type="button"
                    @click="useNewAddress"
                    class="flex-1 bg-luxe-espresso text-luxe-ivory px-5 py-4 rounded-2xl hover:bg-luxe-royal transition"
                  >
                    Use New Address
                  </button>
                </div>

                <AddressSummaryCard
                  v-if="selectedAddressId && !isAddressFormVisible"
                  :customer="{
                    fullName: form.fullName,
                    phone: normalizePhoneNumber(form.phone),
                    email: form.email,
                    province: form.province,
                    city: form.city,
                    district: form.district,
                    village: form.village,
                    rt: form.rt,
                    rw: form.rw,
                    postalCode: form.postalCode,
                    addressDetail: form.addressDetail,
                  }"
                  title="Selected Delivery Address"
                  eyebrow="Current Checkout Address"
                />

                <div class="flex flex-col sm:flex-row gap-3">
                  <label
                    class="flex items-center gap-3 bg-luxe-ivory border border-luxe-sand/70 rounded-2xl px-5 py-4 cursor-pointer"
                  >
                    <input
                      v-model="saveAddressForNextOrder"
                      type="checkbox"
                      class="w-5 h-5 accent-black"
                    />

                    <span class="text-sm text-luxe-espresso">
                      Save this address for next order
                    </span>
                  </label>

                  <label
                    class="flex items-center gap-3 bg-luxe-ivory border border-luxe-sand/70 rounded-2xl px-5 py-4 cursor-pointer"
                  >
                    <input
                      v-model="setAsPrimaryAddress"
                      type="checkbox"
                      :disabled="!saveAddressForNextOrder"
                      class="w-5 h-5 accent-black disabled:opacity-40"
                    />

                    <span class="text-sm text-luxe-espresso">
                      Set as primary address
                    </span>
                  </label>
                </div>
              </div>

              <!-- ADDRESS -->
              <div
                v-if="isAddressFormVisible || !selectedAddressId"
                class="bg-luxe-cream border border-luxe-sand/70 rounded-[2rem] p-5 md:p-6 space-y-5"
              >
                <div
                  class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3"
                >
                  <div>
                    <p
                      class="uppercase tracking-[3px] text-xs text-luxe-brown/70 mb-2"
                    >
                      Shipping Address
                    </p>

                    <h3 class="text-2xl font-bold text-luxe-espresso">
                      Delivery Destination
                    </h3>
                  </div>

                  <p class="text-sm text-luxe-brown/65">
                    Select region step by step for accurate shipping details.
                  </p>
                </div>

                <div class="grid md:grid-cols-2 gap-5">
                  <div class="md:col-span-2">
                    <label
                      class="block text-sm font-medium text-luxe-brown/75 mb-2"
                    >
                      Address Label
                    </label>

                    <input
                      v-model="form.addressLabel"
                      @input="markAddressAsCustom"
                      type="text"
                      placeholder="Example: Rumah, Kantor, Kos"
                      class="w-full border border-luxe-sand rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50"
                    />
                  </div>

                  <!-- PROVINCE -->
                  <SearchableSelect
                    v-model="form.provinceId"
                    label="Province"
                    :options="provinces"
                    :loading="isLoadingProvinces"
                    placeholder="Select Province"
                    search-placeholder="Search province..."
                    :error="errors.province"
                    @change="handleProvinceChange"
                  />

                  <!-- CITY -->
                  <SearchableSelect
                    v-model="form.cityId"
                    label="City / Regency"
                    :options="cities"
                    :loading="isLoadingCities"
                    :disabled="!form.provinceId || isLoadingCities"
                    placeholder="Select City / Regency"
                    search-placeholder="Search city or regency..."
                    :error="errors.city"
                    @change="handleCityChange"
                  />

                  <!-- DISTRICT -->
                  <SearchableSelect
                    v-model="form.districtId"
                    label="District / Kecamatan"
                    :options="districts"
                    :loading="isLoadingDistricts"
                    :disabled="!form.cityId || isLoadingDistricts"
                    placeholder="Select District / Kecamatan"
                    search-placeholder="Search district..."
                    :error="errors.district"
                    @change="handleDistrictChange"
                  />

                  <!-- VILLAGE -->
                  <SearchableSelect
                    v-model="form.villageId"
                    label="Village / Kelurahan"
                    :options="villages"
                    :loading="isLoadingVillages"
                    :disabled="!form.districtId || isLoadingVillages"
                    placeholder="Select Village / Kelurahan"
                    search-placeholder="Search village..."
                    :error="errors.village"
                    @change="handleVillageChange"
                  />

                  <!-- RT -->
                  <div>
                    <label
                      class="block text-sm font-medium text-luxe-brown/75 mb-2"
                    >
                      RT
                    </label>

                    <input
                      v-model="form.rt"
                      @input="handleNumericInput('rt')"
                      type="text"
                      inputmode="numeric"
                      placeholder="Example: 001"
                      class="w-full border border-luxe-sand rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50"
                    />

                    <p v-if="errors.rt" class="text-red-500 text-sm mt-2">
                      {{ errors.rt }}
                    </p>
                  </div>

                  <!-- RW -->
                  <div>
                    <label
                      class="block text-sm font-medium text-luxe-brown/75 mb-2"
                    >
                      RW
                    </label>

                    <input
                      v-model="form.rw"
                      @input="handleNumericInput('rw')"
                      type="text"
                      inputmode="numeric"
                      placeholder="Example: 002"
                      class="w-full border border-luxe-sand rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50"
                    />

                    <p v-if="errors.rw" class="text-red-500 text-sm mt-2">
                      {{ errors.rw }}
                    </p>
                  </div>

                  <!-- POSTAL CODE -->
                  <div class="md:col-span-2">
                    <label
                      class="block text-sm font-medium text-luxe-brown/75 mb-2"
                    >
                      Postal Code
                    </label>

                    <input
                      v-model="form.postalCode"
                      @input="handleNumericInput('postalCode')"
                      type="text"
                      inputmode="numeric"
                      placeholder="Example: 12710"
                      class="w-full border border-luxe-sand rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50"
                    />

                    <p
                      v-if="errors.postalCode"
                      class="text-red-500 text-sm mt-2"
                    >
                      {{ errors.postalCode }}
                    </p>
                  </div>

                  <!-- ADDRESS DETAIL -->
                  <div class="md:col-span-2">
                    <label
                      class="block text-sm font-medium text-luxe-brown/75 mb-2"
                    >
                      Address Detail
                    </label>

                    <textarea
                      v-model="form.addressDetail"
                      placeholder="Street name, house number, building, floor, landmark"
                      rows="5"
                      class="w-full border border-luxe-sand rounded-2xl px-5 py-4 outline-none focus:border-luxe-royal transition resize-none bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50"
                    ></textarea>

                    <p
                      v-if="errors.addressDetail"
                      class="text-red-500 text-sm mt-2"
                    >
                      {{ errors.addressDetail }}
                    </p>
                  </div>

                  <p
                    v-if="regionError"
                    class="text-red-500 text-sm md:col-span-2"
                  >
                    {{ regionError }}
                  </p>
                </div>

                <div
                  v-if="
                    form.province || form.city || form.district || form.village
                  "
                  class="bg-luxe-ivory border border-luxe-sand/70 rounded-3xl p-5"
                >
                  <p class="text-sm font-semibold text-luxe-espresso mb-2">
                    Selected Region
                  </p>

                  <p class="text-sm text-luxe-brown/75 leading-6">
                    {{ form.village || "Village" }},
                    {{ form.district || "District" }},
                    {{ form.city || "City" }},
                    {{ form.province || "Province" }}
                  </p>
                </div>
              </div>

              <!-- SHIPPING METHOD -->
              <div>
                <div class="flex items-center justify-between gap-4 mb-3">
                  <label class="block text-sm text-luxe-brown/75">
                    Ongkir Pengiriman
                  </label>

                  <span
                    v-if="isFreeShippingUnlocked"
                    class="text-xs bg-luxe-espresso text-luxe-ivory px-4 py-2 rounded-full"
                  >
                    Free shipping unlocked
                  </span>
                </div>

                <!-- SEARCH DESTINATION -->
                <div
                  class="bg-luxe-cream border border-luxe-sand/70 rounded-[2rem] p-5 md:p-6 space-y-5"
                >
                  <div>
                    <p
                      class="uppercase tracking-[3px] text-xs text-luxe-brown/70 mb-2"
                    >
                      Ongkir Otomatis
                    </p>

                    <h3 class="text-2xl font-bold text-luxe-espresso">
                      Estimasi Ongkir dari Alamat
                    </h3>

                    <p class="text-sm text-luxe-brown/65 mt-2 leading-6">
                      Sistem akan menghitung ongkir berdasarkan alamat
                      pengiriman yang sudah Anda isi.
                    </p>
                  </div>

                  <div class="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      @click="searchShippingDestinations"
                      :disabled="isSearchingDestinations"
                      class="bg-luxe-espresso text-luxe-ivory px-6 py-4 rounded-2xl hover:bg-luxe-royal disabled:opacity-50 transition"
                    >
                      {{ isSearchingDestinations ? "Mencari..." : "Cari" }}
                    </button>
                  </div>

                  <button
                    type="button"
                    @click="useAddressAsShippingSearch"
                    class="w-full border border-luxe-sand bg-luxe-ivory text-luxe-espresso px-5 py-4 rounded-2xl hover:bg-white hover:border-luxe-royal transition"
                  >
                    Gunakan Alamat Checkout untuk Pencarian
                  </button>

                  <p
                    v-if="shippingDestinationError"
                    class="text-red-500 text-sm"
                  >
                    {{ shippingDestinationError }}
                  </p>

                  <!-- DESTINATION RESULT -->
                  <div v-if="shippingDestinations.length > 0" class="space-y-3">
                    <button
                      v-for="destination in shippingDestinations"
                      :key="destination.id"
                      type="button"
                      @click="selectShippingDestination(destination)"
                      class="w-full text-left bg-luxe-ivory border border-luxe-sand/70 rounded-3xl p-5 hover:border-luxe-royal hover:bg-white transition"
                    >
                      <p class="font-semibold text-luxe-espresso">
                        {{ destination.label }}
                      </p>
                    </button>
                  </div>

                  <!-- SELECTED DESTINATION -->
                  <div
                    v-if="selectedShippingDestination"
                    class="bg-luxe-ivory border border-luxe-sand/70 rounded-3xl p-5"
                  >
                    <p class="text-sm text-luxe-brown/70 mb-2">
                      Tujuan ongkir dipilih:
                    </p>

                    <p class="font-semibold text-luxe-espresso leading-6">
                      {{ selectedShippingDestination.label }}
                    </p>
                  </div>

                  <button
                    v-if="selectedShippingDestination"
                    type="button"
                    @click="loadShippingRates"
                    :disabled="isLoadingShippingRates"
                    class="w-full bg-luxe-espresso text-luxe-ivory px-5 py-4 rounded-2xl hover:bg-luxe-royal disabled:opacity-50 transition"
                  >
                    {{
                      isLoadingShippingRates
                        ? "Menghitung Ongkir..."
                        : "Hitung Ulang Ongkir"
                    }}
                  </button>
                </div>

                <!-- RATES -->
                <div class="mt-5">
                  <div
                    v-if="isLoadingShippingRates"
                    class="bg-luxe-cream border border-luxe-sand/60 rounded-3xl p-5 text-luxe-brown/75"
                  >
                    Menghitung ongkir...
                  </div>

                  <div
                    v-else-if="shippingRateError"
                    class="bg-red-50 border border-red-100 text-red-600 rounded-3xl p-5"
                  >
                    {{ shippingRateError }}
                  </div>

                  <div
                    v-else-if="shippingRates.length > 0"
                    class="grid grid-cols-1 gap-4"
                  >
                    <div
                      v-if="totalShippingWeightGram > 0"
                      class="bg-luxe-cream border border-luxe-sand/60 rounded-3xl p-4 text-sm text-luxe-brown/75"
                    >
                      Total berat pengiriman:
                      <span class="font-semibold text-luxe-espresso">
                        {{ totalShippingWeightGram }} gram
                      </span>
                    </div>

                    <button
                      v-for="rate in shippingRates"
                      :key="rate.id"
                      type="button"
                      @click="selectedShippingRateId = rate.id"
                      :class="
                        selectedShippingRateId === rate.id
                          ? 'bg-luxe-espresso text-luxe-ivory border-luxe-espresso shadow-lg shadow-luxe-brown/20'
                          : 'bg-luxe-ivory text-luxe-espresso border-luxe-sand hover:border-luxe-royal hover:bg-luxe-cream'
                      "
                      class="w-full rounded-3xl border px-5 py-5 text-left transition hover:shadow-md"
                    >
                      <div class="flex items-start justify-between gap-4">
                        <div>
                          <p class="font-bold text-lg">
                            {{ rate.name }} {{ rate.service }}
                          </p>

                          <p
                            :class="
                              selectedShippingRateId === rate.id
                                ? 'text-luxe-sand'
                                : 'text-luxe-brown/70'
                            "
                            class="text-sm mt-2 leading-6"
                          >
                            {{ rate.description || "Layanan pengiriman" }}
                            <span v-if="rate.etd">
                              • Estimasi {{ rate.etd }} hari
                            </span>
                          </p>
                        </div>

                        <p class="font-bold whitespace-nowrap">
                          {{
                            isFreeShippingUnlocked
                              ? "Free"
                              : formatCurrency(rate.cost)
                          }}
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                <p
                  v-if="errors.shippingDestination"
                  class="text-red-500 text-sm mt-2"
                >
                  {{ errors.shippingDestination }}
                </p>

                <p
                  v-if="errors.shippingMethod"
                  class="text-red-500 text-sm mt-2"
                >
                  {{ errors.shippingMethod }}
                </p>

                <!-- FREE SHIPPING PROGRESS -->
                <div
                  class="mt-5 bg-luxe-cream border border-luxe-sand/60 rounded-3xl p-5"
                >
                  <div class="flex items-center justify-between gap-4 mb-3">
                    <p class="text-sm font-semibold text-luxe-espresso">
                      Free Shipping Progress
                    </p>

                    <p class="text-xs text-luxe-brown/70">
                      {{ freeShippingProgress }}%
                    </p>
                  </div>

                  <div
                    class="w-full h-2 bg-luxe-ivory rounded-full overflow-hidden mb-3"
                  >
                    <div
                      class="h-full bg-luxe-espresso rounded-full transition-all duration-500"
                      :style="{ width: `${freeShippingProgress}%` }"
                    ></div>
                  </div>

                  <p class="text-sm text-luxe-brown/75 leading-6">
                    <span v-if="remainingForFreeShipping > 0">
                      Tambah {{ formatCurrency(remainingForFreeShipping) }} lagi
                      untuk mendapatkan gratis ongkir.
                    </span>

                    <span v-else>
                      Selamat, pesanan ini memenuhi syarat gratis ongkir.
                    </span>
                  </p>
                </div>
              </div>

              <!-- PAYMENT METHOD -->
              <div>
                <label class="block text-sm text-luxe-brown/75 mb-3">
                  Payment Method
                </label>

                <div
                  v-if="isLoadingPaymentMethods"
                  class="bg-luxe-cream border border-luxe-sand/60 rounded-3xl p-5 text-luxe-brown/75"
                >
                  Loading payment methods...
                </div>

                <div
                  v-else-if="paymentMethodError"
                  class="bg-red-50 border border-red-100 text-red-600 rounded-3xl p-5"
                >
                  {{ paymentMethodError }}
                </div>

                <div
                  v-else-if="paymentMethods.length === 0"
                  class="bg-luxe-cream border border-luxe-sand/60 rounded-3xl p-5 text-luxe-brown/75"
                >
                  No active payment method available. Please contact admin.
                </div>

                <div v-else>
                  <div class="grid sm:grid-cols-2 gap-4">
                    <button
                      v-for="method in paymentMethods"
                      :key="method.code"
                      type="button"
                      @click="form.paymentMethod = method.code"
                      :class="
                        form.paymentMethod === method.code
                          ? 'bg-luxe-espresso text-luxe-ivory shadow-lg shadow-luxe-brown/20'
                          : 'border border-luxe-sand bg-luxe-ivory text-luxe-espresso hover:border-luxe-royal hover:bg-luxe-cream'
                      "
                      class="rounded-2xl px-5 py-4 text-left transition"
                    >
                      <div class="flex items-start justify-between gap-4">
                        <div>
                          <p class="font-semibold">
                            {{ method.name }}
                          </p>

                          <!-- isi detail payment kamu lanjutkan di sini -->
                        </div>
                      </div>
                    </button>
                  </div>

                  <p
                    v-if="errors.paymentMethod"
                    class="text-red-500 text-sm mt-2"
                  >
                    {{ errors.paymentMethod }}
                  </p>
                </div>
              </div>

              <p v-if="regionError" class="text-red-500 text-sm md:col-span-2">
                {{ regionError }}
              </p>
            </form>
          </div>

          <!-- RIGHT -->
          <div>
            <div
              class="bg-luxe-ivory border border-luxe-sand/70 shadow-[0_24px_80px_rgba(92,56,36,0.16)] p-8 md:p-10 rounded-[2rem] sticky top-28"
            >
              <div class="flex items-center justify-between mb-10">
                <h2 class="text-3xl font-bold text-luxe-espresso">
                  Order Summary
                </h2>

                <span class="text-sm text-luxe-brown/70">
                  {{ cartStore.selectedTotalItems }} selected item
                </span>
              </div>

              <!-- ITEMS -->
              <div class="space-y-6 mb-10 max-h-[420px] overflow-y-auto pr-2">
                <div
                  v-for="item in cartStore.selectedItems"
                  :key="`${item.id}-${item.size}`"
                  class="flex items-center gap-5"
                >
                  <ProductImage
                    :src="item.image"
                    :alt="item.title"
                    class="w-24 h-24 object-cover rounded-2xl"
                  />

                  <div class="flex-1">
                    <h3 class="font-semibold leading-snug">
                      {{ item.title }}
                    </h3>

                    <p class="text-luxe-brown/70 text-sm mt-1">
                      Size: {{ item.size }}
                    </p>

                    <p class="text-luxe-brown/70 text-sm">
                      Qty: {{ item.quantity }}
                    </p>
                  </div>

                  <p class="font-bold text-right">
                    {{ formatCurrency(item.price * item.quantity) }}
                  </p>
                </div>
              </div>

              <!-- VOUCHER -->
              <div class="mb-8 border-t border-luxe-sand pt-6">
                <label class="block text-sm text-luxe-brown/75 mb-3">
                  Voucher Code
                </label>

                <div
                  v-if="!appliedVoucher"
                  class="flex flex-col sm:flex-row gap-3"
                >
                  <input
                    v-model="voucherCode"
                    @keyup.enter="applyVoucher"
                    type="text"
                    placeholder="Enter voucher code"
                    class="flex-1 border border-luxe-sand rounded-full px-5 py-4 outline-none focus:border-luxe-royal transition bg-luxe-ivory text-luxe-espresso placeholder:text-luxe-brown/50"
                  />

                  <button
                    @click="applyVoucher"
                    type="button"
                    class="bg-luxe-espresso text-luxe-ivory px-6 py-4 rounded-full hover:bg-luxe-royal hover:scale-105 transition"
                  >
                    Apply
                  </button>
                </div>

                <div
                  v-else
                  class="bg-luxe-ivory rounded-3xl p-5 flex items-start justify-between gap-4"
                >
                  <div>
                    <p class="font-semibold">
                      {{ appliedVoucher.code }}
                    </p>

                    <p class="text-sm text-luxe-brown/70 mt-1">
                      <span v-if="appliedVoucher.discountType === 'percentage'">
                        {{ appliedVoucher.discountValue }}% off
                      </span>

                      <span v-else>
                        {{ formatCurrency(appliedVoucher.discountAmount) }} off
                      </span>
                    </p>
                  </div>

                  <button
                    @click="removeVoucher"
                    type="button"
                    class="text-sm text-luxe-brown/60 hover:text-luxe-espresso transition"
                  >
                    Remove
                  </button>
                </div>

                <p v-if="voucherError" class="text-red-500 text-sm mt-3">
                  {{ voucherError }}
                </p>

                <p v-else class="text-luxe-brown/60 text-sm mt-3">
                  Try code:
                  <span class="font-semibold text-luxe-royal"> LRDISC10 </span>
                </p>
              </div>

              <!-- PRICE DETAIL -->
              <div class="space-y-4 border-t border-luxe-sand pt-6 mb-8">
                <div class="flex items-center justify-between">
                  <span class="text-luxe-brown/70">Subtotal</span>

                  <span class="font-semibold">
                    {{ formatCurrency(cartStore.selectedTotalPrice) }}
                  </span>
                </div>

                <div
                  v-if="discountAmount > 0"
                  class="flex items-center justify-between"
                >
                  <span class="text-luxe-brown/70">
                    Discount
                    <span v-if="appliedVoucher">
                      ({{ appliedVoucher.code }})
                    </span>
                  </span>

                  <span class="font-semibold text-green-600">
                    -{{ formatCurrency(discountAmount) }}
                  </span>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-luxe-brown/70">Shipping</span>

                  <span class="font-semibold">
                    {{ shippingLabel }}
                  </span>
                </div>

                <div
                  class="flex items-center justify-between text-xl pt-4 border-t border-luxe-sand"
                >
                  <span>Total</span>

                  <span class="text-3xl font-bold">
                    {{ formatCurrency(grandTotal) }}
                  </span>
                </div>
              </div>

              <!-- BUTTON -->
              <button
                @click="placeOrder"
                :disabled="!isFormValid || isSubmitting"
                :class="
                  isFormValid && !isSubmitting
                    ? 'bg-luxe-espresso text-luxe-ivory hover:bg-luxe-royal hover:scale-[1.02] shadow-lg shadow-luxe-brown/20'
                    : 'bg-luxe-sand/60 text-luxe-brown/60 cursor-not-allowed'
                "
                class="w-full py-5 rounded-full text-lg transition flex items-center justify-center gap-3"
              >
                <span
                  v-if="isSubmitting"
                  class="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"
                ></span>

                <span>
                  {{
                    isSubmitting
                      ? isUploadingPaymentProof
                        ? "Uploading Payment Proof..."
                        : "Processing Order..."
                      : "Place Order"
                  }}
                </span>
              </button>

              <p
                v-if="!isFormValid"
                class="text-center text-sm text-luxe-brown/60 mt-4"
              >
                Complete shipping information to place order.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";

import Navbar from "../components/layout/Navbar.vue";
import CartSidebar from "../components/layout/CartSidebar.vue";
import ProductImage from "../components/ui/ProductImage.vue";
import Footer from "../components/layout/Footer.vue";

import { useCartStore } from "../stores/cartStore";
import { useToastStore } from "../stores/toastStore";
import { useOrderStore } from "../stores/orderStore";
import { useAuthStore } from "../stores/authStore";

import { formatCurrency } from "../utils/formatCurrency";
import { voucherService } from "../services/voucherService";
import { orderService } from "../services/orderService";
import { paymentMethodService } from "../services/paymentMethodService";
import { shippingRateService } from "../services/shippingRateService";
import { regionService } from "../services/regionService";
import SearchableSelect from "../components/ui/SearchableSelect.vue";
import { userAddressService } from "../services/userAddressService";
import AddressSummaryCard from "../components/order/AddressSummaryCard.vue";

const router = useRouter();

const cartStore = useCartStore();
const toastStore = useToastStore();
const orderStore = useOrderStore();
const authStore = useAuthStore();

const errors = ref({});
const isSubmitting = ref(false);

const voucherCode = ref("");
const appliedVoucher = ref(null);
const voucherError = ref("");

const savedAddresses = ref([]);
const selectedAddressId = ref("");
const isLoadingAddresses = ref(false);
const addressBookError = ref("");

const saveAddressForNextOrder = ref(false);
const setAsPrimaryAddress = ref(false);
const isSavingAddress = ref(false);
const isAddressFormVisible = ref(false);

const normalizeAddressText = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
};

const getAddressSignature = (address) => {
  return [
    normalizeAddressText(address.provinceId || address.province_id),
    normalizeAddressText(address.cityId || address.city_id),
    normalizeAddressText(address.districtId || address.district_id),
    normalizeAddressText(address.villageId || address.village_id),
    normalizeAddressText(address.rt),
    normalizeAddressText(address.rw),
    normalizeAddressText(address.postalCode || address.postal_code),
    normalizeAddressText(address.addressDetail || address.address_detail),
    normalizeAddressText(address.phone),
    normalizeAddressText(address.recipientName || address.recipient_name),
  ].join("|");
};

const getCurrentAddressSignature = () => {
  return getAddressSignature({
    recipientName: form.fullName,
    phone: normalizePhoneNumber(form.phone),
    provinceId: form.provinceId,
    cityId: form.cityId,
    districtId: form.districtId,
    villageId: form.villageId,
    rt: form.rt,
    rw: form.rw,
    postalCode: form.postalCode,
    addressDetail: form.addressDetail,
  });
};

const resetAddressFormOnly = () => {
  selectedAddressId.value = "";

  form.addressLabel = "Rumah";

  form.provinceId = "";
  form.province = "";

  form.cityId = "";
  form.city = "";

  form.districtId = "";
  form.district = "";

  form.villageId = "";
  form.village = "";

  form.rt = "";
  form.rw = "";
  form.postalCode = "";
  form.addressDetail = "";

  cities.value = [];
  districts.value = [];
  villages.value = [];
};

const showChangeAddress = () => {
  isAddressFormVisible.value = true;
};

const useNewAddress = () => {
  resetAddressFormOnly();

  isAddressFormVisible.value = true;
  saveAddressForNextOrder.value = true;
  setAsPrimaryAddress.value = savedAddresses.value.length === 0;

  toastStore.showToast({
    title: "New Address",
    message: "Please fill in your new delivery address.",
    type: "info",
  });
};

const findDuplicateSavedAddress = () => {
  const currentSignature = getCurrentAddressSignature();

  return savedAddresses.value.find((address) => {
    return getAddressSignature(address) === currentSignature;
  });
};

const phoneWithoutCountryCode = (phone) => {
  return String(phone || "")
    .replace(/\D/g, "")
    .replace(/^62/, "")
    .replace(/^0+/, "");
};

const hasAddressFormValue = () => {
  return Boolean(
    form.provinceId ||
    form.cityId ||
    form.districtId ||
    form.villageId ||
    form.addressDetail.trim(),
  );
};

const addressToCustomer = (address) => {
  return {
    fullName: address.recipientName,
    phone: address.phone,
    address: [
      address.addressDetail,
      `Kel. ${address.village}`,
      `Kec. ${address.district}`,
      address.city,
      address.province,
      `RT ${address.rt}/RW ${address.rw}`,
      address.postalCode,
    ]
      .filter(Boolean)
      .join(", "),
    province: address.province,
    city: address.city,
    district: address.district,
    village: address.village,
    rt: address.rt,
    rw: address.rw,
    postalCode: address.postalCode,
    addressDetail: address.addressDetail,
  };
};

const buildAddressPayload = () => {
  return {
    label: form.addressLabel || "Rumah",
    recipient_name: form.fullName,
    phone: normalizePhoneNumber(form.phone),

    province_id: form.provinceId,
    province: form.province,

    city_id: form.cityId,
    city: form.city,

    district_id: form.districtId,
    district: form.district,

    village_id: form.villageId,
    village: form.village,

    rt: form.rt,
    rw: form.rw,
    postal_code: form.postalCode,
    address_detail: form.addressDetail,

    is_primary: setAsPrimaryAddress.value,
  };
};

const applySavedAddress = async (address) => {
  if (!address) return;

  selectedAddressId.value = String(address.id);

  form.addressLabel = address.label || "Rumah";
  form.fullName = address.recipientName || form.fullName;
  form.phone = phoneWithoutCountryCode(address.phone);

  form.provinceId = address.provinceId || "";
  form.province = address.province || "";

  form.cityId = "";
  form.city = "";
  form.districtId = "";
  form.district = "";
  form.villageId = "";
  form.village = "";

  cities.value = [];
  districts.value = [];
  villages.value = [];

  if (form.provinceId) {
    await loadCities(form.provinceId);
  }

  form.cityId = address.cityId || "";
  form.city = address.city || "";

  if (form.cityId) {
    await loadDistricts(form.cityId);
  }

  form.districtId = address.districtId || "";
  form.district = address.district || "";

  if (form.districtId) {
    await loadVillages(form.districtId);
  }

  form.villageId = address.villageId || "";
  form.village = address.village || "";

  form.rt = address.rt || "";
  form.rw = address.rw || "";
  form.postalCode = address.postalCode || "";
  form.addressDetail = address.addressDetail || "";

  saveAddressForNextOrder.value = false;
  setAsPrimaryAddress.value = false;
  isAddressFormVisible.value = false;

  toastStore.showToast({
    title: "Address Selected",
    message: `${address.label} has been applied to checkout.`,
    type: "success",
  });
};

const loadSavedAddresses = async () => {
  if (!authStore.token) return;

  isLoadingAddresses.value = true;
  addressBookError.value = "";

  try {
    savedAddresses.value = await userAddressService.getAddresses();

    const primaryAddress =
      savedAddresses.value.find((address) => address.isPrimary) ||
      savedAddresses.value[0];

    if (primaryAddress && !hasAddressFormValue()) {
      await applySavedAddress(primaryAddress);
      isAddressFormVisible.value = false;
    }

    if (!primaryAddress) {
      isAddressFormVisible.value = true;
    }

    if (savedAddresses.value.length === 0) {
      saveAddressForNextOrder.value = true;
      setAsPrimaryAddress.value = true;
      isAddressFormVisible.value = true;
    }

    if (savedAddresses.value.length === 0) {
      saveAddressForNextOrder.value = true;
      setAsPrimaryAddress.value = true;
    }
  } catch (error) {
    if (error?.status === 401) {
      authStore.clearAuth();

      savedAddresses.value = [];
      selectedAddressId.value = "";
      saveAddressForNextOrder.value = false;
      setAsPrimaryAddress.value = false;
      addressBookError.value = "";

      toastStore.showToast({
        title: "Session Expired",
        message: "Please login again to use your saved addresses.",
        type: "info",
      });

      return;
    }

    addressBookError.value =
      error?.message || "Failed to load saved addresses.";
  } finally {
    isLoadingAddresses.value = false;
  }
};

const saveCurrentAddressToBook = async () => {
  if (!authStore.token || !saveAddressForNextOrder.value) return;

  const duplicateAddress = findDuplicateSavedAddress();

  if (duplicateAddress) {
    selectedAddressId.value = String(duplicateAddress.id);

    if (setAsPrimaryAddress.value && !duplicateAddress.isPrimary) {
      try {
        await userAddressService.setPrimaryAddress(duplicateAddress.id);

        savedAddresses.value = savedAddresses.value.map((address) => ({
          ...address,
          isPrimary: String(address.id) === String(duplicateAddress.id),
        }));
      } catch (error) {
        toastStore.showToast({
          title: "Primary Address Not Updated",
          message:
            "Order was created, but primary address could not be updated.",
          type: "info",
        });
      }
    }

    return;
  }

  isSavingAddress.value = true;

  try {
    const savedAddress = await userAddressService.createAddress(
      buildAddressPayload(),
    );

    if (savedAddress) {
      savedAddresses.value.unshift(savedAddress);
      selectedAddressId.value = String(savedAddress.id);
    }

    toastStore.showToast({
      title: "Address Saved",
      message: "This address has been saved to your address book.",
      type: "success",
    });
  } catch (error) {
    toastStore.showToast({
      title: "Address Not Saved",
      message:
        error?.message ||
        "Your order was created, but this address could not be saved.",
      type: "info",
    });
  } finally {
    isSavingAddress.value = false;
  }
};

const markAddressAsCustom = () => {
  if (selectedAddressId.value) {
    selectedAddressId.value = "";
    saveAddressForNextOrder.value = true;
  }

  isAddressFormVisible.value = true;
};

const FREE_SHIPPING_TARGET = 2000000;

const form = reactive({
  fullName: "",
  email: "",
  phone: "",

  addressLabel: "Rumah",

  provinceId: "",
  province: "",

  cityId: "",
  city: "",

  districtId: "",
  district: "",

  villageId: "",
  village: "",

  rt: "",
  rw: "",
  postalCode: "",
  addressDetail: "",

  shippingMethod: "standard",
  paymentMethod: "",
});

/*
|--------------------------------------------------------------------------
| Checkout Draft Autosave
|--------------------------------------------------------------------------
*/

const CHECKOUT_DRAFT_PREFIX = "checkoutFormDraft";

const getCheckoutDraftKey = () => {
  const userId = authStore.user?.id || "guest";
  return `${CHECKOUT_DRAFT_PREFIX}:user:${userId}`;
};

const checkoutDraftFields = [
  "fullName",
  "email",
  "phone",

  "addressLabel",

  "provinceId",
  "province",

  "cityId",
  "city",

  "districtId",
  "district",

  "villageId",
  "village",

  "rt",
  "rw",
  "postalCode",
  "addressDetail",
  "shippingMethod",
  "paymentMethod",
];

const saveCheckoutDraft = () => {
  const draft = {};

  checkoutDraftFields.forEach((field) => {
    draft[field] = form[field];
  });

  sessionStorage.setItem(getCheckoutDraftKey(), JSON.stringify(draft));
};

const loadCheckoutDraft = () => {
  try {
    const savedDraft = sessionStorage.getItem(getCheckoutDraftKey());

    if (!savedDraft) return;

    const draft = JSON.parse(savedDraft);

    checkoutDraftFields.forEach((field) => {
      if (draft[field] !== undefined) {
        form[field] = draft[field];
      }
    });
  } catch (error) {
    console.error("Failed to load checkout draft:", error);
  }
};

const clearCheckoutDraft = () => {
  sessionStorage.removeItem(getCheckoutDraftKey());
};

watch(
  form,
  () => {
    saveCheckoutDraft();
  },
  {
    deep: true,
  },
);

/*
|--------------------------------------------------------------------------
| RajaOngkir Shipping
|--------------------------------------------------------------------------
*/

const shippingDestinationKeyword = ref("");
const shippingDestinations = ref([]);
const selectedShippingDestination = ref(null);

const shippingRates = ref([]);
const selectedShippingRateId = ref("");
const totalShippingWeightGram = ref(0);

const isSearchingDestinations = ref(false);
const isLoadingShippingRates = ref(false);

const shippingDestinationError = ref("");
const shippingRateError = ref("");

const buildShippingItems = () => {
  return cartStore.selectedItems.map((item) => ({
    product_id: item.product_id || item.productId || item.id,
    slug: item.slug || null,
    size: item.size || null,
    quantity: Number(item.quantity || 1),
  }));
};

const selectedShippingMethod = computed(() => {
  return (
    shippingRates.value.find(
      (rate) => rate.id === selectedShippingRateId.value,
    ) || null
  );
});

const searchShippingDestinations = async () => {
  shippingDestinationError.value = "";
  shippingDestinations.value = [];

  const keyword = shippingDestinationKeyword.value.trim();

  if (keyword.length < 3) {
    shippingDestinationError.value =
      "Masukkan minimal 3 karakter untuk mencari tujuan ongkir.";
    return;
  }

  isSearchingDestinations.value = true;

  try {
    shippingDestinations.value = await shippingRateService.searchDestinations(
      keyword,
      10,
    );

    if (shippingDestinations.value.length === 0) {
      shippingDestinationError.value =
        "Tujuan ongkir tidak ditemukan. Coba gunakan nama kecamatan atau kota.";
    }
  } catch (error) {
    shippingDestinationError.value =
      error?.message || "Gagal mencari tujuan ongkir.";
  } finally {
    isSearchingDestinations.value = false;
  }
};

const normalizeShippingText = (value) => {
  return String(value || "")
    .toUpperCase()
    .replace(/^KABUPATEN\s+/i, "")
    .replace(/^KOTA\s+/i, "")
    .replace(/\s+/g, " ")
    .trim();
};

const hasCompleteShippingAddress = computed(() => {
  return Boolean(
    form.province?.trim() &&
    form.city?.trim() &&
    form.district?.trim() &&
    form.village?.trim(),
  );
});

const getShippingAddressSignature = () => {
  return [
    normalizeShippingText(form.province),
    normalizeShippingText(form.city),
    normalizeShippingText(form.district),
    normalizeShippingText(form.village),
    normalizeShippingText(form.postalCode),
  ].join("|");
};

const buildShippingDestinationKeyword = () => {
  return [
    form.village,
    form.district,
    form.city,
    form.province,
    form.postalCode,
  ]
    .filter(Boolean)
    .join(" ");
};

const findBestShippingDestination = (destinations) => {
  const province = normalizeShippingText(form.province);
  const city = normalizeShippingText(form.city);
  const district = normalizeShippingText(form.district);
  const village = normalizeShippingText(form.village);

  const matchValue = (value, target) => {
    const normalizedValue = normalizeShippingText(value);
    const normalizedTarget = normalizeShippingText(target);

    return (
      normalizedValue === normalizedTarget ||
      normalizedValue.includes(normalizedTarget) ||
      normalizedTarget.includes(normalizedValue)
    );
  };

  return (
    destinations.find((destination) => {
      return (
        matchValue(destination.provinceName, province) &&
        matchValue(destination.cityName, city) &&
        matchValue(destination.districtName, district) &&
        matchValue(destination.subdistrictName || destination.label, village)
      );
    }) ||
    destinations.find((destination) => {
      return (
        matchValue(destination.provinceName, province) &&
        matchValue(destination.cityName, city) &&
        matchValue(destination.districtName, district)
      );
    }) ||
    destinations.find((destination) => {
      return (
        matchValue(destination.cityName, city) &&
        matchValue(destination.districtName, district)
      );
    }) ||
    destinations[0] ||
    null
  );
};

const lastResolvedShippingAddressSignature = ref("");

const useAddressAsShippingSearch = async () => {
  shippingDestinationError.value = "";
  shippingRateError.value = "";

  if (!hasCompleteShippingAddress.value) {
    shippingDestinationError.value =
      "Lengkapi provinsi, kota, kecamatan, dan kelurahan terlebih dahulu.";
    return;
  }

  const currentSignature = getShippingAddressSignature();

  if (
    selectedShippingDestination.value?.id &&
    lastResolvedShippingAddressSignature.value === currentSignature
  ) {
    return;
  }

  const keyword = buildShippingDestinationKeyword();

  shippingDestinationKeyword.value = keyword;
  shippingDestinations.value = [];
  shippingRates.value = [];
  selectedShippingRateId.value = "";
  selectedShippingDestination.value = null;
  totalShippingWeightGram.value = 0;

  isSearchingDestinations.value = true;

  try {
    const destinations = await shippingRateService.searchDestinations(
      keyword,
      10,
    );

    if (destinations.length === 0) {
      shippingDestinationError.value =
        "Tujuan ongkir tidak ditemukan dari alamat ini. Coba periksa kembali kelurahan atau kecamatan.";
      return;
    }

    const bestDestination = findBestShippingDestination(destinations);

    if (!bestDestination) {
      shippingDestinations.value = destinations;
      shippingDestinationError.value =
        "Ada beberapa hasil tujuan. Pilih alamat yang paling sesuai.";
      return;
    }

    lastResolvedShippingAddressSignature.value = currentSignature;

    await selectShippingDestination(bestDestination);
  } catch (error) {
    shippingDestinationError.value =
      error?.message || "Gagal mencari tujuan ongkir dari alamat.";
  } finally {
    isSearchingDestinations.value = false;
  }
};

const selectShippingDestination = async (destination) => {
  selectedShippingDestination.value = destination;
  shippingDestinationKeyword.value = destination.label;

  shippingDestinations.value = [];
  shippingRates.value = [];
  selectedShippingRateId.value = "";
  totalShippingWeightGram.value = 0;
  shippingRateError.value = "";

  await loadShippingRates();
};

const loadShippingRates = async () => {
  shippingRateError.value = "";
  shippingRates.value = [];
  selectedShippingRateId.value = "";
  totalShippingWeightGram.value = 0;

  if (!selectedShippingDestination.value?.id) {
    shippingRateError.value = "Pilih tujuan ongkir terlebih dahulu.";
    return;
  }

  if (!cartStore.hasSelectedItems) {
    shippingRateError.value = "Pilih item checkout terlebih dahulu.";
    return;
  }

  isLoadingShippingRates.value = true;

  try {
    const result = await shippingRateService.getRates(
      selectedShippingDestination.value.id,
      buildShippingItems(),
    );

    shippingRates.value = result.rates;
    totalShippingWeightGram.value = result.totalWeightGram;

    if (shippingRates.value.length > 0) {
      selectedShippingRateId.value = shippingRates.value[0].id;
    } else {
      shippingRateError.value =
        "Tidak ada layanan ongkir tersedia untuk tujuan ini.";
    }
  } catch (error) {
    shippingRateError.value = error?.message || "Gagal menghitung ongkir.";
  } finally {
    isLoadingShippingRates.value = false;
  }
};

const isFreeShippingUnlocked = computed(() => {
  return cartStore.selectedTotalPrice >= FREE_SHIPPING_TARGET;
});

const remainingForFreeShipping = computed(() => {
  return Math.max(FREE_SHIPPING_TARGET - cartStore.selectedTotalPrice, 0);
});

const freeShippingProgress = computed(() => {
  if (cartStore.selectedTotalPrice <= 0) return 0;

  return Math.min(
    Math.round((cartStore.selectedTotalPrice / FREE_SHIPPING_TARGET) * 100),
    100,
  );
});

const shippingCost = computed(() => {
  if (!selectedShippingMethod.value) return 0;

  if (isFreeShippingUnlocked.value) return 0;

  return Number(selectedShippingMethod.value.cost || 0);
});

const shippingLabel = computed(() => {
  if (!selectedShippingMethod.value) return "-";

  return shippingCost.value === 0 ? "Free" : formatCurrency(shippingCost.value);
});

watch(
  () =>
    cartStore.selectedItems
      .map((item) => `${item.id}-${item.size}-${item.quantity}`)
      .join("|"),
  async () => {
    if (selectedShippingDestination.value?.id) {
      await loadShippingRates();
    }
  },
);

let shippingAddressSearchTimer = null;

watch(
  () =>
    [
      form.province,
      form.city,
      form.district,
      form.village,
      form.postalCode,
    ].join("|"),
  () => {
    if (!hasCompleteShippingAddress.value || !cartStore.hasSelectedItems) {
      return;
    }

    if (shippingAddressSearchTimer) {
      clearTimeout(shippingAddressSearchTimer);
    }

    shippingAddressSearchTimer = setTimeout(() => {
      useAddressAsShippingSearch();
    }, 700);
  },
);

/*
|--------------------------------------------------------------------------
| Payment Methods
|--------------------------------------------------------------------------
*/

const paymentMethods = ref([]);
const paymentProofFile = ref(null);
const paymentProofPreview = ref("");
const paymentProofError = ref("");
const isUploadingPaymentProof = ref(false);
const provinces = ref([]);
const cities = ref([]);
const districts = ref([]);
const villages = ref([]);

const isLoadingProvinces = ref(false);
const isLoadingCities = ref(false);
const isLoadingDistricts = ref(false);
const isLoadingVillages = ref(false);

const regionError = ref("");
const isLoadingPaymentMethods = ref(false);
const paymentMethodError = ref("");

const findRegionName = (items, id) => {
  return items.find((item) => item.id === String(id))?.name || "";
};

const loadProvinces = async () => {
  isLoadingProvinces.value = true;
  regionError.value = "";

  try {
    provinces.value = await regionService.getProvinces();
  } catch (error) {
    regionError.value = error?.message || "Failed to load provinces.";
  } finally {
    isLoadingProvinces.value = false;
  }
};

const loadCities = async (provinceId) => {
  cities.value = [];
  districts.value = [];
  villages.value = [];

  if (!provinceId) return;

  isLoadingCities.value = true;
  regionError.value = "";

  try {
    cities.value = await regionService.getCities(provinceId);
  } catch (error) {
    regionError.value = error?.message || "Failed to load cities.";
  } finally {
    isLoadingCities.value = false;
  }
};

const loadDistricts = async (cityId) => {
  districts.value = [];
  villages.value = [];

  if (!cityId) return;

  isLoadingDistricts.value = true;
  regionError.value = "";

  try {
    districts.value = await regionService.getDistricts(cityId);
  } catch (error) {
    regionError.value = error?.message || "Failed to load districts.";
  } finally {
    isLoadingDistricts.value = false;
  }
};

const loadVillages = async (districtId) => {
  villages.value = [];

  if (!districtId) return;

  isLoadingVillages.value = true;
  regionError.value = "";

  try {
    villages.value = await regionService.getVillages(districtId);
  } catch (error) {
    regionError.value = error?.message || "Failed to load villages.";
  } finally {
    isLoadingVillages.value = false;
  }
};

const handleProvinceChange = async () => {
  markAddressAsCustom();
  form.province = findRegionName(provinces.value, form.provinceId);

  form.cityId = "";
  form.city = "";
  form.districtId = "";
  form.district = "";
  form.villageId = "";
  form.village = "";

  await loadCities(form.provinceId);
};

const handleCityChange = async () => {
  markAddressAsCustom();
  form.city = findRegionName(cities.value, form.cityId);

  form.districtId = "";
  form.district = "";
  form.villageId = "";
  form.village = "";

  await loadDistricts(form.cityId);
};

const handleDistrictChange = async () => {
  markAddressAsCustom();
  form.district = findRegionName(districts.value, form.districtId);

  form.villageId = "";
  form.village = "";

  await loadVillages(form.districtId);
};

const handleVillageChange = () => {
  markAddressAsCustom();
  form.village = findRegionName(villages.value, form.villageId);
};

const selectedPaymentMethod = computed(() => {
  return (
    paymentMethods.value.find((method) => method.code === form.paymentMethod) ||
    null
  );
});

const handlePaymentProofChange = (event) => {
  const file = event.target.files?.[0];

  event.target.value = "";

  paymentProofError.value = "";
  paymentProofFile.value = null;
  paymentProofPreview.value = "";

  if (!file) return;

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];

  if (!allowedTypes.includes(file.type)) {
    paymentProofError.value = "Payment proof must be JPG, PNG, WEBP, or PDF.";

    toastStore.showToast({
      title: "Invalid File",
      message: paymentProofError.value,
      type: "error",
    });

    return;
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    paymentProofError.value = "Maximum payment proof size is 5 MB.";

    toastStore.showToast({
      title: "File Too Large",
      message: paymentProofError.value,
      type: "error",
    });

    return;
  }

  paymentProofFile.value = file;

  if (file.type.startsWith("image/")) {
    paymentProofPreview.value = URL.createObjectURL(file);
  }
};

const removePaymentProof = () => {
  paymentProofFile.value = null;
  paymentProofPreview.value = "";
  paymentProofError.value = "";
};

const loadPaymentMethods = async () => {
  isLoadingPaymentMethods.value = true;
  paymentMethodError.value = "";

  try {
    paymentMethods.value = await paymentMethodService.getActivePaymentMethods();

    const selectedMethodStillExists = paymentMethods.value.some(
      (method) => method.code === form.paymentMethod,
    );

    if (form.paymentMethod && !selectedMethodStillExists) {
      form.paymentMethod = "";
    }
  } catch (error) {
    console.error("Failed to load payment methods:", error);

    paymentMethodError.value =
      error?.message || "Failed to load payment methods.";
  } finally {
    isLoadingPaymentMethods.value = false;
  }
};

/*
|--------------------------------------------------------------------------
| Totals
|--------------------------------------------------------------------------
*/

const discountAmount = computed(() => {
  if (!appliedVoucher.value) return 0;

  return Number(appliedVoucher.value.discountAmount || 0);
});

const grandTotal = computed(() => {
  return Math.max(
    cartStore.selectedTotalPrice - discountAmount.value + shippingCost.value,
    0,
  );
});

/*
|--------------------------------------------------------------------------
| Form Validation
|--------------------------------------------------------------------------
*/

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isFormValid = computed(() => {
  return (
    form.fullName.trim() !== "" &&
    isValidEmail(form.email) &&
    form.phone.trim() !== "" &&
    form.phone.length >= 8 &&
    form.province.trim() !== "" &&
    form.city.trim() !== "" &&
    form.district.trim() !== "" &&
    form.village.trim() !== "" &&
    form.rt.trim() !== "" &&
    form.rw.trim() !== "" &&
    form.postalCode.trim() !== "" &&
    form.addressDetail.trim() !== "" &&
    Boolean(selectedShippingDestination.value?.id) &&
    Boolean(selectedShippingMethod.value) &&
    String(form.paymentMethod || "").trim() !== "" &&
    !cartStore.isEmpty &&
    cartStore.hasSelectedItems
  );
});

const normalizePhoneNumber = (phone) => {
  const digits = String(phone || "")
    .replace(/\D/g, "")
    .replace(/^0+/, "");

  return `62${digits}`;
};

const handlePhoneInput = () => {
  form.phone = String(form.phone || "")
    .replace(/\D/g, "")
    .replace(/^0+/, "");
};

const handleNumericInput = (field) => {
  form[field] = String(form[field] || "").replace(/\D/g, "");
};

const buildFullAddress = () => {
  return [
    form.addressDetail,
    `Kel. ${form.village}`,
    `Kec. ${form.district}`,
    form.city,
    form.province,
    `RT ${form.rt}/RW ${form.rw}`,
    form.postalCode,
  ]
    .filter(Boolean)
    .join(", ");
};

const validateForm = () => {
  const validationErrors = {};

  if (!form.fullName.trim()) {
    validationErrors.fullName = "Full name is required.";
  }

  if (!form.email.trim()) {
    validationErrors.email = "Email address is required.";
  } else if (!isValidEmail(form.email)) {
    validationErrors.email = "Please enter a valid email address.";
  }

  if (!form.phone.trim()) {
    validationErrors.phone = "Phone number is required.";
  } else if (form.phone.length < 8) {
    validationErrors.phone = "Phone number is too short.";
  }

  if (!form.province.trim()) {
    validationErrors.province = "Province is required.";
  }

  if (!form.city.trim()) {
    validationErrors.city = "City or regency is required.";
  }

  if (!form.district.trim()) {
    validationErrors.district = "District is required.";
  }

  if (!form.village.trim()) {
    validationErrors.village = "Village is required.";
  }

  if (!form.rt.trim()) {
    validationErrors.rt = "RT is required.";
  }

  if (!form.rw.trim()) {
    validationErrors.rw = "RW is required.";
  }

  if (!form.postalCode.trim()) {
    validationErrors.postalCode = "Postal code is required.";
  }

  if (!form.addressDetail.trim()) {
    validationErrors.addressDetail = "Address detail is required.";
  }

  if (!selectedShippingDestination.value?.id) {
    validationErrors.shippingDestination = "Tujuan ongkir wajib dipilih.";
  }

  if (!selectedShippingMethod.value) {
    validationErrors.shippingMethod = "Layanan ongkir wajib dipilih.";
  }

  if (!form.paymentMethod) {
    validationErrors.paymentMethod = "Payment method is required.";
  }

  errors.value = validationErrors;

  return Object.keys(validationErrors).length === 0;
};

/*
|--------------------------------------------------------------------------
| Voucher
|--------------------------------------------------------------------------
*/

const applyVoucher = async () => {
  voucherError.value = "";

  if (!voucherCode.value.trim()) {
    voucherError.value = "Please enter voucher code.";
    return;
  }

  if (cartStore.selectedTotalPrice <= 0) {
    voucherError.value = "Voucher can only be used when selected item exists.";
    return;
  }

  try {
    const voucher = await voucherService.validateVoucher(
      voucherCode.value,
      cartStore.selectedTotalPrice,
    );

    appliedVoucher.value = voucher;
    voucherCode.value = voucher.code;
    voucherError.value = "";

    toastStore.showToast({
      title: "Voucher Applied",
      message: `${voucher.code} has been applied successfully.`,
      type: "success",
    });
  } catch (error) {
    appliedVoucher.value = null;
    voucherError.value = error?.message || "Invalid voucher code.";

    toastStore.showToast({
      title: "Invalid Voucher",
      message: error?.message || "The voucher code you entered is not valid.",
      type: "error",
    });
  }
};

const removeVoucher = () => {
  appliedVoucher.value = null;
  voucherCode.value = "";
  voucherError.value = "";

  toastStore.showToast({
    title: "Voucher Removed",
    message: "Your voucher has been removed from this order.",
    type: "info",
  });
};

/*
|--------------------------------------------------------------------------
| Place Order
|--------------------------------------------------------------------------
*/

const generateOrderNumber = () => {
  return `LXZ-${Date.now().toString().slice(-6)}`;
};

const placeOrder = async () => {
  if (isSubmitting.value) return;

  const isValid = validateForm();

  if (!isValid || cartStore.isEmpty || !cartStore.hasSelectedItems) return;

  if (!form.paymentMethod) {
    toastStore.showToast({
      title: "Payment Method Required",
      message: "Please select a payment method before placing your order.",
      type: "error",
    });

    return;
  }

  isSubmitting.value = true;

  try {
    const fullAddress = buildFullAddress();

    let paymentProofUrl = "";

    if (paymentProofFile.value) {
      isUploadingPaymentProof.value = true;

      const uploadedProof = await orderService.uploadPaymentProof(
        paymentProofFile.value,
      );

      paymentProofUrl = uploadedProof?.payment_proof_url || "";
    }

    const orderPayload = {
      customer_name: form.fullName,
      customer_email: form.email,
      customer_phone: normalizePhoneNumber(form.phone),
      customer_address: fullAddress,

      customer_province: form.province,
      customer_city: form.city,
      customer_district: form.district,
      customer_village: form.village,
      customer_rt: form.rt,
      customer_rw: form.rw,
      customer_postal_code: form.postalCode,
      customer_address_detail: form.addressDetail,

      shipping_method: selectedShippingMethod.value?.id || "",
      shipping_destination_id: selectedShippingDestination.value?.id || null,
      shipping_destination_label:
        selectedShippingDestination.value?.label || null,
      shipping_courier: selectedShippingMethod.value?.code || null,
      shipping_service: selectedShippingMethod.value?.service || null,

      payment_method_code: form.paymentMethod,
      voucher_code: appliedVoucher.value ? appliedVoucher.value.code : null,

      items: cartStore.selectedItems.map((item) => ({
        product_id: item.product_id || item.productId || item.id,
        slug: item.slug || null,
        size: item.size || null,
        quantity: Number(item.quantity || 1),
      })),
    };

    const createdOrder = await orderService.createOrder(orderPayload);

    await saveCurrentAddressToBook();

    const order = {
      orderNumber:
        createdOrder?.order_code ||
        createdOrder?.order?.order_code ||
        generateOrderNumber(),

      customer: {
        fullName: form.fullName,
        email: form.email,
        phone: normalizePhoneNumber(form.phone),
        address: fullAddress,
        province: form.province,
        city: form.city,
        district: form.district,
        village: form.village,
        rt: form.rt,
        rw: form.rw,
        postalCode: form.postalCode,
        addressDetail: form.addressDetail,
      },

      shippingMethod: selectedShippingMethod.value?.id || "",
      shippingMethodLabel: selectedShippingMethod.value?.label || "",
      shippingDestination: selectedShippingDestination.value,
      shippingRate: selectedShippingMethod.value,

      shippingCourier: selectedShippingMethod.value?.code || "",
      shippingService: selectedShippingMethod.value?.service || "",
      shippingEtd: selectedShippingMethod.value?.etd || "",
      shippingDestinationLabel: selectedShippingDestination.value?.label || "",

      paymentMethod: form.paymentMethod,
      paymentMethodData: selectedPaymentMethod.value,
      paymentProofUrl,
      paymentProofUploadedAt: paymentProofUrl ? new Date().toISOString() : null,
      hasPaymentProof: Boolean(paymentProofUrl),

      items: cartStore.selectedItems,

      subtotal: cartStore.selectedTotalPrice,

      voucher: appliedVoucher.value
        ? {
            code: appliedVoucher.value.code,
            label: appliedVoucher.value.label,
            discountType: appliedVoucher.value.discountType,
            discountValue: appliedVoucher.value.discountValue,
            discountAmount: appliedVoucher.value.discountAmount,
          }
        : null,

      discountAmount: discountAmount.value,
      freeShippingUnlocked: isFreeShippingUnlocked.value,
      shippingCost: shippingCost.value,
      total: grandTotal.value,
      status: createdOrder?.status || createdOrder?.order?.status || "pending",
      backendOrder: createdOrder,
      createdAt: new Date().toISOString(),
    };

    sessionStorage.setItem("lastOrder", JSON.stringify(order));

    clearCheckoutDraft();

    orderStore.addOrder(order);

    cartStore.removeSelectedItems();

    toastStore.showToast({
      title: "Order Placed",
      message: `Order ${order.orderNumber} has been created successfully.`,
      type: "success",
      duration: 3500,
    });

    router.push("/checkout/success");
  } catch (error) {
    const stockError = error?.data || error?.response?.data?.data || null;

    if (
      error?.message?.toLowerCase().includes("insufficient stock") &&
      stockError?.product_id
    ) {
      cartStore.removeItem(stockError.product_id, stockError.size);

      toastStore.showToast({
        title: "Stock Not Available",
        message: `${stockError.product_name} size ${stockError.size} is out of stock and has been removed from your cart.`,
        type: "error",
        duration: 5000,
      });

      return;
    }

    toastStore.showToast({
      title: "Order Failed",
      message: error?.message || "Failed to create order. Please try again.",
      type: "error",
      duration: 4000,
    });
  } finally {
    isSubmitting.value = false;
    isUploadingPaymentProof.value = false;
  }
};

/*
|--------------------------------------------------------------------------
| Lifecycle
|--------------------------------------------------------------------------
*/

onMounted(async () => {
  loadCheckoutDraft();

  await loadProvinces();

  if (form.provinceId) {
    await loadCities(form.provinceId);
  }

  if (form.cityId) {
    await loadDistricts(form.cityId);
  }

  if (form.districtId) {
    await loadVillages(form.districtId);
  }

  await loadSavedAddresses();
  await useAddressAsShippingSearch();
  await loadPaymentMethods();
});
</script>
