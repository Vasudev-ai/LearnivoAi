type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  userId?: string;
  metadata?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private serviceName: string;
  private minLevel: LogLevel;

  constructor(serviceName: string, minLevel: LogLevel = "info") {
    this.serviceName = serviceName;
    this.minLevel = minLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.minLevel];
  }

  private createEntry(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>,
    error?: Error
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      service: this.serviceName,
      message,
      metadata,
    };

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    return entry;
  }

  private log(level: LogLevel, message: string, metadata?: Record<string, unknown>, error?: Error): void {
    if (!this.shouldLog(level)) return;

    const entry = this.createEntry(level, message, metadata, error);

    const logString = JSON.stringify(entry, null, 2);

    switch (level) {
      case "error":
        console.error(logString);
        break;
      case "warn":
        console.warn(logString);
        break;
      default:
        console.log(logString);
    }

    if (process.env.NODE_ENV === "production") {
      this.sendToExternal(entry);
    }
  }

  private async sendToExternal(entry: LogEntry): Promise<void> {
    try {
      if (process.env.LOG_ENDPOINT) {
        await fetch(process.env.LOG_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entry),
        });
      }
    } catch {
      console.error("Failed to send log to external service");
    }
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    this.log("debug", message, metadata);
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    this.log("info", message, metadata);
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    this.log("warn", message, metadata);
  }

  error(message: string, error?: Error | unknown, metadata?: Record<string, unknown>): void {
    const err = error instanceof Error ? error : error ? new Error(String(error)) : undefined;
    this.log("error", message, metadata, err);
  }

  child(childServiceName: string): Logger {
    return new Logger(`${this.serviceName}:${childServiceName}`, this.minLevel);
  }
}

export const logger = {
  forService(serviceName: string): Logger {
    return new Logger(serviceName);
  },

  debug(message: string, metadata?: Record<string, unknown>): void {
    new Logger("app").debug(message, metadata);
  },

  info(message: string, metadata?: Record<string, unknown>): void {
    new Logger("app").info(message, metadata);
  },

  warn(message: string, metadata?: Record<string, unknown>): void {
    new Logger("app").warn(message, metadata);
  },

  error(message: string, error?: Error | unknown, metadata?: Record<string, unknown>): void {
    new Logger("app").error(message, error, metadata);
  },
};

export const aiLogger = logger.forService("ai");
export const authLogger = logger.forService("auth");
export const dbLogger = logger.forService("database");
