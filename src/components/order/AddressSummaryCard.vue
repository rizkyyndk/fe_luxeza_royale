<template>
  <div
    class="bg-luxe-cream border border-luxe-sand/70 rounded-[2rem] p-5 md:p-6"
  >
    <div class="mb-5">
      <p class="uppercase tracking-[3px] text-xs text-luxe-brown/70 mb-2">
        {{ eyebrow }}
      </p>

      <h3 class="text-2xl font-bold text-luxe-espresso">
        {{ title }}
      </h3>
    </div>

    <div class="grid sm:grid-cols-2 gap-4 mb-5">
      <div v-if="customer.fullName">
        <p class="text-xs uppercase tracking-[2px] text-luxe-brown/55 mb-1">
          Recipient
        </p>
        <p class="font-semibold text-luxe-espresso">
          {{ customer.fullName }}
        </p>
      </div>

      <div v-if="customer.phone">
        <p class="text-xs uppercase tracking-[2px] text-luxe-brown/55 mb-1">
          Phone
        </p>
        <p class="font-semibold text-luxe-espresso">
          {{ phoneLabel }}
        </p>
      </div>

      <div v-if="customer.email" class="sm:col-span-2">
        <p class="text-xs uppercase tracking-[2px] text-luxe-brown/55 mb-1">
          Email
        </p>
        <p class="font-semibold text-luxe-espresso break-all">
          {{ customer.email }}
        </p>
      </div>
    </div>

    <div
      v-if="hasDetailedAddress"
      class="bg-luxe-ivory border border-luxe-sand/70 rounded-3xl p-5 space-y-3"
    >
      <div v-if="customer.addressDetail">
        <p class="text-xs uppercase tracking-[2px] text-luxe-brown/55 mb-1">
          Address Detail
        </p>
        <p class="text-luxe-espresso leading-7">
          {{ customer.addressDetail }}
        </p>
      </div>

      <div class="grid sm:grid-cols-2 gap-4">
        <div v-if="customer.village">
          <p class="text-xs uppercase tracking-[2px] text-luxe-brown/55 mb-1">
            Village
          </p>
          <p class="font-medium text-luxe-espresso">
            {{ customer.village }}
          </p>
        </div>

        <div v-if="customer.district">
          <p class="text-xs uppercase tracking-[2px] text-luxe-brown/55 mb-1">
            District
          </p>
          <p class="font-medium text-luxe-espresso">
            {{ customer.district }}
          </p>
        </div>

        <div v-if="customer.city">
          <p class="text-xs uppercase tracking-[2px] text-luxe-brown/55 mb-1">
            City / Regency
          </p>
          <p class="font-medium text-luxe-espresso">
            {{ customer.city }}
          </p>
        </div>

        <div v-if="customer.province">
          <p class="text-xs uppercase tracking-[2px] text-luxe-brown/55 mb-1">
            Province
          </p>
          <p class="font-medium text-luxe-espresso">
            {{ customer.province }}
          </p>
        </div>

        <div v-if="customer.rt || customer.rw">
          <p class="text-xs uppercase tracking-[2px] text-luxe-brown/55 mb-1">
            RT / RW
          </p>
          <p class="font-medium text-luxe-espresso">
            RT {{ customer.rt || "-" }} / RW {{ customer.rw || "-" }}
          </p>
        </div>

        <div v-if="customer.postalCode">
          <p class="text-xs uppercase tracking-[2px] text-luxe-brown/55 mb-1">
            Postal Code
          </p>
          <p class="font-medium text-luxe-espresso">
            {{ customer.postalCode }}
          </p>
        </div>
      </div>
    </div>

    <div
      v-else-if="customer.address"
      class="bg-luxe-ivory border border-luxe-sand/70 rounded-3xl p-5"
    >
      <p class="text-xs uppercase tracking-[2px] text-luxe-brown/55 mb-1">
        Address
      </p>

      <p class="text-luxe-espresso leading-7">
        {{ customer.address }}
      </p>
    </div>

    <div
      v-else
      class="bg-luxe-ivory border border-luxe-sand/70 rounded-3xl p-5 text-luxe-brown/65"
    >
      Address information is not available.
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  customer: {
    type: Object,
    default: () => ({}),
  },
  title: {
    type: String,
    default: "Shipping Address",
  },
  eyebrow: {
    type: String,
    default: "Delivery Information",
  },
});

const hasDetailedAddress = computed(() => {
  return Boolean(
    props.customer.province ||
    props.customer.city ||
    props.customer.district ||
    props.customer.village ||
    props.customer.rt ||
    props.customer.rw ||
    props.customer.postalCode ||
    props.customer.addressDetail,
  );
});

const phoneLabel = computed(() => {
  const phone = String(props.customer.phone || "");

  if (!phone) return "";

  if (phone.startsWith("62")) {
    return `+${phone}`;
  }

  return phone;
});
</script>
