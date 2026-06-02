<template>
  <main class="px-8 py-8 bg-[#F5F7F3] min-h-screen font-sans antialiased">
    <FarmerHeader title="Order Management" />

    <!-- Page description & actions -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 border-b border-gray-200/50 pb-5">
      <div>
        <p class="text-gray-500 text-sm mt-1 max-w-[600px]">
          Curate and oversee your farm-to-table transactions. Track shipment status and buyer interactions with editorial precision.
        </p>
      </div>
      <div class="flex gap-3 items-center">
        <button class="px-4 py-2.5 bg-amber-100/60 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl transition flex items-center gap-2 border border-amber-200/30">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export Report
        </button>
        <button class="px-4 py-2.5 bg-[#2d6a4f] text-[#F5F7F3] font-bold text-xs rounded-xl hover:bg-[#1b4332] transition flex items-center gap-2 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          Log Manual Order
        </button>
      </div>
    </div>

        <!-- Stats cards -->
        <div class="grid grid-cols-4 gap-4 mb-8">
          <div class="p-4 bg-white rounded-lg border border-gray-100">
            <div class="text-xs font-semibold text-gray-500 uppercase">Total Revenue</div>
            <div class="text-2xl font-bold text-gray-900 mt-2">${{ stats.totalRevenue.toFixed(2) }}</div>
            <div class="text-xs text-gray-500 mt-2">From completed transactions</div>
          </div>

          <div class="p-4 bg-white rounded-lg border border-gray-100">
            <div class="text-xs font-semibold text-gray-500 uppercase">Pending Actions</div>
            <div class="text-2xl font-bold text-orange-600 mt-2">{{ stats.pendingActions.toString().padStart(2, '0') }}</div>
            <div class="text-xs text-gray-500 mt-2">Orders awaiting confirmation</div>
          </div>

          <div class="p-4 bg-white rounded-lg border border-gray-100">
            <div class="text-xs font-semibold text-gray-500 uppercase">Avg. Fulfillment</div>
            <div class="text-2xl font-bold text-gray-900 mt-2">{{ stats.avgFulfillmentDays }} <span class="text-sm">days</span></div>
            <div class="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div class="bg-green-600 h-1.5 rounded-full" :style="{ width: Math.min(100, (stats.avgFulfillmentDays / 3) * 100) + '%' }"></div>
            </div>
          </div>

          <div class="p-4 bg-white rounded-lg border border-gray-100">
            <div class="text-xs font-semibold text-gray-500 uppercase">Active Orders</div>
            <div class="text-2xl font-bold text-green-700 mt-2">{{ stats.activeOrders }}</div>
            <div class="text-xs text-gray-500 mt-2">Orders currently in progress</div>
          </div>
        </div>

        <!-- Orders table -->
        <div class="orders-card">

          <!-- Table filters -->
          <div class="table-filters">
            <div class="filter-left">
              <div class="filter-group">
                <span class="filter-label">SHOW:</span>
                <button class="filter-select">All Orders <span class="chevron">▾</span></button>
              </div>
              <div class="filter-group">
                <span class="filter-label">STATUS:</span>
                <div class="status-tabs">
                  <button
                    v-for="tab in statusTabs"
                    :key="tab"
                    class="status-tab"
                    :class="{ active: activeTab === tab }"
                    @click="changeTab(tab)"
                  >{{ tab }}</button>
                </div>
              </div>
            </div>
            <div class="filter-right">
              <button class="date-filter">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Last 30 Days <span class="chevron">▾</span>
              </button>
              <button class="icon-btn icon-btn--border">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
              </button>
            </div>
          </div>

          <!-- Table -->
          <table class="orders-table">
            <thead>
              <tr>
                <th>ORDER DETAILS</th>
                <th>BUYER</th>
                <th>PRODUCTS</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id" class="order-row">
                <td>
                  <div class="order-id">#{{ order.orderNumber ? order.orderNumber.slice(-8).toUpperCase() : order.id.slice(0, 6).toUpperCase() }}</div>
                  <div class="order-date">{{ order.date }}</div>
                </td>
                <td>
                  <div class="buyer-cell">
                    <div class="buyer-avatar" :style="{ background: order.avatarColor }">{{ order.initials }}</div>
                    <div>
                      <div class="buyer-name">{{ order.buyer }}</div>
                      <div class="buyer-type">{{ order.buyerType }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="product-name" :class="{ 'text-muted': order.status === 'CANCELLED' }">{{ order.products }}</div>
                  <div class="product-meta">{{ order.productMeta }}</div>
                </td>
                <td class="amount">{{ order.amount }}</td>
                <td>
                  <span class="status-badge" :class="`status-badge--${order.status.toLowerCase()}`">
                    <span class="status-dot"></span>
                    {{ order.status }}
                  </span>
                </td>
                <td>
                  <div class="action-cell">
                    <template v-if="order.status === 'CANCELLED'">
                      <button @click="updateStatus(order.id, 'PENDING')" class="btn-action">RE-OPEN</button>
                    </template>
                    <template v-else>
                      <select 
                        :value="order.status" 
                        @change="updateStatus(order.id, $event.target.value)"
                        class="btn-action btn-action--status cursor-pointer border border-[#dde5db] px-2 py-1 rounded"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PREPARING">PREPARING</option>
                        <option value="IN_DELIVERY">IN_DELIVERY</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </template>
                  </div>
                </td>
              </tr>
              <tr v-if="orders.length === 0">
                <td colspan="6" class="text-center py-8 text-gray-400">No orders found.</td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <div class="pagination-bar" v-if="totalOrders > 0">
            <span class="pagination-info">Showing <strong>{{ (currentPage - 1) * limit + 1 }} – {{ Math.min(currentPage * limit, totalOrders) }}</strong> of {{ totalOrders }} total orders</span>
            <div class="pagination-controls">
              <button class="page-btn page-btn--arrow" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">‹</button>
              <button
                v-for="p in visiblePages"
                :key="p"
                class="page-btn"
                :class="{ active: currentPage === p, ellipsis: p === '...' }"
                @click="p !== '...' && changePage(p)"
              >{{ p }}</button>
              <button class="page-btn page-btn--arrow" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">›</button>
            </div>
          </div>
        </div>

        <!-- Banner -->
        <div class="banner">
          <div class="banner-icon">💡</div>
          <div class="banner-content">
            <div class="banner-title">Streamline Your Fulfillment</div>
            <div class="banner-desc">Order volume is projected to increase by 20% next week. Consider pre-packing Heirloom Carrot bundles to save time.</div>
          </div>
          <button class="btn-banner">VIEW DEMAND TRENDS</button>
        </div>

  </main>
</template>

<script setup>
definePageMeta({
  middleware: 'farmer',
  layout: 'farmer'
})

import { ref, computed, onMounted } from 'vue'
import { useAuth } from '../../composables/useAuth'
import { orderService } from '../../services/order.service'

const { user, ensureHydrated } = useAuth()

const activeTab = ref('All')
const currentPage = ref(1)
const limit = ref(5)
const totalOrders = ref(0)
const totalPages = ref(1)
const loading = ref(false)

const statusTabs = ['All', 'Pending', 'Preparing', 'Confirmed', 'Completed', 'Cancelled']

const stats = ref({
  totalRevenue: 0,
  pendingActions: 0,
  avgFulfillmentDays: 0,
  activeOrders: 0,
})

const orders = ref([])

const fetchOrdersData = async () => {
  loading.value = true
  try {
    const res = await orderService.getFarmerOrders(currentPage.value, limit.value, activeTab.value)
    orders.value = res.data.map(o => {
      const initials = o.consumer 
        ? `${o.consumer.firstName?.[0] || ''}${o.consumer.lastName?.[0] || ''}`.toUpperCase() || 'U'
        : 'U'
      
      const colors = ['#c8e6c9', '#bbdefb', '#d7ccc8', '#ffe0b2', '#f8bbd0']
      const avatarColor = colors[Math.abs(o.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length]
      
      const formattedDate = new Date(o.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) + ' · ' + new Date(o.date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })

      return {
        id: o.id,
        orderNumber: o.orderNumber,
        date: formattedDate,
        buyer: o.consumer ? `${o.consumer.firstName} ${o.consumer.lastName}` : 'Unknown Buyer',
        buyerType: o.consumer ? o.consumer.email : 'Local Resident',
        initials,
        avatarColor,
        products: o.items.map(i => i.nameEn).join(', '),
        productMeta: `${o.items.length} items · ${o.items.reduce((sum, i) => sum + i.quantity, 0)} units total`,
        amount: `$${o.totalAmount.toFixed(2)}`,
        status: o.status.toUpperCase(),
      }
    })
    totalOrders.value = res.total
    totalPages.value = res.totalPages
  } catch (error) {
    console.error('Failed to fetch farmer orders:', error)
  } finally {
    loading.value = false
  }
}

const fetchStatsData = async () => {
  try {
    const res = await orderService.getFarmerOrdersStats()
    stats.value = res
  } catch (error) {
    console.error('Failed to fetch farmer order stats:', error)
  }
}

const updateStatus = async (orderId, newStatus) => {
  try {
    await orderService.updateFarmerOrderStatus(orderId, newStatus)
    await fetchOrdersData()
    await fetchStatsData()
  } catch (error) {
    console.error('Failed to update status:', error)
  }
}

const changeTab = (tab) => {
  activeTab.value = tab
  currentPage.value = 1
  fetchOrdersData()
}

const changePage = (page) => {
  currentPage.value = page
  fetchOrdersData()
}

const visiblePages = computed(() => {
  const pages = []
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i)
  }
  return pages
})

