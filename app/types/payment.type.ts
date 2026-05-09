import type { ShippingInfo } from './ShippingInfo.type';

export interface PaymentInfo {
  method: 'cod' | 'card' | 'mobile';
  billingAddressSameAsDelivery: boolean;
  // Add card details if method is 'card'
  cardholderName?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  // Add new billing address if not same as delivery
  newBillingAddress?: ShippingInfo;
}