// ============================================
// AUTH ERROR TYPES
// ============================================

export type AuthErrorCode =
  | "TOO_MANY_REQUESTS"
  | "INVALID_CREDENTIALS"
  | "TURNSTILE_FAILED"
  | "SERVER_ERROR"
  | "INVALID_INPUT";

export interface RateLimitError {
  error: "TOO_MANY_REQUESTS";
  message: string;
  limit?: number;
  remaining?: number;
  reset?: number;
}

export interface AuthError {
  error: AuthErrorCode;
  message: string;
}

// ============================================
// TURNSTILE TYPES
// ============================================

export interface TurnstileResponse {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
}

// ============================================
// LOGIN TYPES
// ============================================

export interface LoginCredentials {
  username: string;
  password: string;
  turnstile: string;
}

export interface LoginResponse {
  success: boolean;
  error?: AuthErrorCode;
  message?: string;
}

// ============================================
// ALERT TYPES
// ============================================

export type AlertType = "success" | "error" | "warning" | "info";

export interface Alert {
  type: AlertType;
  message: string;
}
