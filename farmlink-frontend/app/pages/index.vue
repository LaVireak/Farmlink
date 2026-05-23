<template>
  <div class="home-page">
    <CommonAppHeader />

    <!-- HERO SECTION -->
    <section class="hero-section-full">
      <img
        class="hero-bg-image"
        src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=2000&q=80"
        alt="Lush sunlit organic vegetable farm crops"
      />
      <div class="hero-dark-overlay"></div>
      <div class="hero-ambient-glow glow-left"></div>
      <div class="hero-ambient-glow glow-right"></div>

      <div class="hero-inner-container">
        <div class="hero-left-content">
          <span class="elegant-pill">
            <span class="material-symbols-outlined icon-spin-eco">eco</span>
            {{ t('home.brandBadge') }}
          </span>
          <h1>
            {{ t('home.heroTitle1') }}
            <span class="glowing-highlight">{{ t('home.heroTitleHighlight') }}</span>
            {{ t('home.heroTitle2') }}
          </h1>
          <p class="lead-text">{{ t('home.heroLead') }}</p>

          <div class="hero-cta-actions">
            <NuxtLink to="/user/products" class="btn-elegant primary">
              <span>{{ t('home.exploreProducts') }}</span>
            </NuxtLink>
            <NuxtLink to="/about" class="btn-elegant secondary">
              <span>{{ t('home.learnMore') }}</span>
              <span class="material-symbols-outlined">arrow_forward</span>
            </NuxtLink>
          </div>

          <div class="hero-stats-row">
            <div class="stat-bubble"><strong>240+</strong><span>{{ t('home.partnerFarms') }}</span></div>
            <div class="stat-bubble"><strong>24h</strong><span>{{ t('home.fastDelivery') }}</span></div>
            <div class="stat-bubble"><strong>4.9★</strong><span>{{ t('home.customerRating') }}</span></div>
          </div>
        </div>

        <div class="hero-right-content">
          <div class="glass-picks-widget">
            <div class="glass-widget-header">
              <span class="pulse-indicator"></span>
              <h3>{{ t('home.todayFreshPicks') }}</h3>
            </div>
            <div class="glass-widget-list">
              <div class="glass-pick-row">
                <img src="https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=200&q=80" alt="Organic Greens" />
                <div class="pick-meta">
                  <strong>{{ t('home.featuredPicks.greens.name') }}</strong>
                  <p>{{ t('home.featuredPicks.greens.excerpt') }}</p>
                </div>
                <span class="pick-price">$6.50</span>
              </div>
              <div class="glass-pick-row">
                <img src="https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=200&q=80" alt="Sweet Mangoes" />
                <div class="pick-meta">
                  <strong>{{ t('home.featuredPicks.mangoes.name') }}</strong>
                  <p>{{ t('home.featuredPicks.mangoes.excerpt') }}</p>
                </div>
                <span class="pick-price">$4.20</span>
              </div>
              <div class="glass-pick-row">
                <img src="https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=200&q=80" alt="Fresh Tomatoes" />
                <div class="pick-meta">
                  <strong>{{ t('home.featuredPicks.tomatoes.name') }}</strong>
                  <p>{{ t('home.featuredPicks.tomatoes.excerpt') }}</p>
                </div>
                <span class="pick-price">$3.20</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <main class="home-main">
      <!-- CATEGORIES SECTION -->
      <section class="section categories-section">
        <div class="section-head center">
          <span class="subtitle">{{ t('home.quickBrowse') }}</span>
          <h2>{{ t('home.exploreCategories') }}</h2>
        </div>
        <div class="categories-grid">
          <NuxtLink to="/user/products?category=vegetables" class="category-pill-card card-veg">
            <div class="icon-circle bg-green"><span class="material-symbols-outlined">eco</span></div>
            <div class="card-info">
              <span>{{ t('common.vegetables') }}</span>
              <p class="card-desc">{{ t('common.allVegetables') }}</p>
            </div>
            <span class="chevron-arrow material-symbols-outlined">arrow_forward</span>
          </NuxtLink>
          <NuxtLink to="/user/products?category=fruits" class="category-pill-card card-fruit">
            <div class="icon-circle bg-yellow"><span class="material-symbols-outlined">spa</span></div>
            <div class="card-info">
              <span>{{ t('common.fruits') }}</span>
              <p class="card-desc">{{ t('common.allFruits') }}</p>
            </div>
            <span class="chevron-arrow material-symbols-outlined">arrow_forward</span>
          </NuxtLink>
          <NuxtLink to="/user/products?category=supplies" class="category-pill-card card-supplies">
            <div class="icon-circle bg-orange"><span class="material-symbols-outlined">potted_plant</span></div>
            <div class="card-info">
              <span>{{ t('common.toolsEquipment') }}</span>
              <p class="card-desc">{{ t('common.allSupplies') }}</p>
            </div>
            <span class="chevron-arrow material-symbols-outlined">arrow_forward</span>
          </NuxtLink>
          <NuxtLink to="/user/products?category=all-organic" class="category-pill-card card-organic">
            <div class="icon-circle bg-red"><span class="material-symbols-outlined">local_florist</span></div>
            <div class="card-info">
              <span>{{ t('common.organicFresh') }}</span>
              <p class="card-desc">{{ t('common.shopAllCategories') }}</p>
            </div>
            <span class="chevron-arrow material-symbols-outlined">arrow_forward</span>
          </NuxtLink>
        </div>
      </section>

      <!-- DYNAMIC PRODUCTS SECTION -->
      <section class="section products-section">
        <div class="section-head">
          <div>
            <span class="subtitle">{{ t('common.popular') }}</span>
            <h2>{{ t('home.popularProducts') }}</h2>
          </div>
          <NuxtLink to="/user/products" class="view-all">
            <span>{{ t('home.browseAll') }}</span>
            <span class="material-symbols-outlined">arrow_right_alt</span>
          </NuxtLink>
        </div>

        <div class="products-grid">
          <article v-for="p in products" :key="p.id" class="product-card">
            <div class="product-img-wrap">
              <img :src="p.image" :alt="t(p.keyPrefix + '.name')" loading="lazy" />
              <span class="popular-badge">{{ t('common.popular') }}</span>
            </div>
            <div class="product-body">
              <div class="product-meta-row">
                <span class="category-tag">{{ t('common.popular') }}</span>
                <span class="product-rating"><span class="star-icon">★</span> 4.9</span>
              </div>
              <h3>{{ t(p.keyPrefix + '.name') }}</h3>
              <p class="muted-text">{{ t(p.keyPrefix + '.excerpt') }}</p>
              <div class="product-row">
                <strong class="price">{{ p.price }}</strong>
                <NuxtLink :to="`/user/products/${p.id}`" class="view-product-btn">
                  <span>{{ t('home.view') }}</span>
                  <span class="material-symbols-outlined">visibility</span>
                </NuxtLink>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- DYNAMIC PROVINCES/FARMS SECTION -->
      <section class="section provinces-section">
        <div class="section-head">
          <div>
            <span class="subtitle">{{ t('common.farm') }}</span>
            <h2>{{ t('home.farmsAcrossCambodia') }}</h2>
          </div>
          <NuxtLink to="/about" class="view-all">
            <span>{{ t('home.exploreProvinces') }}</span>
            <span class="material-symbols-outlined">map</span>
          </NuxtLink>
        </div>

        <div class="province-grid">
          <article v-for="farm in provinceFarms" :key="farm.keyPrefix" class="province-card">
            <div class="province-img-wrap">
              <img :src="farm.image" :alt="t(farm.keyPrefix + '.name')" loading="lazy" />
            </div>
            <div class="province-overlay"></div>
            <div class="province-content">
              <span class="province-badge">{{ farm.province }}</span>
              <h3>{{ t(farm.keyPrefix + '.name') }}</h3>
              <p class="province-desc">{{ t(farm.keyPrefix + '.description') }}</p>
              <div class="province-footer">
                <span class="farm-products">
                  <span class="material-symbols-outlined">restaurant_menu</span>
                  {{ t(farm.keyPrefix + '.products') }}
                </span>
                <span class="rating"><span class="star-icon">★</span> {{ farm.rating }}</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- COMMITMENT VALUES SECTION -->
      <section class="section values-section">
        <div class="section-head">
          <div>
            <span class="subtitle">{{ t('about.heroBadge') }}</span>
            <h2>{{ t('about.heroTitle') }}</h2>
          </div>
        </div>
        <div class="values-grid">
          <div class="value-card">
            <div class="value-icon bg-green"><span class="material-symbols-outlined">electric_bolt</span></div>
            <h3>{{ t('about.missions.directConnection.title') }}</h3>
            <p>{{ t('about.missions.directConnection.description') }}</p>
          </div>
          <div class="value-card">
            <div class="value-icon bg-yellow"><span class="material-symbols-outlined">handshake</span></div>
            <h3>{{ t('about.missions.fairPricing.title') }}</h3>
            <p>{{ t('about.missions.fairPricing.description') }}</p>
          </div>
          <div class="value-card">
            <div class="value-icon bg-orange"><span class="material-symbols-outlined">verified_user</span></div>
            <h3>{{ t('about.missions.transparency.title') }}</h3>
            <p>{{ t('about.missions.transparency.description') }}</p>
          </div>
        </div>
      </section>

      <!-- DYNAMIC JOURNAL STORIES SECTION -->
      <section class="section blog-section">
        <div class="section-head">
          <div>
            <span class="subtitle">{{ t('common.about') }}</span>
            <h2>{{ t('home.latestStories') }}</h2>
          </div>
          <NuxtLink to="/about" class="view-all">
            <span>{{ t('home.readJournal') }}</span>
            <span class="material-symbols-outlined">book</span>
          </NuxtLink>
        </div>

        <div class="blog-grid">
          <article v-for="post in blogPosts" :key="post.keyPrefix" class="blog-card">
            <div class="blog-img-wrap">
              <img :src="post.image" :alt="t(post.keyPrefix + '.title')" loading="lazy" />
              <span class="read-time-badge">
                <span class="material-symbols-outlined icon-small">schedule</span>
                {{ post.readTime }}
              </span>
            </div>
            <div class="blog-body">
              <span class="tag">{{ t(post.keyPrefix + '.tag') }}</span>
              <h3>{{ t(post.keyPrefix + '.title') }}</h3>
              <p class="muted-text">{{ t(post.keyPrefix + '.excerpt') }}</p>
              <div class="blog-footer">
                <span class="blog-date">{{ post.date }}</span>
                <NuxtLink to="/about" class="read-more-link">
                  <span>{{ t('success.readStory') }}</span>
                  <span class="material-symbols-outlined">arrow_right_alt</span>
                </NuxtLink>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- DYNAMIC COMMUNITY REVIEWS SECTION -->
      <section class="section reviews-section">
        <div class="section-head">
          <div>
            <span class="subtitle">{{ t('common.popular') }}</span>
            <h2>{{ t('home.communityReviews') }}</h2>
          </div>
          <div class="score-badge">
            <span class="material-symbols-outlined star-icon-main">star</span>
            <span>{{ t('home.score') }}</span>
          </div>
        </div>

        <div class="reviews-grid">
          <article v-for="r in reviews" :key="r.name" class="review-card">
            <div class="review-top">
              <img :src="r.avatar" :alt="r.name" loading="lazy" />
              <div>
                <strong>{{ r.name }}</strong>
                <p class="muted-text">{{ t(r.keyPrefix + '.role') }}</p>
              </div>
            </div>
            <div class="stars">★★★★★</div>
            <div class="quote">"${{ t(r.keyPrefix + '.quote') }}"</div>
          </article>
        </div>
      </section>
    </main>

    <CommonAppFooter />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const products = [
  {
    id: '1',
    keyPrefix: 'productsData.p1',
    price: '$6.50',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: '2',
    keyPrefix: 'productsData.p2',
    price: '$4.20',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: '3',
    keyPrefix: 'productsData.p3',
    price: '$3.20',
    image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: '4',
    keyPrefix: 'productsData.p4',
    price: '$8.90',
    image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=900&q=80'
  }
]

