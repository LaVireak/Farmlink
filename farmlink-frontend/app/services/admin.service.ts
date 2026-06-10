import type { Ref } from 'vue'
import { getAccessToken } from './auth.service'

let rawBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'
if (!rawBase.endsWith('/api')) {
  rawBase = rawBase.replace(/\/$/, '') + '/api'
}
const API_BASE = rawBase

// Generic fetch wrapper with auth headers
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAccessToken()

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }

  return response.json()
}

// ============================================
// Dashboard & Stats
// ============================================

export interface DashboardStats {
  totalUsers: number
  totalOrders: number
  totalRevenue: number
  activeFarmers: number
}

export interface FarmerStats {
  totalFarmers: number
  seekingMatch: number
  successfulMatches: number
  avgTrustScore: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return apiFetch<DashboardStats>('/admin/dashboard/stats')
}

export async function getFarmerStats(): Promise<FarmerStats> {
  return apiFetch<FarmerStats>('/admin/farmers/stats')
}

// ============================================
// Farmer Management
// ============================================

export interface FarmerProfile {
  id: string
  userId: string
  name: string
  phone: string
  location: string
  mainCrop: string
  estYield: string
  trustScore: number
  status: 'Active' | 'Pending' | 'Suspended'
  matchStatus: 'Matched' | 'Seeking' | 'Unmatched'
  method: string
  farmSize: number
  joinedAt: string
  crops: Array<{
    name: string
    harvestDate: string
    volume: string
    price: string
  }>
  matchedBuyer?: string
  verifiedAt?: string
}

export async function getFarmers(): Promise<FarmerProfile[]> {
  return apiFetch<FarmerProfile[]>('/admin/farmers')
}

export async function approveFarmer(id: string): Promise<FarmerProfile> {
  return apiFetch<FarmerProfile>(`/admin/farmers/${id}/approve`, {
    method: 'PATCH',
    body: JSON.stringify({}),
  })
}

export async function suspendFarmer(
  id: string,
  reason: string
): Promise<FarmerProfile> {
  return apiFetch<FarmerProfile>(`/admin/farmers/${id}/suspend`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  })
}

export async function matchFarmer(
  farmerId: string,
  buyerId: string,
  notes?: string
): Promise<FarmerProfile> {
  return apiFetch<FarmerProfile>(`/admin/farmers/${farmerId}/match`, {
    method: 'POST',
    body: JSON.stringify({ buyerId, notes }),
  })
}

export interface Buyer {
  id: string
  name: string
  type: string
  trustScore: number
}

export async function getBuyers(): Promise<Buyer[]> {
  return apiFetch<Buyer[]>('/admin/buyers')
}

// ============================================
// User Management
// ============================================

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'Buyer' | 'Farmer' | 'Admin'
  status: 'Active' | 'Pending' | 'Suspended' | 'Banned'
  province: string
  trustScore: number
  orders: number
  rating: number
  disputes: number
  joinedAt: string
  lastActiveAt?: string
  createdAt: string
}

export async function getUsers(): Promise<User[]> {
  const res = await apiFetch<any>('/admin/users?take=1000')
  return res.data ?? res ?? []
}

export async function getUser(id: string): Promise<User> {
  return apiFetch<User>(`/admin/users/${id}`)
}

export async function updateUser(
  id: string,
  data: Partial<User>
): Promise<User> {
  return apiFetch<User>(`/admin/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function suspendUser(
  id: string,
  reason: string
): Promise<User> {
  return apiFetch<User>(`/admin/users/${id}/suspend`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  })
}

export async function banUser(id: string, reason: string): Promise<User> {
  return apiFetch<User>(`/admin/users/${id}/suspend`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  })
}

export async function reactivateUser(id: string): Promise<User> {
  return apiFetch<User>(`/admin/users/${id}/reactivate`, {
    method: 'PATCH',
    body: JSON.stringify({}),
  })
}

export async function changeUserRole(
  id: string,
  role: 'Buyer' | 'Farmer' | 'Admin'
): Promise<User> {
  return apiFetch<User>(`/admin/users/${id}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  })
}

// ============================================
// Order Management
// ============================================

export interface Order {
  id: string
  customer: string
  customerId: string
  product: string
  productId: string
  amount: number
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled'
  date: string
}

export interface OrderFilters {
  search?: string
  status?: string
  dateRange?: string
  sort?: string
}

export async function getOrders(filters?: OrderFilters): Promise<Order[]> {
  const params = new URLSearchParams()
  params.append('take', '1000')
  if (filters?.status) params.append('status', filters.status)
  if (filters?.dateRange) params.append('dateRange', filters.dateRange)
  if (filters?.sort) params.append('sort', filters.sort)

  const query = params.toString()
  const res = await apiFetch<any>(`/admin/orders${query ? `?${query}` : ''}`)
  return res.data ?? res ?? []
}

