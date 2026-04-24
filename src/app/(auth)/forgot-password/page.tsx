"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/lib/validations/forgotPassword";
import { useForgotPassword } from "@/lib/hooks/useAuth";
import { AuthCard } from "@/components/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const forgot = useForgotPassword();

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  function onSubmit(values: ForgotPasswordValues) {
    forgot.mutate(values.email, {
      onSuccess: () => router.push(`/verify-reset-code?email=${encodeURIComponent(values.email)}`),
    });
  }

  return (
    <AuthCard>
      <div className="flex flex-col gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Mail size={26} className="text-primary" />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Forgot password?</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and we&apos;ll send you a reset code.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <Button type="submit" className="w-full h-11 text-base" disabled={forgot.isPending}>
          {forgot.isPending ? "Sending…" : "Send reset code"}
        </Button>
      </form>

      <Link href="/login" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary w-fit">
        <ArrowLeft size={14} /> Back to sign in
      </Link>
    </AuthCard>
  );
}
