<template>
  <div
    class="fixed top-24 right-6 z-[999] space-y-4 w-[calc(100%-3rem)] sm:w-[380px]"
  >
    <TransitionGroup name="toast">
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        :class="toastStyle(toast.type)"
        class="rounded-3xl shadow-2xl border p-5 bg-white flex items-start gap-4"
      >
        <!-- ICON -->
        <div
          :class="iconStyle(toast.type)"
          class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        >
          <span>
            {{ toastIcon(toast.type) }}
          </span>
        </div>

        <!-- CONTENT -->
        <div class="flex-1">
          <h3 class="font-bold mb-1">
            {{ toast.title }}
          </h3>

          <p v-if="toast.message" class="text-sm text-gray-500 leading-6">
            {{ toast.message }}
          </p>
        </div>

        <!-- CLOSE -->
        <button
          @click="toastStore.removeToast(toast.id)"
          class="text-gray-400 hover:text-black transition text-xl leading-none"
        >
          ×
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToastStore } from "../../stores/toastStore";

const toastStore = useToastStore();

const toastIcon = (type) => {
  if (type === "error") return "!";
  if (type === "info") return "i";
  return "✓";
};

const toastStyle = (type) => {
  if (type === "error") return "border-red-100";
  if (type === "info") return "border-gray-100";
  return "border-green-100";
};

const iconStyle = (type) => {
  if (type === "error") return "bg-red-100 text-red-600";
  if (type === "info") return "bg-gray-100 text-black";
  return "bg-black text-white";
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.35s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.98);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.98);
}
</style>
