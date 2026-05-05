<template>
  <div class="auth-layout">
    <CommonAppHeader />

    <section class="auth-main">
      <div class="auth-grid">
        <div class="sidebar-shell">
          <!-- <CommonAppSidebar /> -->
        </div>

        <main class="content-shell">
          <NuxtPage />
        </main>
      </div>
    </section>

    <CommonAppFooter />
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background: #f7f8f5;
}

.auth-main {
  width: min(1440px, 100%);
  margin: 0 auto;
  padding: 24px 16px;
}

.auth-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  align-items: start;
}

.sidebar-shell {
  position: sticky;
  top: 16px;
}

.content-shell {
  min-width: 0;
}

@media (max-width: 1024px) {
  .auth-grid {
    grid-template-columns: 1fr;
  }

  .sidebar-shell {
    position: static;
  }
}
</style>
