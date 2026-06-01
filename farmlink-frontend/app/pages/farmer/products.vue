<template>
  <main class="px-8 py-8 bg-[#F5F7F3] min-h-screen font-sans antialiased">
    <FarmerHeader title="Product Management" />

    
    <Transition name="toast">
      <div v-if="toast"
        class="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-bold text-white shadow-xl flex items-center gap-2.5 pointer-events-none"
        :class="toast.type === 'success' ? 'bg-[#2d6a4f]' : 'bg-rose-600'">
        <svg v-if="toast.type === 'success'" class="w-4 h-4 shrink-0 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <svg v-else class="w-4 h-4 shrink-0 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        {{ toast.message }}
      </div>
    </Transition>

    
    <Transition name="fade">
      <div v-if="confirmDelete.show" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/70 backdrop-blur-sm p-4">
        <div class="bg-white rounded-2xl max-w-sm w-full shadow-xl border border-gray-100 p-7 animate-in fade-in zoom-in duration-200 text-center">

          
          <div class="relative inline-flex items-center justify-center mb-5">
            <span class="absolute w-16 h-16 rounded-full bg-rose-100 animate-ping opacity-30"></span>
            <span class="relative w-14 h-14 rounded-full bg-rose-100 border-2 border-rose-200 flex items-center justify-center">
              <svg class="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </span>
          </div>

          
          <h3 class="text-[15px] font-bold text-gray-900 mb-1 tracking-tight">Remove "{{ confirmDelete.productName }}"?</h3>
          <p class="text-[12px] text-gray-400 font-medium mb-6">This action is permanent and cannot be undone.</p>

          
          <div class="flex gap-2.5">
            <button @click="confirmDelete.show = false; confirmDelete.productId = null"
              class="flex-1 py-2.5 text-xs font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-xl transition-all duration-200">
              Keep It
            </button>
            <button @click="executeDelete"
              class="flex-1 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] rounded-xl transition-all duration-200 shadow-sm shadow-rose-200">
              Yes, Remove
            </button>
          </div>

        </div>
      </div>
    </Transition>

    
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 border-b border-gray-200/50 pb-5">
      <div>
        <p class="text-gray-500 text-sm mt-1 max-w-[600px]">
          Manage your fresh Cambodian harvest, track stock levels, and monitor listing status for your local produce.
        </p>
      </div>
      <div class="flex gap-3 items-center">
        <input type="file" accept=".csv" class="hidden" id="csv-file-input" @change="onCsvFileChange" />
        <button @click="triggerCsvFileInput" class="px-4 py-2.5 bg-amber-100/60 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl transition flex items-center gap-2 border border-amber-200/30">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
          </svg>
          Bulk Upload (CSV)
        </button>
        <a href="#new-batch" class="px-4 py-2.5 bg-[#2d6a4f] text-white font-bold text-xs rounded-xl hover:bg-[#1b4332] transition flex items-center gap-2 shadow-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
          </svg>
          Add New Product
        </a>
      </div>
    </div>

    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="p-5 bg-white rounded-2xl border border-gray-200/50 shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-300">
        <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">TOTAL LISTINGS</div>
        <div class="text-3xl font-bold text-gray-800 mt-2 tracking-tight">
          {{ pendingData ? 0 : products.length }}
        </div>
      </div>
      <div class="p-5 bg-white rounded-2xl border border-gray-200/50 shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-300">
        <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ACTIVE PRODUCTS</div>
        <div class="text-3xl font-bold text-emerald-700 mt-2 tracking-tight">
          {{ pendingData ? 0 : activeCount }}
        </div>
      </div>
      <div class="p-5 bg-white rounded-2xl border border-gray-200/50 shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-300">
        <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">LOW STOCK ALERTS</div>
        <div class="text-3xl font-bold text-amber-700 mt-2 tracking-tight">
          {{ pendingData ? 0 : lowStockCount }}
        </div>
      </div>
      <div class="p-5 bg-white rounded-2xl border border-gray-200/50 shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-300">
        <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">PENDING APPROVAL</div>
        <div class="text-3xl font-bold text-gray-800 mt-2 tracking-tight">
          {{ pendingData ? 0 : pendingApprovalCount }}
        </div>
      </div>
    </div>

    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 items-stretch">
      
      <div class="lg:col-span-2">
        <div id="new-batch" class="relative overflow-hidden bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:border-emerald-500/10 transition-all duration-500 p-8 scroll-mt-6 group h-full flex flex-col justify-between">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600"></div>
          <div class="absolute -right-24 -bottom-24 w-80 h-80 rounded-full bg-gradient-to-tr from-emerald-500/5 to-teal-400/5 pointer-events-none blur-3xl group-hover:scale-110 transition-transform duration-700"></div>

          <div class="relative mb-6">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50/80 border border-emerald-100/50 text-[#2d6a4f] text-[10px] font-bold tracking-wider uppercase mb-3">
              🌱 HARVEST REGISTRY
            </div>
            <h2 class="text-2xl font-bold text-gray-700 leading-none mb-2">
              Add New Product
            </h2>
            <p class="text-xs text-gray-400 font-medium leading-relaxed max-w-md">
              Register a fresh harvest, set competitive pricing, and share your crop's unique story with the regional marketplace.
            </p>
          </div>

          <form @submit.prevent="publishProduct" class="space-y-6 relative flex-1 flex flex-col justify-between">
            <div class="space-y-6">
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Product Name (EN)</label>
                  <input v-model="addForm.name" type="text" required placeholder="e.g. Purple Dragon Fruit"
                    class="w-full px-4 py-3 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-[#2d6a4f] focus:bg-white transition-all duration-300" />
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Category</label>
                  <div class="relative">
                    <select v-model="addForm.category" required
                      class="w-full pl-4 pr-10 py-3 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-[#2d6a4f] focus:bg-white transition-all duration-300 appearance-none cursor-pointer">
                      <option>Fruits</option>
                      <option>Vegetables</option>
                      <option>Leafy Greens</option>
                      <option>Herbs</option>
                    </select>
                    <span class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

              
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Pricing (USD)</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-extrabold text-sm">$</span>
                    <input v-model="addForm.price" type="number" step="0.01" required placeholder="0.00"
                      class="w-full pl-8 pr-16 py-3 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-[#2d6a4f] focus:bg-white transition-all duration-300" />
                    <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-[#2d6a4f] bg-emerald-50 border border-emerald-100/50 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                      / {{ addForm.unit }}
                    </span>
                  </div>
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Selling Unit</label>
                  <div class="relative">
                    <select v-model="addForm.unit" required
                      class="w-full pl-4 pr-10 py-3 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-[#2d6a4f] focus:bg-white transition-all duration-300 appearance-none cursor-pointer">
                      <option value="kg">kg (Kilogram)</option>
                      <option value="gram">gram (Gram)</option>
                      <option value="piece">piece (Piece)</option>
                      <option value="bunch">bunch (Bunch)</option>
                      <option value="pack">pack (Pack)</option>
                      <option value="box">box (Box)</option>
                    </select>
                    <span class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Stock Quantity</label>
                  <input v-model="addForm.stock" type="number" required placeholder="Enter amount"
                    class="w-full px-4 py-3 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-[#2d6a4f] focus:bg-white transition-all duration-300" />
                </div>
              </div>

              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                
                <div>
                  <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Description</label>
                  <textarea v-model="addForm.description" required
                    placeholder="Describe your produce (harvest method, freshness, variety, taste profile)..."
                    class="w-full h-[160px] px-4 py-3 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-[#2d6a4f] focus:bg-white transition-all duration-300 resize-none"></textarea>
                </div>

                
                <div>
                  <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Browse Image</label>
                  <div @click="triggerFileInput" class="cursor-pointer border-2 border-dashed border-gray-300 hover:border-[#2d6a4f] bg-gray-50/50 hover:bg-emerald-50/20 rounded-xl p-5 text-center transition-all duration-300 flex flex-col items-center justify-center h-[160px] w-full group relative overflow-hidden">
                    <input type="file" accept="image/*" class="hidden" id="file-input" @change="onFileChange" />
                    <div v-if="addForm.imageUrl" class="absolute inset-0 w-full h-full bg-gray-50/30">
                      <img :src="addForm.imageUrl" class="w-full h-full object-cover animate-in fade-in duration-300" alt="Selected Produce Preview" />
                      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-2">
                        <svg class="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Replace Image File
                      </div>
                    </div>
                    <div v-else class="text-center">
                      <svg class="w-7 h-7 text-gray-400 mx-auto mb-1.5 group-hover:text-emerald-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span class="text-xs font-bold text-[#2d6a4f] block mb-0.5">Click to browse crop file</span>
                      <span class="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">PNG, JPG or WebP</span>
                    </div>
                  </div>
                </div>
              </div>

              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div @click="addForm.isOrganic = !addForm.isOrganic"
                  :class="addForm.isOrganic ? 'border-emerald-500 bg-emerald-50/30 ring-4 ring-emerald-500/5 shadow-sm' : 'border-gray-200/80 bg-white hover:border-gray-300 hover:bg-gray-50/30'"
                  class="flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-300 group select-none">
                  <div class="flex items-center gap-3">
                    <span :class="addForm.isOrganic ? 'bg-emerald-500 text-white scale-105 shadow-sm shadow-emerald-500/10' : 'bg-gray-50 text-gray-400 border border-gray-100'"
                      class="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-300">🌱</span>
                    <div>
                      <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider leading-none mb-1">Pesticide Free</h4>
                      <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Organic / Natural Certified</p>
                    </div>
                  </div>
                  <div :class="addForm.isOrganic ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-200 bg-white'"
                    class="w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300">
                    <svg v-if="addForm.isOrganic" class="w-3.5 h-3.5 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                <div @click="addForm.isSeasonal = !addForm.isSeasonal"
                  :class="addForm.isSeasonal ? 'border-amber-500 bg-amber-50/30 ring-4 ring-amber-500/5 shadow-sm' : 'border-gray-200/80 bg-white hover:border-gray-300 hover:bg-gray-50/30'"
                  class="flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-300 group select-none">
                  <div class="flex items-center gap-3">
                    <span :class="addForm.isSeasonal ? 'bg-amber-500 text-white scale-105 shadow-sm shadow-amber-500/10' : 'bg-gray-50 text-gray-400 border border-gray-100'"
                      class="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-300">☀️</span>
                    <div>
                      <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider leading-none mb-1">Seasonal Product</h4>
                      <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Limited Availability Crop</p>
                    </div>
                  </div>
                  <div :class="addForm.isSeasonal ? 'bg-amber-500 border-amber-500 text-white' : 'border-gray-200 bg-white'"
                    class="w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300">
                    <svg v-if="addForm.isSeasonal" class="w-3.5 h-3.5 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            
            <div class="flex items-center justify-end mt-6 pt-5 border-t border-gray-100 gap-3">
              <button type="button" @click="resetForm"
                class="px-5 py-3 text-xs font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-50 border border-gray-200/80 rounded-xl transition-all duration-300">
                Clear Form
              </button>
              <button type="submit" :disabled="publishing"
                class="px-6 py-3 bg-gradient-to-r from-emerald-600 to-[#1b4332] hover:from-emerald-700 hover:to-[#0f2a1f] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md shadow-emerald-950/10 hover:shadow-lg hover:shadow-emerald-950/20 active:scale-[0.98] disabled:opacity-50 flex items-center gap-2">
                <span v-if="publishing" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>{{ publishing ? 'Publishing...' : 'Publish Product Listing' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      
      <div class="space-y-6">
        
        <div class="bg-gradient-to-br from-[#0e291e] via-[#163829] to-[#22523d] text-white rounded-2xl p-6 shadow-sm relative overflow-hidden group">
          <div class="absolute -right-6 -bottom-6 text-emerald-500/10 pointer-events-none group-hover:scale-110 transition-transform duration-500">
            <svg class="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
          </div>
          <h3 class="font-bold text-sm mb-3 uppercase tracking-wider text-emerald-300">Market Trends</h3>
          <p class="text-emerald-100/90 text-xs leading-relaxed">
            Organic fruits are currently in high demand in Phnom Penh. Consider highlighting your 'Pesticide Free' certifications to increase sales by up to 25%.
          </p>
          <NuxtLink to="/farmer/analytics" class="mt-5 block text-center px-4 py-3 bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm">
            VIEW MARKET INSIGHTS
          </NuxtLink>
        </div>

        
        <div class="bg-white rounded-2xl border border-gray-200/50 shadow-xs p-5">
          <h3 class="font-bold text-[10px] text-gray-500 uppercase tracking-widest mb-4">Inventory Health</h3>
          <div class="space-y-4">
            <div>
              <div class="flex items-center justify-between text-xs mb-1.5">
                <span class="text-gray-500 font-medium">Storage Capacity</span>
                <span class="font-bold text-gray-700">64% Full</span>
              </div>
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-amber-500 rounded-full" style="width: 64%"></div>
              </div>
            </div>
            <div class="flex items-center justify-between text-xs border-t border-gray-100 pt-3">
              <span class="text-gray-500 font-medium">Avg. Turnover</span>
              <span class="font-bold text-gray-700">4.2 Days</span>
            </div>
            <div class="flex items-center justify-between text-xs border-t border-gray-100 pt-3">
              <span class="text-gray-500 font-medium">Spoilage Rate</span>
              <span class="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100/40">-12% this month</span>
            </div>
          </div>
        </div>

        
        <div class="bg-white rounded-2xl border border-gray-200/50 shadow-xs p-5">
          <h3 class="font-bold text-[10px] text-gray-500 uppercase tracking-widest mb-3">Quick Links</h3>
          <div class="space-y-1.5">
            <NuxtLink to="/farmer/orders" class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-emerald-50/50 text-gray-600 hover:text-[#2d6a4f] transition-all font-medium text-xs uppercase tracking-wider">
              <svg class="w-4 h-4 text-gray-400 group-hover:text-[#2d6a4f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6m0 0L7 12m6-6l6 6"/>
              </svg>
              <span>Delivery Pipeline</span>
            </NuxtLink>
            <NuxtLink to="/farmer/orders" class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-emerald-50/50 text-gray-600 hover:text-[#2d6a4f] transition-all font-medium text-xs uppercase tracking-wider">
              <svg class="w-4 h-4 text-gray-400 group-hover:text-[#2d6a4f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span>Sales Logs & Invoices</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    
    <div class="w-full mt-8">
      <div class="bg-white rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden">
        <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 class="font-bold text-gray-700 text-base">Product Inventory</h2>
          <div class="flex gap-3">
            <button @click="refreshProducts" :disabled="pendingData"
              class="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-50/60 hover:bg-emerald-100/80 active:bg-emerald-200/50 text-emerald-800 disabled:opacity-50 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all duration-300 border border-emerald-200/30 group active:scale-[0.97]">
              <svg class="w-3.5 h-3.5 transition-transform duration-700 ease-in-out group-hover:rotate-180"
                :class="{ 'animate-spin': pendingData }"
                fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <span>{{ pendingData ? 'Updating...' : 'Sync Inventory' }}</span>
            </button>
          </div>
        </div>

        
        <div class="grid grid-cols-[0.8fr_1.5fr_1fr_1fr_1.2fr_1.3fr_1.1fr_1.4fr] gap-4 p-8 py-4 bg-gray-50/70 backdrop-blur-sm border-b border-gray-200 items-center">
          <span class="text-[12px] font-bold text-gray-400 uppercase tracking-widest pl-8">ID</span>
          <span class="text-[12px] font-bold text-gray-400 uppercase tracking-widest pl-8">Name</span>
          <span class="text-[12px] font-bold text-gray-400 uppercase tracking-widest pl-2">Status</span>
          <span class="text-[12px] font-bold text-gray-400 uppercase tracking-widest pl-2">Price</span>
          <span class="text-[12px] font-bold text-gray-400 uppercase tracking-widest pl-2">Category</span>
          <span class="text-[12px] font-bold text-gray-400 uppercase tracking-widest mr-2">Available Stock</span>
          <span class="text-[12px] font-bold text-gray-400 uppercase tracking-widest text-left pl-1">Image</span>
          <span class="text-[12px] font-bold text-gray-400 uppercase tracking-widest text-center">Action</span>
        </div>

        
        <div v-if="pendingData" class="flex flex-col gap-3 p-4 bg-gray-50/30">
          <div v-for="i in 3" :key="'prod-skel-'+i" class="grid grid-cols-[0.8fr_1.5fr_1fr_1fr_1.2fr_1.3fr_1.1fr_1.4fr] gap-4 animate-pulse px-6 py-4 bg-white rounded-xl border border-gray-100 shadow-3xs items-center">
            <div class="flex items-center"><div class="h-6 w-14 bg-gray-200 rounded-lg"></div></div>
            <div class="flex flex-col justify-center"><div class="h-4 w-28 bg-gray-200 rounded"></div><div class="h-3 w-16 bg-gray-100 rounded mt-1.5"></div></div>
            <div class="flex items-center"><div class="h-6 w-16 bg-gray-200 rounded-full"></div></div>
            <div class="flex items-center"><div class="h-5 w-16 bg-gray-200 rounded"></div></div>
            <div class="flex items-center"><div class="h-6 w-16 bg-gray-200 rounded-lg"></div></div>
            <div class="flex flex-col justify-center"><div class="h-4 w-16 bg-gray-200 rounded"></div><div class="h-3.5 w-20 bg-gray-100 rounded mt-1.5"></div></div>
            <div class="flex items-center justify-start p-1"><div class="w-20 h-20 bg-gray-200 rounded-xl"></div></div>
            <div class="flex items-center justify-center"><div class="h-8 w-24 bg-gray-200 rounded-lg"></div></div>
          </div>
        </div>

        
        <div v-else-if="products.length > 0" class="flex flex-col gap-3 p-4 bg-gray-50/30">
          <div v-for="product in products" :key="product.id"
            class="grid grid-cols-[0.8fr_1.5fr_1fr_1fr_1.2fr_1.3fr_1.1fr_1.4fr] gap-4 px-6 py-4.5 bg-white rounded-xl border border-gray-200/50 border-l-4 border-l-[#2d6a4f] shadow-3xs hover:shadow-2xs hover:bg-emerald-50/10 hover:-translate-y-[1.5px] transition-all duration-300 items-center group"
            :class="{ 'opacity-60 pointer-events-none': product._optimistic }">
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100/60 border border-gray-200/40 text-[10px] font-bold text-gray-500 font-mono uppercase tracking-wider shadow-2xs" :title="product.id">
                #{{ String(product.id)?.slice(0, 6) }}
              </span>
              
              <span v-if="product._optimistic" class="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin shrink-0"></span>
            </div>
            <div class="flex flex-col pr-2">
              <div class="font-bold text-gray-800 text-[13.5px] leading-snug tracking-0.5 group-hover:text-[#2d6a4f] transition-colors duration-300">{{ product.name }}</div>
              <div class="flex items-center gap-1.5 mt-1">
                <span v-if="product.badge === 'Organic' || !!product.isOrganic" class="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100/50 uppercase tracking-wide">ORGANIC</span>
                <span v-if="!!product.isSeasonal" class="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-100/50 uppercase tracking-wide">SEASONAL</span>
                <span v-if="!product.isOrganic && !product.isSeasonal" class="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">PREMIUM SELECTION</span>
              </div>
            </div>
            <div>
              <span class="inline-flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-2xs transition-all duration-300"
                :class="product.stock > 0 
                  ? 'bg-emerald-50/70 text-emerald-700 border-emerald-200/40' 
                  : 'bg-rose-50/70 text-rose-700 border-rose-200/40'">
                <span class="w-1.5 h-1.5 rounded-full animate-pulse" 
                  :class="product.stock > 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-rose-500'"></span>
                {{ product.stock > 0 ? 'Active' : 'Out of Stock' }}
              </span>
            </div>
            <div>
              <div class="font-bold text-[#2d6a4f] text-[15px] tracking-tight flex items-baseline">
                ${{ Number(product.price)?.toFixed(2) }}
                <span class="text-[10px] text-gray-400 font-bold tracking-normal ml-0.5">/{{ product.unit }}</span>
              </div>
            </div>
            <div>
              <span class="text-[9.5px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border shadow-3xs"
                :class="getProductCategoryClass(product.category)">
                {{ product.category || 'Fruits' }}
              </span>
            </div>
            <div class="flex flex-col">
              <span class="font-bold text-gray-800 text-sm tracking-tight">
                {{ product.stock }} {{ product.unit }}{{ product.stock === 1 ? '' : 's' }}
              </span>
              <span class="text-[10px] font-bold mt-1 inline-flex items-center gap-1"
                :class="product.stock > 10 ? 'text-emerald-700' : product.stock > 0 ? 'text-amber-600' : 'text-rose-600'">
                <span class="w-1.5 h-1.5 rounded-full" 
                  :class="product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-400' : 'bg-rose-500'"></span>
                {{ product.stock > 10 ? 'Healthy Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock' }}
              </span>
            </div>
            <div class="flex items-center justify-start p-1">
              <div class="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200/60 shadow-2xs group-hover:scale-110 group-hover:shadow-sm transition-all duration-300 overflow-hidden shrink-0 relative">
                <img v-if="product.image" :src="getProductImage(product.image)" @error="product.image = ''" class="w-full h-full object-cover animate-in fade-in duration-300" alt="Product Image" />
                <div v-else class="w-full h-full bg-[#2d6a4f]/5 flex items-center justify-center text-xl">
                  {{ getCategoryEmoji(product.category) }}
                </div>
              </div>
            </div>
            
            <div class="flex items-center justify-center gap-1.5">

              
              <button @click="viewProductDetail(product)"
                class="w-8 h-8 flex items-center justify-center rounded-lg border border-sky-200 bg-sky-50 text-sky-500 hover:bg-sky-100 hover:border-sky-400 hover:text-sky-700 active:scale-95 transition-all duration-200"
                title="View Details">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>

              
              <button @click="editProduct(product)"
                class="w-8 h-8 flex items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-amber-500 hover:bg-amber-100 hover:border-amber-400 hover:text-amber-700 active:scale-95 transition-all duration-200"
                title="Edit Listing">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>

              
              <button @click="promptDelete(product)"
                class="w-8 h-8 flex items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-100 hover:border-rose-400 hover:text-rose-700 active:scale-95 transition-all duration-200"
                title="Remove Listing">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>

            </div>
          </div>
        </div>

        
        <div v-else class="px-6 py-16 text-center text-gray-400 text-sm font-medium">
          <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
          No Product Found. Please add some products.
        </div>
        <div class="px-6 py-4 text-center border-t border-gray-100">
          <span class="text-xs text-gray-400 font-semibold tracking-wide uppercase">All inventory items</span>
        </div>
      </div>
    </div>

    
    <Transition name="fade">
      <div v-if="viewingProduct" class="fixed inset-0 z-55 flex items-center justify-center bg-gray-950/60 backdrop-blur-sm p-4">
        <div class="bg-white/95 backdrop-blur-md rounded-3xl max-w-2xl w-full border border-white/50 shadow-2xl relative overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
          
          
          <div class="p-2 w-full pb-0 z-10">
            <div class="w-full h-56 md:h-64 rounded-2xl overflow-hidden relative text-white p-5 flex flex-col justify-between shadow-md bg-gradient-to-br from-[#0c2317] to-[#1c4b35]">
              
              <div v-if="viewingProduct.image" class="absolute inset-0 z-0 overflow-hidden p-2 bg-[#0c2317]/40">
                <img :src="getProductImage(viewingProduct.image)" @error="viewingProduct.image = ''" class="w-full h-full object-cover rounded-xl transition-transform duration-700 ease-out" alt="Produce Image" />
                
                <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/40 z-10 rounded-xl"></div>
              </div>

              
              <div v-else class="absolute inset-0 bg-gradient-to-br from-[#0c2317] via-[#122e1f] to-[#1c4b35] z-0 p-2">
                <div class="absolute inset-2 rounded-xl bg-[radial-gradient(#2d6a4f_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>
                <div class="absolute inset-2 rounded-xl flex flex-col items-center justify-center text-7xl select-none opacity-90">
                  <span class="animate-bounce duration-[3000ms]">{{ getCategoryEmoji(viewingProduct.category) }}</span>
                  <span class="text-[9px] font-bold text-emerald-500/50 tracking-widest uppercase mt-4">NO PHOTO UPLOADED</span>
                </div>
              </div>

              
              <div class="flex flex-wrap gap-2 z-20 relative">
                <span class="px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-emerald-300 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 shadow-2xs">
                  {{ viewingProduct.category || 'Fruits' }}
                </span>
                <span v-if="viewingProduct.badge === 'Organic' || !!viewingProduct.isOrganic" class="px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/40 backdrop-blur-md rounded-lg border border-emerald-500/20 shadow-2xs flex items-center gap-1">
                  🌱 Organic
                </span>
                <span v-if="!!viewingProduct.isSeasonal" class="px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-amber-400 bg-amber-950/40 backdrop-blur-md rounded-lg border border-amber-500/20 shadow-2xs flex items-center gap-1">
                  ☀️ Seasonal
                </span>
              </div>

              
              <button @click="viewingProduct = null" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center shadow-md border border-white/10 hover:scale-110 active:scale-95 transition-all duration-300 z-20">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              
              <div class="z-20 relative flex items-end justify-between mt-auto">
                <div>
                  <span class="text-[9px] font-bold text-white/50 uppercase tracking-widest block mb-0.5">Product Name</span>
                  <h2 class="text-xl font-bold text-white leading-tight">{{ viewingProduct?.name }}</h2>
                </div>
                <div class="text-right">
                  <span class="text-[9px] font-bold text-white/50 uppercase tracking-widest block mb-0.5">Registry ID</span>
                  <span class="text-xs font-bold text-white/90 font-mono block">#{{ String(viewingProduct.id)?.slice(0, 10) }}</span>
                </div>
              </div>
            </div>
          </div>

          
          <div class="w-full p-6 md:p-8 flex flex-col justify-between relative overflow-hidden bg-white rounded-b-3xl">
            
            <svg class="absolute -bottom-16 -right-16 w-52 h-52 text-[#2d6a4f]/5 pointer-events-none transform rotate-45 select-none z-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 3C11.5 3 7 7.5 7 17v2h2c9.5 0 12-4.5 12-14zm-4 4.5c-.8.8-2 .8-2.8 0s-.8-2 0-2.8 2-.8 2.8 0 .8 2 0 2.8zM3 13c0 4.4 3.6 8 8 8h2c-4.4 0-10-5.6-10-10z"/>
            </svg>
            
            <div class="z-10 relative space-y-5 flex-1 flex flex-col justify-between">
              <div class="space-y-5">
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Product Name (EN)</label>
                    <input :value="viewingProduct?.name" type="text" readonly
                      class="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none cursor-default select-all" />
                  </div>
                  <div>
                    <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Category</label>
                    <div class="relative">
                      <select :value="viewingProduct?.category || 'Fruits'" disabled
                        class="w-full pl-4 pr-10 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none appearance-none cursor-default">
                        <option>{{ viewingProduct?.category || 'Fruits' }}</option>
                      </select>
                      <span class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>

                
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Pricing (USD)</label>
                    <div class="relative">
                      <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-extrabold text-sm">$</span>
                      <input :value="viewingProduct?.price ? Number(viewingProduct.price).toFixed(2) : '0.00'" type="text" readonly
                        class="w-full pl-8 pr-16 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 font-bold cursor-default select-all" />
                      <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-[#2d6a4f] bg-emerald-50 border border-emerald-100/50 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider select-none">
                        / {{ viewingProduct?.unit || 'kg' }}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Selling Unit</label>
                    <div class="relative">
                      <select :value="viewingProduct?.unit || 'kg'" disabled
                        class="w-full pl-4 pr-10 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 cursor-default appearance-none">
                        <option>{{ viewingProduct?.unit || 'kg' }}</option>
                      </select>
                      <span class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                  <div>
                    <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Stock Quantity</label>
                    <input :value="viewingProduct?.stock" type="text" readonly
                      class="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 font-bold cursor-default select-all" />
                  </div>
                </div>

                
                <div>
                  <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Description</label>
                  <textarea :value="viewingProduct?.description || 'No specific details provided for this crop batch.'" readonly
                    class="w-full h-24 px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 leading-relaxed cursor-default resize-none overflow-y-auto scrollbar-thin"></textarea>
                </div>

                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div :class="viewingProduct?.badge === 'Organic' || !!viewingProduct?.isOrganic ? 'border-emerald-500 bg-emerald-50/30 ring-4 ring-emerald-500/5 shadow-sm' : 'border-gray-200/80 bg-white'"
                    class="flex items-center justify-between p-3.5 rounded-2xl border select-none transition duration-300">
                    <div class="flex items-center gap-3">
                      <span :class="viewingProduct?.badge === 'Organic' || !!viewingProduct?.isOrganic ? 'bg-emerald-500 text-white' : 'bg-gray-50 text-gray-400 border border-gray-100'"
                        class="w-9 h-9 rounded-xl flex items-center justify-center text-base transition duration-300">🌱</span>
                      <div>
                        <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider leading-none mb-1">Pesticide Free</h4>
                        <p class="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Organic / Certified</p>
                      </div>
                    </div>
                    <div :class="viewingProduct?.badge === 'Organic' || !!viewingProduct?.isOrganic ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-200 bg-white'"
                      class="w-4.5 h-4.5 rounded-full border flex items-center justify-center transition duration-300 bg-white">
                      <svg v-if="viewingProduct?.badge === 'Organic' || !!viewingProduct?.isOrganic" class="w-3 h-3 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>

                  
                  <div :class="viewingProduct?.isSeasonal ? 'border-amber-500 bg-amber-50/30 ring-4 ring-amber-500/5 shadow-sm' : 'border-gray-200/80 bg-white'"
                    class="flex items-center justify-between p-3.5 rounded-2xl border select-none transition duration-300">
                    <div class="flex items-center gap-3">
                      <span :class="viewingProduct?.isSeasonal ? 'bg-amber-500 text-white' : 'bg-gray-50 text-gray-400 border border-gray-100'"
                        class="w-9 h-9 rounded-xl flex items-center justify-center text-base transition duration-300">☀️</span>
                      <div>
                        <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider leading-none mb-1">Seasonal Product</h4>
                        <p class="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Limited Crop</p>
                      </div>
                    </div>
                    <div :class="viewingProduct?.isSeasonal ? 'bg-amber-500 border-amber-500 text-white' : 'border-gray-200 bg-white'"
                      class="w-4.5 h-4.5 rounded-full border flex items-center justify-center transition duration-300 bg-white">
                      <svg v-if="viewingProduct?.isSeasonal" class="w-3.5 h-3.5 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              
              <div class="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between gap-3 z-10 relative">
                
                <button @click="viewingProduct && editProduct(viewingProduct); viewingProduct = null" 
                  class="flex-1 px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition duration-300 shadow-md shadow-amber-950/10 hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2">
                  <svg class="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit Listing</span>
                </button>

                
                <button @click="viewingProduct = null" 
                  class="flex-1 px-5 py-3 bg-[#2d6a4f] text-white hover:bg-[#1b4332] text-xs font-bold uppercase tracking-widest rounded-xl shadow-md shadow-emerald-950/15 hover:shadow-lg active:scale-[0.97] transition duration-300">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    
    <Transition name="fade">
      <div v-if="editingProductId && showEditModal" class="fixed inset-0 z-55 flex items-center justify-center bg-gray-950/60 backdrop-blur-sm p-4">
        <div class="bg-white/95 backdrop-blur-md rounded-3xl max-w-2xl w-full border border-white/50 shadow-2xl relative overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
          
          
          <div class="p-2 w-full pb-0 z-10">
            <div class="group w-full h-56 md:h-64 rounded-2xl overflow-hidden relative text-white p-5 flex flex-col justify-between shadow-md bg-gradient-to-br from-[#0c2317] to-[#1c4b35]">
              <input type="file" accept="image/*" class="hidden" id="file-input-modal" @change="onFileChangeModal" />
              
              
              <div v-if="editForm.imageUrl" @click="triggerFileInputModal" class="cursor-pointer absolute inset-0 z-0 overflow-hidden p-2 bg-[#0c2317]/40">
                <img :src="getProductImage(editForm.imageUrl)" @error="editForm.imageUrl = ''" class="w-full h-full object-cover rounded-xl transition-transform duration-700 ease-out" alt="Crop Preview" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/40 z-10 rounded-xl"></div>
              </div>

              
              <div v-else @click="triggerFileInputModal" class="cursor-pointer absolute inset-0 bg-gradient-to-br from-[#0c2317] via-[#122e1f] to-[#1c4b35] z-0 p-2">
                <div class="absolute inset-2 rounded-xl bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none"></div>
              </div>

              
              <div @click="triggerFileInputModal" class="cursor-pointer absolute inset-2 rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white text-xs font-bold gap-2 z-30 select-none">
                <svg class="w-8 h-8 stroke-[2] animate-pulse text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>Click to Replace Crop Photo File</span>
                <span class="text-[9px] text-gray-300 font-bold block uppercase tracking-wider">PNG, JPG or WebP</span>
              </div>

              
              <div class="flex flex-wrap gap-2 z-20 relative">
                <span v-if="editForm.isOrganic" class="px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/40 backdrop-blur-md rounded-lg border border-emerald-500/20 shadow-2xs">
                  🌱 Organic
                </span>
                <span v-if="editForm.isSeasonal" class="px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-amber-400 bg-amber-950/40 backdrop-blur-md rounded-lg border border-amber-500/20 shadow-2xs">
                  ☀️ Seasonal
                </span>
              </div>

              
              <button type="button" @click.stop="cancelEdit" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center shadow-md border border-white/10 hover:scale-110 active:scale-95 transition-all duration-300 z-50">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

            </div>
          </div>

          
          <form @submit.prevent="updateProduct" class="w-full p-6 md:p-8 flex flex-col justify-between relative overflow-hidden bg-white rounded-b-3xl">
            
            <svg class="absolute -bottom-16 -right-16 w-52 h-52 text-amber-500/5 pointer-events-none transform rotate-45 select-none z-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 3C11.5 3 7 7.5 7 17v2h2c9.5 0 12-4.5 12-14zm-4 4.5c-.8.8-2 .8-2.8 0s-.8-2 0-2.8 2-.8 2.8 0 .8 2 0 2.8zM3 13c0 4.4 3.6 8 8 8h2c-4.4 0-10-5.6-10-10z"/>
            </svg>
            
            <div class="z-10 relative space-y-5 flex-1 flex flex-col justify-between">
              <div class="space-y-5">
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Product Name (EN)</label>
                    <input v-model="editForm.name" type="text" required placeholder="e.g. Purple Dragon Fruit"
                      class="w-full px-4 py-2.5 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 focus:bg-white transition-all duration-300" />
                  </div>
                  <div>
                    <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Category</label>
                    <div class="relative">
                      <select v-model="editForm.category" required
                        class="w-full pl-4 pr-10 py-2.5 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 focus:bg-white transition-all duration-300 appearance-none cursor-pointer">
                        <option>Fruits</option>
                        <option>Vegetables</option>
                        <option>Leafy Greens</option>
                        <option>Herbs</option>
                      </select>
                      <span class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Pricing (USD)</label>
                    <div class="relative">
                      <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-extrabold text-sm">$</span>
                      <input v-model="editForm.price" type="number" step="0.01" required placeholder="0.00"
                        class="w-full pl-8 pr-16 py-2.5 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 focus:bg-white transition-all duration-300" />
                      <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-[#2d6a4f] bg-emerald-50 border border-emerald-100/50 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider select-none">
                        / {{ editForm.unit }}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Selling Unit</label>
                    <div class="relative">
                      <select v-model="editForm.unit" required
                        class="w-full pl-4 pr-10 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 focus:bg-white transition-all duration-300 appearance-none cursor-pointer">
                        <option value="kg">kg (Kilogram)</option>
                        <option value="gram">gram (Gram)</option>
                        <option value="piece">piece (Piece)</option>
                        <option value="bunch">bunch (Bunch)</option>
                        <option value="pack">pack (Pack)</option>
                        <option value="box">box (Box)</option>
                      </select>
                      <span class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                  <div>
                    <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Stock Quantity</label>
                    <input v-model="editForm.stock" type="number" required placeholder="Enter amount"
                      class="w-full px-4 py-2.5 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 focus:bg-white transition-all duration-300" />
                  </div>
                </div>

                
                <div>
                  <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Description</label>
                  <textarea v-model="editForm.description" required
                    placeholder="Describe your produce (harvest method, freshness, variety, taste profile)..."
                    class="w-full h-24 px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 focus:bg-white transition-all duration-300 resize-none overflow-y-auto scrollbar-thin"></textarea>
                </div>

                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div @click="editForm.isOrganic = !editForm.isOrganic"
                    :class="editForm.isOrganic ? 'border-emerald-500 bg-emerald-50/30 ring-4 ring-emerald-500/5 shadow-sm' : 'border-gray-200/80 bg-white hover:border-gray-300 hover:bg-gray-50/30'"
                    class="flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer select-none transition duration-300">
                    <div class="flex items-center gap-3">
                      <span :class="editForm.isOrganic ? 'bg-emerald-500 text-white shadow-sm' : 'bg-gray-50 text-gray-400 border border-gray-100'"
                        class="w-9 h-9 rounded-xl flex items-center justify-center text-base transition duration-300">🌱</span>
                      <div>
                        <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider leading-none mb-1">Pesticide Free</h4>
                        <p class="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Organic / Certified</p>
                      </div>
                    </div>
                    <div :class="editForm.isOrganic ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-200 bg-white'"
                      class="w-4.5 h-4.5 rounded-full border flex items-center justify-center transition duration-300 bg-white">
                      <svg v-if="editForm.isOrganic" class="w-3 h-3 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>

                  
                  <div @click="editForm.isSeasonal = !editForm.isSeasonal"
                    :class="editForm.isSeasonal ? 'border-amber-500 bg-amber-50/30 ring-4 ring-amber-500/5 shadow-sm' : 'border-gray-200/80 bg-white hover:border-gray-300 hover:bg-gray-50/30'"
                    class="flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer select-none transition duration-300">
                    <div class="flex items-center gap-3">
                      <span :class="editForm.isSeasonal ? 'bg-amber-500 text-white shadow-sm' : 'bg-gray-50 text-gray-400 border border-gray-100'"
                        class="w-9 h-9 rounded-xl flex items-center justify-center text-base transition duration-300">☀️</span>
                      <div>
                        <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider leading-none mb-1">Seasonal Product</h4>
                        <p class="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Limited Crop</p>
                      </div>
                    </div>
                    <div :class="editForm.isSeasonal ? 'bg-amber-500 border-amber-500 text-white' : 'border-gray-200 bg-white'"
                      class="w-4.5 h-4.5 rounded-full border flex items-center justify-center transition duration-300 bg-white">
                      <svg v-if="editForm.isSeasonal" class="w-3.5 h-3.5 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              
              <div class="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between gap-3 z-10 relative">
                
                <button type="button" @click="cancelEdit"
                  class="flex-1 px-5 py-3 text-xs font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-50 border border-gray-200 rounded-xl transition duration-300">
                  Cancel
                </button>

                
                <button type="submit" :disabled="publishing"
                  class="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-[#1b4332] hover:from-emerald-700 hover:to-[#0f2a1f] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition duration-300 shadow-md flex items-center justify-center gap-2">
                  <span v-if="publishing" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>{{ publishing ? 'Saving...' : 'Save Changes' }}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAuth } from '../../composables/useAuth'
import { getAccessToken } from '../../services/auth.service'
import { useAuthStore } from '../../stores/auth.store'

definePageMeta({
  middleware: 'farmer',
  layout: 'farmer'
})

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

const { user, ensureHydrated } = useAuth()
const authStore = useAuthStore()

const products = ref<any[]>([])
const pendingData = ref(true)
const publishing = ref(false)

const editingProductId = ref<string | null>(null)
const viewingProduct = ref<any | null>(null)
const showEditModal = ref(false)

const toast = ref<{ message: string; type: 'success' | 'error' } | null>(null)
let toastTimer: ReturnType<typeof setTimeout> | null = null

function showToast(message: string, type: 'success' | 'error' = 'success') {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { message, type }
  toastTimer = setTimeout(() => (toast.value = null), 3000)
}

const confirmDelete = ref<{ show: boolean; productId: string | null; productName: string }>({
  show: false,
  productId: null,
  productName: ''
})

function promptDelete(product: any) {
  confirmDelete.value = { show: true, productId: product.id, productName: product.name }
}

const addForm = ref({
  name: '',
  category: 'Fruits',
  description: '',
  price: '',
  unit: 'kg',
  stock: '',
  isOrganic: false,
  isSeasonal: false,
  imageUrl: ''
})

const editForm = ref({
  name: '',
  category: 'Fruits',
  description: '',
  price: '',
  unit: 'kg',
  stock: '',
  isOrganic: false,
  isSeasonal: false,
  imageUrl: ''
})

const activeCount = computed(() => products.value.filter(p => p.stock > 0).length)
const lowStockCount = computed(() => products.value.filter(p => p.stock > 0 && p.stock < 10).length)
const pendingApprovalCount = computed(() => 0)

function getProductImage(url: string | null | undefined): string | undefined {
  if (!url) return undefined
  const lower = url.toLowerCase()
  if (lower.includes('random-question-but-does-anyone-have-versions-of-this-cat-v0-ya8qikz9kn0f1.webp')) {
    return '/cat.webp'
  }
  if (lower.includes('screenshot 2026-05-27 122353.png') || lower.includes('screenshot%202026-05-27%20122353.png')) {
    return '/screenshot1.png'
  }
  if (lower.includes('screenshot 2026-05-27 005643.png') || lower.includes('screenshot%202026-05-27%20005643.png')) {
    return '/screenshot2.png'
  }
  return url
}

function getCategoryEmoji(category: string | null) {
  if (!category) return '🌾'
  const lower = category.toLowerCase()
  if (lower.includes('fruit')) return '🥭'
  if (lower.includes('leafy') || lower.includes('greens') || lower.includes('choy')) return '🥬'
  if (lower.includes('veg')) return '🥕'
  if (lower.includes('herb')) return '🌿'
  return '🌾'
}

function getStockPercent(stock: any) {
  return Math.min(100, Math.round((Number(stock) || 0) / 1000 * 100))
}

function resolveCategory(p: any, localCache: Record<string, string>): string {
  if (p.category && p.category !== 'General') return p.category
  const cleanName = String(p.name || '').trim().toLowerCase()
  const cached = localCache[cleanName] || localCache[p.id]
  if (cached) return cached
  if (/fruit|mango|banana|dragon|pineapple|coconut|durian|apple|orange|grape|berry/.test(cleanName)) return 'Fruits'
  if (/herb|mint|basil|cilantro|parsley|garlic|chili|pepper|onion|ginger|lemongrass|spice/.test(cleanName)) return 'Herbs'
  if (/greens|leaf|leaves|cabbage|spinach|lettuce|choy|kale/.test(cleanName)) return 'Leafy Greens'
  if (/veg|carrot|tomato|potato|cucumber|eggplant|bean|corn|mushroom|pumpkin|radish|broccoli|cauliflower/.test(cleanName)) return 'Vegetables'
  return 'Fruits'
}

function getProductCategoryClass(category: string | null) {
  if (!category) return 'bg-emerald-50/70 text-emerald-800 border-emerald-200/30'
  const lower = category.toLowerCase()
  if (lower.includes('fruit')) return 'bg-amber-50/70 text-amber-800 border-amber-200/30'
  if (lower.includes('veg')) return 'bg-emerald-50/70 text-emerald-800 border-emerald-200/30'
  if (lower.includes('leafy') || lower.includes('green') || lower.includes('choy')) return 'bg-green-50/70 text-green-800 border-green-200/30'
  if (lower.includes('herb') || lower.includes('mint')) return 'bg-teal-50/70 text-teal-800 border-teal-200/30'
  return 'bg-emerald-50/70 text-emerald-800 border-emerald-200/30'
}

function getLocalCache(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem('farmer_crop_categories') || '{}') } catch { return {} }
}

function saveLocalCache(cache: Record<string, string>) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem('farmer_crop_categories', JSON.stringify(cache)) } catch {}
}

async function fetchProducts() {
  const farmerId = (user.value as any)?.farmerProfile?.id
  if (!farmerId) return
  try {
    pendingData.value = true
    const res = await $fetch<any[]>(`${BACKEND_URL}/products?farmerId=${farmerId}`)
    const localCache = getLocalCache()
    products.value = res.map(p => ({ ...p, category: resolveCategory(p, localCache) }))
  } catch (err) {
    console.error('Failed to fetch farmer products:', err)
    showToast('Failed to load products.', 'error')
  } finally {
    pendingData.value = false
  }
}

watch(
  () => (user.value as any)?.farmerProfile?.id,
  async (farmerId) => {
    if (farmerId) {
      await fetchProducts()
    } else {
      try {
        await ensureHydrated()
        if (!(user.value as any)?.farmerProfile?.id) {
          const token = await getAccessToken()
          if (token) {
            const freshProfile = await $fetch<any>(`${BACKEND_URL}/users/profile`, {
              headers: { Authorization: `Bearer ${token}` }
            })
            if (freshProfile?.farmerProfile?.id) {
              authStore.updateUserProfile(freshProfile)
              return
            }
          }
        }
      } catch (err) {
        console.error('Failed to sync profile on watch:', err)
      } finally {
        if (!(user.value as any)?.farmerProfile?.id) pendingData.value = false
      }
    }
  },
  { immediate: true }
)

function refreshProducts() { fetchProducts() }

function resetForm() {
  addForm.value = { name: '', category: 'Fruits', description: '', price: '', unit: 'kg', stock: '', isOrganic: false, isSeasonal: false, imageUrl: '' }
}

function viewProductDetail(product: any) { viewingProduct.value = product }

function editProduct(product: any) {
  editingProductId.value = product.id
  editForm.value = {
    name: product.name,
    category: product.category || 'Fruits',
    description: product.description || '',
    price: String(product.price),
    unit: product.unit || 'kg',
    stock: String(product.stock),
    isOrganic: product.badge === 'Organic' || !!product.isOrganic,
    isSeasonal: !!product.isSeasonal,
    imageUrl: product.image || ''
  }
  showEditModal.value = true
}

function cancelEdit() {
  editingProductId.value = null
  showEditModal.value = false
  editForm.value = { name: '', category: 'Fruits', description: '', price: '', unit: 'kg', stock: '', isOrganic: false, isSeasonal: false, imageUrl: '' }
}

function triggerFileInput() { document.getElementById('file-input')?.click() }
function triggerFileInputModal() { document.getElementById('file-input-modal')?.click() }

function compressImage(file: File, maxWidth = 400, maxHeight = 400, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width > height) { if (width > maxWidth) { height = Math.round(height * maxWidth / width); width = maxWidth } }
        else { if (height > maxHeight) { width = Math.round(width * maxHeight / height); height = maxHeight } }
        const canvas = document.createElement('canvas')
        canvas.width = width; canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) { resolve(e.target?.result as string); return }
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

async function onFileChange(event: any) {
  const file = event.target.files?.[0]
  if (!file) return
  try {
    addForm.value.imageUrl = await compressImage(file)
  } catch {
    const reader = new FileReader()
    reader.onload = (e) => { addForm.value.imageUrl = e.target?.result as string }
    reader.readAsDataURL(file)
  }
}

async function onFileChangeModal(event: any) {
  const file = event.target.files?.[0]
  if (!file) return
  try {
    const compressed = await compressImage(file)
    if (editingProductId.value) {
      editForm.value.imageUrl = compressed
    } else {
      addForm.value.imageUrl = compressed
    }
  } catch {
    const reader = new FileReader()
    reader.onload = (e) => { 
      const result = e.target?.result as string
      if (editingProductId.value) {
        editForm.value.imageUrl = result
      } else {
        addForm.value.imageUrl = result
      }
    }
    reader.readAsDataURL(file)
  }
}

async function publishProduct() {
  try {
    publishing.value = true
    const token = await getAccessToken()
    await ensureHydrated()

    // Sync farmer profile if missing
    if (!(user.value as any)?.farmerProfile?.id) {
      try {
        const freshProfile = await $fetch<any>(`${BACKEND_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (freshProfile?.farmerProfile?.id) authStore.updateUserProfile(freshProfile)
      } catch (err) {
        console.error('Failed to sync profile:', err)
      }
    }

    if (!(user.value as any)?.farmerProfile?.id) {
      showToast('Farmer profile not found. Please try again.', 'error')
      return
    }

    const payload = {
      nameEn: addForm.value.name,
      pricePerUnit: Number(addForm.value.price),
      stockQuantity: Number(addForm.value.stock),
      unit: addForm.value.unit,
      description: addForm.value.description,
      category: addForm.value.category,
      farmerId: (user.value as any).farmerProfile.id,
      isOrganic: addForm.value.isOrganic,
      isSeasonal: addForm.value.isSeasonal,
      thumbnailUrl: addForm.value.imageUrl || null,
      status: 'active'
    }

    const tempId = `temp-${Date.now()}`
    const optimisticProduct = {
      id: tempId,
      name: addForm.value.name,
      price: Number(addForm.value.price),
      stock: Number(addForm.value.stock),
      unit: addForm.value.unit,
      description: addForm.value.description,
      category: addForm.value.category,
      isOrganic: addForm.value.isOrganic,
      isSeasonal: addForm.value.isSeasonal,
      image: addForm.value.imageUrl || null,
      badge: addForm.value.isOrganic ? 'Organic' : null,
      _optimistic: true
    }

    // 1. Add to top of list immediately
    products.value.unshift(optimisticProduct)
    resetForm()

    try {
      const created = await $fetch<any>(`${BACKEND_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: payload
      })

      // 2. Replace temp item with real server response
      const tempIdx = products.value.findIndex(p => p.id === tempId)
      if (tempIdx !== -1 && created?.id) {
        products.value[tempIdx] = {
          ...optimisticProduct,
          ...created,
          category: optimisticProduct.category,
          image: optimisticProduct.image || created.image || null,
          _optimistic: false
        }
      }

      // Cache category
      const cache = getLocalCache()
      if (created?.id) cache[created.id] = optimisticProduct.category
      cache[String(payload.nameEn).trim().toLowerCase()] = payload.category
      saveLocalCache(cache)

      showToast('Product published successfully!')
    } catch (err) {
      // Rollback: remove temp item
      products.value = products.value.filter(p => p.id !== tempId)
      showToast('Failed to publish product.', 'error')
      console.error(err)
    }
  } catch (err) {
    console.error('Unexpected error in publishProduct:', err)
    showToast('Something went wrong. Please try again.', 'error')
  } finally {
    publishing.value = false
  }
}

async function updateProduct() {
  if (!editingProductId.value) return
  
  try {
    publishing.value = true
    const token = await getAccessToken()
    await ensureHydrated()

    const targetId = editingProductId.value

    const payload = {
      nameEn: editForm.value.name,
      pricePerUnit: Number(editForm.value.price),
      stockQuantity: Number(editForm.value.stock),
      unit: editForm.value.unit,
      description: editForm.value.description,
      category: editForm.value.category,
      farmerId: (user.value as any).farmerProfile.id,
      isOrganic: editForm.value.isOrganic,
      isSeasonal: editForm.value.isSeasonal,
      thumbnailUrl: editForm.value.imageUrl || null,
      status: 'active'
    }

    // 1. Optimistically patch in the list immediately
    const idx = products.value.findIndex(p => p.id === targetId)
    const previous = idx !== -1 ? { ...products.value[idx] } : null
    if (idx !== -1) {
      products.value[idx] = {
        ...products.value[idx],
        name: editForm.value.name,
        price: Number(editForm.value.price),
        stock: Number(editForm.value.stock),
        unit: editForm.value.unit,
        description: editForm.value.description,
        category: editForm.value.category,
        isOrganic: editForm.value.isOrganic,
        isSeasonal: editForm.value.isSeasonal,
        image: editForm.value.imageUrl || products.value[idx].image,
        badge: editForm.value.isOrganic ? 'Organic' : null,
        _optimistic: true
      }
    }

    cancelEdit()

    try {
      await $fetch(`${BACKEND_URL}/products/${targetId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: payload
      })

      // Remove optimistic flag after API succeeds
      const i = products.value.findIndex(p => p.id === targetId)
      if (i !== -1) delete products.value[i]._optimistic

      // Cache category
      const cache = getLocalCache()
      cache[targetId] = editForm.value.category || payload.category
      cache[String(payload.nameEn).trim().toLowerCase()] = payload.category
      saveLocalCache(cache)

      showToast('Product updated successfully!')
    } catch (err) {
      // Rollback on failure
      if (previous && idx !== -1) products.value[idx] = previous
      showToast('Failed to update product.', 'error')
      console.error(err)
    }
  } catch (err) {
    console.error('Unexpected error in updateProduct:', err)
    showToast('Something went wrong. Please try again.', 'error')
  } finally {
    publishing.value = false
  }
}

async function executeDelete() {
  const productId = confirmDelete.value.productId
  if (!productId) return
  confirmDelete.value.show = false

  const removed = products.value.find(p => p.id === productId)
  products.value = products.value.filter(p => p.id !== productId)

  try {
    const token = await getAccessToken()
    await $fetch(`${BACKEND_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    showToast('Listing removed successfully.')
  } catch (err) {
    // Rollback
    if (removed) products.value.push(removed)
    showToast('Failed to delete listing.', 'error')
    console.error(err)
  } finally {
    confirmDelete.value.productId = null
  }
}

function triggerCsvFileInput() {
  document.getElementById('csv-file-input')?.click()
}

function parseCSV(text: string): string[][] {
  const result: string[][] = []
  let row: string[] = []
  let currentVal = ''
  let insideQuote = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const nextChar = text[i + 1]

    if (char === '"') {
      if (insideQuote && nextChar === '"') {
        currentVal += '"'
        i++
      } else {
        insideQuote = !insideQuote
      }
    } else if (char === ',' && !insideQuote) {
      row.push(currentVal.trim())
      currentVal = ''
    } else if ((char === '\n' || char === '\r') && !insideQuote) {
      if (char === '\r' && nextChar === '\n') {
        i++
      }
      row.push(currentVal.trim())
      if (row.length > 0 && !(row.length === 1 && row[0] === '')) {
        result.push(row)
      }
      row = []
      currentVal = ''
    } else {
      currentVal += char
    }
  }
  if (currentVal || row.length > 0) {
    row.push(currentVal.trim())
    if (row.length > 0 && !(row.length === 1 && row[0] === '')) {
      result.push(row)
    }
  }
  return result
}

async function onCsvFileChange(event: any) {
  const file = event.target.files?.[0]
  if (!file) return

  event.target.value = ''

  try {
    pendingData.value = true
    const reader = new FileReader()
    reader.onload = async (e) => {
      const text = e.target?.result as string
      const parsed = parseCSV(text)
      const firstRow = parsed[0]
      if (parsed.length <= 1 || !firstRow) {
        showToast('CSV is empty or missing content.', 'error')
        pendingData.value = false
        return
      }

      const headers = firstRow.map(h => h.toLowerCase().trim())
      const rows = parsed.slice(1)

      const nameIdx = headers.findIndex(h => h.includes('name'))
      const priceIdx = headers.findIndex(h => h.includes('price') || h.includes('pricing'))
      const stockIdx = headers.findIndex(h => h.includes('stock') || h.includes('quantity'))
      const categoryIdx = headers.findIndex(h => h.includes('category'))
      const unitIdx = headers.findIndex(h => h.includes('unit'))
      const descIdx = headers.findIndex(h => h.includes('description') || h.includes('desc'))
      const organicIdx = headers.findIndex(h => h.includes('organic') || h.includes('pesticide'))
      const seasonalIdx = headers.findIndex(h => h.includes('seasonal'))
      const imageIdx = headers.findIndex(h => h.includes('image') || h.includes('thumbnail') || h.includes('photo'))

      if (nameIdx === -1 || priceIdx === -1 || stockIdx === -1) {
        showToast('CSV must include "Name", "Price", and "Stock" columns.', 'error')
        pendingData.value = false
        return
      }

      showToast(`Parsing CSV. Found ${rows.length} products to import.`, 'success')

      const token = await getAccessToken()
      await ensureHydrated()
      const farmerId = (user.value as any)?.farmerProfile?.id
      if (!farmerId) {
        showToast('Farmer profile not found. Please log in again.', 'error')
        pendingData.value = false
        return
      }

      let successCount = 0
      let failCount = 0

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        if (!row || row.length < 3 || !(row[nameIdx] ?? '')) continue

        const nameVal = row[nameIdx] ?? ''
        const priceVal = Number(row[priceIdx] ?? 0) || 0
        const stockVal = Number(row[stockIdx] ?? 0) || 0
        const categoryVal = categoryIdx !== -1 ? (row[categoryIdx] ?? 'Fruits') : 'Fruits'
        const unitVal = unitIdx !== -1 ? (row[unitIdx] ?? 'kg') : 'kg'
        const descVal = descIdx !== -1 ? (row[descIdx] ?? 'Fresh local Cambodian crop.') : 'Fresh local Cambodian crop.'
        const organicVal = organicIdx !== -1 ? (((row[organicIdx] ?? '').toLowerCase() === 'true') || (row[organicIdx] ?? '') === '1') : false
        const seasonalVal = seasonalIdx !== -1 ? (((row[seasonalIdx] ?? '').toLowerCase() === 'true') || (row[seasonalIdx] ?? '') === '1') : false
        const imageVal = imageIdx !== -1 ? (row[imageIdx] ?? '') : null

        const payload = {
          nameEn: nameVal,
          pricePerUnit: priceVal,
          stockQuantity: stockVal,
          unit: unitVal,
          description: descVal,
          category: categoryVal,
          farmerId: farmerId,
          isOrganic: organicVal,
          isSeasonal: seasonalVal,
          thumbnailUrl: imageVal || null,
          status: 'active'
        }

        try {
          await $fetch(`${BACKEND_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: payload
          })
          successCount++
        } catch (err) {
          console.error(`Failed to upload product "${nameVal}":`, err)
          failCount++
        }
      }

      await fetchProducts()

      if (failCount === 0) {
        showToast(`Bulk Upload Successful! Added ${successCount} products.`, 'success')
      } else {
        showToast(`Imported ${successCount} products. Failed on ${failCount} products.`, 'error')
      }
    }
    reader.onerror = () => {
      showToast('Failed to read the CSV file.', 'error')
      pendingData.value = false
    }
    reader.readAsText(file)
  } catch (err) {
    console.error('Error during CSV import:', err)
    showToast('An unexpected error occurred during CSV import.', 'error')
    pendingData.value = false
  }
}
</script>

<style scoped>
header { position: sticky; top: 0; z-index: 30; }

.toast-enter-active, .toast-leave-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-enter-from { opacity: 0; transform: translateY(12px) scale(0.95); }
.toast-leave-to { opacity: 0; transform: translateY(8px) scale(0.95); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
