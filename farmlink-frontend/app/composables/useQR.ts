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

export const useQR = () => {
  const config = useRuntimeConfig();
  // sample order items (used for order summary and to compute QR amount)
  const orderItems = [
    {
      name: 'Heirloom Tomatoes',
      qty: 1.5,
      unitPrice: 4.5,
      image:
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=200',
    },
    {
      name: 'Organic Curly Kale',
      qty: 2,
      unitPrice: 3,
      image:
        'https://images.unsplash.com/photo-1524179524541-10d54f5903da?auto=format&fit=crop&q=80&w=200',
    },
    {
      name: 'Baby Dutch Carrots',
      qty: 1,
      unitPrice: 4.25,
      image:
        'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=200',
    },
  ];

  // compute the total amount based on order items so QR matches shown total
  const testAmount = computed(() => {
    return orderItems.reduce((sum, it) => sum + (Number(it.qty) || 0) * (Number(it.unitPrice) || 0), 0);
  });

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