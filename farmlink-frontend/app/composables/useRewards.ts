import { onMounted, watch, ref } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { getAccessToken } from '../services/auth.service';

export const useRewards = () => {
  const POINTS_PER_DOLLAR = 0.2 // 1 point per $5 = 0.2 points per dollar
  const STORAGE_KEY = 'farmlink_reward_points'
  const config = useRuntimeConfig();
  const auth = useAuthStore();

  const rewardPoints = useState<number>('rewardPoints', () => 0)
  const isSyncing = ref(false)

  // Fetch reward points from backend if authenticated, otherwise use localStorage
  const loadPoints = async () => {
    if (!auth.hydrated) {
      await auth.hydrate()
    }

    if (auth.isAuthenticated) {
      isSyncing.value = true
      try {
        const token = await getAccessToken();
        const response = await fetch(`${config.public.apiUrl}/rewards/balance`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (response.ok) {
          const data = await response.json();
          rewardPoints.value = data.pointsBalance || 0;
          return;
        }
      } catch (e) {
        console.error('Failed to fetch reward balance from backend:', e);
      } finally {
        isSyncing.value = false;
      }
    }

    // Fallback to localStorage
    if (import.meta.client) {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          rewardPoints.value = parseInt(saved, 10)
        } catch (e) {
          console.error('Failed to load reward points from localStorage:', e)
          rewardPoints.value = 0
        }
      } else {
        rewardPoints.value = 0;
      }
    }
  };

  // Watch authentication status changes
  watch(() => auth.isAuthenticated, () => {
    void loadPoints();
  });

  onMounted(() => {
    void loadPoints();
  });

  // Save reward points to localStorage if guest (keep local storage in sync as a fallback)
  watch(rewardPoints, (newPoints) => {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, String(newPoints))
    }
  })

  // Award points based on purchase amount
  async function awardPoints(amount: number) {
    if (!auth.hydrated) {
      await auth.hydrate()
    }

    const pointsEarned = Math.floor(amount * POINTS_PER_DOLLAR);

    if (auth.isAuthenticated) {
      isSyncing.value = true;
      try {
        const token = await getAccessToken();
        const response = await fetch(`${config.public.apiUrl}/rewards/add-points`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ amount }),
        });
        if (response.ok) {
          const data = await response.json();
          rewardPoints.value = data.pointsBalance || 0;
          return pointsEarned;
        }
      } catch (e) {
        console.error('Failed to add points on backend:', e);
      } finally {
        isSyncing.value = false;
      }
    }

    // Fallback/Guest local update
    rewardPoints.value += pointsEarned;
    return pointsEarned;
  }

  // Get current reward points
  function getPoints() {
    return rewardPoints.value
  }

  // Reset points (for admin/testing only)
  function resetPoints() {
    rewardPoints.value = 0
  }

  // Redeem points
  async function redeemPoints(points: number, description?: string) {
    if (!auth.hydrated) {
      await auth.hydrate()
    }

    if (auth.isAuthenticated) {
      isSyncing.value = true;
      try {
        const token = await getAccessToken();
        const response = await fetch(`${config.public.apiUrl}/rewards/redeem-points`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ points, description }),
        });
        if (response.ok) {
          const data = await response.json();
          rewardPoints.value = data.pointsBalance || 0;
          return true;
        } else {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || 'Failed to redeem points');
        }
      } catch (e: any) {
        console.error('Failed to redeem points on backend:', e);
        throw e;
      } finally {
        isSyncing.value = false;
      }
    } else {
      // Fallback/Guest local update
      if (rewardPoints.value < points) {
        throw new Error('Insufficient points balance');
      }
      rewardPoints.value -= points;
      return true;
    }
  }

  return {
    rewardPoints,
    awardPoints,
    redeemPoints,
    getPoints,
    resetPoints,
    isSyncing,
    POINTS_PER_DOLLAR
  }
}

