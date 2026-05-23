<template>
  <div class="error-page">
    <CommonAppHeader />

    <main class="error-main">
      <div class="error-container">
        <div class="error-content">
          <div class="error-code">404</div>
          <h1>Page Not Found</h1>
          <p class="error-message">
            Sorry, the page you're looking for doesn't exist or you don't have permission to access it.
          </p>
          <div class="actions">
            <NuxtLink to="/" class="btn primary">
              Back to Home
            </NuxtLink>
            <NuxtLink to="/user/products" class="btn secondary">
              Browse Products
            </NuxtLink>
          </div>
        </div>

        <div class="error-illustration">
          <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <circle cx="200" cy="200" r="180" fill="rgba(56, 176, 0, 0.1)" />
            <text x="200" y="220" font-size="120" font-weight="bold" text-anchor="middle" fill="#38b000" opacity="0.3">
              404
            </text>
            <circle cx="150" cy="150" r="30" fill="none" stroke="#38b000" stroke-width="2" opacity="0.5" />
            <circle cx="250" cy="150" r="30" fill="none" stroke="#38b000" stroke-width="2" opacity="0.5" />
            <path d="M 150 200 Q 200 240 250 200" stroke="#38b000" stroke-width="2" fill="none" opacity="0.5" />
          </svg>
        </div>
      </div>
    </main>

    <CommonAppFooter />
  </div>
</template>

<style scoped>
.error-page {
  background: linear-gradient(
    135deg,
    rgba(56, 176, 0, 0.05),
    rgba(240, 201, 74, 0.05)
  );
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.error-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 18px;
}

.error-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  max-width: 1200px;
  align-items: center;
}

.error-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.error-code {
  font-size: 96px;
  font-weight: 900;
  color: #38b000;
  line-height: 1;
}

.error-content h1 {
  font-size: 48px;
  font-weight: 900;
  color: #132a13;
  line-height: 1.2;
}

.error-message {
  font-size: 18px;
  color: #666;
  line-height: 1.6;
  max-width: 500px;
}

.actions {
  display: flex;
  gap: 16px;
  margin-top: 20px;
}

.btn {
  padding: 14px 24px;
  border-radius: 14px;
  text-decoration: none;
  font-weight: 700;
  transition: 0.3s ease;
  display: inline-block;
  text-align: center;
}

.btn:hover {
  transform: translateY(-4px);
}

.btn.primary {
  background: linear-gradient(135deg, #38b000, #008000);
  color: white;
}

.btn.secondary {
  background: rgba(56, 176, 0, 0.12);
  border: 1px solid rgba(56, 176, 0, 0.3);
  color: #38b000;
}

.error-illustration {
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-illustration svg {
  width: 100%;
  max-width: 300px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@media (max-width: 900px) {
  .error-container {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .error-code {
    font-size: 72px;
  }

  .error-content h1 {
    font-size: 36px;
  }

  .actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
