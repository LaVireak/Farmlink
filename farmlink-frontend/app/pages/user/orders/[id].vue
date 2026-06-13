<template>
  <CommonAppHeader />
  <div class="preorder-page">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Fetching product details...</p>
    </div>

    <div v-else-if="product" class="preorder-container">
      <!-- Header -->
      <div class="header-section">
        <NuxtLink :to="`/user/products/${product.id}`" class="back-link">
          <span class="material-symbols-outlined">arrow_back</span>
          Back to Product
        </NuxtLink>
        <h1 class="page-title">Pre-order Product</h1>
      </div>

      <div class="main-grid">
        <!-- Left: Product & Details -->
        <div class="details-column">
          <div class="card product-card">
            <div class="product-info-horizontal">
              <img :src="product.image || product.thumbnailUrl || '/images/placeholder.jpg'" :alt="product.name" class="product-image" />
              <div class="product-meta">
                <span class="category">{{ product.category || 'Organic' }}</span>
                <h2 class="name">{{ product.name }}</h2>
                <div class="price-block">
                  <span class="price">${{ discountedPrice }}</span>
                  <span v-if="product.discount" class="original-price">${{ product.price.toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <div class="quantity-selector-block">
              <label>Quantity ({{ product.unit || 'units' }})</label>
              <div class="selector">
                <button @click="decrementQty" :disabled="quantity <= 1">−</button>
                <span class="qty">{{ quantity }}</span>
                <button @click="incrementQty" :disabled="quantity >= (product.stockQuantity || 99)">+</button>
              </div>
            </div>
          </div>

          <div class="card address-card">
            <h3 class="section-title">Delivery & Contact Information</h3>
            <div class="form-container space-y-4">
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input 
                  v-model="customerEmail" 
                  type="email" 
                  placeholder="Enter your email address" 
                  class="form-input" 
                  :class="{ 'input-error': errors.email }"
                  @input="errors.email = ''"
                />
                <span v-if="errors.email" class="error-message">
                  <span class="material-symbols-outlined" style="font-size: 16px;">error</span>
                  {{ errors.email }}
                </span>
              </div>
              <div class="form-group">
                <label class="form-label">Phone Number</label>
                <input 
                  v-model="customerPhone" 
                  type="tel" 
                  placeholder="Enter your phone number" 
                  class="form-input" 
                  :class="{ 'input-error': errors.phone }"
                  @input="errors.phone = ''"
                />
                <span v-if="errors.phone" class="error-message">
                  <span class="material-symbols-outlined" style="font-size: 16px;">error</span>
                  {{ errors.phone }}
                </span>
              </div>
              <div class="form-group">
                <label class="form-label">Delivery Address</label>
                <textarea 
                  v-model="deliveryAddress" 
                  placeholder="Enter your full delivery address (Street, District, Province)" 
                  rows="3"
                  class="address-textarea"
                  :class="{ 'input-error': errors.address }"
                  @input="errors.address = ''"
                ></textarea>
                <span v-if="errors.address" class="error-message">
                  <span class="material-symbols-outlined" style="font-size: 16px;">error</span>
                  {{ errors.address }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="card info-card">
            <h3 class="section-title">Why Pre-order?</h3>
            <div class="info-item">
              <span class="material-symbols-outlined">eco</span>
              <p>Support local farmers by committing to their harvest early.</p>
            </div>
            <div class="info-item">
              <span class="material-symbols-outlined">verified</span>
              <p>Guaranteed fresh produce delivered directly from the farm.</p>
            </div>
          </div>
        </div>


        <!-- Right: Summary & Action -->
        <div class="summary-column">
          <div class="card summary-card">
            <h3 class="section-title">Order Summary</h3>
            <div class="summary-rows">
              <div class="row">
                <span>Subtotal</span>
                <span>${{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="row">
                <span>Delivery Fee</span>
                <span>${{ deliveryFee.toFixed(2) }}</span>
              </div>
              <div class="row total">
                <span>Total</span>
                <span>${{ total.toFixed(2) }}</span>
              </div>
            </div>

            <button @click="handlePreorder" :disabled="isSubmitting" class="preorder-btn">
              <span v-if="isSubmitting" class="spinner-small"></span>
              {{ isSubmitting ? 'Processing...' : 'Confirm Pre-order' }}
            </button>
            
            <p class="disclaimer">
              * This is a pre-order. Your fresh produce will be harvested and delivered as soon as it's ready. Payment will be collected upon delivery.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!loading" class="error-state">
      <span class="material-symbols-outlined large-icon">inventory_2</span>
      <h2>Product not found</h2>
      <p>We couldn't find the product you're looking for.</p>
      <NuxtLink to="/user/products" class="browse-btn">Browse Products</NuxtLink>
    </div>
  </div>
  <CommonAppFooter />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth.store'
import { getAccessToken } from '~/services/auth.service'

definePageMeta({
  middleware: 'user',
  layout: 'user'
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const authStore = useAuthStore()

const product = ref<any>(null)
const loading = ref(true)
const quantity = ref(1)
const deliveryAddress = ref('')
const customerEmail = ref('')
const customerPhone = ref('')
const isSubmitting = ref(false)

const errors = ref({
  email: '',
  phone: '',
  address: ''
})

const deliveryFee = ref(2.00)

onMounted(async () => {
  await fetchProduct()
  
  if (authStore.user) {
    deliveryAddress.value = (authStore.user as any).address || ''
    customerEmail.value = (authStore.user as any).email || ''
    customerPhone.value = (authStore.user as any).phone || (authStore.user as any).phoneNumber || ''
  }

  // Try to load from localStorage first for consistency with checkout
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('farmlink_checkout_address')
    if (saved) {
      try {
        const addr = JSON.parse(saved)
        deliveryAddress.value = typeof addr === 'object' ? `${addr.street || ''}, ${addr.city || ''}` : addr
      } catch (e) {
        deliveryAddress.value = saved
      }
    }
  }
})

const fetchProduct = async () => {
  loading.value = true
  try {
    const headers: any = {}
    if (authStore.accessToken) {
      headers.Authorization = `Bearer ${authStore.accessToken}`
    }

    const res = await $fetch(`${config.public.apiUrl}/products/${route.params.id}`, {
      headers
    }) as any
    
    // Handle potential data wrapper (some endpoints return { data: { ... } })
    const productData = res.data || res
    
    if (productData && typeof productData === 'object') {
      // Map properties consistently with other product pages
      product.value = {
        ...productData,
        // Ensure image is available under a consistent key
        image: productData.image || productData.thumbnailUrl || productData.imageUrl || productData.gallery?.[0],
        stockQuantity: productData.stock !== undefined ? Number(productData.stock) : Number(productData.stockQuantity || 0)
      }
    } else {
      product.value = null
    }
  } catch (err) {
    console.error('Failed to fetch product:', err)
    product.value = null
  } finally {
    loading.value = false
  }
}

const discountedPrice = computed(() => {
  if (!product.value) return '0.00'
  if (product.value.discount) {
    return (product.value.price * (1 - product.value.discount / 100)).toFixed(2)
  }
  return product.value.price.toFixed(2)
})

const subtotal = computed(() => {
  return Number(discountedPrice.value) * quantity.value
})

const total = computed(() => {
  return subtotal.value + deliveryFee.value
})

const incrementQty = () => {
  const max = product.value?.stockQuantity || 99
  if (quantity.value < max) {
    quantity.value++
  }
}

const decrementQty = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const validateForm = () => {
  let isValid = true
  errors.value.email = ''
  errors.value.phone = ''
  errors.value.address = ''

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!customerEmail.value || !customerEmail.value.trim()) {
    errors.value.email = 'Email address is required.'
    isValid = false
  } else if (!emailRegex.test(customerEmail.value.trim())) {
    errors.value.email = 'Please enter a valid email address.'
    isValid = false
  }

  const phoneRegex = /^[0-9+\s-]{8,15}$/
  if (!customerPhone.value || !customerPhone.value.trim()) {
    errors.value.phone = 'Phone number is required.'
    isValid = false
  } else if (!phoneRegex.test(customerPhone.value.trim())) {
    errors.value.phone = 'Please enter a valid phone number (8 to 15 digits).'
    isValid = false
  }

  if (!deliveryAddress.value || !deliveryAddress.value.trim()) {
    errors.value.address = 'Delivery address is required.'
    isValid = false
  } else if (deliveryAddress.value.trim().length < 8) {
    errors.value.address = 'Please enter a complete delivery address (at least 8 characters).'
    isValid = false
  }

  if (!isValid) {
    // Scroll the first invalid element into view and focus it
    setTimeout(() => {
      const firstErrorEl = document.querySelector('.input-error')
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
        if (firstErrorEl instanceof HTMLElement) {
          firstErrorEl.focus()
        }
      }
    }, 100)
  }

  return isValid
}

const handlePreorder = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  try {
    const token = authStore.accessToken || await getAccessToken()

    // Update user profile details (phone/address) if they have changed
    if (authStore.user) {
      const needsUpdate = 
        customerPhone.value !== (authStore.user as any).phone || 
        deliveryAddress.value !== (authStore.user as any).address

      if (needsUpdate) {
        try {
          const updateRes = await fetch(`${config.public.apiUrl}/users/profile`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
              firstName: authStore.user.firstName || '',
              lastName: authStore.user.lastName || '',
              phoneNumber: customerPhone.value,
              address: deliveryAddress.value
            })
          })
          if (updateRes.ok) {
            const updatedProfile = await updateRes.json()
            authStore.updateUserProfile({
              ...authStore.user,
              phoneNumber: updatedProfile.phoneNumber || customerPhone.value,
              address: updatedProfile.address || deliveryAddress.value
            } as any)
          }
        } catch (profileErr) {
          console.warn('Failed to auto-update profile contact info:', profileErr)
        }
      }
    }

    // Build standard backend order payload
    const orderPayload = {
      consumerId: authStore.user?.id,
      paymentMethod: 'cash_on_delivery',
      paymentStatus: 'unpaid',
      paymentRef: null,
      deliveryAddress: deliveryAddress.value,
      deliveryLat: 11.5564,
      deliveryLng: 104.9282,
      note: `Pre-order for ${product.value.name}. Contact phone: ${customerPhone.value}`,
      items: [
        {
          productId: product.value.id,
          farmerId: product.value.farmerId || product.value.farmer?.id || 'e1cb5bd7-98b7-4c75-ba7e-36c5332f1111',
          quantity: quantity.value,
          unitPrice: Number(discountedPrice.value)
        }
      ]
    }

    // Call orders endpoint directly with auth headers
    const res = await fetch(`${config.public.apiUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(orderPayload)
    })

    if (res.ok) {
      const data = await res.json()
      // Redirect to the order details page in purchase history
      router.push(`/user/settings/orders/${data.id}`)
    } else {
      const errorText = await res.text()
      console.error('Failed to place preorder:', errorText)
      let msg = 'Failed to place pre-order.'
      try {
        const errObj = JSON.parse(errorText)
        msg = errObj.message || msg
      } catch {}
      alert(msg)
    }
  } catch (err) {
    console.error('Preorder failed:', err)
    alert('Failed to place pre-order. Please check your connection and try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.preorder-page {
  min-height: 100vh;
  background-color: #fbf9f6;
  padding: 120px 24px 80px;
}

.preorder-container {
  max-width: 1100px;
  margin: 0 auto;
}

.header-section {
  margin-bottom: 32px;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  text-decoration: none;
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 12px;
  transition: color 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.back-link:hover {
  color: #154212;
}

.page-title {
  font-size: 42px;
  font-weight: 900;
  color: #154212;
  letter-spacing: -0.03em;
  font-family: 'Manrope', sans-serif;
}

.main-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 40px;
}

.card {
  background: white;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03);
  border: 1px solid #f1f5f9;
  margin-bottom: 24px;
}

.product-info-horizontal {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid #f1f5f9;
}

.product-image {
  width: 140px;
  height: 140px;
  border-radius: 20px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.product-meta {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.product-meta .category {
  font-size: 13px;
  color: #2e7d32;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}

.product-meta .name {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 12px;
  color: #111827;
  line-height: 1.2;
}

.price-block {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.price {
  font-size: 32px;
  font-weight: 900;
  color: #154212;
}

.original-price {
  text-decoration: line-through;
  color: #9ca3af;
  font-size: 18px;
  font-weight: 600;
}

.quantity-selector-block label {
  display: block;
  font-weight: 800;
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.selector {
  display: flex;
  align-items: center;
  gap: 20px;
  border: 2px solid #f1f5f9;
  border-radius: 16px;
  width: fit-content;
  padding: 6px;
  background: #f8fafc;
}

.selector button {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: none;
  background: white;
  color: #154212;
  cursor: pointer;
  font-size: 24px;
  font-weight: 600;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.selector button:hover:not(:disabled) {
  background: #154212;
  color: white;
  transform: translateY(-2px);
}

.selector button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.selector .qty {
  font-weight: 900;
  font-size: 20px;
  min-width: 30px;
  text-align: center;
  color: #154212;
}

.section-title {
  font-size: 20px;
  font-weight: 900;
  margin-bottom: 24px;
  color: #154212;
  font-family: 'Manrope', sans-serif;
}

.address-text {
  color: #4b5563;
  line-height: 1.8;
  margin-bottom: 20px;
  font-size: 15px;
  font-weight: 500;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-weight: 800;
  font-size: 13px;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-input {
  width: 100%;
  padding: 16px;
  border: 2px solid #f1f5f9;
  border-radius: 16px;
  font-family: inherit;
  font-size: 15px;
  transition: border-color 0.2s;
  background: #f8fafc;
}

.form-input:focus {
  outline: none;
  border-color: #2e7d32;
}

.address-textarea {
  width: 100%;
  padding: 16px;
  border: 2px solid #f1f5f9;
  border-radius: 16px;
  font-family: inherit;
  font-size: 15px;
  transition: border-color 0.2s;
  background: #f8fafc;
  resize: none;
}

.address-textarea:focus {
  outline: none;
  border-color: #2e7d32;
}

.form-actions {
  display: flex;
  gap: 12px;
}

.save-btn {
  background: #2e7d32;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
}

.cancel-btn {
  background: #f1f5f9;
  color: #64748b;
  border: none;
  padding: 10px 24px;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
}

.info-card {
  background: linear-gradient(135deg, #154212, #2e7d32);
  color: white;
}

.info-card .section-title {
  color: white;
}

.info-item {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  align-items: center;
}

.info-item .material-symbols-outlined {
  font-size: 28px;
  opacity: 0.9;
}

.info-item p {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
  opacity: 0.95;
}

.summary-rows .row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  color: #64748b;
  font-size: 15px;
  font-weight: 600;
}

.summary-rows .row.total {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 2px dashed #f1f5f9;
  color: #154212;
  font-weight: 900;
  font-size: 28px;
}

.preorder-btn {
  width: 100%;
  padding: 20px;
  border-radius: 20px;
  border: none;
  background: #154212;
  color: white;
  font-weight: 800;
  font-size: 18px;
  cursor: pointer;
  margin-top: 24px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-shadow: 0 10px 25px rgba(21, 66, 18, 0.2);
}

.preorder-btn:hover:not(:disabled) {
  background: #1b5e20;
  transform: translateY(-4px);
  box-shadow: 0 15px 30px rgba(21, 66, 18, 0.3);
}

.preorder-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.disclaimer {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 20px;
  text-align: center;
  line-height: 1.6;
  font-weight: 500;
}

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 160px 24px;
  text-align: center;
}

.large-icon {
  font-size: 80px;
  color: #cbd5e1;
  margin-bottom: 24px;
}

.error-state h2 {
  font-size: 32px;
  font-weight: 900;
  color: #1e293b;
  margin-bottom: 12px;
}

.error-state p {
  color: #64748b;
  margin-bottom: 32px;
  font-weight: 500;
}

.browse-btn {
  background: #154212;
  color: white;
  padding: 16px 40px;
  border-radius: 16px;
  text-decoration: none;
  font-weight: 800;
  transition: all 0.2s;
}

.browse-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(21, 66, 18, 0.2);
}

.spinner {
  width: 56px;
  height: 56px;
  border: 6px solid #f1f5f9;
  border-top: 6px solid #2e7d32;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 24px;
}

.spinner-small {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 992px) {
  .main-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .summary-column {
    position: static;
  }
}

@media (max-width: 640px) {
  .preorder-page {
    padding-top: 100px;
  }
  
  .page-title {
    font-size: 32px;
  }
  
  .product-info-horizontal {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .card {
    padding: 24px;
  }
}

.input-error {
  border-color: #ef4444 !important;
  background-color: #fef2f2 !important;
}

.input-error:focus {
  border-color: #dc2626 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
}

.error-message {
  color: #ef4444;
  font-size: 13px;
  font-weight: 600;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>