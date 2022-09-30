import createFederatedService from './createSharedModule'

describe('createSharedModule', () => {
  it('should create a shared module', () => {
    const data = {
      name: 'vfuk-test-module',
      basePath: '/test-base-path',
      methods: {
        testMethod: () => {
          return 'test'
        },
      },
    }
    const sharedService = createFederatedService(data)
    expect(sharedService).toBeDefined()
    expect(sharedService.type).toBe('shared-module')
  })
})
