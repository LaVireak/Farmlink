export interface CartItem {
  id: number
  name: string
  variant: string
  farm: string
  image?: string
  price: number
  quantity: number
  stock?: number
  farmerId?: number | string
}
export interface Qrcode {
  
}