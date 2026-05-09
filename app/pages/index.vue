<template>
  <div class="home-page">
    <CommonAppHeader />
    

    <main class="home-main">
      <section class="hero-shell">
        <img
          class="hero-image"
          src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1800&q=80"
          alt="Seasonal harvest"
        >
        <div class="hero-overlay"></div>

        <div class="hero-content">
          <span class="hero-pill">TAKEO PROVINCE DIRECT</span>
          <p class="hero-season">SEASON HARVEST</p>
          <h1>
            Monsoon's Finest
            <span>Tropical Harvest</span>
          </h1>
          <p class="hero-copy">
            Experience the peak of Cambodia's rainy season. Sun-ripened, hand-picked, and delivered from Takeo's fertile plains to your table within 24 hours.
          </p>

          <div class="hero-actions">
            <NuxtLink to="/user/products" class="btn btn-primary">Shop The Season</NuxtLink>
            <NuxtLink to="/about" class="btn btn-ghost">Meet the Farmers</NuxtLink>
          </div>
        </div>
      </section>

      <section class="section-head">
        <div>
          <h2>Featured Local Farms</h2>
          <p>Direct partnerships with Cambodia's most dedicated organic growers.</p>
        </div>

        <NuxtLink to="/about" class="view-all">View All Regions</NuxtLink>
      </section>

      <section class="featured-grid">
        <article class="farm-card farm-card-main">
          <img src="https://images.unsplash.com/photo-1627483262769-74ed89bc247a?auto=format&fit=crop&w=1000&q=80" alt="Takeo organic farm">
          <div class="farm-gradient"></div>
          <div class="farm-content">
            <h3>Takeo Organic Garden Park</h3>
            <p>★ 4.9 12.4 km away</p>
          </div>
          <button class="farm-arrow" type="button">↗</button>
        </article>

        <article class="farm-card farm-card-small">
          <img src="https://images.unsplash.com/photo-1580428180121-4b3cdb3f0f87?auto=format&fit=crop&w=900&q=80" alt="Kampong cham greens">
          <div class="farm-gradient"></div>
          <div class="farm-content">
            <h3>Kampong Cham Greens</h3>
            <p>Specializing in heirloom leafy vegetables</p>
          </div>
        </article>

        <article class="farm-card farm-card-small">
          <img src="https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=900&q=80" alt="Battambang orchard">
          <div class="farm-gradient"></div>
          <div class="farm-content">
            <h3>Battambang Orchard</h3>
            <p>Famous for dragon fruit and longan</p>
          </div>
        </article>
      </section>

      <section class="picked-row">
        <h2>Picked For You</h2>
        <div class="carousel-ctrl">
          <button type="button">‹</button>
          <button type="button">›</button>
        </div>
      </section>

      <section class="product-grid">
        <article v-for="product in pickedProducts" :key="product.name" class="product-card">
          <img :src="product.image" :alt="product.name">
          <h3>{{ product.name }}</h3>
          <p>{{ product.meta }}</p>
          <div class="product-bottom">
            <span>${{ product.price }}</span>
            <button type="button">+</button>
          </div>
        </article>
      </section>

      <section class="bottom-grid">
        <aside class="recently-viewed">
          <h3>Recently Viewed</h3>

          <div v-for="item in recentItems" :key="item.name" class="recent-item">
            <img :src="item.image" :alt="item.name">
            <div>
              <p>{{ item.name }}</p>
              <span>{{ item.price }}</span>
            </div>
          </div>
        </aside>

        <article class="subscribe-card">
          <h3>Stay Rooted with Phum Garden</h3>
          <p>Weekly agricultural updates, seasonal recipes, and exclusive farm-to-table events across Cambodia.</p>

          <div class="subscribe-form">
            <input type="email" placeholder="Your Email Address">
            <button type="button">Subscribe Now</button>
          </div>

          <small>We respect your privacy. No spam, just nature's goodness.</small>
        </article>
      </section>
    </main>
    <CommonAppFooter />
  </div>
