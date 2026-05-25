export interface AuthResponse {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  companyName: string;
  fullname: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotRequest {
  email: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ResetRequest {
  newPassword: string;
  confirmPassword: string;
}

export interface EmailVerificationRequest {
  email: string;
  otp: string;
}
