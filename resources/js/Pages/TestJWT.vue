<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Test JWT Token</h1>
    
    <div class="space-y-4">
      <div>
        <button @click="checkToken" class="bg-blue-500 text-white px-4 py-2 rounded">
          Check Token in localStorage
        </button>
        <p v-if="tokenInfo" class="mt-2">{{ tokenInfo }}</p>
      </div>

      <div>
        <button @click="testAPI" class="bg-green-500 text-white px-4 py-2 rounded">
          Test API Call
        </button>
        <pre v-if="apiResult" class="mt-2 p-2 bg-gray-100">{{ apiResult }}</pre>
      </div>

      <div>
        <button @click="checkAxios" class="bg-purple-500 text-white px-4 py-2 rounded">
          Check window.axios
        </button>
        <p v-if="axiosInfo" class="mt-2">{{ axiosInfo }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from '../bootstrap'

const tokenInfo = ref('')
const apiResult = ref('')
const axiosInfo = ref('')

const checkToken = () => {
  const token = localStorage.getItem('token')
  tokenInfo.value = token ? `Token exists: ${token.substring(0, 30)}...` : 'No token found'
}

const testAPI = async () => {
  try {
    const response = await axios.get('/api/products')
    console.log('Request config:', response.config.headers)
    apiResult.value = JSON.stringify({
      message: 'API call successful!',
      headers: response.config.headers,
      data: response.data
    }, null, 2)
  } catch (error) {
    apiResult.value = `Error: ${error.message}\n${JSON.stringify(error.response?.data, null, 2)}`
  }
}

const checkAxios = () => {
  axiosInfo.value = typeof window.axios !== 'undefined' 
    ? 'window.axios is defined' 
    : 'window.axios is undefined'
}
</script>
