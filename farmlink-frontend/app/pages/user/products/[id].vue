<template>
  <CommonAppHeader />

  <div class="product-detail-page">
    <div class="detail-container">

      <!-- Breadcrumb -->
      <nav class="breadcrumbs">
        <NuxtLink to="/">Home</NuxtLink>

        <span class="separator">/</span>

        <NuxtLink to="/user/products">
          Products
        </NuxtLink>

        <span class="separator">/</span>

        <span class="current">
          {{ product?.name || 'Loading...' }}
        </span>
      </nav>

      <!-- Product -->
      <div v-if="product" class="main-content">

        <!-- LEFT SIDE : IMAGE -->
        <div class="gallery-section">

          <div class="main-image-wrap">
            <img
              :src="activeImage"
              :alt="product.name"
              class="main-image"
            />

            <span
              v-if="product.badge"
              :class="['card-badge', badgeClass]"
            >
              {{ product.badge }}
            </span>
          </div>

        </div>

        <!-- RIGHT SIDE : PRODUCT INFO -->
        <div class="info-section">

          <div class="product-category">
            {{ product.category }}
          </div>

          <h1 class="product-title">
            {{ product.name }}
          </h1>

          <!-- Rating -->
          <div class="product-rating">

            <span class="stars">
              <span
                v-for="i in 5"
                :key="i"
                :class="
                  i <= Math.round(product.rating || 5)
                    ? 'star-filled'
                    : 'star-empty'
                "
              >
                ★
              </span>
            </span>

            <span class="rating-text">
              {{ (product.rating || 5).toFixed(1) }}
            </span>

          </div>

          <!-- Price -->
          <div class="product-price-block">

            <span class="price">
              ${{ discountedPrice }}
            </span>

            <span
              v-if="product.discount"
              class="original-price"
            >
              ${{ product.price.toFixed(2) }}
            </span>

            <span
              v-if="product.discount"
              class="discount-tag"
            >
              -{{ product.discount }}%
            </span>

          </div>

          <!-- Description -->
          <p class="short-desc">
            {{ product.description }}
          </p>

          <!-- Farmer -->
          <div
            v-if="product.farmer"
            class="farmer-info-card"
          >
            <h3 class="farmer-heading">
              Sold By
            </h3>

            <NuxtLink
              :to="`/user/farm/${product.farmer.id}`"
              class="farmer-link"
            >
              <div class="farmer-details">

                <span class="farm-name">
                  {{
                    product.farmer.farmName ||
                    (product.farmer.firstName
                      ? `${product.farmer.firstName} ${product.farmer.lastName}`
                      : 'Unknown Farm')
                  }}
                </span>

                <span
                  class="farmer-name"
                  v-if="
                    product.farmer.farmName &&
                    product.farmer.firstName
                  "
                >
                  ({{ product.farmer.firstName }}
                  {{ product.farmer.lastName }})
                </span>

                <span
                  v-if="product.farmer.isVerified"
                  class="verified-badge"
                >
                  ✓ Verified
                </span>

              </div>
            </NuxtLink>
          </div>

          <!-- Stock -->
          <div class="mb-4 mt-2">

            <span
              :class="
                product.stockQuantity > 0
                  ? 'bg-[#dcfce7] text-[#15803d]'
                  : 'bg-red-100 text-red-700'
              "
              class="px-3 py-1.5 rounded-lg text-sm font-semibold inline-block"
            >
              {{
                product.stockQuantity > 0
                  ? `${product.stockQuantity} units available`
                  : 'Out of Stock'
              }}
            </span>

          </div>

          <!-- Quantity -->
          <div
            class="action-block"
            v-if="product.stockQuantity > 0"
          >

            <div class="quantity-selector">

              <button
                @click="decrease"
                class="qty-btn"
              >
                −
              </button>

              <span class="qty-val">
                {{ quantity }}
              </span>

              <button
                @click="increase"
                class="qty-btn"
              >
                +
              </button>

            </div>

            <button
              @click="addToCart($event)"
              class="add-to-cart-btn"
            >
              Add to Cart
            </button>

            <button
              @click="goToPreorder"
              class="preorder-btn"
            >
              Pre-order
            </button>

          </div>

          <div v-else class="action-block">

            <button
              disabled
              class="add-to-cart-btn opacity-50 cursor-not-allowed"
            >
              Out of Stock
            </button>

            <button
              @click="goToPreorder"
              class="preorder-btn"
            >
              Pre-order Harvest
            </button>

          </div>

          <!-- Thumbnails -->
          <div
            class="thumbnail-row mt-6"
            v-if="product.gallery?.length > 1"
          >

            <button
              v-for="(img, idx) in product.gallery"
              :key="idx"
              :class="[
                'thumb-btn',
                { active: activeImage === img }
              ]"
              @click="activeImage = img"
            >
              <img :src="img" />
            </button>

          </div>

          <!-- COMMUNITY REVIEWS -->
          <section class="community-review-section">

            <div class="review-title">
              <h2>Community Reviews</h2>
              <p>
                See what customers think about this product
              </p>
            </div>

            <div class="review-grid">

              <div
                v-for="(review,index) in reviews"
                :key="index"
                class="review-card"
              >

                <div class="review-user">

                  <div class="avatar">
                    {{ review.name.charAt(0) }}
                  </div>

                  <div>
                    <h4>{{ review.name }}</h4>
                    <span>Verified Purchase</span>
                  </div>

                </div>

                <div class="review-stars">
                  ★★★★★
                </div>

                <p>
                  {{ review.comment }}
                </p>

              </div>

            </div>

          </section>

        </div>

      </div>

      <!-- Product Details & Specs -->
      <div v-if="product" class="details-section">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Description Card -->
          <div class="section-card">
            <h2>Product Description</h2>
            <p>{{ product.description || 'No detailed description available for this product.' }}</p>
          </div>

          <!-- Specifications Card -->
          <div class="section-card">
            <h2>Product Information</h2>
            <ul class="feature-list">
              <li>
                <div class="flex justify-between">
                  <span class="text-gray-500">Category</span>
                  <span class="font-semibold text-gray-800">{{ product.category || 'Fruits' }}</span>
                </div>
              </li>
              <li>
                <div class="flex justify-between">
                  <span class="text-gray-500">Certification</span>
                  <span class="font-semibold" :class="product.isOrganic ? 'text-green-600' : 'text-gray-800'">
                    {{ product.isOrganic ? '✓ Certified Organic' : 'Standard' }}
                  </span>
                </div>
              </li>
              <li>
                <div class="flex justify-between">
                  <span class="text-gray-500">Unit</span>
                  <span class="font-semibold text-gray-800">per {{ product.unit || 'kg' }}</span>
                </div>
              </li>
              <li>
                <div class="flex justify-between">
                  <span class="text-gray-500">Min. Order Quantity</span>
                  <span class="font-semibold text-gray-800">{{ product.minOrderQty || 1 }} {{ product.unit || 'kg' }}</span>
                </div>
              </li>
              <li>
                <div class="flex justify-between">
                  <span class="text-gray-500">Seasonal Special</span>
                  <span class="font-semibold text-gray-800">{{ product.isSeasonal ? 'Yes' : 'No (Available Year-Round)' }}</span>
                </div>
              </li>
              <li v-if="product.isSeasonal && (product.seasonStart || product.seasonEnd)">
                <div class="flex justify-between">
                  <span class="text-gray-500">Season Duration</span>
                  <span class="font-semibold text-gray-800">
                    {{ formatDate(product.seasonStart) }} - {{ formatDate(product.seasonEnd) }}
                  </span>
                </div>
              </li>
              <li>
                <div class="flex justify-between">
                  <span class="text-gray-500">Available Stock</span>
                  <span class="font-semibold text-gray-800">{{ product.stockQuantity || 0 }} {{ product.unit || 'units' }}</span>
                </div>
              </li>
              <li>
                <div class="flex justify-between">
                  <span class="text-gray-500">Total Sold</span>
                  <span class="font-semibold text-gray-800">{{ product.totalSold || 0 }} {{ product.unit || 'units' }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-state">
        <p>Loading product...</p>
      </div>

      <!-- Not Found -->
      <div
        v-if="!loading && !product"
        class="not-found"
      >
        <h2>Product not found</h2>

        <NuxtLink
          to="/user/products"
          class="back-link"
        >
          Return to Shop
        </NuxtLink>
      </div>

    </div>
  </div>

  <CommonAppFooter />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import CommonAppHeader from '~/components/common/AppHeader.vue'
import CommonAppFooter from '~/components/common/AppFooter.vue'

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

const product = ref(null)

const reviews = ref([
  { name: 'Sokha Rith', comment: 'Extremely fresh and well packaged. Best organic produce in Cambodia!' },
  { name: 'Dara Pich', comment: 'Very clean and high quality. Will definitely order again next week!' }
])
const relatedProducts = ref([])
const activeImage = ref('')
const quantity = ref(1)

const loading = ref(false)
onMounted(async () => {
  await fetchProduct()
  await fetchRelatedProducts()
})

// ================= FETCH PRODUCT =================
const fetchProduct = async () => {
  loading.value = true

  try {
    const res = await $fetch(
      `${config.public.apiUrl}/products/${route.params.id}`
    )

    const mappedRes = {
      ...res,
      stockQuantity: res.stock !== undefined ? Number(res.stock) : Number(res.stockQuantity || 0)
    }
    product.value = mappedRes

    activeImage.value =
      mappedRes.gallery?.[0] ||
      mappedRes.image ||
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80'

    if (mappedRes.stockQuantity <= 0) {
      quantity.value = 0
    } else {
      quantity.value = 1
    }

  } catch (err) {
    console.error('Failed to fetch product:', err)
    product.value = null
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

// ================= PRICE =================
const discountedPrice = computed(() => {
  if (product.value?.discount) {
    return (
      product.value.price *
      (1 - product.value.discount / 100)
    ).toFixed(2)
  }

  return product.value
    ? product.value.price.toFixed(2)
    : '0.00'
})

// ================= BADGE =================
const badgeClass = computed(() => {
  const badge = (
    product.value?.badge || ''
  ).toLowerCase()

  if (badge === 'sale') return 'badge-sale'
  if (badge === 'new') return 'badge-new'
  if (badge === 'best seller') return 'badge-best'

  return 'badge-default'
})

// ================= QUANTITY =================
const increase = () => {
  const maxStock = product.value?.stockQuantity ?? 9999
  if (quantity.value < maxStock) {
    quantity.value++
  }
}

const decrease = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

import { useCart } from '~/composables/useCart'
const { addToCart: addToCartComposable } = useCart()

// ================= CART =================
const addToCart = (event) => {
  if (product.value) {
    addToCartComposable(product.value, quantity.value, event)
    console.log(
      'Added to cart:',
      product.value,
      'Quantity:',
      quantity.value
    )
  }
}

// ================= PRE-ORDER =================
const goToPreorder = () => {
  if (product.value) {
    router.push(`/user/orders/${product.value.id}`)
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } catch (e) {
    return dateStr
  }
}
</script>

<style scoped>
.product-detail-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8faf7, #eef4ee);
  font-family: "Inter", sans-serif;
  padding: 40px 24px 80px;
}

.detail-container {
  max-width: 1400px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* Breadcrumb */
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
}

.breadcrumbs a {
  color: #4b5563;
  text-decoration: none;
  transition: .3s;
}

.breadcrumbs a:hover {
  color: #2e7d32;
}

.current {
  color: #1b5e20;
  font-weight: 700;
}

/* Main Product Card */
.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  background: #fff;
  border-radius: 24px;
  padding: 35px;
  box-shadow:
    0 10px 30px rgba(0,0,0,0.05),
    0 2px 10px rgba(0,0,0,0.03);
}

/* Gallery */
.gallery-section {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.main-image-wrap {
  position: relative;
  width: 100%;
  height: 620px;
  border-radius: 20px;
  overflow: hidden;
  background: #f8faf8;
  border: 1px solid #e5e7eb;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .5s ease;
}

.main-image-wrap:hover .main-image {
  transform: scale(1.08);
}

.thumbnail-row {
  display: flex;
  gap: 15px;
}

.thumb-btn {
  width: 95px;
  height: 95px;
  border-radius: 14px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: .3s;
  background: white;
}

.thumb-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-btn:hover {
  transform: translateY(-4px);
}

.thumb-btn.active {
  border-color: #2e7d32;
  box-shadow: 0 6px 20px rgba(46,125,50,.15);
}

/* Badges */
.card-badge {
  position: absolute;
  top: 18px;
  left: 18px;
  z-index: 10;
  padding: 8px 14px;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.badge-sale {
  background: #ffebee;
  color: #d32f2f;
}

.badge-new {
  background: #e8f5e9;
  color: #2e7d32;
}

.badge-best {
  background: #fff8e1;
  color: #f57f17;
}

.badge-default {
  background: #f1f5f9;
  color: #475569;
}

/* Product Info */
.info-section {
  display: flex;
  flex-direction: column;
}

.product-category {
  color: #2e7d32;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 2px;
  font-size: 13px;
}

.product-title {
  font-size: 42px;
  font-weight: 800;
  color: #111827;
  margin: 12px 0 18px;
  line-height: 1.2;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.stars {
  display: flex;
  gap: 3px;
  font-size: 18px;
}

.star-filled {
  color: #fbbf24;
}

.star-empty {
  color: #d1d5db;
}

.rating-text {
  color: #6b7280;
}

/* Price */
.product-price-block {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  padding-bottom: 25px;
  margin-bottom: 25px;
  border-bottom: 1px solid #e5e7eb;
}

.price {
  font-size: 42px;
  font-weight: 800;
  color: #2e7d32;
}

.original-price {
  font-size: 22px;
  text-decoration: line-through;
  color: #9ca3af;
}

.discount-tag {
  background: #ffebee;
  color: #d32f2f;
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 700;
}

/* Description */
.short-desc {
  color: #4b5563;
  line-height: 1.8;
  margin-bottom: 30px;
}

/* Farmer Card */
.farmer-info-card {
  background: #f8faf8;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 30px;
}

.farm-name {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.verified-badge {
  background: #dcfce7;
  color: #166534;
  padding: 4px 10px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 700;
}

/* Quantity + Buttons */
.action-block {
  display: flex;
  gap: 16px;
  margin-bottom: 30px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  background: white;
  padding: 6px;
}

.qty-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
}

.qty-btn:hover {
  background: #f3f4f6;
}

.qty-val {
  min-width: 40px;
  text-align: center;
  font-weight: 700;
}

.add-to-cart-btn {
  flex: 1;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg,#2e7d32,#1b5e20);
  color: white;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: .3s;
  padding: 14px 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-to-cart-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(46,125,50,.25);
}

.preorder-btn {
  flex: 1;
  border: 2px solid #2e7d32;
  border-radius: 999px;
  background: transparent;
  color: #2e7d32;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: .3s;
  padding: 14px 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preorder-btn:hover {
  background: #2e7d32;
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(46,125,50,.15);
}

.save-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 1px solid #d1d5db;
  background: white;
  cursor: pointer;
}

.save-btn:hover {
  color: red;
  border-color: red;
}

/* Delivery */
.delivery-info {
  background: #f8faf8;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
}

.info-item {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

/* Tabs */
.tabs-section {
  background: white;
  border-radius: 24px;
  padding: 35px;
  box-shadow: 0 5px 20px rgba(0,0,0,.05);
}

.tabs-header {
  display: flex;
  gap: 35px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 25px;
}

.tab-btn {
  border: none;
  background: none;
  padding-bottom: 14px;
  cursor: pointer;
  font-weight: 600;
  color: #6b7280;
  position: relative;
}

.tab-btn.active {
  color: #2e7d32;
}

.tab-btn.active::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 3px;
  background: #2e7d32;
  border-radius: 10px;
}

/* Reviews */
.review-card {
  background: #f9fafb;
  border-radius: 14px;
  padding: 18px;
  border: 1px solid #f1f5f9;
}

/* Related Products */
.section-title {
  font-size: 32px;
  font-weight: 800;
  color: #111827;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(280px,1fr));
  gap: 24px;
}

/* Responsive */
@media (max-width: 992px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .main-image-wrap {
    height: 500px;
  }
}

@media (max-width: 768px) {
  .product-title {
    font-size: 30px;
  }

  .price {
    font-size: 32px;
  }

  .action-block {
    flex-wrap: wrap;
  }

  .add-to-cart-btn {
    width: 100%;
    min-height: 56px;
  }

  .main-image-wrap {
    height: 380px;
  }

  .tabs-section,
  .main-content {
    padding: 20px;
  }
}
/* ==========================================
   PRODUCT DETAILS SECTION
========================================== */

.details-section {
  display: grid;
  gap: 24px;
  margin-top: 40px;
}

.section-card {
  background: #ffffff;
  border-radius: 24px;
  padding: 32px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 30px rgba(0,0,0,0.04);
}

.section-card h2 {
  font-size: 26px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 18px;
}

.section-card p {
  color: #4b5563;
  line-height: 1.8;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  padding: 14px 0;
  border-bottom: 1px solid #f1f5f9;
  font-weight: 500;
  color: #374151;
}

.feature-list li:last-child {
  border-bottom: none;
}

/* ==========================================
   COMMUNITY REVIEW SECTION
========================================== */

.community-review-section {
  margin-top: 35px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 24px;
}

.review-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 18px;
}

.review-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: #2e7d32;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.review-stars {
  margin: 10px 0;
  color: #fbbf24;
  font-size: 18px;
}

.review-title h2 {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 5px;
}

.review-title p {
  color: #6b7280;
  margin-bottom: 20px;
}

.review-title h2 {
  font-size: 32px;
  font-weight: 800;
  color: #111827;
}

.review-title p {
  color: #6b7280;
  margin-top: 6px;
}

/* Rating Summary */

.review-summary {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 40px;
  margin-bottom: 40px;
}

.rating-box {
  background: #f8faf8;
  border-radius: 20px;
  padding: 30px;
  text-align: center;
}

.rating-box h1 {
  font-size: 72px;
  line-height: 1;
  color: #2e7d32;
  font-weight: 800;
}

.stars-big {
  font-size: 26px;
  color: #fbbf24;
  margin: 10px 0;
}

.rating-box span {
  color: #6b7280;
}

.rating-bars {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
}

.rating-row span {
  min-width: 40px;
  font-weight: 600;
}

.bar {
  flex: 1;
  height: 10px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    #2e7d32,
    #4caf50
  );
  border-radius: 999px;
}

/* Review Cards */

.review-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(350px,1fr));
  gap: 20px;
}

