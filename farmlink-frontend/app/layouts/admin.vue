<template>
  <div class="min-h-screen flex flex-col">
    <AdminHeader />

    <div class="flex flex-1">
      <AdminSidebar />

      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>