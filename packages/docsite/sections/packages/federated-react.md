# @vf/federated-react

This library contains all the code required to create a federated React application.

### Installation

1. Make sure you've updated your .npmrc file to have the following line:

`@vf:registry=https://vfuk-digital.pkgs.visualstudio.com/_packaging/Web/npm/registry/`

2. Run `yarn add @vf/federated-react`

### createFederatedReact

This function creates a federated React application.

Example usage:

```typescript jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { createFederatedReact } from '@vf/federated-react'
import { initFederatedRuntime } from '@vf/federated-core'

export const { name, scope, mount, unmount, bootstrap, update } =
  createFederatedReact({
    React,
    ReactDOM,
    federatedRuntime: initFederatedRuntime(),
    config: {
      scope: 'broadband',
      name: 'AvailabilityChecker',
      loadRootComponent: async () =>
        React.lazy(
          () =>
            import(
              /* webpackChunkName: "availability-checker" */ './frontend/AvailabilityChecker'
            )
        ),
      type: 'component',
    },
  })
```

### FederatedModuleLoader

This component is used to load a federated module and render it.

```typescript jsx
import { FederatedModuleLoader } from '@vf/federated-react'

const MyComponent = () => {
  return (
    <FederatedModuleLoader
      scope="broadband"
      name="AvailabilityChecker"
      props={{
        someProp: 'someValue',
      }}
      mountId="availability-checker"
    />
  )
}
```
