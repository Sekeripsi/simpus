/**
 * Structured logging utility for the SIMPUS application
 * Provides consistent logging across server and client components
 */

export type LogLevel = "info" | "warn" | "error" | "debug"

interface LogData {
  [key: string]: unknown
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: LogData
  stack?: string
}

export interface LogMetrics {
  totalLogs: number
  errorCount: number
  warningCount: number
  infoCount: number
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development"
  private metrics: LogMetrics = {
    totalLogs: 0,
    errorCount: 0,
    warningCount: 0,
    infoCount: 0,
  }
  private logHistory: LogEntry[] = []
  private maxHistorySize = 100

  private formatEntry(level: LogLevel, message: string, data?: LogData): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    }
  }

  private updateMetrics(level: LogLevel) {
    this.metrics.totalLogs += 1
    switch (level) {
      case "error":
        this.metrics.errorCount += 1
        break
      case "warn":
        this.metrics.warningCount += 1
        break
      case "info":
        this.metrics.infoCount += 1
        break
    }
  }

  private storeHistory(entry: LogEntry) {
    this.logHistory.push(entry)
    // Keep only the last N logs
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift()
    }
  }

  private output(entry: LogEntry) {
    const prefix = `[${entry.level.toUpperCase()}] ${entry.timestamp}`

    switch (entry.level) {
      case "error":
        console.error(`${prefix} - ${entry.message}`, entry.data)
        break
      case "warn":
        console.warn(`${prefix} - ${entry.message}`, entry.data)
        break
      case "debug":
        if (this.isDevelopment) {
          console.info(`${prefix} - ${entry.message}`, entry.data)
        }
        break
      case "info":
      default:
        console.info(`${prefix} - ${entry.message}`, entry.data)
    }
  }

  info(message: string, data?: LogData) {
    const entry = this.formatEntry("info", message, data)
    this.output(entry)
    this.updateMetrics("info")
    this.storeHistory(entry)
  }

  warn(message: string, data?: LogData) {
    const entry = this.formatEntry("warn", message, data)
    this.output(entry)
    this.updateMetrics("warn")
    this.storeHistory(entry)
  }

  error(message: string, error?: Error | LogData) {
    const errorData = error instanceof Error
      ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        }
      : error

    const entry = this.formatEntry("error", message, errorData)
    this.output(entry)
    this.updateMetrics("error")
    this.storeHistory(entry)
  }

  debug(message: string, data?: LogData) {
    const entry = this.formatEntry("debug", message, data)
    this.output(entry)
    this.storeHistory(entry)
  }

  /**
   * Get current logging metrics
   */
  getMetrics(): LogMetrics {
    return { ...this.metrics }
  }

  /**
   * Get recent logs from history
   */
  getHistory(limit: number = 10): LogEntry[] {
    return this.logHistory.slice(-limit)
  }

  /**
   * Clear log history (useful for testing)
   */
  clearHistory() {
    this.logHistory = []
  }

  /**
   * Reset metrics (useful for testing)
   */
  resetMetrics() {
    this.metrics = {
      totalLogs: 0,
      errorCount: 0,
      warningCount: 0,
      infoCount: 0,
    }
  }
}

export const logger = new Logger()
