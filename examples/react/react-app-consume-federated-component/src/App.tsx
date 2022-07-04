import React from 'react'
import { FederatedModuleLoader } from '@vf/federated-react'

import AppComponent from './AppComponent'

import headerData from '../data/header-mock.json'
import footerData from '../data/footer-mock.json'
import headerTags from '../data/header-tags.json'

const App = () => {
  return (
    <>
      <FederatedModuleLoader
        scope="vfuk-federated-component-example"
        name="FederatedPageTemplate"
        props={{
          headerData,
          footerData,
          headerTags,
          ChildComponent: <AppComponent />,
        }}
      />
    </>
  )
}
export default App
