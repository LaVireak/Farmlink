export const useFavorites = () => {
  const STORAGE_KEY = 'farmlink_favorites'

  const favorites = useState<any[]>('favorites', () => [])
  const favoriteAnimationTrigger = useState<{ id: number; image: string; x: number; y: number } | null>('favorite-animation-trigger', () => null)

  const favoriteIds = computed(() => new Set(favorites.value.map((item) => item.id)))
  const totalFavorites = computed(() => favorites.value.length)

  function isFavorite(id: number | string) {
    return favoriteIds.value.has(id)
  }

  function saveFavorites() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.value))
    } catch (e) {
      console.error('Failed to save favorites:', e)
    }
  }

  function loadFavorites() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        favorites.value = JSON.parse(saved)
      }
    } catch (e) {
      console.error('Failed to load favorites:', e)
      favorites.value = []
    }
  }

  onMounted(() => {
    loadFavorites()
  })

  watch(
    favorites,
    (value) => {
      saveFavorites()
    },
    { deep: true }
  )

  function triggerFavoriteAnimation(product: any, event?: MouseEvent) {
    if (!event || !product) return

    const resolvedImage =
      product.image ||
      product.thumbnailUrl ||
      product.thumbnail_url ||
      product.images?.[0]?.url ||
      '/assets/images/placeholder.png'

    favoriteAnimationTrigger.value = {
      id: Date.now() + Math.random(),
      image: resolvedImage,
      x: event.clientX,
      y: event.clientY
    }
  }

  function addFavorite(product: any, event?: MouseEvent) {
    if (!product || product.id === undefined || product.id === null) return
    if (isFavorite(product.id)) return

    favorites.value.push({ ...product })
    triggerFavoriteAnimation(product, event)
  }

  function removeFavorite(id: number | string) {
    favorites.value = favorites.value.filter((item) => item.id !== id)
  }

  function toggleFavorite(product: any, event?: MouseEvent) {
    if (!product || product.id === undefined || product.id === null) return
    if (isFavorite(product.id)) {
      removeFavorite(product.id)
    } else {
      addFavorite(product, event)
    }
  }

  function clearFavorites() {
    favorites.value = []
  }

  return {
    favorites,
    favoriteIds,
    totalFavorites,
    favoriteAnimationTrigger,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
    triggerFavoriteAnimation
  }
}
