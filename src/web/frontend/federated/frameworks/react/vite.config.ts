import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { UserConfig } from 'vite'

// @ts-ignore
const config: UserConfig = {
  base: './',
  build: {
    lib: {
      entry: 'src/index.ts',
      fileName: () => 'src/index.js',
      formats: ['es'],
      name: 'federated-web-frontend-react',
    },
  },
  plugins: [dts({ entryRoot: './' }), react()],
}

export default config
