import React from 'react'
import { FederatedModuleLoader } from '@vf/federated-react'
import bannerData from './data/banner-mock'

const AppComponent = () => {
  return (
    <>
      <FederatedModuleLoader
        scope="vfuk-federated-component-example"
        name="FederatedStandardBanner"
        props={{
          bannerData,
        }}
      />
    </>
  )
}

export default AppComponent