export async function updateOrderStatus(
  id: string,
  status: string
): Promise<Order> {
  return apiFetch<Order>(`/admin/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

// ============================================
// Product Management
// ============================================

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  category: string
  status: 'Pending' | 'Approved' | 'Rejected' | 'Suspended'
  farmer: string
  farmerId: string
  image: string
  inStock: boolean
  submittedAt: string
  featured: boolean
  rejectionReason?: string
}

export interface ProductFilters {
  search?: string
  status?: string
  category?: string
}

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  const params = new URLSearchParams()
  params.append('take', '1000')
  if (filters?.status) params.append('status', filters.status)
  if (filters?.category) params.append('category', filters.category)

  const query = params.toString()
  const res = await apiFetch<any>(`/admin/products${query ? `?${query}` : ''}`)
  return res.data ?? res ?? []
}

export async function approveProduct(id: string): Promise<Product> {
  return apiFetch<Product>(`/admin/products/${id}/approve`, {
    method: 'PATCH',
    body: JSON.stringify({}),
  })
}

export async function rejectProduct(
  id: string,
  reason: string
): Promise<Product> {
  return apiFetch<Product>(`/admin/products/${id}/reject`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  })
}

export async function toggleProductFeatured(id: string): Promise<Product> {
  return apiFetch<Product>(`/admin/products/${id}/featured`, {
    method: 'PATCH',
    body: JSON.stringify({}),
  })
}

// ============================================
// Composable for Vue Components
// ============================================

import { ref, computed } from 'vue'

export function useAdmin() {
  // Loading states
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Dashboard
  const dashboardStats = ref<DashboardStats | null>(null)
  const farmerStats = ref<FarmerStats | null>(null)

  // Data collections
  const farmers = ref<FarmerProfile[]>([])
  const buyers = ref<Buyer[]>([])
  const users = ref<User[]>([])
  const orders = ref<Order[]>([])
  const products = ref<Product[]>([])

  // Toast helper
  type ToastType = 'success' | 'error' | 'warning'
  const toast = ref<{ visible: boolean; message: string; type: ToastType }>({
    visible: false,
    message: '',
    type: 'success'
  })
  let toastTimer: ReturnType<typeof setTimeout> | null = null

  function showToast(message: string, type: ToastType = 'success') {
    if (toastTimer) clearTimeout(toastTimer)
    toast.value = { visible: true, message, type }
    toastTimer = setTimeout(() => {
      toast.value.visible = false
    }, 3200)
  }

  // Fetch all dashboard data
  async function fetchDashboard() {
    loading.value = true
    error.value = null
    try {
      const [stats, fStats, usersRes, ordersRes, productsRes, farmersRes] = await Promise.all([
        getDashboardStats(),
        getFarmerStats(),
        getUsers(),
        getOrders(),
        getProducts(),
        getFarmers()
      ])
      dashboardStats.value = stats
      farmerStats.value = fStats
      users.value = usersRes
      orders.value = ordersRes
      products.value = productsRes
      farmers.value = farmersRes
    } catch (e: any) {
      error.value = e.message
      showToast(e.message, 'error')
    } finally {
      loading.value = false
    }
  }

  // Fetch farmers
  async function fetchFarmers() {
    loading.value = true
    error.value = null
    try {
      farmers.value = await getFarmers()
    } catch (e: any) {
      error.value = e.message
      showToast(e.message, 'error')
    } finally {
      loading.value = false
    }
  }

  // Approve farmer
  async function approveFarmerById(id: string) {
    loading.value = true
    try {
      const updated = await approveFarmer(id)
      const index = farmers.value.findIndex(f => f.id === id)
      if (index !== -1) {
        farmers.value[index] = updated
      }
      showToast('Farmer approved successfully', 'success')
      return updated
    } catch (e: any) {
      showToast(e.message, 'error')
      throw e
    } finally {
      loading.value = false
    }
  }

  // Suspend farmer
  async function suspendFarmerById(id: string, reason: string) {
    loading.value = true
    try {
      const updated = await suspendFarmer(id, reason)
      const index = farmers.value.findIndex(f => f.id === id)
      if (index !== -1) {
        farmers.value[index] = updated
      }
      showToast('Farmer suspended', 'warning')
      return updated
    } catch (e: any) {
      showToast(e.message, 'error')
      throw e
    } finally {
      loading.value = false
    }
  }

  // Match farmer
  async function matchFarmerToBuyer(farmerId: string, buyerId: string, notes?: string) {
    loading.value = true
    try {
      const updated = await matchFarmer(farmerId, buyerId, notes)
      const index = farmers.value.findIndex(f => f.id === farmerId)
      if (index !== -1) {
        farmers.value[index] = updated
      }
      showToast('Farmer matched successfully', 'success')
      return updated
    } catch (e: any) {
      showToast(e.message, 'error')
      throw e
    } finally {
      loading.value = false
    }
  }

  // Fetch buyers for matching
  async function fetchBuyers() {
    try {
      buyers.value = await getBuyers()
    } catch (e: any) {
      showToast(e.message, 'error')
    }
  }

  // Fetch users
  async function fetchUsers() {
    loading.value = true
    try {
      users.value = await getUsers()
    } catch (e: any) {
      error.value = e.message
      showToast(e.message, 'error')
    } finally {
      loading.value = false
    }
  }

  // Suspend user
  async function suspendUserById(id: string, reason: string) {
    loading.value = true
    try {
      const updated = await suspendUser(id, reason)
      const index = users.value.findIndex(u => u.id === id)
      if (index !== -1) {
        users.value[index] = updated
      }
      showToast('User suspended', 'warning')
      return updated
    } catch (e: any) {
      showToast(e.message, 'error')
      throw e
    } finally {
      loading.value = false
    }
  }

  // Ban user
  async function banUserById(id: string, reason: string) {
    loading.value = true
    try {
      const updated = await banUser(id, reason)
      const index = users.value.findIndex(u => u.id === id)
      if (index !== -1) {
        users.value[index] = updated
      }
      showToast('User banned', 'warning')
      return updated
    } catch (e: any) {
      showToast(e.message, 'error')
      throw e
    } finally {
      loading.value = false
    }
  }

  // Fetch orders
  async function fetchOrders(filters?: OrderFilters) {
    loading.value = true
    try {
      orders.value = await getOrders(filters)
    } catch (e: any) {
      error.value = e.message
      showToast(e.message, 'error')
    } finally {
      loading.value = false
    }
  }

  // Update order status
  async function updateOrderStatusById(id: string, status: string) {
    loading.value = true
    try {
      const updated = await updateOrderStatus(id, status)
      const index = orders.value.findIndex(o => o.id === id)
      if (index !== -1) {
        orders.value[index] = updated
      }
      showToast('Order status updated', 'success')
      return updated
    } catch (e: any) {
      showToast(e.message, 'error')
      throw e
    } finally {
      loading.value = false
    }
  }

  // Fetch products
  async function fetchProducts(filters?: ProductFilters) {
    loading.value = true
    try {
      products.value = await getProducts(filters)
    } catch (e: any) {
      error.value = e.message
      showToast(e.message, 'error')
    } finally {
      loading.value = false
    }
  }

  // Approve product
  async function approveProductById(id: string) {
    loading.value = true
    try {
      const updated = await approveProduct(id)
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value[index] = updated
      }
      showToast('Product approved', 'success')
      return updated
    } catch (e: any) {
      showToast(e.message, 'error')
      throw e
    } finally {
      loading.value = false
    }
  }

  // Reject product
  async function rejectProductById(id: string, reason: string) {
    loading.value = true
    try {
      const updated = await rejectProduct(id, reason)
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value[index] = updated
      }
      showToast('Product rejected', 'warning')
      return updated
    } catch (e: any) {
      showToast(e.message, 'error')
      throw e
    } finally {
      loading.value = false
    }
  }

  // Computed filters
  const farmersByStatus = computed(() => ({
    active: farmers.value.filter(f => f.status === 'Active'),
    pending: farmers.value.filter(f => f.status === 'Pending'),
    suspended: farmers.value.filter(f => f.status === 'Suspended'),
  }))

  const farmersByMatch = computed(() => ({
    seeking: farmers.value.filter(f => f.matchStatus === 'Seeking'),
    matched: farmers.value.filter(f => f.matchStatus === 'Matched'),
  }))

  const usersByRole = computed(() => ({
    buyers: users.value.filter(u => u.role === 'Buyer'),
    farmers: users.value.filter(u => u.role === 'Farmer'),
    admins: users.value.filter(u => u.role === 'Admin'),
  }))

  const ordersByStatus = computed(() => ({
    pending: orders.value.filter(o => o.status === 'Pending'),
    processing: orders.value.filter(o => o.status === 'Processing'),
    completed: orders.value.filter(o => o.status === 'Completed'),
    cancelled: orders.value.filter(o => o.status === 'Cancelled'),
  }))

  const productsByStatus = computed(() => ({
    pending: products.value.filter(p => p.status === 'Pending'),
    approved: products.value.filter(p => p.status === 'Approved'),
    rejected: products.value.filter(p => p.status === 'Rejected'),
  }))

  return {
    // State
    loading,
    error,
    toast,

    // Data
    dashboardStats,
    farmerStats,
    farmers,
    buyers,
    users,
    orders,
    products,

    // Computed
    farmersByStatus,
    farmersByMatch,
    usersByRole,
    ordersByStatus,
    productsByStatus,

    // Dashboard
    fetchDashboard,

    // Farmers
    fetchFarmers,
    fetchBuyers,
    approveFarmerById,
    suspendFarmerById,
    matchFarmerToBuyer,

    // Users
    fetchUsers,
    suspendUserById,
    banUserById,

    // Orders
    fetchOrders,
    updateOrderStatusById,

    // Products
    fetchProducts,
    approveProductById,
    rejectProductById,

    // Utils
    showToast,
  }
}
