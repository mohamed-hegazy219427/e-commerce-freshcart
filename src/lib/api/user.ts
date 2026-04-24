import api from "./axios";
import type { UserProfileResponse } from "@/lib/types/api";

export async function updateProfile(payload: {
  name: string;
  email: string;
  phone: string;
}): Promise<UserProfileResponse> {
  const { data } = await api.put<UserProfileResponse>("/user/updateMe", payload);
  return data;
}

export async function changePassword(payload: {
  currentPassword: string;
  password: string;
  rePassword: string;
}): Promise<{ message: string; token: string }> {
  const { data } = await api.put<{ message: string; token: string }>(
    "/user/changeMyPassword",
    payload
  );
  return data;
}
