<template>
  <div class="home-page">
    <CommonAppHeader />

    <main class="home-main">

      <!-- HERO -->
      <section class="hero-shell">
        <img
          class="hero-image"
          src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=2000&q=80"
          alt="Farm"
        />

        <div class="hero-overlay"></div>

        <div class="hero-glow glow-1"></div>
        <div class="hero-glow glow-2"></div>

        <div class="hero-inner">

          <!-- LEFT -->
          <div class="hero-left">

            <span class="pill">
              {{ t('home.brandBadge') }}
            </span>

            <h1>
              {{ t('home.heroTitle1') }}
              <span>{{ t('home.heroTitleHighlight') }}</span>
              {{ t('home.heroTitle2') }}
            </h1>

            <p class="lead">
              {{ t('home.heroLead') }}
            </p>

            <div class="actions">
              <NuxtLink
                to="/user/products"
                class="btn primary"
              >
                {{ t('home.exploreProducts') }}
              </NuxtLink>

              <NuxtLink
                to="/about"
                class="btn secondary"
              >
                {{ t('home.learnMore') }}
              </NuxtLink>
            </div>

            <div class="hero-stats">

              <div class="stat-card">
                <strong>240+</strong>
                <span>{{ t('home.partnerFarms') }}</span>
              </div>

              <div class="stat-card">
                <strong>24h</strong>
                <span>{{ t('home.fastDelivery') }}</span>
              </div>

              <div class="stat-card">
                <strong>4.9★</strong>
                <span>{{ t('home.customerRating') }}</span>
              </div>

            </div>
          </div>

          <!-- RIGHT FLOATING CARD -->
          <div class="hero-floating-card">

            <h3>{{ t('home.todayFreshPicks') }}</h3>

            <div class="floating-product">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
              />

              <div>
                <strong>Organic Greens</strong>
                <p>Harvested 3 hours ago</p>
              </div>
            </div>

            <div class="floating-product">
              <img
                src="https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80"
              />

              <div>
                <strong>Sweet Mangoes</strong>
                <p>Fresh from Battambang</p>
              </div>
            </div>

            <div class="floating-product">
              <img
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"
              />

              <div>
                <strong>Fresh Tomatoes</strong>
                <p>Picked this morning</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      <!-- PRODUCTS -->
      <section class="section">

        <div class="section-head">
          <h2>{{ t('home.popularProducts') }}</h2>

          <NuxtLink
            to="/user/products"
            class="view-all"
          >
            {{ t('home.browseAll') }} →
          </NuxtLink>
        </div>

        <div class="products-grid">

          <article
            class="product"
            v-for="p in products"
            :key="p.id"
          >
            <img :src="p.image" :alt="p.name" />

            <div class="product-body">

              <h3>{{ p.name }}</h3>

              <p class="muted">
                {{ p.excerpt }}
              </p>

              <div class="product-row">
                <strong class="price">
                  {{ p.price }}
                </strong>

                <NuxtLink
                  :to="`/user/products/${p.id}`"
                  class="view-product"
                >
                  {{ t('home.view') }} →
                </NuxtLink>
              </div>

            </div>
          </article>

        </div>
      </section>

      <!-- FARMS BY PROVINCE -->
      <section class="section">

        <div class="section-head">
          <h2>{{ t('home.farmsAcrossCambodia') }}</h2>

          <NuxtLink
            to="/about"
            class="view-all"
          >
            {{ t('home.exploreProvinces') }} →
          </NuxtLink>
        </div>

        <div class="province-grid">

          <article
            class="province-card"
            v-for="farm in provinceFarms"
            :key="farm.name"
          >

            <img
              :src="farm.image"
              :alt="farm.name"
            />

            <div class="province-overlay"></div>

            <div class="province-content">

              <span class="province-badge">
                {{ farm.province }}
              </span>

              <h3>{{ farm.name }}</h3>

              <p>
                {{ farm.description }}
              </p>

              <div class="province-footer">
                <span>{{ farm.products }}</span>
                <span class="rating">★ {{ farm.rating }}</span>
              </div>

            </div>

          </article>

        </div>
      </section>

      <!-- BLOG -->
      <section class="section">

        <div class="section-head">
          <h2>{{ t('home.latestStories') }}</h2>

          <NuxtLink
            to="/about"
            class="view-all"
          >
            {{ t('home.readJournal') }} →
          </NuxtLink>
        </div>

        <div class="marquee-wrap">

          <div class="marquee-track">

            <article
              class="blog"
              v-for="post in blogPosts"
              :key="'b1' + post.title"
            >
              <img :src="post.image" />

              <div class="blog-body">

                <span class="tag">
                  {{ post.tag }}
                </span>

                <h3>{{ post.title }}</h3>

                <p class="muted">
                  {{ post.excerpt }}
                </p>

              </div>
            </article>

            <!-- duplicate -->
            <article
              class="blog"
              v-for="post in blogPosts"
              :key="'b2' + post.title"
            >
              <img :src="post.image" />

              <div class="blog-body">

                <span class="tag">
                  {{ post.tag }}
                </span>

                <h3>{{ post.title }}</h3>

                <p class="muted">
                  {{ post.excerpt }}
                </p>

              </div>
            </article>

          </div>
        </div>
      </section>

      <!-- REVIEWS -->
      <section class="section">

        <div class="section-head">
          <h2>{{ t('home.communityReviews') }}</h2>

          <div class="score">
            {{ t('home.score') }}
          </div>
        </div>

        <div class="marquee-wrap">

          <div class="marquee-track reverse">

            <article
              class="review"
              v-for="r in reviews"
              :key="'r1' + r.name"
            >

              <div class="review-top">

                <img :src="r.avatar" />

                <div>
                  <strong>{{ r.name }}</strong>
                  <p class="muted">{{ r.role }}</p>
                </div>

              </div>

              <div class="quote">
                "{{ r.quote }}"
              </div>

            </article>

            <!-- duplicate -->
            <article
              class="review"
              v-for="r in reviews"
              :key="'r2' + r.name"
            >

              <div class="review-top">

                <img :src="r.avatar" />

                <div>
                  <strong>{{ r.name }}</strong>
                  <p class="muted">{{ r.role }}</p>
                </div>

              </div>

              <div class="quote">
                "{{ r.quote }}"
              </div>

            </article>

          </div>
        </div>
      </section>

    </main>

    <CommonAppFooter />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const { t } = useI18n()

