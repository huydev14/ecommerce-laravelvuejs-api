<template>
  <header class="w-full shadow-sm bg-white dark:bg-gray-900">
    
    <!-- TOP NAV -->
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-8">

      <!-- LOGO -->
      <router-link to="/" class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex-shrink-0">
        E-Commerce
      </router-link>

      <!-- CATEGORIES DROPDOWN -->
      <div class="relative group">
        <button
          class="flex items-center text-gray-700 dark:text-gray-200 font-medium hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <Bars2Icon
            class="w-6 h-6 mr-1 text-gray-800 dark:text-gray-200 hover:text-blue-600 transition" />
          Categories
          <ChevronDownIcon class="w-4 h-4 ml-1 transition group-hover:rotate-180" />
        </button>

        <!-- MEGA DROPDOWN -->
        <div
          class="absolute left-0 top-full mt-0 w-[600px] bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 
                 grid grid-cols-3 gap-6 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                 transition duration-200 ease-in-out
                 group-hover:translate-y-0 translate-y-2">
          
          <div v-for="group in categoryGroups" :key="group.title">
            <h4 class="font-bold text-gray-900 dark:text-gray-100 mb-3">{{ group.title }}</h4>

            <router-link
              v-for="item in group.items"
              :key="item.slug"
              :to="'/category/' + item.slug"
              class="block py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:pl-1 transition">
              {{ item.name }}
            </router-link>
          </div>
        </div>
      </div>

      <!-- SEARCH BAR -->
      <div class="hidden md:flex flex-1">
        <div class="relative w-full">
          <input
            v-model="search"
            type="text"
            placeholder="Search for laptops, phones, accessories..."
            class="w-full bg-gray-100 dark:bg-gray-800 px-5 py-3 rounded-full
                   focus:ring-2 focus:ring-blue-500 outline-none
                   text-gray-800 dark:text-gray-200"
          />
          <MagnifyingGlassIcon
            class="w-6 h-6 absolute right-5 top-3 text-gray-500"
          />
        </div>
      </div>

      <!-- AUTH + CART -->
      <div class="flex items-center space-x-6">

        <!-- User dropdown -->
        <div class="relative" v-if="isLoggedIn">
          <img
            :src="userAvatar"
            @click="toggleUser"
            class="w-10 h-10 rounded-full cursor-pointer border dark:border-gray-700"
          />

          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-3 w-52 rounded-xl bg-white dark:bg-gray-800 shadow-xl overflow-hidden"
          >
            <router-link
              to="/profile"
              class="block px-5 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-200">
              My Profile
            </router-link>

            <router-link
              to="/orders"
              class="block px-5 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-200">
              Orders
            </router-link>

            <button
              @click="logout"
              class="block w-full text-left px-5 py-3 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">
              Logout
            </button>
          </div>
        </div>

        <!-- Login / Register -->
        <template v-else>
          <router-link to="/login" class="text-gray-900 dark:text-gray-200 font-medium hover:text-blue-600">
            Login
          </router-link>

          <router-link
            to="/register"
            class="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
            Register
          </router-link>
        </template>

        <!-- Cart Icon -->
        <router-link to="/cart" class="relative">
          <ShoppingCartIcon
            class="w-8 h-8 text-gray-800 dark:text-gray-200 hover:text-blue-600 transition" />
          <span
            v-if="cartCount > 0"
            class="absolute -top-1 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
            {{ cartCount }}
          </span>
        </router-link>

      </div>
    </div>
  </header>

  <!-- FLOATING CART ICON -->
  <router-link
    to="/cart"
    class="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-2xl
           hover:bg-blue-700 transition backdrop-blur-xl bg-opacity-80">
    <ShoppingCartIcon class="w-7 h-7" />

    <span v-if="cartCount > 0"
      class="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
      {{ cartCount }}
    </span>
  </router-link>
</template>

<script setup>
import { ref } from 'vue'
import {
  Bars2Icon,
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'

const search = ref("")
const isLoggedIn = ref(true)
const userAvatar = ref("https://i.pravatar.cc/50?u=tech")

const cartCount = ref(3)

const showUserMenu = ref(false)
const showCat = ref(false)

const toggleUser = () => showUserMenu.value = !showUserMenu.value

const logout = () => {
  localStorage.removeItem("token")
  isLoggedIn.value = false
  showUserMenu.value = false
}

// Mega menu category groups
const categoryGroups = ref([
  {
    title: "Laptops",
    items: [
      { name: "Gaming", slug: "laptop-gaming" },
      { name: "Ultrabook", slug: "ultrabook" },
      { name: "Business", slug: "business-laptop" }
    ]
  },
  {
    title: "Phones",
    items: [
      { name: "iPhone", slug: "iphone" },
      { name: "Samsung", slug: "samsung" },
      { name: "Xiaomi", slug: "xiaomi" }
    ]
  },
  {
    title: "Accessories",
    items: [
      { name: "Keyboards", slug: "keyboard" },
      { name: "Headsets", slug: "headset" },
      { name: "Monitors", slug: "monitor" }
    ]
  }
])
</script>
