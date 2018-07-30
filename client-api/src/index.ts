/*!
 * GraphQL Express Server
 */
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";

import { makeExecutableSchema } from "graphql-tools";

import * as http from "http";
import * as https from "https";
import * as multer from "multer";
import * as fs from "fs";
import { GraphQLSchema, GraphQLError } from "graphql";
import * as path from "path";
import captureResolvers from "./capture/resolver";
import { authFilter, initAuth } from "./filters/auth";
import surfaceResolvers from "./surface/resolver";
import { Logger } from "./util/logging/logger";
import { getRequestContext, RequestContext } from "./filters/request-context";
import * as contextService from "request-context";
import * as morgan from "morgan";
// import * as rfs from "rotating-file-stream";
import { isProd, isLocal } from "./config";
import * as helmet from "helmet";
import * as compression from "compression";
import { importEvernoteNoteUpload } from "./upload/services/evernote-import";
import { ConflictError } from "./util/exceptions/confict-error";
import { getBasic } from "./db/services/session";
import { UserUrn } from "./urn/user-urn";
import { SessionUrn } from "./urn/session-urn";
import { createCapturedLink } from "./capture/services/captured-link";
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

initAuth();

const baseMorganFormat =
  `:date[iso] :reqId :userId :env :remote-addr :remote-user :referrer :user-agent ` +
  `:method :url HTTP/:http-version ` +
  `:status :res[content-length] :response-time`;

const reqMorganFormat = `req:  ${baseMorganFormat}`;
const respMorganFormat = `resp: ${baseMorganFormat}`;

morgan.token("env", () => {
  return process.env.NODE_ENV;
});
morgan.token("reqId", req => {
  const requestContext = (req["requestContext"] as RequestContext) || null;
  return requestContext ? requestContext.reqId : "-";
});
morgan.token("userId", req => {
  const requestContext = (req["requestContext"] as RequestContext) || null;
  return requestContext ? requestContext.loggedInUser.urn.toRaw() : "-";
});

const HTTPS_PORT = 8443;
const HTTP_PORT = 8080;
const app = express();

app.get("/", (_, res) => {
  res.send("running");
});
app.get("/healthy", (_, res) => {
  getBasic(
    UserUrn.fromRaw("urn:hex:user:6eb4487b-8e73-4c20-9048-ebb0c89ff0c6"),
    SessionUrn.fromRaw("urn:hex:session:3bad771c-8ad4-4b70-99b7-bc4f4f69d9d4")
  )
    .then(session => {
      res.send(session);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

app.use(morgan(reqMorganFormat, { immediate: true }));
app.use(contextService.middleware("request"));
app.use(helmet());

if (isProd()) {
  app.use(
    cors({
      origin: ["https://tangleapp.co"],
      methods: ["GET", "POST"],
      optionsSuccessStatus: 200
    })
  );
} else {
  app.use(cors());
}
app.use(bodyParser.json());

app.use(morgan(respMorganFormat));

app.use(authFilter);
app.use(setRequestContext);
app.use(compression());

app.use(
  "/graphql",
  graphqlExpress({ schema: executableSchema, formatError: maskError })
);

// For local allow insecure connection
if (isLocal()) {
  http.createServer(app).listen(HTTP_PORT, () => {
    LOGGER.info("Api HTTP listening on port " + HTTP_PORT);
  });
} else {
  const httpsOptions = {
    key: fs.readFileSync(process.env.TLS_KEY),
    cert: fs.readFileSync(process.env.TLS_CERT)
  };
  https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
    LOGGER.info("Api HTTPS server listening on port " + HTTPS_PORT);
  });
}
LOGGER.info(`env is ${process.env.NODE_ENV}`);

function setRequestContext(req, _, next): void {
  req.requestContext = getRequestContext();
  next();
}

function maskError(error: GraphQLError): GraphQLError {
  LOGGER.error(error.stack);
  if (process.env.NODE_ENV === "production") {
    return new GraphQLError("Error");
  } else {
    return error;
  }
}

const upload = multer({
  limits: {
    fileSize: 1 * 1000 * 1000
  }
});
app.post("/capturedLinks", handleCreateCaptureLink);
app.post("/uploadHtml", upload.single("file"), handleUpload, handleUploadError);

function handleCreateCaptureLink(req, res): void {
  if (!req.body.title) {
    res.status(400).send("title is required");
    return;
  }
  if (!req.body.url) {
    res.status(400).send("url is required");
    return;
  }
  createCapturedLink(req.body)
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      LOGGER.error(err);
      res.sendStatus(500);
    });
}

function handleUpload(req, res): void {
  importEvernoteNoteUpload(req["file"])
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
}

function handleUploadError(err, _req, res, _next): void {
  if (err) {
    let status = 500;
    if (err.code === "LIMIT_FILE_SIZE") {
      LOGGER.warn("Attempted upload with too large of a file");
      status = 400;
    }
    LOGGER.error(err);
    if (isProd()) {
      res.sendStatus(status);
    } else {
      res.status(status).send(err);
    }
  }
}
