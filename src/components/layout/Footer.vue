<template>
  <footer class="bg-luxe-espresso text-luxe-ivory px-6 py-16">
    <div class="max-w-7xl mx-auto">
      <div class="grid md:grid-cols-4 gap-12">
        <!-- BRAND -->
        <div class="md:col-span-2">
          <h2 class="text-3xl font-bold tracking-wide mb-5">LUXEZA ROYALE</h2>

          <p class="text-luxe-sand leading-7 max-w-md">
            Minimalist luxury fashion e-commerce experience built for modern
            premium lifestyle and future full-stack integration.
          </p>
        </div>

        <!-- MENU -->
        <div>
          <h3 class="font-semibold mb-5">Explore</h3>

          <ul class="space-y-3 text-luxe-sand">
            <li>
              <RouterLink to="/" class="hover:text-white transition">
                Home
              </RouterLink>
            </li>

            <li>
              <a href="/#products" class="hover:text-white transition">
                Collection
              </a>
            </li>

            <li>
              <RouterLink to="/wishlist" class="hover:text-white transition">
                Wishlist
              </RouterLink>
            </li>

            <li>
              <RouterLink to="/orders" class="hover:text-white transition">
                Orders
              </RouterLink>
            </li>

            <li>
              <RouterLink to="/checkout" class="hover:text-white transition">
                Checkout
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- INFO -->
        <div>
          <h3 class="font-semibold mb-5">Project</h3>

          <ul class="space-y-3 text-luxe-sand">
            <li>Vue 3</li>
            <li>Vite</li>
            <li>Pinia</li>
            <li>TailwindCSS</li>
          </ul>
        </div>
      </div>

      <div
        class="border-t border-luxe-gold/20 mt-14 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <p class="text-luxe-sand/80 text-sm">
          © 2026 Luxeza Royale. Full-stack e-commerce project.
        </p>

        <p class="text-luxe-sand/80 text-sm">
          Designed with warm brown and ivory luxury aesthetic.
        </p>
      </div>
    </div>
  </footer>
</template>
