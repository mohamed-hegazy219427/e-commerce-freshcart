"use client";

import { useAuthStore } from "@/lib/store/authStore";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Shield } from "lucide-react";

function ProfileContent() {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-10 max-w-lg">
      <h1 className="text-2xl font-bold mb-8">Profile</h1>
      <Card>
        <CardContent className="p-8 space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {user.name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xl font-bold">{user.name}</p>
              <Badge variant="secondary" className="mt-1 capitalize">{user.role}</Badge>
            </div>
          </div>
          <Separator />
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <User size={16} className="text-muted-foreground shrink-0" />
              <div>
                <p className="text-muted-foreground text-xs">Full name</p>
                <p className="font-medium">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-muted-foreground shrink-0" />
              <div>
                <p className="text-muted-foreground text-xs">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield size={16} className="text-muted-foreground shrink-0" />
              <div>
                <p className="text-muted-foreground text-xs">Role</p>
                <p className="font-medium capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
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
