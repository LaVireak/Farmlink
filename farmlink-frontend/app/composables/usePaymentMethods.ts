import { ref, readonly } from 'vue';
import { getAccessToken } from '../services/auth.service';

export interface SavedCard {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  billingName: string | null;
  isDefault: boolean;
}

const _cards = ref<SavedCard[]>([]);
const _isLoading = ref(false);
const _error = ref<string | null>(null);

async function apiFetch<T>(
  apiBase: string,
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getAccessToken();
  const res = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data?.message || `Request failed with status ${res.status}`);
  }
  return data as T;
}

function mapPaymentMethod(
  pm: any,
  defaultId: string | null,
): SavedCard {
  return {
    id: pm.id,
    brand: pm.card?.brand ?? 'unknown',
    last4: pm.card?.last4 ?? '****',
    expMonth: pm.card?.exp_month ?? 0,
    expYear: pm.card?.exp_year ?? 0,
    billingName: pm.billing_details?.name ?? null,
    isDefault: pm.id === defaultId,
  };
}

export const usePaymentMethods = () => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiUrl;

  const fetchPaymentMethods = async () => {
    _isLoading.value = true;
    _error.value = null;
    try {
      const data = await apiFetch<{
        paymentMethods: any[];
        defaultPaymentMethodId: string | null;
      }>(apiBase, '/stripe/payment-methods');

      _cards.value = data.paymentMethods.map((pm) =>
        mapPaymentMethod(pm, data.defaultPaymentMethodId),
      );
    } catch (e: any) {
      _error.value = e.message || 'Failed to load payment methods.';
    } finally {
      _isLoading.value = false;
    }
  };

  const addPaymentMethod = async (
    paymentMethodId: string,
    setDefault = false,
  ): Promise<void> => {
    await apiFetch<any>(apiBase, '/stripe/payment-methods', {
      method: 'POST',
      body: JSON.stringify({ paymentMethodId, setDefault }),
    });
    // Re-fetch to get updated list with correct default info
    await fetchPaymentMethods();
  };

  const removePaymentMethod = async (paymentMethodId: string): Promise<void> => {
    await apiFetch(apiBase, `/stripe/payment-methods/${paymentMethodId}`, {
      method: 'DELETE',
    });
    _cards.value = _cards.value.filter((c) => c.id !== paymentMethodId);
  };

  const setDefaultPaymentMethod = async (
    paymentMethodId: string,
  ): Promise<void> => {
    await apiFetch(apiBase, `/stripe/payment-methods/${paymentMethodId}/default`, {
      method: 'PATCH',
    });
    _cards.value = _cards.value.map((c) => ({
      ...c,
      isDefault: c.id === paymentMethodId,
    }));
  };

  const updatePaymentMethodName = async (
    paymentMethodId: string,
    name: string,
  ): Promise<void> => {
    await apiFetch(apiBase, `/stripe/payment-methods/${paymentMethodId}`, {
      method: 'PATCH',
      body: JSON.stringify({ name }),
    });
    _cards.value = _cards.value.map((c) =>
      c.id === paymentMethodId ? { ...c, billingName: name } : c,
    );
  };

  /** Returns the card matching the given id (from the in-memory list) */
  const getCardById = (id: string): SavedCard | undefined =>
    _cards.value.find((c) => c.id === id);

  return {
    cards: readonly(_cards),
    isLoading: readonly(_isLoading),
    error: readonly(_error),
    fetchPaymentMethods,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    updatePaymentMethodName,
    getCardById,
  };
};
