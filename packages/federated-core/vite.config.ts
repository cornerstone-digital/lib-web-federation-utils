import { UserConfig } from 'vite'
import dts from 'vite-plugin-dts'

const viteConfig: UserConfig = {
  build: {
    emptyOutDir: true,
    outDir: './dist',
    lib: {
      entry: './src/index.ts',
      name: 'federated-core',
      formats: ['cjs', 'es'],
    },
  },
  plugins: [dts()],
}

export default viteConfig
