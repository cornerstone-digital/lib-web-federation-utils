import react from '@vitejs/plugin-react'
import { UserConfig } from 'vite'

const viteConfig: UserConfig = {
  build: {
    emptyOutDir: false,
    outDir: './dist',
    manifest: true,
    rollupOptions: {
      external: ['react', 'react-dom', 'react-is'],
    },
  },
  plugins: [react({ jsxRuntime: 'automatic' })],
}

export default viteConfig
