import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://mockapi-furw4tenlq-ez.a.run.app", // 👈 your actual backend base URL
        changeOrigin: true,
        secure: false, // set true if backend uses valid https cert
        rewrite: (path) => path.replace(/^\/api/, ""), // remove /api prefix
      },
    },
  },
})
