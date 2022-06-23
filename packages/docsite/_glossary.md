##### Federated Architecture (FA)
It is a concept for building frontend applications in a more modular, distributed manner, across multiple teams and composed at runtime.

##### Federated Runtime Engine (FRE)
It is the runtime engine that is responsible for rendering the components of a federated application.

##### Federated Frontend Application (FFA)
It is the application that is being rendered by the Federated Runtime Engine.

##### Federated Journey (FJ)
It is the journey that is being rendered by the Federated Runtime Engine. Routes are defined in the FJ. An example of an FJ would be the /basket and /checkout routes.

##### Federated Component (FC)
It is the component that is being rendered within a Federated Journey within the Federated Application. An example of an FC would be the BasketContents component.

##### Federated Shared Module (FSM)
It is the shared module that is being rendered within a Federated Journey within the Federated Application. An example of an FSM would be the BasketService which would contain shared logic for interacting the basket API service.

##### Federated Entry Point (FEP)
It is the entry point that bootstraps the Federated Runtime Engine and starts the application. Typically, this is the entry point that is written in JavaScript.

##### Shell Application (Shell)
Shell is the web application that is responsible for rendering the content of a federated application. It is responsible for fetching the components that make up the application and rendering them. It is also responsible for fetching the stylesheets and scripts that are needed to render the components. The Shell also imports the Federated Runtime Engine (FRE) and the Federated Application (FED) to render the application.

##### Client-Side Rendering (CSR)
It is a technique for rendering a web application client-side without the need for a round-trip to the server.

##### First Route As Host (FRAH)
It is the concept of the first route hit within the Federated Application becomes the host for the remainder of the journey and the rest of the routes are rendered within the host.

##### Application Lifecycle Events (ALE)
It is the lifecycle events that are triggered by the Shell when the application is loaded, unloaded, and when the user navigates within the application.

##### Federated Application Routing Engine (FARE)
It is the routing engine that is used by the Shell to determine which component to render and which component to unmount based on the current URL.

##### Micro Frontend (MFE)
It is a concept of a small, lightweight, independently deployable web application that is rendered within the Shell.
