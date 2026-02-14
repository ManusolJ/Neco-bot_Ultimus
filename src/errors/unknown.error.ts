import AppError from "@errors/app.error";
import ErrorCode from "@enums/error-code.enum";
import ErrorSeverity from "@enums/error-severity.enum";
import AppErrorInterface from "@interfaces/configuration/app-error.interface";

export default class UnknownError extends AppError {
  constructor(message: string, cause?: Error) {
    const options: AppErrorInterface = {
      cause,
      message,
      code: ErrorCode.UNKNOWN_ERROR,
      severity: ErrorSeverity.MEDIUM,
    };

    super(options);
  }
}
