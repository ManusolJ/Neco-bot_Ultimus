import AppError from "@errors/app.error";
import ErrorCode from "@enums/error-code.enum";
import ErrorSeverity from "@enums/error-severity.enum";
import AppErrorInterface from "@interfaces/configuration/app-error.interface";

export default class MissingArgumentError extends AppError {
  constructor(argumentName: string, context?: Record<string, unknown>) {
    const message: string = `Missing argument: ${argumentName}`;
    const userMessage: string = `Tienes que proporcionar: ${argumentName}`;

    const options: AppErrorInterface = {
      context: context,
      message: message,
      userMessage: userMessage,
      severity: ErrorSeverity.LOW,
      code: ErrorCode.MISSING_ARGUMENT,
    };

    super(options);
  }
}
