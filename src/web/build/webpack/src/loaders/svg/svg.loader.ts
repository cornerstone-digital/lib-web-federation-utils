import { RuleSetRule } from 'webpack'

const svgLoader: RuleSetRule = {
  test: /\.svg$/,
  use: 'svg-inline-loader',
}

export default svgLoader
