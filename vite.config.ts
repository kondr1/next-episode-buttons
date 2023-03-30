import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";
import path from "path";

//: CmdRunParams
const webExtConfig   = {
  devtools: true,
  startUrl: "smotret-anime.com"
}

function generateManifest() {
  const manifest = readJsonFile("src/manifest.json");
  const pkg = readJsonFile("package.json");
  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    webExtension({
      assets: "public",
      webExtConfig: webExtConfig,
      browser: "firefox",
      manifest: generateManifest,
      additionalInputs: [
        "src/index.css",
        // "src/content/customStyles/negative.css",
        // "src/content/customStyles/negative.json"
      ],
      watchFilePaths: [
        path.resolve(__dirname, "tailwind.config.cjs"),
        path.resolve(__dirname, "postcss.config.cjs")
      ],
      libModeViteConfig: defineConfig({
        esbuild: {
          
          minifySyntax: false
        },
        build: {
          minify: false,
          sourcemap: 'inline'
        },
        define: {
          'process.env': {}
        }
      })
    }),
  ],
});
