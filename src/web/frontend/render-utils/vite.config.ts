import dts from 'vite-plugin-dts'
import { UserConfig } from 'vite'

const config: UserConfig = {
  base: './',
  build: {
    lib: {
      entry: './src/index.ts',
      fileName: () => 'index.js',
      formats: ['es'],
      name: 'federated-web-frontend-render-utils',
    },
  },
  plugins: [dts({ entryRoot: './' })],
}

export default config
