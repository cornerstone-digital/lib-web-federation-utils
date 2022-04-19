import { SetStateAction, useEffect, useState } from 'react'
import { FederatedModuleType } from '@vf/federated-web-frontend-react/components'
import loadModuleManifest from '@vf/federated-web-frontend-react/helpers/loadModuleManifest'
import hasStylesheetLoaded from '@vf/federated-web-frontend-react/helpers/hasStylesheetLoaded'

const useFederatedModule = (module: FederatedModuleType) => {
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

        setMfeModule(System.import(name))
        setIsLoading(false)
      } catch (error) {
        setError(error as SetStateAction<any>)
        setIsLoading(false)
        console.warn(`Error loading Federated Module: ${name}`, error)
      }
    }

    runLoad().then(() => {})
  }, [scope, name])
  return [mfeModule, isLoading, error]
}

export default useFederatedModule
