import { SetStateAction, useEffect, useState } from 'react'
import { FederatedModuleType } from '../../components/FederatedModule'
import loadModuleManifest from '../../helpers/loadModuleManifest'

const useFederatedModule = (module: FederatedModuleType) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [mfeModule, setMfeModule] = useState<System.Module | null>(null)
  const { name, scope } = module

  useEffect(() => {
    async function runLoad() {
      try {
        const manifest = await loadModuleManifest(scope, name)
        const fileKeys = Object.keys(manifest)

        // Load stylesheets onto head
        fileKeys
          .filter(key => key.includes('.css'))
          .forEach((fileKey: string) => {
            const styleId = `${name}-styles-${fileKey}`
            if (!document.getElementById(styleId)) {
              const link = document.createElement('link')
              link.setAttribute('id', styleId)
              link.setAttribute('rel', 'stylesheet')
              link.setAttribute('href', manifest[fileKey])
              document.head.appendChild(link)
            }
          })

        setMfeModule(System.import(name))
        setIsLoading(false)
      } catch (error) {
        setError(error as SetStateAction<any>)
        setIsLoading(false)
        console.warn('MFE error:', error)
      }
    }
    runLoad()
  }, [scope, name])
  return [mfeModule, isLoading, error]
}

export default useFederatedModule
