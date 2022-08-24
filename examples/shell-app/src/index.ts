import { initFederatedRuntime } from '@vf/federated-core'

import * as reactFederatedJourney from '@vf/federated-react-app-creating-component/src/Journey'
;(async () => {
  const federatedRuntime = initFederatedRuntime()
  federatedRuntime.debugEnabled = true
  federatedRuntime.importMapOverridesEnabled = true
  federatedRuntime.useNativeModules = true
  federatedRuntime.sharedDependencyBaseUrl = 'https://localhost:8001'
  await federatedRuntime.registerModule(reactFederatedJourney)

  // Start the app
  await federatedRuntime.start()
  console.log('Runtime Executed')
})()
