<template>
  <NuxtLink :to="`/user/products/${product.id}`" class="product-card">
    <!-- BADGE -->
    <span v-if="product.badge" :class="['card-badge', badgeClass]">
      {{ product.badge }}
    </span>

    <!-- IMAGE -->
    <div class="card-image-wrap">
      <img :src="product.image" :alt="product.name" loading="lazy" />
      
      <!-- HOVER ACTIONS -->
      <div class="card-hover-actions">
        <button :class="['action-btn', 'save-btn', { 'is-saved': isSaved }]" @click.prevent="handleSave" aria-label="Save product">
          <svg width="20" height="20" viewBox="0 0 24 24" :fill="isSaved ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <button class="action-btn add-btn" @click.prevent="$emit('add-to-cart', product)" aria-label="Add to cart">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
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
        
        <button class="card-add-btn" @click.prevent="$emit('add-to-cart', product)" aria-label="Add to cart">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
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
  background: #f8f8f6;
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: transform 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              box-shadow 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(0,0,0,0.10), 0 4px 10px rgba(0,0,0,0.06);
}

/* BADGE */
.card-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
  padding: 4px 10px;
  border-radius: 5px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.badge-sale {
  background: #fee2e2;
  color: #b91c1c;
}

.badge-new {
  background: #dbeafe;
  color: #1d4ed8;
}

.badge-best {
  background: #fef3c7;
  color: #b45309;
}

.badge-default {
  background: #dcfce7;
  color: #15803d;
}

/* IMAGE */
.card-image-wrap {
  position: relative;
  overflow: hidden;
}

.card-image-wrap img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
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
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: white;
  color: #1b1c1a;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: scale(1.1);
}

.save-btn:hover, .save-btn.is-saved {
  color: #ef4444;
}

.add-btn:hover {
  background: #2e7e3f;
  color: white;
}

/* BODY */
.card-body {
  padding: 12px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.card-category {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #2e7e3f;
}

.card-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.25;
  color: #1b1c1a;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* RATING */
.card-rating {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 2px;
}

.stars {
  display: flex;
  gap: 1px;
  font-size: 12px;
  line-height: 1;
}

.star-filled {
  color: #f59e0b;
}

.star-empty {
  color: #d1d5db;
}

.rating-text {
  font-size: 11px;
  color: #6b7280;
  font-weight: 500;
}

/* PRICE */
.card-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
}

.card-prices {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.card-price {
  font-size: 18px;
  font-weight: 800;
  color: #1f6a35;
}

.card-original-price {
  font-size: 12px;
  color: #9ca3af;
  text-decoration: line-through;
}

.card-discount-tag {
  font-size: 10px;
  font-weight: 700;
  color: #dc2626;
  background: #fef2f2;
  padding: 1px 5px;
  border-radius: 4px;
}

.card-add-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: #2e7e3f;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.2s;
  flex-shrink: 0;
}

.card-add-btn:hover {
  background: #589866;
  color: #fff;
  transform: scale(1.1);
}

</style>
