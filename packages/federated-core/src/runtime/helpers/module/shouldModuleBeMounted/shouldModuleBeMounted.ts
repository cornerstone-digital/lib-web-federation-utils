import matchPathToUrlPaths from '../../navigation/matchPathToUrlPaths'
import { FederatedModule } from '../../../../types'

const shouldModuleBeMounted = (
  path: string,
  module: FederatedModule
): boolean => {
  if (!module.activeWhenPaths) {
    return false
  }

  return (
    matchPathToUrlPaths(path, module.activeWhenPaths) &&
    !matchPathToUrlPaths(path, module.exceptWhenPaths || [])
  )
}

export default shouldModuleBeMounted
