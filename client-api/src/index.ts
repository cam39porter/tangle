/*!
 * GraphQL Express Server
 */
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";

import { makeExecutableSchema } from "graphql-tools";

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
import { getRequestContext, RequestContext } from "./filters/request-context";
import * as morgan from "morgan";
import * as rfs from "rotating-file-stream";
import { isProd, bootConfigs } from "./config";
// tslint:disable-next-line
const { graphqlExpress } = require("apollo-server-express");

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

bootConfigs();
initAuth();

morgan.token("reqId", req => {
  const requestContext = req["requestContext"] as RequestContext;
  return requestContext.reqId;
});
morgan.token("userId", req => {
  const requestContext = req["requestContext"] as RequestContext;
  return requestContext.user.urn.toRaw();
});

const PORT = 8080;
const app = express();

app.get("/", (_, res) => {
  res.send("client-api running");
});

if (isProd()) {
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
app.use(bodyParser.json());
app.use(authFilter); // REQUEST CONTEXT SET HERE

const logDirectory = path.join(__dirname, "../log");
app.use(setRequestContext);

const morganFormat =
  "[:date[iso]] [:reqId] [:userId] :remote-addr :remote-user :method :url HTTP/:http-version " +
  ":status :res[content-length] :response-time ms";
// ensure log directory exists
if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "development"
) {
  // tslint:disable-next-line:no-unused-expression
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
  // create a rotating write stream
  const accessLogStream = rfs("access.log", {
    interval: "1d", // rotate daily
    path: logDirectory
  });

  // setup the logger
  app.use(morgan(morganFormat, { stream: accessLogStream }));
} else {
  app.use(morgan(morganFormat));
}

// bodyParser is needed just for POST.
app.use(
  "/graphql",
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
        LOGGER.error(getRequestContext(), error);
        res.sendStatus(500);
      }
    });
});
app.listen(PORT, () => {
  LOGGER.info(null, "Api listening on port " + PORT);
});

function setRequestContext(req, _, next): void {
  req.requestContext = getRequestContext();
  next();
}

function maskError(error: GraphQLError): GraphQLError {
  LOGGER.error(getRequestContext(), error.message, error.stack);
  if (process.env.NODE_ENV === "production") {
    return new GraphQLError("Error");
  } else {
    return error;
  }
}
