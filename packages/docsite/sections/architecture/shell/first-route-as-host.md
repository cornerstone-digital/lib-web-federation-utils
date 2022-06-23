# First Route as Host Concept
The First Route As Host (FRAH) is a concept that is used to describe how an application is mounted client side. The concept is that the first route a user hits when they visit the application is the host route. All other routes are then mounted as children of the host route and are routed between by the Application Routing Engine (ARE).

This allows for building a single page application that is composed of multiple routes that can be independently mounted and unmounted at runtime from remote sources.

This gives the application a more moduler feel and gives the end-user the feeling of a single page application but allows for the application to be built on top of different frameworks and by different teams and to be deployed independently of each other. 

By utilising the First Route As Host concept, multiple development teams can work on the same application and be able to share code and assets between them whilst still giving delivery teams autonomy over the way they build their applications and how they deploy them.

