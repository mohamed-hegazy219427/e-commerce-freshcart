"use client";

import { create } from "zustand";
import { decodeJwt } from "jose";
import type { AuthUser } from "@/lib/types/api";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
  initFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  setToken: (token: string) => {
    localStorage.setItem("token", token);
    const user = decodeJwt(token) as AuthUser;
    set({ token, user });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null });
  },

  initFromStorage: () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const user = decodeJwt(token) as AuthUser;
      const isExpired = user.exp * 1000 < Date.now();
      if (isExpired) {
        localStorage.removeItem("token");
        return;
      }
      set({ token, user });
    } catch {
      localStorage.removeItem("token");
    }
  },
}));
