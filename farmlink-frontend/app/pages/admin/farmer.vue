<template>
    <div class="p-10 bg-[#f7fdf4]">
        <AdminProfileDropdown title="Farmer Management"/>
        <div class="flex flex-col mb-6 md:flex-row md:items-center justify-end gap-4">
            <div class="flex items-center gap-2">
                <button
                    @click="addFarmerModal.visible = true"
                    class="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
                >
                    <UserPlus class="w-4 h-4" /> Add Farmer
                </button>
            </div>
        </div>

        <!-- SKELETON — matches Image 2 exactly -->
        <div v-if="loading">
            <!-- 4 stat cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div v-for="i in 4" :key="i"
                    class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center justify-between">
                    <div class="space-y-2.5">
                        <div class="h-2.5 w-28 bg-gray-200 rounded-full animate-pulse"/>
                        <div class="h-6 w-10 bg-gray-200 rounded-full animate-pulse"/>
                        <div class="h-2 w-32 bg-gray-100 rounded-full animate-pulse"/>
                    </div>
                    <div class="w-12 h-12 rounded-2xl bg-gray-200 animate-pulse flex-shrink-0"/>
                </div>
            </div>

            <!-- Table card -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <!-- Search + filter toolbar -->
                <div class="flex items-center gap-3 p-4 border-b border-gray-100">
                    <div class="h-9 flex-1 bg-gray-100 rounded-xl animate-pulse"/>
                    <div class="h-9 w-36 bg-gray-100 rounded-xl animate-pulse"/>
                    <div class="h-9 w-36 bg-gray-100 rounded-xl animate-pulse"/>
                    <div class="h-9 w-28 bg-gray-100 rounded-xl animate-pulse"/>
                </div>

                <!-- Column header row -->
                <div class="flex items-center gap-4 px-5 py-3 border-b border-gray-100">
                    <div class="w-9 flex-shrink-0"/>
                    <div class="flex-1"><div class="h-2.5 w-12 bg-gray-200 rounded-full animate-pulse"/></div>
                    <div class="hidden sm:block w-32"><div class="h-2.5 w-16 bg-gray-200 rounded-full animate-pulse"/></div>
                    <div class="hidden md:block w-24"><div class="h-2.5 w-14 bg-gray-200 rounded-full animate-pulse"/></div>
                    <div class="hidden lg:block w-20"><div class="h-2.5 w-12 bg-gray-200 rounded-full animate-pulse"/></div>
                    <div class="hidden lg:block w-20"><div class="h-2.5 w-14 bg-gray-200 rounded-full animate-pulse"/></div>
                    <div class="hidden lg:block w-20"><div class="h-2.5 w-10 bg-gray-200 rounded-full animate-pulse"/></div>
                    <div class="w-16"><div class="h-2.5 w-10 bg-gray-200 rounded-full animate-pulse"/></div>
                </div>

                <!-- Data rows — avatar circle + two text lines + right-side pills + action buttons -->
                <div
                    v-for="i in 7" :key="i"
                    class="flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0"
                    :style="{ opacity: 1 - (i - 1) * 0.08 }"
                >
                    <!-- Avatar -->
                    <div class="w-9 h-9 rounded-full bg-gray-200 animate-pulse flex-shrink-0"/>

                    <!-- Name + sub -->
                    <div class="flex-1 space-y-1.5">
                        <div class="h-3 bg-gray-200 rounded-full animate-pulse"
                            :style="{ width: ['80px','100px','72px','90px','64px','88px','76px'][i-1] }"/>
                        <div class="h-2.5 bg-gray-100 rounded-full animate-pulse"
                            :style="{ width: ['60px','72px','56px','68px','52px','64px','58px'][i-1] }"/>
                    </div>

                    <!-- Status pill -->
                    <div class="hidden sm:block w-32">
                        <div class="h-5 w-16 bg-gray-100 rounded-full animate-pulse"/>
                    </div>

                    <!-- Match pill -->
                    <div class="hidden md:block w-24">
                        <div class="h-5 w-20 bg-gray-100 rounded-full animate-pulse"/>
                    </div>

                    <!-- Trust score -->
                    <div class="hidden lg:block w-20">
                        <div class="h-3 w-8 bg-gray-100 rounded-full animate-pulse"/>
                    </div>

                    <!-- Yield -->
                    <div class="hidden lg:block w-20">
                        <div class="h-3 w-12 bg-gray-100 rounded-full animate-pulse"/>
                    </div>

                    <!-- Crop tag -->
                    <div class="hidden lg:block w-20">
                        <div class="h-5 w-14 bg-gray-100 rounded-full animate-pulse"/>
                    </div>

                    <!-- Action buttons -->
                    <div class="flex items-center gap-1.5">
                        <div class="w-8 h-8 rounded-lg bg-gray-100 animate-pulse"/>
                        <div class="w-8 h-8 rounded-lg bg-gray-100 animate-pulse"/>
                    </div>
                </div>
            </div>
        </div>

        <!-- ERROR -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-600 mb-6">
            <p class="font-semibold">Failed to load farmers</p>
            <p class="text-sm mt-1">{{ error }}</p>
            <button @click="fetchFarmers" class="mt-3 text-sm underline">Try again</button>
        </div>

        <!-- LOADED -->
        <template v-else>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs text-gray-500 font-medium mb-1">Total Farmers</p>
                            <p class="text-2xl font-bold text-gray-900">{{ allFarmers.length }}</p>
                        </div>
                        <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                            <Users class="w-6 h-6 text-green-600"/>
                        </div>
                    </div>
                    <p class="text-xs text-gray-400 mt-2">Registered on platform</p>
                </div>

                <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs text-gray-500 font-medium mb-1">Seeking Match</p>
                            <p class="text-2xl font-bold text-gray-900">{{ countByMatch('Seeking') }}</p>
                        </div>
                        <div class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <Search class="w-6 h-6 text-amber-600"/>
                        </div>
                    </div>
                    <p class="text-xs text-gray-400 mt-2">Looking for buyers</p>
                </div>

                <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs text-gray-500 font-medium mb-1">Successful Matches</p>
                            <p class="text-2xl font-bold text-gray-900">{{ countByMatch('Matched') }}</p>
                        </div>
                        <div class="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                            <Link2 class="w-6 h-6 text-indigo-600"/>
                        </div>
                    </div>
                    <p class="text-xs text-gray-400 mt-2">Active partnerships</p>
                </div>

                <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs text-gray-500 font-medium mb-1">Avg Trust Score</p>
                            <p class="text-2xl font-bold text-gray-900">{{ avgTrustScore }}/100</p>
                        </div>
                        <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                            <TrendingUp class="w-6 h-6 text-purple-600"/>
                        </div>
                    </div>
                    <p class="text-xs text-gray-400 mt-2">Community average</p>
                </div>
            </div>

            <AdminFarmerTable
                :farmers="filteredFarmers"
                :search-query="searchQuery"
                :filter-status="filterStatus"
                :filter-match="filterMatch"
                :sort-by="sortBy"
                :status-class="statusClass"
                :trust-score-color="trustScoreColor"
                :role-avatar-class="roleAvatarClass"
                :initials="initials"
                @update:search-query="searchQuery = $event"
                @update:filter-status="filterStatus = $event"
                @update:filter-match="filterMatch = $event"
                @update:sort-by="sortBy = $event"
                @reset-filters="resetFilters"
                @open-farmer="openFarmerModal"
                @match-farmer="openMatchModal"
                @suspend-farmer="(farmer) => { suspendModal.farmer = farmer; suspendModal.visible = true; suspendModal.action = 'Suspended'; }"
            />
        </template>

        <!-- MATCH MODAL -->
        <Transition enter-active-class="transition-all duration-200 ease-out" enter-from-class="opacity-0"
            leave-active-class="transition-all duration-150 ease-in" leave-to-class="opacity-0">
            <div v-if="matchModal.visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
                @click.self="matchModal.visible = false">
                <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">
                    <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                                <ArrowRightLeft class="w-5 h-5 text-indigo-600"/>
                            </div>
                            <div>
                                <p class="text-base font-bold text-gray-900">Match Farmer</p>
                                <p class="text-sm text-gray-500">{{ matchModal.farmer?.name }} ({{ matchModal.farmer?.mainCrop }})</p>
                            </div>
                        </div>
                        <button @click="matchModal.visible = false" class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
                            <X class="w-5 h-5"/>
                        </button>
                    </div>
                    <div class="p-6 space-y-5 overflow-y-auto">
                        <div class="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex gap-3">
                            <Info class="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                            <div class="text-sm text-indigo-900">
                                <p class="font-semibold mb-1">Find a Buyer</p>
                                <p class="text-indigo-700 opacity-90">Search and select a verified buyer or business that needs {{ matchModal.farmer?.mainCrop }}</p>
                            </div>
                        </div>

                        <div>
                            <label class="text-sm font-semibold text-gray-700 block mb-2">Search Buyers</label>
                            <div class="relative">
                                <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input v-model="matchModal.searchQuery" type="text" placeholder="Name or business..."
                                    class="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition" />
                            </div>
                        </div>

                        <div class="space-y-3">
                            <label class="text-sm font-semibold text-gray-700 block">Available Buyers</label>

                            <!-- Buyers skeleton -->
                            <div v-if="buyersLoading" class="space-y-2">
                                <div v-for="i in 4" :key="i" class="flex items-center gap-3 p-3 rounded-xl border border-gray-100">
                                    <div class="w-8 h-8 rounded-full bg-gray-200 animate-pulse flex-shrink-0"/>
                                    <div class="flex-1 space-y-1.5">
                                        <div class="h-3 bg-gray-200 rounded-full animate-pulse w-32"/>
                                        <div class="h-2.5 bg-gray-100 rounded-full animate-pulse w-24"/>
                                    </div>
                                </div>
                            </div>

                            <div v-else-if="filteredBuyers.length === 0" class="text-center py-6 text-sm text-gray-500 border border-dashed border-gray-200 rounded-xl">
                                No buyers found matching "{{ matchModal.searchQuery }}"
                            </div>
                            <div v-else class="space-y-2 max-h-60 overflow-y-auto pr-2">
                                <button v-for="buyer in filteredBuyers" :key="buyer.id"
                                    @click="matchModal.selectedBuyer = buyer"
                                    :class="['w-full text-left p-3 rounded-xl border transition flex items-center justify-between',
                                        matchModal.selectedBuyer?.id === buyer.id ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 hover:border-gray-300']">
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                                            {{ initials(buyer.name) }}
                                        </div>
                                        <div>
                                            <p class="text-sm font-semibold text-gray-900">{{ buyer.name }}</p>
                                            <p class="text-xs text-gray-500">{{ buyer.type }} · Trust: {{ buyer.trustScore }}</p>
                                        </div>
                                    </div>
                                    <CheckCircle2 v-if="matchModal.selectedBuyer?.id === buyer.id" class="w-5 h-5 text-indigo-600" />
                                </button>
                            </div>
                        </div>

                        <div v-if="matchModal.selectedBuyer" class="pt-2">
                            <label class="text-sm font-semibold text-gray-700 block mb-2">Match Notes (Optional)</label>
                            <textarea v-model="matchModal.notes" rows="2" placeholder="e.g. Contract for 5 tons per month..."
                                class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition resize-none"></textarea>
                        </div>
                    </div>
                    <div class="p-6 border-t border-gray-100 flex gap-3 mt-auto">
                        <button @click="matchModal.visible = false"
                            class="flex-1 text-sm font-medium px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Cancel</button>
                        <button @click="executeMatch" :disabled="!matchModal.selectedBuyer || matchLoading"
                            class="flex-1 text-sm font-medium px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            <span v-if="matchLoading" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                            <Link2 v-else class="w-4 h-4"/> Confirm Match
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- FARMER DETAIL -->
        <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 translate-x-full"
            leave-active-class="transition-all duration-200 ease-in" leave-to-class="opacity-0 translate-x-full">
            <div v-if="farmerModal.visible" class="fixed inset-0 z-40 bg-gray-50 overflow-y-auto">
                <div v-if="farmerModal.farmer" class="min-h-screen pb-12">
                    <div class="bg-gradient-to-r from-green-600 to-green-800 text-white shadow-md">
                        <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                            <button @click="farmerModal.visible = false"
                                class="flex items-center gap-2 text-green-100 hover:text-white font-medium mb-6 text-sm transition-colors w-fit">
                                <ArrowLeft class="w-4 h-4"/> Back to Farmers
                            </button>
                            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div class="flex items-center gap-5">
                                    <div class="w-24 h-24 rounded-full bg-white text-green-700 flex items-center justify-center text-3xl font-bold shadow-lg border-4 border-green-500/30">
                                        {{ initials(farmerModal.farmer.name) }}
                                    </div>
                                    <div>
                                        <h1 class="text-2xl sm:text-3xl font-bold">{{ farmerModal.farmer.name }}</h1>
                                        <p class="text-green-100 mt-1 flex items-center gap-2">
                                            <MapPin class="w-4 h-4"/> {{ farmerModal.farmer.location }}
                                        </p>
                                        <div class="flex flex-wrap items-center gap-2 mt-3">
                                            <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-sm">{{ farmerModal.farmer.status }}</span>
                                            <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-sm flex items-center gap-1">
                                                <Leaf class="w-3 h-3"/> {{ farmerModal.farmer.mainCrop }}
                                            </span>
                                            <span v-if="farmerModal.farmer.matchStatus === 'Matched'" class="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/30 text-white border border-indigo-300/30 backdrop-blur-sm flex items-center gap-1">
                                                <Link2 class="w-3 h-3"/> Matched
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4">
                                    <div class="text-center">
                                        <p class="text-xs text-green-100 uppercase tracking-wider font-semibold mb-1">Trust Score</p>
                                        <p class="text-3xl font-bold">{{ farmerModal.farmer.trustScore }}</p>
                                    </div>
                                    <div class="w-px h-12 bg-white/20"></div>
                                    <div class="text-center">
                                        <p class="text-xs text-green-100 uppercase tracking-wider font-semibold mb-1">Total Yield</p>
                                        <p class="text-3xl font-bold">{{ farmerModal.farmer.estYield }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="max-w-6xl mx-auto px-4 sm:px-6 mt-8 space-y-6">
                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div class="lg:col-span-2 space-y-6">
                                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                                    <h2 class="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                                        <User class="w-5 h-5 text-gray-400"/> Personal & Farm Details
                                    </h2>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
                                        <div>
                                            <p class="text-xs font-semibold text-gray-500 mb-1">Phone Number</p>
                                            <p class="text-sm font-medium text-gray-900">{{ farmerModal.farmer.phone }}</p>
                                        </div>
                                        <div>
                                            <p class="text-xs font-semibold text-gray-500 mb-1">Farm Size</p>
                                            <p class="text-sm font-medium text-gray-900">{{ farmerModal.farmer.farmSize }} Hectares</p>
                                        </div>
                                        <div>
                                            <p class="text-xs font-semibold text-gray-500 mb-1">Farming Method</p>
                                            <p class="text-sm font-medium text-gray-900">{{ farmerModal.farmer.method }}</p>
                                        </div>
                                        <div>
                                            <p class="text-xs font-semibold text-gray-500 mb-1">Joined Date</p>
                                            <p class="text-sm font-medium text-gray-900">{{ farmerModal.farmer.joinedAt }}</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                                    <div class="flex items-center justify-between mb-5">
                                        <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                                            <Sprout class="w-5 h-5 text-gray-400"/> Current Production
                                        </h2>
                                    </div>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div v-for="(crop, idx) in farmerModal.farmer.crops" :key="idx"
                                            class="p-4 border border-gray-100 rounded-xl bg-gray-50 flex items-start justify-between">
                                            <div>
                                                <p class="font-semibold text-gray-900">{{ crop.name }}</p>
                                                <p class="text-xs text-gray-500 mt-1">Harvest: {{ crop.harvestDate }}</p>
                                            </div>
                                            <div class="text-right">
                                                <p class="text-sm font-bold text-green-600">{{ crop.volume }}</p>
                                                <p class="text-xs text-gray-500 mt-1">{{ crop.price }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-6">
                                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                                    <h2 class="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                                        <Link2 class="w-5 h-5 text-gray-400"/> Matching Status
                                    </h2>
                                    <div v-if="farmerModal.farmer.matchStatus === 'Matched'" class="space-y-4">
                                        <div class="bg-green-50 border border-green-100 p-4 rounded-xl flex items-start gap-3">
                                            <CheckCircle2 class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p class="text-sm font-semibold text-green-900 mb-1">Currently Matched</p>
                                                <p class="text-xs text-green-700">Matched with {{ farmerModal.farmer.matchedBuyer }}</p>
                                            </div>
                                        </div>
                                        <button @click="openMatchModal(farmerModal.farmer)" class="w-full py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                                            Rematch or Update
                                        </button>
                                    </div>
                                    <div v-else class="space-y-4">
                                        <div class="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3">
                                            <Search class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p class="text-sm font-semibold text-amber-900 mb-1">Seeking Match</p>
                                                <p class="text-xs text-amber-700">Looking for buyers for {{ farmerModal.farmer.mainCrop }}</p>
                                            </div>
                                        </div>
                                        <button @click="openMatchModal(farmerModal.farmer)" class="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                                            <ArrowRightLeft class="w-4 h-4"/> Find a Buyer
                                        </button>
                                    </div>
                                </div>

                                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                                    <h2 class="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                                        <ShieldAlert class="w-5 h-5 text-gray-400"/> Actions
                                    </h2>
                                    <button @click="() => { suspendModal.farmer = farmerModal.farmer; suspendModal.visible = true; suspendModal.action = 'Suspended'; farmerModal.visible = false }"
                                        class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 font-medium transition-colors text-sm">
                                        <ShieldOff class="w-4 h-4"/> Suspend Farmer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- SUSPEND MODAL -->
        <Transition enter-active-class="transition-all duration-200 ease-out" enter-from-class="opacity-0"
            leave-active-class="transition-all duration-150 ease-in" leave-to-class="opacity-0">
            <div v-if="suspendModal.visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
                @click.self="suspendModal.visible = false">
                <div class="bg-white rounded-2xl shadow-xl w-full max-w-md">
                    <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center">
                                <ShieldOff class="w-4 h-4 text-red-500"/>
                            </div>
                            <div>
                                <p class="text-sm font-semibold text-gray-900">Suspend Farmer</p>
                                <p class="text-xs text-gray-400">{{ suspendModal.farmer?.name }}</p>
                            </div>
                        </div>
                        <button @click="suspendModal.visible = false" class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100">
                            <X class="w-4 h-4"/>
                        </button>
                    </div>
                    <div class="p-5 space-y-4">
                        <div class="bg-red-50 p-3 rounded-xl border border-red-100 flex gap-2">
                            <AlertCircle class="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <p class="text-xs text-red-800">Suspending this farmer will hide their profile from buyers and pause any active matches.</p>
                        </div>
                        <div>
                            <label class="text-xs font-semibold text-gray-700 block mb-2">Reason</label>
                            <textarea v-model="suspendModal.reason" rows="3"
                                placeholder="Why is this farmer being suspended?"
                                class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition resize-none"></textarea>
                        </div>
                        <div class="flex gap-3">
                            <button @click="suspendModal.visible = false"
                                class="flex-1 text-sm font-medium px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Cancel</button>
                            <button @click="executeSuspend" :disabled="!suspendModal.reason || suspendLoading"
                                class="flex-1 text-sm font-medium px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                <span v-if="suspendLoading" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                                <span v-else>Confirm Suspend</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- TOAST -->
        <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 translate-y-2"
            leave-active-class="transition-all duration-200 ease-in" leave-to-class="opacity-0 translate-y-2">
            <div v-if="toast.visible"
                class="fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg text-sm font-medium text-white min-w-[260px]"
                :class="{
                    'bg-gray-900':   toast.type === 'success',
                    'bg-red-500':    toast.type === 'error',
                    'bg-amber-500':  toast.type === 'warning',
                    'bg-indigo-600': toast.type === 'info',
                }">
                <component :is="toast.type === 'success' ? CheckCheck : toast.type === 'warning' ? AlertCircle : toast.type === 'info' ? Info : X"
                    class="w-4 h-4 flex-shrink-0"/>
                {{ toast.message }}
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
    Users, X, Search, CheckCheck, MapPin, Sprout, ShieldAlert,
    AlertCircle, TrendingUp, Link2, ArrowRightLeft, ShieldOff,
    UserPlus, Info, CheckCircle2, ArrowLeft, User, Leaf
} from 'lucide-vue-next'
import AdminFarmerTable from '~/components/admin/AdminFarmerTable.vue'

