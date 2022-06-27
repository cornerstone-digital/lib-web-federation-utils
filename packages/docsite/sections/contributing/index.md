# Contributing

We welcome contributions to this project, and we are open to any pull request. However, we do have some rules:

* Any Pull Request must have an associated issue or story in our [issue tracker]()
* Pull Requests should be focused on a single feature or change, and should not be large in scope
* Pull Requests should be squashed into a single commit
* Pull Requests should have a test suite that tests the functionality of the feature or bugfix
* Pull Requests should include any documentation that is relevant to the feature or bugfix

### Reporting a Bug
To report a bug in this project, please create an issue in our [issue tracker]()

#### Contributing a Bug Fix
If you fix a bug in this project, please create a pull request.

1. Create an issue in our [issue tracker]()
2. Create a new branch off master using the following naming convention: `fix/fix-<issue-number>-<issue-title>`
3. Any changes to the code should be committed to the new branch
4. Make sure to test the new branch before merging, in order to ensure that it works as expected.
5. PR the new branch to `alpha` or `beta` as appropriate (depending on the severity of the bugfix and testing required). Discuss this with a senior member of the team to decide which branch to merge to.
6. Once merged to either `alpha` or `beta`, the bugfix should be tested using the new published version of the project.
7. If the bugfix is accepted, create a PR to master.
8. If the bugfix is not accepted, create a new PR to the branch that was merged to `alpha` or `beta`.
9. Once merged to master, the bugfix should be communicated to the team and the issue should be closed.

#### Contributing a New Feature
If you add a new feature to this project, please create a pull request.

1. Create a new story in our [Backlog]()
2. Create a new branch off master using the following naming convention: `feature/feature-<story-number>-<story-title>`
3. Any changes to the code should be committed to the new branch
4. Make sure to test the new branch before merging, in order to ensure that it works as expected.
5. PR the new branch to `alpha` or `beta` as appropriate (depending on the severity of the feature and testing required). Discuss this with a senior member of the team to decide which branch to merge to.
6. Once merged to either `alpha` or `beta`, the feature should be tested using the new published version of the project.
7. If the feature is accepted, create a PR to master.
8. If the feature is not accepted, create a new PR to the branch that was merged to `alpha` or `beta`.
9. Once merged to master, the feature should be communicated to the team and the story should be closed.

