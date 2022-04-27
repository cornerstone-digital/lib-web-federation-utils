import { resolve } from 'path'
import { existsSync } from 'fs'
// import { FederatedCliConfig } from '../../types'

const loadConfig = async () => {
  const configPath = resolve(process.cwd(), '.federated.config.ts')
  const outputPath = resolve(process.cwd(), '.federated/federated.config.js')
  if (existsSync(configPath)) {
    require('esbuild').buildSync({
      entryPoints: [configPath],
      outfile: outputPath,
      target: 'es6',
    })

    return require(outputPath)
  }
  throw new Error(`No federated config found at ${configPath}. Please run 'federated init' to create a config file.`)
}

export default loadConfig
