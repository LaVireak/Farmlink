<template>
  <div class="auth-layout">

    <!-- Back button -->
    <button class="back-btn" @click="$router.back()">
      ← Back
    </button>

    <main class="auth-center">
      <div class="content-shell">
        <NuxtPage />
      </div>
    </main>

  </div>
</template>

<style scoped>
.auth-layout {
	position: relative;
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 24px;
	overflow: hidden;
	background:
		radial-gradient(circle at top left,
			rgba(34, 197, 94, 0.18),
			transparent 28%),
		radial-gradient(circle at bottom right,
			rgba(16, 185, 129, 0.14),
			transparent 30%),
		linear-gradient(135deg, #f4f7f2, #edf3ea);
}

/* floating blur backgrounds */
.auth-layout::before,
.auth-layout::after {
	content: '';
	position: absolute;
	width: 420px;
	height: 420px;
	border-radius: 50%;
	filter: blur(90px);
	opacity: 0.35;
	z-index: 0;
}

.auth-layout::before {
	top: -120px;
	left: -120px;
	background: #4ade80;
}

.auth-layout::after {
	right: -120px;
	bottom: -120px;
	background: #86efac;
}

/* centered auth wrapper */
.auth-center {
	position: relative;
	z-index: 2;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

/* auth content */
.content-shell {
	width: min(1280px, 100%);
}

/* premium back button */
.back-btn {
	position: fixed;
	top: 24px;
	left: 24px;
	z-index: 20;

	display: inline-flex;
	align-items: center;
	gap: 8px;

	height: 46px;
	padding: 0 18px;

	border: 1px solid rgba(255,255,255,0.4);
	border-radius: 999px;

	background: rgba(255,255,255,0.68);
	backdrop-filter: blur(16px);
	-webkit-backdrop-filter: blur(16px);

	color: #0f172a;
	font-size: 14px;
	font-weight: 600;

	cursor: pointer;

	box-shadow:
		0 8px 24px rgba(15,23,42,0.08),
		0 2px 8px rgba(15,23,42,0.04);

	transition:
		transform 0.2s ease,
		box-shadow 0.2s ease,
		background 0.2s ease;
}

.back-btn:hover {
	transform: translateY(-2px);
	background: rgba(255,255,255,0.85);

	box-shadow:
		0 14px 30px rgba(15,23,42,0.12),
		0 6px 12px rgba(15,23,42,0.06);
}

.back-btn:active {
	transform: scale(0.98);
}

/* mobile */
@media (max-width: 768px) {
	.auth-layout {
		padding: 16px;
	}

	.back-btn {
		top: 16px;
		left: 16px;
		height: 42px;
		padding: 0 16px;
		font-size: 13px;
	}
}

</style>