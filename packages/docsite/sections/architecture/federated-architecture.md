# Federated Architecture (FA)
Federated Architecture is an enterprise architecture pattern allows team autonomy and sharing of logic and features between teams by de-centralising business rules and logic.

The pattern uses autonomous components which communicate with each other using messages/events, often using an [Event Service](/sections/packages/federated-core?id=event-service) which allows for applications to publish and listen to events and act accordingly.

## Complexity Problems
Complex architectures are extremely hard to manage, not only from a deployment and infrastructure perspective, but also in terms of getting buy-in and sign off from a large number of stakeholders.

The pattern's intention is to simplify management of complex applications by providing the highest level of autonomy and separation in order to reduce the complexity. 

Federated Architecture encourages you to think of your application in terms of a composition of loosely coupled, agile, and independently deployable modules.

## What are the benefits?
- Lifecycle Independence (LI)
  - This means that each local team can define its own lifecycle concept, roadmap and release plan for its product, independently of others.
- Operational Independence (OI)
  - This means that in case of emergency each local team, having the know-how about their products and computer systems, is able to fix and operate them without relying on others' knowledge and willingness to support them.
- Platform Independence (PI)
  - This means that system and application platforms can be mixed as well as computer languages as long as they are able to interpret the model and produce the expected results.

## What pieces make up a Federated Architecture?

### Federated Runtime Engine (FRE)
The Federated Runtime Engine is a global runtime which is responsible for the orchestration and management of your [Federated Frontend Application's](/sections/architecture/federated-architecture?id=federated-frontend-applications-ffa), [Federated Journey's](/sections/architecture/federated-architecture?id=federated-journeys-fj), [Federated Components](/sections/architecture/federated-architecture?id=federated-components-fc) and [Federated Shared Modules](/sections/architecture/federated-architecture?id=federated-shared-modules-fsm).

The runtime engine has the following functionality built in:

- [Application Lifecycle Management](/sections/packages/federated-core?id=federated-lifecycle-events)
- [Component Orchestration](/sections/architecture/federated-architecture?id=federated-components-fc)
- [Routing Engine](/sections/architecture/federated-architecture?id=federated-application-routing-engine-fare)
- [Events Service](/sections/packages/federated-core?id=event-service)
- [Logger Service](/sections/packages/federated-core?id=logger-service)

The runtime is instantiated by either the [Shell Application](/sections/architecture/shell-architecture) if part of a larger application or the [Federated Entry Point](/sections/architecture/federated-architecture?id=federated-entry-points-fep) if there is no shell implemented.

### Federated Application Routing Engine (FARE)
The Federated Application Routing Engine is part of the [Federated Runtime Engine](/sections/architecture/federated-architecture?id=federated-application-routing-engine-fare) and is responsible for handling top-level routing between [Federated Journeys](/sections/architecture/federated-architecture?id=federated-journeys-fj  ) and mounting / unmounting [Federated Components](/sections/architecture/federated-architecture?id=federated-components-fc) based on the current url being visited.

This routing engine is not to be confused with routing engines built into specific frameworks such as [React Router]() and sits at the top-level of either the [Shell Application](/sections/architecture/shell-architecture) or [Federated Application](/sections/architecture/federated-architecture?id=federated-frontend-applications-ffa) depending on which method is being used.

Individual [Federated Journey's](/sections/architecture/federated-architecture?id=federated-journeys-fj) can implement their own internal router using for their internal routing using React Router or similar and these will work as normal once the component is mounted.

### Federated Frontend Applications (FFA)
Federated Frontend Applications are an alternative to using the [Shell Architecture](/sections/architecture/shell-architecture). These applications are generally managed by a single team and are less distributed. They will normally consist of one or more [Federated Journey's](/sections/architecture/federated-architecture?id=federated-journeys-fj) which are owned by the team in question. These journey's can still consume [Federated Components](/sections/architecture/federated-architecture?id=federated-components-fc) from an external source, and this is encouraged to try and facilitate code sharing where possible.  

### Federated Entry Points (FEP)
Federated Entry Points are typically the points at which a user can enter a hosted application. These are normally the place where an instance of the [Federated Runtime Engine](/sections/architecture/federated-architecture?id=federated-runtime-engine-fre) has been instantiated and the point at which your can register your [Federated Journey's](/sections/architecture/federated-architecture?id=federated-journeys-fj) and this also where you bootstrap and start the main application. This is typically part of a [Shell Architecture](/sections/architecture/shell-architecture) but can also been handled within individual teams within their own [Federated Frontend Application](/sections/architecture/federated-architecture?id=federated-components-fc) if they are not yet ready to integrate with the shell or if no shell exists yet.

### Federated Journeys (FJ)
Federated Journeys are one of the building blocks of your Federated Application and typically will house a complete journey or group of functionality. These journeys are normal frontend applications and can be written in any frontend framework, such as ReactJS. They are able to consume by locally hosted and remote [Federated Components](/sections/architecture/federated-architecture?id=federated-components-fc) as well as [Federated Shared Modules](/sections/architecture/federated-architecture?id=federated-shared-modules-fsm) to access shared services or helpers as needed.

### Federated Components (FC)
Federated Components are the smallest piece you can create within the Federated Architecture alongside [Federated Shared Modules](/sections/architecture/federated-architecture?id=federated-shared-modules-fsm). Teams can expose these components in order share them cross-team. Typically, these are small, self-contained components, with little to no logic which are independently deployable and consumable. Any functionality that the component has should be contained internally and its public API should be as limited as possible to avoid coupling between consumers and the team who owns them.

### Federated Shared Modules (FSM)
Federated Shared Modules allow teams to expose and share logic and core functionality such as wrappers around an API Service, or business logic helpers. A good example of this would be a BasketService which could encapsulate all the logic for interacting the Basket API.

* DIAGRAM HERE *
