# FreshCart

A modern e-commerce web application built with Next.js 15, TypeScript, and Tailwind CSS v4. Consumes the [Route Academy E-Commerce API](https://ecommerce.routemisr.com/api/v1).

## Tech Stack

| Concern | Library |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Server state | TanStack Query v5 |
| Client state | Zustand v5 |
| Forms | React Hook Form + Zod |
| HTTP | Axios |
| Toasts | Sonner |
| Carousel | Embla Carousel |
| URL state | nuqs v2 |
| Icons | Lucide React |

## Features

- **Product listing** — grid with debounced search, brand/price/rating filters, and pagination — all state lives in the URL
- **Product detail** — image carousel with thumbnails, ratings, and add-to-cart
- **Brands** — browse all brands and view brand-filtered products
- **Cart** — quantity controls, remove items, order summary, persistent via API
- **Checkout** — shipping address form, cash on delivery or online payment (Stripe)
- **Auth** — login and register with form validation, JWT stored in localStorage
- **Protected routes** — client-side guard, no Next.js middleware
- **Responsive** — mobile-first layout with sticky navbar and cart badge

## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (shop)/
│   │   ├── layout.tsx          ← Navbar + Footer wrapper
│   │   ├── page.tsx            ← Home (products + search + filters)
│   │   ├── brands/page.tsx
│   │   ├── brands/[id]/page.tsx
│   │   ├── products/[id]/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   └── profile/page.tsx
│   ├── layout.tsx              ← Root layout (Providers)
│   ├── not-found.tsx
│   └── globals.css
├── components/
│   ├── ui/                     ← shadcn/ui generated components
│   ├── navbar.tsx
│   ├── footer.tsx
│   ├── product-card.tsx
│   ├── product-grid.tsx
│   ├── home-carousel.tsx
│   ├── product-carousel.tsx
│   ├── search-bar.tsx
│   ├── search-filters.tsx
│   ├── cart-item-row.tsx
│   └── protected-route.tsx
└── lib/
    ├── api/                    ← axios instance + endpoint functions
    ├── store/                  ← Zustand auth & cart stores
    ├── validations/            ← Zod schemas
    ├── types/api.ts            ← TypeScript interfaces
    └── providers.tsx           ← TanStack Query + Sonner + NuqsAdapter
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API

Base URL: `https://ecommerce.routemisr.com/api/v1`

Authentication uses a `token` header (not `Authorization: Bearer`). The token is stored in `localStorage` under the key `"token"` and injected automatically by the Axios interceptor.
