import { getFederatedRuntime } from '@vf/federated-core'
import { createFederatedVue } from '@vf/federated-vue'
import Card from './Card.vue'

import * as Vue from 'vue'

const { name, scope, mount, unmount, bootstrap, update } = createFederatedVue({
  Vue: Vue,
  federatedRuntime: getFederatedRuntime(),
  config: {
    name: 'FederatedCard',
    rootComponent: Card,
    scope: 'vfuk-federated-component-example',
    type: 'component',
  },
})

export { name, scope, mount, unmount, bootstrap, update }
