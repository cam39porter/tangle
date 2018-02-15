# Hex Ventures Read Me

> We are building the next generation of knowledge management systems. This guide explains how we code and where we put things.

## General Guidelines

> This section describes the practices we follow to keep our code functioning and organized.

### File / Directory Naming Convention

> The following are a set of rules for naming files and folder to promote consistency and eliminate unnecessary decision making.

* A file name can be up to 255 characters long and can contain letters, numbers, and underscores.

* A file name should be lowercase.

* A file name should not contain spaces. Instead of spaces `-` should be used.

* File names should be as descriptive and meaningful as possible, while optimizing for the minimum number of words needed to capture the meaning.

* Certain characters have special meaning to the operating system. Avoid using these characters when you are naming files. These characters include the following:

  ```sh
  / \ " ' * ; - ? [ ] ( ) ~ ! $ { } &lt > # @ & | space tab newline
  ```

* A file name is hidden from a normal directory listing if it begins with a dot (.). When the ls command is entered with the -a flag, the hidden files are listed along with regular files and directories.

* Directories follow the same naming conventions as files.

### NPM Packaging

> Certain directories are also `npm` modules. This section discusses how to publish new versions of those modules to our private organization repository `hex-ventures`.

1. Make sure you have `npm` and `nvm` on your local system.

2. Make sure you have created an [NPM](https://www.npmjs.com/) account with your Hex Ventures email.

3. Make sure you have had your `npm` account added to the organization. Contact an administrator if you need to be added.

4. Login into your Hex Ventures `npm` account on the command line by running `npm login`.

5. Install the [`cut-release`](https://www.npmjs.com/package/cut-release) to make `npm` module releases faster. This can be done by running `npm install -g cut-release`.

6. Get out there and make one of our modules better.

7. Now that you have made one our modules better and it has been pulled into `master`, you need to publish a new version. We follow [semver](https://semver.org/). To publish the update run `cut-release` from within the modules directory. This will walk you through choosing the appropriate version and ultimately pushing the module to our `npm` repo.

8. Now that a new version of the module has been published, update any other services that depend on that module, like a Cloud Function. After updating these, test and deploy them.

### Contributions

> For more information on how to contribute to this repository see the [`CONTRIBUTIONS.md`](https://github.com/hex-ventures/hex-ventures/blob/master/CONTRIBUTING.md) file in this repository.

## Directories

> This section provides a brief description of each directory in this repository to help you understand where to look for what you need and where to add things that you create.

### [Chrome Extension](https://github.com/hex-ventures/hex-ventures/tree/master/chrome-extension)

> This directory contains our Chrome extension built with `React` and `Tachyons`.

### [Cloud Functions](https://github.com/hex-ventures/hex-ventures/tree/master/cloud-functions)

> This directory contains all of our Cloud Functions, with each subdirectory corresponding a single Cloud Function.

* You must use Node version `6.11.5` when building these functions.

* The name of the subdirectory containing the function must be the same as the name of functions trigger.

### [Docs](https://github.com/hex-ventures/hex-ventures/tree/master/docs)

> This directory contains all of our documents (not code). These documents describe anything form legal agreements to cultural elements like strengths and weaknesses. We keep all of these things here so that they are transparent and we can all see how they change and evolve over time.

### [Server](https://github.com/hex-ventures/hex-ventures/tree/master/server)

> This directory contains a Node server implemented using the [Express](https://expressjs.com/) framework. Core components include a [GrapqhQL](http://graphql.org/) function.

* You must use Node version `6.11.5`. This allows this server to be used with Cloud Functions.

### [Static Site Generator](https://github.com/hex-ventures/hex-ventures/tree/master/static-site-generator)

> This directory contains the static site generator that produces our company website hosted from the `gh-pages` branch of this repository. This generator is implemented with [GatsbyJS](https://www.gatsbyjs.org/).

### [VS Code](https://github.com/hex-ventures/hex-ventures/tree/master/.vscode)

> This directory contains workspace setting for the VS Code IDE.

* You can install Visual Studio [here](https://www.visualstudio.com/vs/).