const provinceFarms = [
  {
    keyPrefix: 'farmsData.f1',
    province: 'Battambang',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keyPrefix: 'farmsData.f2',
    province: 'Kampot',
    rating: '5.0',
    image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keyPrefix: 'farmsData.f3',
    province: 'Siem Reap',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1200&q=80'
  }
]

const blogPosts = [
  {
    keyPrefix: 'blogsData.b1',
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80',
    readTime: '3 min read',
    date: 'May 22, 2026'
  },
  {
    keyPrefix: 'blogsData.b2',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80',
    readTime: '5 min read',
    date: 'May 20, 2026'
  },
  {
    keyPrefix: 'blogsData.b3',
    image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=900&q=80',
    readTime: '4 min read',
    date: 'May 18, 2026'
  },
  {
    keyPrefix: 'blogsData.b4',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=80',
    readTime: '6 min read',
    date: 'May 15, 2026'
  }
]

const reviews = [
  {
    name: 'Sopheap N.',
    keyPrefix: 'reviewsData.r1',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Borey V.',
    keyPrefix: 'reviewsData.r2',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  }
]

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap');

/* GLOBAL DEFAULTS */
.home-page {
  background-color: #FFFDF4;
  min-height: 100vh;
  color: #132a13;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

.home-main {
  padding: 0 16px; 
  display: flex;
  flex-direction: column;
  gap: clamp(48px, 6vw, 76px);
  width: 96vw;
  max-width: 1820px;
  margin: clamp(40px, 6vw, 70px) auto;
}

.star-icon {
  color: #ffc107 !important;
  font-size: 1.05em;
  margin-right: 2px;
}

.stars {
  color: #ffc107;
  font-size: 0.8rem;
  letter-spacing: 3px;
  margin-bottom: 14px;
}

.star-icon-main {
  color: #ffc107 !important;
}

.section {
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 4vw, 40px);
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
  align-items: flex-end;
  border-bottom: 1px solid rgba(19, 42, 19, 0.06);
  padding-bottom: 20px;
}

