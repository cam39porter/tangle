import * as winston from "winston";
import {
  hasAuthenticatedUser,
  getRequestContext
} from "../../filters/request-context";
import { ErrorReporting } from "@google-cloud/error-reporting";
import { isProd } from "../../config";

const errorReporting = new ErrorReporting();

const winstonTransport = new winston.transports.Console({
  level: "info",
  handleExceptions: false,
  stderrLevels: ["error"]
});

const winstonLogger = winston.createLogger({
  transports: [winstonTransport],
  exitOnError: false
});

/**
 * Exports a wrapper for all the loggers we use in this configuration
 */
function formatStr(
  scope: string,
  message: string,
  stacktrace?: string
): string {
  const req = hasAuthenticatedUser() ? getRequestContext() : null;
  const formatted = `${new Date().toISOString()} ${(req && req.reqId) ||
    "-"} ${(req && req.user.urn.toRaw()) || "-"} ${scope} -- ${message ||
    ""} -- ${stacktrace || ""}`;
  return formatted;
}

export function reportClientError(
  message: string,
  stacktrace?: string
): Promise<boolean> {
  if (isProd()) {
    return Promise.resolve(
      errorReporting.report(formatStr("web-client", message, stacktrace))
    ).then(() => true);
  } else {
    return Promise.resolve(false);
  }
}

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
  public error(message: string, stacktrace?: any, ...args: any[]): void {
    const formatted = formatStr(this.scope, message, stacktrace);
    winstonLogger.error(formatted, parse(args));
    if (isProd()) {
      errorReporting.report(formatted);
    }
  }
}
