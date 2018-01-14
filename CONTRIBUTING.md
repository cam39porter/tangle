# Contribution Guidelines

> How should I write my commit messages and PR titles?

We utilize the conventional-changelog-standard for writing our commit messages and PR titles. Why do we do this? The standard comes in really handy when we need to determine what kinds of information should go into our release documentation (as the word changelog in the title might suggest!).

Note that this standard applies to both your commit messages and PR titles so you'll need to draft the appropriate commit message when you run `git commit -m [MESSAGE]` or use the interface on your visual git interface.

You can use the following verbs as part of your commit messages/PR titles.

* `fix`: For when you have fixed a bug.

* `feat`: For when you have added a new feature.
chore: For when you've done a small chore on the repository such as updating a script in package.json or changing your code based on feedback from the linter.

* `docs`: For when you've added documentation.

* `style`: For changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc). refactor: For when you've refactored a portion of the application.

* `ux`: For when you have changed a part of the user experience not covered by the previous verbs. In addition to the active verb, you'll also need to include the affected component in the commit message or PR title. The structure for this is as follows.

If you've made the change to a React component, use the components name, such as CodeCell. If you've made a change to a reducer, use the name of the reducer, such as document or app.

> What should the final commit message look like?

```sh

git commit -m 'fix(server): broken get handler

```