.review-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 24px;
  transition: all .3s ease;
}

.review-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 25px rgba(0,0,0,0.06);
}

.review-user {
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    #2e7d32,
    #4caf50
  );
  color: white;
  font-weight: 700;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.review-user h4 {
  margin: 0;
  color: #111827;
}

.review-user span {
  font-size: 13px;
  color: #2e7d32;
}

.review-stars {
  color: #fbbf24;
  margin: 14px 0;
  font-size: 18px;
}

.review-card p {
  color: #4b5563;
  line-height: 1.7;
}

/* ==========================================
   RELATED PRODUCTS
========================================== */

.related-products-section {
  margin-top: 50px;
}

.related-products-section h2 {
  font-size: 32px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 24px;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(280px,1fr));
  gap: 24px;
}

.related-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  border: 1px solid #e5e7eb;
  transition: all .3s ease;
}

.related-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 30px rgba(0,0,0,0.08);
}

.related-card img {
  width: 100%;
  height: 240px;
  object-fit: cover;
}

.related-info {
  padding: 18px;
}

.related-info h3 {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

.related-info span {
  color: #2e7d32;
  font-weight: 700;
  font-size: 18px;
}

/* ==========================================
   MOBILE
========================================== */

@media (max-width: 768px) {

  .review-summary {
    grid-template-columns: 1fr;
  }

  .community-review-section {
    padding: 24px;
  }

  .review-grid {
    grid-template-columns: 1fr;
  }

  .related-grid {
    grid-template-columns: repeat(2,1fr);
    gap: 14px;
  }

  .rating-box h1 {
    font-size: 56px;
  }
}

@media (max-width: 500px) {

  .related-grid {
    grid-template-columns: 1fr;
  }

  .review-title h2,
  .related-products-section h2 {
    font-size: 26px;
  }
}
</style>

