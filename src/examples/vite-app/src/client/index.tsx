import { getFederatedRuntime } from '@vf/federated-web-core'
import MainApp from './MainApp'
import MainApp2 from './MainApp2'

// const RemoteApp: FederatedModule = {
//   activeWhenPaths: ['/'],
//   name: 'AvailabilityChecker',
//   scope: 'broadband',
// }

// Create self-executing function
;(async () => {
  const federatedRuntime = getFederatedRuntime()

  if (federatedRuntime) {
    federatedRuntime
      .addBaseUrl('broadband', '/broadband/deals/assets')
      .addBaseUrl('basket', '/basket/assets')
      .addBaseUrl('checkout', '/secure-checkout/assets')
      .setUseNativeModules(false)
      .setEnableImportMapOverrides(true)

    // await federatedRuntime.preFetchModules([RemoteApp])
    await federatedRuntime.registerModule(MainApp)
    await federatedRuntime.registerModule(MainApp2)

    // Start the app
    federatedRuntime.start()
  }
})()
