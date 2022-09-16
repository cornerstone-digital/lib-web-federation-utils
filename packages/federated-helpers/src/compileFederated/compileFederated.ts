/* eslint-disable max-depth */
import type { InlineConfig, Manifest } from 'vite'
import { resolve } from 'path'
import * as fs from 'fs-extra'

export type CompileFederatedModulesOptions = {
  vite: typeof import('vite')
  viteOptions: {
    plugins: InlineConfig['plugins']
    define: InlineConfig['define']
    build: InlineConfig['build']
  }
  basePath: string
  federatedFolder: string
  distFolder: string
  importPrefix?: string
  hash?: string
}

export type CompilerOptions = CompileFederatedModulesOptions & {
  buildFolder: string
}

const compileFederatedModules = async ({
  vite,
  viteOptions,
  basePath,
  federatedFolder,
  distFolder,
  importPrefix = 'vfuk',
  hash = Date.now().toString(36),
}: CompileFederatedModulesOptions) => {
  const imports: Record<string, string> = {}
  const modulesDir = resolve(federatedFolder, `./modules`)

  for (const module of fs.readdirSync(modulesDir)) {
    try {
      const componentsDir = resolve(federatedFolder, `modules/${module}`)

      // Loop through all files in the federated folder
      for (const file of fs.readdirSync(componentsDir)) {
        // If the file is a directory, compile it
        if (fs.statSync(`${componentsDir}/${file}`).isDirectory()) {
          const componentConfig: InlineConfig = {
            build: {
              lib: {
                entry: `${componentsDir}/${file}/index.ts`,
                fileName: `${file}-${hash}`,
                formats: ['umd'],
                name: file,
              },
              manifest: true,
              outDir: `${distFolder}/${module}/${file}`,
              rollupOptions: viteOptions.build?.rollupOptions || {},
            },
            define: viteOptions.define,
            plugins: viteOptions.plugins,
          }

          await vite.build(componentConfig)

          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const manifest: Manifest = require(resolve(
            `${distFolder}/${module}/${file}/manifest.json`
          ))

          // Loop over manifest and add imports to the imports object
          for (const key in manifest) {
            const manifestEntry = manifest[key]

            if (manifestEntry.isEntry) {
              const filename = `${importPrefix}-${
                manifestEntry.file.split('.')[0]
              }`.replace(`-${hash}`, '')
              imports[
                filename
              ] = `${basePath}/federated/${module}/${file}/${manifestEntry.file}`
            }
          }
        }
      }

      // Add React and ReactDOM to the imports object
      imports[
        'react'
      ] = `${basePath}/federated/shared/react/17.0.2/umd/react.production.min.js`
      imports[
        'react-dom'
      ] = `${basePath}/federated/shared/react-dom/17.0.2/umd/react-dom.production.min.js`
      imports[
        'react-is'
      ] = `${basePath}/federated/shared/react-is/17.0.2/umd/react-is.production.min.js`
      imports[
        'styled-components'
      ] = `${basePath}/federated/shared/styled-components/5.3.5/umd/styled-components.js`

      // Write the imports object to a file in the dist folder
      fs.writeFileSync(
        `${distFolder}/entries-import-map.json`,
        JSON.stringify({ imports }, null, 2)
      )
    } catch (e) {
      console.error(e)
    }
  }
}

const compileFederated = async ({
  vite,
  viteOptions,
  basePath,
  buildFolder,
  federatedFolder,
  distFolder,
  importPrefix,
  hash,
}: CompilerOptions): Promise<void> => {
  await compileFederatedModules({
    vite,
    viteOptions,
    basePath,
    federatedFolder,
    distFolder,
    importPrefix,
    hash,
  })

  // Copy the dist folder to the build folder
  fs.copySync(distFolder, buildFolder)
  fs.copySync(
    resolve(federatedFolder, './shared'),
    resolve(buildFolder, './shared')
  )
}

export default compileFederated

// export const CompilerOptions = {}
// export const CompileFederatedModulesOptions = {}
// export default {}
