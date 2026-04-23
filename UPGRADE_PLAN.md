# FreshCart V2 — Implementation Plan
## Next.js 15 · TypeScript · Tailwind v4 · shadcn/ui · TanStack Query v5 · Zustand v5

Each phase has a self-contained prompt. Give the model **only its phase prompt** — no extra context needed.

---

## Stack Decisions (reference)

| Concern | Library | Version |
|---|---|---|
| Framework | Next.js (App Router) | 15.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| UI Components | shadcn/ui (Radix UI) | latest |
| Server state | TanStack Query | 5.x |
| Client state | Zustand | 5.x |
| Forms | React Hook Form + Zod | 7.x / 3.x |
| HTTP | Axios | 1.x |
| Toast | Sonner | 1.x |
| Carousel | Embla Carousel | 8.x |
| URL filters | nuqs | 2.x |
| JWT decode | jose | 5.x |
| Icons | Lucide React | latest |

## Final folder structure (target)

```
e-commerce-freshcart-v2/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (shop)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                 ← Home
│   │   │   ├── brands/page.tsx
│   │   │   ├── brands/[id]/page.tsx
│   │   │   ├── products/[id]/page.tsx
│   │   │   ├── cart/page.tsx
│   │   │   ├── checkout/page.tsx
│   │   │   └── profile/page.tsx
│   │   ├── layout.tsx                   ← Root layout
│   │   ├── not-found.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                          ← shadcn generated (do not edit)
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   ├── product-card.tsx
│   │   ├── product-grid.tsx
│   │   ├── search-bar.tsx
│   │   ├── search-filters.tsx
│   │   ├── home-carousel.tsx
│   │   ├── product-carousel.tsx
│   │   ├── cart-item-row.tsx
│   │   └── protected-route.tsx
│   ├── lib/
│   │   ├── api/
│   │   │   ├── axios.ts
│   │   │   ├── products.ts
│   │   │   ├── cart.ts
│   │   │   ├── auth.ts
│   │   │   └── brands.ts
│   │   ├── store/
│   │   │   ├── auth-store.ts
│   │   │   └── cart-store.ts
│   │   ├── validations/
│   │   │   ├── login.ts
│   │   │   └── register.ts
│   │   ├── hooks/
│   │   │   ├── use-products.ts
│   │   │   ├── use-cart.ts
│   │   │   └── use-brands.ts
│   │   ├── providers.tsx
│   │   └── types/
│   │       └── api.ts
├── next.config.ts
├── tailwind.config.ts          ← may not exist with Tailwind v4
├── components.json             ← shadcn config
└── package.json
```

---

## Phase 0 — Project Scaffold

### Goal
Create the Next.js 15 project with all dependencies installed and shadcn/ui initialized. No application code — only infrastructure.

### Prompt

```
You are setting up a brand-new Next.js 15 e-commerce project called "e-commerce-freshcart-v2".
Work inside the directory: e-commerce-freshcart-v2/

─── STEP 1: Scaffold the project ───────────────────────────────────────────
Run this command in the PARENT folder (one level above where the project will live):

  npx create-next-app@latest e-commerce-freshcart-v2 \
    --typescript \
    --tailwind \
    --eslint \
    --app \
    --src-dir \
    --import-alias "@/*"

When prompted interactively, choose:
  - Would you like to use Turbopack? → No
  - (all other defaults are fine)

─── STEP 2: Install all production dependencies ────────────────────────────
cd into the new project folder and run:

  npm install \
    axios@^1.7 \
    zustand@^5 \
    @tanstack/react-query@^5 \
    react-hook-form@^7 \
    zod@^3 \
    @hookform/resolvers@^3 \
    sonner@^1 \
    nuqs@^2 \
    jose@^5 \
    embla-carousel-react@^8 \
    embla-carousel-autoplay@^8 \
    lucide-react

─── STEP 3: Install shadcn/ui ───────────────────────────────────────────────
Run:

  npx shadcn@latest init

When prompted:
  - Which style? → Default
  - Which base color? → Zinc
  - Use CSS variables? → Yes

Then add the shadcn components we need:

  npx shadcn@latest add button card badge input label skeleton select slider sheet dialog dropdown-menu separator avatar

─── STEP 4: Create the folder structure ─────────────────────────────────────
Create these empty folders (they will be populated by later phases):

  mkdir -p src/app/\(auth\)/login
  mkdir -p src/app/\(auth\)/register
  mkdir -p src/app/\(shop\)/brands/\[id\]
  mkdir -p src/app/\(shop\)/products/\[id\]
  mkdir -p src/app/\(shop\)/cart
  mkdir -p src/app/\(shop\)/checkout
  mkdir -p src/app/\(shop\)/profile
  mkdir -p src/components/ui
  mkdir -p src/lib/api
  mkdir -p src/lib/store
  mkdir -p src/lib/validations
  mkdir -p src/lib/hooks
  mkdir -p src/lib/types

─── STEP 5: Update next.config.ts ──────────────────────────────────────────
Replace the contents of next.config.ts with:

  import type { NextConfig } from "next";

  const nextConfig: NextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "ecommerce.routemisr.com",
        },
      ],
    },
  };

  export default nextConfig;

─── VERIFICATION ────────────────────────────────────────────────────────────
Run `npm run dev` — the app should start on localhost:3000 with the default
Next.js landing page. No errors in the terminal.
```

---

## Phase 1 — TypeScript Types & API Layer

### Goal
Create all TypeScript interfaces for the API and an axios instance. No React components — pure TypeScript modules.

### Prompt

