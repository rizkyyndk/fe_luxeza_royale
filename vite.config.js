import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const devApiProxyTarget =
    env.VITE_DEV_API_PROXY_TARGET || "http://127.0.0.1:8000";

  return {
    base: "/app/",
    plugins: [vue()],

    server: {
      proxy: {
        "/api": {
          target: devApiProxyTarget,
          changeOrigin: true,
          secure: false,
        },

        "/storage": {
          target: devApiProxyTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
