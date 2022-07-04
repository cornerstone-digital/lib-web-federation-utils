import react from '@vitejs/plugin-react'
import vue from '@vitejs/plugin-vue'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import { UserConfig } from 'vite'

const viteConfig: UserConfig = {
  build: {
    emptyOutDir: false,
    outDir: './dist',
    manifest: true,
    rollupOptions: {
      external: ['react', 'react-dom', 'react-is', 'vue'],
      output: {
        globals: {
          vue: 'Vue',
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  plugins: [cssInjectedByJsPlugin(), react(), vue()],
}

export default viteConfig
