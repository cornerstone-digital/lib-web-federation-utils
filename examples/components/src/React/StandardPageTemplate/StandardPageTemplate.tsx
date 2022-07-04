import React, { ReactNode, Suspense } from 'react'
import i18n from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import intervalPlural from 'i18next-intervalplural-postprocessor'
import { ThemeProvider } from 'styled-components'

import themeWS10 from '@vfuk/core-theme-ws10'
import { english } from '@vfuk/core-language-packs'
import StandardPageTemplate from '@vfuk/core-standard-page-template'
import { HeaderProps } from '@vfuk/core-header/dist/Header.types'
import { FooterProps } from '@vfuk/core-footer/dist/Footer.types'

interface StandardPageProps {
  headerData: HeaderProps
  footerData: FooterProps
  headerTags: Record<string, unknown>
  ChildComponent: ReactNode
}
const AppChildren: React.FC = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </div>
  )
}

const FederatedStandardPage = ({
  headerData,
  footerData,
  headerTags,
  ChildComponent,
}: StandardPageProps) => {
  console.log(ChildComponent)
  const resources = {
    en: {
      translation: english,
    },
  }

  void i18n
    .use(initReactI18next)
    .use(intervalPlural)
    .init({
      resources,
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
    })

  return (
    <I18nextProvider i18n={i18n}>
      <Suspense fallback={<div>Loading...</div>}>
        <ThemeProvider theme={themeWS10}>
          <themeWS10.globalStyles />
          <StandardPageTemplate
            headerData={headerData}
            footerData={footerData}
            headTags={headerTags}
          >
            {ChildComponent}
          </StandardPageTemplate>
        </ThemeProvider>
      </Suspense>
    </I18nextProvider>
  )
}

export { ThemeProvider }

export default FederatedStandardPage
