<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth.store';
import { getAccessToken } from '~/services/auth.service';

definePageMeta({
	middleware: 'user',
	layout: 'user',
});

useHead({
	title: 'Purchase History | FarmLink Cambodia',
});

// ─── Types ────────────────────────────────────────────────────────────────────
interface OrderItem {
	id: string;
	productId: string;
	farmerId: string;
	quantity: number;
	unitPrice: number;
	subtotal: number;
	product?: { id: string; nameEn: string; unit: string; thumbnailUrl?: string };
	farmer?: { id: string; farmName: string };
}

interface OrderResponse {
	id: string;
	orderNumber: string;
	status: string;
	paymentMethod: string;
	paymentStatus: string;
	subtotal: number;
	deliveryFee: number;
	totalAmount: number;
	deliveryAddress?: string;
	note?: string;
	createdAt: string;
	consumerId: string;
	items: OrderItem[];
}

interface NormalizedOrder {
	id: string;
	orderNumber: string;
	farmName: string;
	productName: string;
	date: string;
	items: number;
	total: string;
	status: 'Completed' | 'In-Transit' | 'Cancelled' | 'Pending';
	image: string;
	progress?: string;
	updateText?: string;
	rawStatus: string;
}

// ─── Status Mapping ───────────────────────────────────────────────────────────
const IN_TRANSIT_STATUSES = ['pending', 'confirmed', 'preparing', 'in_delivery'];

function mapStatus(raw: string): NormalizedOrder['status'] {
	if (raw === 'completed') return 'Completed';
	if (raw === 'cancelled' || raw === 'disputed') return 'Cancelled';
	if (IN_TRANSIT_STATUSES.includes(raw)) return 'In-Transit';
	return 'Pending';
}

const PROGRESS_MAP: Record<string, string> = {
	pending:     'w-[10%]',
	confirmed:   'w-[35%]',
	preparing:   'w-[60%]',
	in_delivery: 'w-[85%]',
};

const STATUS_TEXT_MAP: Record<string, string> = {
	pending:     'Your order has been placed and is awaiting confirmation from the farm.',
	confirmed:   'Great news! The farm has confirmed your order and is getting it ready.',
	preparing:   'Your fresh produce is being carefully harvested and packed for you.',
	in_delivery: 'Your order is on its way! A community driver is bringing it to your door.',
};

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&q=80';

function normalizeOrder(o: OrderResponse): NormalizedOrder {
	const firstItem = o.items?.[0];
	const farmName = firstItem?.farmer?.farmName ?? 'Local Farm';
	const productName = firstItem?.product?.nameEn ?? 'Farm Product';
	const image = firstItem?.product?.thumbnailUrl ?? FALLBACK_IMAGE;
	const status = mapStatus(o.status);
	const date = new Date(o.createdAt).toLocaleDateString('en-US', {
		year: 'numeric', month: 'long', day: 'numeric',
	});

	return {
		id: o.id,
		orderNumber: o.orderNumber,
		farmName,
		productName,
		date,
		items: o.items?.length ?? 0,
		total: Number(o.totalAmount).toFixed(2),
		status,
		image,
		rawStatus: o.status,
		progress: PROGRESS_MAP[o.status],
		updateText: STATUS_TEXT_MAP[o.status],
	};
}

// ─── State ────────────────────────────────────────────────────────────────────
const authStore = useAuthStore();
const currentTab = ref('All');
const tabs = ['All', 'Completed', 'In-Transit', 'Cancelled'];

const allOrders = ref<NormalizedOrder[]>([]);
const loading = ref(false);
const loadingMore = ref(false);
const error = ref<string | null>(null);
const currentPage = ref(1);
const totalPages = ref(1);
const PAGE_SIZE = 10;

// ─── Fetch ────────────────────────────────────────────────────────────────────
async function fetchOrders(page = 1, append = false) {
	const consumerId = authStore.user?.id;
	if (!consumerId) return;

	if (append) loadingMore.value = true;
	else { loading.value = true; error.value = null; }

const config = useRuntimeConfig();
	try {
		const token = await getAccessToken();
		const res = await fetch(
			`${config.public.apiUrl}/orders/consumer/${consumerId}?page=${page}&limit=${PAGE_SIZE}`,
			{
				headers: {
					'Content-Type': 'application/json',
					...(token ? { Authorization: `Bearer ${token}` } : {}),
				},
			},
		);

		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			throw new Error(err?.message || `Failed to load orders (${res.status})`);
		}

		const data = await res.json();
		const normalized: NormalizedOrder[] = (data.data ?? []).map(normalizeOrder);

		if (append) {
			allOrders.value = [...allOrders.value, ...normalized];
		} else {
			allOrders.value = normalized;
		}

		currentPage.value = data.page ?? page;
		totalPages.value = data.totalPages ?? 1;
	} catch (e: any) {
		error.value = e.message || 'Something went wrong.';
	} finally {
		loading.value = false;
		loadingMore.value = false;
	}
}

