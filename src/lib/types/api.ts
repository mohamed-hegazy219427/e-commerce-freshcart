// ─── Shared ──────────────────────────────────────────────────────────────────

export interface ApiMeta {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage?: number;
  prevPage?: number;
}

// ─── Category / Subcategory ───────────────────────────────────────────────────

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
}

export interface CategoriesResponse {
  results: number;
  metadata: ApiMeta;
  data: Category[];
}

export interface SubcategoriesResponse {
  results: number;
  data: Subcategory[];
}

// ─── Brand ───────────────────────────────────────────────────────────────────

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface BrandsResponse {
  results: number;
  metadata: ApiMeta;
  data: Brand[];
}

// ─── Product ─────────────────────────────────────────────────────────────────

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
  subcategory?: Subcategory[];
  brand: Brand;
  ratingsAverage: number;
  ratingsQuantity: number;
}

export interface ProductsResponse {
  results: number;
  metadata: ApiMeta;
  data: Product[];
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  keyword?: string;
  sort?: string;
  "category[in][]"?: string;
  "brand[in][]"?: string;
  "price[gte]"?: number;
  "price[lte]"?: number;
  "ratingsAverage[gte]"?: number;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

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
  totalPriceAfterDiscount?: number;
  updatedAt: string;
}

export interface CartResponse {
  status: string;
  numOfCartItems: number;
  data: Cart;
}

// ─── Wishlist ────────────────────────────────────────────────────────────────

export interface WishlistResponse {
  status: string;
  count: number;
  data: Product[];
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export interface OrderItem {
  count: number;
  _id: string;
  product: Pick<Product, "_id" | "title" | "imageCover" | "price">;
  price: number;
}

export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}

export interface Order {
  _id: string;
  user: { name: string; email: string; phone: string };
  cartItems: OrderItem[];
  shippingAddress: ShippingAddress;
  totalOrderPrice: number;
  paymentMethodType: "cash" | "card";
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
}

export interface OrdersResponse {
  results: number;
  data: Order[];
}

export interface CheckoutSessionResponse {
  status: string;
  session: {
    url: string;
  };
}

// ─── Auth ────────────────────────────────────────────────────────────────────

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

export interface ForgotPasswordResponse {
  statusMsg: string;
  message: string;
}

export interface ResetPasswordResponse {
  token: string;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface UserProfileResponse {
  message: string;
  user: UserProfile;
}
