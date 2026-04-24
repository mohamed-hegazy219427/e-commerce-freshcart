"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerSchema, type RegisterFormValues } from "@/lib/validations/register";
import { useRegister } from "@/lib/hooks/useAuth";
import { useAuthStore } from "@/lib/store/authStore";
import { AuthCard } from "@/components/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const register_ = useRegister();

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <AuthCard>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Create account</h1>
        <p className="text-sm text-muted-foreground">
          Already have one?{" "}
          <Link href="/login" className="text-primary font-medium underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit((v) => register_.mutate(v))} className="space-y-3">
        {([
          { id: "name", label: "Full name", type: "text", placeholder: "John Doe" },
          { id: "email", label: "Email address", type: "email", placeholder: "you@example.com" },
          { id: "password", label: "Password", type: "password", placeholder: "Min 8 chars, 1 uppercase, 1 number" },
          { id: "rePassword", label: "Confirm password", type: "password", placeholder: "••••••••" },
          { id: "phone", label: "Phone (Egyptian)", type: "tel", placeholder: "01XXXXXXXXX" },
        ] as const).map(({ id, label, type, placeholder }) => (
          <div key={id} className="space-y-1.5">
            <Label htmlFor={id}>{label}</Label>
            <Input id={id} type={type} placeholder={placeholder} {...register(id)} />
            {errors[id] && <p className="text-xs text-destructive">{errors[id]?.message}</p>}
          </div>
        ))}

        <Button type="submit" className="w-full h-11 text-base mt-2" disabled={register_.isPending}>
          {register_.isPending ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthCard>
  );
}
