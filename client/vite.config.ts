import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    _global: ({}),
  },
  resolve: {  
    alias: {
        util: "@browsery/util",
        process: "process/browser",
        stream: "stream-browserify",
        zlib: "browserify-zlib",
        '@': path.resolve(__dirname, './src'),
        './runtimeConfig': './runtimeConfig.browser',
    }
  },
  // optimizeDeps: {
  //     exclude: ['js-big-decimal']
  // }
})
