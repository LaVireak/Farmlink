<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRuntimeConfig } from '#app';
import { useAuthStore } from '~/stores/auth.store';
import { getAccessToken } from '~/services/auth.service';

definePageMeta({
	middleware: 'user',
	layout: 'user',
});

const route = useRoute();
const config = useRuntimeConfig();
const authStore = useAuthStore();
const orderId = (route.params.id as string);

const order = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchOrder = async () => {
  loading.value = true;
  error.value = null;
  try {
    const token = await getAccessToken();
    const res = await fetch(`${config.public.apiUrl}/orders/${orderId}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) throw new Error(`Failed to load order (${res.status})`);
    const data = await res.json();
    order.value = data;
  } catch (err: any) {
    error.value = err.message || 'Something went wrong';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchOrder);

useHead({
	title: computed(() => order.value ? `Order #${order.value.orderNumber} | FarmLink Cambodia` : 'Order Details | FarmLink Cambodia'),
});

const isTransit = computed(() => {
  if (!order.value) return false;
  return ['pending', 'confirmed', 'preparing', 'in_delivery'].includes(order.value.status);
});

const isCancelled = computed(() => {
  if (!order.value) return false;
  return ['cancelled', 'disputed'].includes(order.value.status);
});

const orderDate = computed(() => {
  if (!order.value) return '';
  return new Date(order.value.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
});

const orderItems = computed(() => {
  if (!order.value || !order.value.items) return [];
  const fallbackImage = 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&q=80';
  return order.value.items.map((item: any) => ({
    id: item.id,
    name: item.product?.nameEn || 'Fresh Crop',
    desc: item.product?.category || 'Crop',
    price: Number(item.unitPrice).toFixed(2),
    qty: item.quantity,
    image: item.product?.thumbnailUrl || fallbackImage,
    description: item.product?.description || 'Freshly harvested crop from local Cambodian farms.',
    province: item.farmer?.province || 'Cambodia',
  }));
});

// ─── Tracking Animation State ───────────────────────────────────────────────
const TRACKING_STEPS = [
  { key: 'pending',     label: 'Order Placed',      icon: 'receipt_long',    desc: 'Your order has been received and is awaiting confirmation.' },
  { key: 'confirmed',   label: 'Farm Confirmed',     icon: 'agriculture',     desc: 'The farm has accepted your order and is beginning harvest.' },
  { key: 'preparing',  label: 'Packing Harvest',    icon: 'inventory_2',     desc: 'Your produce is being harvested, cleaned, and packed fresh.' },
  { key: 'in_delivery',label: 'Out for Delivery',   icon: 'local_shipping',  desc: 'A community driver has picked up your order and is on the way.' },
  { key: 'completed',  label: 'Delivered',          icon: 'task_alt',        desc: 'Your order has been delivered. Enjoy your fresh harvest!' },
];

const STATUS_STEP_INDEX: Record<string, number> = {
  pending: 0,
  confirmed: 1,
  preparing: 2,
  in_delivery: 3,
  completed: 4,
};

const currentStepIndex = computed(() => {
  if (!order.value) return 0;
  return STATUS_STEP_INDEX[order.value.status] ?? 0;
});

// Truck progress: % along the road from 0–100
const truckProgress = ref(5);
let progressTimer: ReturnType<typeof setInterval>;

// ETA countdown (purely decorative based on status)
const etaLabel = computed(() => {
  const s = order.value?.status;
  if (s === 'pending') return 'Estimating ETA...';
  if (s === 'confirmed') return 'ETA ~45 min';
  if (s === 'preparing') return 'ETA ~25 min';
  if (s === 'in_delivery') return 'ETA ~10 min';
  if (s === 'completed') return 'Delivered ✓';
  return '';
});

// Pulse animation for the truck position dot
const pulseCount = ref(0);
let pulseTimer: ReturnType<typeof setInterval>;
onMounted(() => {
  pulseTimer = setInterval(() => { pulseCount.value++; }, 1000);
  
  progressTimer = setInterval(() => {
    truckProgress.value += 0.15; // Controls the speed of the truck
    if (truckProgress.value > 100) {
      truckProgress.value = 5; // Reset back to start
    }
  }, 16); // 60fps
});

onUnmounted(() => {
  clearInterval(pulseTimer);
  clearInterval(progressTimer);
});
</script>

<template>
  <div v-if="loading" class="min-h-screen flex items-center justify-center bg-[#fbf9f6] text-[#154212] font-sans">
    <div class="text-center">
      <div class="w-12 h-12 border-4 border-[#154212] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p class="font-bold">Loading order details...</p>
    </div>
  </div>
  
  <div v-else-if="error" class="min-h-screen flex items-center justify-center bg-[#fbf9f6] text-red-600 font-sans">
    <div class="text-center p-8 bg-white rounded-3xl shadow-sm border border-red-100 max-w-md mx-4">
      <span class="material-symbols-outlined text-5xl mb-4">error</span>
      <h2 class="text-xl font-bold mb-2">Failed to load order</h2>
      <p class="text-sm text-zinc-500 mb-6">{{ error }}</p>
      <NuxtLink to="/user/settings/PurchaseHistory" class="px-6 py-2.5 bg-[#154212] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#006e1c] transition-colors no-underline">Back to Orders</NuxtLink>
    </div>
  </div>

	<div v-else class="min-h-screen flex flex-col bg-[#fbf9f6] text-zinc-900 font-sans">
		<CommonAppHeader />

		<main class="max-w-7xl mx-auto w-full pt-28 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8 flex-1">
			<div class="flex flex-col md:flex-row gap-8 md:gap-10">
				<CommonAppSidebar active="purchaseHistory" />

				<div class="flex-1 min-w-0">
					<!-- Breadcrumbs -->
					<div class="flex items-center gap-2 text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em] mb-8">
						<NuxtLink to="/user/settings/PurchaseHistory" class="hover:text-[#154212] transition-colors">Orders</NuxtLink>
						<span class="material-symbols-outlined text-[14px]">chevron_right</span>
						<span class="text-[#154212]">Order Details</span>
					</div>

					<!-- Header Section -->
					<div class="mb-10">
						<div class="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
							<div>
								<h1 class="text-4xl sm:text-5xl font-black font-[Manrope,sans-serif] text-[#154212] tracking-tighter leading-none mb-2">Order #{{ order.orderNumber }}</h1>
								<p class="text-zinc-500 font-medium">
									Placed on {{ orderDate }} •
									<span class="text-[#154212] font-bold">{{ order.items?.[0]?.farmer?.farmName || 'Local Farm' }}</span>
								</p>
							</div>

							<div v-if="isTransit" class="flex flex-col items-start xl:items-end">
								<span class="bg-[#ffdcbe] text-[#2c1600] px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest flex items-center gap-2 uppercase">
									<span class="material-symbols-outlined text-sm fill-1">local_shipping</span>
									IN-TRANSIT
								</span>
								<p class="text-xs text-zinc-400 mt-2 font-bold uppercase tracking-wide">
									Status: <span class="text-[#154212]">{{ order.status.toUpperCase() }}</span>
								</p>
							</div>

							<div v-else-if="isCancelled">
								<span class="bg-red-50 text-red-700 border border-red-100 px-5 py-2 rounded-full text-[10px] font-black tracking-widest flex items-center gap-2 uppercase">
									<span class="material-symbols-outlined text-sm">cancel</span>
									Cancelled
								</span>
							</div>

							<div v-else>
								<span class="bg-[#e9f5db] text-[#2d6a4f] px-5 py-2 rounded-full text-[10px] font-black tracking-widest flex items-center gap-2 uppercase">
									<span class="material-symbols-outlined text-sm">check_circle</span>
									Completed
								</span>
							</div>
						</div>
					</div>

					<!-- CANCELLED LAYOUT -->
					<div v-if="isCancelled" class="grid grid-cols-1 xl:grid-cols-12 gap-8">
						<div class="xl:col-span-8 flex flex-col gap-8">
							<!-- Order Summary -->
							<div class="bg-white rounded-2xl p-8 border border-zinc-100 shadow-sm">
								<h3 class="font-[Manrope,sans-serif] font-black text-[#154212] mb-8 uppercase tracking-widest text-xs">Order Summary</h3>
								<div class="space-y-10">
									<div v-for="item in orderItems" :key="item.id" class="flex flex-col sm:flex-row gap-6 sm:items-center">
										<div class="w-24 h-24 rounded-2xl overflow-hidden bg-zinc-50 shrink-0 grayscale opacity-70 border border-zinc-100">
											<img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
										</div>
										<div class="flex-1">
											<h4 class="text-lg font-black font-[Manrope,sans-serif] text-[#154212] tracking-tight">{{ item.name }}</h4>
											<p class="text-xs text-zinc-400 font-medium mt-1">{{ item.desc }}</p>
											<p class="text-sm font-black text-[#563000] mt-2">${{ item.price }}</p>
										</div>
										<div class="text-right">
											<p class="text-[10px] text-zinc-300 font-black uppercase tracking-widest">Qty: {{ item.qty }}</p>
										</div>
									</div>
								</div>

								<!-- Refund Breakdown -->
								<div class="mt-12 pt-8 border-t border-zinc-50 bg-zinc-50/30 -mx-8 -mb-8 px-8 pb-8 rounded-b-2xl">
									<div class="space-y-3 max-w-md ml-auto">
										<div class="flex justify-between text-xs font-bold text-zinc-400 uppercase tracking-widest">
											<span>Subtotal</span>
											<span class="text-[#154212] font-black">${{ Number(order.subtotal).toFixed(2) }}</span>
										</div>
										<div class="flex justify-between text-xs font-bold text-zinc-400 uppercase tracking-widest">
											<span>Shipping</span>
											<span class="text-[#154212] font-black">${{ Number(order.deliveryFee).toFixed(2) }}</span>
										</div>
										<div class="h-px bg-zinc-200 my-4"></div>
										<div class="flex justify-between items-center">
											<span class="text-sm font-black font-[Manrope,sans-serif] text-[#154212] uppercase tracking-widest">Total Refunded</span>
											<span class="text-3xl font-black font-[Manrope,sans-serif] text-[#154212] tracking-tighter">${{ Number(order.totalAmount).toFixed(2) }}</span>
										</div>
									</div>
								</div>
							</div>

							<!-- Reason for Cancellation -->
							<div class="bg-red-50/30 p-8 rounded-2xl border-l-4 border-red-200 flex gap-5">
								<span class="material-symbols-outlined text-red-400">info</span>
								<div class="space-y-3">
									<h4 class="font-black font-[Manrope,sans-serif] text-[#154212] uppercase tracking-wide text-sm">Reason for Cancellation / Dispute</h4>
									<p class="text-xs text-zinc-500 leading-relaxed font-medium">
										{{ order.disputeReason || 'The order was cancelled. A full refund has been issued to your original payment method.' }}
									</p>
								</div>
							</div>
						</div>

						<!-- Right Column -->
						<div class="xl:col-span-4 flex flex-col gap-6">
							<!-- Help Card -->
							<div class="bg-[#154212] p-8 rounded-3xl text-white relative overflow-hidden group shadow-xl shadow-[#154212]/10">
								<h3 class="font-[Manrope,sans-serif] font-black text-xl mb-4 tracking-tight relative z-10">Need Help?</h3>
								<p class="text-xs opacity-70 mb-8 leading-relaxed font-medium uppercase tracking-wider relative z-10">
									Our farm-to-table support team is available 24/7 to help with refunds or rescheduling your harvest order.
								</p>
								<NuxtLink to="/user/settings/chat" class="w-full bg-white text-[#154212] py-4 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-100 transition-all relative z-10 no-underline">
									<span class="material-symbols-outlined text-lg">chat_bubble</span>
									Contact Support
								</NuxtLink>
								<span class="material-symbols-outlined absolute top-2 right-2 text-7xl text-white opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform">support_agent</span>
							</div>

							<!-- Delivery Details -->
							<div class="bg-white rounded-2xl p-6 border border-zinc-100">
								<h3 class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-5">Delivery Address</h3>
								<div class="flex gap-4">
									<span class="material-symbols-outlined text-zinc-300">location_on</span>
									<div class="text-xs text-zinc-500 font-medium space-y-1">
										<p class="font-black text-[#154212]">{{ authStore.user?.firstName }} {{ authStore.user?.lastName }}</p>
										<p>{{ order.deliveryAddress }}</p>
									</div>
								</div>
							</div>

							<!-- Refund Method -->
							<div class="bg-zinc-100/50 p-6 rounded-2xl border border-zinc-100">
								<h3 class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-5">Refund Method</h3>
								<div class="flex items-center gap-4">
									<div class="bg-white p-2 rounded-lg border border-zinc-100 shadow-sm">
										<span class="material-symbols-outlined text-zinc-400">credit_card</span>
									</div>
									<div class="text-xs">
										<p class="font-black text-[#154212]">{{ order.paymentMethod === 'stripe' ? 'Visa Card' : order.paymentMethod === 'aba_qr' ? 'ABA PayWay' : 'Refund Balance' }}</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- IN-TRANSIT LAYOUT -->
					<div v-else-if="isTransit" class="grid grid-cols-1 xl:grid-cols-12 gap-8">
						<!-- Left Column: Animated Tracking -->
						<div class="xl:col-span-8 flex flex-col gap-8">
							<!-- Live Tracking Card with Animated Route -->
							<div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-zinc-100">
								<div class="p-5 border-b border-zinc-50 flex justify-between items-center">
									<div class="flex items-center gap-3">
										<h3 class="font-[Manrope,sans-serif] font-black text-lg text-[#154212]">Live Tracking</h3>
										<span class="inline-flex items-center gap-1.5 bg-[#94f990]/50 text-[#006e1c] text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
											<span class="w-1.5 h-1.5 rounded-full bg-[#006e1c] animate-pulse"></span>
											Live
										</span>
									</div>
									<div class="text-right">
										<p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">ETA</p>
										<p class="text-sm font-black text-[#154212]">{{ etaLabel }}</p>
									</div>
								</div>

								<!-- Animated Route Map -->
								<div class="relative p-6 bg-gradient-to-br from-[#f0faf0] to-[#e8f5e9] min-h-[280px] overflow-hidden">
									<!-- Decorative grid -->
									<div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(#0a4d1e 0.8px, transparent 0.8px); background-size: 24px 24px;"></div>

									<!-- Road SVG path -->
									<svg class="absolute inset-0 w-full h-full" viewBox="0 0 800 280" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
										<!-- Road shadow -->
										<path d="M 60 220 Q 180 180, 280 150 Q 380 120, 460 130 Q 560 140, 660 100 Q 720 80, 750 70" stroke="#c8d5c8" stroke-width="28" fill="none" stroke-linecap="round"/>
										<!-- Road base -->
										<path d="M 60 220 Q 180 180, 280 150 Q 380 120, 460 130 Q 560 140, 660 100 Q 720 80, 750 70" stroke="#d4e8d4" stroke-width="22" fill="none" stroke-linecap="round"/>
										<!-- Road dashes -->
										<path d="M 60 220 Q 180 180, 280 150 Q 380 120, 460 130 Q 560 140, 660 100 Q 720 80, 750 70" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-dasharray="20 28" opacity="0.6"/>
									</svg>

									<!-- Farm origin marker -->
									<div class="absolute bottom-12 left-8 flex flex-col items-center gap-1">
										<div class="bg-[#154212] text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg shadow-[#154212]/30">
											<span class="material-symbols-outlined text-base fill-1">storefront</span>
										</div>
										<div class="bg-white/90 backdrop-blur-sm text-[9px] font-black text-[#154212] px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wide whitespace-nowrap">Farm Origin</div>
									</div>

									<!-- Destination marker -->
									<div class="absolute top-6 right-8 flex flex-col items-center gap-1">
										<div class="bg-[#563000] text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg shadow-[#563000]/30" :class="{ 'animate-bounce': truckProgress >= 95 }">
											<span class="material-symbols-outlined text-base fill-1">home</span>
										</div>
										<div class="bg-white/90 backdrop-blur-sm text-[9px] font-black text-[#563000] px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wide whitespace-nowrap">Your Door</div>
									</div>

									<!-- Animated Truck -->
									<div
										class="truck-container absolute"
										:style="{ '--progress': truckProgress + '%' }"
									>
										<div class="truck-bubble bg-[#154212] text-white rounded-2xl px-3 py-2 shadow-xl shadow-[#154212]/30 flex items-center gap-2 relative">
											<span class="material-symbols-outlined text-xl fill-1">local_shipping</span>
											<div>
												<p class="text-[8px] font-black uppercase tracking-widest text-green-300">Driver</p>
												<p class="text-[11px] font-black leading-tight">Sovan M.</p>
											</div>
											<!-- Pointer -->
											<div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#154212] rotate-45 rounded-sm"></div>
										</div>
										<!-- Pulse rings -->
										<div class="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center justify-center">
											<div class="w-5 h-5 rounded-full bg-[#154212]/20 animate-ping absolute"></div>
											<div class="w-3 h-3 rounded-full bg-[#154212] relative z-10"></div>
										</div>
									</div>

									<!-- ETA badge floating -->
									<div class="absolute bottom-4 right-1/3 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-lg border border-zinc-100 flex items-center gap-2">
										<span class="material-symbols-outlined text-[#006e1c] text-base">timer</span>
										<div>
											<p class="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Estimated Arrival</p>
											<p class="text-sm font-black text-[#154212]">{{ etaLabel }}</p>
										</div>
									</div>
								</div>
							</div>


							<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
								<div class="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
									<div class="flex items-center gap-3 mb-4">
										<div class="w-10 h-10 rounded-xl bg-[#94f990] flex items-center justify-center text-[#002204]">
											<span class="material-symbols-outlined fill-1">package_2</span>
										</div>
										<h3 class="font-[Manrope,sans-serif] font-black text-[#154212] uppercase tracking-wide text-sm">Harvested & Packed</h3>
									</div>
									<p class="text-xs text-zinc-500 leading-relaxed font-medium">Your produce was hand-picked and temperature-controlled within 2 hours.</p>
									<div class="mt-4">
										<span class="bg-[#006e1c]/10 text-[#006e1c] text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest">Certified Organic</span>
									</div>
								</div>
								<div class="bg-zinc-100/50 p-6 rounded-2xl border border-zinc-100 relative overflow-hidden group">
									<div class="flex items-center gap-3 mb-4">
										<div class="w-10 h-10 rounded-xl bg-[#154212] flex items-center justify-center text-white">
											<span class="material-symbols-outlined">location_on</span>
										</div>
										<h3 class="font-[Manrope,sans-serif] font-black text-[#154212] uppercase tracking-wide text-sm">Destination</h3>
									</div>
									<div class="text-xs text-zinc-500 font-medium space-y-1">
										<p class="font-black text-[#154212] text-sm">{{ authStore.user?.firstName }} {{ authStore.user?.lastName }}</p>
										<p>{{ order.deliveryAddress }}</p>
									</div>
									<span class="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl text-[#154212] opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">home</span>
								</div>
							</div>
						</div>
						<div class="xl:col-span-4 flex flex-col gap-6">
							<div class="bg-[#154212] bg-gradient-to-br from-[#154212] to-[#2d5a27] p-8 rounded-3xl shadow-xl text-white">
								<h3 class="font-[Manrope,sans-serif] font-black text-xl mb-3 tracking-tight">Delivery Support</h3>
								<p class="text-xs opacity-70 mb-8 leading-relaxed font-medium uppercase tracking-wider">Need to coordinate the drop-off or change delivery instructions?</p>
								<div class="flex flex-col gap-3">
									<NuxtLink to="/user/settings/chat" class="w-full bg-white text-[#154212] py-4 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-100 transition-colors shadow-lg shadow-black/10 no-underline"><span class="material-symbols-outlined text-lg">call</span>Contact Driver</NuxtLink>
								</div>
							</div>
							<div class="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm">
								<h3 class="font-[Manrope,sans-serif] font-black text-[#154212] mb-6 uppercase tracking-widest text-xs">Basket Summary</h3>
								<div class="space-y-6">
									<div v-for="item in orderItems" :key="item.id" class="flex items-center gap-4">
										<div class="w-14 h-14 rounded-xl overflow-hidden bg-zinc-50 flex-shrink-0 shadow-inner">
											<img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
										</div>
										<div class="flex-1 min-w-0">
											<div class="text-[11px] font-black text-[#154212] uppercase tracking-tight truncate">{{ item.name }}</div>
											<div class="text-[10px] text-zinc-400 font-medium tracking-wide truncate">{{ item.desc }}</div>
										</div>
										<div class="text-sm font-black text-[#154212] tracking-tighter">${{ item.price }}</div>
									</div>
								</div>
								<div class="mt-8 pt-6 border-t border-zinc-50 space-y-3">
									<div class="flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest">
										<span>Subtotal</span>
										<span class="text-[#154212]">${{ Number(order.subtotal).toFixed(2) }}</span>
									</div>
									<div class="flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest">
										<span>Delivery Fee</span>
										<span class="text-[#154212]">${{ Number(order.deliveryFee).toFixed(2) }}</span>
									</div>
									<div class="flex justify-between items-center pt-3">
										<span class="font-[Manrope,sans-serif] font-black text-[#154212] text-sm uppercase tracking-widest">Total</span>
										<span class="text-2xl font-black text-[#563000] tracking-tighter">${{ Number(order.totalAmount).toFixed(2) }}</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- COMPLETED LAYOUT -->
					<div v-else>
						<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
							<div class="bg-zinc-100 p-8 rounded-2xl flex flex-col justify-between min-h-[160px] border border-zinc-200/50">
								<span class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Delivery Address</span>
								<div>
									<p class="font-black text-[#154212]">{{ authStore.user?.firstName }} {{ authStore.user?.lastName }}</p>
									<p class="text-zinc-500 text-sm font-medium">{{ order.deliveryAddress }}</p>
								</div>
							</div>
							<div class="bg-zinc-50 p-8 rounded-2xl flex flex-col justify-between min-h-[160px] border border-zinc-100">
								<span class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Payment Method</span>
								<div class="flex items-center gap-3">
									<span class="material-symbols-outlined text-[#154212]">credit_card</span>
									<p class="font-black text-[#154212]">{{ order.paymentMethod === 'stripe' ? 'Visa Card' : order.paymentMethod === 'aba_qr' ? 'ABA PayWay' : 'Cash on Delivery' }}</p>
								</div>
							</div>
							<div class="bg-[#154212] text-white p-8 rounded-2xl flex flex-col justify-between min-h-[160px] shadow-xl shadow-[#154212]/20">
								<span class="text-[10px] font-black text-white/40 uppercase tracking-widest">Order Summary</span>
								<div class="flex items-baseline gap-2">
									<span class="text-4xl font-black font-[Manrope,sans-serif] tracking-tighter">${{ Number(order.totalAmount).toFixed(2) }}</span>
									<span class="text-white/60 text-xs font-bold uppercase tracking-widest">USD Total</span>
								</div>
							</div>
						</div>
						<section class="space-y-10">
							<div class="flex items-center justify-between border-b border-zinc-100 pb-5">
								<h2 class="text-2xl sm:text-3xl font-black font-[Manrope,sans-serif] text-[#154212] tracking-tight">Basket Contents</h2>
								<span class="text-xs font-black text-zinc-300 uppercase tracking-widest">{{ orderItems.length }} Items</span>
							</div>
							<div class="space-y-12 sm:space-y-16">
								<div v-for="item in orderItems" :key="item.id" class="flex flex-col lg:flex-row gap-8 items-start group">
									<div class="w-full lg:w-48 h-48 bg-zinc-50 rounded-2xl overflow-hidden shrink-0 shadow-inner">
										<img :src="item.image" :alt="item.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
									</div>
									<div class="flex-1 space-y-4">
										<div class="flex flex-col sm:flex-row justify-between items-start gap-4">
											<div>
												<div class="inline-flex items-center px-3 py-1 bg-[#94f990] text-[#002204] text-[9px] font-black uppercase tracking-widest rounded-full mb-3">{{ item.province }}</div>
												<h3 class="text-xl sm:text-2xl font-black font-[Manrope,sans-serif] text-[#154212] tracking-tight">{{ item.name }}</h3>
												<p class="text-zinc-500 text-sm font-medium max-w-xl mt-2 leading-relaxed">{{ item.description }}</p>
											</div>
											<div class="text-left sm:text-right shrink-0">
												<p class="text-xl font-black text-[#154212] tracking-tighter">${{ item.price }}</p>
												<p class="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-1">Qty: {{ item.qty }}</p>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="mt-20 pt-10 border-t border-zinc-100">
								<div class="flex flex-col lg:flex-row justify-between gap-12">
									<div class="flex-1 bg-zinc-50/50 p-8 rounded-2xl border border-zinc-100">
										<div class="flex items-start gap-4 text-[#006e1c]">
											<span class="material-symbols-outlined scale-125 pt-0.5">eco</span>
											<div>
												<h4 class="font-black font-[Manrope,sans-serif] text-[#154212] mb-1.5 uppercase tracking-wide text-sm">Environmental Impact</h4>
												<p class="text-xs text-zinc-500 leading-relaxed font-medium">This order supported small-scale farming families and prevented carbon emissions compared to standard retail logistics.</p>
											</div>
										</div>
									</div>
									<div class="w-full lg:w-80 space-y-4">
										<div class="flex justify-between items-center text-xs font-bold text-zinc-400 uppercase tracking-widest"><span>Subtotal</span><span class="text-[#154212]">${{ Number(order.subtotal).toFixed(2) }}</span></div>
										<div class="flex justify-between items-center text-xs font-bold text-zinc-400 uppercase tracking-widest"><span>Logistics</span><span class="text-[#154212]">${{ Number(order.deliveryFee).toFixed(2) }}</span></div>
										<div class="h-px bg-zinc-100 my-2"></div>
										<div class="flex justify-between items-center"><span class="text-lg font-black font-[Manrope,sans-serif] text-[#154212] uppercase tracking-tight">Order Total</span><span class="text-3xl font-black font-[Manrope,sans-serif] text-[#154212] tracking-tighter">${{ Number(order.totalAmount).toFixed(2) }}</span></div>
									</div>
								</div>
							</div>
						</section>
					</div>
				</div>
			</div>
		</main>

		<CommonAppFooter />
	</div>
</template>

<style scoped>
.material-symbols-outlined {
	font-variation-settings: 'FILL' 0, 'wght' 600, 'GRAD' 0, 'opsz' 24;
}
.fill-1 {
	font-variation-settings: 'FILL' 1, 'wght' 600, 'GRAD' 0, 'opsz' 24;
}

/* ─── Animated Route Progress ──────────────────────────────────────── */
.route-progress {
  transition: stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ─── Animated Truck Bubble ─────────────────────────────────────────── */
.truck-container {
  /* Position along the curved route using CSS trick:
     We use a mix of left/bottom offsets mapped to truckProgress */
  bottom: calc(12% + var(--progress, 5%) * 0.6);
  left: calc(4% + var(--progress, 5%) * 0.86);
  transform: translate(-50%, -100%);
  transition: left 1.5s cubic-bezier(0.4, 0, 0.2, 1),
              bottom 1.5s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
}

.truck-bubble {
  animation: truckBob 2.5s ease-in-out infinite;
}

@keyframes truckBob {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-4px); }
}
</style>
