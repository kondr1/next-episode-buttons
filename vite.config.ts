import {resolve} from 'path'
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import webExtension from '@samrum/vite-plugin-web-extension'
import * as pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    webExtension({
      manifest: {
        name: pkg.name,
        description: pkg.description,
        version: pkg.version,
        manifest_version: 3,
        background: {
          service_worker: 'src/background/serviceWorker.js',
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@app': resolve(__dirname, './src'),
    },
  },
})
