import dts from 'vite-plugin-dts'
import { UserConfig } from 'vite'

// https://vite.netease.com/zh/docs/vite-config
const config: UserConfig = {
  base: './',
  build: {
    lib: {
      entry: 'src/index.ts',
      fileName: () => 'src/index.js',
      formats: ['es'],
      name: 'federated-web-core',
    },
  },
  plugins: [dts({ entryRoot: './' })],
}

export default config
