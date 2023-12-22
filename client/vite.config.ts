import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: {},
  },
  resolve: {  
    alias: {
        util: "@browsery/util",
        process: "process/browser",
        stream: "stream-browserify",
        zlib: "browserify-zlib",
        // '@': path.resolve(__dirname, './src'),
    }
  }

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
