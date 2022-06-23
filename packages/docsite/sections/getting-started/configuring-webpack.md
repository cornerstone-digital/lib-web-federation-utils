# Configuring Webpack

1. Create a compiler script
In order to be able to make use of WebPack's NodeJS API and hook into the post compile hook, you will need to convert your application to use a compiler script instead of using the webpack CLI directly.

An example script can be found below:

```typescript
import { writeFileSync, copySync, mkdirSync } from 'fs-extra'
import path from 'path'
import webpack, { Configuration, Stats } from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

import { createSharedImportMap } from '@vf/federated-core'

// Webpack Configs
import clientConfig from './webpack.client'
import serverConfig from './webpack.server'

import settings from './settings'

const buildDir = path.resolve(process.cwd(), 'build/assets')
const nodeModulesDir = path.resolve(process.cwd(), 'node_modules')
const federatedDir = path.resolve(process.cwd(), 'src/federated')
const basePath = '/broadand/deals'

// 1. Compile Client
const compileClient = (clientConfig: Configuration) =>
  new Promise<Stats>((resolve, reject) => {
    const clientCompiler = webpack(clientConfig)
    const imports: Record<string, string> = {}

    clientCompiler.run(async (err, stats) => {
      if (err) {
        console.error(err)
        reject(err)
      }

      if (stats?.hasErrors()) {
        console.error(stats.toString())
        reject(stats.toString())
      }

      stats?.compilation.chunks.forEach((chunk) => {
        chunk.files.forEach((file) => {
          if (file.includes('.js')) {
            const fileName = file.split('.')[0]
            imports[fileName] = `${basePath}/assets/${file}`
          }

          if (file.includes('.css')) {
            imports[file] = `${basePath}/assets/${file}`
          }
        })
      })

      writeFileSync(`${buildDir}/entries-import-map.json`, JSON.stringify({ imports }, null, 2))

      mkdirSync(`${buildDir}/federated/shared-modules`, { recursive: true })

      // Copy Shared Modules to Build Folder
      copySync(`${nodeModulesDir}/@vf/federated-core/dist/src/shared-modules`, `${buildDir}/federated/shared-modules`)

      writeFileSync(
        `${buildDir}/federated/shared-modules/dev-shared-modules.json`,
        JSON.stringify(
          createSharedImportMap({
            imports: {
              addReact: true,
              addStyledComponents: true,
            },
            isDev: true,
            basePath: `${basePath}/assets/federated/shared-modules`,
          }),
          null,
          2,
        ),
      )

      writeFileSync(
        `${buildDir}/federated/shared-modules/prod-shared-modules.json`,
        JSON.stringify(
          createSharedImportMap({
            imports: {
              addReact: true,
              addStyledComponents: true,
            },
            isDev: false,
            basePath: `${basePath}/assets/federated/shared-modules`,
          }),
          null,
          2,
        ),
      )

      if (settings.isDev) {
        const server = new WebpackDevServer(settings.devServer, clientCompiler)
        const MainServer = require('../../src/server/server').default
        const config = require('../../src/server/middleware/config/core.config').default

        // Start server
        await server.start()
        const appServer = new MainServer(config)

        appServer.createApp(server.app).bootstrap()
      }

      return resolve(stats as Stats)
    })
  })

// Compile Server
const compileServer = (serverConfig: Configuration) =>
  new Promise<Stats | void>((resolve, reject) => {
    if (settings.isDev) return resolve()

    const serverCompiler = webpack(serverConfig)

    serverCompiler.run((err, stats) => {
      if (err) reject(err)

      return resolve(stats)
    })
  })
;(async () => {
  await Promise.all([compileClient(clientConfig), compileServer(serverConfig)])
})()
```

2. Update your webpack related package.json scripts

```json
{
  "scripts": {
    "start": "cross-env NODE_ENV=development ts-node config/webpack/compile.ts",
    "build:prod": "NODE_ENV=production ts-node config/webpack/compile.ts"
  }
}
```
