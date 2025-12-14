<template>
  <div class="flight-booking-page">
    <div class="container py-5">
      <h1 class="page-title">Passenger Details</h1>
      <p class="page-subtitle">Enter passenger information for your booking</p>

      <div class="booking-card">
        <form @submit.prevent="handleSubmit">
          <div v-for="(passenger, index) in passengers" :key="index" class="passenger-form">
            <div class="passenger-header">
              <h3 class="passenger-title">Passenger {{ index + 1 }}</h3>
              <button 
                v-if="passengers.length > 1" 
                type="button" 
                class="btn-remove" 
                @click="removePassenger(index)"
              >
                Remove
              </button>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="firstName" class="form-label">First Name <span class="required">*</span></label>
                <input
                  :id="`firstName-${index}`"
                  type="text"
                  class="form-control"
                  v-model.trim="passenger.firstName"
                  :class="{ 'is-invalid': errors[`passenger-${index}-firstName`] }"
                  placeholder="Enter first name"
                  required
                />
                <div v-if="errors[`passenger-${index}-firstName`]" class="invalid-feedback">
                  {{ errors[`passenger-${index}-firstName`] }}
                </div>
              </div>

              <div class="form-group">
                <label for="lastName" class="form-label">Last Name <span class="required">*</span></label>
                <input
                  :id="`lastName-${index}`"
                  type="text"
                  class="form-control"
                  v-model.trim="passenger.lastName"
                  :class="{ 'is-invalid': errors[`passenger-${index}-lastName`] }"
                  placeholder="Enter last name"
                  required
                />
                <div v-if="errors[`passenger-${index}-lastName`]" class="invalid-feedback">
                  {{ errors[`passenger-${index}-lastName`] }}
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="email" class="form-label">Email <span class="required">*</span></label>
                <input
                  :id="`email-${index}`"
                  type="email"
                  class="form-control"
                  v-model.trim="passenger.email"
                  :class="{ 'is-invalid': errors[`passenger-${index}-email`] }"
                  placeholder="Enter email address"
                  required
                />
                <div v-if="errors[`passenger-${index}-email`]" class="invalid-feedback">
                  {{ errors[`passenger-${index}-email`] }}
                </div>
              </div>

              <div class="form-group">
                <label for="phoneNumber" class="form-label">Phone Number <span class="required">*</span></label>
                <input
                  :id="`phoneNumber-${index}`"
                  type="tel"
                  class="form-control"
                  v-model.trim="passenger.phoneNumber"
                  :class="{ 'is-invalid': errors[`passenger-${index}-phoneNumber`] }"
                  placeholder="Enter phone number"
                  required
                />
                <div v-if="errors[`passenger-${index}-phoneNumber`]" class="invalid-feedback">
                  {{ errors[`passenger-${index}-phoneNumber`] }}
                </div>
              </div>
            </div>

            <div v-if="index < passengers.length - 1" class="divider"></div>
          </div>

          <!--<div class="add-passenger-section">
            <button 
              v-if="passengers.length < 4" 
              type="button" 
              class="btn-add-passenger" 
              @click="addPassenger"
            >
              + Add Passenger
            </button>
            <p v-else class="max-passengers-note">Maximum 4 passengers allowed per booking</p>
          </div> -->

          <div class="action-buttons">
            <button type="button" class="btn-back" @click="goBack">Back</button>
            <button type="submit" class="btn-continue">Continue to Summary</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBookingStore } from '../stores/booking'

const router = useRouter()
const route = useRoute()
const bookingStore = useBookingStore()

const errors = reactive({})

const createEmptyPassenger = () => ({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
})

const initialCountFromURL = parseInt(route.query.passengers, 10) || 1
const requiredInitialCount = Math.max(1, initialCountFromURL)

const passengers = ref(
    bookingStore.passengers.length > 0
        ? [...bookingStore.passengers]
        : Array.from({ length: requiredInitialCount }, createEmptyPassenger)
)

onMounted(() => {
    if (!bookingStore.departureFlight) {
        router.push('/')
    }
})