</template>

<script setup lang="ts">
const pickedProducts = [
  {
    name: 'Mangoes (Keo Chen)',
    meta: '1kg - Takeo Garden',
    price: '4.50',
    image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Angkor Bok Choy',
    meta: '500g - Siem Reap Farms',
    price: '1.20',
    image: 'https://images.unsplash.com/photo-1603046891744-76e6481f2f20?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Purple Dragon Fruit',
    meta: 'Per piece - Kampong Speu',
    price: '2.10',
    image: 'https://images.unsplash.com/photo-1596591868231-05e4f9f67ec6?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Cambodian Longan',
    meta: '500g - Battambang',
    price: '3.75',
    image: 'https://images.unsplash.com/photo-1645268703244-3c2ca3ca40d8?auto=format&fit=crop&w=600&q=80',
  },
];

const recentItems = [
  {
    name: 'Sweet Carrots',
    price: '$1.50 / kg',
    image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Wild Berries',
    price: '$5.20 / pack',
    image: 'https://images.unsplash.com/photo-1563746098251-d35aef196e83?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Kampot Durian',
    price: '$12.00 / kg',
    image: 'https://images.unsplash.com/photo-1625231183176-71980a90b6f9?auto=format&fit=crop&w=400&q=80',
  },
];
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #f4f4ee;
  color: #1f251f;
}

.home-main {
  width: min(1080px, 100%);
  margin: 0 auto;
  padding: 12px 14px 38px;
  display: grid;
  gap: 18px;
}

.hero-shell {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  min-height: 370px;
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
  background: linear-gradient(90deg, rgba(7, 12, 12, 0.86) 0%, rgba(9, 12, 12, 0.34) 54%, rgba(9, 12, 12, 0.2) 100%);
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 480px;
  padding: 30px 22px;
}

.hero-pill {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 999px;
  background: #f5dfac;
  font-size: 10px;
  letter-spacing: 0.08em;
  font-weight: 700;
  color: #564315;
}

.hero-season {
  margin: 12px 0 8px;
  color: #b99350;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 34px;
  line-height: 0.95;
}

.hero-content h1 {
  margin: 0;
  color: #fbfcf7;
  font-size: clamp(28px, 4vw, 44px);
  line-height: 0.95;
  font-weight: 800;
}

.hero-content h1 span {
  display: block;
  color: #9ff2b2;
}

.hero-copy {
  margin: 12px 0 0;
  color: #dce3dc;
  font-size: 14px;
  line-height: 1.32;
  max-width: 460px;
}

.hero-actions {
  margin-top: 14px;
  display: flex;
  gap: 8px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 9px 16px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
}

.btn-primary {
  background: linear-gradient(135deg, #2e7e3f, #1f6130);
  color: #ecf7ef;
}

.btn-ghost {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: #fcfef8;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 18px;
}

.section-head h2,
.picked-row h2 {
  margin: 0;
  font-size: 32px;
  line-height: 0.98;
  font-weight: 800;
}

.section-head p {
  margin: 8px 0 0;
  color: #5c625c;
  font-size: 14px;
}

.view-all {
  font-weight: 700;
  color: #2a6d3b;
  text-decoration: none;
  font-size: 14px;
}

.featured-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.85fr;
  gap: 14px;
}

.farm-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  min-height: 170px;
}

.farm-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.farm-card-main {
  grid-row: span 2;
  min-height: 310px;
}

.farm-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(10, 14, 12, 0.05) 0%, rgba(10, 14, 12, 0.68) 82%);
}

.farm-content {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 14px;
  color: #f4f5f0;
}

.farm-content h3 {
  margin: 0;
  font-size: 22px;
  line-height: 1.05;
}

.farm-content p {
  margin: 8px 0 0;
  font-size: 13px;
  color: #e6eadf;
}

