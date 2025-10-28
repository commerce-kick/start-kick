import tailwindcss from "@tailwindcss/vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

import { nitro } from "nitro/vite";

export default defineConfig({
  plugins: [
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tanstackStart(),
    tailwindcss(),
    nitro({
      config: {
        preset: "vercel",
      },
    }),
    viteReact(),
  ],
});
