import { ThemeProvider } from 'styled-components'

import themeWS10 from '@vfuk/core-theme-ws10'
import InteractiveFiftyFiftyBanner from '@vfuk/core-interactive-fifty-fifty-banner'
import { InteractiveFiftyFiftyBannerProps } from '@vfuk/core-interactive-fifty-fifty-banner/dist/InteractiveFiftyFiftyBanner.types'

interface FederatedStandardBannerProps {
  bannerData: InteractiveFiftyFiftyBannerProps
}

const FederatedStandardBanner = ({
  bannerData,
}: FederatedStandardBannerProps) => {
  return (
    <ThemeProvider theme={themeWS10}>
      <themeWS10.globalStyles />
      <InteractiveFiftyFiftyBanner {...bannerData} />
    </ThemeProvider>
  )
}

export default FederatedStandardBanner