async function loadMore() {
	if (currentPage.value < totalPages.value) {
		await fetchOrders(currentPage.value + 1, true);
	}
}

const route = useRoute();

onMounted(() => {
	if (route.query.tab) {
		currentTab.value = route.query.tab as string;
	}
	fetchOrders(1);
});

// ─── Filtered View ────────────────────────────────────────────────────────────
const filteredOrders = computed<NormalizedOrder[]>(() => {
	if (currentTab.value === 'All') return allOrders.value;
	return allOrders.value.filter((o) => o.status === currentTab.value);
});

const hasMore = computed(() => currentPage.value < totalPages.value);
</script>

<template>
	<div class="min-h-screen flex flex-col bg-[#fbf9f6] text-zinc-900">
		<CommonAppHeader />

		<main class="max-w-[1550px] mx-auto w-full pt-16 sm:pt-16 pb-16 px-4 sm:px-16 lg:px-8 flex-1">
			<div class="flex flex-col md:flex-row gap-8 md:gap-10">
				<CommonAppSidebar active="purchaseHistory" />

				<div class="flex-1 min-w-0">
					<header class="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
						<div>
							<span class="text-xs font-bold tracking-[0.2em] text-[#006e1c] uppercase mb-2 block font-[Inter,sans-serif]">
								{{ currentTab === 'In-Transit' ? 'TRACKING YOUR GOODS' : 'ACCOUNT OVERVIEW' }}
							</span>
							<h1 class="text-4xl sm:text-5xl font-extrabold text-[#154212] font-[Manrope,sans-serif] tracking-tight">
								{{ currentTab === 'In-Transit' ? 'Active Shipments' : 'Purchase History' }}
							</h1>
							<p v-if="currentTab !== 'In-Transit'" class="text-zinc-500 mt-4 max-w-2xl leading-relaxed font-medium">
								Track your recent orders from local Cambodian farms and manage your harvest subscriptions.
							</p>
						</div>

						<div class="inline-flex p-1 bg-zinc-100 rounded-xl overflow-hidden shadow-sm w-fit shrink-0">
							<button
								v-for="tab in tabs"
								:key="tab"
								@click="currentTab = tab"
								:class="[
									'px-4 sm:px-6 py-2 text-sm transition-all font-[Inter,sans-serif]',
									currentTab === tab ? 'bg-white text-[#154212] font-bold rounded-lg shadow-sm' : 'font-semibold text-zinc-500 hover:text-[#154212]',
								]"
							>
								{{ tab }}
							</button>
						</div>
					</header>

					<!-- Loading skeletons -->
					<div v-if="loading" class="flex flex-col gap-6 sm:gap-8">
						<div v-for="n in 3" :key="n" class="bg-white rounded-2xl p-5 sm:p-6 border border-zinc-100 shadow-sm animate-pulse flex gap-5">
							<div class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-zinc-100 shrink-0"></div>
							<div class="flex-1 space-y-3">
								<div class="h-3 bg-zinc-100 rounded w-1/3"></div>
								<div class="h-5 bg-zinc-100 rounded w-2/3"></div>
								<div class="h-3 bg-zinc-100 rounded w-1/2"></div>
							</div>
						</div>
					</div>

					<!-- Error state -->
					<div v-else-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
						<span class="material-symbols-outlined text-red-400 text-4xl">error_outline</span>
						<p class="text-red-600 font-semibold mt-3">{{ error }}</p>
						<button @click="fetchOrders(1)" class="mt-4 px-6 py-2 bg-[#154212] text-white rounded-xl text-sm font-bold hover:bg-[#006e1c] transition-all">
							Try again
						</button>
					</div>

					<div v-else class="flex flex-col gap-6 sm:gap-8">
						<template v-if="currentTab === 'In-Transit'">
							<!-- Detailed tracking cards for In-Transit tab -->
							<article
								v-for="order in filteredOrders"
								:key="order.id"
								class="bg-white rounded-2xl p-5 sm:p-6 border border-zinc-100 shadow-sm transition-all hover:shadow-lg group"
							>
								<div class="flex flex-col xl:flex-row gap-6 sm:gap-8">
									<div class="w-full xl:w-40 h-40 bg-zinc-50 rounded-xl overflow-hidden shadow-inner shrink-0">
										<img
											:src="order.image"
											:alt="order.productName"
											class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
										/>
									</div>

									<div class="flex-1 space-y-4 sm:space-y-5">
										<div class="flex flex-wrap items-start justify-between gap-4">
											<div>
												<div class="flex flex-wrap items-center gap-3 mb-1">
													<h3 class="text-xl font-extrabold font-[Manrope,sans-serif] text-[#154212] tracking-tight">
														{{ order.productName }}
													</h3>
													<span class="bg-[#94f990] text-[#002204] px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase">
														{{ order.farmName }}
													</span>
												</div>
												<p class="text-zinc-400 text-[11px] font-bold tracking-wide uppercase">Order #{{ order.orderNumber }} • Placed {{ order.date }}</p>
											</div>
											<div class="text-left sm:text-right">
												<p class="text-2xl font-black font-[Manrope,sans-serif] text-[#563000] tracking-tighter">${{ order.total }}</p>
												<div class="flex items-center gap-2 text-[#006e1c] mt-0.5">
													<span class="material-symbols-outlined text-[16px] fill-1">local_shipping</span>
													<span class="text-[10px] font-black uppercase tracking-wider">IN-TRANSIT</span>
												</div>
											</div>
										</div>

										<div class="h-px bg-zinc-100 w-full"></div>

										<div class="space-y-3">
											<div class="flex justify-between items-center text-[9px] font-black text-zinc-400 uppercase tracking-widest">
												<span>Harvested</span>
												<span class="text-[#006e1c]">En Route</span>
												<span class="opacity-30">Delivered</span>
											</div>
											<div class="relative h-2 bg-zinc-100 rounded-full overflow-hidden">
												<div
													:class="order.progress"
													class="absolute top-0 left-0 h-full bg-gradient-to-r from-[#154212] to-[#006e1c] rounded-full transition-all duration-1000"
												></div>
											</div>
											<p class="text-[13px] text-zinc-500 italic leading-relaxed">"{{ order.updateText }}"</p>
										</div>

										<div class="flex flex-wrap gap-3 pt-1">
											<NuxtLink
												:to="'/user/settings/orders/' + order.id"
												class="px-6 py-2.5 border-2 border-zinc-100 text-[#154212] rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-[#154212] transition-all flex items-center"
											>
												View Receipt
											</NuxtLink>
										</div>
									</div>
								</div>
							</article>
						</template>

						<template v-else>
							<!-- Compact horizontal cards for All, Completed, Cancelled tabs -->
							<article
								v-for="order in filteredOrders"
								:key="order.id"
								:class="[
									'bg-white rounded-2xl p-5 sm:p-6 border border-zinc-100 shadow-sm transition-all hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 group',
									order.status === 'Cancelled' ? 'opacity-70 grayscale-[0.5]' : '',
								]"
							>
								<div class="flex items-center gap-5">
									<div class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-zinc-50 overflow-hidden shrink-0 shadow-inner">
										<img :src="order.image" :alt="order.farmName" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
									</div>
									<div>
										<div class="flex items-center gap-2 mb-1.5">
											<span
												:class="[
													'text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider',
													order.status === 'Completed' ? 'bg-[#94f990] text-[#002204]' : '',
													order.status === 'In-Transit' ? 'bg-[#ffdcbe] text-[#2c1600]' : '',
													order.status === 'Cancelled' ? 'bg-zinc-100 text-zinc-500' : '',
												]"
											>
												{{ order.status }}
											</span>
											<span class="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Order #{{ order.orderNumber }}</span>
										</div>
										<h3 class="text-lg font-extrabold text-[#154212] font-[Manrope,sans-serif] leading-tight mb-1">{{ order.farmName }}</h3>
										<p class="text-xs text-zinc-500 font-medium tracking-wide uppercase">{{ order.date }} • {{ order.items }} items</p>
									</div>
								</div>

								<div class="flex items-center justify-between md:justify-end md:gap-12 pt-4 md:pt-0 border-t md:border-t-0 border-zinc-50">
									<div class="text-right">
										<p class="text-[10px] text-zinc-400 font-black uppercase tracking-widest mb-1">Total Amount</p>
										<p class="text-2xl font-black text-[#563000] tracking-tighter" :class="order.status === 'Cancelled' ? 'text-zinc-400' : ''">
											${{ order.total }}
										</p>
									</div>
									<NuxtLink
										:to="'/user/settings/orders/' + order.id"
										class="flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-zinc-100 text-[#154212] font-black text-xs uppercase tracking-widest hover:border-[#154212] hover:bg-zinc-50 transition-all active:scale-95"
									>
										View Details
										<span class="material-symbols-outlined text-[16px]">chevron_right</span>
									</NuxtLink>
								</div>
							</article>
						</template>

						<!-- Empty state -->
						<div v-if="filteredOrders.length === 0" class="bg-white rounded-2xl p-12 border border-zinc-100 shadow-sm text-center">
							<span class="material-symbols-outlined text-zinc-300 text-5xl">shopping_bag</span>
							<h3 class="text-xl font-extrabold text-zinc-400 mt-4 font-[Manrope,sans-serif]">
								{{ currentTab === 'All' ? 'No orders yet' : `No ${currentTab.toLowerCase()} orders` }}
							</h3>
							<p class="text-zinc-400 mt-2 text-sm">
								{{ currentTab === 'All' ? 'Your purchase history will appear here once you place your first order.' : 'Orders in this category will appear here.' }}
							</p>
							<NuxtLink to="/user/products" class="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-[#154212] text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#006e1c] transition-all">
								<span class="material-symbols-outlined text-[18px]">storefront</span>
								Browse the Market
							</NuxtLink>
						</div>
					</div>

					<div v-if="!loading && !error" class="mt-12 flex justify-center">
						<button
							v-if="hasMore"
							@click="loadMore"
							:disabled="loadingMore"
							class="group flex items-center gap-4 text-[#154212] font-black transition-all disabled:opacity-50"
						>
							<span class="w-10 h-[1.5px] bg-zinc-200 group-hover:w-16 transition-all"></span>
							<span class="tracking-[0.3em] uppercase text-[10px]">
								{{ loadingMore ? 'Loading…' : 'Load More Orders' }}
							</span>
							<span class="w-10 h-[1.5px] bg-zinc-200 group-hover:w-16 transition-all"></span>
						</button>
					</div>

					<div
						v-if="currentTab === 'In-Transit'"
						class="mt-16 bg-[#154212]/[0.03] p-8 sm:p-12 rounded-3xl flex flex-col md:flex-row items-center gap-10 sm:gap-12 border-l-[12px] border-[#154212]"
					>
						<div class="md:w-1/3">
							<img
								src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgZcWGHwrAFAKyauukDmVs9Fnu3CjGv_NJGK4rgv4No2Cq2-5GYimGnjHB2vAWRNCl6kObPa68mAd2YiCsjRId99_q_TyAlwHtZ5Zem6l99mBXFyzQY6u2Yzhv1RRlE4o0AB5XOBT6vDp3PO9-ND3HoNvHvMVMUWmxfkYLP-VCJDesngmO3K0wzWcv0AlzQseTXyvPOswc7m6lVq-y4Rw1mKhZRM5n7m4-TWsr3qVEzQwvSqPaGl5yGqxxpHDEWLxkxDW6QuTwDGM"
								alt="Farmer with truck"
								class="rounded-2xl shadow-2xl rotate-2 w-full max-w-[300px]"
							/>
						</div>
						<div class="flex-1 space-y-6 text-center md:text-left">
							<h2 class="text-3xl sm:text-4xl font-black font-[Manrope,sans-serif] text-[#154212] leading-tight tracking-tight">Transparency in every mile.</h2>
							<p class="text-zinc-600 leading-relaxed text-lg font-medium">
								We work directly with community drivers and farm co-operatives to ensure your food takes the most direct route from the soil to your kitchen. Have questions
								about your delivery? Our agrarian support team is ready to help.
							</p>
							<div>
								<a href="#" class="inline-flex items-center gap-2 text-[#006e1c] font-black uppercase tracking-[0.2em] text-sm group hover:gap-3 transition-all">
									Learn about our Logistics
									<span class="material-symbols-outlined text-[18px]">arrow_forward</span>
								</a>
							</div>
						</div>
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
</style>