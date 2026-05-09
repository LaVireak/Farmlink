<template>
	<div class="recover-container">
		<div class="card">
			<div class="icon">i</div>

			<h2>Recover your account</h2>
			<p class="subtitle">
				Enter your email address and we’ll send you a link to reset your password.
			</p>

			<form @submit.prevent="handleSubmit">
				<label for="email">EMAIL ADDRESS</label>
				<input
					id="email"
					type="email"
					v-model="email"
					placeholder="hello@garden.com"
					required
				>

				<button type="submit" :disabled="loading">
					<span v-if="loading">Sending...</span>
					<span v-else>Send Reset Link →</span>
				</button>
			</form>

			<p v-if="error" class="error-message">{{ error }}</p>
			<p class="back" @click="goBack">← Back to Sign In</p>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const loading = ref(false);
const error = ref('');
const router = useRouter();

const handleSubmit = async () => {
	if (!email.value) return;
	loading.value = true;
	error.value = '';
	try {
		// TODO: replace with real forgot-password API call when backend is ready.
		await new Promise((resolve) => setTimeout(resolve, 700));
		await router.push(`/auth/verify-code?email=${encodeURIComponent(email.value)}`);
	} catch (err: unknown) {
		error.value = err instanceof Error ? err.message : 'Something went wrong.';
	} finally {
		loading.value = false;
	}
};

const goBack = () => {
	router.push('/auth/signin');
};
</script>

<style scoped>
.recover-container {
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	background: #f5f5f5;
}

.card {
	width: 360px;
	padding: 30px;
	background: #ffffff;
	border-radius: 16px;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
	text-align: center;
}

.icon {
	width: 36px;
	height: 36px;
	margin: 0 auto 10px;
	border-radius: 50%;
	background: #d8e8c8;
	color: #2f5d2f;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: bold;
}

h2 {
	margin: 10px 0;
	font-size: 22px;
}

.subtitle {
	font-size: 14px;
	color: #666;
	margin-bottom: 20px;
}

form {
	display: flex;
	flex-direction: column;
	text-align: left;
}

label {
	font-size: 12px;
	margin-bottom: 5px;
	color: #555;
}

input {
	padding: 10px;
	border-radius: 6px;
	border: none;
	background: #f3ecd9;
	margin-bottom: 15px;
}

button {
	background: #1f4d1f;
	color: white;
	padding: 12px;
	border: none;
	border-radius: 25px;
	cursor: pointer;
	font-weight: 500;
}

button:disabled {
	opacity: 0.7;
	cursor: not-allowed;
}

button:hover:not(:disabled) {
	background: #163a16;
}

.back {
	margin-top: 15px;
	font-size: 13px;
	color: #2f5d2f;
	cursor: pointer;
}

.error-message {
	color: #c0392b;
	margin-top: 10px;
	font-size: 14px;
}
</style>
