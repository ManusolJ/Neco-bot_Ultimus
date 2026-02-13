import { ErrorCode } from "@enums/error-code.enum";
import { ErrorSeverity } from "@enums/error-severity.enum";

export default interface AppErrorInterface {
  cause?: Error;
  message: string;
  code?: ErrorCode;
  userMessage?: string;
  severity?: ErrorSeverity;
  context?: Record<string, unknown>;
}