```
You are working on a Next.js 15 + TypeScript e-commerce app called FreshCart.
All files in this task go inside: src/lib/

The external API base URL is: https://ecommerce.routemisr.com/api/v1
Authentication uses a header called "token" (NOT "Authorization: Bearer").
The token is stored in localStorage under the key "token".

─── FILE 1: src/lib/types/api.ts ───────────────────────────────────────────
Create this file with all API response types:

  export interface ApiMeta {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    nextPage?: number;
    prevPage?: number;
  }

  export interface Category {
    _id: string;
    name: string;
    slug: string;
    image: string;
  }

  export interface Brand {
    _id: string;
    name: string;
    slug: string;
    image: string;
  }

  export interface Product {
    _id: string;
    id: string;
    title: string;
    slug: string;
    description: string;
    quantity: number;
    sold: number;
    price: number;
    priceAfterDiscount?: number;
    imageCover: string;
    images: string[];
    category: Category;
    brand: Brand;
    ratingsAverage: number;
    ratingsQuantity: number;
  }

  export interface ProductsResponse {
    results: number;
    metadata: ApiMeta;
    data: Product[];
  }

  export interface CartProduct {
    _id: string;
    count: number;
    price: number;
    product: Product;
  }

  export interface Cart {
    _id: string;
    cartOwner: string;
    products: CartProduct[];
    totalCartPrice: number;
    updatedAt: string;
  }

  export interface CartResponse {
    status: string;
    numOfCartItems: number;
    data: Cart;
  }

  export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
  }

  export interface LoginResponse {
    message: string;
    user: { name: string; email: string; role: string };
    token: string;
  }

  export interface RegisterResponse {
    message: string;
    user: { name: string; email: string; role: string };
    token: string;
  }

  export interface BrandsResponse {
    results: number;
    metadata: ApiMeta;
    data: Brand[];
  }

  export interface ProductFilters {
    page?: number;
    keyword?: string;
    "category[in][]"?: string;
    "brand[in][]"?: string;
    "price[gte]"?: number;
    "price[lte]"?: number;
    "ratingsAverage[gte]"?: number;
    sort?: string;
  }

─── FILE 2: src/lib/api/axios.ts ───────────────────────────────────────────
Create this file:

  import axios from "axios";

  const api = axios.create({
    baseURL: "https://ecommerce.routemisr.com/api/v1",
  });

  api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.token = token;
      }
    }
    return config;
  });

  export default api;

─── FILE 3: src/lib/api/auth.ts ────────────────────────────────────────────
Create this file:

  import api from "./axios";
  import type { LoginResponse, RegisterResponse } from "@/lib/types/api";

  export interface LoginPayload {
    email: string;
    password: string;
  }

  export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    rePassword: string;
    phone: string;
  }

  export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/auth/signin", payload);
    return data;
  }

  export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
    const { data } = await api.post<RegisterResponse>("/auth/signup", payload);
    return data;
  }

─── FILE 4: src/lib/api/products.ts ────────────────────────────────────────
Create this file:

  import api from "./axios";
  import type { Product, ProductsResponse, ProductFilters } from "@/lib/types/api";

  export async function getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    const { data } = await api.get<ProductsResponse>("/products", { params: filters });
    return data;
  }

  export async function getProduct(id: string): Promise<Product> {
    const { data } = await api.get<{ data: Product }>(`/products/${id}`);
    return data.data;
  }

─── FILE 5: src/lib/api/brands.ts ─────────────────────────────────────────
Create this file:

  import api from "./axios";
  import type { BrandsResponse, ProductsResponse } from "@/lib/types/api";

  export async function getBrands(): Promise<BrandsResponse> {
    const { data } = await api.get<BrandsResponse>("/brands");
    return data;
  }

  export async function getBrandProducts(brandId: string, page = 1): Promise<ProductsResponse> {
    const { data } = await api.get<ProductsResponse>("/products", {
      params: { "brand[in][]": brandId, page },
    });
    return data;
  }

─── FILE 6: src/lib/api/cart.ts ────────────────────────────────────────────
Create this file:

  import api from "./axios";
  import type { CartResponse } from "@/lib/types/api";

  export async function getCart(): Promise<CartResponse> {
    const { data } = await api.get<CartResponse>("/cart");
    return data;
  }

  export async function addToCart(productId: string): Promise<CartResponse> {
    const { data } = await api.post<CartResponse>("/cart", { productId });
    return data;
  }

  export async function removeFromCart(productId: string): Promise<CartResponse> {
    const { data } = await api.delete<CartResponse>(`/cart/${productId}`);
    return data;
  }

  export async function updateCartItem(productId: string, count: number): Promise<CartResponse> {
    const { data } = await api.put<CartResponse>(`/cart/${productId}`, { count });
    return data;
  }

  export async function clearCart(): Promise<{ message: string }> {
    const { data } = await api.delete<{ message: string }>("/cart");
    return data;
  }

─── VERIFICATION ────────────────────────────────────────────────────────────
Run: npx tsc --noEmit
There should be zero TypeScript errors.
```

---

## Phase 2 — Zustand Stores

### Goal
Create the auth store and cart store with Zustand. These replace the old Context API and localStorage JWT decoding.

### Prompt

```
You are working on a Next.js 15 + TypeScript e-commerce app called FreshCart.
Zustand v5 is already installed.

IMPORTANT: In Zustand v5, the create function is imported from "zustand" directly.
Use the pattern: import { create } from "zustand"

─── FILE 1: src/lib/store/auth-store.ts ────────────────────────────────────
Create this file. It manages the logged-in user decoded from a JWT stored in localStorage.
Use the "jose" library to decode the token (it's already installed).

  "use client";

  import { create } from "zustand";
  import { decodeJwt } from "jose";
  import type { AuthUser } from "@/lib/types/api";

  interface AuthState {
    user: AuthUser | null;
    token: string | null;
    setToken: (token: string) => void;
    logout: () => void;
    initFromStorage: () => void;
  }

  export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,

    setToken: (token: string) => {
      localStorage.setItem("token", token);
      const user = decodeJwt(token) as AuthUser;
      set({ token, user });
    },

    logout: () => {
      localStorage.removeItem("token");
      set({ token: null, user: null });
    },

    initFromStorage: () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const user = decodeJwt(token) as AuthUser;
        const isExpired = user.exp * 1000 < Date.now();
        if (isExpired) {
          localStorage.removeItem("token");
          return;
        }
        set({ token, user });
      } catch {
        localStorage.removeItem("token");
      }
    },
  }));

─── FILE 2: src/lib/store/cart-store.ts ────────────────────────────────────
Create this file. It manages cart state synced with the API.
Import the cart API functions from "@/lib/api/cart".

  "use client";

  import { create } from "zustand";
  import { toast } from "sonner";
  import {
    getCart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
  } from "@/lib/api/cart";
  import type { CartProduct } from "@/lib/types/api";

  interface CartState {
    items: CartProduct[];
    count: number;
    total: number;
    cartId: string | null;
    isLoading: boolean;
    fetchCart: () => Promise<void>;
    addItem: (productId: string) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    updateItem: (productId: string, count: number) => Promise<void>;
    clearAll: () => Promise<void>;
    isInCart: (productId: string) => boolean;
  }

  export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    count: 0,
    total: 0,
    cartId: null,
    isLoading: false,

    fetchCart: async () => {
      try {
        const res = await getCart();
        set({
          items: res.data.products,
          count: res.numOfCartItems,
          total: res.data.totalCartPrice,
          cartId: res.data._id,
        });
      } catch {
        set({ items: [], count: 0, total: 0, cartId: null });
      }
    },

    addItem: async (productId) => {
      set({ isLoading: true });
      try {
        await addToCart(productId);
        await get().fetchCart();
        toast.success("Added to cart");
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        toast.error(error?.response?.data?.message ?? "Please login first");
      } finally {
        set({ isLoading: false });
      }
    },

    removeItem: async (productId) => {
      set({ isLoading: true });
      try {
        await removeFromCart(productId);
        await get().fetchCart();
        toast.success("Removed from cart");
      } catch {
        toast.error("Failed to remove item");
      } finally {
        set({ isLoading: false });
      }
    },

    updateItem: async (productId, count) => {
      set({ isLoading: true });
      try {
        await updateCartItem(productId, count);
        await get().fetchCart();
        toast.success("Cart updated");
      } catch {
        toast.error("Failed to update quantity");
      } finally {
        set({ isLoading: false });
      }
    },

    clearAll: async () => {
      set({ isLoading: true });
      try {
        await clearCart();
        set({ items: [], count: 0, total: 0, cartId: null });
        toast.success("Cart cleared");
      } catch {
        toast.error("Failed to clear cart");
      } finally {
        set({ isLoading: false });
      }
    },

    isInCart: (productId) => {
      return get().items.some((item) => item.product._id === productId);
    },
  }));

─── VERIFICATION ────────────────────────────────────────────────────────────
Run: npx tsc --noEmit
Zero TypeScript errors expected.
```

---

## Phase 3 — Providers + Root Layout

### Goal
Create the TanStack Query provider wrapper, Sonner toaster, and the root layout that bootstraps both auth and cart state on load.

### Prompt

