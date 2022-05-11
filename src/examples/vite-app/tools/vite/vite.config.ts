import react from '@vitejs/plugin-react'
import { UserConfig } from 'vite'

const viteConfig: UserConfig = {
  build: {
    outDir: './dist',
  },
  plugins: [react()],
}

export default viteConfig
