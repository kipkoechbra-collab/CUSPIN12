export type UserRole = 'VENDOR' | 'ADMIN';

export type ApplicationStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'AWAITING_PAYMENT'
  | 'PAID'
  | 'CONFIRMED'
  | 'CANCELLED';

export type PaymentStatus =
  | 'UNPAID'
  | 'PAYMENT_REQUESTED'
  | 'PROCESSING'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED';

export type VendorPackage = 'SINGLE_WEEKEND' | 'FULL_SEASON';

export type ProductCategory =
  | 'HANDMADE_GOODS'
  | 'CANDLES_HOME_FRAGRANCE'
  | 'JEWELRY_ACCESSORIES'
  | 'HOLIDAY_DECOR'
  | 'BAKED_GOODS'
  | 'SPECIALTY_FOODS'
  | 'COFFEE_COCOA_DRINKS'
  | 'LOCAL_ART'
  | 'WOODWORKING'
  | 'BOUTIQUE_GIFTS'
  | 'CHILDRENS_ITEMS'
  | 'OHIO_THEMED'
  | 'OTHER';

export type SponsorLevel = 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE' | 'COMMUNITY';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

export interface MarketWeekend {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  openingHours?: string;
  location: string;
  vendorCapacity: number;
  availableSpaces: number;
  isActive: boolean;
  sortOrder: number;
}

export interface VendorApplication {
  id: string;
  applicationNumber: string;
  userId: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
  businessName: string;
  businessAddress: string;
  city: string;
  state: string;
  zipCode: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  productCategory: ProductCategory;
  productDescription: string;
  priceRange?: string;
  yearsInBusiness?: number;
  previousExperience?: string;
  requestedWeekendId?: string;
  requestedWeekend?: MarketWeekend;
  vendorPackage: VendorPackage;
  electricityRequired: boolean;
  isFoodVendor: boolean;
  requiredPermits?: string;
  specialRequirements?: string;
  additionalComments?: string;
  agreedToTerms: boolean;
  agreedAt?: string;
  status: ApplicationStatus;
  isPublicListing: boolean;
  isLocked: boolean;
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
  payment?: Payment;
  messages?: Message[];
  uploadedFiles?: UploadedFile[];
}

export interface Payment {
  id: string;
  applicationId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripePaymentId?: string;
  stripeSessionId?: string;
  transactionRef?: string;
  isManualPayment: boolean;
  manualPaymentNote?: string;
  markedPaidBy?: string;
  paymentDate?: string;
  refundDate?: string;
  refundAmount?: number;
  createdAt: string;
  updatedAt: string;
  application?: {
    businessName: string;
    user?: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

export interface Sponsor {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  level: SponsorLevel;
  isActive: boolean;
  sortOrder: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  isPinned: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  applicationId?: string;
  senderId?: string;
  sender?: {
    firstName: string;
    lastName: string;
  };
  subject?: string;
  content: string;
  isFromAdmin: boolean;
  isRead: boolean;
  createdAt: string;
}

export interface UploadedFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
}

export interface AdminAuditLog {
  id: string;
  userId: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  action: string;
  entityType: string;
  entityId?: string;
  oldValue?: string;
  newValue?: string;
  ipAddress?: string;
  createdAt: string;
}

export interface AdminStats {
  totalApplications: number;
  pendingApplications: number;
  underReviewApplications: number;
  approvedVendors: number;
  rejectedApplications: number;
  awaitingPayment: number;
  paidVendors: number;
  confirmedApplications: number;
  singleWeekendVendors: number;
  fullSeasonVendors: number;
  totalRevenue: number;
  availableSpaces: number;
  unreadMessages: number;
  newsletterSubscribers: number;
  charts: {
    byCategory: Array<{ productCategory: ProductCategory; _count: { productCategory: number } }>;
    byWeekend: Array<{ requestedWeekendId: string | null; _count: { requestedWeekendId: number } }>;
    byStatus: Array<{ status: ApplicationStatus; _count: { status: number } }>;
  };
}
