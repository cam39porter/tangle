/*!
 * GraphQL Express Server
 */
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";

import schema from "./schema";
import resolvers from "./resolvers/capture";
import { GraphQLSchema } from "graphql";

import { createSMSCapture } from "./controllers/sms";

/*!
 * Make the schema executable
 */

const executableSchema: GraphQLSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers: resolvers
});

const PORT = 8080;
const app = express();

// Add CORS for local development
if (process.env.NODE_ENV === "development") {
  const corsOptions = {
    origin: ["http://localhost:3000/", "http://localhost:5000"],
    methods: ["GET", "POST"],
    optionsSuccessStatus: 200
  };
  app.use(cors(corsOptions));
}

// bodyParser is needed just for POST.
app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress({ schema: executableSchema })
);

app.get("/graphiql", graphiqlExpress({ endpointURL: "/graphql" })); // if you want GraphiQL enabled

app.use(bodyParser.urlencoded({ extended: false }));

app.post("/sms", createSMSCapture);

app.listen(PORT, () => {
  console.log("Api listening on port " + PORT);
});
