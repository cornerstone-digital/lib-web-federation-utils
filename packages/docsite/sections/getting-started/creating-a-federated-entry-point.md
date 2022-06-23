# Creating your Federated Entry Point

```typescript
import { getFederatedRuntime } from '@vf/federated-core'
import authService from '@vfuk/shop-utils-auth-service'
import { datadogRum } from '@datadog/browser-rum'

// Imported Journeys
import * as AcquisitionsMainFederated from '@federated/entry-point/journeys/acquisitions'
import * as UpgradesMainFederated from '@federated/entry-point/journeys/upgrades'

const federatedRuntime = getFederatedRuntime()

// Set this from environment variables
const enableImportMapsOverrides = true
const isDataDogEnabled = true
const isAnalyticsEnabled = true

// Whether to enable import-map-overrides or not
if (enableImportMapsOverrides) {
  federatedRuntime.importMapOverridesEnabled = enableImportMapsOverrides
  federatedRuntime.addImportMapOverridesUi()
}

// Set your shared dependency base URL (this is the URL configured for your shared modules in your express)
federatedRuntime.sharedDependencyBaseUrl = '/broadband/deals/assets/federated/shared-modules'

// Whether to enable debug mode or not (should be an enviroment variable)
federatedRuntime.debugEnabled = true

// Add your base URL (this is the URL for a particular federated scope's hosting components you wish to consume)
federatedRuntime.addBaseUrl('broadband', '/broadband/deals/assets')
federatedRuntime.addBaseUrl('basket', '/basket')

if (isDataDogEnabled) {
  datadogRum.init({
    applicationId: '29665455-1dd3-47c9-b96f-37fbef5d3a12',
    clientToken: 'pub41ff6f611eedd5fa7d2458bdf17e2f02',
    site: 'datadoghq.com',
    service: 'web-shop-broadband',
    env: getValue('DALMATIAN_ENVIRONMENT'),
    sampleRate: 100,
    trackInteractions: true,
  })
}

;(async () => {
  await authService.session()
  if (isAnalyticsEnabled) {
    await Analytics.initialize(config)   
  }
  
  // Register Your Journey's
  await federatedRuntime.registerModule(AcquisitionsMainFederated)
  await federatedRuntime.registerModule(UpgradesMainFederated)
  
  // Start
  await federatedRuntime.start()
})()
```
