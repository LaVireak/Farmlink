<template>
    <div class="min-h-screen flex bg-[#f7fdf4] font-sans text-gray-800">
      <main class="flex-1 p-10">
        <AdminProfileDropdown/>
        <div class="grid grid-cols-12 gap-10">
          
        <div class="col-span-9 bg-white rounded-[2.5rem] p-12 shadow-sm border border-gray-50">
          <section class="flex-1">
              <h2 class="text-2xl font-black text-[#15803d] mb-10">Personal Information</h2>
  
              <div class="flex flex-col items-center space-y-3 mb-8">
                <img
                  src="/images/farmer.jpg"
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
          </section>
        </div>
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
definePageMeta({
  middleware: 'admin',
  layout: 'admin'
})
  
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