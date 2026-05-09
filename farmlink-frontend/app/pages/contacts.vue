<template>
    <CommonAppHeader />
	<main class="max-canvas px-12 py-24 bg-gray-200">
		<div class="max-w-6xl mx-auto bg-white border-4 border-black p-12 brutalist-card grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
			<div>
				<h1 class="text-5xl font-black mb-6">Contact Us</h1>
				<p class="mb-6">Have a question or want to collaborate? Reach out to the FarmLink team.</p>
				<form class="grid grid-cols-1 gap-4">
					<input type="text" placeholder="Your name" class="border-2 border-black p-3" />
					<input type="email" placeholder="Your email" class="border-2 border-black p-3" />
					<textarea placeholder="Message" class="border-2 border-black p-3 h-40"></textarea>
					<button class="bg-[#EFCF4F] border-2 border-black px-6 py-3 font-black uppercase">Send Message</button>
				</form>
			</div>
			<div class="flex items-center justify-center">
				<img alt="Contact us illustration" class="w-full max-w-sm object-contain" src="~/assets/images/contact-us.png" />
			</div>
		</div>
	</main>
	<CommonAppFooter />
</template>

<script setup>
// minimal contact page — add handlers as needed
</script>

<style scoped>
.max-canvas { max-width: 1920px; margin: 0 auto; width: 100%; }
.brutalist-card { box-shadow: 8px 8px 0 rgba(26,26,26,1); }
</style>
