import type { CartItem } from '@/types/card.type'
export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'COMPLETED' | 'IN-TRANSIT' | 'CANCELLED';
  date: string;
}