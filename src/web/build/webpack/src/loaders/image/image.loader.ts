import { RuleSetRule } from 'webpack'
import { FederatedWebpackOptions } from '@vf/federated-web-build-types'

const imageLoader = (loaderOptions: FederatedWebpackOptions['loaderConfig']['image']): RuleSetRule => ({
  rules: [
    {
      use: {
        loader: 'url-loader',
        options: {
          limit: loaderOptions || 8192,
          name: 'images/[name].[ext]?[hash]',
          publicPath: loaderOptions.publicPath,
        },
      },
    },
    {
      use: {
        loader: 'img-loader',
        options: {
          mozjpeg: {
            progressive: true,
            quality: 85,
          },
        },
      },
    },
  ],
  test: /\.(png|jpg|jpeg|gif|webp)(\?v=\d+\.\d+\.\d+)?$/,
})

export default imageLoader
