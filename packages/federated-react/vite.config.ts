import { UserConfig } from 'vite'
import dts from 'vite-plugin-dts'
import react from '@vitejs/plugin-react'

const viteConfig: UserConfig = {
  build: {
    emptyOutDir: true,
    outDir: './dist',
    lib: {
      entry: './src/index.ts',
      name: 'index',
      formats: ['es'],
    },
  },
  plugins: [react(), dts()],
}

export default viteConfig
