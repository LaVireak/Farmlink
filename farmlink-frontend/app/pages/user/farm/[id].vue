<template>
  <CommonAppHeader />

  <main class="mx-24 py-12 px-4">
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Left: Farmer info -->
      <aside class="h-full lg:col-span-1 bg-white rounded-lg shadow p-6">
        <div class="flex flex-col items-center text-center">
          <img :src="farm?.farmer.avatar || '/assets/images/avatar-placeholder.png'" alt="Farmer avatar" class="w-28 h-28 rounded-full object-cover border mb-4" />
          <h2 class="text-xl font-bold">{{ farm?.farmer.name || 'Farmer' }}</h2>
          <div class="text-sm text-gray-600">Farmer</div>
        </div>

        <div class="mt-6 space-y-3 text-sm">
          <div>
            <div class="font-bold">Email</div>
            <div class="text-gray-700"><a v-if="farm?.farmer.email" :href="`mailto:${farm.farmer.email}`">{{ farm.farmer.email }}</a><span v-else>—</span></div>
          </div>

          <div>
            <div class="font-bold">Phone</div>
            <div class="text-gray-700"><a v-if="farm?.farmer.phone" :href="`tel:${farm.farmer.phone}`">{{ farm.farmer.phone }}</a><span v-else>—</span></div>
          </div>

          <div>
            <div class="font-bold">Working Hours</div>
            <div class="text-gray-700">{{ farm?.farmer.workingHours || 'Not specified' }}</div>
          </div>

          <div>
            <div class="font-bold">Address</div>
            <div class="text-gray-700">{{ farm?.address || 'Not available' }}</div>
          </div>

          <div>
            <div class="font-bold">Social</div>
            <div class="text-gray-700 flex flex-col gap-1">
              <a v-if="farm?.farmer.social?.facebook" :href="farm.farmer.social.facebook" target="_blank" class="text-green-700">Facebook</a>
              <a v-if="farm?.farmer.social?.twitter" :href="farm.farmer.social.twitter" target="_blank" class="text-green-700">Twitter</a>
              <span v-if="!(farm?.farmer.social && (farm.farmer.social.facebook || farm.farmer.social.twitter))" class="text-gray-500">No socials listed</span>
            </div>
          </div>

          <div>
            <div class="font-bold">Description</div>
            <div class="text-gray-700">{{ farm?.description || 'No description available.' }}</div>
          </div>
        </div>
      </aside>

      <!-- Right: Gallery + Products -->
      <section class="lg:col-span-3 space-y-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="mb-3">
            <NuxtLink to="/user/farm" class="border px-2 py-1 rounded inline-flex items-center gap-1 text-sm bg-green-600 text-white">
              Back to farms
            </NuxtLink>
          </div>
          <h3 class="text-lg font-semibold mb-3">{{ farm?.name || 'Farm Details' }}</h3>
          <div class="flex gap-3 overflow-x-auto py-2">
            <img v-for="(img, idx) in farm?.images || []" :key="idx" :src="img" class="w-80 h-48 object-cover rounded flex-shrink-0" />
            <div v-if="!(farm?.images && farm.images.length)" class="text-gray-500">No images available.</div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-3">Products</h3>
          <div class="flex flex-col gap-4">
            <div v-for="prod in farm?.products || []" :key="prod.id" class="flex justify-between border rounded p-3 bg-gray-50">
              <div class="flex items-start gap-3">
                <img :src="prod.image || '/assets/images/product-placeholder.png'" class="w-20 h-20 object-cover rounded" />
                <div class="flex-1">
                  <div class="font-semibold">{{ prod.name }}</div>
                  <div class="text-sm text-gray-600">{{ prod.description }}</div>
                  <div class="text-sm text-green-700 font-bold mt-2">{{ formatPrice(prod.price) }}</div>
                </div>
              </div>
              <div class="flex items-center gap-12">
                <div :class="prod.stock > 0 ? 'text-green-700 text-sm font-bold' : 'text-red-500 text-sm'">
                  {{ prod.stock > 0 ? prod.stock + ' in stock' : 'Out of stock' }}
                </div>
                  <button @click="toggleFavorite(prod)" class="focus:outline-none" aria-label="Toggle favorite">
                    <Heart :class="prodFavorited(prod) ? 'w-6 h-6 text-red-500' : 'w-6 h-6 text-gray-600'" />
                  </button>
                <button @click="addToCart(prod)" :disabled="prod.stock <= 0" class="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50">Add to cart</button>
              </div>
            </div>
            <div v-if="!(farm?.products && farm.products.length)" class="text-gray-500">No products listed.</div>
          </div>
        </div>
      </section>
    </div>
  </main>

  <CommonAppFooter />
</template>
<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

import CommonAppHeader from '~/components/common/AppHeader.vue'
import CommonAppFooter from '~/components/common/AppFooter.vue'
import { Heart } from 'lucide-vue-next'

