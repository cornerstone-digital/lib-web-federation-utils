import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { UserConfig } from 'vite'

const config: UserConfig = {
  base: './',
  build: {
    lib: {
      entry: 'index.ts',
      fileName: () => 'index.js',
      formats: ['es'],
      name: 'federated-web-frontend-react',
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
  },
  plugins: [dts({ entryRoot: './' }), react()],
}

export default config