const products = computed(() => [
  {
    id: '1',
    name: t('home.products.greens.name'),
    excerpt: t('home.products.greens.excerpt'),
    price: '$6.50',
    image:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: '2',
    name: t('home.products.mangoes.name'),
    excerpt: t('home.products.mangoes.excerpt'),
    price: '$4.20',
    image:
      'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: '3',
    name: t('home.products.tomatoes.name'),
    excerpt: t('home.products.tomatoes.excerpt'),
    price: '$3.20',
    image:
      'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=80'
  }
])

const provinceFarms = computed(() => [
  { name: t('home.farms.takeo.name'), province: 'Takeo', description: t('home.farms.takeo.description'), products: t('home.farms.takeo.products'), rating: '4.9', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80' },
  { name: t('home.farms.battambang.name'), province: 'Battambang', description: t('home.farms.battambang.description'), products: t('home.farms.battambang.products'), rating: '4.8', image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80' },
  { name: t('home.farms.kampot.name'), province: 'Kampot', description: t('home.farms.kampot.description'), products: t('home.farms.kampot.products'), rating: '5.0', image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=1200&q=80' },
  { name: t('home.farms.siemReap.name'), province: 'Siem Reap', description: t('home.farms.siemReap.description'), products: t('home.farms.siemReap.products'), rating: '4.9', image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1200&q=80' }
])

const blogPosts = computed(() => [
  { title: t('home.stories.takeo.title'), tag: t('home.stories.takeo.tag'), excerpt: t('home.stories.takeo.excerpt'), image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80' },
  { title: t('home.stories.cooking.title'), tag: t('home.stories.cooking.tag'), excerpt: t('home.stories.cooking.excerpt'), image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80' }
])

const reviews = computed(() => [
  { name: 'Sopheap N.', role: t('home.reviews.sopheap.role'), quote: t('home.reviews.sopheap.quote'), avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
  { name: 'Vannak R.', role: t('home.reviews.vannak.role'), quote: t('home.reviews.vannak.quote'), avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' }
])
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

.home-page {
  background:
    radial-gradient(circle at top left, rgba(144,238,144,0.15), transparent 30%),
    radial-gradient(circle at bottom right, rgba(240,201,74,0.15), transparent 30%),
    #fffdf4;

  min-height: 100vh;
  color: #132a13;
  font-family: Inter, sans-serif;
}

.home-main {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 80px;
}

/* HERO */

.hero-shell {
  position: relative;
  min-height: 100vh;
  border-radius: 32px;
  overflow: hidden;
}

.hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    110deg,
    rgba(0,0,0,0.78),
    rgba(0,0,0,0.25)
  );
}

.hero-glow {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 999px;
  filter: blur(120px);
}

.glow-1 {
  background: #38b000;
  top: -120px;
  left: -120px;
}

.glow-2 {
  background: #f0c94a;
  bottom: -120px;
  right: -120px;
}

.hero-inner {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 420px;
  align-items: center;
  gap: 60px;
  padding: 80px;
}

.hero-left {
  color: white;
}

.pill {
  display: inline-block;
  padding: 8px 18px;
  border-radius: 999px;
  background: rgba(255,255,255,0.14);
  backdrop-filter: blur(12px);
  font-weight: 700;
}

.hero-left h1 {
  font-size: clamp(54px, 8vw, 92px);
  line-height: 1;
  margin: 24px 0;
  font-weight: 900;
}

.hero-left h1 span {
  display: block;
  color: #9ef01a;
}

.lead {
  max-width: 620px;
  line-height: 1.8;
  color: rgba(255,255,255,0.8);
}

.actions {
  display: flex;
  gap: 16px;
  margin-top: 32px;
}

.btn {
  padding: 14px 24px;
  border-radius: 14px;
  text-decoration: none;
  font-weight: 700;
  transition: 0.3s ease;
}

.btn:hover {
  transform: translateY(-4px);
}

.btn.primary {
  background: linear-gradient(135deg,#38b000,#008000);
  color: white;
}

.btn.secondary {
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.12);
  color: white;
}

.hero-stats {
  display: flex;
  gap: 18px;
  margin-top: 42px;
}

.stat-card {
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(18px);
  border-radius: 18px;
  padding: 18px 22px;
}

.stat-card strong {
  display: block;
  font-size: 24px;
}

.hero-floating-card {
  background: rgba(255,255,255,0.12);
  border-radius: 28px;
  backdrop-filter: blur(20px);
  padding: 28px;
  color: white;
  animation: floatCard 5s ease-in-out infinite;
}

.hero-floating-card h3 {
  margin-bottom: 18px;
}

.floating-product {
  display: flex;
  gap: 14px;
  margin-top: 18px;
  padding: 12px;
  border-radius: 18px;
  background: rgba(255,255,255,0.08);
}

.floating-product img {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 14px;
}

@keyframes floatCard {
  0%,100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-12px);
  }
}

/* SECTION */

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-head h2 {
  font-size: 42px;
  font-weight: 900;
}

.view-all {
  color: #2d6a4f;
  font-weight: 700;
  text-decoration: none;
}

/* PRODUCTS */

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.product {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0,0,0,0.05);
  transition: 0.4s ease;
}

.product:hover {
  transform: translateY(-12px);
}

.product img {
  width: 100%;
  height: 240px;
  object-fit: cover;
}

.product-body {
  padding: 20px;
}

.product-row {
  display: flex;
  justify-content: space-between;
  margin-top: 18px;
}

.price {
  color: #38b000;
}

.view-product {
  color: #2d6a4f;
  text-decoration: none;
  font-weight: 700;
}

/* MARQUEE */

.marquee-wrap {
  overflow: hidden;
  position: relative;
}

.marquee-track {
  display: flex;
  gap: 24px;
  width: max-content;
  animation: scrollLeft 30s linear infinite;
}

.marquee-track.reverse {
  animation: scrollRight 30s linear infinite;
}

.marquee-track:hover {
  animation-play-state: paused;
}

@keyframes scrollLeft {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

@keyframes scrollRight {
  from {
    transform: translateX(-50%);
  }

  to {
    transform: translateX(0);
  }
}

/* PROVINCE FARMS */

.province-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.province-card {
  position: relative;
  height: 420px;
  border-radius: 28px;
  overflow: hidden;
  cursor: pointer;
  transition: 0.5s ease;
}

.province-card:hover {
  transform: translateY(-10px);
}

.province-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: 0.6s ease;
}

.province-card:hover img {
  transform: scale(1.08);
}

.province-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0,0,0,0.78),
    rgba(0,0,0,0.12)
  );
}

