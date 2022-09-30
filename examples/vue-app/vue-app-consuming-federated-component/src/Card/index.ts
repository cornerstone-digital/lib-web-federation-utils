import { initFederatedRuntime } from '@vf/federated-core'
import { createFederatedVue } from '@vf/federated-vue'

import * as Vue from 'vue'
import Card from './Card.vue'

const { name, mount, unmount, bootstrap, update } = createFederatedVue({
  Vue: Vue,
  federatedRuntime: initFederatedRuntime(),
  config: {
    name: 'vfuk-federated-component-example',
    rootComponent: Card,
    type: 'component',
  },
})

export { name, mount, unmount, bootstrap, update }
