"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Mail,
  Phone,
  KeyRound,
  Shield,
  CheckCircle2,
  ShoppingBag,
  Heart,
  Package,
} from "lucide-react";
import { profileSchema, passwordSchema, type ProfileValues, type PasswordValues } from "@/lib/validations/profile";
import { useUpdateProfile, useChangePassword } from "@/lib/hooks/useUser";
import { useAuthStore } from "@/lib/store/authStore";
import { useOrders } from "@/lib/hooks/useOrders";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { useCart } from "@/lib/hooks/useCart";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

/* ── helpers ─────────────────────────────────────────────────────────────── */

function initials(name?: string) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

/* ── stat chip ───────────────────────────────────────────────────────────── */

function StatChip({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border bg-muted/40 px-5 py-3 text-center min-w-[80px]">
      <Icon size={18} className="text-primary" />
      <span className="text-lg font-bold leading-none">{value}</span>
      <span className="text-[0.65rem] text-muted-foreground uppercase tracking-wide">{label}</span>
    </div>
  );
}

/* ── personal info form ──────────────────────────────────────────────────── */

function PersonalInfoForm({ defaultValues }: { defaultValues: ProfileValues }) {
  const updateProfile = useUpdateProfile();
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues.email]); // eslint-disable-line react-hooks/exhaustive-deps

  const fields = [
    { id: "name" as const, label: "Full name", icon: User, type: "text" },
    { id: "email" as const, label: "Email address", icon: Mail, type: "email" },
    { id: "phone" as const, label: "Phone", icon: Phone, type: "tel" },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <User size={16} className="text-primary" />
          Personal information
        </CardTitle>
      </CardHeader>
      <Separator className="mb-0" />
      <CardContent className="pt-5 space-y-4">
        <form
          onSubmit={form.handleSubmit((v) => updateProfile.mutate(v))}
          className="space-y-4"
        >
          {fields.map(({ id, label, icon: Icon, type }) => (
            <div key={id} className="space-y-1.5">
              <Label htmlFor={id} className="flex items-center gap-1.5 text-sm">
                <Icon size={13} className="text-muted-foreground" />
                {label}
              </Label>
              <Input id={id} type={type} {...form.register(id)} />
              {form.formState.errors[id] && (
                <p className="text-xs text-destructive">{form.formState.errors[id]?.message}</p>
              )}
            </div>
          ))}

          <div className="flex items-center gap-3 pt-1">
            <Button type="submit" disabled={updateProfile.isPending} className="flex-1">
              {updateProfile.isPending ? "Saving…" : "Save changes"}
            </Button>
            {updateProfile.isSuccess && (
              <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                <CheckCircle2 size={15} /> Saved
              </span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

/* ── change password form ────────────────────────────────────────────────── */

function ChangePasswordForm() {
  const changePassword = useChangePassword();
  const form = useForm<PasswordValues>({ resolver: zodResolver(passwordSchema) });

  const fields = [
    { id: "currentPassword" as const, label: "Current password" },
    { id: "password" as const, label: "New password" },
    { id: "rePassword" as const, label: "Confirm new password" },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <KeyRound size={16} className="text-primary" />
          Change password
        </CardTitle>
      </CardHeader>
      <Separator className="mb-0" />
      <CardContent className="pt-5 space-y-4">
        <form
          onSubmit={form.handleSubmit((v) =>
            changePassword.mutate(v, { onSuccess: () => form.reset() })
          )}
          className="space-y-4"
        >
          {fields.map(({ id, label }) => (
            <div key={id} className="space-y-1.5">
              <Label htmlFor={id} className="flex items-center gap-1.5 text-sm">
                <Shield size={13} className="text-muted-foreground" />
                {label}
              </Label>
              <Input id={id} type="password" {...form.register(id)} />
              {form.formState.errors[id] && (
                <p className="text-xs text-destructive">{form.formState.errors[id]?.message}</p>
              )}
            </div>
          ))}

          <div className="flex items-center gap-3 pt-1">
            <Button
              type="submit"
              variant="outline"
              disabled={changePassword.isPending}
              className="flex-1"
            >
              {changePassword.isPending ? "Updating…" : "Update password"}
            </Button>
            {changePassword.isSuccess && (
              <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                <CheckCircle2 size={15} /> Updated
              </span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

/* ── profile header card ─────────────────────────────────────────────────── */

function ProfileHeader() {
  const user = useAuthStore((s) => s.user);
  const { data: ordersData } = useOrders();
  const { data: wishlistData } = useWishlist();
  const { data: cartData } = useCart();

  const orderCount = ordersData?.length ?? 0;
  const wishlistCount = wishlistData?.data?.length ?? 0;
  const cartCount = cartData?.numOfCartItems ?? 0;

  return (
    <Card className="overflow-hidden">
      {/* green top band */}
      <div className="h-20 bg-primary/10" />
      <CardContent className="px-6 pb-6 -mt-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          {/* avatar + name */}
          <div className="flex items-end gap-4">
            <Avatar className="h-20 w-20 shrink-0 ring-4 ring-background shadow-md">
              <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                {initials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="mb-1">
              <p className="text-xl font-bold leading-tight">{user?.name ?? "—"}</p>
              <p className="text-sm text-muted-foreground">{user?.email ?? "—"}</p>
              <Badge variant="secondary" className="mt-1.5 capitalize text-[0.65rem]">
                {user?.role ?? "user"}
              </Badge>
            </div>
          </div>

          {/* stat chips */}
          <div className="flex gap-2 flex-wrap">
            <StatChip icon={Package} label="Orders" value={orderCount} />
            <StatChip icon={Heart} label="Wishlist" value={wishlistCount} />
            <StatChip icon={ShoppingBag} label="In cart" value={cartCount} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── page shell ──────────────────────────────────────────────────────────── */

function ProfileContent() {
  const user = useAuthStore((s) => s.user);

  const defaultValues: ProfileValues = {
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: "",
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
      <ProfileHeader />
      <PersonalInfoForm defaultValues={defaultValues} />
      <ChangePasswordForm />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
