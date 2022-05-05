import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import autoprefixer from 'autoprefixer'
import { RuleSetRule } from 'webpack'

const sassLoader = (sassResources: string[]): RuleSetRule => {
  const baseLoaders = [
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          parser: 'postcss-scss',
          plugins: [autoprefixer()],
        },
      },
    },
    'sass-loader',
    {
      loader: 'sass-resources-loader',
      options: {
        resources: sassResources,
      },
    },
  ]

  return {
    test: /\.(css|scss)(\?.+)?$/,
    use: [
      'css-hot-loader',
      MiniCssExtractPlugin.loader,
      ...[
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            modules: {
              localIdentName: 'vfuk-[name]__[local]',
            },
            sourceMap: true,
          },
        },
        {
          loader: 'esbuild-loader',
          options: {
            loader: 'css',
            minify: true,
          },
        },
        ...baseLoaders,
      ],
    ],
  }
}

export default sassLoader
