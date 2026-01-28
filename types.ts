
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  TECHNICIAN = 'TECHNICIAN'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  rating: number;
  duration: string;
}

export interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  technicianId?: string;
  date: string;
  time: string;
  status: BookingStatus;
  totalAmount: number;
  taxAmount: number;
  address: string;
  paymentStatus: 'PAID' | 'PENDING';
}

export interface Config {
  serviceTax: number;
  commissionRate: number;
  platformName: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar: string;
  password?: string;
  // Document fields for Partners
  academicInfo?: string;
  addressProofId?: string;
  isVerified?: boolean;
}
