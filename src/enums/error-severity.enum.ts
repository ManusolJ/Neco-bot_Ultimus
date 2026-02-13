export enum ErrorSeverity {
  // Low severity = Log and inform the user, but continue execution.
  LOW = "Low",

  // Medium severity = Log, inform the user, and suggest a workaround or retry option.
  MEDIUM = "Medium",

  // High severity = Log, inform the user, and halt execution or require immediate attention.
  HIGH = "High",
}
