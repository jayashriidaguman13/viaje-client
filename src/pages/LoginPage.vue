<template>
  <div class="login-page">
    <div class="login-background">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-11 col-sm-10 col-md-8 col-lg-5 col-xl-4">
            <div class="login-card">
              <h1 class="text-center mb-4 text-brand fw-bold">Login</h1>
              <form @submit.prevent="handleSubmit" novalidate>
                <div class="mb-3">
                  <label for="email" class="form-label fw-semibold">Email</label>
                  <input
                    id="email"
                    type="email"
                    class="form-control"
                    v-model.trim="email"
                    :class="{ 'is-invalid': emailError }"
                    placeholder="viajetraveler@email.com"
                    autocomplete="email"
                    required
                  />
                  <div v-if="emailError" class="invalid-feedback">
                    {{ emailError }}
                  </div>
                </div>
                <div class="mb-1">
                  <label for="password" class="form-label fw-semibold">Password</label>
                  <input
                    id="password"
                    type="password"
                    class="form-control"
                    v-model.trim="password"
                    :class="{ 'is-invalid': passwordError }"
                    placeholder="Type your password"
                    autocomplete="current-password"
                    required
                    @keyup.enter="handleSubmit"
                  />
                  <div v-if="passwordError" class="invalid-feedback">
                    {{ passwordError }}
                  </div>
                </div>
                <div class="d-flex justify-content-end mb-4 mt-1">
                  <button type="button" class="btn btn-link p-0 forgot-link">
                    Forgot password?
                  </button>
                </div>
                <div class="d-grid mb-3">
                  <button type="submit" class="btn btn-brand btn-lg fw-semibold">
                    LOGIN
                  </button>
                </div>
                <p class="text-center mt-2 mb-0 small">
                  Not yet a member?
                  <router-link class="text-brand fw-semibold" to="/signup">
                    (Sign up)
                  </router-link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notyf } from 'notyf'
import api from '../api'
import { useGlobalStore } from '../stores/global.js'

const router = useRouter()
const store = useGlobalStore()
const notyf = new Notyf()

const email = ref('')
const password = ref('')

const emailError = ref('')
const passwordError = ref('')

const validateEmail = (value) => {
  if (!value) return 'Email is required.'
  const pattern = /\S+@\S+\.\S+/
  if (!pattern.test(value)) return 'Please enter a valid email address.'
  return ''
}

const validatePassword = (value) => (!value ? 'Password is required.' : '')

const handleSubmit = async () => {
  emailError.value = validateEmail(email.value)
  passwordError.value = validatePassword(password.value)

  if (emailError.value || passwordError.value) {
    notyf.error('Email or Password is Incorrect.')
    return
  }

  try {
    const response = await api.post('/user/login', { email: email.value, password: password.value })

    if (response.data?.access) {
      localStorage.setItem('token', response.data.access)

      await store.getUserDetails(response.data.access, {
        email: response.data.email || email.value,
        isAdmin: response.data.isAdmin
      })

      notyf.success('Login successful!') 
      router.push('/')
    }
  } catch (error) {
    const message =
      error.response?.data?.error || error.response?.data?.message || 'Login failed. Please try again.'
    notyf.error(message)
  }
}

</script>

<style scoped>
.text-brand { 
  color: #005b96; 
}

.btn-brand { 
  background-color: #005b96; 
  border-color: #005b96; 
  color: #ffffff; 
}

.btn-brand:hover, 
.btn-brand:focus { 
  background-color: #004775; 
  border-color: #004775; 
}

.login-page { 
  min-height: 100vh; 
  display: flex; 
  flex-direction: column; 
}

.login-background {
  flex: 1; 
  position: relative; 
  display: flex; 
  justify-content: center; 
  align-items: center;
  padding: 0; 
  margin-top: 0;
  background-image: url('../assets/images/slide1.jpg');
  background-size: cover; 
  background-position: center; 
  background-repeat: no-repeat;
}

.login-background .container { 
  position: relative; 
  z-index: 1; 
  width: 100%; 
  max-width: 1200px; 
}

.login-card {
  background-color: rgba(255, 255, 255, 0.78); 
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.7); 
  padding: 2rem; 
  margin-top: 5rem;
  border-radius: 12px;
  width: 100%; 
  max-width: 400px; 
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.forgot-link { 
  font-size: 0.9rem; 
  text-decoration: none; 
  color: #005b96; 
}

.forgot-link:hover { 
  text-decoration: underline; 
}

.form-control { 
  padding: 0.75rem 0.9rem; 
  font-size: 0.95rem; 
}

@media (max-width: 575.98px) {
  .login-card { 
    padding: 1.5rem; 
  }
  
  h1 { 
    font-size: 1.8rem; 
  }
}
</style>
