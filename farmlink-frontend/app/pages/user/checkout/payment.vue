<template>
  <div class="min-h-screen bg-green-50 p-4 md:p-8 text-gray-800">
    <!-- Progress -->
    <div class="flex items-center gap-4 mb-8 text-sm">
      <div class="flex items-center gap-2 text-gray-400">
        <span class="w-6 h-6 flex items-center justify-center rounded-full border">1</span>
        Cart
      </div>
      <div class="flex-1 h-px bg-gray-300"></div>

      <div class="flex items-center gap-2 text-gray-400">
        <span class="w-6 h-6 flex items-center justify-center rounded-full border">2</span>
        Shipping
      </div>
      <div class="flex-1 h-px bg-gray-300"></div>

      <div class="flex items-center gap-2 text-green-700 font-semibold">
        <span class="w-6 h-6 flex items-center justify-center rounded-full bg-green-700 text-white">3</span>
        Payment
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-8">
      <!-- LEFT -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Card Info -->
        <div class="bg-white p-6 rounded-xl shadow-sm">
          <h2 class="text-xl font-semibold text-green-800 mb-6">
            Card Information
          </h2>

          <div class="space-y-4">
            <!-- Name -->
            <Input label="Cardholder Name" v-model="form.name" />

            <!-- Card Number -->
            <div>
              <label class="text-xs text-gray-500">Card Number</label>
              <input
                v-model="form.card"
                @input="formatCard"
                maxlength="19"
                placeholder="0000 0000 0000 0000"
                class="w-full mt-1 p-2 rounded-lg border focus:ring-2 focus:ring-green-600 outline-none"
              />
            </div>

            <!-- Expiry + CVV -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs text-gray-500">Expiry Date</label>
                <input
                  v-model="form.expiry"
                  @input="formatExpiry"
                  maxlength="5"
                  placeholder="MM/YY"
                  class="w-full mt-1 p-2 rounded-lg border focus:ring-2 focus:ring-green-600 outline-none"
                />
              </div>

              <div>
                <label class="text-xs text-gray-500">CVV</label>
                <input
                  v-model="form.cvv"
                  type="password"
                  maxlength="4"
                  placeholder="***"
                  class="w-full mt-1 p-2 rounded-lg border focus:ring-2 focus:ring-green-600 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Billing Address -->
        <div class="bg-white p-6 rounded-xl shadow-sm">
          <h2 class="text-xl font-semibold text-green-800 mb-4">
            Billing Address
          </h2>

          <div class="space-y-4">
            <label
              class="flex items-start gap-3 border rounded-xl p-4 cursor-pointer"
              :class="billingSame ? 'border-green-700 bg-green-50' : ''"
            >
              <input
                type="radio"
                v-model="billingSame"
                :value="true"
                class="mt-1 accent-green-700"
              />
              <div>
                <p class="font-medium">Same as delivery address</p>
                <p class="text-xs text-gray-500">
                  123 Orchard Lane, Green Valley, CA 90210
                </p>
              </div>
            </label>

            <label
              class="flex items-start gap-3 border rounded-xl p-4 cursor-pointer"
              :class="!billingSame ? 'border-green-700 bg-green-50' : ''"
            >
              <input
                type="radio"
                v-model="billingSame"
                :value="false"
                class="mt-1 accent-green-700"
              />
              <div>
                <p class="font-medium">Use a different address</p>
                <p class="text-xs text-gray-500">
                  Add a new billing location
                </p>
              </div>
            </label>
          </div>
        </div>

        <!-- Footer badges -->
        <div class="flex flex-wrap gap-6 text-xs text-gray-500">
          <span>🔒 SSL ENCRYPTED</span>
          <span>🛡️ SECURE GATEWAY</span>
          <span>🌿 CERTIFIED ORGANIC</span>
        </div>
      </div>

      <!-- RIGHT -->
      <div class="space-y-6">
        <!-- Summary -->
        <div class="bg-green-800 text-white p-6 rounded-2xl shadow-lg">
          <h3 class="font-semibold mb-4">Order Summary</h3>

          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span>Organic Veggie Box (L)</span>
              <span>$45.00</span>
            </div>
            <div class="flex justify-between">
              <span>Artisanal Honey Jar</span>
              <span>$12.50</span>
            </div>
            <div class="flex justify-between">
              <span>Delivery Fee</span>
              <span>FREE</span>
            </div>
          </div>

          <div class="mt-6 border-t border-green-600 pt-4">
            <p class="text-xs text-green-200">TOTAL AMOUNT</p>
            <p class="text-2xl font-bold">$57.50</p>
          </div>

          <button
            class="w-full mt-6 bg-yellow-400 text-green-900 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition"
          >
            Confirm Payment →
          </button>

          <p class="text-xs text-green-200 mt-4">
            By clicking, you agree to the FarmLink terms.
          </p>
        </div>

        <!-- Image Banner -->
        <div class="h-40 rounded-xl bg-green-200 flex items-end p-4 text-white font-semibold">
          Supporting local farmers with every harvest
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const form = reactive({
  name: 'Johnathan Appieseed',
  card: '',
  expiry: '',
  cvv: ''
})

const billingSame = ref(true)

// Format card number (#### #### #### ####)
function formatCard(e: Event) {
  let value = (e.target as HTMLInputElement).value.replace(/\D/g, '')
  value = value.substring(0, 16)
  form.card = value.replace(/(.{4})/g, '$1 ').trim()
}

// Format expiry MM/YY
function formatExpiry(e: Event) {
  let value = (e.target as HTMLInputElement).value.replace(/\D/g, '')
  value = value.substring(0, 4)

  if (value.length >= 3) {
    form.expiry = value.slice(0, 2) + '/' + value.slice(2)
  } else {
    form.expiry = value
  }
}
</script>

<!-- Reusable Input -->
<script lang="ts">
export default {
  components: {
    Input: {
      props: ['modelValue', 'label'],
      emits: ['update:modelValue'],
      template: `
        <div>
          <label class="text-xs text-gray-500">{{ label }}</label>
          <input
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
            class="w-full mt-1 p-2 rounded-lg border focus:ring-2 focus:ring-green-600 outline-none"
          />
        </div>
      `
    }
  }
}
</script>