import react from '@vitejs/plugin-react'
import { UserConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { viteCommonjs, esbuildCommonjs } from '@originjs/vite-plugin-commonjs'

const viteStaticCopyTargets = [
  {
    dest: './assets/ws10/fonts',
    src: './node_modules/@vfuk/core-theme-ws10/assets/fonts/*',
  },
  {
    dest: './assets/ws10/animations',
    src: './node_modules/@vfuk/core-theme-ws10/assets/animations/*',
  },
  {
    dest: './assets/ws10/icons',
    src: './node_modules/@vfuk/core-theme-ws10/assets/icons/*',
  },
  {
    dest: './assets/ws10/icons/SourceStateIcons',
    src: './node_modules/@vfuk/source-state-icons/dist/assets/*',
  },
  {
    dest: './assets/ws10/icons/SourceSystemIcons',
    src: './node_modules/@vfuk/source-system-icons/dist/assets/*',
  },
  {
    dest: './assets/ws10/icons/SourceSocialIcons',
    src: './node_modules/@vfuk/source-social-icons/dist/assets/*',
  },
  {
    dest: './assets/ws10/icons/UkLegacyIcons',
    src: './node_modules/@vfuk/uk-legacy-icons/dist/assets/*',
  },
  {
    dest: './assets/ws10/icons/BrandLoFiIcons',
    src: './node_modules/@vfuk/brand-lofi-icons/dist/assets/*',
  },
  {
    dest: './assets/ws10/logos',
    src: './node_modules/@vfuk/core-theme-ws10/assets/logos/*',
  },
]
const viteConfig: UserConfig = {
  build: {
    outDir: './dist',
    assetsDir: './assets',
    rollupOptions: {},
  },

  plugins: [
    viteCommonjs(),
    react({ jsxRuntime: 'classic' }),
    viteStaticCopy({
      targets: viteStaticCopyTargets,
    }),
  ],
  optimizeDeps: {
    esbuildOptions: {
      plugins: [esbuildCommonjs(['slick-carousel'])],
    },
  },
}

export default viteConfig