.section-head.center {
  align-items: center;
  text-align: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  border-bottom: none;
  padding-bottom: 0;
}

.subtitle {
  font-family: 'Manrope', sans-serif;
  text-transform: uppercase;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: #2d6a4f;
  margin-bottom: 6px;
  display: block;
}

.section-head h2 {
  font-family: 'Manrope', sans-serif;
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.view-all {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #2d6a4f;
  font-family: 'Manrope', sans-serif;
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-decoration: none;
  transition: color 0.25s ease;
}

.view-all span {
  transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1);
}

.view-all:hover { color: #1b4332; }
.view-all:hover span { transform: translateX(6px); }

/* HERO CONTAINER INFRASTRUCTURE - SUNLIT DAWN SPLIT STYLE */
.hero-section-full {
  position: relative;
  max-width: 1820px;
  margin: 0px auto 0 auto;
  min-height: 75vh;
  display: flex;
  align-items: center;
  background-color: #FFFDF4;
  border-radius: 30px 0px 30px 0px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(13, 40, 24, 0.03);
}

.hero-bg-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.hero-dark-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, #FFFDF4 42%, rgba(255, 255, 255, 0.8) 60%, rgba(255, 255, 255, 0.25) 85%, rgba(255, 255, 255, 0) 100%);
  z-index: 1;
}

