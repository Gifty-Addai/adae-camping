import { bookingSchema, TripFormInput, TypeAndDifficultyInput } from "./zod";
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
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say',
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

export interface BookingUpdate {
  selectedDateId?: string | null;
  participing?: boolean | null;
  numberOfPeople?: number | null;
  payment?: boolean | null;
  authorizationUrl?: string | null;
  reference?: string | null;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'reschedule' | null;
  rescheduleDate?: Date | null;
}

export interface BookingFormData {
  personalInfo: PersonalInfo;
  travelDetails: TravelDetails;
  tripId: string | undefined;
  selectedDate: string | undefined;
  numberOfPeople: number | undefined;
}
export interface GroupSize {
  min: number;
  max: number;
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

export interface ScheduleDate {
  startDate: Date;
  endDate: Date;
  isAvailable: boolean;
  slotsRemaining: number;
  _id?: string;
}

export interface RequestItem {
  _id: string;
  name: string;
  phone: string;
  email: string;
  startDate: string; 
  endDate: string;
  tripId: string;
  tripName: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Itinerary {
  day: number;
  activities: string;
  _id?: string;
}

export interface Schedule {
  dates: ScheduleDate[];
  itinerary: Itinerary[];
}

export interface Logistics {
  transportation: string;
  gearProvided: boolean;
  accommodation: string;
}

export interface Image {
  url: string;
}

export interface TripFormData {
  name: string;
  description?: string;
  type: TypeAndDifficultyInput["type"];
  difficulty: TypeAndDifficultyInput["difficulty"];
  duration: Duration;
  cost: Cost;
  groupSize: GroupSize;
  activityLevel: number;
  location: Location;
  schedule: Schedule;
  logistics: Logistics;
  images: Image[];
}

export interface ImageUpload {
  id: string;
  file: File | null;
  preview: string;
  uploading: boolean;
  progress: number;
  error: string | null;
  url: string | null;
}

export interface UploadImageResponse {
  url: string
}
export interface Trip extends TripFormData {
  _id: string;
}

// export interface Trip {
//   _id?: string;
//   name: string;
//   description?: string;
//   type: 'hiking' | 'camping' | 'mountaineering' | 'other';
//   difficulty: 'easy' | 'moderate' | 'hard' | 'expert';
//   activityLevel: 1 | 2 | 3 | 4 | 5;
//   images: string[];
//   status: 'open' | 'closed' | 'completed' | 'cancelled';
//   createdAt?: string;
//   updatedAt?: string;
//   __v?: number;
//   duration: Duration;
//   groupSize: {
//     min: number;
//     max: number;
//   };
//   location: Location;
//   cost: Cost;
//   schedule: Schedule;
//   logistics: Logistics;
// }

export type TripType = 'hiking' | 'camping' | 'mountaineering' | 'camping & hiking' | 'other';
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
  addTrip: (tripData: TripFormInput) => Promise<void>;
  editTrip: (id: string, tripData: TripFormInput) => Promise<void>;
  removeTrip: (id: string) => Promise<void>;
  getTripById: (id: string) => Promise<Trip | null>;
  searchTrip: (filters: TripSearchParams) => Promise<void>;
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  getTrips: (page?: number, type?: string, difficulty?: string, status?:TripStatus) => Promise<void>;
}
export interface UseMailAPI {
  loading: boolean;
  bookingConfirm: (id: string) => Promise<void>;
  bookingCancel: (id: string) => Promise<void>;
  bookingReschedule: (id: string) => Promise<void>;
}

export interface Booking {
  _id: string;
  user: User;
  trip: Trip;
  selectedDateId: string;
  participing: boolean;
  numberOfPeople: number;
  bookingDate: Date;
  payment: boolean;
  status: 'pending' | 'confirmed' | 'cancelled' | 'reschedule';
  rescheduleDate?: Date;
  reference: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SendBookingMailParams {
  confirm: boolean,
  pending: boolean,
  reschedule: boolean,
  cancel: boolean,
  bookingId: string
}

export interface BookingSearchParams {
  tempUser?: string;
  trip?: string;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'reschedule';
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export interface UseBookingAPI {
  bookings: Booking[];
  loading: boolean;
  addBooking: (bookingData: BookingFormData) => Promise<AddBookinResponse>;
  editBooking: (id: string, bookingData: BookingUpdate) => Promise<void>;
  removeBooking: (id: string) => Promise<void>;
  getBookingById: (id: string) => Promise<Booking | null>;
  searchBooking: (filters: BookingSearchParams) => Promise<void>;
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  getBookings: (page?: number, filters?: BookingSearchParams) => Promise<void>;
}

export interface ConfirmMemberRequest {
  name: string;
  phone: string;
  email: string;
  dob?: Date;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  streetAddress?: string;
  address2?: string;
  city?: string;
  zipCode?: string;
  idCard?: string;
}

export interface UseUserAPI {
  users: User[] | null;
  loading: boolean;
  error: string | null;
  getUserProfile: () => Promise<User | null>;
  updateUserProfile: (payload: UpdateUserPayload) => Promise<User | null>;
  confirmMembership: (param: ConfirmMemberRequest) => Promise<ConfirmMembershipResponse>;
  getAllUsers: () => Promise<User[] | null>;
  getUserById: (id: string) => Promise<User | null>;
  updateUserById: (id: string, payload: UpdateUserPayload) => Promise<User | null>;
  deleteUser: (id: string) => Promise<boolean>;
}

export interface ConfirmMembershipResponse {
  name: string;
  email: string;
  phone: string;
  isMember: boolean;
  membershipExpired: boolean;
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

export interface BookingCardProps {
  bookingId: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  destination: string;
  startDate: string;
  endDate: string;
  duration: number;
  customerName: string;
  email: string;
  phone: string;
  travelers: string;
  paymentStatus: 'Paid' | 'Pending Payment' | 'Unpaid';
  totalAmount: number;
  itinerary: string;
  specialRequests: string;
  onViewDetails: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onSendNotification: () => void;
}

export type CartFormValues = z.infer<typeof bookingSchema>;
export interface PaymentData {
  name: string;
  email: string;
  phone: string;
  address: string;
  preferences?: string | undefined;
  isBooking?: boolean | undefined;
  bookingId?: string | undefined;
}

export interface AddBookinResponse {
  bookingId: string;
  tripId: string;
  selectedDateId: string;
  participing: boolean;
  numberOfPeople: number;
  bookingDate: string;
  paymentDone: boolean;
  reference: string;
  status: "pending" | "confirm";
}
export interface PaymentOptions {
  key: string;
  email: string;
  amount: number;
  phone: string;
  reference: string;
  onSuccess?: (tranx: {
    id: string;
    reference: string;
    message: string;
    redirecturl: string;
    status: "success";
    trans: string;
    transaction: string;
    trxref: string;
  }) => void;
  onLoad?: (tranx: {
    customer: Record<string, string>;
    accessCode: string;
  }) => void;
  onCancel?: () => void;
  onError?: (error: {
    type: "setup";
    message: string;
  }) => void;
  metadata?: {
    custom_fields?: Array<{
      display_name: string;
      variable_name: string;
      value?: string | number;
    }>;
  };
}

export interface InitializePaymentParams {
  formData: PaymentData;
  totalAmount: number;
  onSuccess?: (tranx: {
    id: string;
    reference: string;
    message: string;
    redirecturl: string;
    status: "success";
    trans: string;
    transaction: string;
    trxref: string;
  }) => void;
  onLoad?: (tranx: {
    customer: Record<string, string>;
    accessCode: string;
  }) => void;
  onCancel?: () => void;
  onError?: (error: {
    type: "setup";
    message: string;
  }) => void;
}

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
  getProductById: (id: string) => Promise<Product | null>;
  removeProduct: (id: string) => void;
  searchProduct: (filters: Record<string, any>, isAvailable: boolean | undefined) => Promise<Product[] | void>;
  currentPage: number,
  activeProducts: number,
  inActiveProducts: number,
  totalPages: number,
  totalProducts: number,
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
  role: "user" | "admin",
  _id: string,
  name: string
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  preferences?: { [key: string]: string };
  bookings: string[];
  address?: string;
  isEmailConfirmed: boolean;
  dateJoined: string;
  age?: number;
  isMember: boolean;
  image?: string;
  recentTrip?: string;
  nextRenewalDate?: string;
  latestPaymentDate?: string;
  latestPaymentAmount?: number;
  nextTrip?: string;
  hasDiscount: boolean;
  idCard?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
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
  user: User,
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

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface CachedItem<T> {
  data: T;
  expiry: string;
}