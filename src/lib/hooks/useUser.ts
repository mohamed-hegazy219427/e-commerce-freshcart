"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateProfile, changePassword } from "@/lib/api/user";
import { useAuthStore } from "@/lib/store/authStore";

export function useUpdateProfile() {
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => toast.success("Profile updated"),
    onError: () => toast.error("Failed to update profile"),
  });
}

export function useChangePassword() {
  const setToken = useAuthStore((s) => s.setToken);
  return useMutation({
    mutationFn: changePassword,
    onSuccess: (data) => {
      setToken(data.token);
      toast.success("Password changed successfully");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? "Incorrect current password");
    },
  });
}