```
You are working on a Next.js 15 + TypeScript e-commerce app called FreshCart.
The following files already exist:
  - src/lib/store/auth-store.ts   (exports useAuthStore with initFromStorage, user)
  - src/lib/store/cart-store.ts   (exports useCartStore with fetchCart, count)

─── FILE 1: src/lib/providers.tsx ──────────────────────────────────────────
This is a client component that wraps the app with TanStack Query and Sonner.
It also bootstraps auth and cart state from localStorage on mount.

  "use client";

  import { useState, useEffect } from "react";
  import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
  import { Toaster } from "sonner";
  import { useAuthStore } from "@/lib/store/auth-store";
  import { useCartStore } from "@/lib/store/cart-store";

  function AppBootstrap({ children }: { children: React.ReactNode }) {
    const initFromStorage = useAuthStore((s) => s.initFromStorage);
    const user = useAuthStore((s) => s.user);
    const fetchCart = useCartStore((s) => s.fetchCart);

    useEffect(() => {
      initFromStorage();
    }, [initFromStorage]);

    useEffect(() => {
      if (user) fetchCart();
    }, [user, fetchCart]);

    return <>{children}</>;
  }

  export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
      () =>
        new QueryClient({
          defaultOptions: {
            queries: {
              staleTime: 1000 * 60 * 5,
              retry: 1,
            },
          },
        })
    );

    return (
      <QueryClientProvider client={queryClient}>
        <AppBootstrap>
          {children}
          <Toaster position="top-right" richColors />
        </AppBootstrap>
      </QueryClientProvider>
    );
  }

─── FILE 2: src/app/layout.tsx ─────────────────────────────────────────────
Replace the entire file with:

  import type { Metadata } from "next";
  import { Inter } from "next/font/google";
  import "./globals.css";
  import { Providers } from "@/lib/providers";

  const inter = Inter({ subsets: ["latin"] });

  export const metadata: Metadata = {
    title: { default: "FreshCart", template: "%s | FreshCart" },
    description: "Modern e-commerce experience",
  };

  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <Providers>{children}</Providers>
        </body>
      </html>
    );
  }

─── FILE 3: src/app/globals.css ────────────────────────────────────────────
Replace the entire file with the shadcn/ui CSS variables that were generated
during `npx shadcn@latest init`. Do NOT delete or change the @layer base block
containing the CSS variables — shadcn depends on them.
Add this at the bottom of the file:

  @layer utilities {
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

─── VERIFICATION ────────────────────────────────────────────────────────────
Run `npm run dev`. Open localhost:3000. No console errors. Network tab should
show no failed requests. The page renders (default Next.js page is fine for now).
Run `npx tsc --noEmit` — zero errors.
```

---

## Phase 4 — Auth Pages + Client-Side Route Guard

### Goal
Build Login and Register pages with React Hook Form + Zod. Protect routes with a
`ProtectedRoute` client component — same localStorage-only pattern as the original
app. No cookies, no Next.js middleware.

### Auth pattern (identical to the original CRA app)
- Token stored in `localStorage` under the key `"token"`.
- API calls use header `token: localStorage.getItem("token")` (handled by the axios interceptor).
- Route protection is client-side: `ProtectedRoute` reads Zustand auth store; if no
  user, it redirects to `/login` via `router.replace`.
- Login/register pages redirect to `/` if user is already logged in.
- Logout = `localStorage.removeItem("token")` + clear Zustand state.

### Prompt

```
You are working on a Next.js 15 + TypeScript e-commerce app called FreshCart.
The following files already exist:
  - src/lib/store/auth-store.ts     (exports useAuthStore: setToken, logout, user, initFromStorage)
  - src/lib/api/auth.ts             (exports loginUser(payload), registerUser(payload))
  - src/lib/validations/ directory  (empty, you will create files here)

AUTH RULE: Token lives ONLY in localStorage["token"]. No cookies. No middleware.
Route protection is client-side only via a ProtectedRoute component.

─── FILE 1: src/lib/validations/login.ts ───────────────────────────────────
  import { z } from "zod";

  export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  export type LoginFormValues = z.infer<typeof loginSchema>;

─── FILE 2: src/lib/validations/register.ts ────────────────────────────────
  import { z } from "zod";

  export const registerSchema = z
    .object({
      name: z.string().min(3, "Name must be at least 3 characters"),
      email: z.string().email("Invalid email address"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain an uppercase letter")
        .regex(/[0-9]/, "Must contain a number"),
      rePassword: z.string(),
      phone: z
        .string()
        .regex(/^01[0125][0-9]{8}$/, "Enter a valid Egyptian phone number"),
    })
    .refine((d) => d.password === d.rePassword, {
      path: ["rePassword"],
      message: "Passwords do not match",
    });

  export type RegisterFormValues = z.infer<typeof registerSchema>;

─── FILE 3: src/components/protected-route.tsx ─────────────────────────────
A client component that guards any children behind authentication.
Wraps the child content — does NOT render a layout.

  "use client";

  import { useEffect } from "react";
  import { useRouter } from "next/navigation";
  import { useAuthStore } from "@/lib/store/auth-store";

  interface ProtectedRouteProps {
    children: React.ReactNode;
  }

  export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const user = useAuthStore((s) => s.user);
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.replace("/login");
      }
    }, [user, router]);

    if (!user) return null;

    return <>{children}</>;
  }

─── FILE 4: src/app/(auth)/login/page.tsx ──────────────────────────────────
  "use client";

  import { useEffect } from "react";
  import { useForm } from "react-hook-form";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { useRouter } from "next/navigation";
  import Link from "next/link";
  import { toast } from "sonner";
  import { loginSchema, type LoginFormValues } from "@/lib/validations/login";
  import { loginUser } from "@/lib/api/auth";
  import { useAuthStore } from "@/lib/store/auth-store";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";

  export default function LoginPage() {
    const setToken = useAuthStore((s) => s.setToken);
    const user = useAuthStore((s) => s.user);
    const router = useRouter();

    // Already logged in → go home
    useEffect(() => {
      if (user) router.replace("/");
    }, [user, router]);

    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

    async function onSubmit(values: LoginFormValues) {
      try {
        const res = await loginUser(values);
        setToken(res.token); // stores token in localStorage + decodes user into Zustand
        toast.success(`Welcome back, ${res.user.name}`);
        router.push("/");
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        toast.error(error?.response?.data?.message ?? "Login failed");
      }
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Sign in</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              New here?{" "}
              <Link href="/register" className="text-primary underline-offset-4 hover:underline">
                Create an account
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

─── FILE 5: src/app/(auth)/register/page.tsx ───────────────────────────────
  "use client";

  import { useEffect } from "react";
  import { useForm } from "react-hook-form";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { useRouter } from "next/navigation";
  import Link from "next/link";
  import { toast } from "sonner";
  import { registerSchema, type RegisterFormValues } from "@/lib/validations/register";
  import { registerUser } from "@/lib/api/auth";
  import { useAuthStore } from "@/lib/store/auth-store";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";

  export default function RegisterPage() {
    const setToken = useAuthStore((s) => s.setToken);
    const user = useAuthStore((s) => s.user);
    const router = useRouter();

    // Already logged in → go home
    useEffect(() => {
      if (user) router.replace("/");
    }, [user, router]);

    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

    async function onSubmit(values: RegisterFormValues) {
      try {
        const res = await registerUser(values);
        setToken(res.token); // stores token in localStorage + decodes user into Zustand
        toast.success(`Account created! Welcome, ${res.user.name}`);
        router.push("/");
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        toast.error(error?.response?.data?.message ?? "Registration failed");
      }
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Create account</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Already have one?{" "}
              <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {[
              { id: "name", label: "Full name", type: "text", placeholder: "John Doe" },
              { id: "email", label: "Email", type: "email", placeholder: "you@example.com" },
              { id: "password", label: "Password", type: "password", placeholder: "" },
              { id: "rePassword", label: "Confirm password", type: "password", placeholder: "" },
              { id: "phone", label: "Phone (Egyptian)", type: "tel", placeholder: "01XXXXXXXXX" },
            ].map(({ id, label, type, placeholder }) => (
              <div key={id} className="space-y-2">
                <Label htmlFor={id}>{label}</Label>
                <Input
                  id={id}
                  type={type}
                  placeholder={placeholder}
                  {...register(id as keyof RegisterFormValues)}
                />
                {errors[id as keyof RegisterFormValues] && (
                  <p className="text-sm text-destructive">
                    {errors[id as keyof RegisterFormValues]?.message}
                  </p>
                )}
              </div>
            ))}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account…" : "Create account"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

─── HOW TO USE ProtectedRoute on protected pages ────────────────────────────
For any page that requires auth (cart, checkout, profile), wrap the page content:

  // Example: src/app/(shop)/cart/page.tsx
  import { ProtectedRoute } from "@/components/protected-route";

  export default function CartPage() {
    return (
      <ProtectedRoute>
        {/* cart content here */}
      </ProtectedRoute>
    );
  }

─── VERIFICATION ────────────────────────────────────────────────────────────
1. npm run dev — no errors.
2. Visit /login — form renders. Submit with valid credentials → redirects to /.
3. While logged in, visit /login again → immediately redirects to /.
4. Visit /cart while logged out → redirects to /login.
5. NO middleware.ts file should exist anywhere in the project.
6. npx tsc --noEmit — zero errors.
```

