<template>
              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Đăng ký tài khoản
              </h1>
              <form class="space-y-4 md:space-y-6" @submit.prevent="handleSubmit" novalidate>
                  <div>
                      <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Họ tên</label>
                      <input v-model="form.name" type="text" name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John Doe" required>
                      <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                  </div>
                  <div>
                      <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                      <input v-model="form.email" type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required>
                      <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
                  </div>
                  <div>
                      <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mật khẩu</label>
                      <input v-model="form.password" type="password" name="password" id="password" placeholder="Nhập mật khẩu" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                      <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
                  </div>
                  <div>
                      <label for="password_confirmation" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nhập lại mật khẩu</label>
                      <input v-model="form.password_confirmation" type="password" name="password_confirmation" id="password_confirmation" placeholder="Nhập lại mật khẩu" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                      <p v-if="errors.password_confirmation" class="mt-1 text-sm text-red-600">{{ errors.password_confirmation }}</p>
                  </div>
                  <div class="flex items-start">
                      <div class="flex items-center h-5">
                        <input v-model="form.agree_terms" id="terms" aria-describedby="terms" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required>
                      </div>
                      <div class="ml-3 text-sm">
                        <label for="terms" class="font-light text-gray-500 dark:text-gray-300">I accept the <a class="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
                      </div>
                  </div>
                  <p v-if="generalError" class="text-sm text-red-600">{{ generalError }}</p>
                  <p v-if="successMessage" class="text-sm text-green-600">{{ successMessage }}</p>
                  <button type="submit" :disabled="loading" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50">
                    {{ loading ? 'Creating account...' : 'Create an account' }}
                  </button>
                  <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                      Already have an account? <router-link :to="{name : 'login'}"  class="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</router-link>
                  </p>
              </form> 
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from '../bootstrap'

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
const successMessage = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  loading.value = true
  generalError.value = ''
  successMessage.value = ''
  errors.value = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  }

  try {
    const { data } = await axios.post('/api/register', form.value)

    successMessage.value = 'Đăng ký thành công, vui lòng đăng nhập.'
    router.push({ name: 'login' })
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
