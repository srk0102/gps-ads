import { getAppEnv } from '../env/AppEnv';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type LogCategory =
  | 'DECISION'
  | 'PLAYBACK'
  | 'VISION'
  | 'SYNC'
  | 'HEALTH'
  | 'CONFIG'
  | 'APP';

interface LogEntry {
  ts: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  context?: Record<string, unknown>;
}

class LoggerImpl {
  private readonly env = getAppEnv();
  private levels: Record<LogLevel, number> = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40
  };

  public log(level: LogLevel, category: LogCategory, message: string, context?: Record<string, unknown>): void {
    const configuredLevel = this.env.logLevel;
    if (this.levels[level] < this.levels[configuredLevel]) {
      return;
    }

    const entry: LogEntry = {
      ts: new Date().toISOString(),
      level,
      category,
      message,
      context
    };

    // eslint-disable-next-line no-console
    console.log(JSON.stringify(entry));
  }

  public debug(category: LogCategory, message: string, context?: Record<string, unknown>): void {
    this.log('debug', category, message, context);
  }

  public info(category: LogCategory, message: string, context?: Record<string, unknown>): void {
    this.log('info', category, message, context);
  }

  public warn(category: LogCategory, message: string, context?: Record<string, unknown>): void {
    this.log('warn', category, message, context);
  }

  public error(category: LogCategory, message: string, context?: Record<string, unknown>): void {
    this.log('error', category, message, context);
  }
}

export const Logger = new LoggerImpl();