.hero-ambient-glow {
  position: absolute;
  width: min(500px, 40vw);
  height: min(500px, 40vw);
  border-radius: 50%;
  filter: blur(140px);
  pointer-events: none;
  z-index: 2;
  opacity: 0.15;
}

.glow-left { background: #52b788; top: -5%; left: -5%; }
.glow-right { background: #f39c12; bottom: -10%; right: -5%; }

.hero-inner-container {
  position: relative;
  z-index: 3;
  width: 100%;
  max-width: 1720px;
  margin: 0 auto;
  padding: clamp(60px, 8vw, 100px) clamp(40px, 6vw, 80px);
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  align-items: center;
  gap: 60px;
}

.hero-left-content { color: #132a13; }

.elegant-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: 999px;
  background: rgba(45, 106, 79, 0.08);
  border: 1px solid rgba(45, 106, 79, 0.15);
  font-family: 'Manrope', sans-serif;
  font-weight: 700;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #2d6a4f;
  margin-bottom: 28px;
}

.icon-spin-eco {
  animation: spin 20s linear infinite;
  font-size: 1.1rem !important;
}

@keyframes spin { to { transform: rotate(360deg); } }

.hero-left-content h1 {
  font-family: 'Manrope', sans-serif;
  font-size: clamp(2.5rem, 5vw + 1rem, 4.3rem);
  line-height: 1.12;
  margin-bottom: 24px;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: #132a13;
}

.hero-left-content h1 .glowing-highlight {
  color: #2d6a4f;
  background: linear-gradient(135deg, #2d6a4f, #52b788);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.lead-text {
  max-width: 580px;
  font-size: clamp(1rem, 1.2vw, 1.2rem);
  line-height: 1.7;
  color: #44554b;
  font-weight: 400;
  margin-bottom: 40px;
}

.hero-cta-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 56px;
}

.btn-elegant {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  border-radius: 14px;
  text-decoration: none;
  font-family: 'Manrope', sans-serif;
  font-weight: 800;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.btn-elegant.primary {
  background: linear-gradient(135deg, #2d6a4f, #1b4332);
  color: white;
  box-shadow: 0 10px 25px rgba(45, 106, 79, 0.2);
}

.btn-elegant.primary:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 30px rgba(45, 106, 79, 0.35);
}

.btn-elegant.secondary {
  background: #ffffff;
  border: 1px solid rgba(19, 42, 19, 0.12);
  color: #132a13;
}

.btn-elegant.secondary:hover {
  transform: translateY(-4px);
  background: #f7fcf9;
  border-color: #2d6a4f;
}

.hero-stats-row {
  display: flex;
  gap: 20px;
  max-width: 580px;
}

.stat-bubble {
  background: #ffffff;
  border: 1px solid rgba(19, 42, 19, 0.08);
  border-radius: 20px;
  padding: 18px 24px;
  flex: 1;
  box-shadow: 0 10px 25px rgba(13, 40, 24, 0.03);
}

.stat-bubble strong {
  display: block;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(1.4rem, 2vw, 1.8rem);
  font-weight: 800;
  color: #2d6a4f;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-bubble span {
  font-size: 0.65rem;
  color: #5c6f5c;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.glass-picks-widget {
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid rgba(19, 42, 19, 0.08);
  padding: 18px;
  color: #132a13;
  box-shadow: 0 30px 60px rgba(13, 40, 24, 0.12);
  animation: floatCard 7s ease-in-out infinite;
}

@keyframes floatCard {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

.glass-widget-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(19, 42, 19, 0.08);
  padding-bottom: 12px;
}

.pulse-indicator {
  width: 7px;
  height: 7px;
  background-color: #2d6a4f;
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(45, 106, 79, 0.15);
}

.glass-widget-header h3 {
  font-family: 'Manrope', sans-serif;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #2d6a4f;
}

.glass-widget-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.glass-pick-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  border-radius: 16px;
  background: #fcfdfb;
  border: 0.5px solid rgba(19, 42, 19, 0.04);
  transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1);
}

.glass-pick-row:hover {
  background: #f3f9f5;
  border-color: rgba(45, 106, 79, 0.15);
  transform: translateY(-2px) scale(1.02);
}

.glass-pick-row img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 12px;
  border: 1.5px solid rgba(19, 42, 19, 0.08);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
  transition: transform 0.4s ease;
}

