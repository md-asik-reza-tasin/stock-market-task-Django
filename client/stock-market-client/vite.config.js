import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Allow connections from outside the container
    port: 5173       // Make sure it matches your docker run -p
  }
})
