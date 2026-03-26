import { pino, type Logger } from "pino";

export const logger: Logger =
  process.env.NODE_ENV === "production"
    ? // JSON in production
      pino({
        level: "info",
        timestamp: pino.stdTimeFunctions.isoTime,
        base: {
          pid: undefined,
          hostname: undefined,
        },
        formatters: {
          level: (label) => {
            return { level: label.toUpperCase() };
          },
        },
      })
    : // Pretty print in development
      pino({
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
        level: "debug",
        timestamp: pino.stdTimeFunctions.isoTime,
        base: {
          pid: undefined,
          hostname: undefined,
        },
      });
