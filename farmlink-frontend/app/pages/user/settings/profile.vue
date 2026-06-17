<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useAuthStore } from '../../../stores/auth.store';
import { getAccessToken } from '../../../services/auth.service';
import { useRewards } from '../../../composables/useRewards';
import CommonAppSidebar from '../../../components/common/AppSidebar.vue';
definePageMeta({
	middleware: 'user',
	layout: 'user',
});

useHead({
	title: 'Profile Overview | FarmLink Cambodia',
});

const config = useRuntimeConfig();
const auth = useAuthStore();
const { rewardPoints, redeemPoints } = useRewards();

const showRedeemOptions = ref(false);
const redeemStatusMessage = ref<string | null>(null);
const redeemStatusType = ref<'success' | 'error' | null>(null);

const handleRedeem = async (points: number, amountDollars: number) => {
	redeemStatusMessage.value = null;
	redeemStatusType.value = null;

	if (rewardPoints.value < points) {
		redeemStatusMessage.value = 'Insufficient points balance!';
		redeemStatusType.value = 'error';
		return;
	}

	try {
		const success = await redeemPoints(points, `Redeemed ${points} points for $${amountDollars} cash discount`);
		if (success) {
			redeemStatusMessage.value = `Successfully redeemed ${points} points for $${amountDollars}!`;
			redeemStatusType.value = 'success';
			showRedeemOptions.value = false;
			
			// Auto clear message after 5 seconds
			setTimeout(() => {
				redeemStatusMessage.value = null;
				redeemStatusType.value = null;
			}, 5000);
		}
	} catch (err: any) {
		redeemStatusMessage.value = err.message || 'Failed to redeem rewards.';
		redeemStatusType.value = 'error';
	}
};

const profile = ref<{
	id: string;
	email: string;
	firstName?: string | null;
	lastName?: string | null;
	role?: string;
	avatarUrl?: string | null;
	createdAt?: string | null;
} | null>(null);

const statsLoading = ref(true);
const totalOrders = ref<number | null>(null);
const savedProducts = ref<number | null>(null);
const activeShipments = ref<number | null>(null);

const notificationPreferenceKey = 'farmlink.user.settings.notifications';

type NotificationKey = 'orderUpdates' | 'priceAlerts' | 'marketNews';

const notificationItems: Array<{
	key: NotificationKey;
	title: string;
	description: string;
}> = [
	{ key: 'orderUpdates', title: 'Order Updates', description: 'Fresh deliveries tracking' },
	{ key: 'priceAlerts', title: 'Price Alerts', description: 'Seasonal drops alerts' },
	{ key: 'marketNews', title: 'Market News', description: 'Weekly farmer insights' },
];

const notificationPreferences = ref<Record<NotificationKey, boolean>>({
	orderUpdates: true,
	priceAlerts: true,
	marketNews: false,
});

onMounted(() => {
	void initializeProfileOverview();
});

const currentUser = computed(() => {
	if (profile.value) {
		return {
			...auth.user,
			...profile.value,
		};
	}

	return auth.user;
});

const profileStorageKey = computed(() => `${notificationPreferenceKey}.${currentUser.value?.id ?? 'guest'}`);

const user = computed(() => currentUser.value);

const loadStoredNotificationPreferences = () => {
	if (typeof window === 'undefined') return;
	const raw = localStorage.getItem(profileStorageKey.value);
	if (!raw) return;

	try {
		const parsed = JSON.parse(raw) as Partial<Record<NotificationKey, boolean>>;
		notificationPreferences.value = {
			orderUpdates: parsed.orderUpdates ?? true,
			priceAlerts: parsed.priceAlerts ?? true,
			marketNews: parsed.marketNews ?? false,
		};
	} catch {
		localStorage.removeItem(profileStorageKey.value);
	}
};

const persistNotificationPreferences = () => {
	if (typeof window === 'undefined') return;
	localStorage.setItem(profileStorageKey.value, JSON.stringify(notificationPreferences.value));
};

const toggleNotificationPreference = (key: NotificationKey) => {
	notificationPreferences.value = {
		...notificationPreferences.value,
		[key]: !notificationPreferences.value[key],
	};
	persistNotificationPreferences();
};

const formatCount = (value: number | null) => new Intl.NumberFormat('en-US').format(value ?? 0);

