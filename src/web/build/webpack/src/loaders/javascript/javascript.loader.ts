import { RuleSetRule } from 'webpack'
import { BabelConfig } from '../../helpers/getBabelOptions'

const javascriptLoader = (babelConfig: BabelConfig): RuleSetRule => ({
  loader: 'babel-loader',
  options: babelConfig,
  test: /\.jsx?$/,
})

export default javascriptLoader
