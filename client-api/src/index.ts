/*!
 * GraphQL Express Server
 */
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as requestContext from "request-context";

import { makeExecutableSchema } from "graphql-tools";

import schema from "./schema";
import resolvers from "./resolvers/capture";
import { GraphQLSchema } from "graphql";
import { authFilter, initAuth } from "./filters/auth";

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");

/*!
 * Make the schema executable
 */

const executableSchema: GraphQLSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers: resolvers
});

initAuth();

const PORT = 8080;
const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(
    cors({
      origin: [
        "https://desktop-client-dot-opit-193719.appspot.com",
        "https://web-client-dot-opit-193719.appspot.com"
      ],
      methods: ["GET", "POST"],
      optionsSuccessStatus: 200
    })
  );
} else {
  app.use(cors());
}

app.use(requestContext.middleware("request"));

// bodyParser is needed just for POST.
app.use(
  "/graphql",
  authFilter,
  bodyParser.json(),
  graphqlExpress({ schema: executableSchema })
);

app.get("/graphiql", graphiqlExpress({ endpointURL: "/graphql" })); // if you want GraphiQL enabled

app.use(bodyParser.urlencoded({ extended: false }));

app.listen(PORT, () => {
  console.log("Api listening on port " + PORT);
});
