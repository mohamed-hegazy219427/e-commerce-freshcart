# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # Start dev server (Create React App)
npm run build    # Production build
npm test         # Run Jest tests (react-scripts)
```

ESLint runs automatically via `react-scripts` using the `react-app` config. No separate lint command is configured.

## Architecture Overview

This is a **Create React App** React 18 e-commerce frontend for "FreshCart", consuming the API at `https://ecommerce.routemisr.com/api/v1`.

### Routing

React Router v6 with a nested layout pattern. `App.jsx` defines all routes; `Layout` wraps protected pages with `<Navbar>`, `<Outlet>`, and `<Footer>`. `ProtectedRoute` checks for a decoded `currUser` from localStorage JWT before rendering children.

```
/home               → Home (product listing + pagination)
/cart               → Cart (protected)
/profile            → Profile (protected)
/cashOrder          → UserOrder/Checkout (protected)
/brands             → Brands
/prodDetails/:id    → Product detail
/brandProducts/:id  → Brand-filtered products
/login, /register   → Auth pages
```

### State Management

- **Cart state** — Context API via `src/Context/cartContext.js`. Exposes `addProductToCart`, `removeProductFromCart`, `updateProductCount`, `clearUserCart`, `getLoggedUserCart`, and `isProductInUserCart`. All cart mutations call the API directly and update context state.
- **Auth state** — `currUser` in `App.jsx` state, decoded from JWT in localStorage using `jwt-decode`. Passed via props/context. Logout clears `localStorage.token`.
- No Redux or Zustand.

### API Integration

All HTTP calls use `axios` with no centralized service layer — calls are made directly from components and context. Authentication uses a `token` header (not `Authorization: Bearer`):

```js
axios.get("/endpoint", { headers: { token: localStorage.getItem("token") } })
```

Base URL: `https://ecommerce.routemisr.com/api/v1`

Key endpoints: `GET /products`, `GET/POST/DELETE/PUT /cart`, `POST /auth/signin`, `POST /auth/signup`, `GET /brands`.

### Styling

- **Bootstrap 5** for layout and utility classes
- **CSS Modules** (`*.module.css`) for component-scoped styles
- `styled-components` and `@emotion` are installed but minimally used

### Forms

**Formik** handles all form state and submission. Validation is done with custom `validate` functions passed to `useFormik`. No Yup schema library is used.

### UI Patterns

- **Toast notifications** — custom `Toast` component animated via jQuery (legacy pattern — avoid adding more jQuery usage)
- **Loading states** — dedicated `Loading` spinner component used during async fetches
- **Sliders/Carousels** — `react-slick` used in `HomeSlider` and `DetailSlider`
- **Page titles** — managed via `react-helmet`
