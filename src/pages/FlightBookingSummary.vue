<template>
  <div class="booking-summary-page">
    <div class="container py-5">
      <h1 class="page-title">Booking Summary</h1>
      <p class="page-subtitle">Review your booking before proceeding to payment</p>

      <div v-if="loading" class="loading-container">
        <p>Loading flight information...</p>
      </div>

      <div v-else-if="error" class="error-container">
        <p class="error-message">{{ error }}</p>
        <button class="btn-back" @click="goBack">Go Back</button>
      </div>

      <div v-else class="booking-card">
        <div class="flight-container">
          <FlightSegment 
            v-if="departureFlight"
            :flight="departureFlight"
          />
          <FlightSegment 
            v-if="returnFlight"
            :flight="returnFlight"
            :is-return-flight="true"
          />
        </div>

        <div class="passengers-section">
          <h3 class="passengers-title">Passengers</h3>
          <div class="passengers-list">
            <div 
              v-for="(passenger, index) in bookingStore.passengers" 
              :key="index" 
              class="passenger-item"
            >
              <div class="passenger-name">{{ passenger.firstName }} {{ passenger.lastName }}</div>
              <div class="passenger-details">
                <span class="passenger-email">{{ passenger.email }}</span>
                <span class="passenger-phone">{{ passenger.phoneNumber }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="total-section">
          <span class="total-label">Total</span>
          <span class="total-value">{{ formatPrice(totalAmount) }}</span>
        </div>
      </div>

      <div v-if="!loading && !error" class="action-buttons">
        <button class="btn-back" @click="goBack">Back</button>
        <button class="btn-continue" @click="continueToPayment">Continue</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import FlightSegment from '../components/FlightSegment.vue'
import { useBookingStore } from '../stores/booking'

const router = useRouter()
const bookingStore = useBookingStore()

const departureFlight = ref(null)
const returnFlight = ref(null)
const loading = ref(true)
const error = ref(null)

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatTime = (timeString) => {
  if (!timeString) return ''
  if (timeString.includes(':')) {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }
  return timeString
}

const transformFlightData = (flightData) => {
  if (!flightData) return null
  
  return {
    origin: flightData.origin || '',
    destination: flightData.destination || '',
    date: formatDate(flightData.departureDate),
    departureTime: formatTime(flightData.departureTime),
    arrivalTime: formatTime(flightData.arrivalTime),
    subtotal: flightData.price || 0
  }
}

// Note: We no longer need to fetch user profile since we're using passenger names from store

// Note: We no longer need to fetch flights by ID since they're stored in the booking store

// Load flights from store on component mount
onMounted(async () => {
  try {
    loading.value = true
    error.value = null

    // Check if departure flight is in store
    if (!bookingStore.departureFlight) {
      error.value = 'No departure flight found. Please select a flight first.'
      loading.value = false
      return
    }

    // Check if passengers are set
    if (!bookingStore.passengers || bookingStore.passengers.length === 0) {
      error.value = 'No passenger information found. Please enter passenger details first.'
      loading.value = false
      return
    }

    // Use flight data from store (already has user's selected dates)
    departureFlight.value = transformFlightData(bookingStore.departureFlight)

    // Use return flight from store if available
    if (bookingStore.returnFlight) {
      returnFlight.value = transformFlightData(bookingStore.returnFlight)
    }
  } catch (err) {
    console.error('Error loading flights:', err)
    error.value = err.response?.data?.message || 'Failed to load flight information'
  } finally {
    loading.value = false
  }
})

const totalAmount = computed(() => {
  let total = 0
  if (departureFlight.value) {
    total += departureFlight.value.subtotal
  }
  if (returnFlight.value) {
    total += returnFlight.value.subtotal
  }
  return total
})

const formatPrice = (price) => {
  return `PHP ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const goBack = () => {
  router.back()
}

const continueToPayment = () => {
  router.push('/booking/payment')
}
</script>

<style scoped>
.booking-summary-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 40px 0; 
}

.container {
  width: 90%;
  max-width: 1000px; 
  margin: 0 auto;
  padding: 0 15px; y */
}

.page-title {
  font-family: 'Inter', sans-serif;
  font-size: 38px;
  font-weight: 700;
  color: #00588E;
  line-height: 1.1;
  text-align: left;
}

.page-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 14px; /
  font-weight: 600;
  color: #1A1A1A;
  line-height: 1;
  text-align: left;
  margin-bottom: 2rem;
}

.booking-card {
  background: white;
  border-radius: 16px;
  /* REMOVED: width: 800px; */
  /* Replaced with max-width for fluid behavior */
  max-width: 800px;
  width: 100%; /* Important for max-width to work */
  margin: 20px auto; 
  border: 1px solid #808080;
  overflow: hidden;
}

.flight-container {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem; /* Space between segments if both are visible */
}

.passengers-section {
  margin: 0; 
  padding: 1.5rem 2rem;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
}

.passengers-title {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #1A1A1A;
  margin: 0 0 1rem 0;
}

.passengers-list {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Reduced gap slightly */
}

.passenger-item {
  font-family: 'Inter', sans-serif;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.passenger-name {
  font-size: 16px;
  font-weight: 700;
  color: #1A1A1A;
  margin-bottom: 0.5rem;
}

.passenger-details {
  display: flex;
  justify-content: space-between; 
  gap: 1rem; 
}

.passenger-email,
.passenger-phone {
  font-size: 14px;
  font-weight: 400;
  color: #666;
  white-space: nowrap; /* Prevents emails/phones from wrapping aggressively */
}

.passenger-email::before {
  content: "📧 ";
  margin-right: 0.25rem;
}

.passenger-phone::before {
  content: "📞 ";
  margin-right: 0.25rem;
}

.total-section {
  background-color: #00588E;
  color: white;
  padding: 1.25rem 2rem; 
  border-radius: 0 0 16px 16px; 
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0; 
}

.total-label {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 18px;
  line-height: 100%;
  margin-left: 0;  
}

.total-value {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 20px; 
  line-height: 100%;
  margin-right: 0; 
}

.loading-container,
.error-container {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  margin: 20px auto;
  border: 1px solid #808080;
}

.error-message {
  color: #d32f2f;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 15px;
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
  flex: 1; 
  max-width: 250px; 
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
    margin: 20px auto;
  }
  
  .flight-container {
    padding: 1.5rem;
  }

  .passengers-section {
    padding: 1.5rem;
  }
  
  .passenger-details {
    flex-direction: column;
    gap: 0.25rem;
  }

  .action-buttons {
    flex-direction: column; 
    gap: 0.75rem;   }

  .btn-back,
  .btn-continue {
    width: 100%; 
    max-width: 100%;
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 10px; 
  }
  
  .page-title {
    font-size: 1.75rem;
  }

  .page-subtitle {
    font-size: 0.85rem;
  }
  
  .flight-container {
    padding: 1rem;
  }

  .passengers-section {
    padding: 1rem;
  }

  .passengers-title {
    font-size: 16px;
  }

  .total-section {
    padding: 1rem 1.5rem; 
  }

  .total-label {
    font-size: 16px;
  }

  .total-value {
    font-size: 18px;
  }
    .passenger-item {
    padding: 0.75rem;
  }

  .passenger-name {
    font-size: 15px;
  }

  .passenger-email,
  .passenger-phone {
    font-size: 13px;
  }
}
</style>