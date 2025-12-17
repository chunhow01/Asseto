import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Needed for ngrok/network access
    port: 3000,
    allowedHosts: true // <--- FIX: This allows your ngrok URL to work
  }
})