onMounted(async () => {
  await ensureHydrated()
  await Promise.all([
    fetchOrdersData(),
    fetchStatsData()
  ])
})
</script>

<style scoped>


/* Topbar */
.topbar {
  background: #fff;
  border-bottom: 1px solid #e8ede6;
  padding: 12px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 30;
}

.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #9aaa9a;
}

.search-input {
  padding: 9px 14px 9px 36px;
  border: 1px solid #dde5db;
  border-radius: 8px;
  font-size: 13.5px;
  color: #3a4a3a;
  background: #f8faf7;
  width: 300px;
  outline: none;
  transition: border 0.15s;
}

.search-input:focus {
  border-color: #2d6a2d;
  background: #fff;
}

.search-input::placeholder {
  color: #aabcaa;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 7px;
  border-radius: 7px;
  color: #6a7e6a;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.icon-btn:hover {
  background: #f0f5ee;
  color: #2d6a2d;
}

.icon-btn--border {
  border: 1px solid #dde5db;
}

.user-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 6px;
}

.user-info {
  text-align: right;
}

.user-name {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #2a3a2a;
}

.user-plan {
  display: block;
  font-size: 10px;
  letter-spacing: 1px;
  color: #8ca08c;
  font-weight: 600;
}

.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #2d6a2d;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Page content */
.page-content {
  padding: 28px 32px 40px;
  flex: 1;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  letter-spacing: 1px;
  font-weight: 600;
  margin-bottom: 10px;
}

