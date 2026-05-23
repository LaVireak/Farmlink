<script setup lang="ts">
import { computed } from 'vue';

definePageMeta({
	middleware: 'user',
	layout: 'user',
});

const route = useRoute();
const orderId = (route.params.id as string) || 'FL-9021';

// Simulate status based on ID for demo purposes
const isTransit = computed(() => orderId.includes('9044') || orderId.includes('882910'));
const isCancelled = computed(() => orderId.includes('8890'));

useHead({
	title: `Order #${orderId} | FarmLink Cambodia`,
});

// Data for Completed Order (FL-9021)
const completedItems = [
	{
		id: 1,
		name: 'Organic Black Kampot Pepper',
		province: 'Kampot Province',
		description: 'Hand-picked and sun-dried by the Chrey Bak collective. World-renowned for its intense aroma and floral notes.',
		price: '12.00',
		qty: '2 x 100g',
		image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiY33JtIyBmtCUmn88PVHdCXsU3hPVWn4VIM3RKnzmsENegw7MiiC4i0SouC4xIzu7UQrCE95AnCb1gEERMcGAgUuzBuXjPcuUgDx_S8yDlHED0lQEL2emYDZpDHtZU84IjAxp7HDGfZGnXE4aTm8tKjA4Whz2H2Dbfdmif8fHGnvlglqREJYxiCCpYqAbNx2_Hsg4DcEQzE24NpuDZQGYZ2p090wJual5IW0JL0t5vJoZumeKhxYV6pEI1I0w0ROoPA7cjL9LRM0',
	},
	{
		id: 2,
		name: 'Wild Forest Honey',
		province: 'Phnom Aural',
		description: 'Sustainably harvested from the Cardamom Mountains. Non-pasteurized and rich in minerals.',
		price: '18.50',
		qty: '1 x 500ml',
		image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDripjCi-Zwb-GK0ca-RGS5Y7ahwgEB3Q1zXEI2lURg74DpjCYITtLhoKT1pO9f2rKAZJZJ1QZsj6zSmKhWBRrYZ9-GADtlgh2X2pRy3ccfjY3IqpGRb3zkiBviWj9a0M0tL--_NFGfy98lchjdWNpw8ocKgbexXOHqd9RqVuqUvimLA_8D70Crt-bufwcPr5VF9J7BQQP2eZZOXVSGq8AwPAyUEJajZlwA_ad58ezyDW5d0I2UPsdDxIVPQuqiJ3zQyo0MiBu20sg',
	},
];

// Data for Transit Order (FL-9044)
const transitItems = [
	{
		id: 1,
		name: 'Fresh Lemongrass',
		desc: 'Bundle of 5 • 500g',
		price: '4.50',
		image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqFGCLcaSnsiHLfx9CT6itTYTbN6WQ7hCftSWcqKQ1VSPk-l55y8pU0aTFRc4t-EBoPag53SJyx1J2Kw9ivn21ac0u_TqbMbYAhS9zTQcP3uCh0R2QvdAFHZAKY3eYkKSmQ0U2WlcGxSuQAypFiiPs6Rtkk-xVO7wCHiRQmn5mSPHv6reVWlYprPMY-C5Kk_sOXBvf3A0fpa2N8eFPzoCR2xrASc_1tzDRO9ZXm62SNEegD3pC_-XWKwRSQyciOHw33mzhm3WTO4k',
	},
	{
		id: 2,
		name: 'Kampot Pepper',
		desc: 'Black • 200g',
		price: '12.00',
		image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcCoKlasmOYTkOVsQaDqWfdPzvqr4NK1PdXoBz1FREzl0GBwq_qPaL-mx1oEvVEdk1qAxsOtTorvCsUUQo7lM6WEak3efk7eib1sXFwCtI-IRitPgw3wCYx6Rxt27b1mK7I_4zG2IouG05rvG-ulCQUanI8QtkAz--fkgEbOK7p_y1kOlUzTXEjjA61Myco8ZDp9sDx3X115BbsTCi3HyraueiJ_8lF4yjZUi8V6ziOXd5m4Eowo37crPbi8Mm-zxPB1I5ZPk6m44',
	},
	{
		id: 3,
		name: 'Red Dragon Fruit',
		desc: '2 Medium Units',
		price: '6.80',
		image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyHvrUKUCQwCHRh4OQFqi68s_NVsVbGb_UAi2s5ME-JcqxIUDe0wIvlWVAcV8NG8CxmwaVpkuBUoVgEAU8K5rFHM7a94Z6dlLK1vHiTM9Q-1CMY8ZqbvFQIDLJD199H_pkJDT0msmAdwQG2JjbDbUC9a-oqkYLergJFWzZEVH4BUwSDAfCY1-kyTEo3KDuO4WBljh4Qs69AwS8k1Hf4unRaLQq8eTQnTvKTQ4OlaUt0H9IKBqrlxEqimCkLJTVuZAyam6UCty6zl4',
	},
];

