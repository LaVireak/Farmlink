import type { CartItem } from '@/types/card.type'

export const useCart = () => {
  const cart = useState<CartItem[]>('cart', () => [])

  const recommendations = [
    { id: 1, name: 'Wildflower Honey', farm: 'Busy Bee Apiaries', price: 18 },
    { id: 2, name: 'Pasture-Raised Eggs', farm: 'Cluck & Coop Farms', price: 8.5 },
    { id: 3, name: 'Rustic Sourdough', farm: 'The Daily Crumb', price: 9 },
    { id: 4, name: 'Organic Whole Milk', farm: 'Meadow Brook Dairy', price: 6.5 }
  ]

  // Load cart from localStorage on init
  onMounted(() => {
    const saved = localStorage.getItem('farmlink_cart')
    if (saved) {
      try {
        cart.value = JSON.parse(saved)
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

  const deliveryFee = 5

  const total = computed(() => subtotal.value + deliveryFee)

  const totalItems = computed(() =>
    cart.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  // Actions
  function addToCart(product: any, qty = 1) {
    const existingItem = cart.value.find(i => i.id === product.id)
    const resolvedImage =
      product.image ||
      product.thumbnailUrl ||
      product.thumbnail_url ||
      product.images?.[0]?.url ||
      ''

    if (existingItem) {
      existingItem.quantity += qty
      if (!existingItem.image && resolvedImage) {
        existingItem.image = resolvedImage
      }
    } else {
      cart.value.push({
        id: product.id,
        name: product.name,
        variant: product.variant || product.category || '',
        farm: product.farm || product.farmerName || (product.farmer ? (product.farmer.farmName || `${product.farmer.firstName} ${product.farmer.lastName}`) : ''),
        image: resolvedImage,
        price: product.price,
        quantity: qty,
        farmerId: product.farmerId || product.farmer?.id
      })
    }
  }

  function increase(id: number | string) {
    const item = cart.value.find(i => i.id === id)
    if (item) item.quantity++
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
    removeItem
  }
}
