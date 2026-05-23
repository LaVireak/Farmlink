<template>
  <CommonAppHeader />

  <div class="product-detail-page">
    <div class="detail-container">
      
      <nav class="breadcrumbs">
        <NuxtLink to="/">Home</NuxtLink>
        <span class="separator">/</span>
        <NuxtLink to="/user/products/products">Products</NuxtLink>
        <span class="separator">/</span>
        <span class="current">{{ product?.name || 'Loading...' }}</span>
      </nav>

      <div v-if="product" class="main-content">
        <div class="gallery-section">
          <div class="main-image-wrap">
            <img :src="activeImage" :alt="product.name" class="main-image" />
            <span v-if="product.badge" :class="['card-badge', badgeClass]">{{ product.badge }}</span>
          </div>
        </div>

        <div class="info-section">
          <div class="product-category">{{ product.category }}</div>
          <h1 class="product-title">{{ product.name }}</h1>
          
          <div class="product-rating">
            <span class="stars">
              <span v-for="i in 5" :key="i" :class="i <= Math.round(product.rating || 5) ? 'star-filled' : 'star-empty'">★</span>
            </span>
            <span class="rating-text">{{ (product.rating || 5).toFixed(1) }} ({{ reviews.length }} reviews)</span>
          </div>

          <div class="product-price-block">
            <span class="price">${{ discountedPrice }}</span>
            <span v-if="product.discount" class="original-price">${{ product.price.toFixed(2) }}</span>
            <span v-if="product.discount" class="discount-tag">-{{ product.discount }}%</span>
          </div>

          <p class="short-desc">{{ product.description }}</p>

          <div class="action-block">
            <div class="quantity-selector">
              <button @click="decrease" class="qty-btn" aria-label="Decrease quantity">−</button>
              <span class="qty-val">{{ quantity }}</span>
              <button @click="increase" class="qty-btn" aria-label="Increase quantity">+</button>
            </div>
            
            <button @click="addToCart" class="add-to-cart-btn">
              Add to Cart
            </button>
          </div>

          <div class="delivery-info">
            <div class="info-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1" ry="1"></rect><line x1="12" y1="8" x2="12" y2="21"></line><path d="M19 8v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8"></path></svg>
              <span>Freshly packed from <strong>Organic Dreams Farm</strong></span>
            </div>
            <div class="info-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <span>Estimated Delivery: <strong>Tomorrow, 8 AM - 12 PM</strong></span>
            </div>
          </div>
          
          <div class="thumbnail-row mt-6" v-if="product.gallery && product.gallery.length > 1">
            <button 
              v-for="(img, idx) in product.gallery" 
              :key="idx" 
              :class="['thumb-btn', { active: activeImage === img }]"
              @click="activeImage = img"
            >
              <img :src="img" :alt="`Thumbnail ${idx + 1}`" />
            </button>
          </div>
        </div>
      </div>

      <div v-else-if="loading" class="loading-state">
        <p>Loading product...</p>
      </div>

      <div v-else class="not-found">
        <h2>Product not found</h2>
        <NuxtLink to="/user/products/products" class="back-link">Return to Shop</NuxtLink>
      </div>

      <div v-if="product" class="tabs-section">
        <div class="tabs-header">
          <button 
            v-for="tab in ['Description', 'Farm Info', 'Reviews']" 
            :key="tab"
            :class="['tab-btn', { active: activeTab === tab }]"
            @click="activeTab = tab"
          >
            {{ tab }}
          </button>
        </div>
        
        <div class="tab-content">
          <div v-if="activeTab === 'Description'">
            <h3 class="tab-title">The Harvest Story</h3>
            <p>{{ product.description }}</p>
            <p class="mt-4">Our produce is grown without synthetic pesticides or fertilizers, ensuring that you get the freshest, healthiest ingredients for your family's table. We believe in sustainable farming practices that nurture the soil and protect the environment.</p>
          </div>
          
          <div v-else-if="activeTab === 'Farm Info'">
            <h3 class="tab-title">About Organic Dreams Farm</h3>
            <p>Located in the heart of Cambodia, Organic Dreams Farm is dedicated to sustainable agriculture and community support. With over 20 years of experience, our farmers bring a wealth of knowledge and passion to every crop.</p>
          </div>
          
          <div v-else-if="activeTab === 'Reviews'">
            <h3 class="tab-title">Customer Reviews ({{ reviews.length }})</h3>
            <div class="reviews-list">
              <div v-for="review in reviews" :key="review.name" class="review-card">
                <div class="review-header">
                  <span class="reviewer-name">{{ review.name }}</span>
                  <span class="stars"><span class="star-filled" v-for="i in 5" :key="i">★</span></span>
                </div>
                <p class="review-comment">{{ review.comment }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="product" class="related-products">
        <h2 class="section-title">You May Also Like</h2>
        <div class="product-grid">
          <UserProductCard 
            v-for="relProd in relatedProducts" 
            :key="relProd.id" 
            :product="relProd" 
            @add-to-cart="handleRelatedAddToCart"
            @save-product="handleRelatedSave"
          />
        </div>
      </div>

    </div>
  </div>

  <CommonAppFooter />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import CommonAppHeader from '~/components/common/AppHeader.vue'
import CommonAppFooter from '~/components/common/AppFooter.vue'
import UserProductCard from '~/components/user/UserProductCard.vue'

const route = useRoute()
const config = useRuntimeConfig()

const product = ref(null)
const reviews = ref([
  { name: 'Sokha Rith', comment: 'Extremely fresh and well packaged. Best organic produce in Cambodia!' },
  { name: 'Dara Pich', comment: 'Very clean and high quality. Will definitely order again next week!' }
])
const relatedProducts = ref([])
const activeImage = ref('')
const quantity = ref(1)
const isSaved = ref(false)
const activeTab = ref('Description')
const loading = ref(false)

onMounted(async () => {
  await fetchProduct()
  await fetchRelatedProducts()
})

const fetchProduct = async () => {
  loading.value = true
  try {
    const res = await $fetch(`${config.public.apiUrl}/products/${route.params.id}`)
    product.value = res
    if (res && res.image) {
      activeImage.value = res.image
    }
  } catch (err) {
    console.error('Failed to fetch product:', err)
  } finally {
    loading.value = false
  }
}

const fetchRelatedProducts = async () => {
  try {
    const res = await $fetch(`${config.public.apiUrl}/products`)
    if (res && Array.isArray(res)) {
      relatedProducts.value = res.filter(p => String(p.id) !== String(route.params.id)).slice(0, 4)
    }
  } catch (err) {
    console.error('Failed to fetch related products:', err)
  }
}

const discountedPrice = computed(() => {
  if (product.value?.discount) {
    return (product.value.price * (1 - product.value.discount / 100)).toFixed(2)
  }
  return product.value ? product.value.price.toFixed(2) : '0.00'
})

const badgeClass = computed(() => {
  const badge = (product.value?.badge || '').toLowerCase()
  if (badge === 'sale') return 'badge-sale'
  if (badge === 'new') return 'badge-new'
  if (badge === 'best seller') return 'badge-best'
  return 'badge-default'
})

const increase = () => quantity.value++
const decrease = () => { if (quantity.value > 1) quantity.value-- }

const addToCart = () => {
}

const toggleSave = () => {
  isSaved.value = !isSaved.value
}

const handleRelatedAddToCart = (prod) => {
}

const handleRelatedSave = (prod) => {
}
</script>

<style scoped>
.product-detail-page {
  min-height: 100vh;
  background: #f4f4ee;
  font-family: 'Inter', sans-serif;
  padding: 32px 20px 60px;
}

.detail-container {
  width: 100%;
  padding: 0 12px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.breadcrumbs a {
  color: #42493e;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumbs a:hover {
  color: #2e7e3f;
}

.breadcrumbs .separator {
  color: #9ca3af;
}

.breadcrumbs .current {
  color: #1f6a35;
  font-weight: 600;
}

.main-content {
  display: grid;
  grid-template-columns: 50% 1fr;
  gap: 45px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);
}

.gallery-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-left: 68px;
}

