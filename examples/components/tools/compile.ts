/* eslint-disable @typescript-eslint/no-var-requires */
import compile from '../vite.config'
import { build, Manifest } from 'vite'
import fs from 'fs'

import { createSharedImportMap } from '@vf/federated-core'
;(async () => {
  let imports: Record<string, string> = {}
  if (fs.existsSync('./dist')) fs.rmdirSync('./dist', { recursive: true })
  const lib = [
    {
      fileName: 'FederatedStandardBanner',
      entry: './src/React/StandardBanner/index.tsx',
      name: 'FederatedStandardBanner',
    },
    {
      fileName: 'FederatedHeader',
      entry: './src/React/Header/index.tsx',
      name: 'FederatedHeader',
    },
    {
      fileName: 'FederatedFooter',
      entry: './src/React/Footer/index.tsx',
      name: 'FederatedFooter',
    },
    {
      fileName: 'FederatedPageTemplate',
      entry: './src/React/StandardPageTemplate/index.tsx',
      name: 'FederatedPageTemplate',
    },
    {
      fileName: 'FederatedJourney',
      entry: './src/React/Journey/index.tsx',
      name: 'FederatedJourney',
    },
    {
      fileName: 'FederatedCard',
      entry: './src/Vue/Card/index.ts',
      name: 'FederatedCard',
    },
  ]
  // Add shared deps to the imports
  imports = createSharedImportMap(
    {
      format: 'umd',
      imports: {
        addVue: true,
        addReact: true,
        addStyledComponents: true,
      },
      isDev: false,
      basePath: 'https://cdnjs.cloudflare.com/ajax/libs',
    },
    imports
  )

  lib.forEach(async (item) => {
    await build({
      configFile: './vite.config.ts',
      build: { ...compile.build, outDir: `./dist/${item.fileName}`, lib: item },
    })

    // Grab Manifest
    const manifest: Manifest = require(`../dist/${item.fileName}/manifest.json`)

    // Loop over manifest and add imports
    Object.keys(manifest).forEach((manifestKey) => {
      const manifestItem = manifest[manifestKey]
      const fileName = manifestItem.file.split('.')[0]
      imports[
        fileName
      ] = `http://localhost:8001/${item.fileName}/${item.fileName}.umd.js`
    })

    fs.writeFileSync(
      './dist/entries-import-map.json',
      JSON.stringify({ imports }, null, 2)
    )
  })
})()
