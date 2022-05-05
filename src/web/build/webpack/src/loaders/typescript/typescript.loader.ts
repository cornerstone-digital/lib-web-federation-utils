import { RuleSetRule } from 'webpack'

const typescriptLoader = (tsConfigPath: string): RuleSetRule => ({
  loader: 'esbuild-loader',
  options: {
    loader: 'tsx',
    target: 'es2015',
    tsconfigRaw: require(tsConfigPath),
  },
  test: /\.tsx?$/,
})

export default typescriptLoader