.crumb-dim {
  color: #9aaa9a;
}

.crumb-sep {
  color: #b0c0b0;
}

.crumb-active {
  color: #3a5a3a;
}

/* Page header */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 28px;
  gap: 20px;
}

.page-title {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: 30px;
  font-weight: 400;
  color: #1a2e1a;
  margin: 0 0 8px;
  line-height: 1.1;
}

.page-desc {
  font-size: 13.5px;
  color: #6a7e6a;
  max-width: 420px;
  line-height: 1.6;
  margin: 0;
}

.page-header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  margin-top: 4px;
}

.btn-export {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 18px;
  border: 1.5px solid #cdd8cb;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #3a4e3a;
  background: #fff;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-export:hover {
  border-color: #2d6a2d;
  color: #2d6a2d;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background: #2d6a2d;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-primary:hover {
  background: #245924;
}

/* Stats grid */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 0.55fr 0.45fr;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #fff;
  border-radius: 14px;
  padding: 24px;
  border: 1px solid #e8ede6;
}

.stat-label {
  font-size: 10.5px;
  letter-spacing: 1.2px;
  font-weight: 700;
  color: #8ca08c;
  margin-bottom: 12px;
  text-transform: uppercase;
}

.stat-value-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.stat-value {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: 34px;
  color: #1a2e1a;
  line-height: 1;
}

