import AppError from "@errors/app.error";
import ErrorCode from "@enums/error-code.enum";
import ErrorSeverity from "@enums/error-severity.enum";
import AppErrorInterface from "@interfaces/configuration/app-error.interface";

export default class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    const options: AppErrorInterface = {
      message,
      context,
      userMessage: message,
      severity: ErrorSeverity.LOW,
      code: ErrorCode.INVALID_ARGUMENT,
    };

    super(options);
  }
}