---

## Phase 5 — Shop Layout: Navbar + Footer

### Goal
Build the Navbar (with cart badge and user dropdown) and Footer, then wire them into the (shop) group layout.

### Prompt

```
You are working on a Next.js 15 + TypeScript e-commerce app called FreshCart.
The following files already exist:
  - src/lib/store/auth-store.ts   (exports useAuthStore: user, logout)
  - src/lib/store/cart-store.ts   (exports useCartStore: count)

shadcn/ui components available in src/components/ui/:
  button, badge, dropdown-menu, separator, avatar, sheet

─── FILE 1: src/components/navbar.tsx ──────────────────────────────────────
  "use client";

  import Link from "next/link";
  import { useRouter } from "next/navigation";
  import { ShoppingCart, User, LogOut, Package, Home, Tag } from "lucide-react";
  import { useAuthStore } from "@/lib/store/auth-store";
  import { useCartStore } from "@/lib/store/cart-store";
  import { Button } from "@/components/ui/button";
  import { Badge } from "@/components/ui/badge";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { Avatar, AvatarFallback } from "@/components/ui/avatar";

  export function Navbar() {
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);
    const count = useCartStore((s) => s.count);
    const router = useRouter();

    function handleLogout() {
      logout(); // clears localStorage["token"] + Zustand user state
      router.push("/login");
    }

    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-primary">
            FreshCart
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
              <Home size={16} /> Home
            </Link>
            <Link href="/brands" className="flex items-center gap-1 hover:text-primary transition-colors">
              <Tag size={16} /> Brands
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon" aria-label="Cart">
                <ShoppingCart size={20} />
                {count > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {count}
                  </Badge>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        {user.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm font-medium">{user.name}</div>
                  <div className="px-2 pb-1.5 text-xs text-muted-foreground truncate">{user.email}</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User size={14} className="mr-2" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/cart" className="cursor-pointer">
                      <Package size={14} className="mr-2" /> My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                    <LogOut size={14} className="mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }

─── FILE 2: src/components/footer.tsx ──────────────────────────────────────
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

─── FILE 3: src/app/(shop)/layout.tsx ──────────────────────────────────────
  import { Navbar } from "@/components/navbar";
  import { Footer } from "@/components/footer";

  export default function ShopLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    );
  }

─── VERIFICATION ────────────────────────────────────────────────────────────
1. npm run dev — visit /. Navbar with "FreshCart" logo is visible.
2. When not logged in: "Sign in" and "Sign up" buttons appear.
3. Login with valid credentials → user avatar appears in navbar.
4. Cart icon shows badge when items exist.
5. npx tsc --noEmit — zero errors.
```

---

## Phase 6 — Product Card + Home Carousel

### Goal
Build the ProductCard component and the HomeCarousel (using Embla). These are reused across Home, Brands, and search results.

### Prompt

```
You are working on a Next.js 15 + TypeScript e-commerce app called FreshCart.
The following files already exist:
  - src/lib/store/cart-store.ts    (exports useCartStore: addItem, isInCart, isLoading)
  - src/lib/types/api.ts           (exports Product interface)

shadcn/ui components available: card, badge, button, skeleton
lucide-react is installed.
embla-carousel-react and embla-carousel-autoplay are installed.
Next.js Image component should be used instead of <img>.

─── FILE 1: src/components/product-card.tsx ────────────────────────────────
  "use client";

  import Image from "next/image";
  import Link from "next/link";
  import { ShoppingCart, Check, Star } from "lucide-react";
  import { useCartStore } from "@/lib/store/cart-store";
  import { Card, CardContent } from "@/components/ui/card";
  import { Badge } from "@/components/ui/badge";
  import { Button } from "@/components/ui/button";
  import type { Product } from "@/lib/types/api";
  import { cn } from "@/lib/utils";

  interface ProductCardProps {
    product: Product;
  }

  export function ProductCard({ product }: ProductCardProps) {
    const addItem = useCartStore((s) => s.addItem);
    const isInCart = useCartStore((s) => s.isInCart);
    const isLoading = useCartStore((s) => s.isLoading);
    const inCart = isInCart(product._id);

    const discount = product.priceAfterDiscount
      ? Math.round(100 - (product.priceAfterDiscount / product.price) * 100)
      : null;

    const displayTitle = product.title.split(" ").slice(0, 5).join(" ");

    return (
      <Card className="group overflow-hidden border hover:shadow-lg transition-shadow duration-300">
        <Link href={`/products/${product._id}`}>
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <Image
              src={product.imageCover}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {discount && (
              <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                -{discount}%
              </Badge>
            )}
          </div>
        </Link>

        <CardContent className="p-4 space-y-2">
          <p className="text-xs text-muted-foreground capitalize">{product.category.slug}</p>
          <Link href={`/products/${product._id}`}>
            <h3 className="font-semibold text-sm leading-snug line-clamp-2 hover:text-primary transition-colors">
              {displayTitle}
            </h3>
          </Link>

          <div className="flex items-center gap-1">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium">{product.ratingsAverage}</span>
            <span className="text-xs text-muted-foreground">({product.ratingsQuantity})</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {product.priceAfterDiscount ? (
                <>
                  <span className="text-sm text-muted-foreground line-through">${product.price}</span>
                  <span className="font-bold text-sm">${product.priceAfterDiscount}</span>
                </>
              ) : (
                <span className="font-bold text-sm">${product.price}</span>
              )}
            </div>
            <Button
              size="sm"
              variant={inCart ? "secondary" : "default"}
              className={cn("shrink-0 h-8 px-3", inCart && "pointer-events-none")}
              onClick={() => !inCart && addItem(product._id)}
              disabled={isLoading}
              aria-label={inCart ? "In cart" : "Add to cart"}
            >
              {inCart ? <Check size={14} /> : <ShoppingCart size={14} />}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

─── FILE 2: src/components/home-carousel.tsx ───────────────────────────────
  "use client";

  import useEmblaCarousel from "embla-carousel-react";
  import Autoplay from "embla-carousel-autoplay";
  import Image from "next/image";

  const SLIDES = [
    { src: "https://ecommerce.routemisr.com/Route-Academy-projects/1681291680621.jpeg", alt: "Slide 1" },
    { src: "https://ecommerce.routemisr.com/Route-Academy-projects/1681291733972.jpeg", alt: "Slide 2" },
    { src: "https://ecommerce.routemisr.com/Route-Academy-projects/1681291703016.jpeg", alt: "Slide 3" },
  ];

  export function HomeCarousel() {
    const [emblaRef] = useEmblaCarousel({ loop: true }, [
      Autoplay({ delay: 4000, stopOnInteraction: false }),
    ]);

    return (
      <div className="overflow-hidden rounded-xl" ref={emblaRef}>
        <div className="flex">
          {SLIDES.map((slide) => (
            <div key={slide.src} className="relative flex-[0_0_100%] aspect-[16/5]">
              <Image src={slide.src} alt={slide.alt} fill className="object-cover" priority />
            </div>
          ))}
        </div>
      </div>
    );
  }

─── VERIFICATION ────────────────────────────────────────────────────────────
These components are not yet used on a page — they will be imported in Phase 7.
Run: npx tsc --noEmit — zero errors.
```

