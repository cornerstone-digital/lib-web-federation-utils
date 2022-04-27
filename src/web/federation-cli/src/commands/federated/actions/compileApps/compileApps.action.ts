import inquirer from 'inquirer'
import loadConfig from '../../../../helpers/loadConfig'
import { FederatedApp, FederatedCliConfig } from '../../../../types'
import { getFederatedWebpack } from '@vf/federated-web-build-webpack'
import webpack, { Configuration } from 'webpack'
import { writeFileSync } from 'fs'

const buildAppsAction = async () => {
  // Load config
  const config: FederatedCliConfig = await loadConfig()

  // List available components from federated folder
  const appsToCompile: { federatedApps: string[] } = await inquirer.prompt([
    {
      choices: Object.keys(config.federatedApps),
      message: 'Select apps to compile',
      name: 'federatedApps',
      type: 'checkbox',
    },
  ])

  // Based on selection compile each component to build folder
  const appsToBuild: FederatedApp<unknown>[] = appsToCompile.federatedApps.map(app => {
    return config.federatedApps[app]
  })

  appsToBuild.forEach(app => {
    if (app.buildTool === 'webpack') {
      const webpackConfig = getFederatedWebpack(app.name, {
        basePath: config.publicPath,
        buildDir: config.buildFolder,
        defineEnv: app.defineEnv,
        entryFile: app.entryFile,
        htmlFile: app.htmlFile,
        isDev: false,
        webpackConfig: app.compilerConfig as Configuration,
      })
      const compiler = webpack(webpackConfig)
      const imports: Record<string, string> = {}

      compiler.run((err, stats) => {
        if (err) {
          console.error(err)
        }
        if (stats?.hasErrors()) {
          console.error(stats?.toString())
        }

        stats?.compilation.chunks.forEach(chunk => {
          chunk.files.forEach(file => {
            if (file.includes('.js')) {
              const fileName = file.split('.')[0]
              imports[fileName] = `${config.publicPath}/${app.name}/${file}`
            }
          })
        })

        // Write imports to file
        const importsFile = `${config.buildFolder}/federated/${app.name}/imports.json`
        writeFileSync(importsFile, JSON.stringify({ imports }))
      })
    }
  })
}

export default buildAppsAction
