/**
 * @jest-environment node
 */

import { getFederatedRuntime } from './FederatedRuntime'

describe('In NodeJS', () => {
  describe('getFederatedRuntime', () => {
    it('should return new instance if window is undefined', () => {
      expect(global.window).toBeUndefined()

      const runtime = getFederatedRuntime()

      expect(runtime).toBeDefined()
    })
  })
})