---

## Phase 7 — Home Page with Advanced Search & Filters

### Goal
Build the complete Home page: product grid, debounced search bar, category/brand/price/rating filters, and pagination. All filter state lives in the URL via `nuqs`.

### Prompt

```
You are working on a Next.js 15 + TypeScript e-commerce app called FreshCart.
The following files already exist:
  - src/lib/api/products.ts        (exports getProducts(filters))
  - src/lib/api/brands.ts          (exports getBrands())
  - src/lib/types/api.ts           (exports Product, Brand, ProductFilters, ApiMeta)
  - src/components/product-card.tsx (exports ProductCard)
  - src/components/home-carousel.tsx (exports HomeCarousel)

shadcn/ui components available: button, input, label, badge, select, slider, skeleton, sheet, separator
nuqs v2 is installed. TanStack Query v5 is installed.
lucide-react is installed.

─── FILE 1: src/components/search-bar.tsx ──────────────────────────────────
A controlled input that debounces writes to the URL "keyword" param by 350ms.

  "use client";

  import { useQueryState } from "nuqs";
  import { useEffect, useState } from "react";
  import { Search, X } from "lucide-react";
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";

  export function SearchBar() {
    const [keyword, setKeyword] = useQueryState("keyword", { defaultValue: "", shallow: false });
    const [draft, setDraft] = useState(keyword);

    // Sync local draft to URL after 350ms idle
    useEffect(() => {
      const t = setTimeout(() => setKeyword(draft || null), 350);
      return () => clearTimeout(t);
    }, [draft, setKeyword]);

    // Keep draft in sync when URL changes externally (e.g. back button)
    useEffect(() => {
      setDraft(keyword);
    }, [keyword]);

    return (
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Search products…"
          className="pl-9 pr-9"
          aria-label="Search products"
        />
        {draft && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => { setDraft(""); setKeyword(null); }}
            aria-label="Clear search"
          >
            <X size={14} />
          </Button>
        )}
      </div>
    );
  }

─── FILE 2: src/components/search-filters.tsx ──────────────────────────────
Sidebar/sheet with brand, price range, and rating filters — all URL-driven.

  "use client";

  import { useQueryState, parseAsInteger, parseAsFloat } from "nuqs";
  import { SlidersHorizontal } from "lucide-react";
  import type { Brand } from "@/lib/types/api";
  import { Button } from "@/components/ui/button";
  import { Badge } from "@/components/ui/badge";
  import { Label } from "@/components/ui/label";
  import { Separator } from "@/components/ui/separator";
  import { Slider } from "@/components/ui/slider";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet";

  interface SearchFiltersProps {
    brands: Brand[];
  }

  export function SearchFilters({ brands }: SearchFiltersProps) {
    const [brandId, setBrandId] = useQueryState("brand", { defaultValue: "", shallow: false });
    const [minPrice, setMinPrice] = useQueryState("minPrice", parseAsInteger.withDefault(0));
    const [maxPrice, setMaxPrice] = useQueryState("maxPrice", parseAsInteger.withDefault(5000));
    const [minRating, setMinRating] = useQueryState("minRating", parseAsFloat.withDefault(0));
    const [sort, setSort] = useQueryState("sort", { defaultValue: "", shallow: false });

    const activeCount = [brandId, minPrice > 0, maxPrice < 5000, minRating > 0, sort].filter(Boolean).length;

    function clearAll() {
      setBrandId(null);
      setMinPrice(null);
      setMaxPrice(null);
      setMinRating(null);
      setSort(null);
    }

    const content = (
      <div className="space-y-6 py-4">
        {/* Sort */}
        <div className="space-y-2">
          <Label>Sort by</Label>
          <Select value={sort} onValueChange={(v) => setSort(v || null)}>
            <SelectTrigger>
              <SelectValue placeholder="Relevance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Relevance</SelectItem>
              <SelectItem value="price">Price: Low to High</SelectItem>
              <SelectItem value="-price">Price: High to Low</SelectItem>
              <SelectItem value="-ratingsAverage">Top Rated</SelectItem>
              <SelectItem value="-createdAt">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Brand */}
        <div className="space-y-2">
          <Label>Brand</Label>
          <Select value={brandId} onValueChange={(v) => setBrandId(v || null)}>
            <SelectTrigger>
              <SelectValue placeholder="All brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All brands</SelectItem>
              {brands.map((b) => (
                <SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Price range */}
        <div className="space-y-3">
          <Label>Price range: ${minPrice} – ${maxPrice}</Label>
          <Slider
            min={0} max={5000} step={50}
            value={[minPrice, maxPrice]}
            onValueChange={([min, max]) => { setMinPrice(min); setMaxPrice(max); }}
          />
        </div>

        <Separator />

        {/* Min rating */}
        <div className="space-y-3">
          <Label>Min. rating: {minRating > 0 ? `${minRating}★` : "Any"}</Label>
          <Slider
            min={0} max={5} step={0.5}
            value={[minRating]}
            onValueChange={([v]) => setMinRating(v)}
          />
        </div>

        <Separator />

        <Button variant="outline" className="w-full" onClick={clearAll}>
          Clear all filters
        </Button>
      </div>
    );

    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <SlidersHorizontal size={16} />
            Filters
            {activeCount > 0 && (
              <Badge className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                {activeCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          {content}
        </SheetContent>
      </Sheet>
    );
  }

─── FILE 3: src/components/product-grid.tsx ────────────────────────────────
Skeleton grid shown while loading.

  import { Skeleton } from "@/components/ui/skeleton";

  export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[4/3] w-full rounded-lg" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

─── FILE 4: src/app/(shop)/page.tsx ────────────────────────────────────────
The Home page. Reads all filter params from URL, fetches products, renders grid.

  "use client";

  import { useQueryState, parseAsInteger, parseAsFloat } from "nuqs";
  import { useQuery } from "@tanstack/react-query";
  import { ChevronLeft, ChevronRight } from "lucide-react";
  import { getProducts } from "@/lib/api/products";
  import { getBrands } from "@/lib/api/brands";
  import { ProductCard } from "@/components/product-card";
  import { ProductGridSkeleton } from "@/components/product-grid";
  import { HomeCarousel } from "@/components/home-carousel";
  import { SearchBar } from "@/components/search-bar";
  import { SearchFilters } from "@/components/search-filters";
  import { Button } from "@/components/ui/button";

  export default function HomePage() {
    const [keyword] = useQueryState("keyword", { defaultValue: "" });
    const [brandId] = useQueryState("brand", { defaultValue: "" });
    const [minPrice] = useQueryState("minPrice", parseAsInteger.withDefault(0));
    const [maxPrice] = useQueryState("maxPrice", parseAsInteger.withDefault(5000));
    const [minRating] = useQueryState("minRating", parseAsFloat.withDefault(0));
    const [sort] = useQueryState("sort", { defaultValue: "" });
    const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

    const filters = {
      ...(keyword && { keyword }),
      ...(brandId && { "brand[in][]": brandId }),
      ...(minPrice > 0 && { "price[gte]": minPrice }),
      ...(maxPrice < 5000 && { "price[lte]": maxPrice }),
      ...(minRating > 0 && { "ratingsAverage[gte]": minRating }),
      ...(sort && { sort }),
      page,
    };

    const { data: productsData, isLoading: productsLoading } = useQuery({
      queryKey: ["products", filters],
      queryFn: () => getProducts(filters),
    });

    const { data: brandsData } = useQuery({
      queryKey: ["brands"],
      queryFn: getBrands,
      staleTime: Infinity,
    });

    const products = productsData?.data ?? [];
    const meta = productsData?.metadata;
    const brands = brandsData?.data ?? [];

    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <HomeCarousel />

        <div className="flex flex-wrap items-center gap-3">
          <SearchBar />
          <SearchFilters brands={brands} />
        </div>

        {productsLoading ? (
          <ProductGridSkeleton />
        ) : products.length === 0 ? (
          <div className="py-24 text-center text-muted-foreground">
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {meta && meta.numberOfPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button
              variant="outline" size="icon"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </Button>
            {Array.from({ length: meta.numberOfPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                size="icon"
                onClick={() => setPage(p)}
                aria-label={`Page ${p}`}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline" size="icon"
              disabled={page >= meta.numberOfPages}
              onClick={() => setPage(page + 1)}
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </div>
    );
  }

─── IMPORTANT: nuqs requires a NuqsAdapter ─────────────────────────────────
Open src/lib/providers.tsx and add the NuqsAdapter wrapper:

  1. Add import: import { NuqsAdapter } from "nuqs/adapters/next/app";
  2. Wrap the QueryClientProvider return with <NuqsAdapter>:

     return (
       <NuqsAdapter>
         <QueryClientProvider client={queryClient}>
           ...existing content...
         </QueryClientProvider>
       </NuqsAdapter>
     );

─── VERIFICATION ────────────────────────────────────────────────────────────
1. npm run dev → visit /
2. Product grid loads with skeleton then real products.
3. Type in search bar → URL updates with ?keyword=... → products filter.
4. Open Filters sheet → change brand → URL updates → products filter.
5. Click pagination → page changes in URL and products update.
6. Hit browser back button → filters restore from URL.
7. npx tsc --noEmit — zero errors.
```

