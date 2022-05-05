import { SetStateAction, useEffect, useState } from 'react'
import loadModuleManifest from '@vf/federated-web-frontend-react/src/helpers/loadModuleManifest'
import hasStylesheetLoaded from '@vf/federated-web-frontend-react/src/helpers/hasStylesheetLoaded'
import { FederatedMetaData } from '@vf/federated-web-frontend-react/src/components/FederatedModule/FederatedModule.types'

function useFederatedModule(module: FederatedMetaData) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [mfeModule, setMfeModule] = useState<System.Module | null>(null)
  const { name, scope, version } = module

  useEffect(() => {
    async function runLoad(): Promise<void> {
      try {
        const manifest = await loadModuleManifest(scope, name, version)
        const fileKeys = Object.keys(manifest)

        // Load stylesheets onto head (if any
        fileKeys
          .filter(key => key.includes('.css'))
          .forEach((fileKey: string) => {
            const href = manifest[fileKey]
            if (!hasStylesheetLoaded(href)) {
              const link = document.createElement('link')
              link.setAttribute('id', `${name}-styles-${fileKey}`)
              link.setAttribute('rel', 'stylesheet')
              link.setAttribute('href', manifest[fileKey])
              document.head.appendChild(link)
            }
          })
        System.import(name).then(module => {
          setMfeModule(module.default)
          setIsLoading(false)
        })
      } catch (error) {
        setError(error as SetStateAction<any>)
        setIsLoading(false)
        console.warn(`Error loading Federated Module: ${name}`, error)
      }
    }

    runLoad().then(() => {})
  }, [scope, name])
  return { error, isLoading, mfeModule }
}

export default useFederatedModule