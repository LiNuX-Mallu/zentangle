import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://192.168.43.197:3000',
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //   },
  // },
})
