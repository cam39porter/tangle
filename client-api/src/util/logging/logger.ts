import * as winston from "winston";
import { RequestContext } from "../../filters/request-context";

const winstonTransport = new winston.transports.Console({
  level: "info",
  handleExceptions: false
});

const winstonLogger = winston.createLogger({
  transports: [winstonTransport],
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    winston.format.printf(
      info => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
  exitOnError: false
});

/**
 * Exports a wrapper for all the loggers we use in this configuration
 */
const formatStr = (
  requestContext: RequestContext,
  scope: string,
  message: string
): string => {
  return `[${scope}] [${requestContext &&
    requestContext.reqId}] [${requestContext &&
    requestContext.user &&
    requestContext.user.urn}] ${message}`;
};

const parse = (args: any[]) => (args.length > 0 ? args : "");

export class Logger {
  private scope: string;
  constructor(scope: string) {
    this.scope = scope;
  }

  public info(
    requestContext: RequestContext,
    message: string,
    ...args: any[]
  ): void {
    winstonLogger.info(
      formatStr(requestContext, this.scope, message),
      parse(args)
    );
  }
  public warn(
    requestContext: RequestContext,
    message: string,
    ...args: any[]
  ): void {
    winstonLogger.warn(
      formatStr(requestContext, this.scope, message),
      parse(args)
    );
  }
  public error(
    requestContext: RequestContext,
    message: string,
    ...args: any[]
  ): void {
    winstonLogger.error(
      formatStr(requestContext, this.scope, message),
      parse(args)
    );
  }
}
