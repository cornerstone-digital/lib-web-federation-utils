# Configuring your Express Server

1. Create a Federated Middleware to expose your import-maps

```typescript
import { Application } from 'express'

export default (app: Application, basePath: string, staticPath: string): void => {
  app.get(`${basePath}/assets/federated/import-maps/shared.json`, (req, res) => {
    res.sendFile(`${staticPath}/federated/shared-modules/${process.env.NODE_ENV === 'development' ? 'dev' : 'prod'}-shared-modules.json`)
  })
  app.get(`${basePath}/assets/federated/import-maps/application-import-map.json`, (req, res) => {
    res.sendFile(`${staticPath}/federated/application-import-map.json`)
  })
}
```

2. Consume the middleware in your Server

```typescript
import sharedImportMapMiddleware from './middleware/shareImportMapMiddleware';

sharedImportMapMiddleware(app, '/broadband/deals', this.staticPath)
```