const route = useRoute()

const id = computed(() => String(route.params.id))

/**
 * FULL FARM DATA (6 FARMS)
 * EACH FARM HAS 2 PRODUCTS
 */
const sampleFarms = ref([
  {
    id: 'f1',
    name: 'Cham River Farm',
    province: 'Kampong Cham',
    rating: 4.8,
    address: 'Cham River Area, Kampong Cham',
    description: 'Organic vegetable plots near the river.',
    images: [
      '/assets/images/farm1.png',
      '/assets/images/farm1-2.png',
      '/assets/images/farm1-3.png'
    ],
    farmer: {
      name: 'Sophal',
      phone: '+85512345678',
      email: 'sophal@example.com',
      avatar: '/assets/images/farmer1.png',
      workingHours: 'Mon–Sat 07:00–17:00',
      social: { facebook: '', twitter: '' }
    },
    products: [
      {
        id: 'p1',
        name: 'Organic Lettuce',
        description: 'Fresh hydroponic lettuce.',
        price: 1.5,
        image: '/assets/images/product1.png',
        stock: 12
      },
      {
        id: 'p2',
        name: 'Cherry Tomatoes',
        description: 'Sweet cherry tomatoes.',
        price: 2.2,
        image: '/assets/images/product2.png',
        stock: 8
      }
    ]
  },

  {
    id: 'f2',
    name: 'Green Valley Farm',
    province: 'Kampong Cham',
    rating: 4.6,
    address: 'Green Valley Road',
    description: 'Family-run vegetable farm.',
    images: ['/assets/images/farm2.png', '/assets/images/farm2-2.png', '/assets/images/farm2-3.png'],
    farmer: {
      name: 'Dara',
      phone: '+85511122233',
      email: 'dara@example.com',
      avatar: '/assets/images/farmer1.png',
      workingHours: 'Mon–Fri 08:00–17:00',
      social: { facebook: '', twitter: '' }
    },
    products: [
      {
        id: 'p3',
        name: 'Cabbage',
        description: 'Fresh green cabbage.',
        price: 1.2,
        image: '/assets/images/product1.png',
        stock: 10
      },
      {
        id: 'p4',
        name: 'Cucumber',
        description: 'Organic cucumbers.',
        price: 1.0,
        image: '/assets/images/product2.png',
        stock: 6
      }
    ]
  },

  {
    id: 'f3',
    name: 'Kandal Fresh',
    province: 'Kandal',
    rating: 3.5,
    address: 'Kandal Market Area',
    description: 'Mixed produce and local deliveries.',
    images: ['/assets/images/farm3.png', '/assets/images/farm3-2.png', '/assets/images/farm3-3.png'],
    farmer: {
      name: 'Vanna',
      phone: '+85598765432',
      email: 'vanna@example.com',
      avatar: '/assets/images/farmer2.png',
      workingHours: 'Mon–Sat 08:00–16:00',
      social: { facebook: '', twitter: '' }
    },
    products: [
      {
        id: 'p5',
        name: 'Carrot',
        description: 'Fresh carrots.',
        price: 0.8,
        image: '/assets/images/product1.png',
        stock: 15
      },
      {
        id: 'p6',
        name: 'Spinach',
        description: 'Organic spinach leaves.',
        price: 1.3,
        image: '/assets/images/product2.png',
        stock: 9
      }
    ]
  },

  {
    id: 'f4',
    name: 'Kandal Orchards',
    province: 'Kandal',
    rating: 4.2,
    address: 'Orchard Road, Kandal',
    description: 'Fruit orchard specialising in mangoes.',
    images: ['/assets/images/farm4.png', '/assets/images/farm4-2.png', '/assets/images/farm4-3.png'],
    farmer: {
      name: 'Sokha',
      phone: '+85522233344',
      email: 'sokha@example.com',
      avatar: '/assets/images/farmer2.png',
      workingHours: 'Mon–Fri 07:30–16:00',
      social: { facebook: '', twitter: '' }
    },
    products: [
      {
        id: 'p7',
        name: 'Mango',
        description: 'Sweet tropical mangoes.',
        price: 2.5,
        image: '/assets/images/product1.png',
        stock: 7
      },
      {
        id: 'p8',
        name: 'Banana',
        description: 'Fresh bananas.',
        price: 1.1,
        image: '/assets/images/product2.png',
        stock: 20
      }
    ]
  },

  {
    id: 'f5',
    name: 'Ta Keo Greens',
    province: 'Ta Keo',
    rating: 4.0,
    address: 'Ta Keo Zone',
    description: 'Salad greens and herbs.',
    images: ['/assets/images/farm5.png', '/assets/images/farm5-2.png', '/assets/images/farm5-3.png'],
    farmer: {
      name: 'Rina',
      phone: '+85533344455',
      email: 'rina@example.com',
      avatar: '/assets/images/farmer3.png',
      workingHours: 'Mon–Sat 08:00–17:00',
      social: { facebook: '', twitter: '' }
    },
    products: [
      {
        id: 'p9',
        name: 'Lettuce Mix',
        description: 'Fresh salad mix.',
        price: 1.4,
        image: '/assets/images/product1.png',
        stock: 11
      },
      {
        id: 'p10',
        name: 'Basil',
        description: 'Aromatic basil leaves.',
        price: 0.9,
        image: '/assets/images/product2.png',
        stock: 13
      }
    ]
  },

  {
    id: 'f6',
    name: 'Ta Keo Hydroponics',
    province: 'Ta Keo',
    rating: 3.9,
    address: 'Hydroponic Zone',
    description: 'Modern greenhouse operations.',
    images: ['/assets/images/farm6.png', '/assets/images/farm6-2.png', '/assets/images/farm6-3.png'],
    farmer: {
      name: 'Bora',
      phone: '+85544455566',
      email: 'bora@example.com',
      avatar: '/assets/images/farmer3.png',
      workingHours: 'Mon–Fri 08:00–16:00',
      social: { facebook: '', twitter: '' }
    },
    products: [
      {
        id: 'p11',
        name: 'Hydro Lettuce',
        description: 'Hydroponic lettuce.',
        price: 1.6,
        image: '/assets/images/product1.png',
        stock: 14
      },
      {
        id: 'p12',
        name: 'Hydro Spinach',
        description: 'Clean hydro spinach.',
        price: 1.7,
        image: '/assets/images/product2.png',
        stock: 10
      }
    ]
  }
])

