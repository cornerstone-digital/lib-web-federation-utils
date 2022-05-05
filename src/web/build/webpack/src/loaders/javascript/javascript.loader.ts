import { RuleSetRule } from 'webpack'

const javascriptLoader: RuleSetRule = {
  loader: 'esbuild-loader',
  options: {
    loader: 'jsx',
    target: 'es2015',
  },
  test: /\.jsx?$/,
}

export default javascriptLoader
