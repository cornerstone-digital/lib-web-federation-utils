import React from 'react'
import { FederatedModuleLoader } from '@vf/federated-react'
import bannerData from './data/banner-mock'

const AppComponent = () => {
  return (
    <>
      <FederatedModuleLoader
        name="vfuk-federated-component-example"
        props={{
          bannerData,
        }}
      />
    </>
  )
}

export default AppComponent
