import type { CartItem } from '@/types/card.type'

export const useCart = () => {
  const cart = useState<CartItem[]>('cart', () => [])
  const triggerAnimation = useState<{ id: number; image: string; x: number; y: number } | null>('cart-animation-trigger', () => null)

  const recommendations = [
    { id: 1, name: 'Fresh Strawberries', farm: 'Sunny Berry Farm', price: 5.5, image: 'https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=200&h=160&fit=crop' },
    { id: 2, name: 'Organic Bananas', farm: 'Tropical Harvest Co.', price: 3.2, image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=200&h=160&fit=crop' },
    { id: 3, name: 'Green Apples', farm: 'Orchard Valley', price: 4.0, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=160&fit=crop' },
    { id: 4, name: 'Fresh Broccoli', farm: 'Green Earth Farms', price: 2.8, image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=200&h=160&fit=crop' }
  ]

  const config = useRuntimeConfig()

  async function validateCart() {
    if (cart.value.length === 0) return
    try {
      const products = await $fetch<any[]>(`${config.public.apiUrl}/products`)
      const validCart = cart.value.filter(item => {
        const prod = products.find(p => p.id === item.id)
        if (!prod) return false
        
        // Update price and stock in case they changed in backend
        item.price = Number(prod.pricePerUnit) || item.price
        const stockAvailable = prod.stockQuantity !== undefined 
          ? Number(prod.stockQuantity) 
          : (prod.stock !== undefined ? Number(prod.stock) : 9999)
        item.stock = stockAvailable
        if (item.quantity > stockAvailable) {
          item.quantity = stockAvailable
        }
        return item.quantity > 0
      })

      if (validCart.length !== cart.value.length || JSON.stringify(validCart) !== JSON.stringify(cart.value)) {
        cart.value = validCart
        localStorage.setItem('farmlink_cart', JSON.stringify(validCart))
      }
    } catch (e) {
      console.error('Failed to validate cart:', e)
    }
  }

  // Load cart from localStorage on init
  onMounted(async () => {
    const saved = localStorage.getItem('farmlink_cart')
    if (saved) {
      try {
        cart.value = JSON.parse(saved)
        await validateCart()
      } catch (e) {
        console.error('Failed to load cart from localStorage:', e)
        cart.value = []
      }
    }
  })

  // Save cart to localStorage whenever it changes
  watch(cart, (newCart) => {
    localStorage.setItem('farmlink_cart', JSON.stringify(newCart))
  }, { deep: true })

  // Computed
  const subtotal = computed(() =>
    cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  const deliveryFee = computed(() => cart.value.length > 0 ? 5 : 0)

  const total = computed(() => subtotal.value + deliveryFee.value)

  const totalItems = computed(() =>
    cart.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  // Actions
  function addToCart(product: any, qty = 1, event?: MouseEvent) {
    const existingItem = cart.value.find(i => i.id === product.id)
    const resolvedImage =
      product.image ||
      product.thumbnailUrl ||
      product.thumbnail_url ||
      product.images?.[0]?.url ||
      ''

    const stockAvailable = product.stockQuantity !== undefined 
      ? Number(product.stockQuantity) 
      : (product.stock !== undefined ? Number(product.stock) : 9999)

    if (existingItem) {
      if (existingItem.quantity + qty > stockAvailable) {
        qty = stockAvailable - existingItem.quantity
      }
      if (qty <= 0) return

      existingItem.quantity += qty
      existingItem.stock = stockAvailable
      if (!existingItem.image && resolvedImage) {
        existingItem.image = resolvedImage
      }
    } else {
      if (qty > stockAvailable) {
        qty = stockAvailable
      }
      if (qty <= 0) return

      cart.value.push({
        id: product.id,
        name: product.name,
        variant: product.variant || product.category || '',
        farm: product.farm || product.farmerName || (product.farmer ? (product.farmer.farmName || `${product.farmer.firstName} ${product.farmer.lastName}`) : ''),
        image: resolvedImage,
        price: product.price,
        quantity: qty,
        farmerId: product.farmerId || product.farmer?.id,
        stock: stockAvailable
      })
    }

    if (event) {
      triggerAnimation.value = {
        id: Date.now() + Math.random(),
        image: resolvedImage || '/assets/images/placeholder.png',
        x: event.clientX,
        y: event.clientY
      }
    }
  }

  function increase(id: number | string) {
    const item = cart.value.find(i => i.id === id)
    if (item) {
      const maxStock = item.stock !== undefined ? Number(item.stock) : 9999
      if (item.quantity < maxStock) {
        item.quantity++
      }
    }
  }

  function decrease(id: number | string) {
    const item = cart.value.find(i => i.id === id)
    if (item && item.quantity > 1) item.quantity--
  }

  function removeItem(id: number | string) {
    cart.value = cart.value.filter(i => i.id !== id)
  }

  return {
    cart,
    recommendations,
    subtotal,
    deliveryFee,
    total,
    totalItems,
    addToCart,
    increase,
    decrease,
    removeItem,
    triggerAnimation,
    validateCart
  }
}