const removePassenger = (index) => {
    if (passengers.value.length > 1) {
        passengers.value.splice(index, 1)
        
        Object.keys(errors).forEach(key => {
            if (key.startsWith(`passenger-${index}-`)) {
                delete errors[key]
            }
        })
        const newErrors = {}
        Object.keys(errors).forEach(key => {
            const match = key.match(/passenger-(\d+)-(.+)/)
            if (match) {
                const oldIndex = parseInt(match[1])
                const field = match[2]
                if (oldIndex > index) {
                    newErrors[`passenger-${oldIndex - 1}-${field}`] = errors[key]
                } else if (oldIndex < index) {
                    newErrors[key] = errors[key]
                }
            } else {
                newErrors[key] = errors[key]
            }
        })
        Object.keys(errors).forEach(key => delete errors[key])
        Object.assign(errors, newErrors)
    }
}

const validatePassengers = () => {
    Object.keys(errors).forEach(key => delete errors[key])
    
    let isValid = true

    passengers.value.forEach((passenger, index) => {
        if (!passenger.firstName || passenger.firstName.trim() === '') {
            errors[`passenger-${index}-firstName`] = 'First name is required'
            isValid = false
        }

        if (!passenger.lastName || passenger.lastName.trim() === '') {
            errors[`passenger-${index}-lastName`] = 'Last name is required'
            isValid = false
        }

        if (!passenger.email || passenger.email.trim() === '') {
            errors[`passenger-${index}-email`] = 'Email is required'
            isValid = false
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passenger.email)) {
            errors[`passenger-${index}-email`] = 'Please enter a valid email address'
            isValid = false
        }

        if (!passenger.phoneNumber || passenger.phoneNumber.trim() === '') {
            errors[`passenger-${index}-phoneNumber`] = 'Phone number is required'
            isValid = false
        } else if (!/^[0-9]+$/.test(passenger.phoneNumber)) {
            errors[`passenger-${index}-phoneNumber`] = 'Phone number must contain only numbers'
            isValid = false
        }
    })

    return isValid
}

const handleSubmit = () => {
    if (validatePassengers()) {
        bookingStore.setPassengers(passengers.value)
        
        router.push({
            path: '/booking-summary'
        })
    }
}

const goBack = () => {
    router.back()
}
</script>

<style scoped>
.flight-booking-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-top: 40px;
  padding-bottom: 40px;
}

.container {
  width: 90%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-title {
  font-family: 'Inter', sans-serif;
  font-size: 38px;
  font-weight: 700;
  color: #00588E;
  line-height: 1;
  letter-spacing: 0;
  text-align: left;
  margin-bottom: 8px;
}

.page-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #1A1A1A;
  line-height: 1;
  letter-spacing: 0;
  text-align: left;
  margin-bottom: 2rem;
}

.booking-card {
  background: white;
  border-radius: 16px;
  width: 100%;
  margin: 0 auto;
  border: 1px solid #808080;
  padding: 2.5rem;
}

.passenger-form {
  margin-bottom: 2rem;
}

.passenger-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.passenger-title {
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #1A1A1A;
  margin: 0;
}

.btn-remove {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-remove:hover {
  background: #c82333;
  transform: translateY(-1px);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 0.5rem;
}

.required {
  color: #dc3545;
}

.form-control {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  transition: border-color 0.2s ease;
}

.form-control:focus {
  outline: none;
  border-color: #00588E;
  box-shadow: 0 0 0 3px rgba(0, 88, 142, 0.1);
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.divider {
  height: 1px;
  background-color: #e0e0e0;
  margin: 2rem 0;
}

.add-passenger-section {
  margin: 2rem 0;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.btn-add-passenger {
  background: transparent;
  color: #00588E;
  border: 2px dashed #00588E;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.btn-add-passenger:hover {
  background: #00588E;
  color: white;
  border-style: solid;
}

.max-passengers-note {
  text-align: center;
  color: #666;
  font-size: 0.875rem;
  margin: 0;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}

.btn-back,
.btn-continue {
  padding: 0.875rem 2.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #003366;
}

.btn-back {
  background: white;
  color: #003366;
}

.btn-back:hover {
  background: #f5f5f5;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 51, 102, 0.2);
}

.btn-continue {
  background: #003366;
  color: white;
  border-color: #003366;
}

.btn-continue:hover {
  background: #004488;
  border-color: #004488;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 51, 102, 0.3);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .booking-card {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn-back,
  .btn-continue {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.75rem;
  }

  .booking-card {
    padding: 1rem;
  }

  .passenger-title {
    font-size: 1.125rem;
  }
}
</style>