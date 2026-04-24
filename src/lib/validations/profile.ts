import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(3, "At least 3 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^01[0125][0-9]{8}$/, "Invalid Egyptian phone number"),
});

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Required"),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Needs uppercase")
      .regex(/[0-9]/, "Needs a number"),
    rePassword: z.string(),
  })
  .refine((d) => d.password === d.rePassword, {
    path: ["rePassword"],
    message: "Passwords do not match",
  });

export type ProfileValues = z.infer<typeof profileSchema>;
export type PasswordValues = z.infer<typeof passwordSchema>;