---

## Phase 8 — Product Detail Page

### Goal
Build the individual product page with an image carousel (Embla), product info, and "Add to Cart" action.

### Prompt

```
You are working on a Next.js 15 + TypeScript e-commerce app called FreshCart.
The following files already exist:
  - src/lib/api/products.ts       (exports getProduct(id: string): Promise<Product>)
  - src/lib/store/cart-store.ts   (exports useCartStore: addItem, isInCart, isLoading)
  - src/lib/types/api.ts          (exports Product)
  - src/components/ui/*           (shadcn components: button, badge, skeleton, separator)

embla-carousel-react is installed.
lucide-react is installed. Next.js Image component must be used.

─── FILE 1: src/components/product-carousel.tsx ────────────────────────────
  "use client";

  import { useState, useCallback } from "react";
  import useEmblaCarousel from "embla-carousel-react";
  import Image from "next/image";
  import { ChevronLeft, ChevronRight } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import { cn } from "@/lib/utils";

  interface ProductCarouselProps {
    images: string[];
    title: string;
  }

  export function ProductCarousel({ images, title }: ProductCarouselProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [emblaRef, emblaApi] = useEmblaCarousel();

    const scrollTo = useCallback(
      (index: number) => {
        emblaApi?.scrollTo(index);
        setSelectedIndex(index);
      },
      [emblaApi]
    );

    return (
      <div className="space-y-3">
        <div className="relative overflow-hidden rounded-xl bg-muted" ref={emblaRef}>
          <div className="flex">
            {images.map((src, i) => (
              <div key={src} className="relative flex-[0_0_100%] aspect-square">
                <Image src={src} alt={`${title} ${i + 1}`} fill className="object-contain p-4" />
              </div>
            ))}
          </div>
          {images.length > 1 && (
            <>
              <Button
                variant="secondary" size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-80"
                onClick={() => scrollTo(Math.max(0, selectedIndex - 1))}
                aria-label="Previous image"
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="secondary" size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-80"
                onClick={() => scrollTo(Math.min(images.length - 1, selectedIndex + 1))}
                aria-label="Next image"
              >
                <ChevronRight size={16} />
              </Button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((src, i) => (
              <button
                key={src}
                onClick={() => scrollTo(i)}
                className={cn(
                  "relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors",
                  selectedIndex === i ? "border-primary" : "border-transparent"
                )}
                aria-label={`View image ${i + 1}`}
              >
                <Image src={src} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

─── FILE 2: src/app/(shop)/products/[id]/page.tsx ──────────────────────────
  "use client";

  import { useParams } from "next/navigation";
  import { useQuery } from "@tanstack/react-query";
  import { ShoppingCart, Check, Star, Package } from "lucide-react";
  import { getProduct } from "@/lib/api/products";
  import { useCartStore } from "@/lib/store/cart-store";
  import { ProductCarousel } from "@/components/product-carousel";
  import { Button } from "@/components/ui/button";
  import { Badge } from "@/components/ui/badge";
  import { Skeleton } from "@/components/ui/skeleton";
  import { Separator } from "@/components/ui/separator";
  import { cn } from "@/lib/utils";

  export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const addItem = useCartStore((s) => s.addItem);
    const isInCart = useCartStore((s) => s.isInCart);
    const isLoading = useCartStore((s) => s.isLoading);

    const { data: product, isLoading: pageLoading } = useQuery({
      queryKey: ["product", id],
      queryFn: () => getProduct(id),
      enabled: !!id,
    });

    if (pageLoading) {
      return (
        <div className="container mx-auto px-4 py-10">
          <div className="grid md:grid-cols-2 gap-10">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-10 w-1/3" />
            </div>
          </div>
        </div>
      );
    }

    if (!product) return null;

    const inCart = isInCart(product._id);
    const discount = product.priceAfterDiscount
      ? Math.round(100 - (product.priceAfterDiscount / product.price) * 100)
      : null;

    const allImages = [product.imageCover, ...product.images].filter(Boolean);

    return (
      <div className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <ProductCarousel images={allImages} title={product.title} />

          <div className="space-y-5">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground capitalize">{product.category.name}</p>
              <h1 className="text-2xl font-bold leading-tight">{product.title}</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={cn(
                      i < Math.floor(product.ratingsAverage)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.ratingsAverage}</span>
              <span className="text-sm text-muted-foreground">({product.ratingsQuantity} reviews)</span>
            </div>

            <div className="flex items-center gap-3">
              {product.priceAfterDiscount ? (
                <>
                  <span className="text-3xl font-bold">${product.priceAfterDiscount}</span>
                  <span className="text-lg text-muted-foreground line-through">${product.price}</span>
                  {discount && <Badge variant="destructive">-{discount}%</Badge>}
                </>
              ) : (
                <span className="text-3xl font-bold">${product.price}</span>
              )}
            </div>

            <Separator />

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Package size={14} /> {product.quantity} in stock
              </span>
              <span>{product.sold} sold</span>
            </div>

            <Button
              size="lg"
              className="w-full gap-2"
              variant={inCart ? "secondary" : "default"}
              disabled={isLoading || inCart}
              onClick={() => !inCart && addItem(product._id)}
            >
              {inCart ? (
                <><Check size={18} /> In your cart</>
              ) : (
                <><ShoppingCart size={18} /> Add to cart</>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

─── VERIFICATION ────────────────────────────────────────────────────────────
1. npm run dev → click any product card on the home page.
2. Product detail page loads with image carousel and product info.
3. "Add to cart" button shows → click it → toast "Added to cart" → button changes to "In your cart".
4. Image thumbnails are clickable and switch main image.
5. npx tsc --noEmit — zero errors.
```

