<script setup lang="ts">
import CommonAppSidebar from '../../../components/common/AppSidebar.vue';
import { ref } from 'vue';

definePageMeta({
  layout: 'user',
});

useHead({
  title: 'Payment Methods | FarmLink Cambodia',
});

const isRemoveCardModalOpen = ref(false);
const selectedCardLast4 = ref('');

function openRemoveCardModal(last4: string) {
  selectedCardLast4.value = last4;
  isRemoveCardModalOpen.value = true;
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#fbf9f6] text-zinc-900">
    <CommonAppHeader />

    <main class="max-w-7xl mx-auto w-full pt-28 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8 flex-1">
      <div class="flex flex-col md:flex-row gap-8 md:gap-10">
        <CommonAppSidebar active="payment" />

        <section class="flex-1 space-y-12">
          <header>
            <span class="text-secondary font-bold text-[10px] tracking-[0.25em] uppercase mb-2 block font-label">Financial Security</span>
            <h1 class="text-5xl font-black text-primary font-[Manrope,sans-serif] tracking-tighter leading-tight mb-4">Payment Methods</h1>
            <p class="text-on-surface-variant max-w-xl text-lg leading-relaxed opacity-80">
              Manage your secure transactions and billing accounts. All data is encrypted using agrarian-grade digital security protocols.
            </p>
          </header>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-[#154212] to-[#2d5a27] text-white flex flex-col justify-between h-64 shadow-xl group transition-all duration-300 hover:-translate-y-1">
              <div class="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4">
                <span class="material-symbols-outlined text-[140px]" style="font-variation-settings: 'FILL' 1;">spa</span>
              </div>
              <div class="flex justify-between items-start z-10">
                <div>
                  <p class="text-[10px] uppercase tracking-[0.2em] opacity-80 font-bold">Primary Account</p>
                  <h4 class="text-xl font-[Manrope,sans-serif] font-bold">ABA Bank Platinum</h4>
                </div>
                <span class="material-symbols-outlined text-3xl opacity-80">contactless</span>
              </div>
              <div class="z-10">
                <p class="text-2xl font-mono tracking-[0.25em] mb-4">•••• •••• •••• 8824</p>
                <div class="flex justify-between items-end">
                  <div>
                    <p class="text-[9px] uppercase opacity-60 tracking-wider">Card Holder</p>
                    <p class="font-bold tracking-tight text-sm uppercase">Sophal Saman</p>
                  </div>
                  <div class="text-right">
                    <p class="text-[9px] uppercase opacity-60 tracking-wider">Expires</p>
                    <p class="font-bold text-sm">09/27</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="relative overflow-hidden rounded-2xl p-8 bg-[#e3e2df] text-on-surface flex flex-col justify-between h-64 border border-[#c2c9bb]/30 shadow-sm hover:shadow-md transition-all group">
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">Business Account</p>
                  <h4 class="text-xl font-[Manrope,sans-serif] font-bold text-primary">ACLEDA Visa Gold</h4>
                </div>
                <span class="material-symbols-outlined text-3xl text-secondary opacity-60">credit_card</span>
              </div>
              <div>
                <p class="text-2xl font-mono tracking-[0.25em] text-on-surface/80 mb-4">•••• •••• •••• 4110</p>
                <div class="flex justify-between items-end">
                  <div>
                    <p class="text-[9px] uppercase text-on-surface-variant tracking-wider">Card Holder</p>
                    <p class="font-bold tracking-tight text-sm uppercase">Sophal Saman</p>
                  </div>
                  <div class="flex gap-4">
                    <NuxtLink class="text-primary text-xs font-bold hover:underline" to="/user/settings/edit-payment">Edit</NuxtLink>
                    <button type="button" class="text-[#ba1a1a] text-xs font-bold hover:underline" @click="openRemoveCardModal('4110')">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NuxtLink to="/user/settings/add-card" class="bg-[#f5f3f0] p-10 rounded-2xl border-2 border-dashed border-[#c2c9bb] hover:border-secondary transition-all cursor-pointer flex flex-col items-center justify-center text-center group">
              <div class="w-16 h-16 rounded-full bg-[#efeeea] flex items-center justify-center mb-5 group-hover:bg-[#91f78e] transition-colors">
                <span class="material-symbols-outlined text-3xl text-primary group-hover:text-[#00731e]">add_card</span>
              </div>
              <h5 class="font-[Manrope,sans-serif] font-bold text-xl mb-2 text-primary">Add New Card</h5>
              <p class="text-on-surface-variant text-sm max-w-[240px]">Securely save a credit or debit card for faster checkout.</p>
            </NuxtLink>

            <NuxtLink to="/user/settings/link-bank" class="bg-[#f5f3f0] p-10 rounded-2xl border-2 border-dashed border-[#c2c9bb] hover:border-secondary transition-all cursor-pointer flex flex-col items-center justify-center text-center group">
              <div class="w-16 h-16 rounded-full bg-[#efeeea] flex items-center justify-center mb-5 group-hover:bg-[#91f78e] transition-colors">
                <span class="material-symbols-outlined text-3xl text-primary group-hover:text-[#00731e]">account_balance</span>
              </div>
              <h5 class="font-[Manrope,sans-serif] font-bold text-xl mb-2 text-primary">Link Bank Account</h5>
              <p class="text-on-surface-variant text-sm max-w-[240px]">Direct bank transfers for wholesale and large harvests.</p>
            </NuxtLink>
          </div>

          <div class="bg-[#efeeea] p-10 rounded-2xl flex items-start gap-8 border-l-4 border-[#563000] relative overflow-hidden">
            <div class="p-4 bg-[#ffdcbe] rounded-xl text-[#563000] shrink-0">
              <span class="material-symbols-outlined text-4xl" style="font-variation-settings: 'FILL' 1;">verified_user</span>
            </div>
            <div class="relative z-10">
              <h6 class="font-bold text-primary text-xl mb-2">Your data is secured</h6>
              <p class="text-on-surface-variant text-base leading-relaxed max-w-2xl opacity-90">
                FarmLink Cambodia uses industry-standard 256-bit encryption. We never store your CVV codes and all banking communication is handled through PCI-DSS compliant gateways.
              </p>
            </div>
            <div class="absolute right-0 bottom-0 w-48 h-full opacity-20 pointer-events-none">
              <img alt="rice" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpEk21YeXUgTELixj9vPgTD5Os0TF-8eUbwSCEsO4LNYCDwQGZqfJf0-JixBld3Huj6_5NIWpE85RcF2f-Sx2mA7p05kqxSd-1k5pWhJI4ufntoldBdiFwxLM0RjtjNW1LyCCnf50QUrmUK3kep60kcd8qQrCMUFeLgyC0bnFByr5676ikUqXAmblJh4L5-PyxezJMAdAfBCDoNO7Z_p9K3o80jjSbFvr-1pWHOQEQNRjGrZ13Ag6JUG3j5fpVgpcCdaJg-tMeuYg" />
            </div>
          </div>

          <div class="flex justify-center pt-4">
            <span class="px-8 py-2.5 bg-[#91f78e] text-[#00731e] text-[10px] font-bold tracking-[0.25em] uppercase rounded-full shadow-sm">
              Eco-Certified Payment Network
            </span>
          </div>
        </section>
      </div>
    </main>

    <div v-if="isRemoveCardModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-white/45 backdrop-blur-[4px] p-4">
      <div class="bg-surface-container-lowest max-w-[26rem] w-full rounded-[1rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(21,66,18,0.18)] border border-outline-variant/10">
        <div class="h-28 w-full relative">
          <img
            alt="Harvest texture"
            class="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuATcL4j27CJQBO2AdetPwybalMvMv7HtsMdauBRPxdbf0ZMvBYvNiFdoCJP4P_Yn0J_4dd_2zQR4qh1XTmDqC1hSk1dttPks0F4sgKJdjfJLMiwd-yg3vC-R7mXRjdhT3D2rPjBHrLR7oI9TxM21rQsj8gczLjB3IGkMKdcGZroeS0t0C4-Y_-BgKL2SIRXAGGUuSNZSFo3pq6z25gBYMmWjmswgP0pC5kdv29s6mHOrcednuwXBpEup6tgReY5V6TbwGRZi4oROq0"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/20 to-transparent"></div>
        </div>

        <div class="px-8 pb-8 pt-6 text-center">
          <div class="w-14 h-14 bg-error-container text-error rounded-full flex items-center justify-center mx-auto mb-5">
            <span class="material-symbols-outlined text-3xl">delete_forever</span>
          </div>
          <h3 class="font-[Manrope,sans-serif] text-[1.55rem] font-bold text-on-surface mb-3 leading-tight">Remove Payment Method?</h3>
          <p class="text-on-surface-variant font-body leading-relaxed mb-8 max-w-[18rem] mx-auto">
            Are you sure you want to remove this card ending in <span class="font-bold text-on-surface">{{ selectedCardLast4 }}</span>? This action will disconnect this source from future FarmLink purchases.
          </p>
          <div class="flex flex-col gap-3">
            <button class="w-full py-4 bg-[#563000] text-on-tertiary font-bold rounded-lg hover:brightness-110 transition-all shadow-sm">
              Remove Method
            </button>
            <button class="w-full py-3.5 text-primary font-bold hover:bg-surface-container transition-colors rounded-lg" type="button" @click="isRemoveCardModalOpen = false">
              Keep Card
            </button>
          </div>
        </div>
      </div>
    </div>

    <CommonAppFooter />
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24;
}
</style>

