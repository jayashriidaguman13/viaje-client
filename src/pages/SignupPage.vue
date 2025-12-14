<template>
  <div class="signup-page">
    <div class="signup-background">
      <div class="container">
        <div class="signup-card-wrapper d-flex justify-content-center w-100">
          <div class="signup-card">
            <h1 class="fw-bold text-brand mb-1">Sign Up</h1>
            <p class="text-muted mb-4">Let’s get started with the basics.</p>

            <form @submit.prevent="handleSubmit" novalidate>
              <div class="row g-3">
                <div class="col-12 col-md-6">
                  <label for="firstName" class="form-label fw-semibold">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    class="form-control"
                    v-model.trim="firstName"
                    @blur="touched.firstName = true"
                    :class="{ 'is-invalid': firstNameError }"
                    placeholder="First Name"
                    required
                  />
                  <transition name="fade">
                    <div v-if="firstNameError" class="invalid-feedback">{{ firstNameError }}</div>
                  </transition>
                </div>
                <div class="col-12 col-md-6">
                  <label for="lastName" class="form-label fw-semibold">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    class="form-control"
                    v-model.trim="lastName"
                    @blur="touched.lastName = true"
                    :class="{ 'is-invalid': lastNameError }"
                    placeholder="Last Name"
                    required
                  />
                  <transition name="fade">
                    <div v-if="lastNameError" class="invalid-feedback">{{ lastNameError }}</div>
                  </transition>
                </div>
              </div>

              <div class="mt-3">
                <label for="birthday" class="form-label fw-semibold">Birthday</label>
                <input
                  id="birthday"
                  type="date"
                  class="form-control"
                  v-model="birthday"
                  @blur="touched.birthday = true"
                  :class="{ 'is-invalid': birthdayError }"
                  required
                />
                <transition name="fade">
                  <div v-if="birthdayError" class="invalid-feedback">{{ birthdayError }}</div>
                </transition>
              </div>

              <div class="mt-3">
                <label for="email" class="form-label fw-semibold">Email</label>
                <input
                  id="email"
                  type="email"
                  class="form-control"
                  v-model.trim="email"
                  @blur="touched.email = true"
                  :class="{ 'is-invalid': emailError }"
                  placeholder="you@example.com"
                  required
                />
                <transition name="fade">
                  <div v-if="emailError" class="invalid-feedback">{{ emailError }}</div>
                </transition>
              </div>

              <div class="mt-3">
                <label for="phone" class="form-label fw-semibold">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  class="form-control"
                  v-model.trim="phone"
                  @blur="touched.phone = true"
                  :class="{ 'is-invalid': phoneError }"
                  placeholder="09XXXXXXXXX"
                  required
                />
                <transition name="fade">
                  <div v-if="phoneError" class="invalid-feedback">{{ phoneError }}</div>
                </transition>
              </div>

              <div class="row g-3 mt-1">
                <div class="col-12 col-md-6 mt-3">
                  <label for="password" class="form-label fw-semibold">Password</label>
                  <input
                    id="password"
                    type="password"
                    class="form-control"
                    v-model.trim="password"
                    @blur="touched.password = true"
                    :class="{ 'is-invalid': passwordError }"
                    placeholder="Enter password"
                    required
                  />
                  <transition name="fade">
                    <div v-if="passwordError" class="invalid-feedback">{{ passwordError }}</div>
                  </transition>
                </div>
                <div class="col-12 col-md-6 mt-3">
                  <label for="confirmPassword" class="form-label fw-semibold">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    class="form-control"
                    v-model.trim="confirmPassword"
                    @blur="touched.confirmPassword = true"
                    :class="{ 'is-invalid': confirmPasswordError }"
                    placeholder="Re-enter password"
                    required
                    @keyup.enter="handleSubmit"
                  />
                  <transition name="fade">
                    <div v-if="confirmPasswordError" class="invalid-feedback">{{ confirmPasswordError }}</div>
                  </transition>
                </div>
              </div>

              <div class="d-grid mt-4">
                <button type="submit" class="btn btn-brand btn-lg fw-semibold" :disabled="!isFormValid">Sign Up</button>
              </div>

              <p class="text-center mt-3 mb-0 small">
                Have an account?
                <router-link class="text-brand fw-semibold" to="/login">(Login)</router-link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Notyf } from 'notyf'