.stat-badge--up {
  background: #e6f4e6;
  color: #2d6a2d;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 9px;
  border-radius: 20px;
}

.stat-alert {
  background: #fee;
  color: #d43;
  font-size: 14px;
  font-weight: 800;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #fcc;
}

.stat-unit {
  font-size: 20px;
  color: #6a8a6a;
  font-weight: 400;
  margin-left: -4px;
}

.stat-sub {
  font-size: 12.5px;
  color: #8ca08c;
  line-height: 1.5;
}

.fulfillment-bar {
  height: 4px;
  background: #e8ede6;
  border-radius: 4px;
  margin-top: 14px;
  overflow: hidden;
}

.fulfillment-fill {
  height: 100%;
  width: 30%;
  background: #2d6a2d;
  border-radius: 4px;
}

/* Orders card */
.orders-card {
  background: #fff;
  border-radius: 14px;
  border: 1px solid #e8ede6;
  overflow: hidden;
  margin-bottom: 20px;
}

/* Table filters */
.table-filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #eef2ec;
  gap: 16px;
}

.filter-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.filter-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 11px;
  letter-spacing: 1px;
  font-weight: 700;
  color: #9aaa9a;
}

.filter-select {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border: 1.5px solid #dde5db;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
  color: #2a3a2a;
  background: #fff;
  cursor: pointer;
  transition: border 0.15s;
}

.filter-select:hover {
  border-color: #2d6a2d;
}

.status-tabs {
  display: flex;
  align-items: center;
  gap: 2px;
}

.status-tab {
  padding: 5px 14px;
  border-radius: 6px;
  font-size: 12.5px;
  font-weight: 500;
  color: #6a8a6a;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
}

.status-tab:hover {
  background: #f0f5ee;
  color: #2d6a2d;
}

.status-tab.active {
  background: #e6f0e6;
  color: #2d6a2d;
  font-weight: 600;
}

.date-filter {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border: 1.5px solid #dde5db;
  border-radius: 7px;
  font-size: 12.5px;
  font-weight: 500;
  color: #3a4e3a;
  background: #fff;
  cursor: pointer;
  transition: border 0.15s;
}

.date-filter:hover {
  border-color: #2d6a2d;
}

.chevron {
  font-size: 11px;
  opacity: 0.6;
}

/* Table */
.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table th {
  padding: 13px 20px;
  text-align: left;
  font-size: 10.5px;
  letter-spacing: 1px;
  font-weight: 700;
  color: #9aaa9a;
  background: #fafcf9;
  border-bottom: 1px solid #eef2ec;
}

.order-row {
  border-bottom: 1px solid #f0f4ee;
  transition: background 0.1s;
}

.order-row:last-child {
  border-bottom: none;
}

.order-row:hover {
  background: #fafcf9;
}

.orders-table td {
  padding: 16px 20px;
  vertical-align: middle;
}

.order-id {
  font-size: 13.5px;
  font-weight: 700;
  color: #1a2e1a;
}

.order-date {
  font-size: 11.5px;
  color: #8ca08c;
  margin-top: 3px;
}

