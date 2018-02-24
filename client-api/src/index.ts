/*!
 * GraphQL Express Server
 */
import * as express from "express";
import * as bodyParser from "body-parser";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";

import schema from "./schema";
import resolvers from "./resolvers/capture";
import { GraphQLSchema } from "graphql";

/*!
 * Make the schema executable
 */

const executableSchema: GraphQLSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers: resolvers
});

const PORT = 3000;
const app = express();

// bodyParser is needed just for POST.
app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress({ schema: executableSchema })
);
app.get("/graphiql", graphiqlExpress({ endpointURL: "/graphql" })); // if you want GraphiQL enabled
app.listen(PORT, () => {
  console.log("Api listening on port " + PORT);
});
