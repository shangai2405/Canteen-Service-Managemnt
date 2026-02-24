
// Shared types for the SmartCanteen application

export type Role = 'student' | 'counter' | 'admin';

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  calories: number;
  protein: string;
  image: string;
  description: string;
  popularity: number;
  stock: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface TimeSlot {
  id: string;
  time: string;
  capacity: number;
  cutoffTime: string;
  currentOrders: number;
}

export interface Order {
  id: number;
  userId: string;
  customerPhone?: string; // Support for SMS notifications
  total: number;
  slot: string;
  status: 'Placed' | 'Approved' | 'Preparing' | 'Ready' | 'Collected';
  prepTime?: number;
  approvedAt?: string;
  timestamp: string;
  items: CartItem[];
  paymentMethod: string;
  paymentId: string;
  paymentStatus: 'Success' | 'Pending' | 'Failed';
}
