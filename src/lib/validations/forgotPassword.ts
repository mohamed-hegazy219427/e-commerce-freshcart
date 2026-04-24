import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const verifyCodeSchema = z.object({
  resetCode: z.string().length(6, "Code must be exactly 6 digits").regex(/^\d+$/, "Digits only"),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type VerifyCodeValues = z.infer<typeof verifyCodeSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