.farm-arrow {
  position: absolute;
  right: 12px;
  bottom: 12px;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #e7eee7;
  color: #1d4928;
  font-size: 18px;
  cursor: pointer;
}

.picked-row {
  margin-top: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.carousel-ctrl {
  display: flex;
  gap: 12px;
}

.carousel-ctrl button {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: 1px solid #c6cdc5;
  background: transparent;
  font-size: 18px;
  color: #526152;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.product-card {
  background: #f5f5f3;
  border-radius: 16px;
  padding: 12px;
}

.product-card img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 12px;
}

.product-card h3 {
  margin: 12px 0 2px;
  font-size: 17px;
  line-height: 1.1;
}

.product-card p {
  margin: 0;
  color: #657066;
  font-size: 12px;
}

.product-bottom {
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-bottom span {
  font-size: 24px;
  color: #1f6a35;
  font-weight: 800;
}

.product-bottom button {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 10px;
  background: #9be0a1;
  color: #1a5b2f;
  font-size: 20px;
}

.bottom-grid {
  margin-top: 8px;
  display: grid;
  grid-template-columns: 190px 1fr;
  gap: 16px;
  align-items: end;
}

.recently-viewed h3 {
  margin: 0 0 14px;
  font-size: 24px;
}

.recent-item {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}

.recent-item img {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  object-fit: cover;
}

.recent-item p {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
}

.recent-item span {
  color: #566156;
  font-size: 11px;
}

.subscribe-card {
  background: linear-gradient(135deg, #2f7642, #2e6f3f);
  border-radius: 18px;
  padding: 18px;
  color: #eff7ee;
}

.subscribe-card h3 {
  margin: 0;
  font-size: 30px;
  line-height: 1.02;
  max-width: 360px;
}

.subscribe-card p {
  margin: 12px 0 0;
  max-width: 520px;
  font-size: 14px;
  color: #dce9dd;
}

.subscribe-form {
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1fr 170px;
  gap: 10px;
}

.subscribe-form input,
.subscribe-form button {
  height: 44px;
  border-radius: 10px;
  border: none;
}

.subscribe-form input {
  background: rgba(255, 255, 255, 0.14);
  color: #e8f0e8;
  padding: 0 12px;
  font-size: 13px;
}

.subscribe-form input::placeholder {
  color: #bdd4c0;
}

.subscribe-form button {
  background: #edf2ec;
  color: #2d6c3f;
  font-size: 13px;
  font-weight: 700;
}

.subscribe-card small {
  display: block;
  margin-top: 8px;
  color: #c4d7c6;
  font-size: 10px;
}

@media (max-width: 1200px) {
  .hero-shell {
    min-height: 520px;
  }

  .section-head h2,
  .picked-row h2,
  .hero-season,
  .subscribe-card h3 {
    font-size: 42px;
  }

  .hero-copy,
  .section-head p,
  .product-card h3 {
    font-size: 20px;
  }

  .btn,
  .view-all,
  .subscribe-card p,
  .product-card p {
    font-size: 16px;
  }

  .product-bottom span {
    font-size: 30px;
  }
}

@media (max-width: 960px) {
  .featured-grid,
  .bottom-grid {
    grid-template-columns: 1fr;
  }

  .farm-card-main {
    grid-row: auto;
    min-height: 340px;
  }

  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hero-content {
    padding: 36px 22px;
  }

  .subscribe-card {
    padding: 28px;
  }

  .subscribe-form {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .home-main {
    padding: 14px 12px 44px;
    gap: 20px;
  }

  .hero-shell {
    min-height: 430px;
    border-radius: 22px;
  }

  .hero-copy {
    font-size: 15px;
  }

  .hero-actions {
    flex-wrap: wrap;
  }

  .btn {
    width: 100%;
  }

  .section-head {
    flex-direction: column;
    align-items: start;
  }

  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>
