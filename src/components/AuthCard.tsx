import Image from "next/image";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left panel — brand */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-primary px-12 gap-8">
        <Image src="/assets/freshcart-logo.svg" alt="FreshCart" width={180} height={35} className="brightness-0 invert" />
        <div className="text-center text-primary-foreground space-y-3 max-w-xs">
          <h2 className="text-3xl font-bold leading-snug">Fresh deals, every day.</h2>
          <p className="text-primary-foreground/70 text-sm leading-relaxed">
            Shop thousands of products with fast delivery and unbeatable prices.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 w-full max-w-xs mt-4">
          {["🛒 Easy checkout", "🔒 Secure payments", "🚚 Fast delivery", "💚 Best prices", "⭐ Top brands", "🎁 Daily deals"].map((t) => (
            <div key={t} className="bg-white/10 rounded-xl px-3 py-2 text-xs text-primary-foreground/80 text-center">{t}</div>
          ))}
        </div>
      </div>

      {/* right panel — form */}
      <div className={cn("flex flex-col items-center justify-center px-6 py-12", className)}>
        <div className="w-full max-w-md space-y-6">
          {/* mobile logo */}
          <div className="flex justify-center lg:hidden mb-2">
            <Image src="/assets/freshcart-logo.svg" alt="FreshCart" width={140} height={28} />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
