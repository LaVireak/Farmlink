<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';

definePageMeta({
	layout: 'user',
});

useHead({
	title: 'Chat with Farmers | FarmLink Cambodia',
});

const contacts = [
	{
		id: 1,
		name: 'Battambang Organic Collective',
		role: 'Farm Cooperative',
		avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxSIvKIuR2BqsWIsER071js2ywfi7CP5m9mS8WzX1VFEam_p3bKUUBDfpomQgp2Uvp2PjuNwLmT8W3GAfvhbsNLcYqc6fyI5e9wOgdOAWo-FXd6TFHIyp7dsEJbVDxVZRQOeoU9AlMe452vG5o6NtXf3wpWD-UQ0ob3tIb47t1MtHcAajUd-XoMjdUUFMwSW7E6uxB2TKRsqLcsulOKrq5i1J28fVvVP_1NUUNa0izLItmVgu8tAz9A7NNfUr1G7xELqixhRGcsMg',
		lastMessage: 'Your lemongrass bundle has been packed and is ready for pickup.',
		time: '10:42 AM',
		unread: 2,
		online: true,
	},
	{
		id: 2,
		name: 'Sovan M.',
		role: 'Delivery Driver',
		avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCue0B4_ZvopNVjR-6-vhcuCHlBeyqg7zLD4Ln8Lzy6pz-pXXbUqyIAKDDWXLfKtGwrnFcCvpSZ1HSIj5FMyjTlFqTB5gTIZYOgJViFeFkjdP8GPGYNmQfd-2t0sPaH3blZFs8euiU8IM6f5SHXLYWeybixRLzRN0nvOFB9wC-RnZZcPwIFw2n8CYmmqEC6vNVz8qH39rxdPEvxhrhaAS6PrEZ3qD4gQY-HpwsWYJBk0jFUpwt4TKjd4G3RVRu1DNXOhu1KzCC-2hU',
		lastMessage: 'I am arriving in 5 minutes.',
		time: 'Yesterday',
		unread: 0,
		online: false,
	},
	{
		id: 3,
		name: 'Kampot Pepper Co-op',
		role: 'Farm',
		avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgMohAYMYvy24VC4cbZzvKKFljvShhZMXBZCF4cf4dZGjsUixpeeKru7S3WtXMiwQp2LBQK0vcuiH1JUUVUBl_9dGrGCBHG-R8rP3dp4z7jl3UA7XRLibf577RhpqmtXpnvJPqvLW3hAxcFqCo0dTs9ZByVvaZpW7a7ZYxV4y-VikVogv2x_qn9Hl8ZeMm0zRoretMsuUe9-3O1eRooYUPF0rvlAWl2jg7RfMPORbcJ93HRuvdIpk7xDT-8ndIrS2uX_Gpi1l-M3M',
		lastMessage: 'Thank you for your order! We hope you enjoy the pepper.',
		time: 'Mon',
		unread: 0,
		online: true,
	},
];

const activeContactId = ref(1);
const newMessage = ref('');
const messagesContainer = ref<HTMLElement | null>(null);

const activeContact = computed(() => contacts.find((c) => c.id === activeContactId.value));

// Per-contact message history keyed by contact ID
const allMessages = ref<Record<number, Array<{ id: number; sender: string; text: string; time: string }>>>({
	1: [
		{ id: 1, sender: 'farmer', text: 'Hello! Thank you for ordering from our collective. We are preparing your Fresh Lemongrass and Dragon Fruit.', time: '10:30 AM' },
		{ id: 2, sender: 'user', text: 'Hi! Could you make sure the lemongrass is extra fresh? I need it for a soup tonight.', time: '10:35 AM' },
		{ id: 3, sender: 'farmer', text: 'Absolutely. We will pick the best stalks for you. Your lemongrass bundle has been packed and is ready for pickup.', time: '10:42 AM' },
	],
	2: [
		{ id: 1, sender: 'farmer', text: 'I am on my way with your delivery!', time: 'Yesterday' },
		{ id: 2, sender: 'farmer', text: 'I am arriving in 5 minutes.', time: 'Yesterday' },
	],
	3: [
		{ id: 1, sender: 'farmer', text: 'Thank you for your order! We hope you enjoy the Kampot pepper.', time: 'Mon' },
	],
});

const messages = computed(() => allMessages.value[activeContactId.value] ?? []);

const scrollToBottom = async () => {
	await nextTick();
	if (messagesContainer.value) {
		messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
	}
};

const sendMessage = () => {
	if (!newMessage.value.trim()) return;
	const contactId = activeContactId.value;
	if (!allMessages.value[contactId]) {
		allMessages.value[contactId] = [];
	}
	allMessages.value[contactId].push({
		id: Date.now(),
		sender: 'user',
		text: newMessage.value,
		time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
	});
	newMessage.value = '';
	scrollToBottom();
};
</script>

