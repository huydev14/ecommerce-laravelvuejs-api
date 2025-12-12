<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <NavBar />

    <main class="pt-4">
        <router-view />
    </main>

    <!-- <Footer /> -->
  </div>
</template>

<script setup>
import NavBar from '@/Pages/includes/NavBar.vue';
// import Footer from '@/components/Footer.vue'
</script>