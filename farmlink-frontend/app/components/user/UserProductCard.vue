<template>
  <NuxtLink :to="`/user/products/${product.id}`" class="product-card">
    <!-- BADGE -->
    <span v-if="product.badge" :class="['card-badge', badgeClass]">
      {{ product.badge }}
    </span>

    <!-- IMAGE -->
    <div class="card-image-wrap">
      <img :src="product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80'" :alt="product.name" loading="lazy" />
      
      <!-- HOVER ACTIONS -->
      <div class="card-hover-actions">
        <button :class="['action-btn', 'save-btn', { 'is-saved': isSaved }]" @click.prevent="handleSave" aria-label="Save product">
          <svg width="20" height="20" viewBox="0 0 24 24" :fill="isSaved ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- INFO -->
    <div class="card-body">
      <span class="card-category">{{ product.category }}</span>

      <h3 class="card-title">{{ product.name }}</h3>

      <!-- RATING -->
      <div class="card-rating">
        <span class="stars">
          <span v-for="i in 5" :key="i" :class="i <= Math.round(product.rating || 0) ? 'star-filled' : 'star-empty'">★</span>
        </span>
        <span class="rating-text">{{ (product.rating || 0).toFixed(1) }}</span>
      </div>

      <!-- PRICE -->
      <div class="card-price-row">
        <div class="card-prices">
          <span class="card-price">${{ discountedPrice }}</span>
          <span v-if="product.discount" class="card-original-price">${{ product.price.toFixed(2) }}</span>
          <span v-if="product.discount" class="card-discount-tag">-{{ product.discount }}%</span>
        </div>
        
        <button v-if="(product.stock !== undefined ? product.stock : product.stockQuantity) > 0" class="card-add-btn" @click.prevent="$emit('add-to-cart', product, $event)" aria-label="Add to cart">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
        <span v-else class="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded-lg">
          Sold Out
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['add-to-cart', 'save-product'])

const isSaved = ref(false)

const handleSave = () => {
  isSaved.value = !isSaved.value
  emit('save-product', props.product)
}

const discountedPrice = computed(() => {
  if (props.product.discount) {
    return (props.product.price * (1 - props.product.discount / 100)).toFixed(2)
  }
  return props.product.price.toFixed(2)
})

const badgeClass = computed(() => {
  const badge = (props.product.badge || '').toLowerCase()
  if (badge === 'sale') return 'badge-sale'
  if (badge === 'new') return 'badge-new'
  if (badge === 'best seller') return 'badge-best'
  return 'badge-default'
})
</script>
<style scoped>
.product-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  border: 1px solid rgba(19, 42, 19, 0.05);
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  box-shadow: 0 10px 30px rgba(13, 40, 24, 0.02);
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(13, 40, 24, 0.06);
  border-color: rgba(45, 106, 79, 0.12);
}

/* BADGE */
.card-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  padding: 4px 10px;
  border-radius: 8px;
  font-family: 'Manrope', sans-serif;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border: 1px solid transparent;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.badge-sale {
  background: #fee2e2;
  color: #b91c1c;
  border-color: rgba(185, 28, 28, 0.12);
}

.badge-new {
  background: #dbeafe;
  color: #1d4ed8;
  border-color: rgba(29, 78, 216, 0.12);
}

.badge-best {
  background: #FFF7DA;
  color: #b78a00;
  border-color: rgba(183, 138, 0, 0.15);
}

.badge-default {
  background: #e9f5db;
  color: #2d6a4f;
  border-color: rgba(45, 106, 79, 0.12);
}

.card-image-wrap {
  position: relative;
  overflow: hidden;
  border-radius: 20px 20px 0 0;
}

.card-image-wrap img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
}

.product-card:hover .card-image-wrap img {
  transform: scale(1.05);
}

/* HOVER ACTIONS */
.card-hover-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  transform: translateX(20px);
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  z-index: 10;
}

.product-card:hover .card-hover-actions {
  opacity: 1;
  transform: translateX(0);
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: white;
  color: #132a13;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: scale(1.1);
}

.save-btn:hover, .save-btn.is-saved {
  color: #ef4444;
}

.card-body {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.card-category {
  font-family: 'Manrope', sans-serif;
  font-size: 0.55rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: #e9f5db;
  color: #2d6a4f;
  padding: 3px 8px;
  border-radius: 5px;
  width: max-content;
}

.card-title {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: 0.95rem;
  font-weight: 800;
  line-height: 1.3;
  color: #132a13;
  transition: color 0.3s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-card:hover .card-title {
  color: #2d6a4f;
}

.card-rating {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 2px;
}

.stars {
  display: flex;
  gap: 1px;
  font-size: 0.72rem;
  line-height: 1;
  color: #ffc107;
}

.rating-text {
  font-family: 'Manrope', sans-serif;
  font-size: 0.72rem;
  color: #5c6f5c;
  font-weight: 700;
}

.card-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  border-top: 1px solid rgba(19, 42, 19, 0.06);
  padding-top: 12px;
}

.card-prices {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.card-price {
  font-family: 'Manrope', sans-serif;
  font-size: 1.15rem;
  font-weight: 900;
  color: #1f7a2e;
}

.card-original-price {
  font-size: 0.8rem;
  color: #9ca3af;
  text-decoration: line-through;
}

.card-discount-tag {
  font-family: 'Manrope', sans-serif;
  font-size: 0.65rem;
  font-weight: 800;
  color: #dc2626;
  background: #fef2f2;
  padding: 2px 6px;
  border-radius: 6px;
}

.card-add-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 10px;
  background: rgba(45, 106, 79, 0.06);
  border: 1px solid rgba(45, 106, 79, 0.12);
  color: #2d6a4f;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1);
  flex-shrink: 0;
}

.card-add-btn:hover {
  background: linear-gradient(135deg, #2d6a4f, #1b4332);
  border-color: #1b4332;
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(45, 106, 79, 0.18);
}
</style>
