import * as winston from "winston";
import {
  hasAuthenticatedUser,
  getRequestContext
} from "../../filters/request-context";

const winstonTransport = new winston.transports.Console({
  level: "info",
  handleExceptions: false
});

const winstonLogger = winston.createLogger({
  transports: [winstonTransport],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(log => {
      const req = hasAuthenticatedUser() ? getRequestContext() : null;
      return `${log.level}: ${log.timestamp} ${(req && req.reqId) ||
        "-"} ${(req && req.user.urn.toRaw()) || "-"} -- ${log.message}`;
    })
  ),
  exitOnError: false
});

/**
 * Exports a wrapper for all the loggers we use in this configuration
 */
const formatStr = (scope: string, message: string): string => {
  return `${scope} ${message}`;
};

const parse = (args: any[]) => (args.length > 0 ? args : "");

export class Logger {
  private scope: string;
  constructor(scope: string) {
    this.scope = scope;
  }

  public info(message: string, ...args: any[]): void {
    winstonLogger.info(formatStr(this.scope, message), parse(args));
  }
  public warn(message: string, ...args: any[]): void {
    winstonLogger.warn(formatStr(this.scope, message), parse(args));
  }
  public error(message: string, ...args: any[]): void {
    winstonLogger.error(formatStr(this.scope, message), parse(args));
  }
}
