import inquirer from 'inquirer'
import loadConfig from '@helpers/loadConfig'
import tsConfigRegister from '@helpers/tsConfigRegister'
import { FederatedApp } from '@vf/federated-web-build-types'
import { FederatedCliConfig } from '@typeDefs'

import compileWebpack from './helpers/compileWebpack'

const buildAppsAction = async () => {
  // Load config

  const config: FederatedCliConfig = await loadConfig()

  tsConfigRegister(config.tsconfigPath)

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
    switch (app.buildTool) {
      case 'webpack':
        compileWebpack(app, config)
        break
      case 'vite':
        // compileVite(app, config)
        break
      default:
        throw new Error(`Unknown build tool ${app.buildTool}`)
    }
  })
}

export default buildAppsAction
