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
import AvailabilityChecker from './frontend/AvailabilityChecker'
export const { name, mount, unmount, bootstrap, update } = createFederatedReact(
  {
    React,
    ReactDOM,
    federatedRuntime: initFederatedRuntime(),
    config: {
      name: 'vfuk-AvailabilityChecker',
      rootComponent: <AvailabilityChecker />,
      type: 'component',
    },
  }
)
```

### FederatedModuleLoader

This component is used to load a federated module and render it.

```typescript jsx
import { FederatedModuleLoader } from '@vf/federated-react'

const MyComponent = () => {
  return (
    <FederatedModuleLoader
      name="vfuk-AvailabilityChecker"
      props={{
        someProp: 'someValue',
      }}
      mountId="availability-checker"
    />
  )
}
```
