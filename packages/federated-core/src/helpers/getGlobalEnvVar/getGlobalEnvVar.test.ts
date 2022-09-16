import getGlobalEnvVar from './getGlobalEnvVar'

describe('getGlobalEnvVar', () => {
  it('should return the value of the global variable', () => {
    window.VFUK = {
      env: {
        test: 'test',
      },
    }

    expect(getGlobalEnvVar('test')).toEqual('test')
  })

  it('should return the value of the global variable in the namespace', () => {
    window.VFUK = {
      env: {
        test: {
          test: 'test',
        },
      },
    }

    expect(getGlobalEnvVar('test', 'test')).toEqual('test')
  })

  it('should throw an error if the global variable is not defined', () => {
    window.VFUK = undefined

    expect(() => getGlobalEnvVar('test')).toThrowError(
      'window.VFUK is not defined'
    )
  })

  it('should throw an error if the VFUK.env is not defined', () => {
    window.VFUK = {
      env: undefined,
    }

    expect(() => getGlobalEnvVar('test')).toThrowError(
      'window.VFUK.env is not defined'
    )
  })

  it('should throw an error if the global variable in the namespace is not defined', () => {
    window.VFUK = {
      env: {
        test: undefined,
      },
    }

    expect(() => getGlobalEnvVar('test', 'test')).toThrowError(
      'window.VFUK.env.test is not defined'
    )
  })
})
