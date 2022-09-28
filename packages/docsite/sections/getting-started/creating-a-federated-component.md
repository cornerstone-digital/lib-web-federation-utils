# Creating and Exposing a Fedarated React Component

Creating and exposing a React Federated Module is really simple! The docs below will highlight the key bits of creating a sample module and exposing the build which can be later consumed by the application. Click here to see an example of how the federated component can be consumed.

Click here to see a working example from repo.

## Setup

### Exposing the Module

```typescript
// src/InteractiveFiftyFiftyBanner/index.tsx
import React from 'react'
import ReactDOM from 'react-dom'
import { createFederatedReact } from '@vf/federated-react'
import { initFederatedRuntime } from '@vf/federated-core'
import FederatedInteractiveFiftyFiftyBanner from './InteractiveFiftyFiftyBanner'

const { name, scope, mount, unmount, bootstrap, update } = createFederatedReact(
  {
    React,
    ReactDOM,
    federatedRuntime: initFederatedRuntime(),
    config: {
      name: 'FederatedInteractiveFiftyFiftyBannerBanner',
      scope: 'vfuk-federated-component-example',
      basePath: '/example/federated',
      rootComponent: FederatedInteractiveFiftyFiftyBanner,
      type: 'component',
    },
  }
)

export { name, scope, mount, unmount, bootstrap, update }
```

#### Lazy Loading the Component

If you want to lazy load your Federated Component use the below script instead!

```typescript
// src/InteractiveFiftyFiftyBanner/index.tsx
import React from 'react'
import ReactDOM from 'react-dom'
import { createFederatedReact } from '@vf/federated-react'
import { initFederatedRuntime } from '@vf/federated-core'
import FederatedInteractiveFiftyFiftyBanner from './InteractiveFiftyFiftyBanner'

const { name, scope, mount, unmount, bootstrap, update } = createFederatedReact(
  {
    React,
    ReactDOM,
    federatedRuntime: initFederatedRuntime(),
    config: {
      name: 'FederatedInteractiveFiftyFiftyBannerBanner',
      scope: 'vfuk-federated-component-example',
      rootComponent: FederatedInteractiveFiftyFiftyBanner,
      type: 'component',
    },
  }
)

export { name, scope, mount, unmount, bootstrap, update }
```

### The Component

```typescript
// src/InteractiveFiftyFiftyBanner/InteractiveFiftyFiftyBanner.tsx
import { ThemeProvider } from 'styled-components'

import themeWS10 from '@vfuk/core-theme-ws10'
import InteractiveFiftyFiftyBanner from '@vfuk/core-interactive-fifty-fifty-banner'
import { InteractiveFiftyFiftyBannerProps } from '@vfuk/core-interactive-fifty-fifty-banner/dist/InteractiveFiftyFiftyBanner.types'

interface FederatedInteractiveFiftyFiftyBanner {
  bannerData: InteractiveFiftyFiftyBannerProps
}

const FederatedInteractiveFiftyFiftyBanner = ({
  bannerData,
}: FederatedInteractiveFiftyFiftyBanner) => {
  return (
    <ThemeProvider theme={themeWS10}>
      <themeWS10.globalStyles />
      <InteractiveFiftyFiftyBanner {...bannerData} />
    </ThemeProvider>
  )
}

export default FederatedInteractiveFiftyFiftyBanner
```

### Compile Script

```typescript
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
      fileName: 'FederatedInteractiveFiftyFiftyBannerBanner',
      entry: './src/InteractiveFiftyFiftyBanner/index.tsx',
      name: 'FederatedInteractiveFiftyFiftyBannerBanner',
    },
  ]
  // Add shared deps to the imports
  imports = createSharedImportMap(
    {
      format: 'esm',
      imports: {
        addReact: true,
        addStyledComponents: true,
      },
      isDev: false,
      basePath: 'https://cdn.jsdelivr.net/npm/@esm-bundle',
    },
    imports
  )

  lib.forEach(async (item) => {
    await build({
      ...compile,
      build: { ...compile.build, outDir: `./dist/${item.fileName}`, lib: item },
    })

    // Grab Manifest
    const manifest: Manifest = require(`../dist/${item.fileName}/manifest.json`)

    // Loop over manifest and add imports (Replace localhost with CDN URL)
    Object.keys(manifest).forEach((manifestKey) => {
      const manifestItem = manifest[manifestKey]
      const fileName = manifestItem.file.split('.')[0]
      imports[
        fileName
      ] = `http://localhost:8001/${item.fileName}/${item.fileName}.es.js`
    })

    fs.writeFileSync(
      './dist/entries-import-map.json',
      JSON.stringify({ imports }, null, 2)
    )
  })
})()
```

### Vite Config

```typescript
import react from '@vitejs/plugin-react'
import { UserConfig } from 'vite'

const viteConfig: UserConfig = {
  build: {
    emptyOutDir: false,
    outDir: './dist',
    manifest: true,
    rollupOptions: {
      external: ['react', 'react-dom', 'react-is'],
    },
  },
  plugins: [react({ jsxRuntime: 'automatic' })],
}

export default viteConfig
```
