import { resolve } from 'path'
import { existsSync } from 'fs'

const loadConfig = async () => {
  const configName = '.federated.config'
  const tsFederatedConfigPath = resolve(process.cwd(), `${configName}.ts`)
  const jsFederatedConfigPath = resolve(process.cwd(), `${configName}.js`)
  const isTs = existsSync(tsFederatedConfigPath)
  const configFile = isTs ? tsFederatedConfigPath : jsFederatedConfigPath
  const noConfigFound = !existsSync(configFile)
  const compilePath = resolve(process.cwd(), `.federated/${configName}.js`)
  const configPath = isTs ? compilePath : jsFederatedConfigPath

  if (noConfigFound) {
    throw new Error(`No federated config found. Please run 'vf-federated init' to create a config file.`)
  }

  if (isTs) {
    require('esbuild').buildSync({
      entryPoints: [tsFederatedConfigPath],
      outfile: compilePath,
      target: 'es6',
    })
  }

  return require(configPath)
}

export default loadConfig