// Data for Cancelled Order (FL-8890)
const cancelledItems = [
	{
		id: 1,
		name: 'Premium Kampot Black Pepper',
		desc: '250g • Batch #KP-2024-01',
		price: '18.50',
		qty: '2',
		image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiY33JtIyBmtCUmn88PVHdCXsU3hPVWn4VIM3RKnzmsENegw7MiiC4i0SouC4xIzu7UQrCE95AnCb1gEERMcGAgUuzBuXjPcuUgDx_S8yDlHED0lQEL2emYDZpDHtZU84IjAxp7HDGfZGnXE4aTm8tKjA4Whz2H2Dbfdmif8fHGnvlglqREJYxiCCpYqAbNx2_Hsg4DcEQzE24NpuDZQGYZ2p090wJual5IW0JL0t5vJoZumeKhxYV6pEI1I0w0ROoPA7cjL9LRM0',
	},
	{
		id: 2,
		name: 'Organic Battambang Turmeric',
		desc: '500g • Dried & Ground',
		price: '12.00',
		qty: '1',
		image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjtbeZgm5HPMGcRjnnuknp_IJOc4r0ioQ4KLxbxzoBbv0yHPDtOBQ_lrAvBjE0FeRAWol8HSpYei650T-BCDyri238veE6XAEXLHNZufZNYY0XulzixIsd65JQUUvyHvPy2Zh1DYH5wedka_rzlxZLRbOufIYJKgqR5H8Ymm4uUkA9bh5IWI3Pj2R6-OZSvqPSlB0culTiByMPpJrjVoxMH1HkmdkrWVbveXZ6-Fogy8G0iQmQA7a-b6OKI7CWioA3One_9rBxm_U',
	},
];
</script>

