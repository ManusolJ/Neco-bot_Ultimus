import AppError from "@errors/app.error";
import ErrorCode from "@enums/error-code.enum";
import ErrorSeverity from "@enums/error-severity.enum";
import AppErrorInterface from "@interfaces/configuration/app-error.interface";

export default class TimeoutError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    const userMessage: string =
      "La operación ha tardado demasiado tiempo y ha sido cancelada. Por favor, inténtalo de nuevo más tarde.";

    const options: AppErrorInterface = {
      message,
      context,
      code: ErrorCode.TIMEOUT,
      userMessage: userMessage,
      severity: ErrorSeverity.MEDIUM,
    };

    super(options);
  }
}
