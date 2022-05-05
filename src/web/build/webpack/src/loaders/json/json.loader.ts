import { RuleSetRule } from 'webpack'

const jsonLoader: RuleSetRule = {
  test: /\.json$/,
  use: {
    loader: 'esbuild-loader',
    options: {
      loader: 'json',
    },
  },
}

export default jsonLoader
