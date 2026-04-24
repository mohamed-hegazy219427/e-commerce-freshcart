"use client";

import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { verifyCodeSchema, type VerifyCodeValues } from "@/lib/validations/forgotPassword";
import { useVerifyResetCode } from "@/lib/hooks/useAuth";
import { AuthCard } from "@/components/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function VerifyResetCodeForm() {
  const router = useRouter();
  const email = useSearchParams().get("email") ?? "";
  const verify = useVerifyResetCode();

  const { register, handleSubmit, formState: { errors } } = useForm<VerifyCodeValues>({
    resolver: zodResolver(verifyCodeSchema),
  });

  function onSubmit(values: VerifyCodeValues) {
    verify.mutate(values.resetCode, {
      onSuccess: () => router.push(`/reset-password?email=${encodeURIComponent(email)}`),
    });
  }

  return (
    <AuthCard>
      <div className="flex flex-col gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <ShieldCheck size={26} className="text-primary" />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-foreground">{email || "your email"}</span>.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="resetCode">Reset code</Label>
          <Input
            id="resetCode"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="123456"
            className="text-center tracking-[0.5em] text-xl font-bold h-14"
            {...register("resetCode")}
          />
          {errors.resetCode && <p className="text-xs text-destructive">{errors.resetCode.message}</p>}
        </div>
        <Button type="submit" className="w-full h-11 text-base" disabled={verify.isPending}>
          {verify.isPending ? "Verifying…" : "Verify code"}
        </Button>
      </form>

      <div className="flex items-center justify-between text-sm">
        <Link href="/login" className="flex items-center gap-1.5 text-muted-foreground hover:text-primary">
          <ArrowLeft size={14} /> Back to sign in
        </Link>
        <Link href="/forgot-password" className="text-primary hover:underline underline-offset-4">
          Resend code
        </Link>
      </div>
    </AuthCard>
  );
}

export default function VerifyResetCodePage() {
  return (
    <Suspense>
      <VerifyResetCodeForm />
    </Suspense>
  );
}
