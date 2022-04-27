import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { UserConfig } from 'vite'

const config: UserConfig = {
  base: './',
  build: {
    lib: {
      entry: 'src/index.ts',
      fileName: () => 'index.js',
      formats: ['es'],
      name: 'federated-web-frontend-react',
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  plugins: [dts({ entryRoot: './' }), react()],
}

export default config
