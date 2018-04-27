/*!
 * GraphQL Express Server
 */
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as requestContext from "request-context";
import * as formidable from "formidable";

import { makeExecutableSchema } from "graphql-tools";

import resolvers from "./resolvers/capture";
import { GraphQLSchema, formatError } from "graphql";
import { authFilter, initAuth } from "./filters/auth";
import * as fs from "fs";
import * as path from "path";
import { importEvernoteNote } from "./upload/services/evernote-import";

const schema = fs.readFileSync(
  path.join(__dirname, "../data-template/schema.graphql"),
  "utf8"
);

const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");

/*!
 * Make the schema executable
 */

const executableSchema: GraphQLSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers: resolvers
});

const PORT = 8080;
const app = express();

initAuth();

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

app.use(requestContext.middleware("request"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(authFilter);

app.post("/uploadHtml", (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req);
  form.on("file", (name, file: formidable.File) => {
    if (file.type !== "text/html") {
      res.status(400).end("Unsupported content type");
    }
    fs.readFile(file.path, function(err, data) {
      importEvernoteNote(data)
        .then(b => {
          if (b) {
            res.sendStatus(200);
          } else {
            res
              .status(409)
              .end("Object already exists, please delete it first");
          }
        })
        .catch(err => {
          console.log(err);
          res.sendStatus(500);
        });
    });
  });
});

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
