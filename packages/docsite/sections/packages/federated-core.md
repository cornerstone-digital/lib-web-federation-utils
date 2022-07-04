# @vf/federated-core

This library contains all the core functionality for the [Federated Runtime Engine](/sections/architecture/federated-architecture?id=federated-application-routing-engine-fare) and is the key component for building your [Federated Application](/sections/architecture/federated-architecture?id=federated-frontend-applications-ffa). Without this you cannot use the other packages in this library.

### Installation

1. Make sure you've updated your .npmrc file to have the following line:

`@vf:registry=https://vfuk-digital.pkgs.visualstudio.com/_packaging/Web/npm/registry/`

2. Run `yarn add @vf/federated-core`

### getFederatedRuntime()

This function returns (or creates) an instance of the [Federated Runtime Engine]() which is the engine room of a [Federated Application]().

Example usage:

```typescript
import { getFederatedRuntime } from '@vf/federated-core'

const federatedRuntime = getFederatedRuntime()
```

Once imported and executed as well as returning an instance of the runtime, it also exposes a global variable on the window scope `__FEDERATED_CORE__` which the runtime uses to keep track of it's state and registered components.

### createSharedModule

This function allows you to create and share a module such as shared service or utility library.

Example usage:

```typescript jsx
import { createSharedModule } from '@vf/federated-core'

const someMethod = () => {
  console.log('called')
}

const SampleService = createSharedModule({
  name: 'sampleService',
  scope: 'broadband',
  methods: {
    someMethod,
  },
})

export const { name, scope, methods } = SampleService
```

### Event Service

The core library also exposes an event service which can be used to subscribe to and publish events which can be used for cross component communication.

Subscribing to Runtime Events:

```typescript jsx
import {
  eventService,
  FederatedEventKeys,
  FederatedEvents,
} from '@vf/federated-core'

eventService.register<FederatedEventKeys>(
  FederatedEvents.RUNTIME_BOOTSTRAPPED,
  (event) => {
    console.log('Runtime Bootstrapped', event)
  }
)
```

To see a full list of available events, see the [Federated Lifecycle Events](/sections/packages/federated-core?id=federated-lifecycle-events) section.

Using Custom Events:

```typescript jsx
import { eventService, EventData } from '@vf/federated-core'

enum CustomEvents {
  TestEvent = 'test-event',
}

type CustomEventKeys = `${CustomEvents}`

type CustomEventsMap = EventData<CustomEvents.TestEvent, { id: number }>

eventService.register<CustomEventKeys>(CustomEvents.TestEvent, (event) => {
  console.log('eventService', event)
})

eventService.emit<CustomEventsMap>({
  type: CustomEvents.TestEvent,
  payload: {
    id: 1,
  },
})
```

### Federated Lifecycle Events

The following events are available for the runtime to listen to:

#### Runtime Bootstrap Events

| Event Key                | Description                                                    |
| ------------------------ | -------------------------------------------------------------- |
| RUNTIME_BEFORE_BOOTSTRAP | Fired before the runtime is bootstrapped                       |
| RUNTIME_BOOTSTRAPPED     | Fired immediately after the runtime has been bootstrapped      |
| RUNTIME_BOOTSTRAP_ERROR  | Fired if there is an error during bootstrapping of the runtime |

#### Runtime Start Events

| Event Key            | Description                                               |
| -------------------- | --------------------------------------------------------- |
| RUNTIME_BEFORE_START | Fired before the runtime is started                       |
| RUNTIME_STARTED      | Fired immediately after the runtime has been started      |
| RUNTIME_START_ERROR  | Fired if there is an error during starting of the runtime |

#### Pre-fetch Module Events

| Event Key                      | Description                                               |
| ------------------------------ | --------------------------------------------------------- |
| RUNTIME_MODULES_PREFETCH_START | Fired before prefetching of modules starts                |
| RUNTIME_BEFORE_MODULE_PREFETCH | Fired before prefetching of a module                      |
| RUNTIME_MODULE_PREFETCHED      | Fired after prefetching of a module                       |
| RUNTIME_MODULE_PREFETCH_ERROR  | Fired if there is an error during prefetching of a module |
| RUNTIME_MODULES_PREFETCHED     | Fired after prefetching of modules                        |

#### Pre-fetch Route Events

| Event Key                     | Description                                              |
| ----------------------------- | -------------------------------------------------------- |
| RUNTIME_ROUTES_PREFETCH_START | Fired before prefetching of routes starts                |
| RUNTIME_BEFORE_ROUTE_PREFETCH | Fired before prefetching of a route                      |
| RUNTIME_ROUTE_PREFETCHED      | Fired after prefetching of a route                       |
| RUNTIME_ROUTE_PREFETCH_ERROR  | Fired if there is an error during prefetching of a route |
| RUNTIME_ROUTES_PREFETCHED     | Fired after prefetching of routes                        |

