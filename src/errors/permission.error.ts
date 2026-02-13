import { AppError } from "@errors/app.error";
import { ErrorCode } from "@enums/error-code.enum";
import { ErrorSeverity } from "@enums/error-severity.enum";
import AppErrorInterface from "@interfaces/configuration/app-error.interface";

export default class PermissionError extends AppError {
  constructor(
    message: string,
    botPermission: boolean,
    context?: Record<string, unknown>,
  ) {
    const ERROR_CODE: ErrorCode = botPermission
      ? ErrorCode.BOT_MISSING_PERMISSIONS
      : ErrorCode.MISSING_PERMISSIONS;

    const USER_MESSAGE: string = botPermission
      ? "No tengo los permisos necesarios para ejecutar este comando."
      : "No tienes los permisos necesarios para ejecutar este comando.";

    let options: AppErrorInterface = {
      context: context,
      message: message,
      code: ERROR_CODE,
      userMessage: USER_MESSAGE,
      severity: ErrorSeverity.LOW,
    };

    super(options);
  }
}
