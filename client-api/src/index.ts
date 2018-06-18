/*!
 * GraphQL Express Server
 */
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";

import { makeExecutableSchema } from "graphql-tools";

import { graphiqlExpress, graphqlExpress } from "apollo-server-express";
import * as formidable from "express-formidable";
import * as fs from "fs";
import { GraphQLSchema, GraphQLError } from "graphql";
import * as path from "path";
import captureResolvers from "./capture/resolver";
import { authFilter, initAuth } from "./filters/auth";
import surfaceResolvers from "./surface/resolver";
import { importEvernoteNoteUpload } from "./upload/services/evernote-import";
import { ConflictError } from "./util/exceptions/confict-error";
import { Logger } from "./util/logging/logger";

const LOGGER = new Logger("src/index.ts");

const schema = fs.readFileSync(
  path.join(__dirname, "../data-template/schema.graphql"),
  "utf8"
);

/*!
 * Make the schema executable
 */

const executableSchema: GraphQLSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers: [captureResolvers, surfaceResolvers]
});

initAuth();

const PORT = 8080;
const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(
    cors({
      origin: ["https://web-client-prod-dot-opit-193719.appspot.com"],
      methods: ["GET", "POST"],
      optionsSuccessStatus: 200
    })
  );
} else {
  app.use(cors());
}

app.use(authFilter);

// bodyParser is needed just for POST.
app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress({ schema: executableSchema, formatError: maskError })
);
app.use(formidable());
app.post("/uploadHtml", (req, res) => {
  if (req["files"].file.type !== "text/html") {
    res.status(400).send("Unsupported content type");
  }
  importEvernoteNoteUpload(req["files"].file)
    .then(() => {
      res.sendStatus(200);
    })
    .catch(error => {
      if (error instanceof ConflictError) {
        res.status(409).end("Object already exists, please delete it first");
      } else {
        LOGGER.error(error);
        res.sendStatus(500);
      }
    });
});

app.get("/graphiql", graphiqlExpress({ endpointURL: "/graphql" })); // if you want GraphiQL enabled

app.listen(PORT, () => {
  LOGGER.info("Api listening on port " + PORT);
});

function maskError(error: GraphQLError): GraphQLError {
  LOGGER.error(error.message, error.stack);
  if (process.env.NODE_ENV === "production") {
    return new GraphQLError("Error");
  } else {
    return error;
  }
}
