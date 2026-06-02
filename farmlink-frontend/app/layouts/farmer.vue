<template>
  <div class="farmer-layout">
    <FarmerSideBar />
    <div class="farmer-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.farmer-layout {
  display: flex;
  min-height: 100vh;
}

.farmer-content {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
}
</style>