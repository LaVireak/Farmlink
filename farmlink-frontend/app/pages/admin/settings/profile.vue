<template>
    <div class="min-h-screen flex bg-gray-50 font-sans text-gray-800">
      <main class="flex-grow px-12 py-10">
        <h1 class="text-2xl font-semibold mb-10 text-gray-900">Personal Profile</h1>
        <div class="flex border rounded-lg bg-white shadow-sm overflow-hidden max-w-6xl">
          <nav class="w-48 border-r border-gray-200 bg-gray-50">
            <ul class="flex flex-col space-y-1 py-6 px-4 text-gray-700 text-sm font-semibold">
              <li>
                <button
                  @click="activeTab = 'personal'"
                  :class="activeTab === 'personal' ? 'bg-green-100 text-green-700 rounded-md px-3 py-2' : 'hover:bg-gray-100 rounded-md px-3 py-2'"
                  class="w-full text-left"
                >Personal Info</button>
              </li>
              <li>
                <button
                  @click="activeTab = 'security'"
                  :class="activeTab === 'security' ? 'bg-green-100 text-green-700 rounded-md px-3 py-2' : 'hover:bg-gray-100 rounded-md px-3 py-2'"
                  class="w-full text-left"
                >Security</button>
              </li>
              <li>
                <button
                  @click="activeTab = 'notifications'"
                  :class="activeTab === 'notifications' ? 'bg-green-100 text-green-700 rounded-md px-3 py-2' : 'hover:bg-gray-100 rounded-md px-3 py-2'"
                  class="w-full text-left"
                >Notifications</button>
              </li>
              <li>
                <button
                  @click="activeTab = 'appearance'"
                  :class="activeTab === 'appearance' ? 'bg-green-100 text-green-700 rounded-md px-3 py-2' : 'hover:bg-gray-100 rounded-md px-3 py-2'"
                  class="w-full text-left"
                >Appearance</button>
              </li>
              <li>
                <button
                  @click="activeTab = 'team'"
                  :class="activeTab === 'team' ? 'bg-green-100 text-green-700 rounded-md px-3 py-2' : 'hover:bg-gray-100 rounded-md px-3 py-2'"
                  class="w-full text-left"
                >Team</button>
              </li>
            </ul>
          </nav>
  
          <section class="flex-1 p-10">
            <template v-if="activeTab === 'personal'">
              <h2 class="font-semibold text-lg mb-8 text-gray-900">Personal Information</h2>
  
              <div class="flex flex-col items-center space-y-3 mb-8">
                <img
                  src=""
                  alt="Profile Photo"
                  class="rounded-full w-24 h-24 shadow-md"
                />
                <button class="bg-green-700 text-white rounded px-5 py-2 hover:bg-green-800 transition">Change Photo</button>
                <button class="text-sm text-gray-500 hover:underline">Remove</button>
              </div>
  
              <form @submit.prevent="saveChanges" class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label for="firstName" class="block text-sm mb-1 font-medium text-gray-700">First Name</label>
                  <input id="firstName" v-model="form.firstName" type="text" class="input-field" />
                </div>
  
                <div>
                  <label for="lastName" class="block text-sm mb-1 font-medium text-gray-700">Last Name</label>
                  <input id="lastName" v-model="form.lastName" type="text" class="input-field" />
                </div>
  
                <div>
                  <label for="email" class="block text-sm mb-1 font-medium text-gray-700">Email</label>
                  <input id="email" v-model="form.email" type="email" disabled class="input-field bg-gray-100 cursor-not-allowed" />
                </div>
  
                <div>
                  <label for="phone" class="block text-sm mb-1 font-medium text-gray-700">Phone Number</label>
                  <input id="phone" v-model="form.phone" type="tel" class="input-field" />
                </div>
  
                <div>
                  <label for="jobTitle" class="block text-sm mb-1 font-medium text-gray-700">Job Title</label>
                  <input id="jobTitle" v-model="form.jobTitle" type="text" class="input-field" />
                </div>
  
                <div>
                  <label for="location" class="block text-sm mb-1 font-medium text-gray-700">Location</label>
                  <input id="location" v-model="form.location" type="text" class="input-field" />
                </div>
  
                <div class="md:col-span-2 text-right">
                  <button type="submit" class="bg-green-700 px-6 py-2 rounded text-white font-semibold hover:bg-green-800 transition">
                    Save Changes
                  </button>
                </div>
              </form>
            </template>
  
            <template v-else>
              <p class="text-gray-500 italic">Content for {{ activeTab }} tab coming soon...</p>
            </template>
          </section>
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
definePageMeta({
  layout: 'admin'
})
  const activeTab = ref('personal')
  
  const form = ref({
    firstName: 'Channary',
    lastName: 'Sok',
    email: 'channary.sok@farmlink.com',
    phone: '+855 12 345 678',
    jobTitle: 'Admin',
    location: 'Phnom Penh, Cambodia',
  })
  
  function saveChanges() {
    alert('Your changes have been saved!')
  }
  </script>
  
  <style scoped>
  .input-field {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db; /* gray-300 */
    border-radius: 0.375rem; /* rounded-md */
    font-size: 0.875rem; /* text-sm */
    line-height: 1.25rem;
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  }
  
  .input-field:focus {
    border-color: #16a34a; /* green-600 */
    box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.3);
    outline: none;
  }
  </style>