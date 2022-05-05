import { getFederatedWebpack } from '@vf/federated-web-build-webpack'
import webpack from 'webpack'
import { writeFileSync } from 'fs'
import { FederatedCliConfig } from '@typeDefs'
import { FederatedApp } from '@vf/federated-web-build-types'

const compileWebpack = (app: FederatedApp<unknown>, config: FederatedCliConfig) => {
  const webpackConfig = getFederatedWebpack(app.name, {
    basePath: config.publicPath,
    buildDir: config.buildFolder,
    copyThemeAssets: app.copyThemeAssets,
    defineEnv: app.defineEnv,
    enableCssModules: app.enableCssModules,
    enableJsxControlStatements: app.enableJsxControlStatements,
    enableProgressBar: app.enableProgressBar,
    enableTypeScript: app.enableTypeScript,
    isDev: process.env.NODE_ENV === 'development',
    loaderConfig: app.loaderConfig,
    tsConfigPath: app.tsConfigPath,
  })
  const compiler = webpack(webpackConfig)
  const imports: Record<string, string> = {}
  const nameWithoutSpaces = app.name.replace(/\s/g, '')

  compiler.run((err, stats) => {
    if (err) {
      console.error(err)
      throw err
    }
    if (stats?.hasErrors()) {
      console.error(stats?.toString())
      throw new Error('Webpack compilation failed')
    }

    stats?.compilation.chunks.forEach(chunk => {
      chunk.files.forEach(file => {
        if (file.includes('.js')) {
          const fileName = file.split('.')[0]
          imports[fileName] = `${config.publicPath}/${nameWithoutSpaces}/${file}`
        }
      })
    })

    // // Write imports to file
    const importsFile = `${config.buildFolder}/federated/${nameWithoutSpaces}/imports.json`
    writeFileSync(importsFile, JSON.stringify({ imports }))
  })
}

export default compileWebpack
