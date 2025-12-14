<template>
  <div class="booking-success-page">
    <div class="container h-100 d-flex justify-content-center align-items-center">
      <div class="success-card text-center" v-if="booking">
        <div class="success-icon mb-3">
          <i class="bi bi-check-circle-fill"></i>
        </div>

        <h1 class="fw-bold text-brand mb-2">Booking Confirmed!</h1>

        <p class="text-muted mb-4">
          Your flight has been successfully booked. A copy of your booking confirmation and itinerary
          has been sent to your email address.
        </p>

        <div class="booking-details mb-4">
          <div class="detail-row">
            <span class="label">Booking Number</span>
            <span class="value">{{ bookingNumber }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Flight Number</span>
            <span class="value">{{ booking.flightNumber || (booking.flightId?.flightNumber) || 'N/A' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Route</span>
            <span class="value">
              {{ (booking.flightId?.origin || booking.origin) || 'N/A' }} → 
              {{ (booking.flightId?.destination || booking.destination) || 'N/A' }}
            </span>
          </div>
          <div class="detail-row">
            <span class="label">Departure Date</span>
            <span class="value">{{ formatBookingDate(booking.departureDate || booking.bookingDate) }}</span>
          </div>
          <div class="detail-row" v-if="booking.returnDate">
            <span class="label">Return Date</span>
            <span class="value">{{ formatBookingDate(booking.returnDate) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Passengers</span>
            <span class="value">{{ booking.passengers?.length || 0 }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Total Amount</span>
            <span class="value">₱{{ booking.totalAmount?.toLocaleString() || 'N/A' }}</span>
          </div>
        </div>

        <router-link to="/profile#bookings" class="btn view-bookings-btn">
          View My Bookings
        </router-link>

        <p class="email-note mt-3">
          Didn’t receive the email? Please check your spam folder or contact support.
        </p>
      </div>

      <div v-else-if="loading" class="text-center">
        <p>Loading booking details...</p>
      </div>
      
      <div v-else-if="error" class="text-center">
        <p class="text-danger">{{ error }}</p>
        <router-link to="/profile#bookings" class="btn view-bookings-btn mt-3">
          View My Bookings
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import api from "../api";

const route = useRoute();
const booking = ref(null);
const bookingNumber = ref("");
const loading = ref(true);
const error = ref(null);

const formatBookingDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getBookingNumber = () => {
  if (booking.value?._id) {
    return booking.value._id.substring(0, 8).toUpperCase();
  }
  const random = Math.floor(100000 + Math.random() * 900000);
  return `BK-${new Date().getFullYear()}-${random}`;
};

onMounted(async () => {
  const id = route.query.id;
  
  if (!id) {
    error.value = "No booking ID provided";
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    
    const response = await api.get("/booking/my-bookings");
    const allBookings = response.data.bookings || [];
    const foundBooking = allBookings.find(b => b._id === id);
    
    if (foundBooking) {
      booking.value = foundBooking;
      bookingNumber.value = getBookingNumber();
    } else {
      error.value = "Booking not found";
    }
    
  } catch (err) {
    console.error("Failed to fetch booking:", err);
    error.value = "Failed to load booking details";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.booking-success-page {
  min-height: 100vh;
  background: #f7faff;
  margin-top: 83px;
}

.success-card {
  background: white;
  padding: 3rem 2.5rem;
  border-radius: 18px;
  max-width: 520px;
  width: 100%;
  box-shadow: 0 12px 28px rgba(0,0,0,0.12);
}

.success-icon i {
  font-size: 3.5rem;
  color: #28a745;
}

.text-brand {
  color: #003366;
}

.text-center {
  margin-top: 6rem;
}

.booking-details {
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  padding: 1.5rem 0;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.6rem;
  font-size: 0.95rem;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.label {
  color: #666;
}

.value {
  font-weight: 600;
  color: #003366;
}

.view-bookings-btn {
  background-color: #005b96;
  color: white;
  padding: 0.6rem 1.6rem;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.3s ease, transform 0.2s ease;
}

.view-bookings-btn:hover {
  background-color: #00497a;
  transform: translateY(-1px);
}

.email-note {
  font-size: 0.85rem;
  color: #777;
}

@media (max-width: 576px) {
  .success-card {
    padding: 2.2rem 1.8rem;
  }

  .success-icon i {
    font-size: 3rem;
  }
}
</style>