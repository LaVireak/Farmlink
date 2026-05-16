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
    </aside>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  LayoutGrid,
  ShoppingCart,
  Box,
  Users,
  Tractor,
  Settings,
  Menu,
  Book,
  MessageSquare,
  X
} from 'lucide-vue-next'

const isOpen = ref(false)

const navItems = [
  { label: 'Settings', to: '/farmer/profile', icon: Settings },
  { label: 'Dashboard', to: '/farmer/dashboard', icon: LayoutGrid },
  { label: 'Orders', to: '/farmer/orders', icon: ShoppingCart },
  { label: 'Products', to: '/farmer/products', icon: Box },
  { label: 'Guild Book', to: '/farmer/guildbook', icon: Book },
  { label: 'Chat', to: '/farmer/chat', icon: MessageSquare },
  //{ label: 'Setting Profile', to: '/admin/settings/profile', icon: Settings },
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
</style>