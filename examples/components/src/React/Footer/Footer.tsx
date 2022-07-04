import { Suspense } from 'react'
import i18n from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import intervalPlural from 'i18next-intervalplural-postprocessor'
import { ThemeProvider } from 'styled-components'

import Footer from '@vfuk/core-footer'
import themeWS10 from '@vfuk/core-theme-ws10'
import { english } from '@vfuk/core-language-packs'
import { FooterProps } from '@vfuk/core-footer/dist/Footer.types'

interface FederatedFooterProps {
  footerData: FooterProps
}

const FederatedFooter = ({ footerData }: FederatedFooterProps) => {
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
          <Footer {...footerData} />
        </ThemeProvider>
      </Suspense>
    </I18nextProvider>
  )
}

export default FederatedFooter
