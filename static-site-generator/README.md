# Static Site Generator

> This directory contains the static site generator that produces our company website hosted from the `gh-pages` branch of this repository. This generator is implemented with [GatsbyJS](https://www.gatsbyjs.org/).

## Blog Posts

> This section describes how to develop and deploy blog posts on our company site.

1. Begin by ensuring your repository is up to date. **Enter:** `git pull` into your terminal. If you encounter a merge error, seek help. If successful, continue on!

2. Create your own branch. **Enter:** `git checkout -b name-of-your-branch`. Now you are working in your new branch. Yay.

3. Create a file and folder for your blog post

  * Navigate to the blog folder in the HEX-VENTURES repository

  * Click on blog so that it is highlighted

  * Click on the new folder icon which will appear next to the HEX-VENTURES header

  * Name your folder using the following syntax: `mm-dd-yy[name-of-blog]`

  * With the new blog folder now highlighted, click the new document icon that appears in the HEX-VENTURES header

  * Name the file index.md

4. Before you begin adding content, let's set the metadata for the post. To do this, either copy and paste the following text into markdown, or see a previous post and copy the formatting. The choice is yours!:

```html
---
path: '/blog/name-of-blog
date: 'yyyy-mm-dd'
title: 'title-of-blog'
subtitle: 'subtitle-of-blog'
author: 'Your Name'
tags: ['xxxx', 'yyyy', 'zzzz', 'nnnn']
---
```

5. You can see what your blog post looks like on the website in order to reformat it to your liking. To do this, follow these steps:

  * First, navigate to the `static-site-generator` directory.

  * **Enter:** `pwd` to see what directory you are currently in.

  * **Enter:** `cd static-site-generator` to get where you need to go.

  * Once you are in the right directory, **Enter:** `yarn develop`

  * You will be provided a URL, enter that into your browser and you will be able to see what you are creating in a "sandbox", its playtime.

6. Once you are happy with how the blog post looks on the website, we need to merge the branch you are working in with the `master` branch. To do this, follow these steps:

  * First, make sure you have saved your .md file

  * **Enter:** `git add ./static-site-generator/blog/mm-dd-yy[name-of-blog]` or simply `git add .` to stage all the new or modified documents in your current directory. If you are in anyway confused by that, just use the former syntax and ask someone for clarification.

  * **Enter:** `git commit -m 'message'` see the contribution guidelines [README](https://github.com/hex-ventures/hex-ventures/blob/master/CONTRIBUTING.md) for more information on syntax.

  * **Enter:** `git push`

  * You will be prompted to then use a `git push` command in your terminal to complete the push. Simply copy and paste the entire command and press enter.

  * Then, go to the github repo in your browser and create a pull request.

  * Once a team member has reviewed, the post you created on the new branch you created will be merged with the master branch.

7. In your terminal, **enter:** `yarn deploy`. Note, make sure you are in the static-site-generator directory before you do this. It will take a couple minutes for the site to be redeployed, but soon enough you will be able to refresh the hex.ventures web page and see your blog post there.