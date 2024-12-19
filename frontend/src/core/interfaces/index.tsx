import { bookingSchema } from "./zod";
import { z } from "zod";


export interface PersonalInfo {
  firstName: string;
  lastName: string;
  idCard: string;
  email: string;
  phone: string;
  notParticipating: boolean;

}

export interface TravelDetails {
  dob: Date | undefined,
  gender: string,
  streetAddress: string,
  address2: string,
  city: string,
  zipCode: string,
}

export interface AccommodationPreferences {
  roomType: string;
  specialRequests: string;
}

export interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface BookingFormData {
  personalInfo: PersonalInfo;
  travelDetails: TravelDetails;
  // accommodationPreferences: AccommodationPreferences;
  // paymentInfo: PaymentInfo;
}
export interface Itinerary {
  day: number;
  activities: string;
  _id?: string; // Make _id optional as it's not handled by the form
}

export interface Duration {
  days: number;
  nights: number;
}

export interface Cost {
  basePrice: number;
  discount: number;
}

export interface Location {
  mainLocation: string;
  pointsOfInterest: string[];
}

export interface TripDate {
  startDate: string;
  endDate: string;
  isAvailable: boolean;
  slotsRemaining: number;
  _id?: string;
}

export interface Schedule {
  dates: TripDate[];
  itinerary: Itinerary[];
}

export interface Logistics {
  transportation: string;
  gearProvided: boolean;
  accommodation: string;
}

export interface Trip {
  _id?: string;
  name: string;
  description?: string;
  type: 'hiking' | 'camping' | 'mountaineering' | 'other';
  difficulty: 'easy' | 'moderate' | 'hard' | 'expert';
  activityLevel: 1 | 2 | 3 | 4 | 5;
  images: string[];
  status: 'open' | 'closed' | 'completed' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  duration: Duration;
  groupSize: {
    min: number;
    max: number;
  };
  location: Location;
  cost: Cost;
  schedule: Schedule;
  logistics: Logistics;
}

// Define TripFormData to include only fields managed by the form
export interface TripFormData {
  name: string;
  description?: string;
  type: 'hiking' | 'camping' | 'mountaineering' | 'other';
  difficulty: 'easy' | 'moderate' | 'hard' | 'expert';
  duration: Duration;
  cost: Cost;
  location: Location;
  schedule: Schedule;
  logistics: Logistics;
  images?: string[];
}

export type TripType = 'hiking' | 'camping' | 'mountaineering' | 'other';
export type DifficultyLevel = 'easy' | 'moderate' | 'hard' | 'expert';
export type TripStatus = 'open' | 'closed' | 'completed' | 'cancelled';
export type SortOrder = 'asc' | 'desc';

export interface TripSearchParams {
  type?: TripType;
  difficulty?: DifficultyLevel;
  activityLevel?: number | number[];
  minDays?: number;
  maxDays?: number;
  minNights?: number;
  maxNights?: number;
  minGroupSize?: number;
  maxGroupSize?: number;
  mainLocation?: string;
  pointsOfInterest?: string[];
  minPrice?: number;
  maxPrice?: number;
  status?: TripStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: 'name' | 'type' | 'difficulty' | 'activityLevel' | 'duration.days' | 'cost.basePrice' | 'schedule.dates.startDate';
  order?: SortOrder;
  page?: number;
  limit?: number;
}

export interface UseTripAPI {
  trips: Trip[];
  loading: boolean;
  addTrip: (tripData: TripFormData) => Promise<void>;
  editTrip: (id: string, tripData: TripFormData) => Promise<void>;
  removeTrip: (id: string) => Promise<void>;
  getTripById: (id: string) => Promise<Trip | null>;
  searchTrip: (filters: TripSearchParams) => Promise<void>;
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  getTrips: (page?: number, type?: string, difficulty?: string) => Promise<void>;
}

export interface UseUserAPI {
  users: User[] | null;
  loading: boolean;
  error: string | null;
  getUserProfile: () => Promise<User | null>;
  updateUserProfile: (payload: UpdateUserPayload) => Promise<User | null>;
  confirmMembership: (name: string, email: string, phone: string) => Promise<ConfirmMembershipResponse | null>;
  getAllUsers: () => Promise<User[] | null>;
  getUserById: (id: string) => Promise<User | null>;
  updateUserById: (id: string, payload: UpdateUserPayload) => Promise<User | null>;
  deleteUser: (id: string) => Promise<boolean>;
}

export interface ConfirmMembershipResponse {
  success: boolean;
  message: string;
  user?: {
    name: string;
    email: string;
    phone: string;
    nextRenewalDate?: string;
  };
  membershipExpired?: boolean;
}

export interface UpdateUserPayload {
  name?: string;
  phone?: string;
  address?: string;
  preferences?: Record<string, string>;
  role?: "user" | "admin";
}
export interface UserSearchParams {
  name?: string;
  email?: string;
  role?: string;
}
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
  searchProduct: (filters: Record<string, any>, isAvailable: boolean | undefined) => void;
  currentPage: number,
  totalPages: number,
  isSuggestion: boolean,
  goToPage: (page: number) => void;
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
  amount: number;
  authorizationUrl: string;
  reference: string;
  access_code: { accessCode: string; }
}

export interface PaymentVerifyResponse {
  status: boolean;
  message: string;
  // data: PaymentData;
}

export interface IUser {
  role: 'admin',
  id: string,
  name: string
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  preferences?: { [key: string]: string };
  bookings: string[]; // Array of Booking ObjectId strings
  address?: string;
  isEmailConfirmed: boolean;
  dateJoined: string; // ISO date string
  age?: number;
  isMember: boolean;
  image?: string;
  recentTrip?: string; // Trip ObjectId string
  nextRenewalDate?: string; // ISO date string
  latestPaymentDate?: string; // ISO date string
  latestPaymentAmount?: number;
  nextTrip?: string; // Trip ObjectId string
  hasDiscount: boolean;
  idCard?: string;
  active: boolean;
  createdAt: string; // from { timestamps: true }
  updatedAt: string; // from { timestamps: true }
}


export interface IUserState {
  user: IUser | null;
  isLoading: boolean;
  error: string | null;
}
export interface IAppState {
  appName: string,
  isLoading: boolean,
  error: boolean
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

export type ProviderType = {
  children: any
}
export interface ProcessedVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  views: string;
}

export interface VerifyPaymentResponse {
  success: boolean,
  message: string
}
export interface SignInResponse {
  message: string,
  user: IUser,
  token: string
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


export type AuthType = {
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