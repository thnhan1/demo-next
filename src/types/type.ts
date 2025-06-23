export interface CategorySummary {
    id: string;
    name: string;
    description: string;
}

export interface ProductSummary {
    id: string;
    name: string;
    description: string;
    category: CategorySummary;
    minPrice: number;
    maxPrice: number;
    totalStock: number;
    thumbnailUrl: string;
    variantCount: number;
}

export interface ProductSummarizeResponse {
    content: ProductSummary[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}


export interface ProductVariant {
    id: string;
    color: string;
    size: string;
    price: number;
    stock: number;
    sku: string;
    imageUrl: string;
}

export interface ProductImage {
    id: string;
    url: string;
    isThumbnail: boolean;
    sortOrder: number;
}

export interface ProductDetails {
    id: string;
    name: string;
    description: string;
    category: CategorySummary;
    variants: ProductVariant[];
    images: ProductImage[];
    createdAt: number[];
    updatedAt: number[] | null;
}


export interface Product {
  id: string
  name: string
  description: string
  category: {
    id: string
    name: string
  }
  variants: ProductVariant[]
  images: ProductImage[]
  status: 'active' | 'inactive' | 'draft'
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  orderNumber: string
  customer: {
    id: string
    name: string
    email: string
  }
  items: OrderItem[]
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  shippingAddress: Address
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  variantId: string
  color: string
  size: string
  quantity: number
  price: number
  total: number
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface WarehouseItem {
  id: string
  productId: string
  productName: string
  variantId: string
  sku: string
  color: string
  size: string
  currentStock: number
  reservedStock: number
  availableStock: number
  reorderLevel: number
  location: string
  lastUpdated: string
}

export interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  lowStockItems: number
  pendingOrders: number
  recentOrders: Order[]
}
