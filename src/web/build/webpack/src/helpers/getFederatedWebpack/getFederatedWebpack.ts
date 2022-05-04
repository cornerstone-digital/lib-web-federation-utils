import path from 'path'
import webpack, { Configuration } from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CompressionPlugin from 'compression-webpack-plugin'
import { WebpackManifestPlugin } from 'webpack-manifest-plugin'
import WebpackBar from 'webpackbar'

// @ts-ignore
import BrotliPlugin from 'brotli-webpack-plugin'

import TerserPlugin from 'terser-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { FederatedWebpackOptions } from '@vf/federated-web-build-types'

type GetFederatedWebpackFunc = (componentName: string, options: FederatedWebpackOptions) => Configuration

const getFederatedWebpack: GetFederatedWebpackFunc = (componentName, options) => {
  const defaultConfig: Configuration = {
    entry: {
      [`${componentName}`]: path.resolve(process.cwd(), `src/federated/components/${componentName}/src/index.ts`),
    },
    externals: {
      react: 'react',
      'react-dom': 'react-dom',
      'react-is': 'react-is',
      'styled-components': 'styled-components',
    },
    mode: options.isDev ? 'development' : 'production',
    module: {
      rules: [],
    },
    output: {
      chunkFilename: options.isDev ? '[name].js' : '[name].[contenthash].js',
      filename: options.isDev ? '[name].js' : '[name].[contenthash].js',
      libraryTarget: 'system',
      path: path.resolve(process.cwd(), `${options.buildDir}/federated/${componentName}`),
      publicPath: `${options.basePath}/${componentName}/`,
    },
    plugins: [
      new webpack.optimize.AggressiveMergingPlugin(),
      new CompressionPlugin({
        algorithm: 'gzip',
        minRatio: 0.8,
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
      }),
      new BrotliPlugin({
        asset: '[path].br[query]',
        minRatio: 0.8,
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
      }),
      new webpack.LoaderOptionsPlugin({
        debug: false,
        minimize: true,
      }),
      new TerserPlugin({
        terserOptions: {
          compress: {},
          ie8: false,
          keep_fnames: true,
          mangle: true,
          parse: {},
          toplevel: false,
        },
      }),
      new webpack.DefinePlugin(options.defineEnv),
      new HtmlWebpackPlugin({
        buildTime: new Date().toISOString(),
        mountElementId: `mf-${componentName.toLowerCase()}`,
        template: path.resolve(process.cwd(), `src/federated/components/${componentName}/src/index.html`),
        title: `Vodafone: ${componentName}`,
      }),
      new WebpackManifestPlugin({ publicPath: `${options.basePath}/${componentName}/` }),
    ],
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.scss'],
      fallback: {
        fs: false,
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
      },
    },
    target: 'web',
  }

  if (options.enableTypeScript) {
    defaultConfig.resolve.extensions.push('.ts')
    defaultConfig.resolve.extensions.push('.tsx')
    defaultConfig.module.rules.push({
      test: /\.tsx?$/,
      use: [],
    })
  }

  if (options.enableCssModules) {
    defaultConfig.plugins.push(
      new MiniCssExtractPlugin({
        chunkFilename: options.isDev ? '[id].css' : '[id].[contenthash].css',
        filename: options.isDev ? '[name].css' : '[name].[contenthash].css',
      }),
    )
    defaultConfig.module.rules.push({
      test: /\.css$/,
      use: [options.isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader'],
    })
  }

  if (options.enableProgressBar) {
    defaultConfig.plugins.push(
      new WebpackBar({
        color: 'blue',
        name: componentName,
      }),
    )
  }

  return defaultConfig
}

export default getFederatedWebpack