definePageMeta({ layout: 'admin' })

const config  = useRuntimeConfig()
const baseURL = config.public.apiBase

const allFarmers     = ref([])
const allBuyers      = ref([])
const loading        = ref(false)
const error          = ref(null)
const buyersLoading  = ref(false)
const matchLoading   = ref(false)
const suspendLoading = ref(false)

async function fetchFarmers() {
    loading.value = true
    error.value   = null
    try {
        allFarmers.value = await $fetch(`${baseURL}/admin/farmers`)
    } catch (err) {
        error.value = err?.data?.message ?? 'Failed to load farmers'
        showToast(error.value, 'error')
    } finally {
        loading.value = false
    }
}

async function fetchBuyers() {
    buyersLoading.value = true
    try {
        allBuyers.value = await $fetch(`${baseURL}/admin/buyers`)
    } catch (err) {
        showToast('Failed to load buyers', 'error')
    } finally {
        buyersLoading.value = false
    }
}

onMounted(() => fetchFarmers())

const countByMatch  = (s) => allFarmers.value.filter(f => f.matchStatus === s).length
const avgTrustScore = computed(() =>
    Math.round(allFarmers.value.reduce((a, f) => a + f.trustScore, 0) / (allFarmers.value.length || 1))
)

const searchQuery  = ref('')
const filterStatus = ref('')
const filterMatch  = ref('')
const sortBy       = ref('name')

