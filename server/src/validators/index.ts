import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const vendorApplicationSchema = z.object({
  businessName: z.string().min(1, 'Business name is required').max(200),
  businessAddress: z.string().min(1, 'Business address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(5, 'ZIP code is required'),
  website: z.string().url().optional().or(z.literal('')),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  productCategory: z.enum([
    'HANDMADE_GOODS', 'CANDLES_HOME_FRAGRANCE', 'JEWELRY_ACCESSORIES',
    'HOLIDAY_DECOR', 'BAKED_GOODS', 'SPECIALTY_FOODS',
    'COFFEE_COCOA_DRINKS', 'LOCAL_ART', 'WOODWORKING',
    'BOUTIQUE_GIFTS', 'CHILDRENS_ITEMS', 'OHIO_THEMED', 'OTHER'
  ]),
  productDescription: z.string().min(10, 'Please describe your products (at least 10 characters)'),
  priceRange: z.string().optional(),
  yearsInBusiness: z.number().int().min(0).optional(),
  previousExperience: z.string().optional(),
  requestedWeekendId: z.string().optional(),
  vendorPackage: z.enum(['SINGLE_WEEKEND', 'FULL_SEASON']),
  electricityRequired: z.boolean().default(false),
  isFoodVendor: z.boolean().default(false),
  requiredPermits: z.string().optional(),
  specialRequirements: z.string().optional(),
  additionalComments: z.string().optional(),
  agreedToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
});

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().optional(),
});

export const sponsorApplicationSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  contactName: z.string().min(1, 'Contact name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  website: z.string().optional(),
  level: z.enum(['PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'COMMUNITY']).default('COMMUNITY'),
  message: z.string().optional(),
});

export const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  category: z.string().optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const announcementSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  isActive: z.boolean().default(true),
  isPinned: z.boolean().default(false),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const marketWeekendSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  openingHours: z.string().optional(),
  location: z.string().default('Chardon Square, Chardon, Ohio'),
  vendorCapacity: z.number().int().min(1).default(50),
  availableSpaces: z.number().int().min(0).default(50),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const sponsorSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  websiteUrl: z.string().optional(),
  level: z.enum(['PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'COMMUNITY']),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});
