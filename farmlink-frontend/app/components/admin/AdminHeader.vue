<template>
  <header class="admin-header">
    <!-- Left: Logo -->
    <div class="logo-container">
      <NuxtLink to="/admin/dashboard" class="logo-link">
        <img src="/assets/images/logo transparency.png" alt="FarmLink Logo" class="logo-img" />
      </NuxtLink>
    </div>

    <!-- Right: Search & Profile -->
    <div class="header-actions">
      <!-- Search Input -->
      <div class="search-wrapper">
        <input 
          type="text" 
          placeholder="Search" 
          class="search-input" 
        />
        <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <!-- Profile Dropdown -->
      <div class="profile-container" id="admin-profile-menu">
        <button @click.stop="toggleProfile" class="profile-trigger group">
          <img 
            v-if="user?.avatarUrl" 
            :src="avatarUrl" 
            class="profile-avatar" 
            alt="Admin Avatar"
          />
          <div v-else class="profile-avatar-placeholder">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="avatar-svg">
              <rect width="100" height="100" fill="#e5e7eb" />
              <circle cx="50" cy="36" r="18" fill="#9ca3af" />
              <ellipse cx="50" cy="85" rx="30" ry="22" fill="#9ca3af" />
            </svg>
          </div>
          <div class="profile-text">
            <p class="profile-name">
              {{ fullName }}
              <svg :class="['chevron-icon', profileOpen && 'rotate-180']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </p>
          </div>
        </button>

        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div v-show="profileOpen" class="profile-dropdown-menu">
            <div class="p-2">
              <ul class="space-y-1">
                <li><NuxtLink to="/admin/settings/profile" class="dropdown-item">Profile</NuxtLink></li>
                <li><NuxtLink to="/admin/settings/security" class="dropdown-item">Security</NuxtLink></li>
                <li><NuxtLink to="/admin/settings/appearance" class="dropdown-item">Appearance</NuxtLink></li>
                <li><NuxtLink to="/admin/settings/team" class="dropdown-item">Team</NuxtLink></li>
                <li><a href="#" @click.prevent="handleLogout" class="dropdown-item logout-item">Logout</a></li>
              </ul>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '~/stores/auth.store'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const user = computed(() => auth.user)
const fullName = computed(() => {
  if (!user.value) return 'Channary Sok'
  const first = user.value.firstName || ''
  const last = user.value.lastName || user.value.lastname || ''
  const name = `${first} ${last}`.trim()
  return name || user.value.email || 'Channary Sok'
})

const avatarUrl = computed(() => {
  if (user.value?.avatarUrl) {
    const url = user.value.avatarUrl
    if (url.startsWith('http') || url.startsWith('data:')) return url
    const config = useRuntimeConfig()
    const baseURL = config.public.apiUrl
    const STATIC_BASE = baseURL.replace('/api', '')
    return `${STATIC_BASE}/${url}`
  }
  return 'https://i.pravatar.cc/100?img=12'
})

const profileOpen = ref(false)

const toggleProfile = () => {
  profileOpen.value = !profileOpen.value
}

const handleLogout = async () => {
  profileOpen.value = false
  await auth.signOut()
  router.push('/auth/signin')
}

const onClickOutside = (e) => {
  const menuEl = document.getElementById('admin-profile-menu')
  if (menuEl && !menuEl.contains(e.target)) {
    profileOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<style scoped>
.admin-header {
  height: 75px;
  background: #f9fafb; /* match sidebar background */
  border-bottom: 1px solid #f3f4f6; /* match sidebar right border */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03), 0 1px 0 rgba(0, 0, 0, 0.05); /* subtle, soft & natural shadow */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  width: 100%;
  box-sizing: border-box;
  z-index: 10; /* ensure it stays on top of other content */
}

.logo-container {
  display: flex;
  align-items: center;
  margin-left: 3.5rem; /* shift logo further to the right */
}

.logo-link {
  display: flex;
  align-items: center;
}

.logo-img {
  height: 40px; /* adjusted proportionally for 75px header */
  object-fit: contain;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 3.5rem; /* shift search bar left relative to the profile dropdown */
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  background-color: var(--color-surface-lowest, #ffffff);
  border: 1px solid var(--color-outline-variant, #e5e7eb);
  border-radius: 0.75rem;
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
  padding-left: 2.75rem;
  padding-right: 1.25rem;
  width: 20rem;
  font-size: 0.875rem;
  color: var(--color-on-surface, #111827);
  outline: none;
  transition: all 0.2s;
}

.search-input:focus {
  border-color: var(--color-primary, #15803d);
  box-shadow: 0 0 0 2px rgba(21, 128, 61, 0.1);
}

.search-icon {
  width: 1.25rem;
  height: 1.25rem;
  position: absolute;
  left: 1rem;
  color: var(--color-on-surface-variant, #6b7280);
  pointer-events: none;
}

.profile-container {
  position: relative;
}

.profile-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  background: transparent;
  border: none;
  outline: none;
  padding: 0;
}

.profile-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  border: 2px solid var(--color-outline-variant, #e5e7eb);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  object-fit: cover;
}

.profile-avatar-placeholder {
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  overflow: hidden;
  border: 2px solid var(--color-outline-variant, #e5e7eb);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.avatar-svg {
  width: 100%;
  height: 100%;
}

.profile-text {
  text-align: left;
  display: none;
}

@media (min-width: 768px) {
  .profile-text {
    display: block;
  }
}

.profile-name {
  font-size: 0.875rem;
  font-weight: 900;
  color: var(--color-on-surface, #111827);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin: 0;
}

.chevron-icon {
  width: 1rem;
  height: 1rem;
  color: var(--color-on-surface-variant, #6b7280);
  transition: transform 0.3s ease;
}

.profile-trigger:hover .chevron-icon {
  color: var(--color-secondary, #15803d);
}

.profile-dropdown-menu {
  position: absolute;
  right: 0;
  margin-top: 0.5rem;
  width: 9rem;
  background-color: var(--color-surface-lowest, #ffffff);
  border: 1px solid var(--color-outline-variant, #e5e7eb);
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 50;
  transform-origin: top right;
}

.dropdown-item {
  display: block;
  padding: 0.375rem 0.75rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  color: var(--color-on-surface, #111827);
  text-decoration: none;
  transition: background-color 0.15s ease;
}

.dropdown-item:hover {
  background-color: var(--color-surface-container, #e9eaea);
}

.logout-item {
  color: var(--color-error, #ef4444);
  font-weight: 500;
}

.logout-item:hover {
  background-color: var(--color-error-container, #fee2e2);
}
</style>
