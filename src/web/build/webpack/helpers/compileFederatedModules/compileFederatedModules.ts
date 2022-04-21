import webpack from 'webpack'
import getFederatedWebpack from '../getFederatedWebpack'
import { FederatedWebpackOptions } from '@vf/federated-web-build-types'
import { writeFileSync } from 'fs'
import { getDirectories } from '@vf/federated-web-build-core'

const compileFederatedModules = async (options: FederatedWebpackOptions) => {
  const componentArray = getDirectories(options.federatedModuleDir)
  const imports: Record<string, string> = {}
  const buildPromises: Promise<void>[] = []

  componentArray.forEach((componentName: string) => {
    const compiler = webpack(getFederatedWebpack(componentName, options))
    buildPromises.push(
      new Promise<void>((resolve, reject) => {
        compiler.run((err, stats) => {
          if (err) {
            console.error(err)
            return reject(err)
          }
          if (stats?.hasErrors()) {
            console.error(stats?.toString())
            return reject(stats?.toJson())
          }
          stats?.compilation.chunks.forEach(chunk => {
            chunk.files.forEach(file => {
              if (file.includes('.js')) {
                const fileName = file.split('.')[0]
                imports[fileName] = `${options.basePath}/${componentName}/${file}`
              }
            })
          })

          return resolve()
        })
      }),
    )
  })

  await Promise.all(buildPromises)
  writeFileSync(`${options.buildDir}/federated/import-map.json`, JSON.stringify({ imports }, null, 2))
}

export default compileFederatedModules
