import ErrorCode from "@enums/error-code.enum";
import ErrorSeverity from "@enums/error-severity.enum";
import AppErrorInterface from "@interfaces/configuration/app-error.interface";

const DEFAULT_ERROR_MESSAGE = "Un error desconocido ha ocurrido.";

export default class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly timestamp: Date;
  public readonly userMessage: string;
  public readonly severity: ErrorSeverity;
  public readonly context?: Record<string, unknown>;

  constructor(options: AppErrorInterface) {
    super(options.message);
    this.timestamp = new Date();
    this.context = options.context;
    this.code = options.code || ErrorCode.UNKNOWN_ERROR;
    this.severity = options.severity || ErrorSeverity.MEDIUM;
    this.userMessage = options.userMessage || DEFAULT_ERROR_MESSAGE;
    if (options.cause) {
      this.cause = options.cause;
    }

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
