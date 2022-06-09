import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'

const bundle = (config) => ({
  ...config,
  input: 'src/index.ts',
})

export default [
  bundle({
    plugins: [typescript()],
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
      },
    ],
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
  }),
]
