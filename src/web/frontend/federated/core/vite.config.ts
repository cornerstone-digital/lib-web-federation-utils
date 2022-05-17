import dts from 'vite-plugin-dts'
import { UserConfig } from 'vite'

//
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
