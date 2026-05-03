<template>
  <aside class="sidebar">
    
    <!-- Logo -->
    <div class="sidebar-logo">
      <span class="logo-text">FarmLink</span>
      <span class="logo-sub">FARMER DASHBOARD</span>
    </div>

    <!-- Nav -->
    <nav class="sidebar-nav">
      <NuxtLink
        v-for="item in navItems"
        :key="item.label"
        :to="item.to"
        class="nav-item"
        :class="{ active: isActive(item.to) }"
      >
        <component :is="item.icon" class="nav-icon" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <!-- Bottom actions -->
    <div class="sidebar-bottom">
      <button class="btn-create">
        <span class="plus">+</span> Create New Order
      </button>
      <div class="bottom-links">
        <a href="#" class="bottom-link">
          <IconSupport /> Support
        </a>
        <a href="#" class="bottom-link">
          <IconLogout /> Logout
        </a>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isActive = (path) => {
  return route.path === path
}

const IconAccount = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`
}
const IconDashboard = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`
}
const IconInventory = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`
}
const IconOrders = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`
}
const IconAnalytics = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`
}
const IconSettings = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`
}
const IconSupport = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
}
const IconLogout = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`
}

const navItems = [
  { label: 'Account', to: '/farmer/account', icon: IconAccount },
  { label: 'Dashboard', to: '/farmer/dashboard', icon: IconDashboard },
  { label: 'Products', to: '/farmer/products', icon: IconInventory },
  { label: 'Orders', to: '/farmer/orders', icon: IconOrders },
  { label: 'Analytics', to: '/farmer/analytics', icon: IconAnalytics },
  { label: 'Settings', to: '/farmer/settings', icon: IconSettings },
]
</script>

<style scoped>
.sidebar {
  width: 180px;
  min-height: 100vh;
  background: #fff;
  border-right: 1px solid #e8ede6;
  display: flex;
  flex-direction: column;
  padding: 28px 0 24px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 40;
}

.sidebar-logo {
  padding: 0 20px 28px;
}

.logo-text {
  display: block;
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: 20px;
  font-weight: 700;
  color: #1a2e1a;
  letter-spacing: -0.3px;
}

.logo-sub {
  display: block;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1.5px;
  color: #8ca08c;
  margin-top: 2px;
  text-transform: uppercase;
}

.sidebar-nav {
  flex: 1;
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 500;
  color: #5a6e5a;
  text-decoration: none;
  transition: all 0.15s ease;
  cursor: pointer;
}

.nav-item:hover {
  background: #f0f5ee;
  color: #2d5a2d;
}

.nav-item.active {
  background: #2d6a2d;
  color: #fff;
}

.nav-icon {
  flex-shrink: 0;
  opacity: 0.85;
}

.sidebar-bottom {
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-create {
  width: 100%;
  background: #2d6a2d;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 11px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.15s;
}

.btn-create:hover {
  background: #245924;
}

.plus {
  font-size: 16px;
  line-height: 1;
}

.bottom-links {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.bottom-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 13px;
  color: #7a8e7a;
  text-decoration: none;
  transition: all 0.15s;
}

.bottom-link:hover {
  background: #f0f5ee;
  color: #2d5a2d;
}
</style>
