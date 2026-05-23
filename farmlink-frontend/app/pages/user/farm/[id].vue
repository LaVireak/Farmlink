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
const id = route.params.id || 'f1'

const sampleFarms = ref([
  {
    id: 'f1',
    name: 'Green Valley Farm',
    address: '123 Riverside, Kampong Cham',
    images: ['/assets/images/farm1.png','/assets/images/farm1-2.png', '/assets/images/farm1-3.png', '/assets/images/farm1-4.png'],
    farmer: { name: 'Sophea', phone: '+85512345678', email: 'sophea@example.com', avatar: '/assets/images/farmer1.png', workingHours: 'Mon–Sat 07:00–17:00', social: { facebook: 'https://facebook.com/sophea', twitter: '' } },
    products: [
      { id: 'p1', name: 'Organic Lettuce', description: 'Fresh hydroponic lettuce.', price: 1.5, image: '/assets/images/product1.png', stock: 12 },
      { id: 'p2', name: 'Cherry Tomatoes', description: 'Sweet cherry tomatoes.', price: 2.2, image: '/assets/images/product2.png', stock: 0 },
      { id: 'p4', name: 'Basil Bundle', description: 'Aromatic basil for cooking.', price: 0.9, image: '/assets/images/product1.png', stock: 5 },
      { id: 'p5', name: 'Spring Mix (250g)', description: 'Assorted salad leaves.', price: 1.8, image: '/assets/images/product2.png', stock: 3 }
    ]
  },
  {
    id: 'f2',
    name: 'Kandal Orchards',
    address: 'Orchard Road, Kandal',
    images: ['/assets/images/farm2.png'],
    farmer: { name: 'Vanna', phone: '+85598765432', email: 'vanna@example.com', avatar: '/assets/images/farmer2.png', workingHours: 'Mon–Fri 08:00–16:00', social: { facebook: 'https://facebook.com/vanna', twitter: 'https://twitter.com/vanna' } },
    products: [
      { id: 'p3', name: 'Mango (1kg)', description: 'Seasonal mangoes.', price: 3.0, image: '/assets/images/product3.png', stock: 8 }
    ]
  }
])

const farm = computed(() => sampleFarms.value.find(f => f.id === id))

const cart = ref([])
const favorites = ref(new Set())

function addToCart(prod) {
  if (!prod || prod.stock <= 0) return
  // decrement stock
  prod.stock -= 1
  // add to simple cart (merge by id)
  const existing = cart.value.find(i => i.id === prod.id)
  if (existing) existing.qty += 1
  else cart.value.push({ id: prod.id, name: prod.name, price: prod.price, qty: 1 })
  console.log('Added to cart:', prod.id, 'cart:', cart.value)
}

function toggleFavorite(prod) {
  if (!prod) return
  if (favorites.value.has(prod.id)) favorites.value.delete(prod.id)
  else favorites.value.add(prod.id)
}

function prodFavorited(prod) {
  return prod && favorites.value.has(prod.id)
}

function formatPrice(p) { if (p == null) return '' ; return `$${p.toFixed(2)}` }
</script>

<style scoped>
.max-w-6xl { max-width: 1024px; }
</style>