type OnPageDependency = {
  globalVar?: string
  systemJs?: boolean
  value: unknown
}

type RenderFederatedModuleOptions = {
  baseUrl: string
  onPageDependencies: Record<string, OnPageDependency>
}

const loadSystemJs = async (baseUrl: string) => {
  // Load SystemJS onto head of document
  const systemJsScript = document.createElement('script')
  systemJsScript.src = `${baseUrl}/system.js`
  systemJsScript.async = true
  document.head.appendChild(systemJsScript)

  // Load SystemJS AMD extras onto head of document
  const systemJsAmdScript = document.createElement('script')
  systemJsAmdScript.src = `${baseUrl}/system-amd.js`
  systemJsAmdScript.async = true
  document.head.appendChild(systemJsAmdScript)

  // Load SystemJS name export extra onto head of document
  const systemJsNameExportScript = document.createElement('script')
  systemJsNameExportScript.src = `${baseUrl}/system-name-export.js`
  systemJsNameExportScript.async = true
  document.head.appendChild(systemJsNameExportScript)
}

const renderFederatedModules = async (options: RenderFederatedModuleOptions) => {
  await loadSystemJs(options.baseUrl)

  // Find page federated modules
  const federatedModules = document.querySelectorAll('[data-federated-name]')
  const sharedModules: Map<string, unknown> = new Map()
  const importPromises: Promise<unknown>[] = []

  // Dynamically add dependencies to the page
  Object.keys(options.onPageDependencies).forEach(dependencyKey => {
    const dependency = options.onPageDependencies[dependencyKey]
    if (dependency.systemJs) {
      importPromises.push(
        new Promise((resolve, reject) => {
          System.import(dependencyKey)
            .then(module => {
              sharedModules.set(dependencyKey, module)
              resolve(module)
            })
            .catch(reject)
        }),
      )
    } else if (dependency.globalVar) {
      sharedModules.set(dependencyKey, (window as any)[dependency.globalVar])
    } else if (dependency.value) {
      sharedModules.set(dependencyKey, dependency.value)
    }
  })

  // Dynamically resolve module dependencies, if not already resolved
  federatedModules.forEach(module => {
    const moduleName = module.getAttribute('data-federated-name') ?? ''
    const moduleScope = module.getAttribute('data-federated-scope')
    const importMapUrl = `${options.baseUrl}/federated/${moduleScope}/${moduleName}/systemjs-importmap.json`
    fetch(importMapUrl)
      .then(response => response.json())
      .then(importMap => {
        const imports = Object.keys(importMap.imports)
        imports.forEach(importName => {
          if (!sharedModules.has(importName)) {
            const importPath = importMap.imports[importName]
            System.import(importPath).then(module => {
              sharedModules.set(importName, module)
            })
          }
        })
      })
      .catch(error => {
        console.error(error)
      })
  })

  Promise.all(importPromises).then(() => {
    // Dynamically render federated modules to the page
    federatedModules.forEach(federatedModule => {
      const moduleName = federatedModule.getAttribute('data-federated-name')
      const moduleProps = federatedModule.getAttribute('data-federated-props')

      if (moduleName) {
        const module = System.import(moduleName)
        module
          .then(module => {
            const FederatedModule = module.default
            const props = moduleProps ? JSON.parse(moduleProps) : {}
            FederatedModule.render(federatedModule.id, props, sharedModules.entries())
          })
          .catch(err => {
            console.error(err)
          })
      }
    })
  })
}

export default renderFederatedModules

/*
// Broadband Import Map - AvailabilityChecker
{
  "imports": {
    "react": "https://cdn.vodafone.co.uk/broadband/assets/federated/shared/react@17.0.1/react.production.min.js",
    "react-dom": "https://cdn.vodafone.co.uk/broadband/assets/federated/shared/react-dom@17.0.1/react-dom.production.min.js",
    "AvailabilityChecker": "https://cdn.vodafone.co.uk/broadband/assets/federated/availability-checker/index.16315312311.js",
    'Header': 'https://cdn.vodafone.co.uk/broadband/assets/federated/header/index.16315312311.js',
  }
}
*/

// <div id="" data-federated-scope="broadband" data-federated-name="AvailabilityChecker" data-federated-props="{}" />
//
//   export const render = (mountId: string, module: string,  ReactDOM: any) => {
//     ReactDOM.render(module, document.getElementById(mountId));
//   }

/*
<script type="systemjs-importmap">
  {
  "imports": {
    "react": "https://cdn.vodafone.co.uk/broadband/assets/federated/shared/react@17.0.1/react.production.min.js",
    "react-dom": "https://cdn.vodafone.co.uk/broadband/assets/federated/shared/react-dom@17.0.1/react-dom.production.min.js",
    "AvailabilityChecker": "https://cdn.vodafone.co.uk/broadband/assets/federated/availability-checker/index.16315312311.js",
    'Header': 'https://cdn.vodafone.co.uk/broadband/assets/federated/header/index.16315312311.js',
  }
}
</script>
 */
