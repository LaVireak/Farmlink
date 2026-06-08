<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth.store';

type SidebarKey = 'profile' | 'edit' | 'payment' | 'address' | 'purchaseHistory' | 'chat';

const props = withDefaults(
	defineProps<{
		active?: SidebarKey;
	}>(),
	{
		active: 'profile',
	}
);

const auth = useAuthStore();

onMounted(() => {
	void auth.hydrate();
});

const user = computed(() => auth.user);

const displayName = computed(() => {
	if (!auth.hydrated) return 'Loading profile...';
	if (!user.value) return 'Guest User';

	const firstName = user.value.firstName?.trim() ?? '';
	const lastName = user.value.lastName?.trim() ?? user.value.lastname?.trim() ?? '';
	return [firstName, lastName].filter(Boolean).join(' ') || user.value.email;
});

const displayRole = computed(() => {
	if (!auth.hydrated) return 'Loading account...';

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

const menuItems: Array<{
	key: SidebarKey;
	label: string;
	icon: string;
	to: string;
}> = [
	{ key: 'profile', label: 'Profile Info', icon: 'person', to: '/user/settings/profile' },
	{ key: 'edit', label: 'Edit Profile', icon: 'edit', to: '/user/settings/edit' },
	{ key: 'purchaseHistory', label: 'Purchase History', icon: 'history_edu', to: '/user/settings/purchaseHistory' },
	{ key: 'address', label: 'Addresses', icon: 'location_on', to: '/user/settings/address' },
	{ key: 'payment', label: 'Payment Methods', icon: 'payments', to: '/user/settings/payment' },
	{ key: 'chat', label: 'Chat', icon: 'chat', to: '/user/settings/chat' },
];
</script>

<template>
	<aside class="w-full md:w-[280px] shrink-0">
		<div class="bg-surface-container-lowest dark:bg-surface-container rounded-2xl border border-outline-variant p-5 sm:p-6 shadow-sm">
			<div class="flex items-center gap-3 mb-5">
				<div class="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-[#154212] via-[#1f7a2e] to-[#006e1c] flex items-center justify-center text-white shrink-0 shadow-sm">
					<img v-if="avatarUrl" :src="avatarUrl" alt="Profile avatar" class="w-full h-full object-cover" />
					<span v-else class="text-sm font-black font-[Manrope,sans-serif] tracking-tight">{{ avatarInitials }}</span>
				</div>
				<div>
					<h3 class="font-[Manrope,sans-serif] text-2xl leading-none font-extrabold text-zinc-900">{{ displayName }}</h3>
					<p class="text-sm text-zinc-500 font-medium mt-1">{{ displayRole }}</p>
				</div>
			</div>
			<nav class="space-y-2">
				<NuxtLink
					v-for="item in menuItems"
					:key="item.key"
					:to="item.to"
					:class="[
						'flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-bold tracking-wide uppercase transition-colors',
						props.active === item.key ? 'bg-secondary text-white shadow-md' : 'text-on-surface-variant hover:bg-surface-container',
					]"
				>
					<span class="material-symbols-outlined text-[20px]">{{ item.icon }}</span>
					{{ item.label }}
				</NuxtLink>
			</nav>
		</div>
	</aside>
</template>