// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

const isDev = import.meta.env.DEV;
const baseUrl = isDev ? "http://localhost:4321" : "https://mrzkhrmn.github.io";

// https://astro.build/config
export default defineConfig({
  site: baseUrl,
  base: isDev ? "/" : "/nurdogan-ui",
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
  },
});
