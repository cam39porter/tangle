# Client Api

This directory contains a Node server implemented using the [Express](https://expressjs.com/) framework. Core components include a [GrapqhQL](http://graphql.org/) function.

## Starting the server

> npm i <br>
> npm start

## Hitting the server

Via curl:

> curl -v "http://localhost:3000/graphql?query..."

Via graphical

> http://localhost:3000/graphiql > <br>
> query {
> ...
> }

## Debugging

You can auto-compile with the following command so that all you need to do is refresh

> npm run compile

In vscode, hit F5. (Must not be running the server elsewhere, or set up a different port) Set breakpoints as desired and hit the app in a way defined above.
