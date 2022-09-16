import getGlobalEnvVar from './getGlobalEnvVar'

const consoleErrorSpy = jest
  .spyOn(console, 'error')
  .mockImplementation(() => null)

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

    getGlobalEnvVar('test')

    expect(consoleErrorSpy).toBeCalledWith('window.VFUK is not defined')
  })

  it('should log error if the VFUK.env is not defined', () => {
    window.VFUK = {
      env: undefined,
    }

    getGlobalEnvVar('test')

    expect(consoleErrorSpy).toBeCalledWith('window.VFUK.env is not defined')
  })
})
