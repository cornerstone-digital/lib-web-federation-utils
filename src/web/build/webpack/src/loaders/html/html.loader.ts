import { RuleSetRule } from 'webpack'

const htmlLoader: RuleSetRule = {
  loader: 'html-loader',
  options: {
    minimize: { minifyJS: true },
  },
  test: /\.html$/,
}

export default htmlLoader