const getAuthHeaders = async () => {
	const accessToken = await getAccessToken();
	return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

const unwrapApiData = <T = any>(payload: any): T => (payload?.data ?? payload) as T;

const loadProfileData = async () => {
	try {
		const headers = await getAuthHeaders();
		const response = await fetch(`${config.public.apiUrl}/users/profile`, { headers });
		if (!response.ok) return;

		const data = unwrapApiData(await response.json().catch(() => null));
		if (data?.id && data?.email) {
			profile.value = data;
		}
	} catch {
		return;
	}
};

const loadQuickStatistics = async () => {
	const currentId = currentUser.value?.id;
	if (!currentId) {
		totalOrders.value = 0;
		savedProducts.value = 0;
		activeShipments.value = 0;
		statsLoading.value = false;
		return;
	}

	statsLoading.value = true;

	try {
		const headers = await getAuthHeaders();

		const [ordersResponse, savedProductsResponse] = await Promise.all([
			fetch(`${config.public.apiUrl}/orders/consumer/${currentId}?page=1&limit=1000`, { headers }),
			fetch(`${config.public.apiUrl}/users/${currentId}/favorites/products`, { headers }),
		]);

		if (ordersResponse.ok) {
			const ordersData = await ordersResponse.json().catch(() => null);
			const orders = Array.isArray(ordersData?.data) ? ordersData.data : [];
			totalOrders.value = typeof ordersData?.total === 'number' ? ordersData.total : orders.length;
			activeShipments.value = orders.filter((order: { status?: string }) => {
				const status = String(order.status ?? '').toLowerCase();
				return ['pending', 'confirmed', 'preparing', 'in_delivery'].includes(status);
			}).length;
		} else {
			totalOrders.value = 0;
			activeShipments.value = 0;
		}

		if (savedProductsResponse.ok) {
			const savedProductsData = await savedProductsResponse.json().catch(() => null);
			savedProducts.value = Array.isArray(savedProductsData) ? savedProductsData.length : Array.isArray(savedProductsData?.data) ? savedProductsData.data.length : 0;
		} else {
			savedProducts.value = 0;
		}
	} catch {
		totalOrders.value = 0;
		savedProducts.value = 0;
		activeShipments.value = 0;
	} finally {
		statsLoading.value = false;
	}
};

const initializeProfileOverview = async () => {
	await auth.hydrate();
	await loadProfileData();
	loadStoredNotificationPreferences();
	await loadQuickStatistics();
};

const displayName = computed(() => {
	if (!auth.hydrated) return 'Loading profile...';

	if (!user.value) return 'No profile found';

	const firstName = user.value.firstName?.trim() ?? '';
	const lastName = user.value.lastName?.trim() ?? user.value.lastname?.trim() ?? '';
	return [firstName, lastName].filter(Boolean).join(' ') || user.value.email;
});

const displayEmail = computed(() => {
	if (!auth.hydrated) return 'Loading email...';
	return user.value?.email ?? 'No email on file';
});

const displayRole = computed(() => {
	if (!auth.hydrated) return 'Loading account type...';

	switch (user.value?.role) {
		case 'admin':
			return 'Admin Account';
		case 'farmer':
			return 'Farmer Account';
		case 'consumer':
			return 'Customer Account';
		default:
			return 'Account';
	}
});

const avatarInitials = computed(() => {
	if (!user.value) return 'FM';
	const firstName = user.value.firstName?.trim() ?? '';
	const lastName = user.value.lastName?.trim() ?? user.value.lastname?.trim() ?? '';
	const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.trim();
	if (initials) return initials.toUpperCase();
	return user.value.email.slice(0, 2).toUpperCase() || 'FM';
});

const avatarUrl = computed(() => user.value?.avatarUrl ?? '');

const memberSince = computed(() => {
	if (!auth.hydrated) return 'Loading date...';
	if (!user.value?.createdAt) return 'Not available';

	const createdAt = new Date(user.value.createdAt);
	if (Number.isNaN(createdAt.getTime())) return 'Not available';

	return new Intl.DateTimeFormat('en-US', {
		month: 'long',
		year: 'numeric',
	}).format(createdAt);
});
</script>

<template>
	<div class="min-h-screen flex flex-col bg-[#fbf9f6] text-zinc-900">
		<CommonAppHeader />

		<main class="max-w-[1550px] mx-auto w-full pt-16 sm:pt-16 pb-16 px-4 sm:px-16 lg:px-8 flex-1">
			<div class="flex flex-col md:flex-row gap-8 md:gap-10">
				<CommonAppSidebar active="profile" />

				<div class="flex-1 min-w-0">
					<header class="mb-8 sm:mb-10">
						<p class="text-[#006e1c] font-extrabold text-[10px] uppercase tracking-[0.2em] mb-3">Account Management</p>
						<h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#154212] font-[Manrope,sans-serif] tracking-tight">Profile Overview</h1>
					</header>

					<div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
						<section class="xl:col-span-8 space-y-8">
							<div class="bg-white p-5 sm:p-8 rounded-2xl border border-zinc-100 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start">
								<div class="relative shrink-0">
									<div class="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-4 border-[#fbf9f6] shadow-lg bg-gradient-to-br from-[#154212] via-[#1f7a2e] to-[#006e1c] flex items-center justify-center text-white">
										<img v-if="avatarUrl" :src="avatarUrl" alt="Profile avatar" class="w-full h-full object-cover" />
										<span v-else class="text-3xl sm:text-4xl font-black font-[Manrope,sans-serif] tracking-tight">{{ avatarInitials }}</span>
									</div>
									<span class="absolute -bottom-2 -right-2 bg-[#006e1c] text-white text-[10px] font-black px-3 py-1 rounded-full">{{ displayRole }}</span>
								</div>

								<div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-y-7">
									<div>
										<p class="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-1">Full Name</p>
										<p class="text-xl font-bold text-[#154212] font-[Manrope,sans-serif]">{{ displayName }}</p>
									</div>
									<div>
										<p class="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-1">Email Address</p>
										<p class="truncate text-xl font-bold text-[#154212] font-[Manrope,sans-serif] whitespace-nowrap">{{ displayEmail }}</p>
									</div>
									<div>
										<p class="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-1">Account Type</p>
										<p class="text-xl font-bold text-[#154212] font-[Manrope,sans-serif]">{{ displayRole }}</p>
									</div>
									<div>
										<p class="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-1">Member Since</p>
										<p class="text-xl font-bold text-[#154212] font-[Manrope,sans-serif]">{{ memberSince }}</p>
									</div>
								</div>
							</div>

							<section class="space-y-4">
								<h3 class="text-2xl font-extrabold font-[Manrope,sans-serif] text-[#154212]">Quick Statistics</h3>
								<div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
									<article class="bg-white p-5 rounded-2xl border border-zinc-100">
										<p class="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest">Total Orders</p>
										<div class="flex items-end gap-2 mt-2">
											<p class="text-3xl font-black text-[#154212] font-[Manrope,sans-serif]">{{ statsLoading ? '...' : formatCount(totalOrders) }}</p>
											<span class="material-symbols-outlined text-[#006e1c] mb-1">shopping_bag</span>
										</div>
									</article>

									<article class="bg-white p-5 rounded-2xl border border-zinc-100">
										<p class="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest">Saved Products</p>
										<div class="flex items-end gap-2 mt-2">
											<p class="text-3xl font-black text-[#154212] font-[Manrope,sans-serif]">{{ statsLoading ? '...' : formatCount(savedProducts) }}</p>
											<span class="material-symbols-outlined text-[#006e1c] mb-1">bookmark</span>
										</div>
									</article>

									<article class="bg-white p-5 rounded-2xl border border-zinc-100">
										<p class="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest">Active Shipments</p>
										<div class="flex items-end gap-2 mt-2">
											<p class="text-3xl font-black text-zinc-400 font-[Manrope,sans-serif]">{{ statsLoading ? '...' : formatCount(activeShipments) }}</p>
											<span class="material-symbols-outlined text-zinc-400 mb-1">local_shipping</span>
										</div>
									</article>
								</div>
							</section>
						</section>

						<aside class="xl:col-span-4 space-y-6">
							<div class="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
								<h3 class="text-xl font-extrabold font-[Manrope,sans-serif] text-[#154212] mb-6">Notifications</h3>
								<div class="space-y-6">
									<div v-for="item in notificationItems" :key="item.key" class="flex items-center justify-between gap-4">
										<div>
											<p class="text-sm font-bold text-[#154212]">{{ item.title }}</p>
											<p class="text-[11px] text-zinc-500">{{ item.description }}</p>
										</div>
										<button
											type="button"
											role="switch"
											:aria-checked="notificationPreferences[item.key]"
											@click="toggleNotificationPreference(item.key)"
											class="relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-200"
											:class="notificationPreferences[item.key] ? 'bg-[#006e1c]' : 'bg-zinc-200'"
										>
											<span
												class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200"
												:class="notificationPreferences[item.key] ? 'translate-x-7' : 'translate-x-1'"
											/>
										</button>
									</div>
								</div>
							</div>

							<div class="bg-[#ffdcbe] p-6 rounded-2xl border border-[#f0c99f] shadow-[0_2px_0_0_rgba(0,0,0,1)] relative">
								<p class="text-[10px] font-extrabold text-[#693c00] uppercase tracking-widest mb-2">Reward Balance</p>
								<h4 class="text-4xl font-black text-[#2c1600] font-[Manrope,sans-serif] tracking-tight mb-5">
									{{ formatCount(rewardPoints) }} <span class="text-sm font-bold uppercase">Points</span>
								</h4>
								
								<button 
									@click="showRedeemOptions = !showRedeemOptions" 
									class="w-full py-3 rounded-xl bg-[#2c1600] text-white text-xs font-black uppercase tracking-widest hover:bg-[#1a0c00] transition-colors flex items-center justify-center gap-2"
								>
									<span>Redeem Rewards</span>
									<span class="material-symbols-outlined text-sm transition-transform duration-300" :class="{ 'rotate-180': showRedeemOptions }">expand_more</span>
								</button>

								<!-- Dropdown Options -->
								<div 
									v-if="showRedeemOptions" 
									class="mt-4 bg-white border border-[#f0c99f] rounded-xl p-3 shadow-md space-y-2 animate-fadeIn"
								>
									<p class="text-[10px] font-black text-[#693c00] uppercase tracking-wider mb-2">Select Reward Offer:</p>
									<button 
										@click="handleRedeem(100, 1)"
										:disabled="rewardPoints < 100"
										class="w-full text-left px-3 py-2.5 rounded-lg border text-xs font-bold transition-all flex justify-between items-center"
										:class="rewardPoints >= 100 ? 'border-zinc-200 hover:border-[#2c1600] hover:bg-zinc-50 text-zinc-800' : 'border-zinc-100 bg-zinc-50 text-zinc-400 cursor-not-allowed'"
									>
										<span>100 Points</span>
										<span class="text-[#2c1600] font-black">$1 Discount</span>
									</button>
									<button 
										@click="handleRedeem(500, 5)"
										:disabled="rewardPoints < 500"
										class="w-full text-left px-3 py-2.5 rounded-lg border text-xs font-bold transition-all flex justify-between items-center"
										:class="rewardPoints >= 500 ? 'border-zinc-200 hover:border-[#2c1600] hover:bg-zinc-50 text-zinc-800' : 'border-zinc-100 bg-zinc-50 text-zinc-400 cursor-not-allowed'"
									>
										<span>500 Points</span>
										<span class="text-[#2c1600] font-black">$5 Discount</span>
									</button>
									<button 
										@click="handleRedeem(800, 10)"
										:disabled="rewardPoints < 800"
										class="w-full text-left px-3 py-2.5 rounded-lg border text-xs font-bold transition-all flex justify-between items-center"
										:class="rewardPoints >= 800 ? 'border-zinc-200 hover:border-[#2c1600] hover:bg-zinc-50 text-zinc-800' : 'border-zinc-100 bg-zinc-50 text-zinc-400 cursor-not-allowed'"
									>
										<span>800 Points</span>
										<span class="text-[#2c1600] font-black">$10 Discount</span>
									</button>
								</div>

								<!-- Feedback Messages -->
								<div 
									v-if="redeemStatusMessage" 
									class="mt-3 p-3 rounded-lg text-xs font-bold text-center transition-all animate-fadeIn"
									:class="redeemStatusType === 'success' ? 'bg-[#94f990]/25 text-[#002204] border border-[#94f990]' : 'bg-red-50 text-red-700 border border-red-200'"
								>
									{{ redeemStatusMessage }}
								</div>
							</div>
						</aside>
					</div>
				</div>
			</div>
		</main>

		<CommonAppFooter />
	</div>
</template>

<style scoped>
.material-symbols-outlined {
	font-variation-settings: 'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24;
}
@keyframes fadeIn {
	from { opacity: 0; transform: translateY(-4px); }
	to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
	animation: fadeIn 0.2s ease-out forwards;
}
</style>
