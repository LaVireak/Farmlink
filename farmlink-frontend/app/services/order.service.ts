import { getAccessToken } from './auth.service'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAccessToken()
  let cleanEndpoint = endpoint
  
  if (API_BASE.endsWith('/api') && endpoint.startsWith('/api/')) {
    cleanEndpoint = endpoint.substring(4)
  }
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(`${API_BASE}${cleanEndpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }

  return response.json()
}

export interface OrderItem {
  nameEn: string
  quantity: number
  unit: string
  unitPrice: number
}

export interface FarmerOrder {
  id: string
  orderNumber: string
  date: string
  status: string
  paymentStatus: string
  totalAmount: number
  consumer: {
    firstName: string
    lastName: string
    email: string
  } | null
  items: OrderItem[]
}

export interface FarmerOrdersResponse {
  data: FarmerOrder[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface FarmerOrdersStats {
  totalRevenue: number
  pendingActions: number
  avgFulfillmentDays: number
  activeOrders: number
}

export const orderService = {
  async getFarmerOrders(page: number = 1, limit: number = 10, status: string = 'All'): Promise<FarmerOrdersResponse> {
    return apiFetch<FarmerOrdersResponse>(`/api/farmer/orders?page=${page}&limit=${limit}&status=${status}`)
  },

  async getFarmerOrdersStats(): Promise<FarmerOrdersStats> {
    return apiFetch<FarmerOrdersStats>('/api/farmer/orders/stats')
  },

  async updateFarmerOrderStatus(orderId: string, status: string): Promise<{ success: boolean; status: string }> {
    return apiFetch<{ success: boolean; status: string }>(`/api/farmer/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  },
  
  async transitionOrder(orderId: string, action: 'accept' | 'reject'): Promise<{ success: boolean; status: string }> {
    return apiFetch<{ success: boolean; status: string }>(`/api/farmer/orders/${orderId}/transition`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    })
  }
}
