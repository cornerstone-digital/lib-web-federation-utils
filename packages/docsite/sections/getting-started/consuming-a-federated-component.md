# Consuming a Federated Component

```typescript jsx
import { FederatedModuleLoader } from '@vf/federated-react'

const SomeComponent = () => {
    return (
        <>
          <FederatedModuleLoader
            scope='broadband'
            name='ExampleComponent'
            props={{
              prop1: true,
              prop2: 'Prop Value'
            }}
          />
        </>
    )
}
```
