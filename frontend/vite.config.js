import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // This makes the server accessible externally
    hmr: {
        host: 'localhost',
    },
    watch: {
      usePolling: true
    },
    // Add this to allow your ngrok host
    allowedHosts: ['duckling-summary-adversely.ngrok-free.app'],
  }
})