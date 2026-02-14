import AppError from "@errors/app.error";
import ErrorCode from "@enums/error-code.enum";
import ErrorSeverity from "@enums/error-severity.enum";
import AppErrorInterface from "@interfaces/configuration/app-error.interface";

export default class DatabaseError extends AppError {
  constructor(message: string, cause?: Error) {
    const userMessage = "Ocurrió un error al acceder a la base de datos.";

    const options: AppErrorInterface = {
      cause,
      message,
      userMessage: userMessage,
      code: ErrorCode.DB_QUERY,
      severity: ErrorSeverity.HIGH,
    };

    super(options);
  }
}