.buyer-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.buyer-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
  color: #3a4a3a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.buyer-name {
  font-size: 13px;
  font-weight: 600;
  color: #1a2e1a;
}

.buyer-type {
  font-size: 11.5px;
  color: #8ca08c;
  margin-top: 2px;
}

.product-name {
  font-size: 13px;
  font-weight: 500;
  color: #1a2e1a;
}

.product-name.text-muted {
  color: #9aaa9a;
}

.product-meta {
  font-size: 11.5px;
  color: #8ca08c;
  margin-top: 3px;
}

.amount {
  font-size: 14px;
  font-weight: 700;
  color: #1a2e1a;
}

/* Status badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.status-badge--pending {
  background: #fff8e6;
  color: #c87800;
}

.status-badge--confirmed {
  background: #e6f5e6;
  color: #2d7a2d;
}

.status-badge--processing {
  background: #f0f0f0;
  color: #6a7a6a;
}

.status-badge--delivered {
  background: #e8f0e8;
  color: #3a7a3a;
}

.status-badge--cancelled {
  background: #fee8e8;
  color: #d44;
}

/* Action buttons */
.action-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-action {
  padding: 6px 12px;
  border: 1.5px solid #dde5db;
  border-radius: 7px;
  font-size: 11px;
  font-weight: 700;
  color: #3a4e3a;
  background: #fff;
  cursor: pointer;
  letter-spacing: 0.3px;
  transition: all 0.15s;
  white-space: nowrap;
}

.btn-action:hover {
  border-color: #2d6a2d;
  color: #2d6a2d;
}

.btn-action--status {
  display: flex;
  align-items: center;
  gap: 5px;
}

.btn-dots {
  padding: 5px 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #8ca08c;
  border-radius: 6px;
  transition: background 0.15s;
}

.btn-dots:hover {
  background: #f0f5ee;
}

.btn-icon-danger {
  padding: 6px 8px;
  border: 1.5px solid #fcc;
  border-radius: 7px;
  background: #fff;
  color: #d44;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.15s;
}

.btn-icon-danger:hover {
  background: #fee8e8;
}

/* Pagination */
.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid #eef2ec;
}

.pagination-info {
  font-size: 12.5px;
  color: #8ca08c;
}

.pagination-info strong {
  color: #3a4e3a;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-btn {
  width: 32px;
  height: 32px;
  border-radius: 7px;
  border: 1.5px solid #dde5db;
  background: #fff;
  font-size: 13px;
  font-weight: 500;
  color: #3a4e3a;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.page-btn:hover:not(.active):not(.ellipsis) {
  border-color: #2d6a2d;
  color: #2d6a2d;
}

.page-btn.active {
  background: #2d6a2d;
  border-color: #2d6a2d;
  color: #fff;
  font-weight: 700;
}

.page-btn.ellipsis {
  border: none;
  background: none;
  cursor: default;
  color: #8ca08c;
}

.page-btn--arrow {
  font-size: 16px;
  color: #6a8a6a;
}

.page-btn--arrow:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* Banner */
.banner {
  background: #2a3a2a;
  border-radius: 14px;
  padding: 20px 28px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.banner-icon {
  width: 44px;
  height: 44px;
  background: #3a4e3a;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.banner-content {
  flex: 1;
}

.banner-title {
  font-size: 15px;
  font-weight: 700;
  color: #e8f0e6;
  margin-bottom: 4px;
}

.banner-desc {
  font-size: 12.5px;
  color: #7a9a7a;
  line-height: 1.5;
}

.btn-banner {
  padding: 10px 22px;
  border: 1.5px solid #4a6a4a;
  border-radius: 8px;
  background: transparent;
  color: #c8e0c8;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
  flex-shrink: 0;
}

.btn-banner:hover {
  background: #3a4e3a;
  border-color: #6a8a6a;
  color: #e8f0e6;
}
</style>