.province-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 28px;
  color: white;
  z-index: 2;
}

.province-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(255,255,255,0.14);
  backdrop-filter: blur(12px);
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 14px;
}

.province-content h3 {
  font-size: 26px;
  margin-bottom: 12px;
}

.province-content p {
  color: rgba(255,255,255,0.82);
  line-height: 1.7;
  margin-bottom: 18px;
}

.province-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.rating {
  color: #ffd166;
  font-weight: 700;
}

@media (max-width: 1100px) {
  .province-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 700px) {
  .province-grid {
    grid-template-columns: 1fr;
  }

  .province-card {
    height: 360px;
  }
}

/* BLOG */

.blog {
  flex: 0 0 360px;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0,0,0,0.05);
  transition: 0.4s ease;
}

.blog:hover {
  transform: translateY(-10px);
}

.blog img {
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.blog-body {
  padding: 20px;
}

.tag {
  display: inline-block;
  background: #f0c94a;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 12px;
}

.blog h3 {
  margin: 14px 0;
}

/* REVIEWS */

.review {
  flex: 0 0 360px;
  background: white;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.05);
}

.review-top {
  display: flex;
  align-items: center;
  gap: 12px;
}

.review-top img {
  width: 56px;
  height: 56px;
  border-radius: 999px;
}

.quote {
  margin-top: 18px;
  line-height: 1.8;
  font-style: italic;
}

.muted {
  color: #666;
}

/* MOBILE */

@media (max-width: 900px) {

  .hero-inner {
    grid-template-columns: 1fr;
    padding: 32px;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .hero-stats {
    flex-direction: column;
  }

  .blog,
  .review {
    flex: 0 0 300px;
  }

  .hero-left h1 {
    font-size: 54px;
  }

}
</style>