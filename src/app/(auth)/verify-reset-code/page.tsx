"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { verifyCodeSchema, type VerifyCodeValues } from "@/lib/validations/forgotPassword";
import { useVerifyResetCode } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function VerifyResetCodePage() {
  const router = useRouter();
  const email = useSearchParams().get("email") ?? "";
  const verify = useVerifyResetCode();

  const { register, handleSubmit, formState: { errors } } = useForm<VerifyCodeValues>({
    resolver: zodResolver(verifyCodeSchema),
  });

  function onSubmit(values: VerifyCodeValues) {
    verify.mutate(values.resetCode, {
      onSuccess: () =>
        router.push(`/reset-password?email=${encodeURIComponent(email)}`),
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <ShieldCheck size={26} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-foreground">{email || "your email"}</span>.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resetCode">Reset code</Label>
            <Input
              id="resetCode"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              className="text-center tracking-[0.5em] text-lg font-semibold"
              {...register("resetCode")}
            />
            {errors.resetCode && (
              <p className="text-sm text-destructive">{errors.resetCode.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={verify.isPending}>
            {verify.isPending ? "Verifying…" : "Verify code"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Didn&apos;t receive it?{" "}
          <Link
            href="/forgot-password"
            className="text-primary underline-offset-4 hover:underline"
          >
            Resend
          </Link>
        </p>

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="inline-flex items-center gap-1 hover:text-primary underline-offset-4 hover:underline">
            <ArrowLeft size={13} /> Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
