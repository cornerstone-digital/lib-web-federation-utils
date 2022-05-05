import { RuleSetRule } from 'webpack'
import { FederatedWebpackOptions } from '@vf/federated-web-build-types'

const fontLoader = (loaderOptions: FederatedWebpackOptions['loaderConfig']['font']): RuleSetRule => ({
  test: /\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
  use: {
    loader: 'file-loader',
    options: {
      name: 'fonts/[name].[ext]?[hash]',
      ...loaderOptions,
    },
  },
})

export default fontLoader
