import path from 'path'

import get from 'lodash/get'
import webpack from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CompressionPlugin from 'compression-webpack-plugin'
import { WebpackManifestPlugin } from 'webpack-manifest-plugin'
import WebpackBar from 'webpackbar'

// @ts-ignore
import BrotliPlugin from 'brotli-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

import { GetMicroWebpackConfigFunc } from './getMicroWebpackConfig.types'

// const webpackDir = path.resolve(process.cwd(), 'config/webpack')
// const clientConfig: Configuration = require(path.resolve(webpackDir, 'webpack.client')).default
// const settings = require(path.resolve(webpackDir, 'settings')).default
// const clientModule = clientConfig.module || { rules: [] }
// const microComponentsDir = path.resolve(process.cwd(), 'micro-component')



const getMicroWebpackConfig: GetMicroWebpackConfigFunc = (componentName, options) => ({


  target: 'web',


  mode: options.settings.isDev ? 'development' : 'production',


  entry: {
    [`${componentName}`]: [path.resolve(options.microComponentsDir, `${componentName}/index`)],
  },


  output: {
    publicPath: `http://localhost:${options.devServer.port}${options.mfeBasePath}/${componentName}/`,
    path: path.resolve(process.cwd(), `${options.buildDir}/${componentName}`),
    libraryTarget: 'system',
    filename: options.settings.isDev ? '[name].js' : '[name].[contenthash].js',
    chunkFilename: options.settings.isDev ? '[name].js' : '[name].[contenthash].js',
  },


  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.scss'],
    fallback: {
      fs: false,
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
    },
  },


  module: {
    rules: [...options.rules],
  },


  plugins: [


    new WebpackBar({
      color: 'blue',
      name: componentName,
    }),


    new MiniCssExtractPlugin({
      filename: options.settings.isDev ? '[name].css' : `[name].[contenthash].css`,
      chunkFilename: options.settings.isDev ? '[id].css' : `[id].[contenthash].css`,
    }),


    new webpack.optimize.AggressiveMergingPlugin(),


    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),


    new BrotliPlugin({
      asset: '[path].br[query]',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
    }),


    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),


    new TerserPlugin({
      terserOptions: {
        parse: {},
        compress: {},
        mangle: true,
        toplevel: false,
        ie8: false,
        keep_fnames: true,
      },
    }),

    /**
     * new webpack.DefinePlugin({
      CORE_WS2_ASSETS: JSON.stringify('/broadband/deals/assets/ws2'),
      CORE_FONT_PREFIX: JSON.stringify('/broadband/deals/assets/ws10'),
      ...get(options, 'ENVIRONMENT_VARS'),
      HASH: options.settings.hash,
      WEBPACK_ASSET_PREFIX: JSON.stringify('/basket'),
    }),
     */


    new webpack.DefinePlugin({
      CORE_WS2_ASSETS: JSON.stringify('/broadband/deals/assets/ws2'),
      CORE_FONT_PREFIX: JSON.stringify('/broadband/deals/assets/ws10'),
      ...get(options, 'ENVIRONMENT_VARS'),
      HASH: options.settings.hash,
      WEBPACK_ASSET_PREFIX: JSON.stringify('/basket'),
    }),


    new HtmlWebpackPlugin({
      template: path.resolve(options.microComponentsDir, 'index.html'),
      title: `Vodafone: ${componentName}`,
      mountElementId: `mf-${componentName.toLowerCase()}`,
      dalmatianPrefix: '/basket',
      gitHash: options.settings.hash,
      versions: options.settings.versions,
      buildTime: options.settings.buildTime,
    }),


    new WebpackManifestPlugin({ publicPath: `${options.mfeBasePath}/${componentName}/` }),


  ],


  externals: {
    react: 'react',
    'react-dom': 'react-dom',
  },

})

export default getMicroWebpackConfig