<template>
	<div class="min-h-screen flex flex-col bg-[#fbf9f6] text-zinc-900">
		<CommonAppHeader />

		<main class="max-w-7xl mx-auto w-full pt-28 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8 flex-1">
			<div class="flex flex-col md:flex-row gap-8 md:gap-10">
				<CommonAppSidebar active="purchaseHistory" />

				<div class="flex-1 min-w-0">
					<!-- Breadcrumbs -->
					<div class="flex items-center gap-2 text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em] mb-8">
						<NuxtLink to="/user/settings/purchaseHistory" class="hover:text-[#154212] transition-colors">Orders</NuxtLink>
						<span class="material-symbols-outlined text-[14px]">chevron_right</span>
						<span class="text-[#154212]">Order Details</span>
					</div>

					<!-- Header Section -->
					<div class="mb-10">
						<div class="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
							<div>
								<h1 class="text-4xl sm:text-5xl font-black font-[Manrope,sans-serif] text-[#154212] tracking-tighter leading-none mb-2">Order #{{ orderId }}</h1>
								<p class="text-zinc-500 font-medium">
									Placed on February 24, 2024 •
									<span class="text-[#154212] font-bold">{{ isCancelled ? 'Mekong Riverside Gardens' : isTransit ? 'Battambang Organic Collective' : 'Chrey Bak Community Farm' }}</span>
								</p>
							</div>

							<div v-if="isTransit" class="flex flex-col items-start xl:items-end">
								<span class="bg-[#ffdcbe] text-[#2c1600] px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest flex items-center gap-2 uppercase">
									<span class="material-symbols-outlined text-sm fill-1">local_shipping</span>
									IN-TRANSIT
								</span>
								<p class="text-xs text-zinc-400 mt-2 font-bold uppercase tracking-wide">
									Est. Delivery: <span class="text-[#154212]">March 20, 2024</span>
								</p>
								<p class="text-[10px] font-black text-[#006e1c] mt-1 uppercase tracking-widest">Est. Delivery: 2 Days</p>
							</div>

							<div v-else-if="isCancelled">
								<span class="bg-red-50 text-red-700 border border-red-100 px-5 py-2 rounded-full text-[10px] font-black tracking-widest flex items-center gap-2 uppercase">
									<span class="material-symbols-outlined text-sm">cancel</span>
									Cancelled on February 28, 2024
								</span>
							</div>

							<div v-else>
								<button
									class="flex items-center gap-2 px-8 py-4 bg-[#563000] text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all hover:bg-[#3d2200] active:scale-95 shadow-lg shadow-[#563000]/20"
								>
									<span class="material-symbols-outlined">refresh</span>
									Re-order Now
								</button>
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
									<div v-for="item in cancelledItems" :key="item.id" class="flex flex-col sm:flex-row gap-6 sm:items-center">
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
											<span class="text-[#154212] font-black">$49.00</span>
										</div>
										<div class="flex justify-between text-xs font-bold text-zinc-400 uppercase tracking-widest">
											<span>Shipping (Eco-Courier)</span>
											<span class="text-[#154212] font-black">$5.50</span>
										</div>
										<div class="flex justify-between text-xs font-bold text-zinc-400 uppercase tracking-widest">
											<span>Farmer Support Fee</span>
											<span class="text-[#154212] font-black">$2.00</span>
										</div>
										<div class="h-px bg-zinc-200 my-4"></div>
										<div class="flex justify-between items-center">
											<span class="text-sm font-black font-[Manrope,sans-serif] text-[#154212] uppercase tracking-widest">Total Refunded</span>
											<span class="text-3xl font-black font-[Manrope,sans-serif] text-[#154212] tracking-tighter">$56.50</span>
										</div>
									</div>
								</div>
							</div>

							<!-- Reason for Cancellation -->
							<div class="bg-red-50/30 p-8 rounded-2xl border-l-4 border-red-200 flex gap-5">
								<span class="material-symbols-outlined text-red-400">info</span>
								<div class="space-y-3">
									<h4 class="font-black font-[Manrope,sans-serif] text-[#154212] uppercase tracking-wide text-sm">Reason for Cancellation</h4>
									<p class="text-xs text-zinc-500 leading-relaxed font-medium">
										The vendor, Mekong Riverside Gardens, reported a harvest delay due to unexpected seasonal floods. As the items could not be fulfilled within our 48-hour quality guarantee window, the order was automatically cancelled and a full refund has been issued to your original payment method.
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
								<button class="w-full bg-white text-[#154212] py-4 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-100 transition-all relative z-10">
									<span class="material-symbols-outlined text-lg">chat_bubble</span>
									Contact Support
								</button>
								<span class="material-symbols-outlined absolute top-2 right-2 text-7xl text-white opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform">support_agent</span>
							</div>

							<!-- Delivery Details -->
							<div class="bg-white rounded-2xl p-6 border border-zinc-100">
								<h3 class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-5">Delivery Details</h3>
								<div class="flex gap-4">
									<span class="material-symbols-outlined text-zinc-300">location_on</span>
									<div class="text-xs text-zinc-500 font-medium space-y-1">
										<p class="font-black text-[#154212]">Sophal Vong</p>
										<p>128 Street 19, Sangkat Chey Chumneah</p>
										<p>Phnom Penh, 12200 Cambodia</p>
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
										<p class="font-black text-[#154212]">Visa ending in •••• 4421</p>
										<p class="text-zinc-400 font-medium">Refund processed Feb 28</p>
									</div>
								</div>
							</div>

							<!-- Origin Badge -->
							<div class="bg-[#94f990]/20 p-6 rounded-2xl border border-[#94f990]/30">
								<span class="bg-[#002204] text-[#94f990] text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest mb-3 inline-block">Origin Badge</span>
								<p class="text-[10px] text-[#154212] leading-relaxed font-medium">
									These products were sourced directly from <span class="font-bold">Kandal Province</span>, supporting regenerative farming practices.
								</p>
							</div>
						</div>
					</div>

					<!-- IN-TRANSIT LAYOUT -->
					<div v-else-if="isTransit" class="grid grid-cols-1 xl:grid-cols-12 gap-8">
						<!-- Left Column: Map & Timeline -->
						<div class="xl:col-span-8 flex flex-col gap-8">
							<div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-zinc-100">
								<div class="p-6 border-b border-zinc-50 flex justify-between items-center bg-zinc-50/30">
									<h3 class="font-[Manrope,sans-serif] font-black text-lg text-[#154212]">Live Tracking</h3>
									<div class="text-[10px] text-zinc-400 font-black uppercase tracking-widest flex items-center gap-2">
										<span class="w-2 h-2 rounded-full bg-[#006e1c] animate-pulse"></span>
										Updated 2 mins ago
									</div>
								</div>
								<div class="relative aspect-video xl:h-[450px] bg-zinc-100">
									<img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-1WKQdhYcmqE6REINowWfvWptTlmmku29aVkFxTvsgXW4MJ6oli3Nmk9NX2SRJLje4dhn5gW5TLWOKWy5RP1vzcafklWoQTlkQImUydGgTtu282wfdAMZF9BNXrj8e7JkPJ9JW1u6PqURXd1Rb26cUcDvD-YDSvenr8x77uj-p1olVZMJZO1RPUpbJtKx89TTEqjJwlDKwBCbeuW18Prkrm-77Jg7nUScmYJXCDKriMfMMcBJalT6WcGKPggxF8E84-DRRvvGX0I" alt="Tracking Map" class="w-full h-full object-cover opacity-80" />
									<div class="absolute inset-0 p-6 flex flex-col justify-end">
										<div class="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl max-w-xs flex items-center gap-4 border border-white">
											<div class="w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 border-2 border-zinc-50">
												<img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCue0B4_ZvopNVjR-6-vhcuCHlBeyqg7zLD4Ln8Lzy6pz-pXXbUqyIAKDDWXLfKtGwrnFcCvpSZ1HSIj5FMyjTlFqTB5gTIZYOgJViFeFkjdP8GPGYNmQfd-2t0sPaH3blZFs8euiU8IM6f5SHXLYWeybixRLzRN0nvOFB9wC-RnZZcPwIFw2n8CYmmqEC6vNVz8qH39rxdPEvxhrhaAS6PrEZ3qD4gQY-HpwsWYJBk0jFUpwt4TKjd4G3RVRu1DNXOhu1KzCC-2hU" alt="Driver" class="w-full h-full object-cover" />
											</div>
											<div class="flex-1">
												<div class="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Your Driver</div>
												<div class="font-black text-[#154212] font-[Manrope,sans-serif]">Sovan M.</div>
											</div>
											<button class="bg-[#563000] text-white p-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#563000]/20">
												<span class="material-symbols-outlined text-sm">chat_bubble</span>
											</button>
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
									<p class="text-xs text-zinc-500 leading-relaxed font-medium">Your produce was hand-picked at the <span class="text-[#154212] font-bold">Battambang Organic Collective</span> and temperature-controlled within 2 hours.</p>
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
										<p class="font-black text-[#154212] text-sm">Central Market Residence</p>
										<p>Block C, Suite 402</p>
										<p>Phnom Penh, Cambodia</p>
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
									<button class="w-full bg-white text-[#154212] py-4 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-100 transition-colors shadow-lg shadow-black/10"><span class="material-symbols-outlined text-lg">call</span>Contact Driver</button>
									<button class="w-full bg-white/10 hover:bg-white/20 border border-white/20 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"><span class="material-symbols-outlined text-lg">edit_note</span>Edit Instructions</button>
								</div>
							</div>
							<div class="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm">
								<h3 class="font-[Manrope,sans-serif] font-black text-[#154212] mb-6 uppercase tracking-widest text-xs">Basket Summary</h3>
								<div class="space-y-6">
									<div v-for="item in transitItems" :key="item.id" class="flex items-center gap-4">
										<div class="w-14 h-14 rounded-xl overflow-hidden bg-zinc-50 flex-shrink-0 shadow-inner">
											<img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
										</div>
										<div class="flex-1">
											<div class="text-[11px] font-black text-[#154212] uppercase tracking-tight">{{ item.name }}</div>
											<div class="text-[10px] text-zinc-400 font-medium tracking-wide">{{ item.desc }}</div>
										</div>
										<div class="text-sm font-black text-[#154212] tracking-tighter">${{ item.price }}</div>
									</div>
								</div>
								<div class="mt-8 pt-6 border-t border-zinc-50 space-y-3">
									<div class="flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest">
										<span>Subtotal</span>
										<span class="text-[#154212]">$23.30</span>
									</div>
									<div class="flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest">
										<span>Delivery Fee</span>
										<span class="text-[#154212]">$2.50</span>
									</div>
									<div class="flex justify-between items-center pt-3">
										<span class="font-[Manrope,sans-serif] font-black text-[#154212] text-sm uppercase tracking-widest">Total</span>
										<span class="text-2xl font-black text-[#563000] tracking-tighter">$25.80</span>
									</div>
								</div>
							</div>
							<div class="bg-[#fbf9f6] p-8 rounded-2xl border border-zinc-100 text-center relative overflow-hidden group">
								<span class="material-symbols-outlined text-4xl text-[#006e1c] mb-3 fill-1 block">verified</span>
								<div class="font-[Manrope,sans-serif] font-black text-[#154212] uppercase tracking-widest text-xs">100% Traceable</div>
								<p class="text-[10px] text-zinc-400 mt-2 px-4 leading-relaxed font-bold uppercase tracking-wide">Every item verified by the blockchain traceability ledger.</p>
								<button class="mt-6 text-[10px] font-black text-[#006e1c] underline decoration-[#006e1c]/30 underline-offset-4 hover:decoration-[#006e1c] uppercase tracking-[0.2em]">View Certificate</button>
							</div>
						</div>
					</div>

					<!-- COMPLETED LAYOUT -->
					<template v-else>
						<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
							<div class="bg-zinc-100 p-8 rounded-2xl flex flex-col justify-between min-h-[160px] border border-zinc-200/50">
								<span class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Delivery Address</span>
								<div>
									<p class="font-black text-[#154212]">Sihanouk Boulevard, No. 45</p>
									<p class="text-zinc-500 text-sm font-medium">Phnom Penh, Cambodia</p>
								</div>
							</div>
							<div class="bg-zinc-50 p-8 rounded-2xl flex flex-col justify-between min-h-[160px] border border-zinc-100">
								<span class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Payment Method</span>
								<div class="flex items-center gap-3">
									<span class="material-symbols-outlined text-[#154212]">credit_card</span>
									<p class="font-black text-[#154212]">Visa ending in 4421</p>
								</div>
							</div>
							<div class="bg-[#154212] text-white p-8 rounded-2xl flex flex-col justify-between min-h-[160px] shadow-xl shadow-[#154212]/20">
								<span class="text-[10px] font-black text-white/40 uppercase tracking-widest">Order Summary</span>
								<div class="flex items-baseline gap-2">
									<span class="text-4xl font-black font-[Manrope,sans-serif] tracking-tighter">$42.50</span>
									<span class="text-white/60 text-xs font-bold uppercase tracking-widest">USD Total</span>
								</div>
							</div>
						</div>
						<section class="space-y-10">
							<div class="flex items-center justify-between border-b border-zinc-100 pb-5">
								<h2 class="text-2xl sm:text-3xl font-black font-[Manrope,sans-serif] text-[#154212] tracking-tight">Basket Contents</h2>
								<span class="text-xs font-black text-zinc-300 uppercase tracking-widest">3 Items</span>
							</div>
							<div class="space-y-12 sm:space-y-16">
								<div v-for="item in completedItems" :key="item.id" class="flex flex-col lg:flex-row gap-8 items-start group">
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
										<div class="flex gap-6 pt-2">
											<button class="text-[10px] font-black text-[#006e1c] uppercase tracking-widest hover:underline decoration-2 underline-offset-4">View Traceability Report</button>
											<button class="text-[10px] font-black text-zinc-300 uppercase tracking-widest hover:text-[#154212] transition-colors">Write Review</button>
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
												<p class="text-xs text-zinc-500 leading-relaxed font-medium">This order supported 3 small-scale farming families and prevented approximately 2.4kg of carbon emissions compared to standard retail logistics.</p>
											</div>
										</div>
									</div>
									<div class="w-full lg:w-80 space-y-4">
										<div class="flex justify-between items-center text-xs font-bold text-zinc-400 uppercase tracking-widest"><span>Subtotal</span><span class="text-[#154212]">$30.50</span></div>
										<div class="flex justify-between items-center text-xs font-bold text-zinc-400 uppercase tracking-widest"><span>Premium Logistics</span><span class="text-[#154212]">$8.00</span></div>
										<div class="flex justify-between items-center text-xs font-bold text-zinc-400 uppercase tracking-widest"><span>Community Surcharge</span><span class="text-[#154212]">$4.00</span></div>
										<div class="h-px bg-zinc-100 my-2"></div>
										<div class="flex justify-between items-center"><span class="text-lg font-black font-[Manrope,sans-serif] text-[#154212] uppercase tracking-tight">Order Total</span><span class="text-3xl font-black font-[Manrope,sans-serif] text-[#154212] tracking-tighter">$42.50</span></div>
									</div>
								</div>
							</div>
						</section>
					</template>
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
