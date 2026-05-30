<script setup lang="ts">
import { ref, computed } from 'vue';

definePageMeta({
	middleware: 'user',
	layout: 'user',
});

useHead({
	title: 'Purchase History | FarmLink Cambodia',
});

const currentTab = ref('All');
const tabs = ['All', 'Completed', 'In-Transit', 'Cancelled'];

const orders = [
	{
		id: 'FL-9021',
		farmName: 'Chrey Bak Community Farm',
		productName: 'Organic Khmer Vegetable Bundle',
		origin: 'Kampong Chhnang',
		date: 'March 14, 2024',
		items: 4,
		total: '42.50',
		status: 'Completed',
		statusClass: 'bg-emerald-100 text-emerald-800',
		image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZQiWm8VV-pbsP0ZLBajZQ1hB87dtjIqZuya_5Q1vis9vymJZUNfFYVeY9aelg1SuDCWENLRDbaLj8aRdGJlV8qwxg5iClTrTjS-OtnuCpYTtkq-NEnrKHgmNzbbiDJN8DEnZtYSFSyOubE2YztuQSvcgN4IYf_pjfW5u6VUtZeMjofnGuQqD8H8m4sDZu1d0rTr_dK6-jh4Rd3Ox6dr2dcAd97vpGCE7iLQyamR3v3SamYUCYUCU9iFn_FjprWFD7OG7HXaiFEBM',
	},
	{
		id: 'FL-9044',
		farmName: 'Battambang Organic Collective',
		productName: 'Phka Rumduol Jasmine Rice (5kg)',
		origin: 'Battambang',
		date: 'March 18, 2024',
		items: 7,
		total: '89.15',
		status: 'In-Transit',
		statusClass: 'bg-orange-100 text-orange-800',
		image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxSIvKIuR2BqsWIsER071js2ywfi7CP5m9mS8WzX1VFEam_p3bKUUBDfpomQgp2Uvp2PjuNwLmT8W3GAfvhbsNLcYqc6fyI5e9wOgdOAWo-FXd6TFHIyp7dsEJbVDxVZRQOeoU9AlMe452vG5o6NtXf3wpWD-UQ0ob3tIb47t1MtHcAajUd-XoMjdUUFMwSW7E6uxB2TKRsqLcsulOKrq5i1J28fVvVP_1NUUNa0izLItmVgu8tAz9A7NNfUr1G7xELqixhRGcsMg',
		progress: 'w-[85%]',
		updateText: 'The courier is 4 stops away from your location. Please ensure someone is available to receive the fresh harvest.',
	},
	{
		id: 'HT-882910',
		farmName: 'Kampot Pepper Co-op',
		productName: 'Organic Kampot Pepper (Premium Batch)',
		origin: 'Kampot',
		date: 'July 14, 2023',
		items: 2,
		total: '42.00',
		status: 'In-Transit',
		statusClass: 'bg-orange-100 text-orange-800',
		image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgMohAYMYvy24VC4cbZzvKKFljvShhZMXBZCF4cf4dZGjsUixpeeKru7S3WtXMiwQp2LBQK0vcuiH1JUUVUBl_9dGrGCBHG-R8rP3dp4z7jl3UA7XRLibf577RhpqmtXpnvJPqvLW3hAxcFqCo0dTs9ZByVvaZpW7a7ZYxV4y-VikVogv2x_qn9Hl8ZeMm0zRoretMsuUe9-3O1eRooYUPF0rvlAWl2jg7RfMPORbcJ93HRuvdIpk7xDT-8ndIrS2uX_Gpi1l-M3M',
		progress: 'w-2/3',
		updateText: 'Your harvest has left the Phnom Penh distribution hub and is expected at your door by July 18.',
	},
	{
		id: 'FL-8890',
		farmName: 'Mekong Riverside Gardens',
		productName: 'Artisanal Palm Sugar & Spices',
		origin: 'Kandal',
		date: 'February 28, 2024',
		items: 2,
		total: '15.00',
		status: 'Cancelled',
		statusClass: 'bg-zinc-100 text-zinc-500',
		image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtRilK6MR-O4QLwp-ka31uy2xx4WSDejuNjT9GZTMva8WA8jgMdYt2LOhWzlJvi3s541zijROiyQVdJ2O68I09e4RL4pZX1P2y6R4XVSUYc0Ej4evCV_W-ipBUARXV76pDdXTsl2UdUbnweK6Y29_sX10E79n1-hTlDUrZyoU-FqqidSexkP9XQoq1U3f40BiVWDKNm0N-jbKJ3O_8fi2QLJc7xtxRwGgVjnSIsRxVIzaksgskajJXFxwdT8LZ602NspSqRTzkL9k',
	},
	{
		id: 'FL-8722',
		farmName: 'Sihanoukville Sea Harvest',
		productName: 'Sun-Dried Prawns & Fish Sauce',
		origin: 'Sihanoukville',
		date: 'February 15, 2024',
		items: 12,
		total: '156.40',
		status: 'Completed',
		statusClass: 'bg-emerald-100 text-emerald-800',
		image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjtbeZgm5HPMGcRjnnuknp_IJOc4r0ioQ4KLxbxzoBbv0yHPDtOBQ_lrAvBjE0FeRAWol8HSpYei650T-BCDyri238veE6XAEXLHNZufZNYY0XulzixIsd65JQUUvyHvPy2Zh1DYH5wedka_rzlxZLRbOufIYJKgqR5H8Ymm4uUkA9bh5IWI3Pj2R6-OZSvqPSlB0culTiByMPpJrjVoxMH1HkmdkrWVbveXZ6-Fogy8G0iQmQA7a-b6OKI7CWioA3One_9rBxm_U',
	},
];

const filteredOrders = computed(() => {
	if (currentTab.value === 'All') return orders;
	return orders.filter((o) => o.status === currentTab.value);
});
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

					<div class="flex flex-col gap-6 sm:gap-8">
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
														{{ order.origin }}
													</span>
												</div>
												<p class="text-zinc-400 text-[11px] font-bold tracking-wide uppercase">Order #{{ order.id }} • Placed {{ order.date }}</p>
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
											<span class="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Order #{{ order.id }}</span>
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
					</div>

					<div class="mt-12 flex justify-center">
						<button class="group flex items-center gap-4 text-[#154212] font-black group transition-all">
							<span class="w-10 h-[1.5px] bg-zinc-200 group-hover:w-16 transition-all"></span>
							<span class="tracking-[0.3em] uppercase text-[10px]">Load More Traditions</span>
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