#### Import Map Events

| Event Key                       | Description                                                       |
| ------------------------------- | ----------------------------------------------------------------- |
| IMPORT_MAP_OVERRIDES_LOADED     | Fired when import map overrides has been loaded                   |
| IMPORT_MAP_OVERRIDES_LOAD_ERROR | Fired if there is an error during loading of import map overrides |

#### Routing Events

| Event Key            | Description                                      |
| -------------------- | ------------------------------------------------ |
| ROUTE_CHANGED        | Fired when the route changes                     |
| ROUTE_ERROR          | Fired if there is an error during routing        |
| ROUTE_ALREADY_ACTIVE | Fired if the route is already active             |
| ROUTE_NAVIGATE_TO    | Fired when navigating to a new route             |
| POPSTATE_EVENT_FIRED | Fired if a new popstate event has been fired     |
| POPSTATE_EVENT_ERROR | Fired if there is an error during popstate event |

#### Native Module Events

| Event Key                | Description                                                  |
| ------------------------ | ------------------------------------------------------------ |
| NATIVE_MODULE_LOADING    | Fired when a native module is being loaded                   |
| NATIVE_MODULE_LOADED     | Fired when a native module has been loaded                   |
| NATIVE_MODULE_LOAD_ERROR | Fired if there is an error during loading of a native module |

#### SystemJS Events

| Event Key               | Description                                           |
| ----------------------- | ----------------------------------------------------- |
| SYSTEMJS_LOADED         | Fired when SystemJS has been loaded                   |
| SYSTEMJS_LOAD_ERROR     | Fired if there is an error during loading of SystemJS |
| SYSTEMJS_MODULE_LOADING | Fired when a SystemJS module is being loaded          |
| SYSTEMJS_MODULE_LOADED  | Fired when a SystemJS module has been loaded          |

#### Module Registration Events

| Event Key                 | Description                                                |
| ------------------------- | ---------------------------------------------------------- |
| MODULE_BEFORE_REGISTER    | Fired before a module is registered                        |
| MODULE_REGISTERED         | Fired after a module is registered                         |
| MODULE_ALREADY_REGISTERED | Fired is a module has already been registered              |
| MODULE_REGISTER_ERROR     | Fired if there is an error during registration of a module |

#### Module Loading Events

| Event Key             | Description                                           |
| --------------------- | ----------------------------------------------------- |
| MODULE_BEFORE_LOAD    | Fired before a module is loaded                       |
| MODULE_LOADED         | Fired after a module is loaded                        |
| MODULE_ALREADY_LOADED | Fired if a module has already been loaded             |
| MODULE_LOAD_ERROR     | Fired if there is an error during loading of a module |
| MODULE_VALIDATE_PROPS | Fired during module loading to validate props         |
| MODULE_STATE_CHANGED  | Fired when the module state changes                   |

#### Module Bootstrap Events

| Event Key               | Description                                                 |
| ----------------------- | ----------------------------------------------------------- |
| MODULE_BEFORE_BOOTSTRAP | Fired before a module is bootstrapped                       |
| MODULE_BOOTSTRAPPED     | Fired after a module is bootstrapped                        |
| MODULE_BOOTSTRAP_ERROR  | Fired if there is an error during bootstrapping of a module |

#### Module Mount Events

| Event Key              | Description                                            |
| ---------------------- | ------------------------------------------------------ |
| MODULE_BEFORE_MOUNT    | Fired before a module is mounted                       |
| MODULE_MOUNTED         | Fired after a module is mounted                        |
| MODULE_ALREADY_MOUNTED | Fired if a module has already been mounted             |
| MODULE_MOUNT_ERROR     | Fired if there is an error during mounting of a module |

#### Module Unmount Events

| Event Key             | Description                                              |
| --------------------- | -------------------------------------------------------- |
| MODULE_BEFORE_UNMOUNT | Fired before a module is unmounted                       |
| MODULE_UNMOUNTED      | Fired after a module is unmounted                        |
| MODULE_NOT_MOUNTED    | Fired if a module is not mounted                         |
| MODULE_UNMOUNT_ERROR  | Fired if there is an error during unmounting of a module |

#### Module Update Events

| Event Key            | Description                                            |
| -------------------- | ------------------------------------------------------ |
| MODULE_BEFORE_UPDATE | Fired before a module is updated                       |
| MODULE_UPDATED       | Fired after a module is updated                        |
| MODULE_UPDATE_ERROR  | Fired if there is an error during updating of a module |
