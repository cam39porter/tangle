import * as winston from "winston";

/**
 * Configures the winston logger. There are also file and remote transports available
 */
const winstonLogger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "info",
      handleExceptions: true
    })
  ],
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
const formatStr = (scope: string, message: string): string =>
  `[${scope}] ${message}`;

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
