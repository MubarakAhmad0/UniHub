interface LogMetadata {
  requestId?: string;
  userId?: string;
  path?: string;
  [key: string]: any;
}

class Logger {
  private static formatMessage(
    level: string,
    message: string,
    metadata?: LogMetadata,
  ) {
    const timestamp = new Date().toISOString();

    return JSON.stringify({
      timestamp,
      level,
      message,
      ...metadata,
      environment: process.env.NODE_ENV,
      service: "placeholder", // Change this to your service name
    });
  }

  static info(message: string, metadata?: LogMetadata) {
    console.log(this.formatMessage("INFO", message, metadata));
  }

  static log(message: string, metadata?: LogMetadata) {
    console.log(this.formatMessage("INFO", message, metadata));
  }

  static error(customMessage: string, error?: Error, metadata?: LogMetadata) {
    console.error(
      this.formatMessage("ERROR", customMessage, {
        ...metadata,
        errorMessage: error?.message,
        stackTrace: error?.stack,
      }),
    );
  }

  static warn(message: string, metadata?: LogMetadata) {
    console.warn(this.formatMessage("WARN", message, metadata));
  }

  static debug(message: string, metadata?: LogMetadata) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(this.formatMessage("DEBUG", message, metadata));
    }
  }

  // Helper method to create a logger with default metadata
  static withDefaultMetadata(defaultMetadata: LogMetadata) {
    return {
      info: (message: string, metadata?: LogMetadata) =>
        this.info(message, { ...defaultMetadata, ...metadata }),
      error: (message: string, error?: Error, metadata?: LogMetadata) =>
        this.error(message, error, { ...defaultMetadata, ...metadata }),
      warn: (message: string, metadata?: LogMetadata) =>
        this.warn(message, { ...defaultMetadata, ...metadata }),
      debug: (message: string, metadata?: LogMetadata) =>
        this.debug(message, { ...defaultMetadata, ...metadata }),
    };
  }
}

export default Logger;
