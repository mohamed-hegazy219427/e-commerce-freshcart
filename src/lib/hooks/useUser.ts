"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getMe, updateProfile, changePassword } from "@/lib/api/user";
import { useAuthStore } from "@/lib/store/authStore";

const userKeys = {
  me: ["user", "me"] as const,
};

export function useMe() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: userKeys.me,
    queryFn: getMe,
    enabled: !!token,
    retry: false,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.me });
      toast.success("Profile updated");
    },
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