import api from '../api'

const router = useRouter()
const notyf = new Notyf()

const firstName = ref('')
const lastName = ref('')
const birthday = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')

const touched = reactive({
  firstName: false,
  lastName: false,
  birthday: false,
  email: false,
  phone: false,
  password: false,
  confirmPassword: false
})

const validateRequired = (value, label) => !value ? `${label} is required.` : ''

const firstNameError = computed(() => touched.firstName || firstName.value ? validateRequired(firstName.value, 'First name') : '')
const lastNameError = computed(() => touched.lastName || lastName.value ? validateRequired(lastName.value, 'Last name') : '')
const birthdayError = computed(() => touched.birthday || birthday.value ? validateRequired(birthday.value, 'Birthday') : '')
const emailError = computed(() => {
  if (!touched.email && !email.value) return ''
  if (!email.value) return 'Email is required.'
  const pattern = /\S+@\S+\.\S+/
  if (!pattern.test(email.value)) return 'Please enter a valid email address.'
  return ''
})
const phoneError = computed(() => {
  if (!touched.phone && !phone.value) return ''
  if (!phone.value) return 'Phone number is required.'
  if (!/^\d+$/.test(phone.value)) return 'Phone number must be numeric.'
  if (phone.value.length !== 11) return 'Phone number must be 11 digits.'
  return ''
})
const passwordError = computed(() => {
  if (!touched.password && !password.value) return ''
  if (!password.value) return 'Password is required.'
  if (password.value.length < 6) return 'Password should be at least 6 characters.'
  return ''
})
const confirmPasswordError = computed(() => {
  if (!touched.confirmPassword && !confirmPassword.value) return ''
  if (!confirmPassword.value) return 'Please confirm your password.'
  if (confirmPassword.value !== password.value) return 'Passwords do not match.'
  return ''
})

const isFormValid = computed(() =>
  firstName.value &&
  lastName.value &&
  birthday.value &&
  email.value &&
  phone.value &&
  password.value &&
  confirmPassword.value &&
  !firstNameError.value &&
  !lastNameError.value &&
  !birthdayError.value &&
  !emailError.value &&
  !phoneError.value &&
  !passwordError.value &&
  !confirmPasswordError.value
)

const handleSubmit = async () => {
  Object.keys(touched).forEach(k => touched[k] = true)

  if (!isFormValid.value) {
    notyf.error('Please fix the errors before signing up.')
    return
  }

  try {
    await api.post('/user/register', {
      firstName: firstName.value,
      lastName: lastName.value,
      birthday: birthday.value,
      email: email.value,
      phoneNumber: phone.value,
      password: password.value,
      confirmPassword: confirmPassword.value
    })

    notyf.success('Account created successfully!')
    router.push('/login')
  } catch (err) {
    notyf.error(err.response?.data?.message || 'Sign up failed. Please try again.')
  }
}
</script>

<style scoped>
.text-brand { color: #00588e; }
.btn-brand { background-color: #00588e; border-color: #00588e; color: #ffffff; }
.btn-brand:hover, .btn-brand:focus { background-color: #00456e; border-color: #00456e; }

.signup-page { min-height: 100vh; display: flex; flex-direction: column; margin: 0; }

.signup-background {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 5rem 1rem 2rem;
  background-image: url('../assets/images/slide1.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.signup-card-wrapper { width: 100%; display: flex; justify-content: center; }

.signup-card {
  background-color: rgba(255,255,255,0.78);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255,255,255,0.7);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  width: 100%;
  max-width: 600px;
}

.form-control { padding: 0.7rem 0.9rem; font-size: 0.95rem; }

@media (max-width: 575.98px) {
  .signup-card { padding: 1.75rem; max-width: 100%; }
  h1 { font-size: 1.8rem; }
}
</style>