.glass-pick-row:hover img {
  transform: scale(1.08);
}

.pick-meta { flex: 1; }
.pick-meta strong { display: block; font-size: 0.78rem; font-weight: 700; color: #132a13; margin-bottom: 1px; }
.pick-meta p { font-size: 0.65rem; color: #5c6f5c; }

.pick-price {
  background: rgba(45, 106, 79, 0.08);
  border: 1px solid rgba(45, 106, 79, 0.15);
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-family: 'Manrope', sans-serif;
  font-weight: 800;
  color: #2d6a4f;
}

/* SYSTEM BROWSING CATEGORIES */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.category-pill-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #ffffff;
  border-radius: 24px;
  padding: 16px 20px;
  text-decoration: none;
  color: #132a13;
  font-family: 'Manrope', sans-serif;
  border: 1px solid rgba(19, 42, 19, 0.05);
  box-shadow: 0 10px 30px rgba(13, 40, 24, 0.02);
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  position: relative;
  overflow: hidden;
}

.category-pill-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 20px 40px rgba(13, 40, 24, 0.05);
  background: #fffdfc;
  border-color: rgba(45, 106, 79, 0.12);
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.card-info span {
  font-weight: 800;
  font-size: 1rem;
  color: #132a13;
  transition: color 0.35s ease;
}

.card-desc {
  font-family: 'Inter', sans-serif;
  font-size: 0.72rem;
  color: #5c6f5c;
  font-weight: 400;
}

.chevron-arrow {
  font-size: 1.1rem !important;
  color: #2d6a4f;
  opacity: 0;
  transform: translateX(-8px);
  transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1);
}

