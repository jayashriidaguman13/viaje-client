<template>
  <div class="logout-page">
    <!-- Background -->
    <div class="logout-background d-flex align-items-center justify-content-center">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-11 col-sm-10 col-md-8 col-lg-5 col-xl-4">
            <div class="logout-card p-4 p-md-5 shadow-lg rounded-4">
              <h1 class="text-center mb-3 text-brand fw-bold">Logout</h1>
              <p class="text-muted text-center mb-4">
                Are you sure you want to log out?
              </p>

              <!-- Buttons -->
              <form @submit="handleLogout">
                <div class="d-grid gap-2">
                     <button
                        type="submit"
                        class="btn btn-brand fw-semibold py-2"
                        :disabled="isProcessing"
                    >
                        <span v-if="!isProcessing">Yes, log me out</span>
                        <span v-else>Logging out...</span>
                    </button>

                    <button
                        type="button"
                        class="btn btn-outline-secondary fw-semibold py-2"
                        :disabled="isProcessing"
                        @click="goBack"
                    >
                    Cancel and go back
                    </button>
                </div>
              </form>

              <!-- Optional note -->
              <p class="small text-muted text-center mt-3 mb-0">
                After logging out, you will need to log in again to access your bookings and profile.
              </p>
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
import { useGlobalStore } from '../stores/global.js';

const router = useRouter()
const isProcessing = ref(false)
const notyf = new Notyf()

const store = useGlobalStore(); 

const handleLogout = async (e) => {
    e.preventDefault()

    if (isProcessing.value) return
    isProcessing.value = true

    try {
        store.logout(); 

        notyf.success('Logout Successfully.')
        
        router.replace('/') 
    } catch (error) {
        console.error('Logout cleanup error:', error)
        notyf.error('Logout failed, please try again.')
    } finally {
        isProcessing.value = false
    }
}

const goBack = () => {
    router.back()
}
</script>

<style scoped>
.text-brand {
  color: #00588e;
}
.btn-brand {
  background-color: #00588e;
  border-color: #00588e;
  color: #ffffff;
}
.btn-brand:hover,
.btn-brand:focus {
  background-color: #00456e;
  border-color: #00456e;
  color: #ffffff;
}

.logout-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.logout-background {
  flex: 1;
  position: relative;
  background-image: url('../assets/images/slide1.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.logout-background::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  pointer-events: none;
}

.logout-background > .container {
  position: relative;
  z-index: 1;
}

.logout-card {
  position: relative;
  background-color: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.7);
}

@media (max-width: 575.98px) {
  .logout-card {
    padding: 1.75rem !important;
  }
  h1 {
    font-size: 1.8rem;
  }
}

.logout-background > .container {
  position: relative;
  z-index: 1;
}
</style>