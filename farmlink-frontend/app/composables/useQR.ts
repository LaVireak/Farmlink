
export const useQR = () => {  
// QR Data
const qrValue = ref('farmlink-merchant-fl-2024-x9-amount-21.00')

// Timer Logic
const timeLeft = ref(899) // 14:59 in seconds
let timer: ReturnType<typeof setInterval> | null = null

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

onMounted(() => {
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(timer!)
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// UI Content
const steps = [
  'Open your mobile banking app',
  'Scan the QR code above',
  'Confirm payment amount',
  'Click "I Have Paid" button below'
]

const orderItems = [
  {
    name: 'Heirloom Tomatoes',
    qty: 1.5,
    unitPrice: 4.50,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=200'
  },
  {
    name: 'Organic Curly Kale',
    qty: 2,
    unitPrice: 3.00,
    image: 'https://images.unsplash.com/photo-1524179524541-10d54f5903da?auto=format&fit=crop&q=80&w=200'
  },
  {
    name: 'Baby Dutch Carrots',
    qty: 1,
    unitPrice: 4.25,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=200'
  }
]
return {
  qrValue,
  formattedTime,
  steps,
  orderItems
}
}