.category-pill-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 20px 45px rgba(13, 40, 24, 0.08), inset 0 2px 4px rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.9);
}

.category-pill-card:hover .chevron-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* SPECIFIC CATEGORY HOVER STATES */
.category-pill-card.card-veg:hover { border-color: rgba(56, 176, 0, 0.25); }
.category-pill-card.card-fruit:hover { border-color: rgba(240, 201, 74, 0.25); }
.category-pill-card.card-supplies:hover { border-color: rgba(165, 79, 0, 0.25); }
.category-pill-card.card-organic:hover { border-color: rgba(201, 24, 74, 0.25); }

.category-pill-card.card-veg:hover .card-info span { color: #2d6a4f; }
.category-pill-card.card-fruit:hover .card-info span { color: #b78a00; }
.category-pill-card.card-supplies:hover .card-info span { color: #a54f00; }
.category-pill-card.card-organic:hover .card-info span { color: #c9184a; }

.category-pill-card.card-veg:hover .chevron-arrow { color: #2d6a4f; }
.category-pill-card.card-fruit:hover .chevron-arrow { color: #b78a00; }
.category-pill-card.card-supplies:hover .chevron-arrow { color: #a54f00; }
.category-pill-card.card-organic:hover .chevron-arrow { color: #c9184a; }

.icon-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.category-pill-card:hover .icon-circle {
  transform: scale(1.1) rotate(5deg);
}

.icon-circle.bg-green {
  background: linear-gradient(135deg, #e9f5db, #d4ebd0);
  color: #2d6a4f;
  box-shadow: 0 6px 15px rgba(45, 106, 79, 0.08);
}
.icon-circle.bg-yellow {
  background: linear-gradient(135deg, #FFF7DA, #FFEAB3);
  color: #b78a00;
  box-shadow: 0 6px 15px rgba(183, 138, 0, 0.08);
}
.icon-circle.bg-orange {
  background: linear-gradient(135deg, #ffe8d6, #ffd1b3);
  color: #a54f00;
  box-shadow: 0 6px 15px rgba(165, 79, 0, 0.08);
}
.icon-circle.bg-red {
  background: linear-gradient(135deg, #ffe5ec, #ffccd5);
  color: #c9184a;
  box-shadow: 0 6px 15px rgba(201, 24, 74, 0.08);
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.value-card {
  background-color: #ffffff;
  border-radius: 28px;
  padding: 44px;
  box-shadow: 0 15px 40px rgba(13, 40, 24, 0.02);
  border: 1px solid rgba(19, 42, 19, 0.04);
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.value-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 30px 60px rgba(13, 40, 24, 0.06);
}

.value-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  margin-bottom: 28px;
}

.value-icon.bg-green { background-color: #e9f5db; color: #2d6a4f; }
.value-icon.bg-yellow { background-color: #FFF7DA; color: #b78a00; }
.value-icon.bg-orange { background-color: #ffe8d6; color: #a54f00; }

.value-card h3 {
  font-family: 'Manrope', sans-serif;
  font-size: 1.2rem;
  font-weight: 800;
  margin-bottom: 14px;
}

.value-card p {
  font-size: 0.9rem;
  line-height: 1.65;
  color: #55665c;
  font-weight: 400;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); 
  gap: 8px;
}

.product-card {
  background-color: #ffffff;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(13, 40, 24, 0.02);
  border: 1px solid rgba(19, 42, 19, 0.04);
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  display: flex;
  flex-direction: column;
  width: 96%;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 24px 45px rgba(13, 40, 24, 0.06);
}

.product-card:hover .view-product-btn {
  border-color: rgba(45, 106, 79, 0.35);
  background-color: rgba(45, 106, 79, 0.08);
}

.product-card:hover .view-product-btn .material-symbols-outlined {
  transform: scale(1.1);
}

.product-img-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 1/2 / 1;
  overflow: hidden;
}

.product-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
}

.product-card:hover .product-img-wrap img {
  transform: scale(1.05);
}

.popular-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: #FFF7DA;
  border: 1px solid rgba(183, 138, 0, 0.15);
  color: #b78a00;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.65rem;
  font-family: 'Manrope', sans-serif;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  display: inline-flex;
  align-items: center;
  z-index: 2;
}

.product-body {
  padding: 18px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.product-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.category-tag {
  font-family: 'Manrope', sans-serif;
  font-size: 0.55rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: #e9f5db;
  color: #2d6a4f;
  padding: 3px 8px;
  border-radius: 5px;
  width: max-content;
}

.product-rating {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-family: 'Manrope', sans-serif;
  font-weight: 800;
  font-size: 0.72rem;
  color: #132a13;
}

.product-body h3 {
  font-family: 'Manrope', sans-serif;
  font-size: 0.95rem;
  font-weight: 800;
  margin-bottom: 6px;
  line-height: 1.3;
}

.muted-text {
  color: #55665c;
  font-size: 0.78rem;
  line-height: 1.45;
  margin-bottom: 14px;
}

.product-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  border-top: 1px solid rgba(19, 42, 19, 0.06);
  padding-top: 14px;
}

.price {
  font-family: 'Manrope', sans-serif;
  font-size: 1.1rem;
  font-weight: 900;
  color: #1f7a2e;
}

.view-product-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: rgba(45, 106, 79, 0.05);
  border: 1px solid rgba(45, 106, 79, 0.15);
  padding: 8px 16px;
  border-radius: 10px;
  color: #2d6a4f;
  text-decoration: none;
  font-family: 'Manrope', sans-serif;
  font-weight: 800;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1);
  position: relative;
  overflow: hidden;
}

.view-product-btn .material-symbols-outlined {
  font-size: 0.95rem !important;
  font-variation-settings: 'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 20;
  transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1);
  color: #2d6a4f;
}

.view-product-btn:hover {
  background: linear-gradient(135deg, #2d6a4f, #1b4332);
  border-color: #1b4332;
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(45, 106, 79, 0.25);
}

.view-product-btn:hover .material-symbols-outlined {
  color: #ffffff;
  font-variation-settings: 'FILL' 1, 'wght' 600, 'GRAD' 0, 'opsz' 20;
  transform: scale(1.25) rotate(-6deg);
}

/* PROVINCE SOURCING 4-COLUMN CARDS */
.province-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.province-card {
  position: relative;
  height: 310px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 12px 35px rgba(13, 40, 24, 0.03);
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.province-img-wrap {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.province-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
}

.province-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 25px 45px rgba(13, 40, 24, 0.08);
}

.province-card:hover img { transform: scale(1.05); }
.province-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.3) 60%, rgba(0, 0, 0, 0.1) 100%);
}

.province-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  color: white;
  z-index: 2;
}

.province-badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  font-size: 0.55rem;
  font-family: 'Manrope', sans-serif;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.province-content h3 {
  font-family: 'Manrope', sans-serif;
  font-size: 1.1rem;
  font-weight: 800;
  margin-bottom: 4px;
  letter-spacing: -0.01em;
}

.province-desc {
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.7rem;
  line-height: 1.35;
  margin-bottom: 12px;
  font-weight: 300;
}

.province-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.65rem;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  padding-top: 10px;
}

.farm-products {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #9ef01a;
  font-weight: 600;
}

.rating { font-weight: 700; display: flex; align-items: center; }

/* STORIES STATIC GRID LAYOUTS (NO AUTO TRANSITION) */
.blog-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.blog-card {
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(13, 40, 24, 0.02);
  border: 1px solid rgba(19, 42, 19, 0.04);
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.blog-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 25px 50px rgba(13, 40, 24, 0.08);
  border-color: rgba(45, 106, 79, 0.12);
}

.blog-img-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: 24px 24px 0 0;
  background-color: #f7f6f0;
}

.blog-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
}

.blog-card:hover .blog-img-wrap img {
  transform: scale(1.06);
}

.read-time-badge {
  position: absolute;
  top: 14px;
  right: 14px;
  background: rgba(19, 42, 19, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: white;
  padding: 6px 12px;
  border-radius: 12px;
  font-family: 'Manrope', sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  z-index: 2;
}

.icon-small {
  font-size: 0.85rem !important;
}

.blog-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.tag {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 8px;
  font-family: 'Manrope', sans-serif;
  font-size: 0.62rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 14px;
  width: max-content;
  transition: all 0.3s ease;
}

/* SEMANTIC COLOR TAGS FOR BLOG */
.tag-harvest-diary { background-color: #e9f5db; color: #2d6a4f; }
.tag-chef-notes { background-color: #FFF7DA; color: #b78a00; }
.tag-spice-route { background-color: #ffe8d6; color: #a54f00; }
.tag-farmer-voice { background-color: #ffe5ec; color: #c9184a; }

.blog-card h3 {
  font-family: 'Manrope', sans-serif;
  font-size: 1.05rem;
  font-weight: 800;
  margin-bottom: 10px;
  line-height: 1.4;
  color: #132a13;
  transition: color 0.3s ease;
}

.blog-card:hover h3 {
  color: #2d6a4f;
}

.blog-card .muted-text {
  margin-bottom: 20px;
  flex: 1;
}

.blog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(19, 42, 19, 0.05);
  padding-top: 16px;
  margin-top: auto;
}

.blog-date {
  font-family: 'Inter', sans-serif;
  font-size: 0.72rem;
  color: #88998f;
  font-weight: 500;
}

.read-more-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #2d6a4f;
  font-family: 'Manrope', sans-serif;
  font-weight: 800;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  text-decoration: none;
  transition: color 0.3s ease;
}

.read-more-link span {
  transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

.read-more-link:hover {
  color: #1b4332;
}

.read-more-link:hover span:last-child {
  transform: translateX(4px);
}

/* REVIEWS GRID LAYOUT */
.reviews-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.review-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(13, 40, 24, 0.02);
  border: 1px solid rgba(19, 42, 19, 0.04);
  transition: all 0.35s ease;
  padding: 26px;
}
.review-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.review-top img { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; }
.review-top strong { display: block; font-size: 0.85rem; font-weight: 700; }
.review-top p { font-size: 0.7rem; }
.quote { font-size: 0.82rem; line-height: 1.55; font-style: italic; color: #44554b; }

.score-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: #FFF7DA;
  padding: 8px 16px;
  border-radius: 10px;
  font-family: 'Manrope', sans-serif;
  font-weight: 800;
  font-size: 0.7rem;
  text-transform: uppercase;
}

/* RESPONSIVE BREAKPOINT INTERFACES */
@media (max-width: 1280px) {
  .products-grid { grid-template-columns: repeat(3, 1fr); }
  .blog-grid, .reviews-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 1024px) {
  .hero-inner-container {
    grid-template-columns: 1fr;
    padding: 60px 24px;
    gap: 48px;
  }
  .hero-left-content { text-align: center; }
  .elegant-pill, .hero-cta-actions, .hero-stats-row { justify-content: center; }
  .lead-text { margin-left: auto; margin-right: auto; }
  
  .categories-grid { grid-template-columns: repeat(2, 1fr); }
  .products-grid { grid-template-columns: repeat(2, 1fr); }
  .province-grid { grid-template-columns: repeat(2, 1fr); }
  .blog-grid, .reviews-grid { grid-template-columns: repeat(2, 1fr); }
  .values-grid { grid-template-columns: 1fr; }
}

@media (max-width: 680px) {
  .home-main { padding: 0 16px; gap: 80px; }
  .hero-inner-container { padding: 40px 16px; }
  .categories-grid, .products-grid, .province-grid, .blog-grid, .reviews-grid { grid-template-columns: 1fr; }
  .hero-right-content { display: none; }
  .hero-cta-actions { flex-direction: column; width: 100%; }
  .btn-elegant { justify-content: center; width: 100%; }
}
</style>