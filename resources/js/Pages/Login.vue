<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white rounded-lg shadow p-6">
      <h1 class="text-2xl font-semibold text-center mb-6">Login</h1>

      <div v-if="generalError" class="mb-4 text-red-600 text-sm">
        {{ generalError }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Email -->
        <div>
          <label class="block text-sm font-medium mb-1" for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-400"
            autocomplete="email"
            required
          />
          <p v-if="errors.email" class="mt-1 text-xs text-red-600">
            {{ errors.email }}
          </p>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium mb-1" for="password">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-400"
            autocomplete="current-password"
            required
          />
          <p v-if="errors.password" class="mt-1 text-xs text-red-600">
            {{ errors.password }}
          </p>
        </div>

        <!-- Remember + link -->
        <div class="flex items-center justify-between">
          <label class="flex items-center text-sm">
            <input
              type="checkbox"
              v-model="form.remember"
              class="mr-2"
            />
            Remember me
          </label>

          <RouterLink
            :to="{ name: 'register' }"
            class="text-sm text-blue-600 hover:underline"
          >
            Create an account
          </RouterLink>
        </div>

        <!-- Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex items-center justify-center border border-transparent rounded-md px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
        >
          <span v-if="!loading">Login</span>
          <span v-else>Logging in...</span>
        </button>
      </form>
    </div>
  </div>
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
