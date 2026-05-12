// composables/useOrders.ts
import { ref, computed } from 'vue'

export const useOrders = () => {
  const orders = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const stats = ref(null)

  /**
   * Fetch orders by consumer ID
   */
  const fetchOrdersByConsumer = async (consumerId: string, page = 1, limit = 10) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await useFetch(
        `/api/orders/consumer/${consumerId}?page=${page}&limit=${limit}`,
        {
          method: 'GET',
        }
      )

      if (data.value) {
        orders.value = data.value.data || []
        currentPage.value = data.value.page
        totalPages.value = data.value.totalPages
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch orders'
      console.error('Error fetching orders:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch all orders with filters
   */
  const fetchAllOrders = async (page = 1, limit = 10, filters = {}) => {
    loading.value = true
    error.value = null

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== null && v !== undefined)),
      })

      const { data } = await useFetch(`/api/orders?${params.toString()}`, {
        method: 'GET',
      })

      if (data.value) {
        orders.value = data.value.data || []
        currentPage.value = data.value.page
        totalPages.value = data.value.totalPages
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch orders'
      console.error('Error fetching orders:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Get single order details
   */
  const getOrderById = async (orderId: string) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await useFetch(`/api/orders/${orderId}`, {
        method: 'GET',
      })

      return data.value
    } catch (err) {
      error.value = err.message || 'Failed to fetch order'
      console.error('Error fetching order:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Create new order
   */
  const createOrder = async (orderData) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await useFetch('/api/orders', {
        method: 'POST',
        body: orderData,
      })

      if (data.value) {
        orders.value.unshift(data.value)
      }

      return data.value
    } catch (err) {
      error.value = err.message || 'Failed to create order'
      console.error('Error creating order:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Update order status
   */
  const updateOrderStatus = async (orderId: string, status: string) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await useFetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        body: { status },
      })

      // Update in local state
      const index = orders.value.findIndex((o) => o.id === orderId)
      if (index !== -1) {
        orders.value[index] = data.value
      }

      return data.value
    } catch (err) {
      error.value = err.message || 'Failed to update order status'
      console.error('Error updating order:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Cancel order
   */
  const cancelOrder = async (orderId: string, reason?: string) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await useFetch(`/api/orders/${orderId}/cancel`, {
        method: 'PATCH',
        body: { reason },
      })

      // Update in local state
      const index = orders.value.findIndex((o) => o.id === orderId)
      if (index !== -1) {
        orders.value[index] = data.value
      }

      return data.value
    } catch (err) {
      error.value = err.message || 'Failed to cancel order'
      console.error('Error cancelling order:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch order statistics
   */
  const fetchOrderStats = async () => {
    loading.value = true
    error.value = null

    try {
      const { data } = await useFetch('/api/orders/stats', {
        method: 'GET',
      })

      if (data.value) {
        stats.value = data.value
      }

      return data.value
    } catch (err) {
      error.value = err.message || 'Failed to fetch stats'
      console.error('Error fetching stats:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Load next page
   */
  const loadNextPage = () => {
    if (currentPage.value < totalPages.value) {
      fetchOrdersByConsumer(currentPage.value + 1)
    }
  }

  /**
   * Load previous page
   */
  const loadPreviousPage = () => {
    if (currentPage.value > 1) {
      fetchOrdersByConsumer(currentPage.value - 1)
    }
  }

  /**
   * Get order status badge color
   */
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: '#ffc107', // yellow
      CONFIRMED: '#2e7e3f', // green
      DELIVERED: '#154212', // dark green
      CANCELLED: '#b42318', // red
    }
    return colors[status] || '#72796e'
  }

  /**
   * Get payment status badge color
   */
  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      UNPAID: '#ffc107', // yellow
      PAID: '#2e7e3f', // green
      REFUNDED: '#72796e', // gray
    }
    return colors[status] || '#72796e'
  }

  return {
    // State
    orders,
    loading,
    error,
    currentPage,
    totalPages,
    stats,

    // Methods
    fetchOrdersByConsumer,
    fetchAllOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    fetchOrderStats,
    loadNextPage,
    loadPreviousPage,
    getStatusColor,
    getPaymentStatusColor,

    // Computed
    hasOrders: computed(() => orders.value.length > 0),
    totalOrders: computed(() => orders.value.length),
  }
}
