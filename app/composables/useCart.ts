import type { CartItem } from '@/types/card.type'

export const useCart = () => {

const cart = useState<CartItem[]>('cart', () => [
  {
    id: 1,
    name: 'Heirloom Tomatoes',
    variant: '1kg Basket',
    farm: 'Green Valley Farms',
    price: 12.5,
    quantity: 2
  },
  {
    id: 2,
    name: 'Organic Curly Kale',
    variant: 'Fresh Bunch',
    farm: 'Roots & Stem',
    price: 4.2,
    quantity: 1
  },
  {
    id: 3,
    name: 'Earth-Grown Carrots',
    variant: '500g Bunch',
    farm: 'Sunny Patch Organics',
    price: 3.8,
    quantity: 3
  }
])

const recommendations = [
  { id: 1, name: 'Wildflower Honey', farm: 'Busy Bee Apiaries', price: 18 },
  { id: 2, name: 'Pasture-Raised Eggs', farm: 'Cluck & Coop Farms', price: 8.5 },
  { id: 3, name: 'Rustic Sourdough', farm: 'The Daily Crumb', price: 9 },
  { id: 4, name: 'Organic Whole Milk', farm: 'Meadow Brook Dairy', price: 6.5 }
]

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
function increase(id: number) {
  const item = cart.value.find(i => i.id === id)
  if (item) item.quantity++
}

function decrease(id: number) {
  const item = cart.value.find(i => i.id === id)
  if (item && item.quantity > 1) item.quantity--
}

function removeItem(id: number) {
  cart.value = cart.value.filter(i => i.id !== id)
}


return {
  cart,
  recommendations,
  subtotal,
  deliveryFee,
  total,
  totalItems,
  increase,
  decrease,
  removeItem
}
}
