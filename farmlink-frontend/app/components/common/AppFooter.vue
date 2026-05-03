<template>
  <footer class="w-full bg-cream border-t border-black/5" data-purpose="footer-container">
    <div class="max-w-[1920px]  px-[100px] py-8 flex flex-col md:flex-row justify-between items-start" data-purpose="footer-flex-container">
      
      <div class="flex flex-col gap-5 w-full md:max-w-[300px] ml-10">
        <NuxtLink to="/">
          <img 
            alt="FarmLink Logo" 
            class="h-10 w-auto object-contain self-start" 
            src="assets\images\logo1.png"
          />
        </NuxtLink>
        
        <div class="flex flex-col gap-3">
          <h3 class="footer-heading italic uppercase">Subscribe</h3>
          <p class="footer-text">Get 10% off with your first order</p>
          <div class="relative w-full max-w-[280px]">
            <input 
              type="email"
              class="w-full bg-transparent border-2 border-black rounded-md py-2.5 px-4 pr-12 footer-text focus:outline-none focus:ring-0" 
              placeholder="Enter your email" 
            />
            <button class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-[20px]">send</span>
            </button>
          </div>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-12 lg:gap-[93px] mt-12 md:mt-0">
        
        <div class="flex flex-col gap-3 min-w-[150px]">
          <h3 class="footer-heading italic uppercase">Support</h3>
          <ul class="flex flex-col gap-3 footer-text">
            <li>Techno, Phnom Penh Cambodia</li>
            <li>
              <a class="hover:underline font-bold" href="mailto:farmLink168@gmail.com">farmLink168@gmail.com</a>
            </li>
            <li>
              <a class="hover:underline font-bold" href="tel:+855999999999">+855 99-999-999</a>
            </li>
          </ul>
        </div>

        <div class="flex flex-col gap-3 min-w-[150px]">
          <h3 class="footer-heading italic uppercase">Account</h3>
          <ul class="flex flex-col gap-3 footer-text">
            <li><NuxtLink class="hover:underline" to="/user/settings/profile">My account</NuxtLink></li>
            <li><NuxtLink class="hover:underline" to="/auth/signin">Login / Sign up</NuxtLink></li>
            <li><NuxtLink class="hover:underline" to="/user/cart">Cart</NuxtLink></li>
            <li><NuxtLink class="hover:underline" to="/user/favorites">Favorite</NuxtLink></li>
            <li><NuxtLink class="hover:underline" to="/user/products">Shop</NuxtLink></li>
          </ul>
        </div>

        <div class="flex flex-col gap-3 min-w-[150px]">
          <h3 class="footer-heading italic uppercase">Quick Link</h3>
          <ul class="flex flex-col gap-3 footer-text">
            <li><NuxtLink class="hover:underline" to="/about">Privacy policy</NuxtLink></li>
            <li><NuxtLink class="hover:underline" to="/shipping">Term of Use</NuxtLink></li>
            <li><NuxtLink class="hover:underline" to="/about#faq">FAQ</NuxtLink></li>
            <li><NuxtLink class="hover:underline" to="/contacts">Contact</NuxtLink></li>
          </ul>
        </div>

        <div class="flex flex-col gap-3 min-w-[150px]">
          <h3 class="footer-heading italic uppercase">Download App</h3>
          <p class="footer-text">Save 20% off on 3 purchase in App <br> User only</p>
          <div class="flex items-start gap-4">
            <img :src="qrApp" alt="QR code" class="w-30 h-30 object-contain" />

            <div class="flex flex-col gap-2">
              <img :src="googlePlay" alt="Get it on Google Play" class="w-30 object-contain" />
              <img :src="appStore" alt="Download on the App Store" class="w-30 object-contain" />
            </div>
          </div>
            <div class="flex items-center gap-4">
              <a v-for="social in socials" :key="social.name" :href="social.link" class="hover:scale-110 transition-transform text-black">
                <div v-html="social.svg" class="w-6 h-6"></div>
              </a>
            </div>
            
          
        </div>
      </div>
    </div>

    <div class="w-full py-6 border-t-2 border-black/10 text-center">
      <p class="footer-text opacity-60 font-bold">© 2026 FarmLink. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>
import qrApp from '~/assets/images/qrapp.png'
import googlePlay from '~/assets/images/googleplay.png'
import appStore from '~/assets/images/appstore.png'

const socials = [
  { name: 'Facebook', link: '#', svg: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>' },
  { name: 'Twitter', link: '#', svg: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path></svg>' },
  { name: 'Instagram', link: '#', svg: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 0.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"></path></svg>' }
]
</script>

<style scoped>
.bg-cream { background-color: #FFF7DA; }
.footer-heading {
  font-size: 24px; /* Scaled down slightly for better fit */
  font-weight: 900;
  color: #1a1a1a;
}
.footer-text {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
}
</style>