---

## Phase 9 — Brands + Brand Products Pages

### Goal
Build the brands listing page and the filtered products page for a single brand.

### Prompt

```
You are working on a Next.js 15 + TypeScript e-commerce app called FreshCart.
The following files already exist:
  - src/lib/api/brands.ts        (exports getBrands(), getBrandProducts(brandId, page))
  - src/lib/types/api.ts         (exports Brand, BrandsResponse, ProductsResponse)
  - src/components/product-card.tsx (exports ProductCard)
  - src/components/product-grid.tsx (exports ProductGridSkeleton)
  - src/components/ui/*          (card, skeleton, button)

Next.js Image component must be used. TanStack Query v5 is installed.
nuqs v2 is installed. lucide-react is installed.

─── FILE 1: src/app/(shop)/brands/page.tsx ─────────────────────────────────
  "use client";

  import { useQuery } from "@tanstack/react-query";
  import Image from "next/image";
  import Link from "next/link";
  import { getBrands } from "@/lib/api/brands";
  import { Card } from "@/components/ui/card";
  import { Skeleton } from "@/components/ui/skeleton";

  export default function BrandsPage() {
    const { data, isLoading } = useQuery({
      queryKey: ["brands"],
      queryFn: getBrands,
      staleTime: Infinity,
    });

    if (isLoading) {
      return (
        <div className="container mx-auto px-4 py-10">
          <Skeleton className="h-8 w-40 mb-8" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-8">All Brands</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {data?.data.map((brand) => (
            <Link key={brand._id} href={`/brands/${brand._id}`}>
              <Card className="flex flex-col items-center justify-center gap-3 p-4 aspect-square hover:shadow-md hover:border-primary transition-all cursor-pointer group">
                <div className="relative w-16 h-16">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-200"
                  />
                </div>
                <p className="text-sm font-medium text-center leading-tight">{brand.name}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    );
  }

─── FILE 2: src/app/(shop)/brands/[id]/page.tsx ────────────────────────────
  "use client";

  import { useParams } from "next/navigation";
  import { useQuery } from "@tanstack/react-query";
  import { useQueryState, parseAsInteger } from "nuqs";
  import { ChevronLeft, ChevronRight } from "lucide-react";
  import { getBrands, getBrandProducts } from "@/lib/api/brands";
  import { ProductCard } from "@/components/product-card";
  import { ProductGridSkeleton } from "@/components/product-grid";
  import { Button } from "@/components/ui/button";

  export default function BrandProductsPage() {
    const { id } = useParams<{ id: string }>();
    const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

    const { data: brandsData } = useQuery({
      queryKey: ["brands"],
      queryFn: getBrands,
      staleTime: Infinity,
    });

    const { data, isLoading } = useQuery({
      queryKey: ["brandProducts", id, page],
      queryFn: () => getBrandProducts(id, page),
      enabled: !!id,
    });

    const brand = brandsData?.data.find((b) => b._id === id);
    const products = data?.data ?? [];
    const meta = data?.metadata;

    return (
      <div className="container mx-auto px-4 py-10 space-y-8">
        <h1 className="text-2xl font-bold">{brand?.name ?? "Brand"} Products</h1>

        {isLoading ? (
          <ProductGridSkeleton />
        ) : products.length === 0 ? (
          <p className="text-muted-foreground py-12 text-center">No products found for this brand.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}

        {meta && meta.numberOfPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              <ChevronLeft size={16} />
            </Button>
            {Array.from({ length: meta.numberOfPages }, (_, i) => i + 1).map((p) => (
              <Button key={p} variant={p === page ? "default" : "outline"} size="icon" onClick={() => setPage(p)}>
                {p}
              </Button>
            ))}
            <Button variant="outline" size="icon" disabled={page >= meta.numberOfPages} onClick={() => setPage(page + 1)}>
              <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </div>
    );
  }

─── VERIFICATION ────────────────────────────────────────────────────────────
1. Visit /brands — brand cards grid renders.
2. Click a brand → navigates to /brands/[id] → products load.
3. Pagination works and updates URL.
4. npx tsc --noEmit — zero errors.
```

---

## Phase 10 — Cart Page

### Goal
Build the cart page displaying all items with quantity controls, remove buttons, total price, and a checkout link.

### Prompt

```
You are working on a Next.js 15 + TypeScript e-commerce app called FreshCart.
The following files already exist:
  - src/lib/store/cart-store.ts   (exports useCartStore: items, count, total, cartId,
                                   removeItem, updateItem, clearAll, isLoading)
  - src/lib/types/api.ts          (exports CartProduct, Product)
  - src/components/ui/*           (button, badge, separator, skeleton, card)
Next.js Image component must be used. lucide-react is installed.

─── FILE 1: src/components/cart-item-row.tsx ───────────────────────────────
  "use client";

  import Image from "next/image";
  import Link from "next/link";
  import { Minus, Plus, Trash2 } from "lucide-react";
  import { useCartStore } from "@/lib/store/cart-store";
  import { Button } from "@/components/ui/button";
  import type { CartProduct } from "@/lib/types/api";

  interface CartItemRowProps {
    item: CartProduct;
  }

  export function CartItemRow({ item }: CartItemRowProps) {
    const removeItem = useCartStore((s) => s.removeItem);
    const updateItem = useCartStore((s) => s.updateItem);
    const isLoading = useCartStore((s) => s.isLoading);

    return (
      <div className="flex gap-4 py-4">
        <Link href={`/products/${item.product._id}`} className="shrink-0">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted">
            <Image
              src={item.product.imageCover}
              alt={item.product.title}
              fill
              className="object-cover"
            />
          </div>
        </Link>

        <div className="flex-1 min-w-0">
          <Link href={`/products/${item.product._id}`}>
            <p className="font-medium text-sm leading-snug line-clamp-2 hover:text-primary transition-colors">
              {item.product.title}
            </p>
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5 capitalize">{item.product.category.slug}</p>
          <p className="font-bold mt-1">${item.price}</p>
        </div>

        <div className="flex flex-col items-end justify-between shrink-0">
          <Button
            variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => removeItem(item.product._id)}
            disabled={isLoading}
            aria-label="Remove item"
          >
            <Trash2 size={15} />
          </Button>

          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost" size="icon" className="h-8 w-8 rounded-none"
              onClick={() => item.count > 1 && updateItem(item.product._id, item.count - 1)}
              disabled={isLoading || item.count <= 1}
              aria-label="Decrease quantity"
            >
              <Minus size={13} />
            </Button>
            <span className="w-8 text-center text-sm font-medium">{item.count}</span>
            <Button
              variant="ghost" size="icon" className="h-8 w-8 rounded-none"
              onClick={() => updateItem(item.product._id, item.count + 1)}
              disabled={isLoading}
              aria-label="Increase quantity"
            >
              <Plus size={13} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

─── FILE 2: src/app/(shop)/cart/page.tsx ───────────────────────────────────
  "use client";

  import Link from "next/link";
  import { ShoppingCart, Trash2 } from "lucide-react";
  import { useCartStore } from "@/lib/store/cart-store";
  import { CartItemRow } from "@/components/cart-item-row";
  import { Button } from "@/components/ui/button";
  import { Separator } from "@/components/ui/separator";
  import { Card, CardContent } from "@/components/ui/card";

  export default function CartPage() {
    const items = useCartStore((s) => s.items);
    const count = useCartStore((s) => s.count);
    const total = useCartStore((s) => s.total);
    const clearAll = useCartStore((s) => s.clearAll);
    const isLoading = useCartStore((s) => s.isLoading);

    if (items.length === 0) {
      return (
        <div className="container mx-auto px-4 py-24 flex flex-col items-center gap-4">
          <ShoppingCart size={64} className="text-muted-foreground" strokeWidth={1} />
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground">Add some products to get started.</p>
          <Button asChild>
            <Link href="/">Browse products</Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Shopping Cart ({count})</h1>
          <Button
            variant="outline" size="sm" className="text-destructive border-destructive gap-1.5"
            onClick={clearAll}
            disabled={isLoading}
          >
            <Trash2 size={14} /> Clear cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-0">
            {items.map((item, i) => (
              <div key={item._id}>
                <CartItemRow item={item} />
                {i < items.length - 1 && <Separator />}
              </div>
            ))}
          </div>

          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Order summary</h2>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items ({count})</span>
                  <span>${total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total}</span>
              </div>
              <Button className="w-full" size="lg" asChild>
                <Link href="/checkout">Proceed to checkout</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

─── VERIFICATION ────────────────────────────────────────────────────────────
1. Add products from home page → visit /cart.
2. Items display with image, title, price, and quantity controls.
3. + / - buttons update quantity and show toast.
4. Trash icon removes item.
5. "Clear cart" empties cart and shows empty state.
6. "Proceed to checkout" link navigates to /checkout.
7. npx tsc --noEmit — zero errors.
```

