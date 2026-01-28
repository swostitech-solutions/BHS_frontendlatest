
import { Service, UserRole, UserProfile } from './types';

export const INITIAL_SERVICES: Service[] = [
  {
    id: 's1',
    name: 'Full Home Deep Cleaning',
    category: 'Cleaning',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695ce6958?auto=format&fit=crop&q=80&w=600',
    description: 'Complete professional cleaning of all rooms, bathrooms, and kitchen including deep sanitization.',
    rating: 4.8,
    duration: '4-6 hours'
  },
  {
    id: 's2',
    name: 'AC Service & Gas Refill',
    category: 'Repair',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600',
    description: 'Expert technicians for AC servicing, gas refilling, and component repairs.',
    rating: 4.7,
    duration: '1-2 hours'
  },
  {
    id: 's3',
    name: 'Salon for Men - Royal Cut',
    category: 'Salon',
    price: 499,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=600',
    description: 'Professional grooming at your doorstep including haircut, beard styling, and head massage.',
    rating: 4.9,
    duration: '45 mins'
  },
  {
    id: 's4',
    name: 'Washing Machine Repair',
    category: 'Repair',
    price: 599,
    image: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&q=80&w=600',
    description: 'Repair for front load and top load machines of all major brands.',
    rating: 4.5,
    duration: '1-2 hours'
  },
  {
    id: 's5',
    name: 'Water Purifier RO Service',
    category: 'Repair',
    price: 850,
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca1f963?auto=format&fit=crop&q=80&w=600',
    description: 'RO filter replacement and thorough cleaning for safe drinking water.',
    rating: 4.6,
    duration: '1 hour'
  }
];

export const MOCK_USER: UserProfile = {
  id: 'u1',
  name: 'Aarav Sharma',
  email: 'aarav@example.com',
  role: UserRole.USER,
  phone: '+91 98765 43210',
  avatar: 'https://i.pravatar.cc/150?u=aarav'
};

export const MOCK_ADMIN: UserProfile = {
  id: 'a1',
  name: 'Rajesh Malhotra',
  email: 'admin@bhs.com',
  role: UserRole.ADMIN,
  phone: '+91 99988 77766',
  avatar: 'https://i.pravatar.cc/150?u=rajesh'
};

export const MOCK_TECH: UserProfile = {
  id: 't1',
  name: 'Arjun Singh',
  email: 'arjun@bhs.com',
  role: UserRole.TECHNICIAN,
  phone: '+91 88877 66655',
  avatar: 'https://i.pravatar.cc/150?u=arjun',
  academicInfo: 'Diploma in Electrical Engineering',
  addressProofId: 'AID-99228811',
  isVerified: true
};
