import { bookingSchema } from "./zod";
import { z } from "zod";


export type BookingFormValues = z.infer<typeof bookingSchema>;

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  image: string,
  category: string;
  stock: number;
  isAvailable: boolean;
}

export interface UseProductAPI {
  products: Product[];
  loading: boolean;
  addProduct: (productData: ProductFormData) => void;
  editProduct: (id: string, productData: ProductFormData) => void;
  removeProduct: (id: string) => void;
  searchProduct: (filters: Record<string, any>) => void;
}

export interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (data: ProductFormData) => void;
}

export interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export interface PaymentInitializationResponse {
  success: boolean;
  message: string;
  authorizationUrl: string;
  reference: string;
  access_code:{ accessCode: string; }
}

export interface PaymentVerifyResponse {
  status: boolean;
  message: string;
  // data: PaymentData;
}

export interface IUser {
    role:'admin',
    id:string,
    name:string
}

export interface IUserState {
  user: IUser | null;
  isLoading: boolean;
  error: string | null;
}
export interface IAppState {
    appName:string,
    isLoading:boolean,
    error:boolean
}

export interface YouTubeThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface YouTubeResourceId {
  kind: string;
  videoId: string;
}

export interface YouTubeSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: {
    default: YouTubeThumbnail;
    medium: YouTubeThumbnail;
    high: YouTubeThumbnail;
    standard?: YouTubeThumbnail;
    maxres?: YouTubeThumbnail;
  };
  channelTitle: string;
  playlistId: string;
  position: number;
  resourceId: YouTubeResourceId;
}

export interface YouTubeStatistics {
  viewCount: string;
}

export interface YouTubePlaylistItem {
  kind: string;
  etag: string;
  id: string;
  snippet: YouTubeSnippet;
}

export interface YouTubeVideoDetails {
  id: string;
  statistics: YouTubeStatistics;
}

export interface YouTubePlaylistResponse {
  kind: string;
  etag: string;
  items: YouTubePlaylistItem[];
  nextPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

export interface YouTubeVideosResponse {
  items: YouTubeVideoDetails[];
}

export type ProviderType ={
  children:any
}
export interface ProcessedVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  views: string;
}

export interface SignInResponse {
  message:string,
  user :IUser,
  token:string
}
export interface Product {
  _id: string;
  name: string;
  category: string;
  imageUrl: string;
  price: number;
  oldPrice?: number; 
  description: string;
  stock: number;
  isAvailable: boolean;
}


export type AuthType ={
  auth: boolean
}

export interface Booking {
  _id: string;
  campsite: string;
  campingDate: string;
  numberOfPeople: number;
  bookingDate: string;
  totalCost: number;
  status: string;
  specialRequests?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

  
  export type ProductCardProps = {
    product: Product;
  };

  export type ProductGridProps = {
    products: Product[];
  };

  export type FilterSidebarProps = {
    categories: string[];
    onFilterChange: (category: string) => void;
  };