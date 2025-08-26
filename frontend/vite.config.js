import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // 2. Add the plugin to your plugins array
  plugins: [
    react()
  ],
  server: {
    host: true,
    allowedHosts: [
      // ngrok domain
      '.ngrok-free.app', 
      'duckling-summary-adversely.ngrok-free.app'
    ],
  }
})