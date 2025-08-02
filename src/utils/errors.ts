/**
 * Custom error class for calculator-related errors
 */
export class CalculatorError extends Error {
  public code?: string;
  public field?: string;

  constructor(message: string, code?: string, field?: string) {
    super(message);
    this.name = 'CalculatorError';
    this.code = code;
    this.field = field;
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CalculatorError);
    }
  }
}