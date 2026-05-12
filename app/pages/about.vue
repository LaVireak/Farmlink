<template>
  <CommonAppHeader />
  <main class="selection:bg-primary-yellow selection:text-custom-dark">
    <section class="max-canvas relative h-[800px] flex items-center overflow-hidden bg-cream border-b-4 border-black">
      <div class="absolute inset-0 z-0">
        <img 
          alt="Cambodian Rice Fields" 
          class="w-full h-full object-cover opacity-80" 
          src="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=2070&auto=format&fit=crop"
        />
        <div class="absolute inset-0 bg-cream/40"></div>
      </div>
      <div class="relative z-10 w-full px-12">
        <div class="max-w-4xl p-12 bg-white border-4 border-black brutalist-card">
          <span class="bg-[#EFCF4F] inline-block px-4 py-2 bg-primary-yellow border-2 border-black text-xs font-bold tracking-widest uppercase mb-8 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
            Our Journey
          </span>
          <h1 class="text-6xl md:text-8xl font-extrabold text-custom-dark leading-[1] tracking-tighter mb-8 uppercase">
            Cultivating Direct Connections.
          </h1>
          <p class="text-custom-dark text-2xl font-medium leading-relaxed max-w-2xl">
            Empowering Cambodian farmers and connecting communities through transparent, fair, and seasonal commerce.
          </p>
        </div>
      </div>
    </section>

    <section class="max-canvas py-32 bg-white">
      <div class="px-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div v-for="mission in missions" :key="mission.title" 
               class="p-10 border-4 border-black brutalist-card flex flex-col items-center text-center bg-[#FFF7DA]">
            <div class=" bg-[#EFCF4F] w-20 h-20 rounded-full bg-primary-yellow border-2 border-black flex items-center justify-center text-custom-dark mb-8 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
              <div v-html="mission.svg"></div>
            </div>
            <h3 class="text-3xl font-extrabold text-custom-dark uppercase mb-6 tracking-tight">{{ mission.title }}</h3>
            <p class="text-custom-dark/80 text-lg leading-relaxed font-medium">
              {{ mission.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="max-canvas py-32 bg-[#FFF7DA] border-y-4 border-black">
      <div class="px-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div class="bg-white border-4 border-black p-16 brutalist-card">
            <span class="text-xs font-black uppercase tracking-widest text-gray-500 mb-6 block">The Challenge</span>
            <h2 class="text-5xl font-black text-custom-dark mb-8 uppercase italic">Fragmented Harvests</h2>
            <p class="text-custom-dark text-xl mb-12 leading-relaxed font-medium">Traditional supply chains in Cambodia often rely on multiple middlemen, leading to high waste and unfair pricing.</p>
            <div class="space-y-6">
              <div v-for="item in ['Opaque Pricing', 'Inefficient Logistics', 'Producer Insecurity']" :key="item" 
                   class="flex items-center gap-6 text-red-600 text-xl font-black uppercase">
                <span class="material-symbols-outlined border-2 border-current rounded-full p-[3px_10px]">X</span>
                <span>{{ item }}</span>
              </div>
            </div>
          </div>
          <div class="bg-[#EFCF4F] border-4 border-black p-16 brutalist-card">
            <span class="text-xs font-black uppercase tracking-widest text-custom-dark/60 mb-6 block">Our Solution</span>
            <h2 class="text-5xl font-black text-custom-dark mb-8 uppercase">Digital Ecosystem</h2>
            <p class="text-custom-dark text-xl mb-12 leading-relaxed font-medium">We replace intermediaries with a direct digital marketplace, empowering farmers with real-time data.</p>
            <div class="grid grid-cols-2 gap-8">
              <div class="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
                <div class="text-2xl font-black mb-2 uppercase italic">Empowered</div>
                <div class="text-xs uppercase font-bold text-gray-500">Communities</div>
              </div>
              <div class="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
                <div class="text-2xl font-black mb-2 uppercase italic">Direct</div>
                <div class="text-xs uppercase font-bold text-gray-500">Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="max-canvas py-32 bg-white">
      <div class="px-12">
        <div class="text-center mb-24">
          <h2 class="text-7xl font-black text-custom-dark mb-6 uppercase tracking-tighter italic">Meet the team</h2>
          <p class="text-custom-dark font-black uppercase tracking-[0.3em] text-sm bg-primary-yellow inline-block px-4 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
            Architects of Sustainability
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div v-for="member in team" :key="member.name" class="group">
            <div class="w-[400px] h-[400px] aspect-[4/5] overflow-hidden border-4 border-black mb-8 editorial-shadow bg-cream">
              <img :alt="member.name" class="w-[400px] h-[400px] object-cover grayscale group-hover:grayscale-0 transition-all duration-500" :src="member.image"/>
            </div>
            <h4 class="text-3xl font-black text-custom-dark mb-3 uppercase">{{ member.name }}</h4>
            <p class="text-custom-dark font-bold text-xs uppercase tracking-widest opacity-60">{{ member.role }}</p>
            <a :href="`mailto:${member.email}`" class="text-custom-dark font-bold text-xs uppercase tracking-widest opacity-60">{{ member.email }}</a>
            <div class="flex items-center gap-6 mt-3">
              <a v-for="social in socials" :key="social.name" :href="social.link" class="hover:scale-110 transition-transform text-black">
                <div v-html="social.svg" class="w-6 h-6"></div>
              </a>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  </main>
  <CommonAppFooter />
</template>

<script setup>
const missions = [
  { title: 'Direct Connection', 
    svg: `<svg width="40" height="40" viewBox="0 0 30 29" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 28.75C6.45833 28.75 5.57292 28.3854 4.84375 27.6562C4.11458 26.9271 3.75 26.0417 3.75 25C3.75 23.9583 4.11458 23.0729 4.84375 22.3438C5.57292 21.6146 6.45833 21.25 7.5 21.25C7.79167 21.25 8.0625 21.2812 8.3125 21.3438C8.5625 21.4062 8.80208 21.4896 9.03125 21.5938L10.8125 19.375C10.2292 18.7292 9.82292 18 9.59375 17.1875C9.36458 16.375 9.3125 15.5625 9.4375 14.75L6.90625 13.9062C6.55208 14.4271 6.10417 14.8438 5.5625 15.1562C5.02083 15.4688 4.41667 15.625 3.75 15.625C2.70833 15.625 1.82292 15.2604 1.09375 14.5312C0.364583 13.8021 0 12.9167 0 11.875C0 10.8333 0.364583 9.94792 1.09375 9.21875C1.82292 8.48958 2.70833 8.125 3.75 8.125C4.79167 8.125 5.67708 8.48958 6.40625 9.21875C7.13542 9.94792 7.5 10.8333 7.5 11.875C7.5 11.9167 7.5 11.9583 7.5 12C7.5 12.0417 7.5 12.0833 7.5 12.125L10.0312 13C10.4479 12.25 11.0052 11.6146 11.7031 11.0938C12.401 10.5729 13.1875 10.2396 14.0625 10.0938V7.375C13.25 7.14583 12.5781 6.70312 12.0469 6.04688C11.5156 5.39062 11.25 4.625 11.25 3.75C11.25 2.70833 11.6146 1.82292 12.3438 1.09375C13.0729 0.364583 13.9583 0 15 0C16.0417 0 16.9271 0.364583 17.6562 1.09375C18.3854 1.82292 18.75 2.70833 18.75 3.75C18.75 4.625 18.4792 5.39062 17.9375 6.04688C17.3958 6.70312 16.7292 7.14583 15.9375 7.375V10.0938C16.8125 10.2396 17.599 10.5729 18.2969 11.0938C18.9948 11.6146 19.5521 12.25 19.9688 13L22.5 12.125C22.5 12.0833 22.5 12.0417 22.5 12C22.5 11.9583 22.5 11.9167 22.5 11.875C22.5 10.8333 22.8646 9.94792 23.5938 9.21875C24.3229 8.48958 25.2083 8.125 26.25 8.125C27.2917 8.125 28.1771 8.48958 28.9062 9.21875C29.6354 9.94792 30 10.8333 30 11.875C30 12.9167 29.6354 13.8021 28.9062 14.5312C28.1771 15.2604 27.2917 15.625 26.25 15.625C25.5833 15.625 24.974 15.4688 24.4219 15.1562C23.8698 14.8438 23.4271 14.4271 23.0938 13.9062L20.5625 14.75C20.6875 15.5625 20.6354 16.3698 20.4062 17.1719C20.1771 17.974 19.7708 18.7083 19.1875 19.375L20.9688 21.5625C21.1979 21.4583 21.4375 21.3802 21.6875 21.3281C21.9375 21.276 22.2083 21.25 22.5 21.25C23.5417 21.25 24.4271 21.6146 25.1562 22.3438C25.8854 23.0729 26.25 23.9583 26.25 25C26.25 26.0417 25.8854 26.9271 25.1562 27.6562C24.4271 28.3854 23.5417 28.75 22.5 28.75C21.4583 28.75 20.5729 28.3854 19.8438 27.6562C19.1146 26.9271 18.75 26.0417 18.75 25C18.75 24.5833 18.8177 24.1823 18.9531 23.7969C19.0885 23.4115 19.2708 23.0625 19.5 22.75L17.7188 20.5312C16.8646 21.0104 15.9531 21.25 14.9844 21.25C14.0156 21.25 13.1042 21.0104 12.25 20.5312L10.5 22.75C10.7292 23.0625 10.9115 23.4115 11.0469 23.7969C11.1823 24.1823 11.25 24.5833 11.25 25C11.25 26.0417 10.8854 26.9271 10.1562 27.6562C9.42708 28.3854 8.54167 28.75 7.5 28.75ZM3.75 13.125C4.10417 13.125 4.40104 13.0052 4.64062 12.7656C4.88021 12.526 5 12.2292 5 11.875C5 11.5208 4.88021 11.224 4.64062 10.9844C4.40104 10.7448 4.10417 10.625 3.75 10.625C3.39583 10.625 3.09896 10.7448 2.85938 10.9844C2.61979 11.224 2.5 11.5208 2.5 11.875C2.5 12.2292 2.61979 12.526 2.85938 12.7656C3.09896 13.0052 3.39583 13.125 3.75 13.125ZM7.5 26.25C7.85417 26.25 8.15104 26.1302 8.39062 25.8906C8.63021 25.651 8.75 25.3542 8.75 25C8.75 24.6458 8.63021 24.349 8.39062 24.1094C8.15104 23.8698 7.85417 23.75 7.5 23.75C7.14583 23.75 6.84896 23.8698 6.60938 24.1094C6.36979 24.349 6.25 24.6458 6.25 25C6.25 25.3542 6.36979 25.651 6.60938 25.8906C6.84896 26.1302 7.14583 26.25 7.5 26.25ZM15 5C15.3542 5 15.651 4.88021 15.8906 4.64062C16.1302 4.40104 16.25 4.10417 16.25 3.75C16.25 3.39583 16.1302 3.09896 15.8906 2.85938C15.651 2.61979 15.3542 2.5 15 2.5C14.6458 2.5 14.349 2.61979 14.1094 2.85938C13.8698 3.09896 13.75 3.39583 13.75 3.75C13.75 4.10417 13.8698 4.40104 14.1094 4.64062C14.349 4.88021 14.6458 5 15 5ZM15 18.75C15.875 18.75 16.6146 18.4479 17.2188 17.8438C17.8229 17.2396 18.125 16.5 18.125 15.625C18.125 14.75 17.8229 14.0104 17.2188 13.4062C16.6146 12.8021 15.875 12.5 15 12.5C14.125 12.5 13.3854 12.8021 12.7812 13.4062C12.1771 14.0104 11.875 14.75 11.875 15.625C11.875 16.5 12.1771 17.2396 12.7812 17.8438C13.3854 18.4479 14.125 18.75 15 18.75ZM22.5 26.25C22.8542 26.25 23.151 26.1302 23.3906 25.8906C23.6302 25.651 23.75 25.3542 23.75 25C23.75 24.6458 23.6302 24.349 23.3906 24.1094C23.151 23.8698 22.8542 23.75 22.5 23.75C22.1458 23.75 21.849 23.8698 21.6094 24.1094C21.3698 24.349 21.25 24.6458 21.25 25C21.25 25.3542 21.3698 25.651 21.6094 25.8906C21.849 26.1302 22.1458 26.25 22.5 26.25ZM26.25 13.125C26.6042 13.125 26.901 13.0052 27.1406 12.7656C27.3802 12.526 27.5 12.2292 27.5 11.875C27.5 11.5208 27.3802 11.224 27.1406 10.9844C26.901 10.7448 26.6042 10.625 26.25 10.625C25.8958 10.625 25.599 10.7448 25.3594 10.9844C25.1198 11.224 25 11.5208 25 11.875C25 12.2292 25.1198 12.526 25.3594 12.7656C25.599 13.0052 25.8958 13.125 26.25 13.125Z" fill="#6F5400"/></svg>`, 
    description: 'Bridging the gap between farm and table by removing unnecessary layers.' 
  },
  { title: 'Transparency', 
    svg: `<svg width="40" height="40" viewBox="0 0 28 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.75 15C15.3125 15 16.6406 14.4531 17.7344 13.3594C18.8281 12.2656 19.375 10.9375 19.375 9.375C19.375 7.8125 18.8281 6.48438 17.7344 5.39062C16.6406 4.29688 15.3125 3.75 13.75 3.75C12.1875 3.75 10.8594 4.29688 9.76562 5.39062C8.67188 6.48438 8.125 7.8125 8.125 9.375C8.125 10.9375 8.67188 12.2656 9.76562 13.3594C10.8594 14.4531 12.1875 15 13.75 15ZM13.75 12.75C12.8125 12.75 12.0156 12.4219 11.3594 11.7656C10.7031 11.1094 10.375 10.3125 10.375 9.375C10.375 8.4375 10.7031 7.64062 11.3594 6.98438C12.0156 6.32812 12.8125 6 13.75 6C14.6875 6 15.4844 6.32812 16.1406 6.98438C16.7969 7.64062 17.125 8.4375 17.125 9.375C17.125 10.3125 16.7969 11.1094 16.1406 11.7656C15.4844 12.4219 14.6875 12.75 13.75 12.75ZM13.75 18.75C10.7083 18.75 7.9375 17.901 5.4375 16.2031C2.9375 14.5052 1.125 12.2292 0 9.375C1.125 6.52083 2.9375 4.24479 5.4375 2.54688C7.9375 0.848958 10.7083 0 13.75 0C16.7917 0 19.5625 0.848958 22.0625 2.54688C24.5625 4.24479 26.375 6.52083 27.5 9.375C26.375 12.2292 24.5625 14.5052 22.0625 16.2031C19.5625 17.901 16.7917 18.75 13.75 18.75ZM13.75 16.25C16.1042 16.25 18.2656 15.6302 20.2344 14.3906C22.2031 13.151 23.7083 11.4792 24.75 9.375C23.7083 7.27083 22.2031 5.59896 20.2344 4.35938C18.2656 3.11979 16.1042 2.5 13.75 2.5C11.3958 2.5 9.23438 3.11979 7.26562 4.35938C5.29688 5.59896 3.79167 7.27083 2.75 9.375C3.79167 11.4792 5.29688 13.151 7.26562 14.3906C9.23438 15.6302 11.3958 16.25 13.75 16.25Z" fill="#6F5400"/></svg>`, 
  description: 'Every product has a story. We provide full traceability so you know exactly where your food comes from.' 
  },
  { title: 'Fair Pricing', 
    svg: `<svg width="40" height="40" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.25 11.25C15.2083 11.25 14.3229 10.8854 13.5938 10.1562C12.8646 9.42708 12.5 8.54167 12.5 7.5C12.5 6.45833 12.8646 5.57292 13.5938 4.84375C14.3229 4.11458 15.2083 3.75 16.25 3.75C17.2917 3.75 18.1771 4.11458 18.9062 4.84375C19.6354 5.57292 20 6.45833 20 7.5C20 8.54167 19.6354 9.42708 18.9062 10.1562C18.1771 10.8854 17.2917 11.25 16.25 11.25ZM7.5 15C6.8125 15 6.22396 14.7552 5.73438 14.2656C5.24479 13.776 5 13.1875 5 12.5V2.5C5 1.8125 5.24479 1.22396 5.73438 0.734375C6.22396 0.244792 6.8125 0 7.5 0H25C25.6875 0 26.276 0.244792 26.7656 0.734375C27.2552 1.22396 27.5 1.8125 27.5 2.5V12.5C27.5 13.1875 27.2552 13.776 26.7656 14.2656C26.276 14.7552 25.6875 15 25 15H7.5ZM10 12.5H22.5C22.5 11.8125 22.7448 11.224 23.2344 10.7344C23.724 10.2448 24.3125 10 25 10V5C24.3125 5 23.724 4.75521 23.2344 4.26562C22.7448 3.77604 22.5 3.1875 22.5 2.5H10C10 3.1875 9.75521 3.77604 9.26562 4.26562C8.77604 4.75521 8.1875 5 7.5 5V10C8.1875 10 8.77604 10.2448 9.26562 10.7344C9.75521 11.224 10 11.8125 10 12.5ZM23.75 20H2.5C1.8125 20 1.22396 19.7552 0.734375 19.2656C0.244792 18.776 0 18.1875 0 17.5V3.75H2.5V17.5H23.75V20ZM7.5 12.5V2.5V12.5Z" fill="#6F5400"/></svg>`, 
    description: 'Sustainable livelihoods for farmers, fair value for consumers.' 
  }
]

const team = [
  { name: 'Im Chheangngim',     role: 'Founder',              email: 'im.chheangngim@gmail.com', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop' },
  { name: 'La Vireak',          role: 'Lead Developer',       email: 'lavireakgmail.com', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop' },
  { name: 'Phe Rithika',        role: 'Lead Developer',       email: 'pherithika@gmail.com', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop' },
  { name: 'Kaing Sophea',       role: 'Founder',              email: 'kaingsophea@gmail.com', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1974&auto=format&fit=crop' },
  { name: 'Chi Sav Moeng',      role: 'Lead Developer',       email: 'chisavmoeng@gmail.com', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop' },
  { name: 'Huy ChanchingHoir',  role: 'UX Designer',          email: 'huychanchinghoir@gmail.com', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop' },
  { name: 'Bunarith Soksim',    role: 'Community Outreach',   email: 'bunarithsoksim@gmail.com', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1974&auto=format&fit=crop' }
]
const socials = [
  { name: 'Facebook', link: '#', svg: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>' },
  { name: 'Twitter', link: '#', svg: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path></svg>' },
  { name: 'Instagram', link: '#', svg: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 0.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"></path></svg>' }
]
</script>

<style scoped>
.max-canvas {
  max-width: 1920px;
  margin: 0 auto;   
  width: 100%;
}
.brutalist-card {
  box-shadow: 8px 8px 0px 0px rgba(26, 26, 26, 1);
}
.editorial-shadow {
  box-shadow: 6px 6px 0px 0px rgba(26, 26, 26, 1);
}
</style>
