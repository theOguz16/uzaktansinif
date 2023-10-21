import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import Pages from "vite-plugin-pages";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import nodePolyfills from "rollup-plugin-polyfill-node";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    watch: {
      // https://vitejs.dev/config/server-options.html#server-watch
      usePolling: true,
    },
  },
  plugins: [vue(), Pages()],
  optimizeDeps: {
    exclude: ["vue-demi"],
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
      ],
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: 'import "floating-vue/dist/style.css"',
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      // Enable rollup polyfills plugin
      // used during production bundling
      plugins: [nodePolyfills()],
    },
  },
});
