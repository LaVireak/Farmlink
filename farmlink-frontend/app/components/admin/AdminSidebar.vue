<template>
  <div>

    <button v-show="!isOpen" class="menu-toggle" @click="isOpen = true">
      <Menu class="w-5 h-5" />
    </button>

    <div v-if="isOpen" class="overlay" @click="isOpen = false" />

    <aside class="sidebar" :class="{ open: isOpen }">
      <button class="close-btn" @click="isOpen = false">
        <X class="w-5 h-5" />
      </button>

      <nav>
        <img src="/assets/images/logo.png" alt="FarmLink Logo"/>
        <NuxtLink
          v-for="item in navItems"
          :key="item.label"
          :to="item.to"
          class="nav-item"
          :class="{ active: $route.path === item.to }"
          @click="isOpen = false"
        >
          <component :is="item.icon" class="icon" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <!-- Admin profile section at the bottom -->
      <div class="admin-profile">
        <div class="avatar-wrap">
          <img
            v-if="auth.user?.avatarUrl"
            :src="auth.user.avatarUrl"
            :alt="adminName"
            class="avatar-img"
          />
          <svg v-else viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="avatar-img">
            <rect width="100" height="100" fill="#e5e7eb" />
            <circle cx="50" cy="36" r="18" fill="#9ca3af" />
            <ellipse cx="50" cy="85" rx="30" ry="22" fill="#9ca3af" />
          </svg>
        </div>
        <div class="admin-info">
          <p class="admin-name">{{ adminName }}</p>
          <p class="admin-email">{{ auth.user?.email }}</p>
        </div>
        <button class="signout-btn" title="Sign out" @click="handleSignOut">
          <LogOut class="w-4 h-4" />
        </button>
      </div>
    </aside>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import {
  LayoutGrid,
  ShoppingCart,
  Box,
  Users,
  Tractor,
  Settings,
  Menu,
  X,
  LogOut,
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth.store'

const isOpen = ref(false)
const auth = useAuthStore()

const adminName = computed(() => {
  const u = auth.user
  if (!u) return 'Admin'
  const full = `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim()
  return full || u.email || 'Admin'
})

async function handleSignOut() {
  await auth.signOut()
  await navigateTo('/auth/signin')
}

const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutGrid },
  { label: 'Order', to: '/admin/orders', icon: ShoppingCart },
  { label: 'Product', to: '/admin/products', icon: Box },
  { label: 'User', to: '/admin/users', icon: Users },
  { label: 'Farmer', to: '/admin/farmer', icon: Tractor },
]
</script>


<style scoped>
.menu-toggle {
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 50;
  padding: 0.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  cursor: pointer;
}

.close-btn {
  display: none;
  margin-left: auto;
  padding: 0.25rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6b7280;
  border-radius: 0.5rem;
}

.close-btn:hover {
  background: #e9eaea;
  color: #111827;
}

.overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  z-index: 30;
}

.sidebar {
  width: 16rem;
  min-height: 100vh;
  background: #f9fafb;
  border-right: 1px solid #f3f4f6;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight:bold;
  color: #4b5563;
  text-decoration: none;
  transition: all 0.2s;
}

.nav-item:hover {
  background: #e9eaea;
  color: #111827;
}

.nav-item.active {
  background: #15803d;
  color: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

@media (max-width: 1024px) {
  .menu-toggle {
    display: flex;
  }

  .close-btn {
    display: flex;
    margin-bottom: 1rem;
  }

  .overlay {
    display: block;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 40;
    height: 100%;
    padding-top: 1rem;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar.open {
    transform: translateX(0);
  }
}

/* Admin profile card pinned at sidebar bottom */
.admin-profile {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-top: auto;
  padding: 0.75rem;
  border-top: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background: #f3f4f6;
}

.avatar-wrap {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.admin-info {
  flex: 1;
  min-width: 0;
}

.admin-name {
  font-size: 0.8rem;
  font-weight: 700;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

.admin-email {
  font-size: 0.7rem;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

.signout-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  padding: 0.25rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  transition: color 0.2s, background 0.2s;
}

.signout-btn:hover {
  color: #ef4444;
  background: #fee2e2;
}
</style>