import { UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// https://vitejs.dev/config/
const config: UserConfig = {
  build: {
    emptyOutDir: false,
    outDir: './dist',
    manifest: true,
    rollupOptions: {
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  plugins: [cssInjectedByJsPlugin(), vue()],
}

export default config