const filteredFarmers = computed(() => {
    let result = allFarmers.value.filter(f => {
        const q  = searchQuery.value.toLowerCase()
        const ms = f.name.toLowerCase().includes(q) || f.mainCrop.toLowerCase().includes(q)
        const mv = !filterStatus.value || f.status === filterStatus.value
        const mm = !filterMatch.value  || f.matchStatus.toLowerCase() === filterMatch.value.toLowerCase()
        return ms && mv && mm
    })
    return result.sort((a, b) => {
        switch (sortBy.value) {
            case 'name':       return a.name.localeCompare(b.name)
            case 'trust-desc': return b.trustScore - a.trustScore
            case 'trust-asc':  return a.trustScore - b.trustScore
            case 'yield-desc': return parseInt(b.estYield) - parseInt(a.estYield)
            default:           return 0
        }
    })
})

function resetFilters() {
    searchQuery.value  = ''
    filterStatus.value = ''
    filterMatch.value  = ''
    sortBy.value       = 'name'
}

const farmerModal = ref({ visible: false, farmer: null })
function openFarmerModal(farmer) {
    farmerModal.value = { visible: true, farmer }
}

const matchModal = ref({ visible: false, farmer: null, searchQuery: '', selectedBuyer: null, notes: '' })

async function openMatchModal(farmer) {
    matchModal.value = { visible: true, farmer, searchQuery: '', selectedBuyer: null, notes: '' }
    if (farmerModal.value.visible) farmerModal.value.visible = false
    await fetchBuyers()
}

