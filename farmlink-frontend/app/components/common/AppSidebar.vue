<script setup lang="ts">
type SidebarKey = 'profile' | 'edit' | 'payment' | 'address';

const props = withDefaults(
	defineProps<{
		active?: SidebarKey;
	}>(),
	{
		active: 'profile',
	}
);

const menuItems: Array<{
	key: SidebarKey;
	label: string;
	icon: string;
	to: string;
}> = [
	{ key: 'profile', label: 'Profile Info', icon: 'person', to: '/user/settings/profile' },
	{ key: 'edit', label: 'Edit Profile', icon: 'edit', to: '/user/settings/edit' },
	{ key: 'address', label: 'Addresses', icon: 'location_on', to: '/user/settings/address' },
	{ key: 'payment', label: 'Payment Methods', icon: 'payments', to: '/user/settings/payment' },
];
</script>

<template>
	<aside class="w-full md:w-[280px] shrink-0">
		<div class="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-sm">
			<div class="flex items-center gap-3 mb-5">
				<img
					src="https://lh3.googleusercontent.com/aida-public/AB6AXuCA83x8AHQV-oGz8CINH3SrXquf2gJKH9G9CVM3OVmDN3cB3DlMZ8OKkFiQ6GOy52l0KObZYfls2JxyvOI98GKD7NfFwfqx0DFo0t-2YFkuLovUIbiufm26ot4sXnGGxIM2I2HJDVGlcryJSFSWwtSvjU_kM5Ukd7XLzqRh0TtvXigMvcnSSB_3sieWsfz6wndum2oJtb1LLll8OD48U8SyMvtpcYou8NOZi9JGGjQyxIbbVWefdH5bFmPhCa9meAhjW2CO_fJBhigk"
					alt="User avatar"
					class="w-14 h-14 rounded-full object-cover"
				/>
				<div>
					<h3 class="font-[Manrope,sans-serif] text-2xl leading-none font-extrabold text-zinc-900">Sophal Saman</h3>
					<p class="text-sm text-zinc-500 font-medium mt-1">Premium Member</p>
				</div>
			</div>

			<nav class="space-y-2">
				<NuxtLink
					v-for="item in menuItems"
					:key="item.key"
					:to="item.to"
					:class="[
						'flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-bold tracking-wide uppercase transition-colors',
						props.active === item.key ? 'bg-[#1f7a2e] text-white shadow-md' : 'text-zinc-700 hover:bg-zinc-100',
					]"
				>
					<span class="material-symbols-outlined text-[20px]">{{ item.icon }}</span>
					{{ item.label }}
				</NuxtLink>

				<a href="#" class="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-700 hover:bg-zinc-100 text-[15px] font-bold tracking-wide uppercase transition-colors">
					<span class="material-symbols-outlined text-[20px]">receipt_long</span>
					Purchase History
				</a>

				<a href="#" class="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-700 hover:bg-zinc-100 text-[15px] font-bold tracking-wide uppercase transition-colors">
					<span class="material-symbols-outlined text-[20px]">chat</span>
					Chat
				</a>
			</nav>
		</div>
	</aside>
</template>
