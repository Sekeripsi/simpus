/**
 * Audit Logging System
 * Tracks user actions and system events for compliance and debugging
 */

import { logger } from "./logger"

export type AuditAction =
  | "LOGIN"
  | "LOGOUT"
  | "CREATE"
  | "READ"
  | "UPDATE"
  | "DELETE"
  | "AUTH_FAILURE"
  | "PERMISSION_DENIED"
  | "SYSTEM_ERROR"

export interface AuditEvent {
  timestamp: string
  action: AuditAction
  userId?: string
  username?: string
  resource: string
  resourceId?: string
  status: "success" | "failure"
  details?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
}

class AuditLog {
  /**
   * Log a user action
   */
  logAction(
    action: AuditAction,
    resource: string,
    options?: {
      userId?: string
      username?: string
      resourceId?: string
      status?: "success" | "failure"
      details?: Record<string, unknown>
      ipAddress?: string
      userAgent?: string
    }
  ) {
    const event: AuditEvent = {
      timestamp: new Date().toISOString(),
      action,
      resource,
      status: options?.status || "success",
      userId: options?.userId,
      username: options?.username,
      resourceId: options?.resourceId,
      details: options?.details,
      ipAddress: options?.ipAddress,
      userAgent: options?.userAgent,
    }

    // Log the audit event
    logger.info(`Audit: ${action} on ${resource}`, {
      action: event.action,
      resource: event.resource,
      userId: event.userId,
      username: event.username,
      status: event.status,
      details: event.details,
    })

    // TODO: Send to external audit service
  }

  /**
   * Log authentication event
   */
  logAuth(
    action: "LOGIN" | "LOGOUT" | "AUTH_FAILURE",
    options: {
      username: string
      userId?: string
      success: boolean
      reason?: string
      ipAddress?: string
      userAgent?: string
    }
  ) {
    this.logAction(action, "authentication", {
      username: options.username,
      userId: options.userId,
      status: options.success ? "success" : "failure",
      details: {
        reason: options.reason,
      },
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
    })
  }

  /**
   * Log data access event
   */
  logDataAccess(
    action: "CREATE" | "READ" | "UPDATE" | "DELETE",
    resource: string,
    options: {
      userId: string
      username: string
      resourceId?: string
      success: boolean
      changes?: Record<string, unknown>
      reason?: string
    }
  ) {
    this.logAction(action, resource, {
      userId: options.userId,
      username: options.username,
      resourceId: options.resourceId,
      status: options.success ? "success" : "failure",
      details: {
        changes: options.changes,
        reason: options.reason,
      },
    })
  }

  /**
   * Log permission denial
   */
  logPermissionDenied(
    resource: string,
    options: {
      userId: string
      username: string
      attemptedAction: string
      reason: string
    }
  ) {
    this.logAction("PERMISSION_DENIED", resource, {
      userId: options.userId,
      username: options.username,
      status: "failure",
      details: {
        attemptedAction: options.attemptedAction,
        reason: options.reason,
      },
    })
  }

  /**
   * Log system error
   */
  logError(
    resource: string,
    options: {
      userId?: string
      error: Error | string
      context?: Record<string, unknown>
    }
  ) {
    this.logAction("SYSTEM_ERROR", resource, {
      userId: options.userId,
      status: "failure",
      details: {
        error: options.error instanceof Error ? options.error.message : options.error,
        context: options.context,
      },
    })
  }
}

export const auditLog = new AuditLog()
