import api from "./axios";
import type {
  LoginResponse,
  RegisterResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
} from "@/lib/types/api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/signin", payload);
  return data;
}

export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>("/auth/signup", payload);
  return data;
}

export async function forgotPassword(email: string): Promise<ForgotPasswordResponse> {
  const { data } = await api.post<ForgotPasswordResponse>("/auth/forgotPasswords", { email });
  return data;
}

export async function verifyResetCode(resetCode: string): Promise<{ status: string }> {
  const { data } = await api.post<{ status: string }>("/auth/verifyResetCode", { resetCode });
  return data;
}

export async function resetPassword(payload: {
  email: string;
  newPassword: string;
}): Promise<ResetPasswordResponse> {
  const { data } = await api.put<ResetPasswordResponse>("/auth/resetPassword", payload);
  return data;
}