const filteredBuyers = computed(() => {
    if (!matchModal.value.searchQuery) return allBuyers.value
    const q = matchModal.value.searchQuery.toLowerCase()
    return allBuyers.value.filter(b =>
        b.name.toLowerCase().includes(q) || b.type.toLowerCase().includes(q)
    )
})

async function executeMatch() {
    if (!matchModal.value.farmer || !matchModal.value.selectedBuyer) return
    matchLoading.value = true
    try {
        await $fetch(`${baseURL}/admin/farmers/${matchModal.value.farmer.id}/match`, {
            method: 'POST',
            body: { buyerId: matchModal.value.selectedBuyer.id, notes: matchModal.value.notes }
        })
        const f = allFarmers.value.find(x => x.id === matchModal.value.farmer.id)
        if (f) { f.matchStatus = 'Matched'; f.matchedBuyer = matchModal.value.selectedBuyer.name }
        showToast(`Matched ${matchModal.value.farmer.name} with ${matchModal.value.selectedBuyer.name}`, 'success')
        matchModal.value.visible = false
    } catch (err) {
        showToast(err?.data?.message ?? 'Failed to confirm match', 'error')
    } finally {
        matchLoading.value = false
    }
}

const suspendModal = ref({ visible: false, farmer: null, action: 'Suspended', reason: '' })

