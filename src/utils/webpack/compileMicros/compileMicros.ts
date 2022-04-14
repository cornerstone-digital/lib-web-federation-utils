import { writeFileSync } from 'fs'

import webpack from 'webpack'

import getMicroWebpackConfig from './getMicroWebpackConfig'

  // const microComponentsDir = path.resolve(process.cwd(), 'micro-component')
  // const componentArray = getDirectories(microComponentsDir)
  // const buildDir = path.resolve(process.cwd(), 'build/assets/micro-components')
  // const mfeBasePath = '/broadband/deals/assets/micro-components'

const compileMicros = async ({microComponentsDir, componentArray, buildDir, mfeBasePath, settings}) => {

  const imports: Record<string, string> = {}
  const buildPromises = []

  componentArray.forEach((componentName: string) => {
    const compiler = webpack(getMicroWebpackConfig(componentName, { mfeBasePath, microComponentsDir, buildDir, settings}))
    buildPromises.push(
      new Promise<void>((resolve, reject) => {
        compiler.run((err) => {
          // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
          const manifest = require(`${buildDir}/${componentName}/manifest.json`)
          const fileKeys = Object.keys(manifest)

          fileKeys
            .filter((key) => key.includes('.js'))
            .forEach((fileKey: string) => {
              const importKey = fileKey.replace(/\.js$/, '')
              imports[`${importKey}`] = manifest[fileKey]
            })

          if (err) {
            console.error(err)
            reject(err)
          }

          resolve()
        })
      }),
    )
  })

  await Promise.all(buildPromises)
  writeFileSync(`${buildDir}/import-map.json`, JSON.stringify({ imports }, null, 2))
}

export default compileMicros