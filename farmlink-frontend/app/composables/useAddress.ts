/**
 * useAddress
 * ──────────────────────────────────────────────────────────────────────────────
 * Shared composable for reading and updating the authenticated user's address
 * from the backend (PATCH /users/profile).
 *
 * The backend stores ONE address per user with the following fields:
 *   - province, district, commune  (cascading location)
 *   - address                      (street / house number)
 *   - phoneNumber                  (recipient phone)
 *   - firstName / lastName         (recipient name)
 */

import { ref, computed } from 'vue';
import { useAuthStore } from '~/stores/auth.store';

export interface UserAddress {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  province: string;
  district: string;
  commune: string;
  address: string;   // street + house number
}

export function useAddress() {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();
  const API = (import.meta.env.VITE_API_BASE_URL || config.public?.apiUrl || 'http://localhost:3001/api') as string;

  const addressData = ref<UserAddress>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    province: '',
    district: '',
    commune: '',
    address: '',
  });

  const loading = ref(false);
  const saving = ref(false);
  const error = ref<string | null>(null);

  /** True if the user has at least a province set */
  const hasAddress = computed(() => Boolean(addressData.value.province || addressData.value.address));

  /** Full formatted display address */
  const fullAddress = computed(() => {
    const parts = [
      addressData.value.address,
      addressData.value.commune,
      addressData.value.district,
      addressData.value.province,
    ].filter(Boolean);
    return parts.join(', ');
  });

  const recipientName = computed(() => {
    const name = `${addressData.value.firstName} ${addressData.value.lastName}`.trim();
    return name || authStore.user?.email || '';
  });

  function authHeaders(json = false): Record<string, string> {
    const h: Record<string, string> = {
      Authorization: `Bearer ${authStore.accessToken}`,
    };
    if (json) h['Content-Type'] = 'application/json';
    return h;
  }

  async function fetchAddress() {
    if (!authStore.accessToken) return;
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(`${API}/users/profile`, { headers: authHeaders() });
      if (!res.ok) throw new Error('Failed to fetch profile');
      const raw = await res.json();
      const data = raw?.data ?? raw;

      addressData.value = {
        firstName:   data.firstName   ?? authStore.user?.firstName ?? '',
        lastName:    data.lastName    ?? authStore.user?.lastName  ?? '',
        phoneNumber: data.phoneNumber ?? '',
        province:    data.province    ?? '',
        district:    data.district    ?? '',
        commune:     data.commune     ?? '',
        address:     data.address     ?? '',
      };
    } catch (e: any) {
      error.value = e.message || 'Unknown error';
    } finally {
      loading.value = false;
    }
  }

  async function saveAddress(patch: Partial<UserAddress>): Promise<boolean> {
    if (!authStore.accessToken) return false;
    saving.value = true;
    error.value = null;
    try {
      const body: Record<string, string> = {};
      if (patch.firstName   !== undefined) body.firstName   = patch.firstName;
      if (patch.lastName    !== undefined) body.lastName    = patch.lastName;
      if (patch.phoneNumber !== undefined) body.phoneNumber = patch.phoneNumber;
      if (patch.province    !== undefined) body.province    = patch.province;
      if (patch.district    !== undefined) body.district    = patch.district;
      if (patch.commune     !== undefined) body.commune     = patch.commune;
      if (patch.address     !== undefined) body.address     = patch.address;

      const res = await fetch(`${API}/users/profile`, {
        method: 'PATCH',
        headers: authHeaders(true),
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.message || 'Failed to save address');
      }
      const raw = await res.json();
      const data = raw?.data ?? raw;

      // Merge saved data back
      addressData.value = {
        firstName:   data.firstName   ?? addressData.value.firstName,
        lastName:    data.lastName    ?? addressData.value.lastName,
        phoneNumber: data.phoneNumber ?? addressData.value.phoneNumber,
        province:    data.province    ?? addressData.value.province,
        district:    data.district    ?? addressData.value.district,
        commune:     data.commune     ?? addressData.value.commune,
        address:     data.address     ?? addressData.value.address,
      };

      // Sync auth store
      authStore.updateUserProfile({
        firstName: addressData.value.firstName,
        lastName: addressData.value.lastName,
      } as any);

      return true;
    } catch (e: any) {
      error.value = e.message || 'Unknown error';
      return false;
    } finally {
      saving.value = false;
    }
  }

  async function deleteAddress(): Promise<boolean> {
    return saveAddress({
      address: '',
      province: '',
      district: '',
      commune: '',
      phoneNumber: '',
    });
  }

  return {
    addressData,
    loading,
    saving,
    error,
    hasAddress,
    fullAddress,
    recipientName,
    fetchAddress,
    saveAddress,
    deleteAddress,
  };
}