/**
 * FIND FARM BY ID
 */
const farm = computed(() =>
  sampleFarms.value.find(f => f.id === id.value)
)

/**
 * CART + FAVORITES
 */
const cart = ref([])
const favorites = ref(new Set())

function addToCart(prod) {
  if (!prod || prod.stock <= 0) return

  prod.stock -= 1

  const existing = cart.value.find(i => i.id === prod.id)

  if (existing) {
    existing.qty += 1
  } else {
    cart.value.push({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      qty: 1
    })
  }
}

function toggleFavorite(prod) {
  if (!prod) return

  if (favorites.value.has(prod.id)) {
    favorites.value.delete(prod.id)
  } else {
    favorites.value.add(prod.id)
  }
}

function prodFavorited(prod) {
  return prod && favorites.value.has(prod.id)
}

function formatPrice(p) {
  return p ? `$${p.toFixed(2)}` : ''
}
</script>

<style scoped>
.max-w-6xl { max-width: 1024px; }

/* PAGE BACKGROUND */
.page-wrapper {
  min-height: 100vh;
  background: radial-gradient(circle at top, #e8f5e9, #ffffff 60%);
  padding-bottom: 40px;
}

/* MAIN CONTAINER */
main {
  max-width: 1200px;
  margin: 0 auto;
}

/* GRID LAYOUT SPACING */
.grid {
  gap: 24px;
}

/* LEFT SIDEBAR (FARMER INFO) */
aside {
  background: linear-gradient(180deg, #ffffff, #f7fff7);
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(31, 122, 46, 0.1);
}

/* FARMER IMAGE */
aside img {
  width: 110px;        /* or any size you want */
  height: 110px;      /* must match width for perfect circle */
  border-radius: 50%; /* THIS makes it circle */
  object-fit: cover;  /* prevents stretching */
  border: 4px sold white; /* optional white border */
  padding: 3px;
  background: white;
  display: block;
  margin: 0 auto;     /* center it */
}

/* FARMER NAME */
aside h2 {
  color: #1f7a2e;
  font-size: 20px;
}

/* RIGHT PANEL */
section {
  border-radius: 18px;
}

/* CARD BLOCKS */
.bg-white {
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

/* FARM TITLE */
h3 {
  color: #1f7a2e;
}

/* IMAGE GALLERY */
img {
  border-radius: 12px;
  transition: transform 0.3s ease;
}

img:hover {
  transform: scale(1.03);
}

/* PRODUCT CARD ROW */
.border.rounded.p-3 {
  background: linear-gradient(135deg, #ffffff, #f6fff6);
  border: 1px solid rgba(31, 122, 46, 0.15);
  transition: 0.2s ease;
}

.border.rounded.p-3:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

/* PRICE TEXT */
.text-green-700 {
  color: #1f7a2e !important;
}

/* STOCK BADGE */
.text-red-500 {
  font-weight: 600;
}

/* BUTTON */
button {
  transition: 0.2s ease;
}

button:hover {
  transform: scale(1.05);
}

/* BACK BUTTON */
a {
  transition: 0.2s;
}

a:hover {
  background: #166023 !important;
}

/* HEART ICON */
svg {
  transition: 0.2s ease;
}

svg:hover {
  transform: scale(1.2);
  color: #ff4d4d;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  main {
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr !important;
  }

  aside {
    margin-bottom: 20px;
  }
}
</style>