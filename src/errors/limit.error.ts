import AppError from "@errors/app.error";
import ErrorCode from "@enums/error-code.enum";
import ErrorSeverity from "@enums/error-severity.enum";
import AppErrorInterface from "@interfaces/configuration/app-error.interface";

export default class RateLimitError extends AppError {
  constructor(retryAfterMs?: number) {
    const message = `Rate limit exceeded. Retry after ${retryAfterMs} ms.`;
    const userMessage = `Has alcanzado el límite de uso. Por favor, inténtalo de nuevo después de ${retryAfterMs ? Math.ceil(retryAfterMs / 1000) : "unos"} segundos.`;

    let options: AppErrorInterface = {
      message: message,
      userMessage: userMessage,
      code: ErrorCode.RATE_LIMITED,
      severity: ErrorSeverity.MEDIUM,
    };

    super(options);
  }
}
