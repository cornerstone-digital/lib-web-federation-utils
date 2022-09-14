import { UserConfig } from 'vite'
import dts from 'vite-plugin-dts'
import react from '@vitejs/plugin-react'

const viteConfig: UserConfig = {
  build: {
    emptyOutDir: true,
    outDir: './dist',
    lib: {
      entry: './src/index.ts',
      name: 'federated-react',
      formats: ['cjs', 'es'],
    },
  },
  plugins: [dts(), react()],
}

export default viteConfig
