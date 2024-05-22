import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '192.168.18.7', // Aquí debes poner tu dirección IP
    port: 3000, // Puerto en el que quieres que escuche el servidor
    
    hmr: {
      path:'ws',
    },

  },
})
