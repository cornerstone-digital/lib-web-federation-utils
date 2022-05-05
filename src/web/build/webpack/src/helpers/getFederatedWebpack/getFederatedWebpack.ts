import path, { resolve } from 'path'
import webpack, { Configuration } from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CompressionPlugin from 'compression-webpack-plugin'
import { WebpackManifestPlugin } from 'webpack-manifest-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import WebpackBar from 'webpackbar'

import loaders from '../../loaders'

// @ts-ignore
import BrotliPlugin from 'brotli-webpack-plugin'

import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CopyPath, FederatedWebpackOptions } from '@vf/federated-web-build-types'
import getBabelOptions from '../getBabelOptions'

type GetFederatedWebpackFunc = (componentName: string, options: FederatedWebpackOptions) => Configuration

const getFederatedWebpack: GetFederatedWebpackFunc = (componentName, options) => {
  const babelOptions = getBabelOptions({
    aliases: options.loaderConfig.babel.aliases,
    enableCssModules: options.enableCssModules,
    enableJsxControlStatements: options.enableJsxControlStatements,
  })

  const copyFilesMap: CopyPath[] = []

  if (options.copyThemeAssets.copyPaths) {
    copyFilesMap.push(...options.copyThemeAssets.copyPaths)
  }

  if (options.copyThemeAssets.ws2) {
    copyFilesMap.push(
      ...[
        {
          from: resolve(process.cwd(), 'node_modules/@vfuk/core-theme-ws2/assets/fonts'),
          to: './ws2/fonts',
        },
        {
          from: resolve(process.cwd(), 'node_modules/@vfuk/core-theme-ws2/assets/icons'),
          to: './ws2/icons',
        },
        {
          from: resolve(process.cwd(), 'node_modules/@vfuk/core-theme-ws2/assets/logos'),
          to: './ws2/logos',
        },
      ],
    )
  }

  if (options.copyThemeAssets.ws10) {
    copyFilesMap.push(
      ...[
        {
          from: resolve(process.cwd(), 'node_modules/@vfuk/core-theme-ws10/assets/icons'),
          to: './ws10/icons',
        },
      ],
    )
  }

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
      rules: [
        loaders.javascriptLoader(babelOptions),
        loaders.fontLoader(options.loaderConfig.font),
        // loaders.jsonLoader,
        loaders.svgLoader,
        loaders.imageLoader(options.loaderConfig.image),
        loaders.sassLoader(options.loaderConfig.sass.resources),
        loaders.markdownLoader,
        loaders.htmlLoader,
      ],
    },
    output: {
      chunkFilename: options.isDev ? '[name].js' : '[name].[contenthash].js',
      filename: options.isDev ? '[name].js' : '[name].[contenthash].js',
      libraryTarget: 'system',
      path: path.resolve(process.cwd(), `${options.buildDir}/federated/${componentName}`),
      publicPath: `${options.basePath}/${componentName}/`,
    },
    plugins: [
      new MiniCssExtractPlugin({
        chunkFilename: options.isDev ? '[id].css' : '[id].[contenthash].css',
        filename: options.isDev ? '[name].css' : '[name].[contenthash].css',
      }),
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
      new webpack.DefinePlugin(options.defineEnv),
      new HtmlWebpackPlugin({
        buildTime: new Date().toISOString(),
        mountElementId: `mf-${componentName.toLowerCase()}`,
        template: path.resolve(process.cwd(), `src/federated/components/${componentName}/src/index.html`),
        title: `Vodafone: ${componentName}`,
      }),
      new WebpackManifestPlugin({ publicPath: `${options.basePath}/${componentName}/` }),
      new CopyWebpackPlugin({
        patterns: copyFilesMap,
      }),
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
    defaultConfig.module.rules.push(loaders.typescriptLoader(babelOptions))
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
