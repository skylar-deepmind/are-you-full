import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "logo/apple-touch-icon.png",
        "logo/icon-192.png",
        "logo/icon-512.png",
      ],
      manifest: {
        name: "撑了么",
        short_name: "撑了么",
        description: "记录每日饮食饱腹程度的小工具",
        theme_color: "#006241",
        background_color: "#F2F0EB",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/logo/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/logo/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/logo/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
