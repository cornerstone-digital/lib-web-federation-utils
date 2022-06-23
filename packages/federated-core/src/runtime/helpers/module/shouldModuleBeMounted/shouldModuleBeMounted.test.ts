import { FederatedModule } from '../../../../types'
import shouldModuleBeMounted from './shouldModuleBeMounted'

describe('shouldModuleBeMounted', () => {
  it('should return true if the path matches the activeWhenPaths', () => {
    const module: FederatedModule = {
      scope: 'scope',
      name: 'name',
      type: 'journey-module',
      activeWhenPaths: ['/active-path'],
      exceptWhenPaths: [],
    }

    expect(shouldModuleBeMounted('/active-path', module)).toBe(true)
  })

  it('should return false if the path matches the exceptWhenPaths', () => {
    const module: FederatedModule = {
      scope: 'scope',
      name: 'name',
      type: 'journey-module',
      activeWhenPaths: ['/active-path*'],
      exceptWhenPaths: ['/active-path/sub-path'],
    }

    expect(shouldModuleBeMounted('/active-path/sub-path', module)).toBe(false)
  })

  it('should return false if the path does not match the activeWhenPaths', () => {
    const module: FederatedModule = {
      scope: 'scope',
      name: 'name',
      type: 'journey-module',
      activeWhenPaths: ['/active-path'],
    }

    expect(shouldModuleBeMounted('/inactive-path', module)).toBe(false)
  })
})
