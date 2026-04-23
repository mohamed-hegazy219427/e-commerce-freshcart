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
