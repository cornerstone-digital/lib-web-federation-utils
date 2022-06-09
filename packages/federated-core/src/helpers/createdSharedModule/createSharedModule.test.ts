import createSharedModule from './createSharedModule'

describe('createSharedModule', () => {
  it('should create a shared module', () => {
    const data = {
      name: 'test-module',
      scope: 'test-scope',
      methods: {
        testMethod: () => {
          return 'test'
        },
      },
    }
    const sharedModule = createSharedModule(data)
    expect(sharedModule).toBeDefined()
    expect(sharedModule.type).toBe('shared-module')
  })
})