<template>
	<div class="min-h-screen flex flex-col bg-[#fbf9f6] text-zinc-900">
		<CommonAppHeader />

		<main class="max-w-7xl mx-auto w-full pt-28 sm:pt-32 px-4 sm:px-6 lg:px-8 flex-1 flex flex-col pb-8">
			<div class="flex flex-col md:flex-row gap-8 md:gap-10 flex-1">
				<CommonAppSidebar active="chat" />

				<!-- Chat Panel: fixed height, fills remaining vertical space -->
				<div class="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden" style="height: calc(100vh - 180px); min-height: 500px;">

					<!-- ── Contacts Sidebar ─────────────────────────────── -->
					<div class="w-full lg:w-80 flex-shrink-0 flex flex-col bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
						<!-- Fixed Header -->
						<div class="flex-shrink-0 p-5 border-b border-zinc-100">
							<h2 class="font-[Manrope,sans-serif] font-black text-[#154212] text-2xl mb-4">Messages</h2>
							<div class="relative">
								<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" style="font-size: 18px;">search</span>
								<input
									type="text"
									placeholder="Search farmers..."
									class="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 pl-9 pr-4 text-sm font-medium focus:outline-none focus:border-[#006e1c] focus:ring-1 focus:ring-[#006e1c] transition-all"
								/>
							</div>
						</div>

						<!-- Scrollable Contacts List -->
						<div class="flex-1 overflow-y-auto">
							<button
								v-for="contact in contacts"
								:key="contact.id"
								@click="activeContactId = contact.id"
								:class="[
									'w-full text-left p-4 border-b border-zinc-50 flex items-center gap-3 transition-colors hover:bg-zinc-50 border-l-4',
									activeContactId === contact.id ? 'bg-[#154212]/5 border-l-[#154212]' : 'border-l-transparent',
								]"
							>
								<div class="relative flex-shrink-0">
									<div class="w-11 h-11 rounded-full overflow-hidden bg-zinc-100">
										<img :src="contact.avatar" alt="" class="w-full h-full object-cover" />
									</div>
									<span v-if="contact.online" class="absolute bottom-0 right-0 w-3 h-3 bg-[#006e1c] border-2 border-white rounded-full"></span>
								</div>
								<div class="flex-1 min-w-0">
									<div class="flex justify-between items-baseline gap-1">
										<h3 class="font-black text-[#154212] text-sm truncate">{{ contact.name }}</h3>
										<span :class="['text-[10px] font-bold whitespace-nowrap flex-shrink-0', contact.unread ? 'text-[#006e1c]' : 'text-zinc-400']">{{ contact.time }}</span>
									</div>
									<div class="flex items-center justify-between gap-2 mt-0.5">
										<p :class="['text-xs truncate leading-relaxed flex-1', contact.unread ? 'font-bold text-zinc-800' : 'text-zinc-500 font-medium']">
											{{ contact.lastMessage }}
										</p>
										<div v-if="contact.unread" class="w-5 h-5 rounded-full bg-[#006e1c] text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">
											{{ contact.unread }}
										</div>
									</div>
								</div>
							</button>
						</div>
					</div>

					<!-- ── Active Chat Area ─────────────────────────────── -->
					<div class="flex-1 flex flex-col bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden min-w-0">
						<template v-if="activeContact">
							<!-- Fixed Chat Header -->
							<div class="flex-shrink-0 px-5 py-4 border-b border-zinc-100 flex justify-between items-center bg-white">
								<div class="flex items-center gap-4">
									<div class="w-11 h-11 rounded-full overflow-hidden bg-zinc-100 flex-shrink-0">
										<img :src="activeContact.avatar" alt="" class="w-full h-full object-cover" />
									</div>
									<div>
										<h3 class="font-[Manrope,sans-serif] font-black text-[#154212] text-lg leading-tight">{{ activeContact.name }}</h3>
										<div class="flex items-center gap-1.5 mt-0.5">
											<span v-if="activeContact.online" class="w-1.5 h-1.5 rounded-full bg-[#006e1c]"></span>
											<p class="text-[11px] font-black text-zinc-400 uppercase tracking-widest">
												{{ activeContact.online ? 'Online' : 'Offline' }} · {{ activeContact.role }}
											</p>
										</div>
									</div>
								</div>
								<button class="hidden sm:flex text-xs font-black text-[#154212] border-2 border-zinc-100 px-4 py-2 rounded-xl uppercase tracking-widest hover:border-[#154212] transition-colors items-center gap-2 flex-shrink-0">
									<span class="material-symbols-outlined text-[16px]">storefront</span>
									View Profile
								</button>
							</div>

							<!-- Scrollable Messages Area -->
							<div ref="messagesContainer" class="flex-1 overflow-y-auto p-5 bg-[#fbf9f6] flex flex-col gap-5 min-h-0">
								<!-- Order Context Card -->
								<div v-if="activeContactId === 1" class="mx-auto bg-white border border-zinc-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm w-full max-w-xs">
									<div class="w-12 h-12 rounded-xl bg-zinc-100 overflow-hidden flex-shrink-0">
										<img
											src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqFGCLcaSnsiHLfx9CT6itTYTbN6WQ7hCftSWcqKQ1VSPk-l55y8pU0aTFRc4t-EBoPag53SJyx1J2Kw9ivn21ac0u_TqbMbYAhS9zTQcP3uCh0R2QvdAFHZAKY3eYkKSmQ0U2WlcGxSuQAypFiiPs6Rtkk-xVO7wCHiRQmn5mSPHv6reVWlYprPMY-C5Kk_sOXBvf3A0fpa2N8eFPzoCR2xrASc_1tzDRO9ZXm62SNEegD3pC_-XWKwRSQyciOHw33mzhm3WTO4k"
											class="w-full h-full object-cover"
										/>
									</div>
									<div>
										<p class="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Regarding Order #FL-9044</p>
										<p class="text-sm font-black font-[Manrope,sans-serif] text-[#154212]">Fresh Lemongrass Bundle</p>
										<NuxtLink to="/user/settings/orders/FL-9044" class="text-[10px] font-black text-[#006e1c] uppercase tracking-widest hover:underline mt-1 inline-block">
											View Details
										</NuxtLink>
									</div>
								</div>

								<!-- Date Divider -->
								<div class="flex items-center gap-3">
									<div class="h-px bg-zinc-200 flex-1"></div>
									<span class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Today</span>
									<div class="h-px bg-zinc-200 flex-1"></div>
								</div>

								<!-- Message Bubbles -->
								<div v-for="msg in messages" :key="msg.id" :class="['flex w-full', msg.sender === 'user' ? 'justify-end' : 'justify-start']">
									<div :class="['max-w-[80%] flex flex-col', msg.sender === 'user' ? 'items-end' : 'items-start']">
										<div
											:class="[
												'px-4 py-3 rounded-2xl text-[15px] font-medium leading-relaxed',
												msg.sender === 'user'
													? 'bg-[#154212] text-white rounded-br-sm'
													: 'bg-white text-zinc-800 border border-zinc-200 rounded-bl-sm shadow-sm',
											]"
										>
											{{ msg.text }}
										</div>
										<div :class="['flex items-center gap-1 mt-1 px-1', msg.sender === 'user' ? 'flex-row-reverse' : '']">
											<span class="text-[10px] font-bold text-zinc-400">{{ msg.time }}</span>
											<span v-if="msg.sender === 'user'" class="material-symbols-outlined text-[13px] text-[#006e1c]">done_all</span>
										</div>
									</div>
								</div>
							</div>

							<!-- Fixed Input Area -->
							<div class="flex-shrink-0 p-4 bg-white border-t border-zinc-100">
								<form @submit.prevent="sendMessage" class="flex items-center gap-3">
									<button type="button" class="p-2.5 text-zinc-400 hover:text-[#154212] transition-colors rounded-xl hover:bg-zinc-50 flex-shrink-0">
										<span class="material-symbols-outlined">add_photo_alternate</span>
									</button>
									<input
										v-model="newMessage"
										type="text"
										:placeholder="'Type a message to ' + activeContact.name.split(' ')[0] + '...'"
										class="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:border-[#006e1c] focus:ring-1 focus:ring-[#006e1c] transition-all min-w-0"
										@keydown.enter.prevent="sendMessage"
									/>
									<button
										type="submit"
										:disabled="!newMessage.trim()"
										:class="[
											'p-3 rounded-xl flex items-center justify-center transition-all flex-shrink-0',
											newMessage.trim() ? 'bg-[#563000] text-white hover:bg-[#3d2200] shadow-md' : 'bg-zinc-100 text-zinc-300 cursor-not-allowed',
										]"
									>
										<span class="material-symbols-outlined">send</span>
									</button>
								</form>
							</div>
						</template>

						<!-- Empty State -->
						<div v-else class="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#fbf9f6]">
							<div class="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-zinc-100 mb-5">
								<span class="material-symbols-outlined text-4xl text-zinc-300">forum</span>
							</div>
							<h3 class="font-[Manrope,sans-serif] font-black text-2xl text-[#154212] mb-2">Select a conversation</h3>
							<p class="text-zinc-500 font-medium max-w-sm text-sm">Choose a farmer or driver from the sidebar to view your messages.</p>
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
/* Slim, clean scrollbar for both panes */
.overflow-y-auto {
	scrollbar-width: thin;
	scrollbar-color: #e4e4e7 transparent;
}
.overflow-y-auto::-webkit-scrollbar {
	width: 5px;
}
.overflow-y-auto::-webkit-scrollbar-track {
	background: transparent;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
	background-color: #e4e4e7;
	border-radius: 20px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
	background-color: #d4d4d8;
}
</style>