---

## Phase 11 — Checkout + Profile + Not Found

### Goal
Build the checkout page (Stripe payment URL or cash order via API), profile page, and 404 page.

### Prompt

```
You are working on a Next.js 15 + TypeScript e-commerce app called FreshCart.
The following files already exist:
  - src/lib/store/auth-store.ts   (exports useAuthStore: user, logout)
  - src/lib/store/cart-store.ts   (exports useCartStore: total, cartId, clearAll)
  - src/lib/api/axios.ts          (exports default axios instance)
  - src/components/ui/*           (button, input, label, card, separator, badge)
  - src/lib/types/api.ts

─── FILE 1: src/app/(shop)/checkout/page.tsx ───────────────────────────────
The API accepts a POST to /orders/checkout-session/:cartId?url=CURRENT_URL
Returns a URL to redirect to (Stripe hosted page) for online payment.
Also support cash on delivery via POST /orders/:cartId.

  "use client";

  import { useState } from "react";
  import { useRouter } from "next/navigation";
  import { toast } from "sonner";
  import { useCartStore } from "@/lib/store/cart-store";
  import { useAuthStore } from "@/lib/store/auth-store";
  import api from "@/lib/api/axios";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { Card, CardContent } from "@/components/ui/card";
  import { Separator } from "@/components/ui/separator";
  import { CreditCard, Truck } from "lucide-react";

  export default function CheckoutPage() {
    const cartId = useCartStore((s) => s.cartId);
    const total = useCartStore((s) => s.total);
    const clearAll = useCartStore((s) => s.clearAll);
    const user = useAuthStore((s) => s.user);
    const router = useRouter();

    const [details, setDetails] = useState({ phone: "", city: "", address: "" });
    const [isLoading, setIsLoading] = useState(false);

    async function handleOnlinePayment() {
      if (!cartId) return;
      setIsLoading(true);
      try {
        const { data } = await api.post(
          `/orders/checkout-session/${cartId}`,
          { shippingAddress: details },
          { params: { url: window.location.origin } }
        );
        window.location.href = data.session.url;
      } catch {
        toast.error("Payment setup failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    async function handleCashOrder() {
      if (!cartId) return;
      setIsLoading(true);
      try {
        await api.post(`/orders/${cartId}`, { shippingAddress: details });
        await clearAll();
        toast.success("Order placed successfully!");
        router.push("/");
      } catch {
        toast.error("Order failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    const isFormValid = details.phone && details.city && details.address;

    return (
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="text-2xl font-bold mb-8">Checkout</h1>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold">Shipping address</h2>
              {[
                { id: "phone", label: "Phone", placeholder: "01XXXXXXXXX" },
                { id: "city", label: "City", placeholder: "Cairo" },
                { id: "address", label: "Street address", placeholder: "123 Main St" },
              ].map(({ id, label, placeholder }) => (
                <div key={id} className="space-y-1.5">
                  <Label htmlFor={id}>{label}</Label>
                  <Input
                    id={id}
                    placeholder={placeholder}
                    value={details[id as keyof typeof details]}
                    onChange={(e) => setDetails((d) => ({ ...d, [id]: e.target.value }))}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order total</span>
                <span className="font-bold text-lg">${total}</span>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  variant="outline" className="gap-2" size="lg"
                  onClick={handleCashOrder}
                  disabled={!isFormValid || isLoading}
                >
                  <Truck size={16} /> Cash on delivery
                </Button>
                <Button
                  className="gap-2" size="lg"
                  onClick={handleOnlinePayment}
                  disabled={!isFormValid || isLoading}
                >
                  <CreditCard size={16} /> Pay online
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

─── FILE 2: src/app/(shop)/profile/page.tsx ────────────────────────────────
  "use client";

  import { useAuthStore } from "@/lib/store/auth-store";
  import { Card, CardContent } from "@/components/ui/card";
  import { Avatar, AvatarFallback } from "@/components/ui/avatar";
  import { Badge } from "@/components/ui/badge";
  import { Separator } from "@/components/ui/separator";
  import { User, Mail, Shield } from "lucide-react";

  export default function ProfilePage() {
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

─── FILE 3: src/app/not-found.tsx ──────────────────────────────────────────
  import Link from "next/link";
  import { Button } from "@/components/ui/button";

  export default function NotFound() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <p className="text-8xl font-black text-muted-foreground/30">404</p>
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Page not found</h1>
          <p className="text-muted-foreground">The page you are looking for does not exist.</p>
        </div>
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    );
  }

─── VERIFICATION ────────────────────────────────────────────────────────────
1. /checkout — form renders. Fill in details → both payment buttons become active.
2. Cash order → redirects to / with success toast.
3. /profile — user name, email, role display correctly when logged in.
4. Navigate to /nonexistent → 404 page renders with "Back to home" button.
5. npx tsc --noEmit — zero errors.
6. npm run build — production build completes with no errors.
```

---

## Execution Order

```
Phase 0  →  Phase 1  →  Phase 2  →  Phase 3
                                         ↓
                              Phase 4 ←──┘
                              Phase 5 ←──┘
                                   ↓
             Phase 6  Phase 7  Phase 8  Phase 9  Phase 10  Phase 11
             (all can run after Phase 5, independently of each other)
```

Each phase is fully self-contained. Give the model only the "Prompt" block for its phase — no other context is needed.

## Final checklist before calling the project done

- [ ] `npm run build` — zero errors, zero warnings
- [ ] `npx tsc --noEmit` — zero errors
- [ ] Search with URL: /?keyword=phone&brand=X&sort=-price&page=2 loads correctly
- [ ] Browser back button restores all filters
- [ ] Logged-out user visiting /cart redirects to /login
- [ ] Logged-in user visiting /login redirects to /
- [ ] Cart count in navbar updates after add/remove
- [ ] Sonner toasts appear top-right for all cart operations
- [ ] All images use Next.js `<Image>` component
- [ ] No `console.log` statements left in code
- [ ] No jQuery usage anywhere