async function executeSuspend() {
    if (!suspendModal.value.farmer) return
    suspendLoading.value = true
    try {
        await $fetch(`${baseURL}/admin/farmers/${suspendModal.value.farmer.id}/suspend`, {
            method: 'PATCH',
            body: { reason: suspendModal.value.reason }
        })
        const f = allFarmers.value.find(x => x.id === suspendModal.value.farmer.id)
        if (f) f.status = 'Suspended'
        showToast(`${suspendModal.value.farmer.name} has been suspended`, 'warning')
        suspendModal.value.visible = false
    } catch (err) {
        showToast(err?.data?.message ?? 'Failed to suspend farmer', 'error')
    } finally {
        suspendLoading.value = false
    }
}

const addFarmerModal = ref({ visible: false })

const toast = ref({ visible: false, message: '', type: 'success' })
let toastTimer = null
function showToast(message, type = 'success') {
    if (toastTimer) clearTimeout(toastTimer)
    toast.value = { visible: true, message, type }
    toastTimer  = setTimeout(() => { toast.value.visible = false }, 3200)
}

const initials        = (name) => name.split(' ').map(n => n[0]).join('')
const roleAvatarClass = ()     => 'bg-green-100 text-green-700'
const statusClass     = (s)    => ({ Active: 'bg-green-100 text-green-700', Pending: 'bg-amber-100 text-amber-700', Suspended: 'bg-red-100 text-red-600' })[s] ?? 'bg-gray-100 text-gray-600'
const trustScoreColor = (s)    => s >= 80 ? 'text-green-600' : s >= 50 ? 'text-amber-600' : 'text-red-500'
</script>