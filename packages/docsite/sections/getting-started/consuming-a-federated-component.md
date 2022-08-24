# Consuming a Fedarated React Component

Consuming a federated module is as easy as creating/exposing it was!

Click here to see a working example from repo.

## Setup

### Consuming the Module

```typescript
// src/index.tsx
import React from 'react'
import { initFederatedRuntime } from '@vf/federated-core'
import { render } from 'react-dom'
import App from './App'

const runtime = initFederatedRuntime()
// replace localhost with the CDN URL for the relevant module URL
runtime.addBaseUrl('vfuk-federated-component-example', 'http://localhost:8001')
render(<App />, document.getElementById('root'))
```

### App

In this sample we are using the StandardPageTemplate from sourceweb and then pass the other components/children down as props to the module

```typescript
// src/App.tsx
import React from 'react'
import { FederatedModuleLoader } from '@vf/federated-react'

import AppComponent from './AppComponent'

import headerData from '../data/header-mock.json'
import footerData from '../data/footer-mock.json'
import headerTags from '../data/header-tags.json'

const App = () => {
  return (
    <>
      <FederatedModuleLoader
        scope="vfuk-federated-component-example"
        name="FederatedPageTemplate"
        props={{
          headerData,
          footerData,
          headerTags,
          ChildComponent: <AppComponent name={'VFUK'} />,
        }}
      />
    </>
  )
}
export default App
```

### Sample Component

```typescript
// src/Components/AppComponent.tsx
import React from 'react'
import { FederatedModuleLoader } from '@vf/federated-react'
import bannerData from '../data/banner-mock'

const AppComponent = (name: string) => {
  return (
    <>
      <h2>Hi {name}, This is a sample child component</h2>
      {/* Using the FederatedInteractiveFiftyFiftyBannerBanner we exposed before*/}
      <FederatedModuleLoader
        scope="vfuk-federated-component-example"
        name="FederatedInteractiveFiftyFiftyBannerBanner"
        props={{
          bannerData,
        }}
      />
    </>
  )
}

export default AppComponent
```

### Updated Index.html (Scheduled to Change)

```html
<!--index.html-->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Title</title>
    <meta
      id="importmap-type"
      name="importmap-type"
      content="systemjs-importmap"
    />
  </head>

  <body>
    <div id="app">
      <header id="header"></header>
      <main>
        <div id="root"></div>
      </main>
    </div>

    <script type="module" src="./src/index.tsx"></script>
    <script
      crossorigin="anonymous"
      type="systemjs-importmap"
      src="http://localhost:8001/entries-import-map.json"
    ></script>
    <!-- System JS -->
    <script
      crossorigin="anonymous"
      src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/6.12.1/system.min.js"
      data-cookieconsent="ignore"
    ></script>
    <script
      crossorigin="anonymous"
      src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/6.12.1/extras/named-exports.min.js"
      data-cookieconsent="ignore"
    ></script>
    <script
      crossorigin="anonymous"
      src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/6.12.1/extras/amd.min.js"
      data-cookieconsent="ignore"
    ></script>
    <script
      crossorigin="anonymous"
      src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/6.12.1/extras/dynamic-import-maps.min.js"
      data-cookieconsent="ignore"
    ></script>

    <script
      type="text/javascript"
      src="https://cdn.jsdelivr.net/npm/import-map-overrides/dist/import-map-overrides.js"
    ></script>
  </body>
</html>
```
