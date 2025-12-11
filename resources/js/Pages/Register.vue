<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white rounded-lg shadow p-6">
      <h1 class="text-2xl font-semibold text-center mb-6">Register</h1>

      <div v-if="generalError" class="mb-4 text-red-600 text-sm">
        {{ generalError }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium mb-1" for="name">Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-400"
            autocomplete="name"
            required
          />
          <p v-if="errors.name" class="mt-1 text-xs text-red-600">
            {{ errors.name }}
          </p>
        </div>

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
            autocomplete="new-password"
            required
          />
          <p v-if="errors.password" class="mt-1 text-xs text-red-600">
            {{ errors.password }}
          </p>
        </div>

        <!-- Password confirmation -->
        <div>
          <label class="block text-sm font-medium mb-1" for="password_confirmation">
            Confirm Password
          </label>
          <input
            id="password_confirmation"
            v-model="form.password_confirmation"
            type="password"
            class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-400"
            autocomplete="new-password"
            required
          />
          <p v-if="errors.password_confirmation" class="mt-1 text-xs text-red-600">
            {{ errors.password_confirmation }}
          </p>
        </div>

        <!-- Link sang login -->
        <div class="flex justify-end">
          <RouterLink
            :to="{ name: 'login' }"
            class="text-sm text-blue-600 hover:underline"
          >
            Already have an account?
          </RouterLink>
        </div>

        <!-- Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex items-center justify-center border border-transparent rounded-md px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-60"
        >
          <span v-if="!loading">Register</span>
          <span v-else>Registering...</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const errors = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const generalError = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  loading.value = true
  generalError.value = ''
  errors.value = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  }

  try {
    const { data } = await axios.post('/api/register', form.value)

    const token = data.token || data.access_token
    if (!token) {
      throw new Error('No token returned from API')
    }

    localStorage.setItem('token', token)
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user))
    }

    router.push({ name: 'dashboard' })
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response

      if (status === 422 && data.errors) {
        const valErrors = data.errors
        if (valErrors.name) errors.value.name = valErrors.name[0]
        if (valErrors.email) errors.value.email = valErrors.email[0]
        if (valErrors.password) errors.value.password = valErrors.password[0]
        if (valErrors.password_confirmation) {
          errors.value.password_confirmation = valErrors.password_confirmation[0]
        }
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
