<template>
  <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Sign in to your account
  </h1>
  
  <div v-if="generalError" class="p-4 mb-4 text-sm text-red-600 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-200">
    {{ generalError }}
  </div>

  <form class="space-y-4 md:space-y-6" @submit.prevent="handleSubmit" novalidate>
                  <div>
                      <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                      <input v-model="form.email" type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="">
                      <span v-if="errors.email" class="text-sm text-red-600 dark:text-red-400">{{ errors.email }}</span>
                  </div>
                  <div>
                      <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input v-model="form.password" type="password" name="password" id="password" placeholder="Nhập mật khẩu" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="">
                      <span v-if="errors.password" class="text-sm text-red-600 dark:text-red-400">{{ errors.password }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                      <div class="flex items-start">
                          <div class="flex items-center h-5">
                            <input id="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="">
                          </div>
                          <div class="ml-3 text-sm">
                            <label for="remember" class="text-gray-500 dark:text-gray-300">Remember me</label>
                          </div>
                      </div>
                      <a href="#" class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                  </div>
                  <button type="submit" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                  <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                      Don’t have an account yet? <router-link :to="{name : 'register'}" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</router-link>
                  </p>
  </form>
</template>       
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from '../bootstrap'

const router = useRouter()

const form = ref({
  email: '',
  password: '',
  remember: false,
})

const errors = ref({
  email: '',
  password: '',
})

const generalError = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  loading.value = true
  generalError.value = ''
  errors.value = { email: '', password: '' }

  try {
    const { data } = await axios.post('/api/login', {
      email: form.value.email,
      password: form.value.password,
    })

    // Lấy token từ response
    const token = data.access_token

    if (!token) {
      throw new Error('No token returned from API')
    }

    // Lưu token + user
    localStorage.setItem('token', token)
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user))
    }

    // Cập nhật axios header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

    // Chuyển sang trang home
    router.push({ name: 'home' })
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response

      if (status === 422 && data.errors) {
        const valErrors = data.errors
        if (valErrors.email) errors.value.email = valErrors.email[0]
        if (valErrors.password) errors.value.password = valErrors.password[0]
      } else if (status === 401) {
        generalError.value = data.message || 'Invalid email or password.'
      } else {
        generalError.value = data.message || 'Something went wrong. Please try again.'
      }
    } else {
      generalError.value = 'Network error. Please check your connection.'
    }
  } finally {
    loading.value = false
  }
}
</script>
