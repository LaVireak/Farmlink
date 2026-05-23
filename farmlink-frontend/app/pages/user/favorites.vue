<template>

  <div class="favorites-page">

    <!-- Hero Banner -->
    <section class="fav-banner">
      <div class="banner-overlay"></div>
      <div class="banner-content">
        <span class="banner-pill">{{ t('favorites.banner.pill') }}</span>
        <h1>{{ t('favorites.title') }}</h1>
        <p>{{ t('favorites.subtitle') }}</p>
      </div>
    </section>

    <!-- Page Title + Count -->
    <section class="py-8 px-6">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-3xl font-bold text-[#154212]">{{ t('favorites.title') }}</h2>
          <p class="text-gray-500 mt-1">{{ favorites.length }} {{ t('favorites.saved') }}</p>
        </div>

        <!-- Sort + Clear -->
        <div class="flex items-center gap-3">
          <select v-model="sortBy" class="sort-select">
            <option value="default">{{ t('favorites.sort.default') }}</option>
            <option value="price-low">{{ t('favorites.sort.priceLow') }}</option>
            <option value="price-high">{{ t('favorites.sort.priceHigh') }}</option>
            <option value="name">{{ t('favorites.sort.name') }}</option>
          </select>
          <button
            v-if="favorites.length > 0"
            @click="clearAll"
            class="clear-btn"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18"/><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
            </svg>
            {{ t('favorites.clearAll') }}
          </button>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 pb-20">

      <!-- Empty State -->
      <div v-if="favorites.length === 0" class="empty-state">
        <div class="empty-heart">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#c2c9bb" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
        <h3>{{ t('favorites.empty.title') }}</h3>
        <p>{{ t('favorites.empty.subtitle') }}</p>
        <NuxtLink to="/user/products" class="browse-btn">
          {{ t('favorites.browse') }}
        </NuxtLink>
      </div>

      <!-- Favorites Grid -->
      <div v-else class="fav-grid">
        <div
          v-for="item in sortedFavorites"
          :key="item.id"
          class="fav-card group"
        >
          <!-- Remove Button -->
          <button
            @click="removeFavorite(item.id)"
            class="remove-btn"
            aria-label="Remove from favorites"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>

          <!-- Product Image -->
          <NuxtLink :to="'/user/products/' + item.id" class="block overflow-hidden rounded-xl mb-4">
            <img
              :src="item.image"
              :alt="item.name"
              class="fav-img"
            />
          </NuxtLink>

          <!-- Labels -->
          <div class="flex items-center gap-2 mb-2">
            <span v-if="item.organic" class="label-organic">🌿 Organic</span>
            <span class="label-origin">{{ item.origin }}</span>
          </div>

          <!-- Product Info -->
          <NuxtLink :to="'/user/products/' + item.id">
            <h3 class="fav-name">{{ item.name }}</h3>
          </NuxtLink>
          <p class="fav-farm">{{ item.farmName }}</p>

          <!-- Rating -->
          <div class="flex items-center gap-1 mt-2 mb-3">
            <span v-for="i in 5" :key="i" :class="i <= Math.round(item.rating) ? 'star-on' : 'star-off'">★</span>
            <span class="text-xs text-gray-400 ml-1">({{ item.reviews }})</span>
          </div>

          <!-- Price + Cart -->
          <div class="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
            <div>
              <span v-if="item.discount" class="text-xs text-gray-400 line-through mr-1">${{ item.price.toFixed(2) }}</span>
              <span class="fav-price">${{ item.discount ? (item.price * (1 - item.discount / 100)).toFixed(2) : item.price.toFixed(2) }}</span>
              <span class="text-xs text-gray-400 ml-1">/ {{ item.unit }}</span>
            </div>
            <button @click="addToCart(item)" class="cart-btn" aria-label="Add to cart">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- "Keep Shopping" CTA when list has items -->
      <div v-if="favorites.length > 0" class="keep-shopping">
        <NuxtLink to="/user/products" class="keep-shopping-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 5l-7 7 7 7"/></svg>
          {{ t('favorites.continue') }}
        </NuxtLink>
      </div>

    </div>
  </div>

  <!-- Added to Cart Toast -->
  <div v-if="toastVisible" class="toast">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
    <span>{{ toastMessage }}</span>
  </div>

  <CommonAppFooter />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n'

useHead({
  title: 'My Favorites | FarmLink Cambodia',
  meta: [{ name: 'description', content: 'Your saved favorite products from local Cambodian farms.' }],
});

const { t } = useI18n()

const sortBy = ref('default');
const toastVisible = ref(false);
const toastMessage = ref('');

// --- Mock Favorites Data (replace with API/store later) ---
const favorites = ref([
  {
    id: 1,
    name: 'Heirloom Tomatoes',
    farmName: 'Chrey Bak Community Farm',
    origin: 'Kampong Chhnang',
    price: 4.50,
    unit: 'kg',
    rating: 4.8,
    reviews: 132,
    organic: true,
    discount: null,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Organic Curly Kale',
    farmName: 'Battambang Organic Collective',
    origin: 'Battambang',
    price: 3.20,
    unit: 'bunch',
    rating: 4.5,
    reviews: 87,
    organic: true,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?w=600&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Baby Dutch Carrots',
    farmName: 'Mekong Riverside Gardens',
    origin: 'Kandal',
    price: 4.25,
    unit: 'pack',
    rating: 4.7,
    reviews: 64,
    organic: false,
    discount: null,
    image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=600&auto=format&fit=crop',
  },
  {
    id: 4,
    name: 'Kampot Pepper (Premium)',
    farmName: 'Kampot Pepper Co-op',
    origin: 'Kampot',
    price: 12.00,
    unit: '100g',
    rating: 5.0,
    reviews: 211,
    organic: true,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop',
  },
  {
    id: 5,
    name: 'Phka Rumduol Jasmine Rice',
    farmName: 'Battambang Organic Collective',
    origin: 'Battambang',
    price: 18.00,
    unit: '5kg',
    rating: 4.9,
    reviews: 305,
    organic: true,
    discount: null,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop',
  },
  {
    id: 6,
    name: 'Sun-Dried Prawns',
    farmName: 'Sihanoukville Sea Harvest',
    origin: 'Sihanoukville',
    price: 9.50,
    unit: '200g',
    rating: 4.6,
    reviews: 49,
    organic: false,
    discount: null,
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600&auto=format&fit=crop',
  },
]);

// --- Sorted Favorites ---
const sortedFavorites = computed(() => {
  const arr = [...favorites.value];
  switch (sortBy.value) {
    case 'price-low':
      return arr.sort((a, b) => {
        const pa = a.discount ? a.price * (1 - a.discount / 100) : a.price;
        const pb = b.discount ? b.price * (1 - b.discount / 100) : b.price;
        return pa - pb;
      });
    case 'price-high':
      return arr.sort((a, b) => {
        const pa = a.discount ? a.price * (1 - a.discount / 100) : a.price;
        const pb = b.discount ? b.price * (1 - b.discount / 100) : b.price;
        return pb - pa;
      });
    case 'name':
      return arr.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return arr;
  }
});

// --- Actions ---
function removeFavorite(id: number) {
  favorites.value = favorites.value.filter(f => f.id !== id);
  showToast(t('favorites.removed'));
}

function clearAll() {
  favorites.value = [];
  showToast(t('favorites.cleared'));
}

function addToCart(item: any) {
  // TODO: connect to cart store
  favorites.value = favorites.value.filter(f => f.id !== item.id);
  showToast(t('favorites.addedToCart', { name: item.name }));
}

function showToast(msg: string) {
  toastMessage.value = msg;
  toastVisible.value = true;
  setTimeout(() => { toastVisible.value = false; }, 2800);
}
</script>

<style scoped>

</style>