.main-image-wrap {
  position: relative;
  width: 95%;
  height: 70vh;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.main-image-wrap:hover .main-image {
  transform: scale(1.05);
}

.card-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  z-index: 10;
}
.badge-sale { background: #fee2e2; color: #dc2626; }
.badge-new { background: #dbeafe; color: #1d4ed8; }
.badge-best { background: #fef3c7; color: #b45309; }
.badge-default { background: #dcfce7; color: #15803d; }

.thumbnail-row {
  display: flex;
  gap: 25px;
}

.thumb-btn {
  width: 120px;
  aspect-ratio: 1;
  border-radius: 10px;
  border: 2px solid transparent;
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  background: #fff;
  transition: all 0.2s;
}

.thumb-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-btn.active {
  border-color: #2e7e3f;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(46, 126, 63, 0.2);
}

.info-section {
  display: flex;
  flex-direction: column;
}

.product-category {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #2e7e3f;
  margin-bottom: 8px;
}

.product-title {
  margin: 0 0 12px;
  font-size: 32px;
  font-weight: 800;
  color: #1b1c1a;
  line-height: 1.1;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
}

.stars {
  font-size: 16px;
  display: flex;
  gap: 2px;
}

.star-filled { color: #f59e0b; }
.star-empty { color: #d1d5db; }

.rating-text {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
}

.product-price-block {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(200, 210, 200, 0.4);
}

.price {
  font-size: 36px;
  font-weight: 800;
  color: #1f6a35;
  line-height: 1;
}

.original-price {
  font-size: 18px;
  color: #9ca3af;
  text-decoration: line-through;
  font-weight: 500;
}

.discount-tag {
  background: #fef2f2;
  color: #dc2626;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 6px;
}

.short-desc {
  font-size: 15px;
  line-height: 1.6;
  color: #4b5563;
  margin: 0 0 32px;
}

/* ACTIONS */
.action-block {
  display: flex;
  align-items: stretch;
  gap: 16px;
  margin-bottom: 32px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #c2c9bb;
  border-radius: 999px;
  padding: 4px;
}

.qty-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  font-size: 20px;
  color: #42493e;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;
}

.qty-btn:hover {
  background: #f3f4f6;
}

.qty-val {
  min-width: 32px;
  text-align: center;
  font-weight: 700;
  font-size: 16px;
  color: #1b1c1a;
}

.add-to-cart-btn {
  padding: 0 48px;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #2e7e3f, #1f6130);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(46, 126, 63, 0.25);
}

.add-to-cart-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(107, 161, 119, 0.35);
}

.save-btn {
  width: 48px;
  height: 48px;
  border: 1px solid #c2c9bb;
  border-radius: 50%;
  background: #fff;
  color: #42493e;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.save-btn:hover {
  border-color: #ef4444;
  color: #ef4444;
}

.save-btn.is-saved {
  border-color: #ef4444;
  color: #ef4444;
  background: #fef2f2;
}

/* DELIVERY INFO */
.delivery-info {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #4b5563;
  font-size: 14px;
}

.info-item svg {
  color: #2e7e3f;
  flex-shrink: 0;
}

.info-item strong {
  color: #1b1c1a;
}

.tabs-section {
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
}

.tabs-header {
  display: flex;
  gap: 32px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.tab-btn {
  padding: 0 0 12px;
  border: none;
  background: transparent;
  font-size: 16px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}

.tab-btn:hover {
  color: #1b1c1a;
}

.tab-btn.active {
  color: #2e7e3f;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 3px;
  background: #2e7e3f;
  border-radius: 3px 3px 0 0;
}

.tab-content {
  font-size: 15px;
  line-height: 1.6;
  color: #4b5563;
}

.tab-title {
  font-size: 18px;
  font-weight: 700;
  color: #1b1c1a;
  margin: 0 0 12px;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-card {
  background: #f9fafb;
  border-radius: 12px;
  padding: 16px;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.reviewer-name {
  font-weight: 700;
  color: #1b1c1a;
}

.review-comment {
  margin: 0;
}

.related-products {
  margin-top: 24px;
}

.section-title {
  font-size: 24px;
  font-weight: 800;
  color: #1b1c1a;
  margin: 0 0 24px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 32px;
}

@media (max-width: 900px) {
  .main-content {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

@media (max-width: 600px) {
  .product-detail-page {
    padding: 16px 12px 40px;
  }
  
  .main-content, .tabs-section {
    padding: 20px;
  }
  
  .product-title {
    font-size: 24px;
  }
  
  .price {
    font-size: 28px;
  }
  
  .action-block {
    flex-wrap: wrap;
  }
  
  .add-to-cart-btn {
    width: 100%;
    order: 3;
    padding: 14px;
  }
  
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}
</style>