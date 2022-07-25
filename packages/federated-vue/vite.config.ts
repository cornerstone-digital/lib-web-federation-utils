import { UserConfig } from 'vite'
import dts from 'vite-plugin-dts'
import vue from '@vitejs/plugin-vue'

const viteConfig: UserConfig = {
  build: {
    emptyOutDir: true,
    outDir: './dist',
    lib: {
      entry: './src/index.ts',
      name: 'federated-vue',
      formats: ['cjs', 'es'],
    },
  },
  plugins: [vue(), dts()],
}

export default viteConfig
