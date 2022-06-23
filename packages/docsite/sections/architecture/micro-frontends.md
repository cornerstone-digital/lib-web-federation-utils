# Micro Frontends

Micro Frontends is an architectural style where independently deliverable frontend applications are composed into a greater whole.

#### Key benefits:
- Smaller, more cohesive and maintainable codebases
- More scalable organisations with decoupled, autonomous teams
- The ability to upgrade, update, or even rewrite parts of the frontend in a more incremental fashion than was previously possible

### Incremental Upgrades
One key benefits of micro frontends is the ability to do incremental upgrades without having to do an all or nothing upgrade of a key component. This allows for a more managed rollout of upgrades and allows teams to take control of when and if they upgrade.

### Simple, decoupled codebases
The source code for each individual micro frontend will be definition be smaller than that of a single monolithic frontend. These smaller codebases tend to be simpler and easier for developers to work with and avoid a lot of complexity issues which often plague larger organisations. Micro Frontends don't limit the complexity an application can offer, but they try to offer a way to manage it in a better, more scalable way.

### Independent Deployment
Micro Frontends should be independently deployable, this reduces the scope of individual deployments, which in turn reduces risk. Each micro frontend should have their own continuous delivery pipeline, which builds, tests and deploys it all the way into production. We should be able to deploy individual frontends without needing to understand the current state of others.

### Autonomous Teams
An added benefit to de-coupled codebases and release cycles is that we get a long way towards fully independent teams, who can own, deliver and support an iteration of a particular micro-frontend without dependencies. This enables a much more efficient way of working to get value in front of the customer faster.

* DIAGRAM HERE *
