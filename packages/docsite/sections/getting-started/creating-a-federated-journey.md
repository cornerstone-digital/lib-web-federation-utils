# Creating a Federated Journey

```typescript
import React from 'react'
import ReactDOM from 'react-dom'

import { createFederatedReact } from '@vf/federated-react'
import { initFederatedRuntime } from '@vf/federated-core'

// Normal React Component
import AcquisitionsMain from './AcquisitionsMain'

const AcquisitionsMainFederated = createFederatedReact({
  React,
  ReactDOM,
  federatedRuntime: initFederatedRuntime(),
  enableSystemJs: true,
  config: {
    scope: 'broadband',
    name: 'acquisitionsMain',
    type: 'journey-module',
    activeWhenPaths: ['/broadband', '/broadband*'],
    exceptWhenPaths: ['/broadband/services/*'],
    domElementId: 'root',
    rootComponent: AcquisitionsMain,
  },
})

export const {
  name,
  scope,
  bootstrap,
  mount,
  unmount,
  update,
  exceptWhenPaths,
  activeWhenPaths,
  type,
  domElementId,
  rootComponent,
} = AcquisitionsMainFederated
```
