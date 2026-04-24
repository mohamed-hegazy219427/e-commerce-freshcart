import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} FreshCart. All rights reserved.
        </p>
        <nav className="flex gap-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="/brands" className="hover:text-foreground transition-colors">Brands</Link>
          <Link href="/cart" className="hover:text-foreground transition-colors">Cart</Link>
        </nav>
      </div>
    </footer>
  );
}
