export enum PaymentMethod {
  ABA_PAYWAY = 'aba_payway',
  WING_MONEY = 'wing_money',
  IPAY = 'ipay',
  CASH_ON_DELIVERY = 'cash_on_delivery',
}

export enum PaymentStatus {
  UNPAID = 'unpaid',
  PAID = 'paid',
  REFUNDED = 'refunded',
  FAILED = 'failed',
}
