import { RuleSetRule } from 'webpack'
import { BabelConfig } from '../../helpers/getBabelOptions'

const typescriptLoader = (babelConfig: BabelConfig): RuleSetRule => ({
  loader: 'babel-loader',
  options: babelConfig,
  test: /\.tsx?$/,
})

export default typescriptLoader
