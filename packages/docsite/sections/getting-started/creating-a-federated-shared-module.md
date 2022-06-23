# Creating a Federated Shared Module

```typescript
import { createSharedModule } from '@vf/federated-core'

const someMethod = async (arg1: string, arg2): Promise<void> => {
  console.log('someMethod', arg1, arg2)
}

const SampleService = createSharedModule({
  name: 'sampleService',
  scope: 'broadband',
  methods: {
    someMethod,
  },
})

export const {name, scope, methods} = SampleService
```
  
