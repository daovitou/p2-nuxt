import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
  ssr: false,
  css: ["@/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        "/api1": {
          // target: "https://agridocs-api.daovitou.net/v1",
          target: "http://localhost:4000/v1",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api1/, ""),
        },
        "/apim": {
          // target: "https://agridocs-api.daovitou.net/v1",
          target: "http://localhost:4000/mobile/v1",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/apim/, ""),
        },
      }
    },

  },
  modules: ["@nuxt/ui", "@pinia/nuxt", "nuxt-aos"],

  pinia: {
    storesDirs: ["./stores/**", "./custom-folder/stores/**"],
  },
  ui: {
    fonts: true,
  },
  icon: {
    serverBundle: {
      collections: ["lucide"], // <!--- this
    },
  },
  runtimeConfig: {
    axios: {
      proxy: true,
    },
    public: {
      MINIO_HOST: "http://minio:9000/profiles",
    }
  },
});