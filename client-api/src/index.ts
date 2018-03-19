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
