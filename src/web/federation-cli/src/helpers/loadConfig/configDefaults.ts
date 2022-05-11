import { FederatedCliConfig } from '../../types'
import { resolve } from 'path'
import createFederatedApp from 'helpers/createFederatedApp'

export const cliDefaults: Partial<FederatedCliConfig> = {
  buildFolder: resolve(process.cwd(), 'build'),
  tsconfigPath: resolve(process.cwd(), 'tsconfig.json'),
}

export const testApp = createFederatedApp('webpack', {
  name: 'test-app',
  port: 8001,
  publicPath: '/broadband/deals',
})
