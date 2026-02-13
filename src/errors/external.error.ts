import AppError from "@errors/app.error";
import ErrorCode from "@enums/error-code.enum";
import ErrorSeverity from "@enums/error-severity.enum";
import AppErrorInterface from "@interfaces/configuration/app-error.interface";

export default class ExternalApiError extends AppError {
  constructor(serviceName: string, cause?: Error) {
    const message = `Error al comunicarse con el servicio externo ${serviceName}, motivo: ${cause ? cause.message : "desconocido"}`;
    const userMessage = `Ocurrió un error al comunicarse con el servicio ${serviceName}!`;

    let options: AppErrorInterface = {
      cause: cause,
      message: message,
      context: { serviceName },
      userMessage: userMessage,
      code: ErrorCode.API_ERROR,
      severity: ErrorSeverity.MEDIUM,
    };

    super(options);
  }
}
