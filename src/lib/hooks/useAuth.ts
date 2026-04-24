"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  loginUser,
  registerUser,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/authStore";

export function useLogin() {
  const setToken = useAuthStore((s) => s.setToken);
  const router = useRouter();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setToken(data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      router.push("/");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? "Login failed");
    },
  });
}

export function useRegister() {
  const setToken = useAuthStore((s) => s.setToken);
  const router = useRouter();
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setToken(data.token);
      toast.success("Account created!");
      router.push("/");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? "Registration failed");
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
    onSuccess: () => toast.success("Reset code sent to your email"),
    onError: () => toast.error("Email not found"),
  });
}

export function useVerifyResetCode() {
  return useMutation({
    mutationFn: (code: string) => verifyResetCode(code),
    onError: () => toast.error("Invalid or expired reset code"),
  });
}

export function useResetPassword() {
  const router = useRouter();
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("Password reset successfully");
      router.push("/login");
    },
    onError: () => toast.error("Failed to reset password"),
  });
}
