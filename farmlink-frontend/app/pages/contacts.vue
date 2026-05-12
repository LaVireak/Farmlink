<template>
  <CommonAppHeader />

  <main class="max-canvas px-6 py-12 bg-gray-100">
    <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <!-- Form Card -->
      <div class="bg-white rounded-lg p-8 shadow">
        <h1 class="text-3xl font-extrabold mb-2">Get in touch</h1>
        <p class="text-gray-600 mb-6">Questions, partnerships or feedback — we'd love to hear from you. Reply time usually within 1-2 business days.</p>

        <form @submit.prevent="onSubmit" class="grid grid-cols-1 gap-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium">First name</label>
              <input v-model="form.firstName" type="text" class="mt-1 w-full border border-black rounded px-3 py-2" />
              <p v-if="errors.firstName" class="text-xs text-red-600 mt-1">{{ errors.firstName }}</p>
            </div>

            <div>
              <label class="text-sm font-medium">Last name</label>
              <input v-model="form.lastName" type="text" class="mt-1 w-full border border-black rounded px-3 py-2" />
              <p v-if="errors.lastName" class="text-xs text-red-600 mt-1">{{ errors.lastName }}</p>
            </div>
          </div>

          <div>
            <label class="text-sm font-medium">Email</label>
            <input v-model="form.email" type="email" class="mt-1 w-full border border-black rounded px-3 py-2" />
            <p v-if="errors.email" class="text-xs text-red-600 mt-1">{{ errors.email }}</p>
          </div>

          <div>
            <label class="text-sm font-medium">Subject</label>
            <input v-model="form.subject" type="text" class="mt-1 w-full border border-black rounded px-3 py-2" />
            <p v-if="errors.subject" class="text-xs text-red-600 mt-1">{{ errors.subject }}</p>
          </div>

          <div>
            <label class="text-sm font-medium">Message</label>
            <textarea v-model="form.message" rows="6" class="mt-1 w-full border border-black rounded px-3 py-2"></textarea>
            <p v-if="errors.message" class="text-xs text-red-600 mt-1">{{ errors.message }}</p>
          </div>

          <div class="flex items-center gap-4">
            <button type="submit" class="bg-[#EFCF4F] border-2 border-black px-6 py-3 font-black uppercase">Send Message</button>
            <div v-if="submitting" class="text-sm text-gray-600">Sending...</div>
            <div v-if="success" class="text-sm text-green-700">Message sent — thank you!</div>
          </div>
        </form>

        <div class="mt-6 text-xs text-gray-500">We respect your privacy. Your details will only be used to respond to your request.</div>
      </div>

      <!-- Info Card -->
    
      <aside >
        <div class="bg-white rounded-lg p-8 shadow flex flex-col gap-6">
        <div>
          <h2 class="text-xl font-bold">Contact details</h2>
          <p class="text-gray-600 mt-2">FarmLink HQ</p>
        </div>

        <div class="grid grid-cols-1 gap-3 text-sm">
          <div class="flex items-center gap-3">
            <Mail class="w-5 h-5 text-gray-600" />
            <div>
              <div class="font-medium">Email</div>
              <div class="text-gray-600">support@farmlink.example</div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <MapPin class="w-5 h-5 text-gray-600" />
            <div>
              <div class="font-medium">Address</div>
              <div class="text-gray-600">123 Greenway Farm Rd, Springfield</div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <Phone class="w-5 h-5 text-gray-600" />
            <div>
              <div class="font-medium">Phone</div>
              <div class="text-gray-600">+1 555 1234</div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <Clock class="w-5 h-5 text-gray-600" />
            <div>
              <div class="font-medium">Hours</div>
              <div class="text-gray-600">Mon–Fri 9:00–17:00</div>
            </div>
          </div>
        </div>

        <div class="mt-auto">
          <h3 class="text-sm font-semibold mb-2">Follow us</h3>
          <div class="flex gap-3">
            <a aria-label="Twitter" class="w-8 h-8 flex items-center justify-center rounded border"><Twitter /></a>
            <a aria-label="Facebook" class="w-8 h-8 flex items-center justify-center rounded border"><Facebook /></a>
            <a aria-label="Instagram" class="w-8 h-8 flex items-center justify-center rounded border"><Instagram /></a>
          </div>
        </div>
        
        </div>
        <div class="flex justify-center">
            <img src="/assets/images/contact-us.png" alt="" class="w-[full] h-[380px]" />
        </div>
        
      </aside>
      
    </div>
  </main>

  <CommonAppFooter />
</template>

<script setup lang="ts">

import{
  Mail,
  MapPin,
  Phone,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  }from 'lucide-vue-next'

import { reactive, ref } from 'vue'

const form = reactive({ firstName: '', lastName: '', email: '', subject: '', message: '' })
const errors = reactive({ firstName: '', lastName: '', email: '', subject: '', message: '' })
const submitting = ref(false)
const success = ref(false)

function validate() {
  let ok = true
  errors.firstName = form.firstName.trim() ? '' : 'First name is required.'
  errors.lastName = form.lastName.trim() ? '' : 'Last name is required.'
  errors.subject = form.subject.trim() ? '' : 'Subject is required.'
  errors.message = form.message.trim() ? '' : 'Message is required.'
  errors.email = /^\S+@\S+\.\S+$/.test(form.email) ? '' : 'Enter a valid email.'
  if (errors.firstName || errors.lastName || errors.email || errors.subject || errors.message) ok = false
  return ok
}

async function onSubmit() {
  success.value = false
  if (!validate()) return
  submitting.value = true
  try {
    // TODO: replace with API call to send message
    await new Promise((r) => setTimeout(r, 700))
    success.value = true
    // clear form
    form.firstName = ''
    form.lastName = ''
    form.email = ''
    form.subject = ''
    form.message = ''
  } catch (err) {
    console.error(err)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.max-canvas { max-width: 1920px; margin: 0 auto; width: 100%; }
</style>
