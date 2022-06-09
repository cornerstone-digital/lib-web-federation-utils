import { useEffect } from 'react'
import { useFederatedModule } from '../../hooks'
import { v4 } from 'uuid'

type FederatedModuleLoaderProps<PropTypes> = {
  scope: string
  name: string
  props: PropTypes
}

function FederatedModuleLoader<PropTypes>({
  scope,
  name,
  props,
}: FederatedModuleLoaderProps<PropTypes>) {
  const module = useFederatedModule({ scope, name })
  const mountId = `${scope}-${name}-${v4()}`

  useEffect(() => {
    if (module?.mount) module?.mount(props, mountId)
    return () => {
      if (module?.unmount) module?.unmount()
    }
  }, [scope, name, module, mountId])

  return <div id={mountId} />
}

export default FederatedModuleLoader
