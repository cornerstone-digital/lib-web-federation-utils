/**
 * @jest-environment node
 */

import { initFederatedRuntime } from './FederatedRuntime'

describe('In NodeJS', () => {
  describe('initFederatedRuntime', () => {
    it('should return new instance if window is undefined', () => {
      expect(global.window).toBeUndefined()

      const runtime = initFederatedRuntime()

      expect(runtime).toBeDefined()
    })
  })
})
