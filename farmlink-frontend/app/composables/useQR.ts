type CreateQrResponse = {
  tranId: string;
  qrString: string;
  qrImage?: string;
  abapayDeeplink?: string;
  amount: number;
  currency: string;
  expiresAt: string;
};

type CheckStatusResponse = {
  paymentStatus: 'unpaid' | 'paid' | 'failed' | 'refunded';
  providerStatus?: string;
};

type HarvestItem = {
  id: number;
  name: string;
  qty: number;
  unitPrice: number;
  image: string;
};

export const useQR = () => {
  const config = useRuntimeConfig();
  const { cart, subtotal, deliveryFee, total } = useCart();
  const fallbackImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='10' fill='%23f3f4f6'/%3E%3Cpath d='M20 43l7-9 6 5 9-12 6 16H20z' fill='%23d1d5db'/%3E%3Ccircle cx='25' cy='23' r='4' fill='%23d1d5db'/%3E%3C/svg%3E";

  // Build harvest summary directly from cart items.
  const orderItems = computed<HarvestItem[]>(() => {
    return cart.value.map((item) => ({
      id: item.id,
      name: item.name,
      qty: Number(item.quantity) || 0,
      unitPrice: Number(item.price) || 0,
      image: item.image || fallbackImage,
    }));
  });

  const totalAmount = computed(() => total.value);
  const testAmount = totalAmount;

  const qrValue = ref('');
  const qrImage = ref('');
  const tranId = ref('');
  const deeplink = ref('');
  const paymentStatus = ref<'unpaid' | 'paid' | 'failed' | 'refunded'>('unpaid');
  const providerStatus = ref('PENDING');
  const isLoading = ref(false);
  const error = ref('');
  const expiresAt = ref<Date | null>(null);
  const hasGenerated = ref(false);

  const timeLeft = ref(0);
  let countdownTimer: ReturnType<typeof setInterval> | null = null;
  let pollTimer: ReturnType<typeof setInterval> | null = null;

  const formattedTime = computed(() => {
    if (!Number.isFinite(timeLeft.value)) return '0:00';
    const minutes = Math.floor(timeLeft.value / 60);
    const seconds = timeLeft.value % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  });

  const qrImageSrc = computed(() => {
    if (!qrImage.value) return '';
    return qrImage.value.startsWith('data:')
      ? qrImage.value
      : `data:image/png;base64,${qrImage.value}`;
  });

  const isExpired = computed(() => hasGenerated.value && Number.isFinite(timeLeft.value) && timeLeft.value <= 0 && !isLoading.value);

  const clearTimers = () => {
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }

    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  };

  const startCountdown = () => {
    clearTimers();

    if (!expiresAt.value || Number.isNaN(expiresAt.value.getTime())) {
      timeLeft.value = 0;
      return;
    }

    countdownTimer = setInterval(() => {
      if (!expiresAt.value) return;

      const seconds = Math.max(
        0,
        Math.floor((expiresAt.value.getTime() - Date.now()) / 1000),
      );

      timeLeft.value = seconds;

      if (seconds <= 0) {
        clearTimers();
      }
    }, 1000);
  };

  const checkStatus = async () => {
    if (!tranId.value || paymentStatus.value === 'paid') return;

    try {
      const data = await $fetch<CheckStatusResponse>(
        `${config.public.apiUrl}/orders/payments/payway/${tranId.value}/status`,
      );

      paymentStatus.value = data.paymentStatus;
      providerStatus.value = data.providerStatus || providerStatus.value;

      if (data.paymentStatus === 'paid' || data.paymentStatus === 'failed') {
        clearTimers();
      }
    } catch {
      // silent retry while polling
    }
  };

  const startPolling = () => {
    pollTimer = setInterval(checkStatus, 5000);
  };

  const createDynamicQr = async () => {
    isLoading.value = true;
    error.value = '';
    paymentStatus.value = 'unpaid';
    providerStatus.value = 'PENDING';
    qrValue.value = '';
    qrImage.value = '';
    tranId.value = '';
    deeplink.value = '';
    expiresAt.value = null;
    timeLeft.value = 0;

    // clear any existing timers before creating a new QR
    clearTimers();

    try {
      const data = await $fetch<CreateQrResponse>(
        `${config.public.apiUrl}/orders/payments/payway/qr/demo`,
        {
          method: 'POST',
          body: {
            amount: testAmount.value,
            currency: 'USD',
            lifetimeMinutes: 15,
          },
        },
      );

      qrValue.value = data.qrString;
      qrImage.value = data.qrImage || '';
      tranId.value = data.tranId;
      deeplink.value = data.abapayDeeplink || '';
      const parsedExpiresAt = new Date(data.expiresAt);
      expiresAt.value = Number.isNaN(parsedExpiresAt.getTime()) ? null : parsedExpiresAt;
      hasGenerated.value = true;

      startCountdown();
      // start polling after we have a tranId
      if (tranId.value) startPolling();
      await checkStatus();
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Unable to generate dynamic QR.';
    } finally {
      isLoading.value = false;
    }
  };

  const openAbaApp = () => {
    if (deeplink.value) {
      window.location.href = deeplink.value;
    }
  };

  onUnmounted(clearTimers);

  const steps = [
    'Open ABA Mobile or any KHQR-supported banking app',
    'Scan the dynamic QR code',
    'Confirm the exact payment amount',
    'Wait for automatic payment confirmation',
  ];


  return {
    testAmount,
    subtotal,
    deliveryFee,
    totalAmount,
    qrValue,
    qrImage,
    qrImageSrc,
    tranId,
    formattedTime,
    timeLeft,
    isExpired,
    isLoading,
    error,
    paymentStatus,
    providerStatus,
    steps,
    orderItems,
    createDynamicQr,
    checkStatus,
    openAbaApp,
  };
};