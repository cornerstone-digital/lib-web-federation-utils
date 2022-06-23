# Creating a Federated Component

```typescript
import React from 'react'
import ReactDOM from 'react-dom'
import { createFederatedReact } from '@vf/federated-react'
import { getFederatedRuntime } from '@vf/federated-core'

export const { name, scope, mount, unmount, bootstrap, update } = createFederatedReact({
  React,
  ReactDOM,
  federatedRuntime: getFederatedRuntime(),
  config: {
    scope: 'broadband',
    name: 'AvailabilityChecker',
    loadRootComponent: async () =>
      React.lazy(() => import(/* webpackChunkName: "availability-checker" */ './frontend/AvailabilityChecker')),
    type: 'component',
  },
})

```
