import { initFederatedRuntime } from '@vf/federated-core'
import { createFederatedVue } from '@vf/federated-vue'
import Card from './Card.vue'

import * as Vue from 'vue'

const { name, mount, unmount, bootstrap, update } = createFederatedVue({
  Vue: Vue,
  federatedRuntime: initFederatedRuntime(),
  config: {
    rootComponent: Card,
    name: 'vfuk-federated-component-example',
    type: 'component',
  },
})

export { name, mount, unmount, bootstrap, update }
